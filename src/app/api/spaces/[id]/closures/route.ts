import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateProgramSessions, toSession } from '@/lib/availability'

/**
 * Temporary closures — maintenance and emergencies, removed from availability at once.
 *
 * Like private occupancy, a closure is often not a single afternoon: a renovation runs for
 * weeks, and a weekly maintenance slot repeats. The endpoint therefore accepts a date range
 * plus the weekdays inside it and writes one row per occurrence, tied together by `seriesId`
 * so the run can be lifted in one action.
 */

const MAX_OCCURRENCES = 400

async function allowed(spaceId: string) {
  const user = await getCurrentUser()
  if (!user || !['SELLER', 'ADMIN'].includes(String(user.role))) return null
  const space = await prisma.space.findUnique({ where: { id: spaceId }, select: { sellerId: true } })
  if (!space || (user.role !== 'ADMIN' && space.sellerId !== String(user.id))) return null
  return user
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!await allowed(id)) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
  return NextResponse.json(await prisma.temporaryClosure.findMany({
    where: { spaceId: id, status: 'ACTIVE' },
    include: { unit: true },
    orderBy: { startTime: 'asc' },
  }))
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!await allowed(id)) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

  const body = await request.json()
  const title = typeof body.title === 'string' ? body.title.trim().slice(0, 160) : ''
  if (!title) return NextResponse.json({ error: 'سبب الإغلاق مطلوب' }, { status: 400 })

  const unitId = typeof body.unitId === 'string' && body.unitId ? body.unitId : null
  if (unitId) {
    const unit = await prisma.spaceUnit.findFirst({ where: { id: unitId, spaceId: id }, select: { id: true } })
    if (!unit) return NextResponse.json({ error: 'الوحدة غير صحيحة' }, { status: 400 })
  }

  // Callers that still send absolute timestamps (the older shape) keep working unchanged.
  if (body.startDate === undefined && body.startTime && String(body.startTime).includes('T')) {
    const start = new Date(body.startTime)
    const end = new Date(body.endTime)
    if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) {
      return NextResponse.json({ error: 'بيانات الإغلاق غير صحيحة' }, { status: 400 })
    }
    const closure = await prisma.temporaryClosure.create({
      data: { title, startTime: start, endTime: end, spaceId: id, unitId },
      include: { unit: true },
    })
    return NextResponse.json(closure, { status: 201 })
  }

  const startDate = String(body.startDate || body.date || '')
  const endDate = String(body.endDate || startDate)
  const startTime = String(body.startTime || '')
  const endTime = String(body.endTime || '')
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
          // A continuous closure — a renovation — covers every day in the range.
          weekdays: weekdays.length ? weekdays : [0, 1, 2, 3, 4, 5, 6],
          startTime,
          endTime,
        })
      : [toSession(startDate, startTime, endTime)]
  } catch (error) {
    const reason = error instanceof Error ? error.message : ''
    if (reason === 'INVALID_DATE_RANGE') return NextResponse.json({ error: 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية' }, { status: 400 })
    if (reason === 'TOO_MANY_SESSIONS') return NextResponse.json({ error: 'المدة المطلوبة طويلة جدًا. قسّمها إلى فترات أقصر.' }, { status: 400 })
    return NextResponse.json({ error: 'بيانات الإغلاق غير صحيحة' }, { status: 400 })
  }

  if (sessions.length === 0) return NextResponse.json({ error: 'لا توجد أيام مطابقة داخل هذه الفترة' }, { status: 400 })
  if (sessions.length > MAX_OCCURRENCES) {
    return NextResponse.json({ error: `الحد الأقصى ${MAX_OCCURRENCES} فترة في المرة الواحدة` }, { status: 400 })
  }

  const seriesId = sessions.length > 1 ? randomUUID() : null
  await prisma.temporaryClosure.createMany({
    data: sessions.map(session => ({
      title,
      startTime: session.startAt,
      endTime: session.endAt,
      spaceId: id,
      unitId,
      seriesId,
    })),
  })

  const closures = await prisma.temporaryClosure.findMany({
    where: seriesId ? { seriesId } : { spaceId: id, startTime: sessions[0].startAt, title },
    include: { unit: true },
    orderBy: { startTime: 'asc' },
  })
  return NextResponse.json({ closures, created: closures.length, seriesId }, { status: 201 })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!await allowed(id)) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

  const search = new URL(request.url).searchParams
  const seriesId = search.get('seriesId')
  if (seriesId) {
    const removed = await prisma.temporaryClosure.updateMany({
      where: { seriesId, spaceId: id },
      data: { status: 'CANCELLED' },
    })
    return NextResponse.json({ ok: true, removed: removed.count })
  }

  const closureId = search.get('closureId')
  if (!closureId) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 })
  await prisma.temporaryClosure.updateMany({ where: { id: closureId, spaceId: id }, data: { status: 'CANCELLED' } })
  return NextResponse.json({ ok: true })
}
