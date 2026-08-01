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

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const { id } = await params
    if (id === admin.id) {
      return NextResponse.json({ error: 'لا يمكنك حذف حسابك الخاص' }, { status: 400 })
    }

    const before = await prisma.user.findUnique({ where: { id } })
    if (!before) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })

    if (before.role === 'ADMIN') {
      const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } })
      if (adminCount <= 1) {
        return NextResponse.json({ error: 'لا يمكن حذف آخر حساب مدير في المنصة' }, { status: 400 })
      }
    }

    const hasAuditTrail = await prisma.adminAuditLog.findFirst({ where: { actorId: id } })
    if (hasAuditTrail) {
      return NextResponse.json({
        error: 'لا يمكن حذف هذا الحساب لأنه نفّذ إجراءات إدارية محفوظة في سجل التدقيق. علّق الحساب بدلاً من ذلك لإيقاف وصوله.',
      }, { status: 409 })
    }

    await prisma.$transaction(async (tx) => {
      // Spaces/bookings reference the user with no cascade — clear them first (in dependency order).
      await tx.booking.deleteMany({ where: { OR: [{ buyerId: id }, { space: { sellerId: id } }] } })
      await tx.space.deleteMany({ where: { sellerId: id } })
      await tx.conversationMessage.deleteMany({ where: { senderId: id } })
      await tx.user.delete({ where: { id } })
      await tx.adminAuditLog.create({
        data: {
          actorId: String(admin.id),
          action: 'DELETE_USER',
          entityType: 'User',
          entityId: id,
          before: JSON.parse(JSON.stringify(before)),
        },
      })
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'تعذر حذف المستخدم' }, { status: 500 })
  }
}
