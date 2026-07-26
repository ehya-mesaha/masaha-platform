import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import Badge, { getBookingStatusBadge } from '@/components/ui/Badge'
import { formatDate, formatNumber } from '@/lib/format'

const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']

export default async function AdminReportsPage({ searchParams }: { searchParams: Promise<{ year?: string }> }) {
  const params = await searchParams
  const selectedYear = Number(params.year || new Date().getFullYear())
  const from = new Date(`${selectedYear}-01-01T00:00:00+03:00`)
  const to = new Date(`${selectedYear + 1}-01-01T00:00:00+03:00`)
  const bookings = await prisma.booking.findMany({
    where: { date: { gte: from, lt: to } },
    include: {
      space: { select: { name: true, seller: { select: { name: true } } } },
      buyer: { select: { name: true } },
    },
    orderBy: { date: 'desc' },
  }).catch(() => [])

  const completed = bookings.filter((booking) => booking.status === 'COMPLETED').length
  const confirmed = bookings.filter((booking) => booking.status === 'CONFIRMED').length
  const cancelled = bookings.filter((booking) => booking.status.startsWith('CANCELLED')).length
  const totalHours = bookings
    .filter((booking) => booking.status === 'CONFIRMED' || booking.status === 'COMPLETED')
    .reduce((sum, booking) => sum + booking.totalHours, 0)
  const monthly = MONTHS.map((month, index) => ({
    month,
    count: bookings.filter((booking) => booking.date.getMonth() === index).length,
  }))
  const maxMonthly = Math.max(...monthly.map((item) => item.count), 1)

  return (
    <div className="dashboard-page">
      <div className="page-hero mb-6 p-6">
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold text-[#B99A63]">تقارير تشغيلية</p>
            <h1 className="text-2xl font-extrabold text-white">أداء الحجوزات والاستخدام</h1>
            <p className="mt-2 text-sm text-white/65">مؤشرات الإشغال والحجوزات فقط؛ التقارير المالية خارج النطاق الحالي.</p>
          </div>
          <div className="flex gap-2">
            {[selectedYear - 1, selectedYear, selectedYear + 1].map((year) => (
              <Link key={year} href={`/admin/reports?year=${year}`} className={`rounded-xl px-4 py-2 text-sm font-bold ${year === selectedYear ? 'bg-[#B99A63] text-[#1B1B1B]' : 'bg-white/10 text-white'}`}>
                {formatNumber(year)}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="حجوزات مؤكدة" value={confirmed} />
        <Metric label="حجوزات مكتملة" value={completed} />
        <Metric label="حجوزات ملغاة" value={cancelled} />
        <Metric label="إجمالي ساعات الاستخدام" value={totalHours} suffix="ساعة" />
      </div>

      <section className="premium-card mb-6 p-6">
        <p className="text-xs font-bold text-[#B99A63]">التوزيع الشهري</p>
        <h2 className="mb-6 text-lg font-extrabold text-[#1B1B1B]">حجوزات عام {formatNumber(selectedYear)}</h2>
        <div className="flex h-64 items-end gap-2 border-b border-[#D8D1C7] pb-4">
          {monthly.map((item) => (
            <div key={item.month} className="flex h-full flex-1 flex-col justify-end gap-2">
              <div className="flex flex-1 items-end">
                <div className="w-full rounded-t-lg bg-gradient-to-t from-[#0E3B34] to-[#B99A63]" style={{ height: `${Math.max((item.count / maxMonthly) * 100, item.count ? 8 : 2)}%` }} title={`${formatNumber(item.count)} حجز`} />
              </div>
              <span className="text-center text-[10px] font-semibold text-[#5F6764]">{item.month}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="premium-card overflow-hidden">
        <div className="border-b border-[#D8D1C7] px-6 py-4">
          <h2 className="text-lg font-extrabold text-[#1B1B1B]">أحدث الحجوزات</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#FAF8F3]"><tr>
              {['المساحة', 'صاحب المساحة', 'طالب المساحة', 'التاريخ', 'الساعات', 'الحالة'].map((heading) => <th key={heading} className="px-5 py-3 text-right font-bold text-[#5F6764]">{heading}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-[#D8D1C7]">
              {bookings.slice(0, 12).map((booking) => {
                const badge = getBookingStatusBadge(booking.status)
                return <tr key={booking.id}>
                  <td className="px-5 py-4 font-bold">{booking.space.name}</td>
                  <td className="px-5 py-4">{booking.space.seller.name}</td>
                  <td className="px-5 py-4">{booking.buyer.name}</td>
                  <td className="px-5 py-4">{formatDate(booking.date)}</td>
                  <td className="px-5 py-4">{formatNumber(booking.totalHours)}</td>
                  <td className="px-5 py-4"><Badge variant={badge.variant}>{badge.label}</Badge></td>
                </tr>
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function Metric({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return <div className="premium-card p-5">
    <p className="text-xs font-bold text-[#5F6764]">{label}</p>
    <p className="mt-2 text-3xl font-extrabold text-[#0E3B34]">{formatNumber(value)}</p>
    {suffix && <p className="mt-1 text-xs font-semibold text-[#B99A63]">{suffix}</p>}
  </div>
}
