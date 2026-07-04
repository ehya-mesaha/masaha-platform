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
    const body = await req.json()
    const { status, role } = body as { status?: 'ACTIVE' | 'SUSPENDED'; role?: 'ADMIN' | 'SELLER' | 'BUYER' }

    const data: { status?: 'ACTIVE' | 'SUSPENDED'; role?: 'ADMIN' | 'SELLER' | 'BUYER' } = {}
    if (status) data.status = status
    if (role) {
      // Prevent an admin from demoting themselves (avoid lockout)
      if (id === user.id && role !== 'ADMIN') {
        return NextResponse.json({ error: 'لا يمكنك تغيير دورك بنفسك' }, { status: 400 })
      }
      data.role = role
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'لا توجد بيانات للتحديث' }, { status: 400 })
    }

    const updated = await prisma.user.update({ where: { id }, data })
    return NextResponse.json({ user: updated })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
