import { prisma } from '@/lib/prisma'
import AdminDataCenter from '@/components/admin/AdminDataCenter'

export const dynamic = 'force-dynamic'

export default async function AdminDataCenterPage() {
  const [
    users,
    spaces,
    bookings,
    sellerApplications,
    serviceRequests,
    spaceNeeds,
    contactMessages,
    reviews,
    auditLogs,
    recentAudit,
  ] = await Promise.all([
    prisma.user.count().catch(() => 0),
    prisma.space.count().catch(() => 0),
    prisma.booking.count().catch(() => 0),
    prisma.sellerApplication.count().catch(() => 0),
    prisma.partnerServiceRequest.count().catch(() => 0),
    prisma.spaceNeedRequest.count().catch(() => 0),
    prisma.contactMessage.count().catch(() => 0),
    prisma.spaceReview.count().catch(() => 0),
    prisma.adminAuditLog.count().catch(() => 0),
    prisma.adminAuditLog
      .findMany({
        include: { actor: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 8,
      })
      .catch(() => []),
  ])

  return (
    <AdminDataCenter
      datasets={[
        { id: 'users', count: users },
        { id: 'spaces', count: spaces },
        { id: 'bookings', count: bookings },
        { id: 'seller-applications', count: sellerApplications },
        { id: 'service-requests', count: serviceRequests },
        { id: 'space-needs', count: spaceNeeds },
        { id: 'contact-messages', count: contactMessages },
        { id: 'reviews', count: reviews },
        { id: 'audit-log', count: auditLogs },
      ]}
      recentAudit={recentAudit.map((item) => ({
        id: item.id,
        actor: item.actor.name,
        action: item.action,
        entityType: item.entityType,
        createdAt: item.createdAt.toISOString(),
      }))}
    />
  )
}
