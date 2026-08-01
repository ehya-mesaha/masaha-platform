import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentUser()
  if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
  const { id } = await params
  const { isVisible } = await request.json()
  const before = await prisma.spaceReview.findUnique({ where: { id } })
  if (!before) return NextResponse.json({ error: 'التقييم غير موجود' }, { status: 404 })
  const updated = await prisma.$transaction(async (tx) => {
    const review = await tx.spaceReview.update({ where: { id }, data: { isVisible: Boolean(isVisible) } })
    await tx.adminAuditLog.create({ data: { actorId: String(admin.id), action: 'MODERATE_REVIEW', entityType: 'SpaceReview', entityId: id, before: JSON.parse(JSON.stringify(before)), after: JSON.parse(JSON.stringify(review)) } })
    return review
  })
  return NextResponse.json(updated)
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentUser()
  if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
  const { id } = await params
  const before = await prisma.spaceReview.findUnique({ where: { id } })
  if (!before) return NextResponse.json({ error: 'التقييم غير موجود' }, { status: 404 })
  await prisma.$transaction(async (tx) => {
    await tx.spaceReview.delete({ where: { id } })
    await tx.adminAuditLog.create({ data: { actorId: String(admin.id), action: 'DELETE_REVIEW', entityType: 'SpaceReview', entityId: id, before: JSON.parse(JSON.stringify(before)) } })
  })
  return NextResponse.json({ success: true })
}
