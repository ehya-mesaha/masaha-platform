import { prisma } from '@/lib/prisma'
import Card from '@/components/ui/Card'
import Link from 'next/link'
import Badge, { getBookingStatusBadge } from '@/components/ui/Badge'

export default async function AdminDashboard() {
  let stats = {
    users: 0, sellers: 0, buyers: 0,
    spaces: 0, pending: 0, bookings: 0,
  }
  let pendingSpaces: PendingSpace[] = []
  let recentBookings: RecentBooking[] = []

  try {
    const [users, spaces, bookings] = await Promise.all([
      prisma.user.findMany({ select: { role: true } }),
      prisma.space.findMany({ select: { status: true } }),
      prisma.booking.findMany({
        include: {
          space: { select: { name: true } },
          buyer: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ])

    stats = {
      users: users.length,
      sellers: users.filter(u => u.role === 'SELLER').length,
      buyers: users.filter(u => u.role === 'BUYER').length,
      spaces: spaces.length,
      pending: spaces.filter(s => s.status === 'PENDING_REVIEW').length,
      bookings: bookings.length,
    }

    pendingSpaces = await prisma.space.findMany({
      where: { status: 'PENDING_REVIEW' },
      include: {
        type: true,
        seller: { select: { name: true } },
        images: { take: 1, orderBy: { order: 'asc' } },
      },
      orderBy: { createdAt: 'asc' },
      take: 5,
    }) as PendingSpace[]

    recentBookings = bookings as RecentBooking[]
  } catch {
    // DB not connected
  }

  return (
    <div className="dashboard-page">
      <div className="page-hero mb-8 p-7 animate-in">
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold text-[#D9B65C]">مركز إدارة مساحة</p>
            <h1 className="font-display text-3xl font-extrabold text-white">كل ما يحدث في المنصة، بوضوح.</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">تابع نمو المستخدمين والمساحات والحجوزات، وراجع الطلبات التي تحتاج إلى قرار من مكان واحد.</p>
          </div>
          <Link href="/admin/reports" className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/[0.07] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/[0.12]">فتح التقارير المالية</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8 stagger-grid">
        {[
          { label: 'إجمالي المستخدمين', value: stats.users, icon: '👥', color: 'text-blue-600' },
          { label: 'أصحاب المساحات', value: stats.sellers, icon: '🔑', color: 'text-purple-600' },
          { label: 'المستأجرون', value: stats.buyers, icon: '👤', color: 'text-indigo-600' },
          { label: 'إجمالي المساحات', value: stats.spaces, icon: '🏢', color: 'text-[#1B3A2D]' },
          { label: 'بانتظار المراجعة', value: stats.pending, icon: '⏳', color: 'text-amber-600' },
          { label: 'إجمالي الحجوزات', value: stats.bookings, icon: '📋', color: 'text-green-600' },
        ].map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs">{stat.label}</p>
                <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 motion-list">
        {/* Pending spaces */}
        <Card padding={false}>
          <div className="px-5 py-4 border-b border-[#E8E3D8] flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">مساحات تنتظر المراجعة</h2>
            <Link href="/admin/spaces" className="text-xs text-[#1B3A2D] hover:underline">عرض الكل</Link>
          </div>
          {pendingSpaces.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">لا توجد مساحات بانتظار المراجعة</div>
          ) : (
            <div className="divide-y divide-[#E8E3D8]">
              {pendingSpaces.map((s) => (
                <div key={s.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{s.name}</p>
                    <p className="text-gray-500 text-xs">{s.type.name} · {s.city} · {s.seller.name}</p>
                  </div>
                  <Link href={`/admin/spaces/${s.id}`} className="text-xs text-[#1B3A2D] hover:underline font-medium">
                    مراجعة
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent bookings */}
        <Card padding={false}>
          <div className="px-5 py-4 border-b border-[#E8E3D8] flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">آخر الحجوزات</h2>
            <Link href="/admin/bookings" className="text-xs text-[#1B3A2D] hover:underline">عرض الكل</Link>
          </div>
          {recentBookings.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">لا توجد حجوزات</div>
          ) : (
            <div className="divide-y divide-[#E8E3D8]">
              {recentBookings.map((b) => {
                const { variant, label } = getBookingStatusBadge(b.status)
                return (
                  <div key={b.id} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{b.buyer.name}</p>
                      <p className="text-gray-500 text-xs">{b.space.name} · {b.date}</p>
                    </div>
                    <Badge variant={variant}>{label}</Badge>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

type PendingSpace = {
  id: string
  name: string
  city: string
  type: { name: string }
  seller: { name: string }
  images: { url: string }[]
}

type RecentBooking = {
  id: string
  status: string
  date: string
  space: { name: string }
  buyer: { name: string }
}
