import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

    const { id } = await params
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        space: { include: { type: true, images: { take: 1, orderBy: { order: 'asc' } } } },
        buyer: { select: { name: true, email: true, phone: true } },
      },
    })

    if (!booking) return NextResponse.json({ error: 'الحجز غير موجود' }, { status: 404 })

    const canView =
      user.role === 'ADMIN' ||
      booking.buyerId === user.id ||
      booking.space.sellerId === user.id
    if (!canView) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

    let review = null
    try {
      review = await prisma.spaceReview.findUnique({ where: { bookingId: id } })
    } catch (reviewErr) {
      console.error('Failed to load booking review', reviewErr)
    }

    return NextResponse.json({ booking: { ...booking, review } })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

    const { id } = await params
    const body = await req.json()
    const { status, sellerNote } = body

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { space: true },
    })

    if (!booking) return NextResponse.json({ error: 'الحجز غير موجود' }, { status: 404 })

    if (!['ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED'].includes(status)) {
      return NextResponse.json({ error: 'حالة الحجز غير صحيحة' }, { status: 400 })
    }

    // Buyer can only cancel
    if (user.role === 'BUYER') {
      if (booking.buyerId !== user.id) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
      if (status !== 'CANCELLED') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    // Seller can accept/reject pending bookings and complete accepted bookings
    if (user.role === 'SELLER') {
      if (booking.space.sellerId !== user.id) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
      if (['ACCEPTED', 'REJECTED'].includes(status)) {
        if (booking.status !== 'PENDING') return NextResponse.json({ error: 'لا يمكن تعديل حجز تمت مراجعته' }, { status: 400 })
      } else if (status === 'COMPLETED') {
        if (booking.status !== 'ACCEPTED') return NextResponse.json({ error: 'يمكن إكمال الحجوزات المقبولة فقط' }, { status: 400 })
      } else {
        return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
      }
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status, sellerNote },
    })

    return NextResponse.json({ booking: updated })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
