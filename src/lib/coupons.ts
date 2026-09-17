import { randomUUID } from 'node:crypto'

import type { Coupon, CouponDiscountType, Prisma } from '@/generated/prisma'

/**
 * Every coupon amount in this module is an integer number of halalas. The payment
 * gateway is charged in halalas, so keeping the discount integral end to end is what
 * guarantees the amount the buyer is shown, the amount stored on the bookings and the
 * amount StreamPay collects can never drift apart by a rounding cent.
 */

export const COUPON_CODE_PATTERN = /^[A-Z0-9][A-Z0-9_-]{2,31}$/

/** A redemption occupies a usage slot while it is reserved or confirmed. */
export const ACTIVE_REDEMPTION_STATUSES = ['RESERVED', 'CONFIRMED'] as const

export type CouponRejectionCode =
  | 'NOT_FOUND'
  | 'INACTIVE'
  | 'NOT_STARTED'
  | 'EXPIRED'
  | 'BELOW_MINIMUM'
  | 'GLOBAL_LIMIT_REACHED'
  | 'USER_LIMIT_REACHED'
  | 'COVERS_FULL_AMOUNT'

export const COUPON_REJECTION_MESSAGES: Record<CouponRejectionCode, string> = {
  NOT_FOUND: 'رمز الكوبون غير صحيح. تأكد من كتابته كما وصلك.',
  INACTIVE: 'هذا الكوبون غير مفعل حاليًا.',
  NOT_STARTED: 'لم يبدأ العمل بهذا الكوبون بعد.',
  EXPIRED: 'انتهت صلاحية هذا الكوبون.',
  BELOW_MINIMUM: 'قيمة الحجز أقل من الحد الأدنى المطلوب لاستخدام هذا الكوبون.',
  GLOBAL_LIMIT_REACHED: 'اكتمل عدد مرات استخدام هذا الكوبون.',
  USER_LIMIT_REACHED: 'لقد استخدمت هذا الكوبون بالفعل بالحد المسموح لحسابك.',
  COVERS_FULL_AMOUNT: 'هذا الكوبون يغطي كامل قيمة الحجز، وتعذر إنشاء عملية دفع بقيمة صفر. تواصل مع الدعم لإتمام الحجز.',
}

export class CouponError extends Error {
  constructor(readonly code: CouponRejectionCode) {
    super(COUPON_REJECTION_MESSAGES[code])
  }
}

export function normalizeCouponCode(value: unknown) {
  return typeof value === 'string' ? value.trim().toUpperCase().slice(0, 32) : ''
}

export function toHalalas(amount: number) {
  return Math.round(amount * 100)
}

export function fromHalalas(halalas: number) {
  return Math.round(halalas) / 100
}

type DiscountRules = {
  discountType: CouponDiscountType
  discountValue: number
  maxDiscountAmount: number | null
}

/**
 * The discount a coupon is worth against a subtotal, floored to whole halalas so we
 * never round a discount *up* past what the coupon actually grants, and clamped to the
 * subtotal so a coupon can never produce a negative charge.
 */
export function computeCouponDiscountHalalas(coupon: DiscountRules, subtotalHalalas: number) {
  if (subtotalHalalas <= 0) return 0
  const raw = coupon.discountType === 'PERCENTAGE'
    ? Math.floor(subtotalHalalas * coupon.discountValue / 100)
    : toHalalas(coupon.discountValue)
  const capped = coupon.discountType === 'PERCENTAGE' && coupon.maxDiscountAmount != null
    ? Math.min(raw, toHalalas(coupon.maxDiscountAmount))
    : raw
  return Math.max(0, Math.min(capped, subtotalHalalas))
}

/**
 * Splits a discount across the bookings of one order proportionally to each booking's
 * share of the subtotal, using largest-remainder so the parts sum to exactly the
 * discount. Without this, per-booking totals would not add up to the amount charged.
 */
export function allocateDiscountHalalas(subtotals: number[], discountHalalas: number) {
  const total = subtotals.reduce((sum, value) => sum + value, 0)
  if (discountHalalas <= 0 || total <= 0) return subtotals.map(() => 0)
  if (discountHalalas >= total) return [...subtotals]

  const exact = subtotals.map(subtotal => subtotal * discountHalalas / total)
  const allocation = exact.map(Math.floor)
  let remainder = discountHalalas - allocation.reduce((sum, value) => sum + value, 0)
  const order = exact
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((left, right) => right.fraction - left.fraction || left.index - right.index)

  for (let step = 0; remainder > 0 && step < order.length; step += 1) {
    const { index } = order[step]
    if (allocation[index] >= subtotals[index]) continue
    allocation[index] += 1
    remainder -= 1
  }
  return allocation
}

