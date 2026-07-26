import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Badge, { getBookingStatusBadge } from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import { formatDate, formatNumber } from '@/lib/format'

export default async function SellerDashboard() {
  const user = await getCurrentUser()
  if (!user) return null
  const sellerId = String(user.id)

  const [spaces, bookings] = await Promise.all([
    prisma.space.findMany({ where: { sellerId } }),
    prisma.booking.findMany({
      where: { space: { sellerId } },
      include: { space: { select: { name: true } }, buyer: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])
  const stats = [
    { label: 'إجمالي المساحات', value: spaces.length, icon: BuildingIcon },
    { label: 'بانتظار المراجعة', value: spaces.filter((space) => space.status === 'PENDING_REVIEW').length, icon: ClockIcon },
    { label: 'مساحات منشورة', value: spaces.filter((space) => space.status === 'APPROVED').length, icon: CheckIcon },
    { label: 'حجوزات مؤكدة', value: bookings.filter((booking) => booking.status === 'CONFIRMED').length, icon: CalendarIcon },
  ]

  return (
    <div className="dashboard-page">
      <div className="page-hero mb-8 p-7">
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold text-[#D8B455]">لوحة صاحب المساحة</p>
            <h1 className="text-3xl font-extrabold text-white">مرحبًا بك، {String(user.name)}</h1>
            <p className="mt-2 text-sm text-white/65">تابع مساحاتك وحجوزاتك المؤكدة وجدول الإشغال من مكان واحد.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/seller/spaces/new" className="rounded-xl bg-[#D8B455] px-5 py-2.5 text-sm font-bold text-[#14201A]">إضافة مساحة</Link>
            <Link href="/seller/bookings" className="rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-bold text-white">عرض الحجوزات</Link>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => <Card key={stat.label}>
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-[#6B7566]">{stat.label}</p><p className="mt-1 text-3xl font-extrabold text-[#1B3A2D]">{formatNumber(stat.value)}</p></div>
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#EEF3EE] text-[#1B3A2D]"><stat.icon /></span>
          </div>
        </Card>)}
      </div>

      <Card padding={false}>
        <div className="flex items-center justify-between border-b border-[#E8E3D8] px-6 py-4">
          <h2 className="font-extrabold text-[#14201A]">أحدث الحجوزات</h2>
          <Link href="/seller/bookings" className="text-xs font-bold text-[#1B3A2D]">عرض الكل</Link>
        </div>
        {bookings.length === 0 ? <div className="p-10 text-center text-[#6B7566]">لا توجد حجوزات حتى الآن</div> : (
          <div className="divide-y divide-[#E8E3D8]">
            {bookings.map((booking) => {
              const badge = getBookingStatusBadge(booking.status)
              return <div key={booking.id} className="flex flex-col justify-between gap-3 px-6 py-4 sm:flex-row sm:items-center">
                <div><p className="text-sm font-bold text-[#14201A]">{booking.buyer.name}</p><p className="mt-1 text-xs text-[#6B7566]">{booking.space.name} · {formatDate(booking.date)}</p></div>
                <div className="flex items-center gap-3"><Badge variant={badge.variant}>{badge.label}</Badge><Link href={`/seller/bookings/${booking.id}`} className="text-xs font-bold text-[#1B3A2D]">التفاصيل</Link></div>
              </div>
            })}
          </div>
        )}
      </Card>
    </div>
  )
}

const Icon = ({ path }: { path: string }) => <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={path} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
const BuildingIcon = () => <Icon path="M4 21V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16M8 7h5M8 11h5M8 15h5M2 21h20" />
const ClockIcon = () => <Icon path="M12 8v4l2.5 2.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
const CheckIcon = () => <Icon path="m5 12 4 4L19 6" />
const CalendarIcon = () => <Icon path="M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" />
