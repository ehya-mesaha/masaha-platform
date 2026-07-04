import { prisma } from '@/lib/prisma'
import Badge, { getBookingStatusBadge } from '@/components/ui/Badge'
import Card from '@/components/ui/Card'

export default async function AdminBookingsPage() {
  let bookings: BookingType[] = []

  try {
    bookings = await prisma.booking.findMany({
      include: {
        space: { select: { name: true, type: { select: { name: true } } } },
        buyer: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    }) as BookingType[]
  } catch {
    // DB not connected
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">الحجوزات</h1>

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
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3D8]">
              {bookings.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-gray-500 py-10">لا توجد حجوزات</td></tr>
              ) : bookings.map((b) => {
                const { variant, label } = getBookingStatusBadge(b.status)
                return (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{b.buyer.name}</p>
                      <p className="text-gray-400 text-xs">{b.buyer.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{b.space.name}</p>
                      <p className="text-gray-400 text-xs">{b.space.type.name}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-700">{b.date}</td>
                    <td className="px-5 py-4 text-gray-700">{b.startTime} - {b.endTime}</td>
                    <td className="px-5 py-4"><Badge variant={variant}>{label}</Badge></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

type BookingType = {
  id: string
  status: string
  date: string
  startTime: string
  endTime: string
  space: { name: string; type: { name: string } }
  buyer: { name: string; email: string }
}
