import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import SpaceNeedRequestForm from '@/components/space-needs/SpaceNeedRequestForm'
import { formatBudgetRange, getSpaceNeedStatusMeta } from '@/lib/spaceNeeds'

export default async function BuyerSpaceNeedsPage() {
  const user = await getCurrentUser()
  if (!user) return null

  let types: { id: string; name: string }[] = []
  let requests: SpaceNeedRequestType[] = []

  try {
    types = await prisma.spaceType.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } })
    requests = await prisma.spaceNeedRequest.findMany({
      where: { buyerId: user.id as string },
      include: { type: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    }) as SpaceNeedRequestType[]
  } catch (err) {
    console.error('Failed to load buyer space needs', err)
  }

  return (
    <div className="dashboard-page">
      <div className="page-hero mb-6 p-6 animate-in">
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold text-[#C49A3C]">مساحة حسب الطلب</p>
            <h1 className="text-2xl font-extrabold text-white">احتياجاتي من المساحات</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
              عندما لا تجد مساحة مناسبة في النتائج، أرسل احتياجك للفريق ليتم البحث عن خيارات مطابقة.
            </p>
          </div>
          <Link
            href="/spaces"
            className="inline-flex items-center justify-center rounded-xl bg-[#C49A3C] px-5 py-2.5 text-sm font-bold text-[#14201A] transition-transform hover:-translate-y-0.5"
          >
            العودة للبحث
          </Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
        <SpaceNeedRequestForm types={types} />

        <section className="premium-card p-5 animate-in">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-[#C49A3C]">سجل الطلبات</p>
              <h2 className="text-lg font-extrabold text-[#14201A]">طلباتك السابقة</h2>
            </div>
            <span className="rounded-full bg-[#F7F3EB] px-3 py-1 text-xs font-bold text-[#1B3A2D]">
              {requests.length.toLocaleString('en-US')}
            </span>
          </div>

          {requests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#D8CFBE] bg-[#FBFAF7] p-8 text-center">
              <p className="font-bold text-[#14201A]">لا توجد طلبات حتى الآن</p>
              <p className="mt-1 text-sm leading-6 text-[#6B7566]">بعد إرسال أول احتياج سيظهر هنا مع حالته وملاحظات الفريق.</p>
            </div>
          ) : (
            <div className="space-y-3 motion-list">
              {requests.map(request => {
                const status = getSpaceNeedStatusMeta(request.status)
                return (
                  <article key={request.id} className="rounded-2xl border border-[#E8E3D8] bg-[#FBFAF7] p-4 hover-lift">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-[#14201A]">{request.spaceType}</h3>
                        <p className="mt-1 text-xs text-[#6B7566]">
                          {request.city}{request.district ? `، ${request.district}` : ''} · {request.capacity.toLocaleString('en-US')} شخص
                        </p>
                      </div>
                      <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="grid gap-2 text-xs text-[#4A554D] sm:grid-cols-2">
                      <p>التاريخ: {request.expectedDate || 'غير محدد'}</p>
                      <p>الميزانية: {formatBudgetRange(request.budgetMin, request.budgetMax)}</p>
                    </div>
                    {request.details && (
                      <p className="mt-3 rounded-xl bg-white px-3 py-2 text-xs leading-6 text-[#4A554D]">{request.details}</p>
                    )}
                    {request.adminNote && (
                      <p className="mt-3 rounded-xl border border-[#D9C28A] bg-[#FFF8E7] px-3 py-2 text-xs leading-6 text-[#7A5A12]">
                        ملاحظة الفريق: {request.adminNote}
                      </p>
                    )}
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>
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
  type: { name: string } | null
}
