import { prisma } from '@/lib/prisma'
import Badge from '@/components/ui/Badge'
import ServiceRequestActions from '@/components/admin/ServiceRequestActions'
import { formatDate, formatNumber } from '@/lib/format'
import Link from 'next/link'

const statusLabel = {
  DRAFT: 'مسودة',
  UNDER_REVIEW: 'قيد المراجعة',
  QUOTED: 'تم التسعير',
  ACCEPTED: 'مقبول',
  REJECTED: 'مرفوض',
  COMPLETED: 'مكتمل',
}

export default async function ServiceRequestsPage() {
  const requests = await prisma.partnerServiceRequest
    .findMany({
      include: {
        buyer: { select: { name: true, email: true, phone: true } },
        items: { include: { service: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    .catch(() => [])

  const active = requests.filter((request) =>
    ['UNDER_REVIEW', 'QUOTED', 'ACCEPTED'].includes(request.status)
  ).length
  const completed = requests.filter((request) => request.status === 'COMPLETED').length

  return (
    <div className="dashboard-page">
      <header className="page-hero mb-6 p-6">
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold text-[#B99A63]">خدمات الشركاء</p>
            <h1 className="text-2xl font-extrabold text-white">طلبات الخدمات الإضافية</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
              راجع كل طلب، اعتمد السعر، حدّث الحالة، وسجّل ملاحظات الفريق من مكان واحد.
            </p>
          </div>
          <Link href="/api/admin/exports/service-requests?format=xlsx" prefetch={false} className="rounded-xl bg-[#D7B66D] px-5 py-2.5 text-sm font-extrabold text-[#092C27]">
            تصدير Excel
          </Link>
        </div>
      </header>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Metric label="إجمالي الطلبات" value={requests.length} />
        <Metric label="طلبات قيد العمل" value={active} />
        <Metric label="طلبات مكتملة" value={completed} />
      </div>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="premium-card p-12 text-center text-[#5F6764]">لا توجد طلبات خدمات</div>
        ) : (
          requests.map((request) => (
            <article key={request.id} className="premium-card p-5 lg:p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div>
                  <p dir="ltr" className="text-right text-xs font-bold text-[#B99A63]">{request.publicRef}</p>
                  <h2 className="mt-1 text-lg font-extrabold text-[#1B1B1B]">{request.buyer.name}</h2>
                  <p className="mt-1 text-xs text-[#5F6764]">
                    {formatDate(request.createdAt)} · <span dir="ltr">{request.buyer.email}</span>
                    {request.buyer.phone ? <> · <span dir="ltr">{request.buyer.phone}</span></> : null}
                  </p>
                </div>
                <Badge variant={request.status === 'UNDER_REVIEW' ? 'warning' : request.status === 'COMPLETED' ? 'success' : request.status === 'REJECTED' ? 'danger' : 'gray'}>
                  {statusLabel[request.status]}
                </Badge>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {request.items.map((item) => (
                  <span key={item.id} className="rounded-full bg-[#F5F1E8] px-3 py-1.5 text-xs font-bold text-[#33423F]">
                    {item.service.name} × {formatNumber(item.quantity)}
                  </span>
                ))}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Info label="الإجمالي التقديري" value={`${formatNumber(request.estimatedTotal)} ر.س`} />
                <Info label="السعر المعتمد" value={request.quotedTotal === null ? 'لم يحدد' : `${formatNumber(request.quotedTotal)} ر.س`} />
                <Info label="آخر تحديث" value={formatDate(request.updatedAt)} />
              </div>

              {request.notes && <p className="mt-4 rounded-xl bg-[#FAF8F3] p-4 text-sm leading-7 text-[#3F4B47]">{request.notes}</p>}

              <ServiceRequestActions
                id={request.id}
                initialStatus={request.status}
                initialQuotedTotal={request.quotedTotal}
                initialAdminNotes={request.adminNotes}
              />
            </article>
          ))
        )}
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="premium-card p-5">
    <p className="text-xs font-bold text-[#5F6764]">{label}</p>
    <p className="mt-2 text-3xl font-extrabold text-[#0E3B34]">{formatNumber(value)}</p>
  </div>
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-[#E1D9CD] bg-[#FAF8F3] p-3">
    <p className="text-[11px] font-bold text-[#707975]">{label}</p>
    <p className="mt-1 text-sm font-extrabold text-[#25322E]">{value}</p>
  </div>
}
