import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentUser()
  if (!admin || admin.role !== 'ADMIN') {
    return Response.json({ error: 'غير مصرح.' }, { status: 403 })
  }

  const { id } = await params
  const before = await prisma.contactMessage.findUnique({ where: { id } })
  if (!before) return Response.json({ error: 'الرسالة غير موجودة.' }, { status: 404 })

  await prisma.$transaction(async (transaction) => {
    await transaction.contactMessage.delete({ where: { id } })
    await transaction.adminAuditLog.create({
      data: {
        action: 'DELETE_CONTACT_MESSAGE',
        entityType: 'ContactMessage',
        entityId: id,
        before: JSON.parse(JSON.stringify(before)),
        actorId: admin.id as string,
      },
    })
  })

  return Response.json({ success: true })
}

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
  if (typeof body.isRead !== 'boolean') {
    return Response.json({ error: 'حالة الرسالة غير صحيحة.' }, { status: 400 })
  }

  const before = await prisma.contactMessage.findUnique({ where: { id } })
  if (!before) return Response.json({ error: 'الرسالة غير موجودة.' }, { status: 404 })

  const updated = await prisma.$transaction(async (transaction) => {
    const message = await transaction.contactMessage.update({
      where: { id },
      data: { isRead: body.isRead },
    })
    await transaction.adminAuditLog.create({
      data: {
        action: body.isRead ? 'CONTACT_MESSAGE_READ' : 'CONTACT_MESSAGE_REOPENED',
        entityType: 'ContactMessage',
        entityId: id,
        before: { isRead: before.isRead },
        after: { isRead: message.isRead },
        actorId: admin.id as string,
      },
    })
    return message
  })

  return Response.json({ message: updated })
}
