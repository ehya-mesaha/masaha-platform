import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
  return NextResponse.json(await prisma.temporaryClosure.findMany({ where: { spaceId: id, status: 'ACTIVE' }, include: { unit: true }, orderBy: { startTime: 'asc' } }))
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!await allowed(id)) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
  const { title, startTime, endTime, unitId } = await request.json()
  const start = new Date(startTime)
  const end = new Date(endTime)
  if (!title || !Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) {
    return NextResponse.json({ error: 'بيانات الإغلاق غير صحيحة' }, { status: 400 })
  }
  if (unitId) {
    const unit = await prisma.spaceUnit.findFirst({ where: { id: String(unitId), spaceId: id } })
    if (!unit) return NextResponse.json({ error: 'الوحدة غير صحيحة' }, { status: 400 })
  }
  const closure = await prisma.temporaryClosure.create({ data: { title: String(title).trim(), startTime: start, endTime: end, spaceId: id, unitId: unitId || null }, include: { unit: true } })
  return NextResponse.json(closure, { status: 201 })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!await allowed(id)) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
  const closureId = new URL(request.url).searchParams.get('closureId')
  if (!closureId) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 })
  await prisma.temporaryClosure.updateMany({ where: { id: closureId, spaceId: id }, data: { status: 'CANCELLED' } })
  return NextResponse.json({ ok: true })
}
