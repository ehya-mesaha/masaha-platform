import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Badge, { getSpaceStatusBadge, getBookingStatusBadge } from '@/components/ui/Badge'
import Card from '@/components/ui/Card'

export default async function SellerSpaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getCurrentUser()
  if (!user) return null

  const { id } = await params

  let space: SpaceType | null = null

  try {
    space = await prisma.space.findUnique({
      where: { id },
      include: {
        type: true,
        images: { orderBy: { order: 'asc' } },
        amenities: { include: { amenity: true } },
        bookings: {
          include: { buyer: { select: { name: true, email: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    }) as SpaceType | null
  } catch {
    // DB not connected
  }

  if (!space) return notFound()

  const { variant, label } = getSpaceStatusBadge(space.status)
  const mapHref = space.latitude && space.longitude
    ? `https://www.google.com/maps/search/?api=1&query=${space.latitude},${space.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([space.district, space.city].filter(Boolean).join(', '))}`

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/seller/spaces" className="text-gray-400 hover:text-gray-600 text-sm">
          ← مساحاتي
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-700 text-sm font-medium">{space.name}</span>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{space.name}</h1>
          <p className="text-gray-500 text-sm mt-1">{space.type.name} · {space.city}</p>
          <Card>
            <h3 className="font-semibold text-gray-900 mb-3">الموقع</h3>
            <p className="text-sm text-gray-600 mb-3">{[space.district, space.city].filter(Boolean).join('، ')}</p>
            {space.latitude && space.longitude && (
              <div className="rounded-xl overflow-hidden border border-[#E8E3D8] mb-3">
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${space.longitude - 0.01},${space.latitude - 0.01},${space.longitude + 0.01},${space.latitude + 0.01}&layer=mapnik&marker=${space.latitude},${space.longitude}`}
                  className="w-full h-56"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>
            )}
            <a
              href={mapHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center rounded-xl bg-[#1B3A2D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0F2219] transition-colors"
            >
              فتح الموقع في الخرائط
            </a>
          </Card>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={variant}>{label}</Badge>
          <Link
            href={`/seller/spaces/${id}/edit`}
            className="bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-medium border border-[#E8E3D8] hover:bg-gray-50"
          >
            تعديل
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Images */}
          {space.images.length > 0 && (
            <Card padding={false}>
              <div className="p-4">
                <img src={space.images[0].url} alt={space.name} className="w-full h-48 object-cover rounded-xl" />
              </div>
            </Card>
          )}

          {/* Info */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">تفاصيل المساحة</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">المدينة</span><p className="font-medium mt-0.5">{space.city}</p></div>
              <div><span className="text-gray-500">الحي</span><p className="font-medium mt-0.5">{space.district || '-'}</p></div>
              <div><span className="text-gray-500">السعر</span><p className="font-medium mt-0.5">{space.price} ر.س / {space.pricePeriod === 'day' ? 'يوم' : 'ساعة'}</p></div>
              <div><span className="text-gray-500">الطاقة</span><p className="font-medium mt-0.5">{space.capacity || '-'} شخص</p></div>
            </div>
            {space.description && (
              <div className="mt-4 pt-4 border-t border-[#E8E3D8]">
                <p className="text-gray-500 text-xs mb-1">الوصف</p>
                <p className="text-gray-700 text-sm">{space.description}</p>
              </div>
            )}
            {space.adminNotes && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs font-medium text-amber-700 mb-1">ملاحظات الإدارة:</p>
                <p className="text-sm text-amber-800">{space.adminNotes}</p>
              </div>
            )}
          </Card>

          {/* Amenities */}
          {space.amenities.length > 0 && (
            <Card>
              <h3 className="font-semibold text-gray-900 mb-3">المرافق</h3>
              <div className="flex flex-wrap gap-2">
                {space.amenities.map(({ amenity }) => (
                  <span key={amenity.id} className="bg-[#F5F0E6] text-[#1B3A2D] text-xs px-3 py-1.5 rounded-full">
                    {amenity.name}
                  </span>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Bookings */}
        <div>
          <Card padding={false}>
            <div className="px-5 py-4 border-b border-[#E8E3D8]">
              <h3 className="font-semibold text-gray-900">الحجوزات</h3>
            </div>
            {space.bookings.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">لا توجد حجوزات</div>
            ) : (
              <div className="divide-y divide-[#E8E3D8]">
                {space.bookings.map((b) => {
                  const { variant, label } = getBookingStatusBadge(b.status)
                  return (
                    <div key={b.id} className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900">{b.buyer.name}</p>
                        <Badge variant={variant}>{label}</Badge>
                      </div>
                      <p className="text-xs text-gray-500">{b.date} · {b.startTime} - {b.endTime}</p>
                      <Link href={`/seller/bookings/${b.id}`} className="text-xs text-[#1B3A2D] hover:underline mt-1 block">
                        عرض التفاصيل
                      </Link>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

type SpaceType = {
  id: string
  name: string
  city: string
  district: string | null
  description: string | null
  status: string
  price: number
  pricePeriod: string
  capacity: number | null
  latitude: number | null
  longitude: number | null
  adminNotes: string | null
  type: { name: string }
  images: { url: string; order: number }[]
  amenities: { amenity: { id: string; name: string } }[]
  bookings: {
    id: string
    status: string
    date: string
    startTime: string
    endTime: string
    buyer: { name: string; email: string }
  }[]
}
