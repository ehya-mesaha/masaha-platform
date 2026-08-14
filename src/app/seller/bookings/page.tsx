import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Badge, { getBookingStatusBadge } from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import { formatDate, formatTimeRange } from '@/lib/format'

export default async function SellerBookingsPage() {
  const user = await getCurrentUser()
  if (!user) return null

  let bookings: BookingType[] = []

  try {
    bookings = await prisma.booking.findMany({
      where: {
        space: { sellerId: user.id as string },
        status: { in: ['CONFIRMED', 'CANCELLED_BY_BUYER', 'CANCELLED_BY_SELLER', 'COMPLETED'] },
      },
      include: {
        space: { select: { name: true } },
        buyer: { select: { name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    }) as BookingType[]
  } catch {
    // DB not connected
  }

  return (
    <div className="dashboard-page">
      <div className="page-hero mb-6 p-6 animate-in">
        <div className="relative">
          <p className="text-xs font-bold text-[#B99A63] mb-2">إدارة الحجوزات</p>
          <h1 className="text-2xl font-extrabold text-white">حجوزاتي</h1>
          <p className="text-white/65 text-sm mt-1">تابع الحجوزات المؤكدة والوحدات والخدمات، وأكملها بعد انتهاء الاستخدام.</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-gray-500">
            <svg className="mx-auto mb-4 h-10 w-10 text-[#0E3B34]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M8 3v3m8-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" /></svg>
            <p>لا توجد حجوزات بعد</p>
          </div>
        </Card>
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-[#D8D1C7]">
                <tr>
                  <th className="text-right px-5 py-3 text-gray-600 font-medium">طالب المساحة</th>
                  <th className="text-right px-5 py-3 text-gray-600 font-medium">المساحة</th>
                  <th className="text-right px-5 py-3 text-gray-600 font-medium">التاريخ</th>
                  <th className="text-right px-5 py-3 text-gray-600 font-medium">الوقت</th>
                  <th className="text-right px-5 py-3 text-gray-600 font-medium">الحالة</th>
                  <th className="text-right px-5 py-3 text-gray-600 font-medium">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D1C7]">
                {bookings.map((b) => {
                  const { variant, label } = getBookingStatusBadge(b.status)
                  return (
                    <tr key={b.id} className="transition-colors hover:bg-[#FAF8F3]">
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">{b.buyer.name}</p>
                        <p className="text-gray-400 text-xs">{b.buyer.email}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-700">{b.space.name}</td>
                      <td className="px-5 py-4 text-gray-700">{formatDate(b.date)}</td>
                      <td className="time-value px-5 py-4 text-gray-700">{formatTimeRange(b.startTime, b.endTime)}</td>
                      <td className="px-5 py-4"><Badge variant={variant}>{label}</Badge></td>
                      <td className="px-5 py-4">
                        <Link href={`/seller/bookings/${b.id}`} className="text-[#0E3B34] font-medium hover:underline text-xs">
                          عرض
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
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
  space: { name: string }
  buyer: { name: string; email: string; phone: string | null }
}
