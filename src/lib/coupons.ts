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
 * Validates a coupon for one buyer against one subtotal and returns the discount it is
 * worth. Usage counters are read here, so callers that go on to reserve the coupon must
 * run inside the serializable transaction that also creates the redemption - that is
 * what stops two concurrent checkouts from both taking the last available use.
 */
export async function evaluateCoupon(
  client: CouponClient,
  input: { code: string; userId: string; subtotalHalalas: number; now?: Date },
): Promise<{ coupon: Coupon; discountHalalas: number }> {
  const code = normalizeCouponCode(input.code)
  if (!code) throw new CouponError('NOT_FOUND')

  const coupon = await client.coupon.findUnique({ where: { code } })
  if (!coupon) throw new CouponError('NOT_FOUND')

  const now = input.now ?? new Date()
  if (!coupon.isActive) throw new CouponError('INACTIVE')
  if (coupon.startsAt > now) throw new CouponError('NOT_STARTED')
  if (coupon.endsAt <= now) throw new CouponError('EXPIRED')
  if (coupon.minBookingAmount != null && input.subtotalHalalas < toHalalas(coupon.minBookingAmount)) {
    throw new CouponError('BELOW_MINIMUM')
  }

  if (coupon.maxRedemptions != null) {
    const used = await client.couponRedemption.count({
      where: { couponId: coupon.id, status: { in: [...ACTIVE_REDEMPTION_STATUSES] } },
    })
    if (used >= coupon.maxRedemptions) throw new CouponError('GLOBAL_LIMIT_REACHED')
  }

  if (coupon.maxPerUser != null) {
    const usedByUser = await client.couponRedemption.count({
      where: { couponId: coupon.id, userId: input.userId, status: { in: [...ACTIVE_REDEMPTION_STATUSES] } },
    })
    if (usedByUser >= coupon.maxPerUser) throw new CouponError('USER_LIMIT_REACHED')
  }

  const discountHalalas = computeCouponDiscountHalalas(coupon, input.subtotalHalalas)
  // StreamPay cannot process a zero-value charge, so a coupon that wipes out the whole
  // total has to be refused outright rather than silently reduced to a token amount.
  if (discountHalalas >= input.subtotalHalalas) throw new CouponError('COVERS_FULL_AMOUNT')

  return { coupon, discountHalalas }
}

/** Frees the usage slot held by an order's redemption when that order never gets paid. */
export async function releaseCouponRedemption(client: CouponClient, paymentOrderId: string) {
  await client.couponRedemption.updateMany({
    where: { paymentOrderId, status: 'RESERVED' },
    data: { status: 'RELEASED', releasedAt: new Date() },
  })
}

/** Turns the reservation into a permanent use once the order is actually paid. */
export async function confirmCouponRedemption(client: CouponClient, paymentOrderId: string) {
  await client.couponRedemption.updateMany({
    where: { paymentOrderId, status: 'RESERVED' },
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
