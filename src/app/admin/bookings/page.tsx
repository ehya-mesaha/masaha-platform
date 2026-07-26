import { prisma } from '@/lib/prisma'
import Badge, { getBookingStatusBadge } from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import { formatDate, formatTimeRange } from '@/lib/format'

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: {
      unit: { select: { label: true } },
      space: { select: { name: true, type: { select: { name: true } } } },
      buyer: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  }).catch(() => [])

  return (
    <div className="dashboard-page">
      <div className="page-hero mb-6 p-6">
        <p className="mb-2 text-xs font-bold text-[#D8B455]">متابعة التشغيل</p>
        <h1 className="text-2xl font-extrabold text-white">جميع الحجوزات</h1>
        <p className="mt-2 text-sm text-white/65">سجل موحد للحجوزات المؤكدة والملغاة والمكتملة، دون أي عمليات دفع.</p>
      </div>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[#E8E3D8] bg-[#FBFAF7]">
              <tr>
                <th className="px-5 py-3 text-right font-bold text-[#59645C]">طالب المساحة</th>
                <th className="px-5 py-3 text-right font-bold text-[#59645C]">المساحة والوحدة</th>
                <th className="px-5 py-3 text-right font-bold text-[#59645C]">الموعد</th>
                <th className="px-5 py-3 text-right font-bold text-[#59645C]">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3D8]">
              {bookings.length === 0 ? (
                <tr><td colSpan={4} className="py-12 text-center text-[#6B7566]">لا توجد حجوزات حتى الآن</td></tr>
              ) : bookings.map((booking) => {
                const badge = getBookingStatusBadge(booking.status)
                return (
                  <tr key={booking.id} className="hover:bg-[#FBFAF7]">
                    <td className="px-5 py-4">
                      <p className="font-bold text-[#14201A]">{booking.buyer.name}</p>
                      <p className="text-xs text-[#7A847D]">{booking.buyer.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-[#14201A]">{booking.space.name}</p>
                      <p className="text-xs text-[#7A847D]">{booking.space.type.name} · {booking.unit.label}</p>
                    </td>
                    <td className="px-5 py-4 text-[#3F4A42]">
                      <p>{formatDate(booking.date)}</p>
                      <p className="time-value mt-1 text-xs">{formatTimeRange(booking.startTime, booking.endTime)}</p>
                    </td>
                    <td className="px-5 py-4"><Badge variant={badge.variant}>{badge.label}</Badge></td>
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
