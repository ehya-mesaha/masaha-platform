import type { NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const STATUSES = ['DRAFT', 'UNDER_REVIEW', 'QUOTED', 'ACCEPTED', 'REJECTED', 'COMPLETED'] as const

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentUser()
  if (!admin || admin.role !== 'ADMIN') {
    return Response.json({ error: 'غير مصرح.' }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()
  const status = String(body.status || '')
  if (!STATUSES.includes(status as (typeof STATUSES)[number])) {
    return Response.json({ error: 'حالة الطلب غير صحيحة.' }, { status: 400 })
  }

  const quotedTotal =
    body.quotedTotal === '' || body.quotedTotal === null || body.quotedTotal === undefined
      ? null
      : Number(body.quotedTotal)
  if (quotedTotal !== null && (!Number.isFinite(quotedTotal) || quotedTotal < 0)) {
    return Response.json({ error: 'السعر المعتمد غير صحيح.' }, { status: 400 })
  }

  const before = await prisma.partnerServiceRequest.findUnique({ where: { id } })
  if (!before) return Response.json({ error: 'الطلب غير موجود.' }, { status: 404 })

  const updated = await prisma.$transaction(async (transaction) => {
    const record = await transaction.partnerServiceRequest.update({
      where: { id },
      data: {
        status: status as (typeof STATUSES)[number],
        quotedTotal,
        adminNotes:
          typeof body.adminNotes === 'string' ? body.adminNotes.trim().slice(0, 3000) || null : null,
      },
    })
    await transaction.adminAuditLog.create({
      data: {
        action: 'SERVICE_REQUEST_UPDATE',
        entityType: 'PartnerServiceRequest',
        entityId: id,
        before: {
          status: before.status,
          quotedTotal: before.quotedTotal,
          adminNotes: before.adminNotes,
        },
        after: {
          status: record.status,
          quotedTotal: record.quotedTotal,
          adminNotes: record.adminNotes,
        },
        actorId: admin.id as string,
      },
    })
    return record
  })

  return Response.json({ request: updated })
}
