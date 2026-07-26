import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ favorite: false })
  const spaceId = new URL(request.url).searchParams.get('spaceId')
  if (spaceId) return NextResponse.json({ favorite: Boolean(await prisma.favorite.findUnique({ where: { userId_spaceId: { userId: String(user.id), spaceId } } })) })
  return NextResponse.json({ favorites: await prisma.favorite.findMany({ where: { userId: String(user.id) }, include: { space: { include: { type: true, images: { take: 1, orderBy: { order: 'asc' } } } } }, orderBy: { createdAt: 'desc' } }) })
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'BUYER') return NextResponse.json({ error: 'سجّل الدخول كطالب مساحة' }, { status: 401 })
  const { spaceId } = await request.json()
  if (!spaceId) return NextResponse.json({ error: 'المساحة مطلوبة' }, { status: 400 })
  const key = { userId: String(user.id), spaceId: String(spaceId) }
  const existing = await prisma.favorite.findUnique({ where: { userId_spaceId: key } })
  if (existing) {
    await prisma.favorite.delete({ where: { userId_spaceId: key } })
    return NextResponse.json({ favorite: false })
  }
  await prisma.favorite.create({ data: key })
  return NextResponse.json({ favorite: true })
}
