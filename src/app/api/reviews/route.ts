import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser, type TokenPayload } from '@/lib/auth'

const reviewInclude = {
  buyer: { select: { id: true, name: true } },
  booking: { select: { id: true, date: true } },
} as const

async function getReviewSummary(spaceId: string) {
  const [aggregate, distribution] = await Promise.all([
    prisma.spaceReview.aggregate({
      where: { spaceId, isVisible: true },
      _avg: { rating: true },
      _count: { id: true },
    }),
    prisma.spaceReview.groupBy({
      by: ['rating'],
      where: { spaceId, isVisible: true },
      _count: { rating: true },
    }),
  ])

  return {
    average: aggregate._avg.rating ? Number(aggregate._avg.rating.toFixed(1)) : 0,
    count: aggregate._count.id,
    distribution: distribution.reduce<Record<number, number>>((acc, item) => {
      acc[item.rating] = item._count.rating
      return acc
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }),
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const spaceId = searchParams.get('spaceId')
    const requestedTake = Number(searchParams.get('take') || 10)
    const take = Number.isFinite(requestedTake) ? Math.min(Math.max(Math.trunc(requestedTake), 1), 30) : 10

    if (!spaceId) {
      return NextResponse.json({ error: 'يرجى تحديد المساحة' }, { status: 400 })
    }

    const [reviews, summary] = await Promise.all([
      prisma.spaceReview.findMany({
        where: { spaceId, isVisible: true },
        include: reviewInclude,
        orderBy: { createdAt: 'desc' },
        take,
      }),
      getReviewSummary(spaceId),
    ])

    return NextResponse.json(
      { reviews, summary },
      { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=15, stale-while-revalidate=60' } },
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getCurrentUser()
    if (!token) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

    const user = token as TokenPayload
    if (user.role !== 'BUYER') {
      return NextResponse.json({ error: 'التقييم متاح للمستأجر فقط' }, { status: 403 })
    }

    const body = await req.json()
    const bookingId = typeof body.bookingId === 'string' ? body.bookingId : ''
    const rating = Number(body.rating)
    const comment = typeof body.comment === 'string' ? body.comment.trim() : ''

    if (!bookingId) return NextResponse.json({ error: 'يرجى تحديد الحجز' }, { status: 400 })
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'اختر تقييم من 1 إلى 5' }, { status: 400 })
    }
    if (comment.length > 1000) {
      return NextResponse.json({ error: 'التعليق طويل جداً' }, { status: 400 })
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        buyerId: true,
        spaceId: true,
        status: true,
        review: { select: { id: true } },
      },
    })

    if (!booking) return NextResponse.json({ error: 'الحجز غير موجود' }, { status: 404 })
    if (booking.buyerId !== user.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }
    if (booking.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'يمكنك التقييم بعد اكتمال الحجز فقط' }, { status: 400 })
    }
    if (booking.review) {
      return NextResponse.json({ error: 'تم تقييم هذا الحجز مسبقاً' }, { status: 409 })
    }

    const review = await prisma.spaceReview.create({
      data: {
        bookingId: booking.id,
        spaceId: booking.spaceId,
        buyerId: user.id,
        rating,
        comment: comment || null,
      },
      include: reviewInclude,
    })

    const summary = await getReviewSummary(booking.spaceId)

    return NextResponse.json({ review, summary }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
