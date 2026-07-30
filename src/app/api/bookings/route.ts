import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { durationHours, generateProgramSessions, getSpaceAvailability, toSession } from '@/lib/availability'
import { LEGAL_VERSION } from '@/lib/legal'

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
        where: { space: { sellerId: user.id as string } },
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

    const body = await req.json()
    if (body.termsAccepted !== true || body.termsVersion !== LEGAL_VERSION) {
      return NextResponse.json({ error: 'يجب قراءة الوثائق القانونية والموافقة على نسختها الحالية قبل إتمام الحجز.' }, { status: 400 })
    }
    const spaceId = typeof body.spaceId === 'string' ? body.spaceId : ''
    const persons = body.persons ? Number(body.persons) : null
    const notes = typeof body.notes === 'string' ? body.notes.trim().slice(0, 2000) : null
    const requesterIdNumber = typeof body.requesterIdNumber === 'string' ? body.requesterIdNumber.trim().slice(0, 100) : ''
    const selectedServices: SelectedService[] = Array.isArray(body.services) ? body.services : []
    if (!spaceId || !body.startTime || !body.endTime || !requesterIdNumber) {
      return NextResponse.json({ error: 'يرجى إدخال جميع البيانات المطلوبة' }, { status: 400 })
    }

    let sessions
    try {
      sessions = body.mode === 'program'
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
      const serviceLines = selectedServices.flatMap(selection => {
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
        if (config.catalog.pricingType === 'PER_HOUR') effectiveQuantity = quantity * totalHours
        return [{
          configId: config.id,
          name: config.catalog.name,
          quantity: Math.ceil(effectiveQuantity),
          unitPrice,
          lineTotal: roundMoney(unitPrice * effectiveQuantity),
        }]
      })
      const servicesTotal = roundMoney(serviceLines.reduce((sum, line) => sum + line.lineTotal, 0))
      const grandTotal = roundMoney(basePrice - discountAmount + servicesTotal)

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

      const bookings = []
      for (const [index, allocation] of availability.allocations.entries()) {
        const sessionHours = durationHours(allocation.session.startAt, allocation.session.endAt)
        const sessionBasePrice = roundMoney(space.price * sessionHours)
        const sessionDiscount = roundMoney(sessionBasePrice * discountPercent / 100)
        const allocatedServicesTotal = index === 0 ? servicesTotal : 0
        const booking = await tx.booking.create({
          data: {
            spaceId,
            unitId: allocation.unitId,
            buyerId: user.id as string,
            programId: program?.id ?? null,
            date: new Date(`${allocation.session.date}T00:00:00+03:00`),
            startTime: allocation.session.startAt,
            endTime: allocation.session.endAt,
            persons,
            notes,
            requesterIdNumber,
            status: 'CONFIRMED',
            termsAcceptedAt: new Date(),
            termsVersion: LEGAL_VERSION,
            totalHours: sessionHours,
            basePrice: sessionBasePrice,
            discountAmount: sessionDiscount,
            servicesTotal: allocatedServicesTotal,
            grandTotal: roundMoney(sessionBasePrice - sessionDiscount + allocatedServicesTotal),
            services: index === 0 && serviceLines.length
              ? { create: serviceLines }
              : undefined,
          },
          include: { unit: true, space: { include: { type: true } }, services: true },
        })
        bookings.push(booking)
      }

      await tx.notification.create({
        data: {
          userId: space.sellerId,
          title: 'حجز جديد مؤكد',
          message: `تم تأكيد ${sessions.length.toLocaleString('en-US')} جلسة في ${space.name}.`,
          href: `/seller/bookings/${bookings[0].id}`,
        },
      })

      return { bookings, program, pricing: { totalHours, basePrice, discountPercent, discountAmount, servicesTotal, grandTotal } }
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof BookingError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && ['P2002', 'P2034'].includes(error.code)) {
      return NextResponse.json({ error: 'تم حجز الموعد للتو من مستخدم آخر. اختر موعدًا مختلفًا.' }, { status: 409 })
    }
    console.error(error)
    return NextResponse.json({ error: 'حدث خطأ أثناء تأكيد الحجز' }, { status: 500 })
  }
}

class BookingError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
  }
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100
}
