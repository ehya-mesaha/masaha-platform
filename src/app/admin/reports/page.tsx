import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Badge, { getBookingStatusBadge } from '@/components/ui/Badge'

const MONTHS = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
]

const COMMISSION_RATE = 0.1

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>
}) {
  const params = await searchParams
  const selectedYear = Number(params.year || new Date().getFullYear())
  const availableYears = [selectedYear - 1, selectedYear, selectedYear + 1]

  let bookings: BookingFinancialType[] = []

  try {
    bookings = await prisma.booking.findMany({
      where: {
        status: { in: ['ACCEPTED', 'COMPLETED'] },
        date: { startsWith: String(selectedYear) },
      },
      include: {
        space: {
          select: {
            name: true,
            price: true,
            pricePeriod: true,
            seller: { select: { name: true } },
          },
        },
        buyer: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    }) as BookingFinancialType[]
  } catch (err) {
    console.error('Failed to load financial reports', err)
  }

  const monthly = MONTHS.map((month, index) => {
    const total = bookings
      .filter(booking => new Date(`${booking.date}T00:00:00`).getMonth() === index)
      .reduce((sum, booking) => sum + calculateBookingAmount(booking), 0)
    return { month, total }
  })
  const maxMonthly = Math.max(...monthly.map(item => item.total), 1)
  const totalRevenue = bookings.reduce((sum, booking) => sum + calculateBookingAmount(booking), 0)
  const completedRevenue = bookings
    .filter(booking => booking.status === 'COMPLETED')
    .reduce((sum, booking) => sum + calculateBookingAmount(booking), 0)
  const pendingSellerAmount = bookings
    .filter(booking => booking.status === 'ACCEPTED')
    .reduce((sum, booking) => sum + calculateBookingAmount(booking) * (1 - COMMISSION_RATE), 0)
  const commission = totalRevenue * COMMISSION_RATE

  return (
    <div className="dashboard-page">
      <div className="page-hero mb-6 p-6 animate-in">
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold text-[#C49A3C]">تقارير مالية</p>
            <h1 className="text-2xl font-extrabold text-white">لوحة التقارير المالية</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/65">
              متابعة الإيرادات المقدرة، عمولات المنصة، والمبالغ قيد التحويل لأصحاب المساحات.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableYears.map(year => (
              <Link
                key={year}
                href={`/admin/reports?year=${year}`}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
                  selectedYear === year
                    ? 'bg-[#C49A3C] text-[#14201A]'
                    : 'bg-white/10 text-white hover:bg-white/15'
                }`}
              >
                عام {year}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-4">
        <FinancialCard label="إجمالي الإيرادات" value={totalRevenue} />
        <FinancialCard label="الرصيد المعلق للتحويل" value={pendingSellerAmount} />
        <FinancialCard label="عمولات المنصة" value={commission} />
        <FinancialCard label="إيرادات مكتملة" value={completedRevenue} />
      </div>

      <section className="premium-card mb-6 p-6 animate-in">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#C49A3C]">الإيرادات الشهرية</p>
            <h2 className="text-lg font-extrabold text-[#14201A]">عام {selectedYear}</h2>
          </div>
          <span className="rounded-full bg-[#F7F3EB] px-3 py-1 text-xs font-bold text-[#1B3A2D]">
            {bookings.length.toLocaleString('ar-SA')} حجز
          </span>
        </div>
        <div className="flex h-72 items-end gap-3 border-b border-[#E8E3D8] px-2 pb-4">
          {monthly.map(item => {
            const height = Math.max((item.total / maxMonthly) * 100, item.total > 0 ? 8 : 2)
            return (
              <div key={item.month} className="flex h-full flex-1 flex-col justify-end gap-2">
                <div className="relative flex flex-1 items-end">
                  <div
                    className="w-full rounded-t-xl bg-gradient-to-t from-[#1B3A2D] to-[#C49A3C] transition-all duration-500 hover:opacity-90"
                    style={{ height: `${height}%` }}
                    title={`${item.total.toLocaleString('ar-SA')} ر.س`}
                  />
                </div>
                <p className="text-center text-[11px] font-semibold text-[#6B7566]">{item.month}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="premium-card overflow-hidden animate-in">
        <div className="border-b border-[#E8E3D8] px-6 py-4">
          <p className="text-xs font-bold text-[#C49A3C]">سجل العمليات</p>
          <h2 className="text-lg font-extrabold text-[#14201A]">أحدث الحجوزات المالية</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#FBFAF7]">
              <tr>
                <th className="px-5 py-3 text-right font-bold text-[#6B7566]">المساحة</th>
                <th className="px-5 py-3 text-right font-bold text-[#6B7566]">صاحب المساحة</th>
                <th className="px-5 py-3 text-right font-bold text-[#6B7566]">المستأجر</th>
                <th className="px-5 py-3 text-right font-bold text-[#6B7566]">التاريخ</th>
                <th className="px-5 py-3 text-right font-bold text-[#6B7566]">المبلغ</th>
                <th className="px-5 py-3 text-right font-bold text-[#6B7566]">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3D8]">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#6B7566]">لا توجد عمليات مالية لهذا العام</td>
                </tr>
              ) : bookings.slice(0, 12).map(booking => {
                const badge = getBookingStatusBadge(booking.status)
                return (
                  <tr key={booking.id} className="transition-colors hover:bg-[#FBFAF7]">
                    <td className="px-5 py-4 font-bold text-[#14201A]">{booking.space.name}</td>
                    <td className="px-5 py-4 text-[#4A554D]">{booking.space.seller.name}</td>
                    <td className="px-5 py-4 text-[#4A554D]">{booking.buyer.name}</td>
                    <td className="px-5 py-4 text-[#4A554D]">{booking.date}</td>
                    <td className="px-5 py-4 font-extrabold text-[#1B3A2D]">{calculateBookingAmount(booking).toLocaleString('ar-SA')} ر.س</td>
                    <td className="px-5 py-4"><Badge variant={badge.variant}>{badge.label}</Badge></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function FinancialCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="premium-card p-5 animate-in">
      <p className="text-xs font-bold text-[#6B7566]">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-[#1B3A2D]">{Math.round(value).toLocaleString('ar-SA')}</p>
      <p className="mt-1 text-xs font-semibold text-[#C49A3C]">ر.س</p>
    </div>
  )
}

function calculateBookingAmount(booking: BookingFinancialType) {
  if (booking.space.pricePeriod === 'day') return booking.space.price

  const [startHour = 0, startMinute = 0] = booking.startTime.split(':').map(Number)
  const [endHour = 0, endMinute = 0] = booking.endTime.split(':').map(Number)
  const start = startHour + startMinute / 60
  const end = endHour + endMinute / 60
  const hours = Math.max(end - start, 1)
  return hours * booking.space.price
}

type BookingFinancialType = {
  id: string
  date: string
  startTime: string
  endTime: string
  status: string
  space: {
    name: string
    price: number
    pricePeriod: string
    seller: { name: string }
  }
  buyer: { name: string }
}
