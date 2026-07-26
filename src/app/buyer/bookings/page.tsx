import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Badge, { getBookingStatusBadge } from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import { formatDate, formatTimeRange } from '@/lib/format'

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
    <div className="dashboard-page">
      <div className="page-hero mb-6 p-6 animate-in">
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold text-[#C49A3C] mb-2">مركز الحجوزات</p>
            <h1 className="text-2xl font-extrabold text-white">حجوزاتي</h1>
            <p className="text-white/65 text-sm mt-1">تابع حجوزاتك المؤكدة وجلساتك وخدماتك من مكان واحد</p>
          </div>
          <Link
            href="/spaces"
            className="inline-flex items-center justify-center rounded-xl bg-[#C49A3C] px-5 py-2.5 text-sm font-bold text-[#14201A] transition-transform hover:-translate-y-0.5"
          >
            تصفح المساحات
          </Link>
        </div>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <div className="text-center py-14">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-[#F7F3EB] text-[#1B3A2D] floating">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 3v3m8-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" /></svg>
            </div>
            <p className="text-gray-900 font-bold mb-1">لا توجد حجوزات بعد</p>
            <p className="text-gray-500 text-sm mb-5">ابدأ باستكشاف المساحات المناسبة لاجتماعك أو فعاليتك.</p>
            <Link
              href="/spaces"
              className="bg-[#1B3A2D] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0F2219]"
            >
              تصفح المساحات
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4 motion-list">
          {bookings.map((b) => {
            const { variant, label } = getBookingStatusBadge(b.status)
            return (
              <Card key={b.id} padding={false} className="overflow-hidden">
                <div className="flex gap-4 p-4 transition-colors hover:bg-[#FBFAF7]">
                  <div className="w-24 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
                    {b.space.images[0]?.url ? (
                      <img src={b.space.images[0].url} alt={b.space.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-[#9DA79F]"><svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M4 20h16M6 20V5h12v15M9 9h2m2 0h2m-6 4h2m2 0h2" /></svg></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{b.space.name}</h3>
                      <Badge variant={variant}>{label}</Badge>
                    </div>
                    <p className="text-gray-500 text-xs">{b.space.type.name} · {b.space.city}</p>
                    <p className="text-gray-600 text-xs mt-1">{formatDate(b.date)} · <span className="time-value">{formatTimeRange(b.startTime, b.endTime)}</span></p>
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
  date: Date
  startTime: Date
  endTime: Date
  sellerNote: string | null
  space: {
    name: string
    city: string
    type: { name: string }
    images: { url: string }[]
  }
}
