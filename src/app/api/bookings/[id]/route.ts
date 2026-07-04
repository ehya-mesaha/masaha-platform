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

    return NextResponse.json({ booking })
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

    // Buyer can only cancel
    if (user.role === 'BUYER') {
      if (booking.buyerId !== user.id) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
      if (status !== 'CANCELLED') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    // Seller can accept/reject
    if (user.role === 'SELLER') {
      if (booking.space.sellerId !== user.id) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
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
