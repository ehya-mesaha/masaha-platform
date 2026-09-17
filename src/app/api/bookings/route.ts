import { randomUUID } from 'node:crypto'

import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { durationHours, generateProgramSessions, getSpaceAvailability, sessionsFromDates, toSession } from '@/lib/availability'
import { LEGAL_VERSION } from '@/lib/legal'
import { assertStreamPayConfigured, StreamPayError } from '@/lib/streampay/client'
import { createCheckoutForOrder } from '@/lib/streampay/service'
import { allocateDiscountHalalas, CouponError, fromHalalas, loadRedeemableCoupon, normalizeCouponCode, priceCouponForSubtotal, reserveCouponRedemption, toHalalas } from '@/lib/coupons'

// Booking creation holds a database transaction and then talks to StreamPay; give it room.
export const maxDuration = 60

/** StreamPay refuses prices below 1 SAR, so a smaller charge could never reach checkout. */
const MIN_CHARGE_HALALAS = 100

type SelectedService = {
  configId: string
  quantity?: number
  matrix?: { bwSingle?: number; bwDouble?: number; colorSingle?: number; colorDouble?: number }
}

const PRINT_MATRIX_LABELS: Record<string, string> = {
  bwSingle: 'أبيض وأسود - وجه واحد',
  bwDouble: 'أبيض وأسود - وجهين',
  colorSingle: 'ملون - وجه واحد',
  colorDouble: 'ملون - وجهين',
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const role = searchParams.get('role')

    const commonInclude = {
      unit: { select: { id: true, label: true } },
      services: true,
      program: true,
    } satisfies Prisma.BookingInclude

    if (user.role === 'BUYER' || role === 'buyer') {
      const bookings = await prisma.booking.findMany({
        where: { buyerId: user.id as string },
        include: {
          ...commonInclude,
          space: { include: { type: true, images: { take: 1, orderBy: { order: 'asc' } } } },
        },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json({ bookings })
    }

    if (user.role === 'SELLER' || role === 'seller') {
      const bookings = await prisma.booking.findMany({
        where: {
          space: { sellerId: user.id as string },
          status: { in: ['CONFIRMED', 'CANCELLED_BY_BUYER', 'CANCELLED_BY_SELLER', 'COMPLETED'] },
        },
        include: {
          ...commonInclude,
          space: { include: { type: true } },
          buyer: { select: { name: true, email: true, phone: true } },
        },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json({ bookings })
    }

    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'حدث خطأ أثناء تحميل الحجوزات' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'BUYER') {
      return NextResponse.json({ error: 'يجب تسجيل الدخول كطالب مساحة' }, { status: 401 })
    }

    assertStreamPayConfigured()
    const body = await req.json()
    if (body.termsAccepted !== true || body.termsVersion !== LEGAL_VERSION) {
      return NextResponse.json({ error: 'يجب قراءة الوثائق القانونية والموافقة على نسختها الحالية قبل إتمام الحجز.' }, { status: 400 })
    }
    const spaceId = typeof body.spaceId === 'string' ? body.spaceId : ''
    const persons = body.persons ? Number(body.persons) : null
    const notes = typeof body.notes === 'string' ? body.notes.trim().slice(0, 2000) : ''
    const requesterIdNumber = typeof body.requesterIdNumber === 'string' ? body.requesterIdNumber.trim().slice(0, 100) : ''
    const checkoutKey = typeof body.checkoutKey === 'string' ? body.checkoutKey.trim().toLowerCase() : ''
    const couponCode = normalizeCouponCode(body.couponCode)
    const selectedServices: SelectedService[] = Array.isArray(body.services) ? body.services : []
    const servicesByDate: Record<string, SelectedService[]> = body.servicesByDate && typeof body.servicesByDate === 'object' ? body.servicesByDate : {}
    if (!spaceId || !body.startTime || !body.endTime || !requesterIdNumber || !notes || !isUuid(checkoutKey)) {
      return NextResponse.json({ error: 'يرجى إدخال جميع البيانات المطلوبة' }, { status: 400 })
    }

    const existingOrder = await prisma.paymentOrder.findUnique({ where: { checkoutKey } })
    if (existingOrder) {
      if (
        existingOrder.buyerId === user.id
        && existingOrder.status === 'CHECKOUT_CREATED'
        && existingOrder.checkoutUrl
        && existingOrder.expiresAt > new Date()
      ) {
        return NextResponse.json({
          checkoutUrl: existingOrder.checkoutUrl,
          checkoutToken: existingOrder.checkoutToken,
          expiresAt: existingOrder.expiresAt,
        })
      }
      return NextResponse.json({ error: 'تم إرسال طلب الدفع بالفعل. أعد فتح نافذة الحجز للمحاولة من جديد.' }, { status: 409 })
    }

    let sessions
    try {
      sessions = body.mode === 'dates'
        ? sessionsFromDates(Array.isArray(body.dates) ? body.dates.filter((date: unknown) => typeof date === 'string') : [], body.startTime, body.endTime)
        : body.mode === 'program'
          ? generateProgramSessions({
              startDate: body.startDate,
              endDate: body.endDate,
              weekdays: Array.isArray(body.weekdays) ? body.weekdays.map(Number) : [],
              startTime: body.startTime,
              endTime: body.endTime,
            })
          : [toSession(body.date, body.startTime, body.endTime)]
    } catch {
      return NextResponse.json({ error: 'التواريخ أو أوقات الجلسات غير صحيحة' }, { status: 400 })
    }

    if (sessions.length === 0) {
      return NextResponse.json({ error: 'لم ينتج عن البرنامج أي جلسات' }, { status: 400 })
    }

    // Resolved before the transaction opens. Everything inside that transaction runs while
    // an advisory lock on the space is held, so a lookup done in here costs nothing there.
    let coupon = null
    if (couponCode) {
      try {
        coupon = await loadRedeemableCoupon(prisma, couponCode)
      } catch (error) {
        if (error instanceof CouponError) return NextResponse.json({ error: error.message }, { status: 400 })
        throw error
      }
    }

    const result = await prisma.$transaction(async tx => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${spaceId}))`

      const space = await tx.space.findUnique({
        where: { id: spaceId },
        include: {
          units: { where: { isActive: true }, orderBy: { label: 'asc' } },
          pricingTiers: { orderBy: { minHours: 'desc' } },
          serviceConfigs: {
            where: { isEnabled: true },
            include: { catalog: true },
          },
        },
      })

      if (!space || space.status !== 'APPROVED') throw new BookingError('المساحة غير متاحة', 400)
      if (persons && space.capacity && persons > space.capacity) {
        throw new BookingError('عدد الأشخاص أكبر من السعة المتاحة للمساحة', 400)
      }
      const now = new Date()
      if (sessions.some(session => session.startAt <= now)) {
        throw new BookingError('اختر موعدًا مستقبليًا لم يبدأ بعد', 400)
      }
      if (space.minBookingHours && sessions.some(session => durationHours(session.startAt, session.endAt) < space.minBookingHours!)) {
        throw new BookingError(`الحد الأدنى للحجز ${space.minBookingHours} ساعة`, 400)
      }
      if (space.maxAdvanceBookingDays) {
        const latestAllowed = new Date(now.getTime() + space.maxAdvanceBookingDays * 86_400_000)
        if (sessions.some(session => session.startAt > latestAllowed)) {
          throw new BookingError(`يمكن الحجز حتى ${space.maxAdvanceBookingDays} يومًا مقدمًا`, 400)
        }
      }

      if (space.units.length === 0) {
        await tx.spaceUnit.createMany({
          data: Array.from({ length: Math.max(1, space.identicalUnitsCount) }, (_, index) => ({
            spaceId,
            label: `قاعة ${101 + index}`,
          })),
          skipDuplicates: true,
        })
      }

      const availability = await getSpaceAvailability(tx, spaceId, sessions)
      if (!availability.fullyAvailable) {
        throw new BookingError(`المساحة متاحة في ${availability.availableSessions} من ${availability.totalSessions} مواعيد فقط`, 409)
      }

      const totalHours = sessions.reduce((total, session) => total + durationHours(session.startAt, session.endAt), 0)
      const basePrice = roundMoney(space.price * totalHours)
      const tierDiscount = space.pricingTiers.find(tier => totalHours >= tier.minHours)?.discountPercent ?? 0
      const recurringDiscount = sessions.length > 1 ? 5 : 0
      const discountPercent = Math.max(tierDiscount, recurringDiscount)
      const discountAmount = roundMoney(basePrice * discountPercent / 100)

      const allowedConfigs = new Map(space.serviceConfigs.map(config => [config.id, config]))

      // discountPercent is computed off scalar totalHours (volume-based), not off any
      // weekday-pattern assumption, so it already generalizes correctly to an arbitrary
      // set of dates - no special-casing needed for mode === 'dates'.
      function buildServiceLines(selections: SelectedService[], hours: number) {
        return selections.flatMap(selection => {
          const config = allowedConfigs.get(selection.configId)
          if (!config) return []

          if (config.catalog.pricingType === 'PRINT_MATRIX') {
            const matrixConfig = (config.config as Record<string, unknown> | null) ?? (config.catalog.defaultConfig as Record<string, unknown> | null) ?? {}
            const requested = selection.matrix || {}
            return (['bwSingle', 'bwDouble', 'colorSingle', 'colorDouble'] as const).flatMap(key => {
              const quantity = Math.max(0, Math.min(999, Number(requested[key]) || 0))
              const unitPrice = Number(matrixConfig[key]) || 0
              if (quantity <= 0 || unitPrice <= 0) return []
              return [{
                configId: config.id,
                name: `${config.catalog.name} - ${PRINT_MATRIX_LABELS[key]}`,
                quantity,
                unitPrice,
                lineTotal: roundMoney(unitPrice * quantity),
              }]
            })
          }

          const quantity = Math.max(1, Math.min(999, Number(selection.quantity) || 1))
          const unitPrice = config.price ?? config.catalog.defaultPrice ?? 0
          let effectiveQuantity = quantity
          if (config.catalog.pricingType === 'PER_PERSON') effectiveQuantity = Math.max(1, persons ?? quantity)
          if (config.catalog.pricingType === 'PER_HOUR') effectiveQuantity = quantity * hours
          return [{
            configId: config.id,
            name: config.catalog.name,
            quantity: Math.ceil(effectiveQuantity),
            unitPrice,
            lineTotal: roundMoney(unitPrice * effectiveQuantity),
          }]
        })
      }

      const sessionServiceLines = availability.allocations.map((allocation, index) => {
        const sessionHours = durationHours(allocation.session.startAt, allocation.session.endAt)
        const selections = body.mode === 'dates'
          ? (servicesByDate[allocation.session.date] || [])
          : (index === 0 ? selectedServices : [])
        return buildServiceLines(selections, sessionHours)
      })
      const servicesTotal = roundMoney(sessionServiceLines.reduce((sum, lines) => sum + lines.reduce((lineSum, line) => lineSum + line.lineTotal, 0), 0))

      // Each session is priced and rounded on its own, then the order subtotal is the sum of
      // those lines. Deriving the charge from the same numbers stored on the bookings is what
      // keeps sum(booking.grandTotal) exactly equal to the amount sent to StreamPay.
      const sessionPricing = availability.allocations.map((allocation, index) => {
        const sessionHours = durationHours(allocation.session.startAt, allocation.session.endAt)
        const sessionBasePrice = roundMoney(space.price * sessionHours)
        const sessionDiscount = roundMoney(sessionBasePrice * discountPercent / 100)
        const lines = sessionServiceLines[index]
        const sessionServicesTotal = roundMoney(lines.reduce((sum, line) => sum + line.lineTotal, 0))
        return {
          sessionHours,
          sessionBasePrice,
          sessionDiscount,
          lines,
          sessionServicesTotal,
          subtotalHalalas: toHalalas(sessionBasePrice - sessionDiscount + sessionServicesTotal),
        }
      })
      const subtotalHalalas = sessionPricing.reduce((sum, session) => sum + session.subtotalHalalas, 0)
      if (!Number.isSafeInteger(subtotalHalalas) || subtotalHalalas < 1) {
        throw new BookingError('قيمة الحجز غير صالحة للدفع', 400)
      }

      // Pricing the coupon needs the subtotal, so it happens here - but it is pure
      // arithmetic against the already-loaded coupon and costs no round trip.
      let couponDiscountHalalas = 0
      if (coupon) {
        try {
          couponDiscountHalalas = priceCouponForSubtotal(coupon, subtotalHalalas)
        } catch (error) {
          if (error instanceof CouponError) throw new BookingError(error.message, 400)
          throw error
        }
      }
      const couponAllocation = allocateDiscountHalalas(sessionPricing.map(session => session.subtotalHalalas), couponDiscountHalalas)
      const amountHalalas = subtotalHalalas - couponDiscountHalalas
      if (amountHalalas < MIN_CHARGE_HALALAS) {
        throw new BookingError('المبلغ المطلوب بعد الخصم أقل من الحد الأدنى للدفع الإلكتروني (1 ر.س).', 400)
      }

      const paymentOrder = await tx.paymentOrder.create({
        data: {
          checkoutKey,
          buyerId: user.id as string,
          amountHalalas,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        },
      })
      if (coupon) {
        // One statement that both checks the usage limits and claims the slot, so two
        // checkouts racing for the last use cannot both succeed.
        const reserved = await reserveCouponRedemption(tx, {
          coupon,
          userId: user.id as string,
          paymentOrderId: paymentOrder.id,
          discountHalalas: couponDiscountHalalas,
        })
        if (!reserved) {
          throw new BookingError(
            coupon.maxPerUser != null
              ? 'لقد استخدمت هذا الكوبون بالفعل بالحد المسموح لحسابك.'
              : 'اكتمل عدد مرات استخدام هذا الكوبون.',
            409,
          )
        }
      }

      const program = sessions.length > 1
        ? await tx.bookingProgram.create({
            data: {
              startDate: sessions[0].startAt,
              endDate: sessions[sessions.length - 1].endAt,
              weekdays: Array.from(new Set(sessions.map(session => new Date(`${session.date}T12:00:00+03:00`).getUTCDay()))),
              sessionStart: body.startTime,
              sessionEnd: body.endTime,
              sessionCount: sessions.length,
              totalHours,
              discountPercent,
            },
          })
        : null

      // One statement for every booking and one for every service line, rather than a
      // round trip per session. A long programme used to spend its whole transaction
      // budget here, and on a distant database that expired the transaction outright.
      const bookingRows = availability.allocations.map((allocation, index) => {
        const session = sessionPricing[index]
        return {
          id: randomUUID(),
          spaceId,
          unitId: allocation.unitId,
          buyerId: user.id as string,
          programId: program?.id ?? null,
          date: new Date(`${allocation.session.date}T00:00:00+03:00`),
          startTime: allocation.session.startAt,
          endTime: allocation.session.endAt,
          persons,
          notes: notes || null,
          requesterIdNumber,
          status: 'PENDING_PAYMENT' as const,
          paymentOrderId: paymentOrder.id,
          termsAcceptedAt: new Date(),
          termsVersion: LEGAL_VERSION,
          totalHours: session.sessionHours,
          basePrice: session.sessionBasePrice,
          discountAmount: session.sessionDiscount,
          couponCode: coupon?.code ?? null,
          couponDiscount: fromHalalas(couponAllocation[index]),
          servicesTotal: session.sessionServicesTotal,
          grandTotal: fromHalalas(session.subtotalHalalas - couponAllocation[index]),
        }
      })
      await tx.booking.createMany({ data: bookingRows })

      const serviceRows = sessionPricing.flatMap((session, index) =>
        session.lines.map(line => ({ ...line, bookingId: bookingRows[index].id })),
      )
      if (serviceRows.length > 0) {
        await tx.bookingService.createMany({ data: serviceRows })
      }

      return {
        bookingCount: bookingRows.length,
        program,
        paymentOrder,
        pricing: {
          totalHours,
          basePrice,
          discountPercent,
          discountAmount,
          servicesTotal,
          subtotal: fromHalalas(subtotalHalalas),
          couponCode: coupon?.code ?? null,
          couponDiscount: fromHalalas(couponDiscountHalalas),
          grandTotal: fromHalalas(amountHalalas),
        },
      }
    }, {
      // READ COMMITTED, with the advisory lock above doing the serializing. Under SERIALIZABLE
      // the snapshot is taken by the lock statement itself, before the lock is granted, so a
      // checkout that queued behind another for the same space woke up on stale data and was
      // aborted with a serialization failure - reported to the buyer as "just booked by
      // someone else" even when the two bookings never overlapped. Here every statement after
      // the lock sees what the previous holder committed. The coupon slot has its own lock.
      isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      // Far above Prisma's defaults (maxWait 2s, timeout 5s). The work inside is now a fixed
      // handful of round trips rather than one per session, but the budget stays generous:
      // when this expires nothing is written and the buyer simply loses the booking, which
      // is exactly what happened to coupon checkouts against a database a region away.
      maxWait: 15_000,
      timeout: 60_000,
    })

    const checkout = await createCheckoutForOrder(result.paymentOrder.id)
    return NextResponse.json({
      checkoutUrl: checkout.checkoutUrl,
      checkoutToken: checkout.checkoutToken,
      expiresAt: result.paymentOrder.expiresAt,
      pricing: result.pricing,
    }, { status: 201 })
  } catch (error) {
    if (error instanceof BookingError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (isPrismaCode(error, 'P2002') || isPrismaCode(error, 'P2034')) {
      return NextResponse.json({ error: 'تم حجز الموعد للتو من مستخدم آخر. اختر موعدًا مختلفًا.' }, { status: 409 })
    }
    // P2028 is the transaction running out of time, usually a slow link to the database.
    // Nothing was written, so the honest answer is "try again", not "something broke".
    if (isPrismaCode(error, 'P2028')) {
      console.error('Booking transaction expired', error)
      return NextResponse.json(
        { error: 'استغرق تأكيد الحجز وقتًا أطول من المتوقع ولم يتم خصم أي مبلغ. أعد المحاولة من فضلك.' },
        { status: 503 },
      )
    }
    if (error instanceof StreamPayError) {
      console.error('Checkout could not be created', error)
      const message = error.code === 'NOT_CONFIGURED'
        ? 'لم يتم إعداد بوابة الدفع بعد. أضف مفاتيح StreamPay الجديدة في إعدادات الخادم.'
        : error.code === 'ENVIRONMENT_MISMATCH'
          ? 'تم إيقاف الدفع لأن مفتاح StreamPay لا يطابق بيئة الاختبار أو البيئة الحية.'
          : 'تعذر إنشاء رابط الدفع الآن. لم يتم تأكيد الحجز ويمكنك المحاولة مرة أخرى.'
      return NextResponse.json({ error: message }, { status: error.status >= 400 && error.status <= 599 ? error.status : 502 })
    }
    // Lost or refused database connections (pooler limits, a dropped socket). Nothing was
    // committed, so tell the buyer it is safe to retry rather than that something broke.
    if (isDatabaseUnavailable(error)) {
      console.error('Booking failed: database unavailable', error)
      return NextResponse.json(
        { error: 'تعذر الاتصال بالخادم لحظيًا ولم يتم خصم أي مبلغ. أعد المحاولة بعد لحظات.' },
        { status: 503 },
      )
    }
    console.error('Booking failed with an unexpected error', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء تأكيد الحجز' }, { status: 500 })
  }
}

class BookingError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
  }
}

/**
 * Prisma 7 raises errors from inside its generated runtime, and that class is not always
 * the same identity as the re-exported one, so `instanceof` can miss a real error code.
 */
function isPrismaCode(error: unknown, code: string) {
  return typeof error === 'object' && error !== null && (error as { code?: unknown }).code === code
}

function isDatabaseUnavailable(error: unknown) {
  if (['P1001', 'P1002', 'P1017', 'P2024', 'P2037'].some(code => isPrismaCode(error, code))) return true
  const message = error instanceof Error ? error.message : ''
  return /Connection terminated|ECONNRESET|ETIMEDOUT|too many (clients|connections)|MaxClients|DatabaseNotReachable|ConnectionClosed|SocketTimeout|TooManyConnections/i.test(message)
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}
