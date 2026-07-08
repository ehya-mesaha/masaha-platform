import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Badge, { getBookingStatusBadge } from '@/components/ui/Badge'
import Card from '@/components/ui/Card'

export default async function BuyerBookingsPage() {
  const user = await getCurrentUser()
  if (!user) return null

  let bookings: BookingType[] = []

  try {
    bookings = await prisma.booking.findMany({
      where: { buyerId: user.id as string },
      include: {
        space: {
          include: {
            type: true,
            images: { take: 1, orderBy: { order: 'asc' } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }) as BookingType[]
  } catch {
    // DB not connected
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">حجوزاتي</h1>
          <p className="text-gray-500 text-sm mt-1">متابعة جميع طلبات الحجز</p>
        </div>
        <Link
          href="/spaces"
          className="bg-[#1B3A2D] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0F2219]"
        >
          تصفح المساحات
        </Link>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gray-500 mb-4">لا توجد حجوزات بعد</p>
            <Link
              href="/spaces"
              className="bg-[#1B3A2D] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0F2219]"
            >
              تصفح المساحات
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => {
            const { variant, label } = getBookingStatusBadge(b.status)
            return (
              <Card key={b.id} padding={false}>
                <div className="flex gap-4 p-4">
                  <div className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    {b.space.images[0]?.url ? (
                      <img src={b.space.images[0].url} alt={b.space.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">🏢</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{b.space.name}</h3>
                      <Badge variant={variant}>{label}</Badge>
                    </div>
                    <p className="text-gray-500 text-xs">{b.space.type.name} · {b.space.city}</p>
                    <p className="text-gray-600 text-xs mt-1">{b.date} · {b.startTime} - {b.endTime}</p>
                    {b.sellerNote && (
                      <p className="text-amber-700 text-xs mt-1 bg-amber-50 px-2 py-1 rounded">ملاحظة صاحب المساحة: {b.sellerNote}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link href={`/buyer/bookings/${b.id}`} className="text-xs text-[#1B3A2D] hover:underline font-medium whitespace-nowrap">
                      عرض
                    </Link>
                    {b.status === 'COMPLETED' && (
                      <span className="text-[11px] font-semibold text-[#C49A3C]">
                        جاهز للتقييم
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

type BookingType = {
  id: string
  status: string
  date: string
  startTime: string
  endTime: string
  sellerNote: string | null
  space: {
    name: string
    city: string
    type: { name: string }
    images: { url: string }[]
  }
}
