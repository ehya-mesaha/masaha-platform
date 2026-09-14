import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { generateProgramSessions, toSession } from '@/lib/availability'

/**
 * Private occupancy — the space's own use of its rooms, hidden from buyers.
 *
 * A school rarely blocks a single afternoon. It blocks "Sunday and Tuesday, 4–6pm, for the
 * whole term", so the endpoint takes a date *range* plus the weekdays inside it and writes
 * one row per occurrence. Keeping the occurrences as individual rows means availability,
 * conflict detection and the calendar need no special case for a repeating block;
 * `seriesId` is all that ties them together, for listing and for removing the run at once.
 */

const MAX_OCCURRENCES = 400

async function authorizedSpace(id: string) {
  const user = await getCurrentUser()
  if (!user) return { error: NextResponse.json({ error: 'غير مصرح' }, { status: 401 }) }
  const space = await prisma.space.findUnique({ where: { id }, select: { id: true, sellerId: true } })
  if (!space) return { error: NextResponse.json({ error: 'المساحة غير موجودة' }, { status: 404 }) }
  if (user.role !== 'ADMIN' && space.sellerId !== user.id) return { error: NextResponse.json({ error: 'غير مصرح' }, { status: 403 }) }
  return { user, space }
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const access = await authorizedSpace(id)
  if ('error' in access) return access.error
  const [occupancies, units] = await Promise.all([
    prisma.privateOccupancy.findMany({
      where: { spaceId: id, endTime: { gte: new Date() } },
      include: { unit: true },
      orderBy: { startTime: 'asc' },
    }),
    prisma.spaceUnit.findMany({ where: { spaceId: id, isActive: true }, orderBy: { label: 'asc' } }),
  ])
  return NextResponse.json({ occupancies, units })
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const access = await authorizedSpace(id)
    if ('error' in access) return access.error

    const body = await request.json()
    const title = typeof body.title === 'string' ? body.title.trim().slice(0, 160) : ''
    if (!title) return NextResponse.json({ error: 'عنوان الإشغال مطلوب' }, { status: 400 })

    const unitId = typeof body.unitId === 'string' && body.unitId ? body.unitId : null
    if (unitId) {
      const unit = await prisma.spaceUnit.findFirst({ where: { id: unitId, spaceId: id }, select: { id: true } })
      if (!unit) return NextResponse.json({ error: 'الوحدة المحددة غير صحيحة' }, { status: 400 })
    }

    const status = body.status === 'PLANNED' ? 'PLANNED' : 'CONFIRMED'
    const startTime = String(body.startTime || '')
    const endTime = String(body.endTime || '')

    // A range with chosen weekdays repeats; a single date, or a range whose start and end
    // match, stays the one-off it always was.
    const startDate = String(body.startDate || body.date || '')
    const endDate = String(body.endDate || startDate)
    const weekdays: number[] = Array.isArray(body.weekdays)
      ? body.weekdays.map(Number).filter((day: number) => Number.isInteger(day) && day >= 0 && day <= 6)
      : []
    const repeats = Boolean(startDate) && Boolean(endDate) && endDate !== startDate

    let sessions
    try {
      sessions = repeats
        ? generateProgramSessions({
            startDate,
            endDate,
            // No weekday chosen means "every day in the range", which is what someone
            // blocking a continuous week of exams expects.
            weekdays: weekdays.length ? weekdays : [0, 1, 2, 3, 4, 5, 6],
            startTime,
            endTime,
          })
        : [toSession(startDate, startTime, endTime)]
    } catch (error) {
      const reason = error instanceof Error ? error.message : ''
      if (reason === 'NO_WEEKDAYS') return NextResponse.json({ error: 'اختر يومًا واحدًا على الأقل من أيام الأسبوع' }, { status: 400 })
      if (reason === 'INVALID_DATE_RANGE') return NextResponse.json({ error: 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية' }, { status: 400 })
      if (reason === 'TOO_MANY_SESSIONS') return NextResponse.json({ error: 'المدة المطلوبة طويلة جدًا. قسّمها إلى فترات أقصر.' }, { status: 400 })
      return NextResponse.json({ error: 'التاريخ أو الوقت غير صحيح' }, { status: 400 })
    }

    if (sessions.length === 0) {
      return NextResponse.json({ error: 'لا توجد أيام مطابقة داخل هذه الفترة' }, { status: 400 })
    }
    if (sessions.length > MAX_OCCURRENCES) {
      return NextResponse.json({ error: `الحد الأقصى ${MAX_OCCURRENCES} موعدًا في المرة الواحدة` }, { status: 400 })
    }

    // Confirmed bookings win: the owner is told exactly which dates clash rather than
    // having the whole programme silently rejected or, worse, double-booked.
    const rangeStart = sessions[0].startAt
    const rangeEnd = sessions[sessions.length - 1].endAt
    const bookings = await prisma.booking.findMany({
      where: {
        spaceId: id,
        status: 'CONFIRMED',
        startTime: { lt: rangeEnd },
        endTime: { gt: rangeStart },
        ...(unitId ? { unitId } : {}),
      },
      select: { startTime: true, endTime: true },
    })
    const clashes = sessions.filter(session =>
      bookings.some(booking => booking.startTime < session.endAt && booking.endTime > session.startAt),
    )
    if (clashes.length > 0) {
      const dates = clashes.slice(0, 5).map(session => session.date).join('، ')
      const more = clashes.length > 5 ? ` و${clashes.length - 5} تاريخًا آخر` : ''
      return NextResponse.json(
        { error: `يتعارض الإشغال مع حجوزات مؤكدة في: ${dates}${more}. عدّل الفترة أو الأوقات.` },
        { status: 409 },
      )
    }

    const seriesId = sessions.length > 1 ? randomUUID() : null
    await prisma.privateOccupancy.createMany({
      data: sessions.map(session => ({
        title,
        startTime: session.startAt,
        endTime: session.endAt,
        status,
        spaceId: id,
        unitId,
        seriesId,
      })),
    })

    const occupancies = await prisma.privateOccupancy.findMany({
      where: seriesId ? { seriesId } : { spaceId: id, startTime: sessions[0].startAt, title },
      include: { unit: true },
      orderBy: { startTime: 'asc' },
    })

    return NextResponse.json({ occupancies, created: occupancies.length, seriesId }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'التاريخ أو الوقت غير صحيح' }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const access = await authorizedSpace(id)
  if ('error' in access) return access.error
  const body = await request.json()

  // Deleting a whole programme is one request; deleting one date out of it leaves the rest.
  if (typeof body.seriesId === 'string' && body.seriesId) {
    const removed = await prisma.privateOccupancy.deleteMany({ where: { seriesId: body.seriesId, spaceId: id } })
    return NextResponse.json({ success: true, removed: removed.count })
  }

  if (typeof body.occupancyId !== 'string' || !body.occupancyId) {
    return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 })
  }
  const removed = await prisma.privateOccupancy.deleteMany({ where: { id: body.occupancyId, spaceId: id } })
  return NextResponse.json({ success: true, removed: removed.count })
}
