import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const { id } = await params
    const targetUser = await prisma.user.findUnique({
      where: { id },
      include: {
        spaces: { include: { type: true }, orderBy: { createdAt: 'desc' } },
        bookings: { include: { space: true }, orderBy: { createdAt: 'desc' }, take: 10 },
      },
    })

    if (!targetUser) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    return NextResponse.json({ user: targetUser })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const { id } = await params
    const { status } = await req.json()

    const updated = await prisma.user.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({ user: updated })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
