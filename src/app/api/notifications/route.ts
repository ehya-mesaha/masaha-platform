import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  const notifications = await prisma.notification.findMany({ where: { userId: String(user.id) }, orderBy: { createdAt: 'desc' }, take: 100 })
  return NextResponse.json({ notifications }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  const { id } = await request.json()
  await prisma.notification.updateMany({ where: { userId: String(user.id), ...(id ? { id: String(id) } : {}) }, data: { isRead: true } })
  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } })
}
