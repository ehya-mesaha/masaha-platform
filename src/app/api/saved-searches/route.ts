import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  return NextResponse.json({ searches: await prisma.savedSearch.findMany({ where: { userId: String(user.id) }, orderBy: { updatedAt: 'desc' } }) })
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'BUYER') return NextResponse.json({ error: 'سجّل الدخول كطالب مساحة' }, { status: 401 })
  const { name, criteria } = await request.json()
  if (!name || !criteria || typeof criteria !== 'object') return NextResponse.json({ error: 'بيانات البحث غير مكتملة' }, { status: 400 })
  const saved = await prisma.savedSearch.create({ data: { userId: String(user.id), name: String(name).trim().slice(0, 80), criteria } })
  return NextResponse.json(saved, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  const id = new URL(request.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 })
  await prisma.savedSearch.deleteMany({ where: { id, userId: String(user.id) } })
  return NextResponse.json({ ok: true })
}
