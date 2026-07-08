import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Badge, { getSpaceStatusBadge } from '@/components/ui/Badge'
import Card from '@/components/ui/Card'

export default async function SellerSpacesPage() {
  const user = await getCurrentUser()
  if (!user) return null

  let spaces: SpaceType[] = []

  try {
    spaces = await prisma.space.findMany({
      where: { sellerId: user.id as string },
      include: {
        type: true,
        images: { take: 1, orderBy: { order: 'asc' } },
        _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    // DB not connected
  }

  return (
    <div className="dashboard-page">
      <div className="page-hero mb-6 p-6 animate-in">
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold text-[#C49A3C] mb-2">إدارة العرض</p>
            <h1 className="text-2xl font-extrabold text-white">مساحاتي</h1>
            <p className="text-white/65 text-sm mt-1">تابع حالة النشر والحجوزات لكل مساحة من مكان واحد.</p>
          </div>
          <Link
            href="/seller/spaces/new"
            className="inline-flex items-center justify-center rounded-xl bg-[#C49A3C] px-5 py-2.5 text-sm font-bold text-[#14201A] transition-transform hover:-translate-y-0.5"
          >
            + إضافة مساحة
          </Link>
        </div>
      </div>

      {spaces.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">لا توجد مساحات بعد</h3>
            <p className="text-gray-500 text-sm mb-6">ابدأ بإضافة مساحتك الأولى</p>
            <Link
              href="/seller/spaces/new"
              className="bg-[#1B3A2D] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0F2219] transition-colors"
            >
              إضافة مساحة
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 stagger-grid">
          {spaces.map((space) => {
            const { variant, label } = getSpaceStatusBadge(space.status)
            return (
              <Card key={space.id} padding={false} className="overflow-hidden">
                <div className="flex gap-4 p-4 transition-colors hover:bg-[#FBFAF7]">
                  <div className="w-28 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
                    {space.images[0]?.url ? (
                      <img src={space.images[0].url} alt={space.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">🏢</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{space.name}</h3>
                      <Badge variant={variant}>{label}</Badge>
                    </div>
                    <p className="text-gray-500 text-xs mb-1">{space.type.name} · {space.city}</p>
                    <p className="text-[#1B3A2D] font-medium text-sm">
                      {space.price.toLocaleString('ar-SA')} ر.س / {space.pricePeriod === 'day' ? 'يوم' : 'ساعة'}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">{space._count.bookings} حجز</p>
                  </div>
                </div>
                <div className="border-t border-[#E8E3D8] px-4 py-3 flex gap-3">
                  <Link
                    href={`/seller/spaces/${space.id}`}
                    className="text-xs text-gray-600 hover:text-[#1B3A2D] font-medium"
                  >
                    عرض التفاصيل
                  </Link>
                  <span className="text-gray-200">|</span>
                  <Link
                    href={`/seller/spaces/${space.id}/edit`}
                    className="text-xs text-gray-600 hover:text-[#1B3A2D] font-medium"
                  >
                    تعديل
                  </Link>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

type SpaceType = {
  id: string
  name: string
  city: string
  status: string
  price: number
  pricePeriod: string
  type: { name: string }
  images: { url: string }[]
  _count: { bookings: number }
}
