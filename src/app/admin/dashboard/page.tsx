import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import Card from '@/components/ui/Card'
import Badge, { getBookingStatusBadge } from '@/components/ui/Badge'
import { formatDate, formatNumber } from '@/lib/format'

export default async function AdminDashboard() {
  const [users, spaces, recentBookings, pendingSpaces] = await Promise.all([
    prisma.user.findMany({ select: { role: true } }).catch(() => []),
    prisma.space.findMany({ select: { status: true } }).catch(() => []),
    prisma.booking.findMany({
      include: { space: { select: { name: true } }, buyer: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }).catch(() => []),
    prisma.space.findMany({
      where: { status: 'PENDING_REVIEW' },
      include: { type: true, seller: { select: { name: true } } },
      orderBy: { createdAt: 'asc' },
      take: 5,
    }).catch(() => []),
  ])
  const stats = [
    ['إجمالي المستخدمين', users.length, UsersIcon],
    ['أصحاب المساحات', users.filter((user) => user.role === 'SELLER').length, KeyIcon],
    ['طلاب المساحات', users.filter((user) => user.role === 'BUYER').length, UserIcon],
    ['إجمالي المساحات', spaces.length, BuildingIcon],
    ['بانتظار المراجعة', spaces.filter((space) => space.status === 'PENDING_REVIEW').length, ClockIcon],
    ['الحجوزات', await prisma.booking.count().catch(() => 0), CalendarIcon],
  ] as const

  return (
    <div className="dashboard-page">
      <div className="page-hero mb-8 p-7">
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold text-[#B99A63]">مركز إدارة إحياء مساحة</p>
            <h1 className="text-3xl font-extrabold text-white">كل ما يحدث في المنصة، بوضوح.</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">تابع نمو المستخدمين والمساحات والحجوزات، وراجع العناصر التي تحتاج إلى قرار.</p>
          </div>
          <Link href="/admin/reports" className="rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-bold text-white">فتح التقارير التشغيلية</Link>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {stats.map(([label, value, StatIcon]) => <Card key={label}>
          <div className="flex items-center justify-between">
            <div><p className="text-xs text-[#5F6764]">{label}</p><p className="mt-1 text-3xl font-extrabold text-[#0E3B34]">{formatNumber(value)}</p></div>
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#EEF3EE] text-[#0E3B34]"><StatIcon /></span>
          </div>
        </Card>)}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card padding={false}>
          <PanelTitle title="مساحات تنتظر المراجعة" href="/admin/spaces" />
          {pendingSpaces.length === 0 ? <Empty text="لا توجد مساحات بانتظار المراجعة" /> : <div className="divide-y divide-[#D8D1C7]">
            {pendingSpaces.map((space) => <div key={space.id} className="flex items-center justify-between px-5 py-4">
              <div><p className="text-sm font-bold text-[#1B1B1B]">{space.name}</p><p className="mt-1 text-xs text-[#5F6764]">{space.type.name} · {space.city} · {space.seller.name}</p></div>
              <Link href={`/admin/spaces/${space.id}`} className="text-xs font-bold text-[#0E3B34]">مراجعة</Link>
            </div>)}
          </div>}
        </Card>

        <Card padding={false}>
          <PanelTitle title="أحدث الحجوزات" href="/admin/bookings" />
          {recentBookings.length === 0 ? <Empty text="لا توجد حجوزات حتى الآن" /> : <div className="divide-y divide-[#D8D1C7]">
            {recentBookings.map((booking) => {
              const badge = getBookingStatusBadge(booking.status)
              return <div key={booking.id} className="flex items-center justify-between px-5 py-4">
                <div><p className="text-sm font-bold text-[#1B1B1B]">{booking.buyer.name}</p><p className="mt-1 text-xs text-[#5F6764]">{booking.space.name} · {formatDate(booking.date)}</p></div>
                <Badge variant={badge.variant}>{badge.label}</Badge>
              </div>
            })}
          </div>}
        </Card>
      </div>
    </div>
  )
}

function PanelTitle({ title, href }: { title: string; href: string }) {
  return <div className="flex items-center justify-between border-b border-[#D8D1C7] px-5 py-4"><h2 className="font-extrabold text-[#1B1B1B]">{title}</h2><Link href={href} className="text-xs font-bold text-[#0E3B34]">عرض الكل</Link></div>
}
function Empty({ text }: { text: string }) { return <div className="p-10 text-center text-sm text-[#5F6764]">{text}</div> }
const SvgIcon = ({ children }: { children: React.ReactNode }) => <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
const UsersIcon = () => <SvgIcon><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></SvgIcon>
const KeyIcon = () => <SvgIcon><circle cx="8" cy="15" r="4" /><path d="m11 12 9-9m-4 4 2 2m-5 1 2 2" /></SvgIcon>
const UserIcon = () => <SvgIcon><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></SvgIcon>
const BuildingIcon = () => <SvgIcon><path d="M4 21V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16M8 7h5M8 11h5M8 15h5M2 21h20" /></SvgIcon>
const ClockIcon = () => <SvgIcon><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></SvgIcon>
const CalendarIcon = () => <SvgIcon><path d="M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" /></SvgIcon>
