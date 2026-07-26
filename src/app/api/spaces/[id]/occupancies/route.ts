import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { toSession } from '@/lib/availability'

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
    const session = toSession(body.date, body.startTime, body.endTime)
    const title = typeof body.title === 'string' ? body.title.trim().slice(0, 160) : ''
    const unitId = typeof body.unitId === 'string' && body.unitId ? body.unitId : null
    if (!title) return NextResponse.json({ error: 'عنوان الإشغال مطلوب' }, { status: 400 })

    const conflict = await prisma.booking.findFirst({
      where: {
        spaceId: id,
        status: 'CONFIRMED',
        startTime: { lt: session.endAt },
        endTime: { gt: session.startAt },
        ...(unitId ? { unitId } : {}),
      },
      select: { id: true },
    })
    if (conflict) return NextResponse.json({ error: 'يتعارض الإشغال مع حجز مؤكد' }, { status: 409 })

    const occupancy = await prisma.privateOccupancy.create({
      data: {
        title,
        startTime: session.startAt,
        endTime: session.endAt,
        status: body.status === 'PLANNED' ? 'PLANNED' : 'CONFIRMED',
        spaceId: id,
        unitId,
      },
      include: { unit: true },
    })
    return NextResponse.json({ occupancy }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'التاريخ أو الوقت غير صحيح' }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const access = await authorizedSpace(id)
  if ('error' in access) return access.error
  const body = await request.json()
  await prisma.privateOccupancy.deleteMany({ where: { id: body.occupancyId, spaceId: id } })
  return NextResponse.json({ success: true })
}
