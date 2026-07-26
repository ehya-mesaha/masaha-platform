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
        documents: { orderBy: { uploadedAt: 'desc' } },
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
    const { status, role, confirmAdminRole } = body as { status?: 'ACTIVE' | 'SUSPENDED' | 'PENDING_APPROVAL'; role?: 'ADMIN' | 'SELLER' | 'BUYER'; confirmAdminRole?: boolean }

    const data: { status?: 'ACTIVE' | 'SUSPENDED' | 'PENDING_APPROVAL'; role?: 'ADMIN' | 'SELLER' | 'BUYER' } = {}
    if (status) data.status = status
    if (role) {
      if (role === 'ADMIN' && confirmAdminRole !== true) {
        return NextResponse.json({ error: 'يتطلب منح صلاحية مدير النظام تأكيدًا صريحًا' }, { status: 400 })
      }
      // Prevent an admin from demoting themselves (avoid lockout)
      if (id === user.id && role !== 'ADMIN') {
        return NextResponse.json({ error: 'لا يمكنك تغيير دورك بنفسك' }, { status: 400 })
      }
      data.role = role
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'لا توجد بيانات للتحديث' }, { status: 400 })
    }

    const before = await prisma.user.findUnique({ where: { id } })
    if (!before) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.user.update({ where: { id }, data })
      await tx.adminAuditLog.create({
        data: {
          actorId: String(user.id),
          action: role ? 'UPDATE_USER_ROLE' : 'UPDATE_USER_STATUS',
          entityType: 'User',
          entityId: id,
          before: JSON.parse(JSON.stringify(before)),
          after: JSON.parse(JSON.stringify(result)),
        },
      })
      return result
    })
    return NextResponse.json({ user: updated })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
