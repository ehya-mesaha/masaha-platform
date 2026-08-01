import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Badge, { getBookingStatusBadge } from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import { formatDate, formatTimeRange } from '@/lib/format'
import AdminDeleteButton from '@/components/admin/AdminDeleteButton'

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
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold text-[#B99A63]">متابعة التشغيل</p>
            <h1 className="text-2xl font-extrabold text-white">جميع الحجوزات</h1>
            <p className="mt-2 text-sm text-white/65">سجل موحد للحجوزات المؤكدة والملغاة والمكتملة، دون أي عمليات دفع.</p>
          </div>
          <Link href="/api/admin/exports/bookings?format=xlsx" prefetch={false} className="rounded-xl bg-[#D7B66D] px-5 py-2.5 text-sm font-extrabold text-[#092C27]">تصدير Excel</Link>
        </div>
      </div>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[#D8D1C7] bg-[#FAF8F3]">
              <tr>
                <th className="px-5 py-3 text-right font-bold text-[#59645C]">طالب المساحة</th>
                <th className="px-5 py-3 text-right font-bold text-[#59645C]">المساحة والوحدة</th>
                <th className="px-5 py-3 text-right font-bold text-[#59645C]">الموعد</th>
                <th className="px-5 py-3 text-right font-bold text-[#59645C]">الحالة</th>
                <th className="px-5 py-3 text-right font-bold text-[#59645C]">الإدارة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D1C7]">
              {bookings.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-[#5F6764]">لا توجد حجوزات حتى الآن</td></tr>
              ) : bookings.map((booking) => {
                const badge = getBookingStatusBadge(booking.status)
                return (
                  <tr key={booking.id} className="hover:bg-[#FAF8F3]">
                    <td className="px-5 py-4">
                      <p className="font-bold text-[#1B1B1B]">{booking.buyer.name}</p>
                      <p className="text-xs text-[#7A847D]">{booking.buyer.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-[#1B1B1B]">{booking.space.name}</p>
                      <p className="text-xs text-[#7A847D]">{booking.space.type.name} · {booking.unit.label}</p>
                    </td>
                    <td className="px-5 py-4 text-[#3F4A42]">
                      <p>{formatDate(booking.date)}</p>
                      <p className="time-value mt-1 text-xs">{formatTimeRange(booking.startTime, booking.endTime)}</p>
                    </td>
                    <td className="px-5 py-4"><Badge variant={badge.variant}>{badge.label}</Badge></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/bookings/${booking.id}`} className="text-xs font-extrabold text-[#0E3B34] hover:text-[#9A762D]">عرض وإدارة</Link>
                        <AdminDeleteButton
                          endpoint={`/api/admin/bookings/${booking.id}`}
                          label="حذف"
                          className="text-xs font-bold text-red-600 hover:text-red-800"
                          confirmMessage={`سيتم حذف حجز "${booking.buyer.name}" في "${booking.space.name}" نهائيًا مع أي تقييم مرتبط به. لا يمكن التراجع عن هذا الإجراء.`}
                        />
                      </div>
                    </td>
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
