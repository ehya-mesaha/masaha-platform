import { prisma } from '@/lib/prisma'
import { SpaceStatus, Prisma } from '@/generated/prisma'
import Link from 'next/link'
import Badge, { getSpaceStatusBadge } from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import { formatSpaceNumber } from '@/lib/format'
import AdminDeleteButton from '@/components/admin/AdminDeleteButton'

export default async function AdminSpacesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>
}) {
  const params = await searchParams
  const status = params.status
  const query = params.q?.trim() || ''

  let spaces: SpaceType[] = []
  let totalCount = 0
  let pendingCount = 0
  let approvedCount = 0

  try {
    const where: Prisma.SpaceWhereInput = {}
    if (status) where.status = status as SpaceStatus
    if (query) {
      const digitsOnly = query.replace(/\D/g, '')
      const parsedRef = digitsOnly ? Number(digitsOnly) : NaN
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { seller: { name: { contains: query, mode: 'insensitive' } } },
        ...(Number.isFinite(parsedRef) && digitsOnly ? [{ refSeq: parsedRef }] : []),
      ]
    }

    const [raw, total, pending, approved] = await Promise.all([
      prisma.space.findMany({
        where,
        include: {
          type: true,
          seller: { select: { name: true } },
          images: { take: 1, orderBy: { order: 'asc' } },
          _count: { select: { bookings: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.space.count(),
      prisma.space.count({ where: { status: 'PENDING_REVIEW' } }),
      prisma.space.count({ where: { status: 'APPROVED' } }),
    ])
    spaces = raw as unknown as SpaceType[]
    totalCount = total
    pendingCount = pending
    approvedCount = approved
  } catch {
    // DB not connected
  }

  const tabs = [
    { label: 'الكل', value: '' },
    { label: 'بانتظار المراجعة', value: 'PENDING_REVIEW' },
    { label: 'معتمدة', value: 'APPROVED' },
    { label: 'مرفوضة', value: 'REJECTED' },
    { label: 'مسودة', value: 'DRAFT' },
  ]

  return (
    <div className="dashboard-page">
      <div className="page-hero mb-6 p-6 sm:p-8">
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-extrabold text-[#B99A63]">إدارة المحتوى والتراخيص</p>
            <h1 className="text-2xl font-extrabold text-white sm:text-3xl">المساحات</h1>
            <p className="mt-2 text-sm text-white/65">راجع بيانات المساحات وصورها وتواريخها واتخذ القرار الإداري من مكان واحد.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-white">{spaces.length} نتيجة معروضة</span>
            <Link href="/api/admin/exports/spaces?format=xlsx" prefetch={false} className="rounded-xl bg-[#D7B66D] px-4 py-2 text-xs font-extrabold text-[#092C27]">تصدير Excel</Link>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <StatCard label="إجمالي المساحات" value={totalCount} tone="dark" />
        <StatCard label="بانتظار المراجعة" value={pendingCount} tone="gold" />
        <StatCard label="مساحات معتمدة" value={approvedCount} tone="green" />
      </div>

      {/* Tabs + Search */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 flex-wrap">
          {tabs.map(tab => (
            <Link
              key={tab.value}
              href={tab.value ? `/admin/spaces?status=${tab.value}${query ? `&q=${encodeURIComponent(query)}` : ''}` : `/admin/spaces${query ? `?q=${encodeURIComponent(query)}` : ''}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                status === tab.value || (!status && tab.value === '')
                  ? 'bg-[#0E3B34] text-white'
                  : 'bg-white text-gray-600 border border-[#D8D1C7] hover:border-[#0E3B34]'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
        <form method="get" className="flex items-center gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="ابحث برقم المساحة (مثال: M-000123) أو الاسم أو المالك"
            dir="ltr"
            className="w-72 max-w-full rounded-lg border border-[#D8D1C7] px-3 py-2 text-sm text-right focus:outline-none focus:border-[#0E3B34]"
          />
          <button type="submit" className="rounded-lg bg-[#0E3B34] px-4 py-2 text-sm font-bold text-white hover:bg-[#092C27]">بحث</button>
          {query && <Link href={status ? `/admin/spaces?status=${status}` : '/admin/spaces'} className="text-xs font-bold text-[#5F6764] hover:text-[#0E3B34]">مسح</Link>}
        </form>
      </div>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-[#D8D1C7]">
              <tr>
                <th className="text-right px-5 py-3 text-gray-600 font-medium">رقم المساحة</th>
                <th className="text-right px-5 py-3 text-gray-600 font-medium">المساحة</th>
                <th className="text-right px-5 py-3 text-gray-600 font-medium">المالك</th>
                <th className="text-right px-5 py-3 text-gray-600 font-medium">النوع</th>
                <th className="text-right px-5 py-3 text-gray-600 font-medium">المدينة</th>
                <th className="text-right px-5 py-3 text-gray-600 font-medium">تاريخ الإضافة</th>
                <th className="text-right px-5 py-3 text-gray-600 font-medium">آخر تحديث</th>
                <th className="text-right px-5 py-3 text-gray-600 font-medium">الحجوزات</th>
                <th className="text-right px-5 py-3 text-gray-600 font-medium">الحالة</th>
                <th className="text-right px-5 py-3 text-gray-600 font-medium">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D1C7]">
              {spaces.length === 0 ? (
                <tr><td colSpan={10} className="text-center text-gray-500 py-10">لا توجد مساحات</td></tr>
              ) : spaces.map((s) => {
                const { variant, label } = getSpaceStatusBadge(s.status)
                return (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-5 py-4">
                      <span dir="ltr" className="rounded-full bg-[#F5F1E8] px-2.5 py-1 font-mono text-xs font-bold text-[#0E3B34]">{formatSpaceNumber(s.refSeq)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {s.images[0]?.url
                            ? <img src={s.images[0].url} alt={s.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-gray-300">🏢</div>
                          }
                        </div>
                        <p className="font-medium text-gray-900">{s.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-700">{s.seller.name}</td>
                    <td className="px-5 py-4 text-gray-700">{s.type.name}</td>
                    <td className="px-5 py-4 text-gray-700">{s.city}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-gray-600">{formatAdminDate(s.createdAt)}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-gray-600">{formatAdminDate(s.updatedAt)}</td>
                    <td className="px-5 py-4"><span className="rounded-full bg-[#F5F1E8] px-2.5 py-1 text-xs font-bold text-[#0E3B34]">{s._count.bookings}</span></td>
                    <td className="px-5 py-4"><Badge variant={variant}>{label}</Badge></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/spaces/${s.id}`} className="text-[#0E3B34] font-medium hover:underline text-xs">
                          مراجعة
                        </Link>
                        <AdminDeleteButton
                          endpoint={`/api/admin/spaces/${s.id}`}
                          label="حذف"
                          className="text-xs font-bold text-red-600 hover:text-red-800"
                          confirmMessage={`سيتم حذف مساحة "${s.name}" نهائيًا مع كل حجوزاتها (${s._count.bookings}) وتقييماتها وصورها. لا يمكن التراجع عن هذا الإجراء.`}
                          typedConfirmationValue={s.name}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

type SpaceType = {
  id: string
  refSeq: number
  name: string
  city: string
  status: string
  type: { name: string }
  seller: { name: string }
  images: { url: string }[]
  _count: { bookings: number }
  createdAt: Date
  updatedAt: Date
}

function formatAdminDate(value: Date) {
  return new Intl.DateTimeFormat('ar-SA', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
}

function StatCard({ label, value, tone }: { label: string; value: number; tone: 'dark' | 'gold' | 'green' }) {
  const tones = {
    dark: 'border-[#0E3B34]/15 bg-[#0E3B34] text-white',
    gold: 'border-[#B99A63]/25 bg-[#FFF9EA] text-[#8A671D]',
    green: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  }
  return (
    <div className={`rounded-2xl border p-5 shadow-[0_18px_50px_-42px_rgba(9, 44, 39,.7)] ${tones[tone]}`}>
      <span className="text-[11px] font-bold opacity-70">{label}</span>
      <strong className="mt-2 block text-3xl font-extrabold">{value.toLocaleString('en-US')}</strong>
    </div>
  )
}