type CouponClient = Prisma.TransactionClient

/**
 * Loads a coupon and checks everything that does not depend on the booking total. One
 * round trip, and safe to run before the booking transaction opens - which is the point.
 * That transaction is serializable and holds an advisory lock on the space, so every
 * query added inside it is spent from the checkout's time budget.
 */
export async function loadRedeemableCoupon(client: CouponClient, code: string, now = new Date()) {
  const normalized = normalizeCouponCode(code)
  if (!normalized) throw new CouponError('NOT_FOUND')

  const coupon = await client.coupon.findUnique({ where: { code: normalized } })
  if (!coupon) throw new CouponError('NOT_FOUND')
  if (!coupon.isActive) throw new CouponError('INACTIVE')
  if (coupon.startsAt > now) throw new CouponError('NOT_STARTED')
  if (coupon.endsAt <= now) throw new CouponError('EXPIRED')
  return coupon
}

/** The half of the decision that depends on the total. Pure - no database access. */
export function priceCouponForSubtotal(coupon: Coupon, subtotalHalalas: number) {
  if (coupon.minBookingAmount != null && subtotalHalalas < toHalalas(coupon.minBookingAmount)) {
    throw new CouponError('BELOW_MINIMUM')
  }
  const discountHalalas = computeCouponDiscountHalalas(coupon, subtotalHalalas)
  // StreamPay cannot process a zero-value charge, so a coupon that wipes out the whole
  // total has to be refused outright rather than silently reduced to a token amount.
  if (discountHalalas >= subtotalHalalas) throw new CouponError('COVERS_FULL_AMOUNT')
  return discountHalalas
}

/**
 * A use counts once it is paid, or while its checkout is still inside the payment window.
 * A reservation whose window has closed stops counting straight away, whether or not the
 * expiry job has run yet. Otherwise every abandoned checkout would hold a slot until
 * something released it, and a coupon limited to three uses dies after three buyers
 * open the payment page and walk away.
 */
function activeRedemptionWhere(couponId: string, now: Date, userId?: string): Prisma.CouponRedemptionWhereInput {
  return {
    couponId,
    ...(userId ? { userId } : {}),
    OR: [
      { status: 'CONFIRMED' },
      {
        status: 'RESERVED',
        paymentOrder: { status: { in: ['PENDING', 'CHECKOUT_CREATED'] }, expiresAt: { gt: now } },
      },
    ],
  }
}

async function assertWithinUsageLimits(client: CouponClient, coupon: Coupon, userId: string, now: Date) {
  if (coupon.maxRedemptions != null) {
    const used = await client.couponRedemption.count({ where: activeRedemptionWhere(coupon.id, now) })
    if (used >= coupon.maxRedemptions) throw new CouponError('GLOBAL_LIMIT_REACHED')
  }
  if (coupon.maxPerUser != null) {
    const usedByUser = await client.couponRedemption.count({ where: activeRedemptionWhere(coupon.id, now, userId) })
    if (usedByUser >= coupon.maxPerUser) throw new CouponError('USER_LIMIT_REACHED')
  }
}

/**
 * Full check including usage counters, for the preview the buyer sees before checkout.
 * The booking path deliberately does not use this: it reserves the coupon instead, which
 * enforces the same limits atomically in a single statement.
 */
export async function evaluateCoupon(
  client: CouponClient,
  input: { code: string; userId: string; subtotalHalalas: number; now?: Date },
): Promise<{ coupon: Coupon; discountHalalas: number }> {
  const now = input.now ?? new Date()
  const coupon = await loadRedeemableCoupon(client, input.code, now)
  if (coupon.minBookingAmount != null && input.subtotalHalalas < toHalalas(coupon.minBookingAmount)) {
    throw new CouponError('BELOW_MINIMUM')
  }
  await assertWithinUsageLimits(client, coupon, input.userId, now)
  return { coupon, discountHalalas: priceCouponForSubtotal(coupon, input.subtotalHalalas) }
}

