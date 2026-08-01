import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const TARGET_STATUSES = ['COMPLETED', 'CANCELLED_BY_BUYER', 'CANCELLED_BY_SELLER'] as const

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentUser()
  if (!admin || admin.role !== 'ADMIN') {
    return Response.json({ error: 'غير مصرح.' }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()
  const status = String(body.status || '')
  if (!TARGET_STATUSES.includes(status as (typeof TARGET_STATUSES)[number])) {
    return Response.json({ error: 'حالة الحجز غير صحيحة.' }, { status: 400 })
  }

  const before = await prisma.booking.findUnique({
    where: { id },
    include: { space: { select: { name: true } } },
  })
  if (!before) return Response.json({ error: 'الحجز غير موجود.' }, { status: 404 })
  if (before.status !== 'CONFIRMED') {
    return Response.json({ error: 'لا يمكن تعديل حجز منتهٍ أو ملغى.' }, { status: 409 })
  }

  const note =
    typeof body.adminNote === 'string' ? body.adminNote.trim().slice(0, 3000) || null : null
  const isCancelled = status.startsWith('CANCELLED')

  const updated = await prisma.$transaction(async (transaction) => {
    const booking = await transaction.booking.update({
      where: { id },
      data: {
        status: status as (typeof TARGET_STATUSES)[number],
        sellerNote: note,
        ...(isCancelled
          ? { cancelledAt: new Date(), cancelledBy: admin.id as string }
          : {}),
      },
    })
    await transaction.adminAuditLog.create({
      data: {
        action: 'BOOKING_STATUS_CHANGE',
        entityType: 'Booking',
        entityId: id,
        before: { status: before.status, sellerNote: before.sellerNote },
        after: { status: booking.status, sellerNote: booking.sellerNote },
        actorId: admin.id as string,
      },
    })
    await transaction.notification.create({
      data: {
        userId: before.buyerId,
        title: 'تحديث الحجز من الإدارة',
        message: `تم تحديث حالة حجزك في ${before.space.name}.`,
        href: `/buyer/bookings/${id}`,
      },
    })
    return booking
  })

  return Response.json({ booking: updated })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentUser()
  if (!admin || admin.role !== 'ADMIN') {
    return Response.json({ error: 'غير مصرح.' }, { status: 403 })
  }

  const { id } = await params
  const before = await prisma.booking.findUnique({ where: { id } })
  if (!before) return Response.json({ error: 'الحجز غير موجود.' }, { status: 404 })

  await prisma.$transaction(async (transaction) => {
    await transaction.booking.delete({ where: { id } })
    await transaction.adminAuditLog.create({
      data: {
        action: 'DELETE_BOOKING',
        entityType: 'Booking',
        entityId: id,
        before: JSON.parse(JSON.stringify(before)),
        actorId: admin.id as string,
      },
    })
  })

  return Response.json({ success: true })
}
