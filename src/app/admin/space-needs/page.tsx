import { prisma } from '@/lib/prisma'
import { SpaceNeedStatus } from '@/generated/prisma'
import Link from 'next/link'
import AdminSpaceNeedActions from '@/components/space-needs/AdminSpaceNeedActions'
import { SPACE_NEED_STATUSES, formatBudgetRange, getSpaceNeedStatusMeta } from '@/lib/spaceNeeds'

export default async function AdminSpaceNeedsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  const status = params.status && SPACE_NEED_STATUSES.some(item => item.value === params.status)
    ? params.status
    : ''

  let requests: SpaceNeedRequestType[] = []
  let stats = { total: 0, newCount: 0, inReview: 0, matched: 0, closed: 0 }

  try {
    const where = status ? { status: status as SpaceNeedStatus } : undefined
    const [rawRequests, grouped] = await Promise.all([
      prisma.spaceNeedRequest.findMany({
        where,
        include: {
          buyer: { select: { name: true, email: true, phone: true } },
          type: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.spaceNeedRequest.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
    ])

    requests = rawRequests as SpaceNeedRequestType[]
    const counts = grouped.reduce<Record<string, number>>((acc, item) => {
      acc[item.status] = item._count._all
      return acc
    }, {})
    stats = {
      total: Object.values(counts).reduce((sum, count) => sum + count, 0),
      newCount: counts.NEW || 0,
      inReview: counts.IN_REVIEW || 0,
      matched: counts.MATCHED || 0,
      closed: counts.CLOSED || 0,
    }
  } catch (err) {
    console.error('Failed to load admin space needs', err)
  }

  const statCards = [
    { label: 'إجمالي الطلبات', value: stats.total, color: 'text-[#1B3A2D]' },
    { label: 'طلبات جديدة', value: stats.newCount, color: 'text-amber-700' },
    { label: 'قيد المراجعة', value: stats.inReview, color: 'text-blue-700' },
    { label: 'تم توفير خيارات', value: stats.matched, color: 'text-green-700' },
  ]

  return (
    <div className="dashboard-page">
      <div className="page-hero mb-6 p-6 animate-in">
        <div className="relative">
          <p className="mb-2 text-xs font-bold text-[#C49A3C]">طلبات لم يجد أصحابها مساحة مناسبة</p>
          <h1 className="text-2xl font-extrabold text-white">احتياجات المساحات</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/65">
            لوحة تشغيل واضحة لطلبات المستأجرين خارج نتائج البحث، مع الحالة وملاحظات الفريق ومعلومات التواصل.
          </p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(card => (
          <div key={card.label} className="premium-card p-5 animate-in">
            <p className="text-xs font-bold text-[#6B7566]">{card.label}</p>
            <p className="mt-2 text-3xl font-extrabold text-[#1B3A2D]">{card.value.toLocaleString('en-US')}</p>
          </div>
        ))}
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <Link
          href="/admin/space-needs"
          className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
            !status ? 'bg-[#1B3A2D] text-white' : 'border border-[#E8E3D8] bg-white text-[#4A554D] hover:border-[#C49A3C]'
          }`}
        >
          الكل
        </Link>
        {SPACE_NEED_STATUSES.map(item => (
          <Link
            key={item.value}
            href={`/admin/space-needs?status=${item.value}`}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
              status === item.value ? 'bg-[#1B3A2D] text-white' : 'border border-[#E8E3D8] bg-white text-[#4A554D] hover:border-[#C49A3C]'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {requests.length === 0 ? (
        <div className="premium-card p-10 text-center animate-in">
          <p className="font-bold text-[#14201A]">لا توجد طلبات مطابقة</p>
          <p className="mt-1 text-sm text-[#6B7566]">عند إرسال المستأجرين لاحتياجاتهم ستظهر هنا مباشرة.</p>
        </div>
      ) : (
        <div className="grid gap-4 motion-list">
          {requests.map(request => {
            const statusMeta = getSpaceNeedStatusMeta(request.status)
            return (
              <article key={request.id} className="premium-card overflow-hidden">
                <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="p-5 lg:p-6">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusMeta.className}`}>
                            {statusMeta.label}
                          </span>
                          <span className="rounded-full bg-[#F7F3EB] px-3 py-1 text-xs font-bold text-[#1B3A2D]">
                            {request.spaceType}
                          </span>
                        </div>
                        <h2 className="text-xl font-extrabold text-[#14201A]">
                          {request.city}{request.district ? `، ${request.district}` : ''}
                        </h2>
                        <p className="mt-1 text-sm text-[#6B7566]">
                          أرسل في {new Date(request.createdAt).toLocaleDateString('en-US')}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-[#E8E3D8] bg-[#FBFAF7] px-4 py-3 text-center">
                        <p className="text-[11px] font-bold text-[#6B7566]">السعة المطلوبة</p>
                        <p className="mt-1 text-2xl font-extrabold text-[#1B3A2D]">{request.capacity.toLocaleString('en-US')}</p>
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="rounded-2xl border border-[#E8E3D8] bg-[#FBFAF7] p-4">
                        <p className="text-[11px] font-bold text-[#6B7566]">التاريخ المتوقع</p>
                        <p className="mt-1 text-sm font-bold text-[#14201A]">{request.expectedDate || 'غير محدد'}</p>
                      </div>
                      <div className="rounded-2xl border border-[#E8E3D8] bg-[#FBFAF7] p-4 md:col-span-2">
                        <p className="text-[11px] font-bold text-[#6B7566]">الميزانية المقترحة</p>
                        <p className="mt-1 text-sm font-bold text-[#14201A]">{formatBudgetRange(request.budgetMin, request.budgetMax)}</p>
                      </div>
                    </div>

                    {request.details && (
                      <div className="mt-4 rounded-2xl border border-[#E8E3D8] bg-white p-4">
                        <p className="mb-1 text-[11px] font-bold text-[#6B7566]">تفاصيل إضافية</p>
                        <p className="text-sm leading-7 text-[#4A554D]">{request.details}</p>
                      </div>
                    )}

                    <div className="mt-4 rounded-2xl border border-[#E8E3D8] bg-[#FBFAF7] p-4">
                      <p className="mb-2 text-[11px] font-bold text-[#6B7566]">بيانات المستأجر</p>
                      <div className="grid gap-2 text-sm text-[#4A554D] md:grid-cols-3">
                        <p className="font-bold text-[#14201A]">{request.buyer.name}</p>
                        <p dir="ltr">{request.buyer.email}</p>
                        <p dir="ltr">{request.buyer.phone || 'لا يوجد رقم'}</p>
                      </div>
                    </div>
                  </div>

                  <aside className="border-t border-[#E8E3D8] bg-[#FBFAF7] p-5 lg:border-t-0 lg:border-r">
                    <p className="mb-3 text-sm font-extrabold text-[#14201A]">إدارة الطلب</p>
                    <AdminSpaceNeedActions
                      id={request.id}
                      initialStatus={request.status}
                      initialNote={request.adminNote}
                    />
                  </aside>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

type SpaceNeedRequestType = {
  id: string
  spaceType: string
  city: string
  district: string | null
  expectedDate: string | null
  capacity: number
  budgetMin: number | null
  budgetMax: number | null
  details: string | null
  status: string
  adminNote: string | null
  createdAt: Date
  buyer: { name: string; email: string; phone: string | null }
  type: { name: string } | null
}
