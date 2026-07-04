import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Badge, { getBookingStatusBadge } from '@/components/ui/Badge'
import Card from '@/components/ui/Card'

export default async function SellerBookingsPage() {
  const user = await getCurrentUser()
  if (!user) return null

  let bookings: BookingType[] = []

  try {
    bookings = await prisma.booking.findMany({
      where: { space: { sellerId: user.id as string } },
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
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">طلبات الحجز</h1>
        <p className="text-gray-500 text-sm mt-1">إدارة جميع طلبات حجز مساحاتك</p>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-4">📋</div>
            <p>لا توجد طلبات حجز بعد</p>
          </div>
        </Card>
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-[#E8E3D8]">
                <tr>
                  <th className="text-right px-5 py-3 text-gray-600 font-medium">المستأجر</th>
                  <th className="text-right px-5 py-3 text-gray-600 font-medium">المساحة</th>
                  <th className="text-right px-5 py-3 text-gray-600 font-medium">التاريخ</th>
                  <th className="text-right px-5 py-3 text-gray-600 font-medium">الوقت</th>
                  <th className="text-right px-5 py-3 text-gray-600 font-medium">الحالة</th>
                  <th className="text-right px-5 py-3 text-gray-600 font-medium">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E3D8]">
                {bookings.map((b) => {
                  const { variant, label } = getBookingStatusBadge(b.status)
                  return (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">{b.buyer.name}</p>
                        <p className="text-gray-400 text-xs">{b.buyer.email}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-700">{b.space.name}</td>
                      <td className="px-5 py-4 text-gray-700">{b.date}</td>
                      <td className="px-5 py-4 text-gray-700">{b.startTime} - {b.endTime}</td>
                      <td className="px-5 py-4"><Badge variant={variant}>{label}</Badge></td>
                      <td className="px-5 py-4">
                        <Link href={`/seller/bookings/${b.id}`} className="text-[#1B3A2D] font-medium hover:underline text-xs">
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
  date: string
  startTime: string
  endTime: string
  space: { name: string }
  buyer: { name: string; email: string; phone: string | null }
}
