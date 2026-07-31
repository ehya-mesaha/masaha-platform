import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { durationHours, getSpaceAvailability, sessionsFromDates } from '@/lib/availability'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const dates = Array.isArray(body.dates) ? body.dates.filter((date: unknown): date is string => typeof date === 'string') : []
    const sessions = sessionsFromDates(dates, String(body.startTime || ''), String(body.endTime || ''))
    const space = await prisma.space.findUnique({
      where: { id },
      select: { status: true, minBookingHours: true, maxAdvanceBookingDays: true },
    })
    if (!space || space.status !== 'APPROVED') {
      return NextResponse.json({ error: 'المساحة غير متاحة للحجز حاليًا.' }, { status: 404 })
    }
    const sessionHours = durationHours(sessions[0].startAt, sessions[0].endAt)
    if (space.minBookingHours && sessionHours < space.minBookingHours) {
      return NextResponse.json({ error: `الحد الأدنى للحجز ${space.minBookingHours} ساعة.` }, { status: 400 })
    }
    const now = new Date()
    const latestAllowed = space.maxAdvanceBookingDays
      ? new Date(now.getTime() + space.maxAdvanceBookingDays * 86_400_000)
      : null
    const availability = await getSpaceAvailability(prisma, id, sessions)
    const availableDates = new Set(availability.allocations.map(item => item.session.date))
    const sessionAvailability = sessions.map(session => ({
      date: session.date,
      available: session.startAt > now && (!latestAllowed || session.startAt <= latestAllowed) && availableDates.has(session.date),
    }))

    return NextResponse.json({
      fullyAvailable: sessionAvailability.every(item => item.available),
      totalSessions: availability.totalSessions,
      availableSessions: sessionAvailability.filter(item => item.available).length,
      dates: sessionAvailability,
    })
  } catch {
    return NextResponse.json({ error: 'تعذر التحقق من الموعد. راجع التاريخ والوقت.' }, { status: 400 })
  }
}
