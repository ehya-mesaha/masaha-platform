import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { calculateCancellation } from '@/lib/availability'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

    const { id } = await params
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        space: {
          include: {
            type: true,
            images: { take: 1, orderBy: { order: 'asc' } },
          },
        },
        unit: true,
        program: true,
        services: true,
        buyer: { select: { name: true, email: true, phone: true } },
        review: true,
      },
    })

    if (!booking) return NextResponse.json({ error: 'الحجز غير موجود' }, { status: 404 })
    const canView = user.role === 'ADMIN' || booking.buyerId === user.id || booking.space.sellerId === user.id
    if (!canView) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

    const cancellation = booking.status === 'CONFIRMED'
      ? calculateCancellation({
          policy: booking.space.cancellationPolicy,
          bookingStart: booking.startTime,
          grandTotal: booking.grandTotal,
        })
      : null

    return NextResponse.json({ booking, cancellation })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'حدث خطأ أثناء تحميل الحجز' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

    const { id } = await params
    const body = await req.json()
    const requestedStatus = String(body.status || '')
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { space: true },
    })
    if (!booking) return NextResponse.json({ error: 'الحجز غير موجود' }, { status: 404 })

    if (user.role === 'BUYER') {
      if (booking.buyerId !== user.id || requestedStatus !== 'CANCELLED_BY_BUYER') {
        return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
      }
      if (booking.status !== 'CONFIRMED') {
        return NextResponse.json({ error: 'لا يمكن إلغاء هذا الحجز' }, { status: 400 })
      }

      const cancellation = calculateCancellation({
        policy: booking.space.cancellationPolicy,
        bookingStart: booking.startTime,
        grandTotal: booking.grandTotal,
      })
      const updated = await prisma.booking.update({
        where: { id },
        data: {
          status: 'CANCELLED_BY_BUYER',
          cancelledAt: new Date(),
          cancelledBy: user.id as string,
          refundAmount: cancellation.refundAmount,
        },
      })
      await prisma.notification.create({
        data: {
          userId: booking.space.sellerId,
          title: 'إلغاء حجز',
          message: `ألغى طالب المساحة حجزه في ${booking.space.name}.`,
          href: `/seller/bookings/${id}`,
        },
      })
      return NextResponse.json({ booking: updated, cancellation })
    }

    if (user.role === 'SELLER') {
      if (booking.space.sellerId !== user.id) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
      if (!['CANCELLED_BY_SELLER', 'COMPLETED'].includes(requestedStatus)) {
        return NextResponse.json({ error: 'حالة الحجز غير صحيحة' }, { status: 400 })
      }
      if (booking.status !== 'CONFIRMED') {
        return NextResponse.json({ error: 'لا يمكن تعديل هذا الحجز' }, { status: 400 })
      }

      const updated = await prisma.booking.update({
        where: { id },
        data: requestedStatus === 'COMPLETED'
          ? { status: 'COMPLETED', sellerNote: typeof body.sellerNote === 'string' ? body.sellerNote : null }
          : {
              status: 'CANCELLED_BY_SELLER',
              cancelledAt: new Date(),
              cancelledBy: user.id as string,
              refundAmount: booking.grandTotal,
              sellerNote: typeof body.sellerNote === 'string' ? body.sellerNote : null,
            },
      })
      return NextResponse.json({ booking: updated })
    }

    if (user.role === 'ADMIN' && requestedStatus === 'COMPLETED') {
      const updated = await prisma.booking.update({ where: { id }, data: { status: 'COMPLETED' } })
      return NextResponse.json({ booking: updated })
    }

    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'حدث خطأ أثناء تحديث الحجز' }, { status: 500 })
  }
}
