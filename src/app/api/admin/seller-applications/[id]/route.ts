import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentUser()
  if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
  const { id } = await params
  const { status, adminNotes } = await request.json()
  const allowed = ['DATA_REVIEW', 'CONTRACT_SENT', 'APPROVED', 'EXPIRED', 'REJECTED', 'CHANGES_REQUESTED']
  if (!allowed.includes(status)) return NextResponse.json({ error: 'الحالة غير صحيحة' }, { status: 400 })
  const before = await prisma.sellerApplication.findUnique({ where: { id } })
  if (!before) return NextResponse.json({ error: 'الطلب غير موجود' }, { status: 404 })
  const updated = await prisma.$transaction(async (tx) => {
    const application = await tx.sellerApplication.update({
      where: { id },
      data: {
        status,
        adminNotes: adminNotes || null,
        contractSentAt: status === 'CONTRACT_SENT' ? new Date() : before.contractSentAt,
        approvalDeadline: status === 'CONTRACT_SENT' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : before.approvalDeadline,
      },
    })
    if (status === 'APPROVED') {
      await tx.user.update({ where: { id: before.userId }, data: { status: 'ACTIVE' } })
      const membership = await tx.organizationMember.findFirst({ where: { userId: before.userId } })
      if (!membership) {
        await tx.schoolOrganization.create({
          data: {
            name: before.schoolName,
            branchName: before.branchName,
            members: { create: { userId: before.userId, role: 'OWNER' } },
          },
        })
      }
    }
    if (status === 'REJECTED') await tx.user.update({ where: { id: before.userId }, data: { status: 'SUSPENDED' } })
    await tx.adminAuditLog.create({ data: { actorId: String(admin.id), action: 'UPDATE_SELLER_APPLICATION', entityType: 'SellerApplication', entityId: id, before: JSON.parse(JSON.stringify(before)), after: JSON.parse(JSON.stringify(application)) } })
    return application
  })
  return NextResponse.json(updated)
}
