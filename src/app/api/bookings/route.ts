import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const role = searchParams.get('role')

    let bookings
    if (user.role === 'BUYER' || role === 'buyer') {
      bookings = await prisma.booking.findMany({
        where: { buyerId: user.id as string },
        include: {
          space: {
            include: { type: true, images: { take: 1, orderBy: { order: 'asc' } } },
          },
          review: { select: { id: true, rating: true } },
        },
        orderBy: { createdAt: 'desc' },
      })
    } else if (user.role === 'SELLER' || role === 'seller') {
      bookings = await prisma.booking.findMany({
        where: { space: { sellerId: user.id as string } },
        include: {
          space: { include: { type: true } },
          buyer: { select: { name: true, email: true, phone: true } },
        },
        orderBy: { createdAt: 'desc' },
      })
    } else {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    return NextResponse.json({ bookings })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'BUYER') {
      return NextResponse.json({ error: 'يجب تسجيل الدخول كمستأجر' }, { status: 401 })
    }

    const body = await req.json()
    const { spaceId, date, startTime, endTime, persons, notes } = body

    if (!spaceId || !date || !startTime || !endTime) {
      return NextResponse.json({ error: 'يرجى إدخال جميع البيانات المطلوبة' }, { status: 400 })
    }

    const space = await prisma.space.findUnique({ where: { id: spaceId } })
    if (!space || space.status !== 'APPROVED') {
      return NextResponse.json({ error: 'المساحة غير متاحة' }, { status: 400 })
    }

    if (startTime >= endTime) {
      return NextResponse.json({ error: 'وقت النهاية يجب أن يكون بعد وقت البداية' }, { status: 400 })
    }

    if (persons && space.capacity && Number(persons) > space.capacity) {
      return NextResponse.json({ error: 'عدد الأشخاص أكبر من السعة المتاحة للمساحة' }, { status: 400 })
    }

    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        spaceId,
        date,
        status: { in: ['PENDING', 'ACCEPTED'] },
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
      select: { id: true },
    })
    if (overlappingBooking) {
      return NextResponse.json({ error: 'يوجد حجز آخر في هذا الوقت. اختر وقتاً مختلفاً' }, { status: 409 })
    }

    const booking = await prisma.booking.create({
      data: {
        spaceId,
        buyerId: user.id as string,
        date,
        startTime,
        endTime,
        persons: persons ? Number(persons) : null,
        notes,
      },
      include: { space: { include: { type: true } } },
    })

    return NextResponse.json({ booking }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
