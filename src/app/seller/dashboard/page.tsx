import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Badge, { getBookingStatusBadge, getSpaceStatusBadge } from '@/components/ui/Badge'
import Card from '@/components/ui/Card'

export default async function SellerDashboard() {
  const user = await getCurrentUser()
  if (!user) return null

  let stats = { total: 0, pending: 0, approved: 0, newBookings: 0 }
  let recentBookings: BookingType[] = []

  try {
    const [spaces, bookings] = await Promise.all([
      prisma.space.findMany({ where: { sellerId: user.id as string } }),
      prisma.booking.findMany({
        where: { space: { sellerId: user.id as string } },
        include: {
          space: { select: { name: true } },
          buyer: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ])

    stats = {
      total: spaces.length,
      pending: spaces.filter(s => s.status === 'PENDING_REVIEW').length,
      approved: spaces.filter(s => s.status === 'APPROVED').length,
      newBookings: bookings.filter(b => b.status === 'PENDING').length,
    }
    recentBookings = bookings
  } catch {
    // DB not connected
  }

  return (
    <div className="dashboard-page">
      <div className="page-hero mb-8 p-7 animate-in">
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold text-[#C49A3C] mb-2">لوحة صاحب المساحة</p>
            <h1 className="text-3xl font-extrabold text-white">مرحباً بك في لوحة التحكم</h1>
            <p className="text-white/65 mt-2">تابع المساحات، الطلبات الجديدة، وحالة الاعتماد من مكان واحد.</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/seller/spaces/new"
              className="rounded-xl bg-[#C49A3C] px-5 py-2.5 text-sm font-bold text-[#14201A] transition-transform hover:-translate-y-0.5"
            >
              إضافة مساحة
            </Link>
            <Link
              href="/seller/bookings"
              className="rounded-xl border border-white/20 bg-white/8 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/12"
            >
              الطلبات
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-grid">
        {[
          { label: 'إجمالي المساحات', value: stats.total, icon: '🏢', color: 'text-blue-600' },
          { label: 'بانتظار المراجعة', value: stats.pending, icon: '⏳', color: 'text-amber-600' },
          { label: 'معتمدة', value: stats.approved, icon: '✅', color: 'text-green-600' },
          { label: 'طلبات جديدة', value: stats.newBookings, icon: '📋', color: 'text-[#1B3A2D]' },
        ].map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              </div>
              <div className="text-3xl floating">{stat.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="hidden">
        <Link
          href="/seller/spaces/new"
          className="bg-[#1B3A2D] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0F2219] transition-colors"
        >
          + إضافة مساحة جديدة
        </Link>
        <Link
          href="/seller/bookings"
          className="bg-white text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium border border-[#E8E3D8] hover:bg-gray-50 transition-colors"
        >
          عرض جميع الطلبات
        </Link>
      </div>

      {/* Recent bookings */}
      <Card padding={false}>
        <div className="px-6 py-4 border-b border-[#E8E3D8]">
          <h2 className="font-semibold text-gray-900">آخر طلبات الحجز</h2>
        </div>
        {recentBookings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">لا توجد طلبات حجز بعد</div>
        ) : (
          <div className="divide-y divide-[#E8E3D8] motion-list">
            {recentBookings.map((b) => {
              const { variant, label } = getBookingStatusBadge(b.status)
              return (
                <div key={b.id} className="px-6 py-4 flex items-center justify-between transition-colors hover:bg-[#FBFAF7]">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{b.buyer.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{b.space.name} · {b.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={variant}>{label}</Badge>
                    <Link
                      href={`/seller/bookings/${b.id}`}
                      className="text-xs text-[#1B3A2D] hover:underline"
                    >
                      عرض
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}

type BookingType = {
  id: string
  status: string
  date: string
  space: { name: string }
  buyer: { name: string }
}