/**
 * Claims one use of the coupon in a single statement: the row is inserted only if the
 * usage counts are still under their limits, so the check and the claim cannot be pulled
 * apart by a concurrent checkout. Returns false when a limit is already full.
 *
 * Deliberately raw SQL rather than count-then-create. The two extra round trips that
 * count-then-create costs inside the booking transaction were enough to exhaust its
 * timeout against a distant database and fail the entire booking.
 *
 * The booking transaction runs at READ COMMITTED, so the per-coupon advisory lock is what
 * stops two checkouts for different spaces from both counting the same last free slot:
 * the second waits here until the first commits, then its INSERT sees that row. The lock
 * uses the two-key form, whose key space never overlaps the one-key space locks.
 */
export async function reserveCouponRedemption(
  client: CouponClient,
  input: {
    coupon: Pick<Coupon, 'id' | 'maxRedemptions' | 'maxPerUser'>
    userId: string
    paymentOrderId: string
    discountHalalas: number
  },
) {
  const { coupon, userId, paymentOrderId, discountHalalas } = input
  const globalLimit = coupon.maxRedemptions
  const perUserLimit = coupon.maxPerUser

  if (globalLimit != null || perUserLimit != null) {
    await client.$executeRaw`SELECT pg_advisory_xact_lock(${COUPON_LOCK_NAMESPACE}::int, hashtext(${coupon.id}))`
  }

  // Mirrors activeRedemptionWhere: confirmed uses, plus reservations still inside their window.
  const inserted = await client.$executeRaw`
    INSERT INTO "CouponRedemption" ("id", "status", "discountHalalas", "couponId", "userId", "paymentOrderId", "createdAt", "updatedAt")
    SELECT ${randomUUID()}, 'RESERVED'::"CouponRedemptionStatus", ${discountHalalas}::int, ${coupon.id}, ${userId}, ${paymentOrderId}, now(), now()
    WHERE (${globalLimit}::int IS NULL OR (
            SELECT count(*) FROM "CouponRedemption" r
            JOIN "PaymentOrder" o ON o."id" = r."paymentOrderId"
            WHERE r."couponId" = ${coupon.id}
              AND (r."status" = 'CONFIRMED'
                OR (r."status" = 'RESERVED' AND o."status" IN ('PENDING', 'CHECKOUT_CREATED') AND o."expiresAt" > now()))
          ) < ${globalLimit}::int)
      AND (${perUserLimit}::int IS NULL OR (
            SELECT count(*) FROM "CouponRedemption" r
            JOIN "PaymentOrder" o ON o."id" = r."paymentOrderId"
            WHERE r."couponId" = ${coupon.id} AND r."userId" = ${userId}
              AND (r."status" = 'CONFIRMED'
                OR (r."status" = 'RESERVED' AND o."status" IN ('PENDING', 'CHECKOUT_CREATED') AND o."expiresAt" > now()))
          ) < ${perUserLimit}::int)
  `
  return inserted > 0
}

/** Namespace for the two-key advisory lock taken while reserving a limited coupon. */
const COUPON_LOCK_NAMESPACE = 7201

/**
 * Arguments for freeing the usage slot an unpaid order still holds. Exposed separately so
 * a caller can drop the release into a batched `$transaction([...])` instead of paying for
 * an interactive transaction just to run one update.
 */
export function releaseCouponRedemptionArgs(paymentOrderId: string) {
  return {
    where: { paymentOrderId, status: 'RESERVED' as const },
    data: { status: 'RELEASED' as const, releasedAt: new Date() },
  }
}

/** Frees the usage slot held by an order's redemption when that order never gets paid. */
export async function releaseCouponRedemption(client: CouponClient, paymentOrderId: string) {
  await client.couponRedemption.updateMany(releaseCouponRedemptionArgs(paymentOrderId))
}

/**
 * Turns the reservation into a permanent use once the order is actually paid. A released
 * reservation is confirmed too: that is a payment which landed after the window closed,
 * and the discount was part of the amount the buyer paid, so the use has to count.
 */
export async function confirmCouponRedemption(client: CouponClient, paymentOrderId: string) {
  await client.couponRedemption.updateMany({
    where: { paymentOrderId, status: { in: ['RESERVED', 'RELEASED'] } },
    data: { status: 'CONFIRMED', confirmedAt: new Date() },
  })
}

export function describeCouponValue(coupon: Pick<Coupon, 'discountType' | 'discountValue' | 'maxDiscountAmount'>) {
  if (coupon.discountType === 'FIXED') return `${coupon.discountValue.toLocaleString('en-US')} ر.س`
  const base = `${coupon.discountValue.toLocaleString('en-US')}%`
  return coupon.maxDiscountAmount != null
    ? `${base} (بحد أقصى ${coupon.maxDiscountAmount.toLocaleString('en-US')} ر.س)`
    : base
}
