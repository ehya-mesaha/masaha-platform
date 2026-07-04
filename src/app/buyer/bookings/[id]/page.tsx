'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Badge, { getBookingStatusBadge } from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import Link from 'next/link'

type Booking = {
  id: string
  status: string
  date: string
  startTime: string
  endTime: string
  persons: number | null
  notes: string | null
  sellerNote: string | null
  space: {
    name: string
    city: string
    price: number
    pricePeriod: string
    type: { name: string }
    images: { url: string }[]
  }
}

export default function BuyerBookingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    fetch(`/api/bookings/${id}`)
      .then(r => r.json())
      .then(data => { setBooking(data.booking); setLoading(false) })
  }, [id])

  async function handleCancel() {
    if (!confirm('هل أنت متأكد من إلغاء الحجز؟')) return
    setCancelling(true)
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CANCELLED' }),
    })
    if (res.ok) {
      const data = await res.json()
      setBooking(prev => prev ? { ...prev, status: data.booking.status } : null)
    }
    setCancelling(false)
  }

  if (loading) return <div className="p-8 flex justify-center"><Spinner size="lg" /></div>
  if (!booking) return <div className="p-8 text-center text-gray-500">الحجز غير موجود</div>

  const { variant, label } = getBookingStatusBadge(booking.status)

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/buyer/bookings" className="text-gray-400 hover:text-gray-600 text-sm">← حجوزاتي</Link>
      </div>

      <div className="max-w-xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">تفاصيل الحجز</h1>
          <Badge variant={variant}>{label}</Badge>
        </div>

        <div className="space-y-4">
          {booking.space.images[0]?.url && (
            <div className="h-40 rounded-2xl overflow-hidden">
              <img src={booking.space.images[0].url} alt={booking.space.name} className="w-full h-full object-cover" />
            </div>
          )}

          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">المساحة</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">الاسم</span><span className="font-medium">{booking.space.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">النوع</span><span className="font-medium">{booking.space.type.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">المدينة</span><span className="font-medium">{booking.space.city}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">السعر</span><span className="font-medium">{booking.space.price} ر.س / {booking.space.pricePeriod === 'day' ? 'يوم' : 'ساعة'}</span></div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">تفاصيل الحجز</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">التاريخ</span><p className="font-medium mt-0.5">{booking.date}</p></div>
              <div><span className="text-gray-500">الوقت</span><p className="font-medium mt-0.5">{booking.startTime} - {booking.endTime}</p></div>
              {booking.persons && <div><span className="text-gray-500">عدد الأشخاص</span><p className="font-medium mt-0.5">{booking.persons}</p></div>}
            </div>
            {booking.notes && (
              <div className="mt-4 pt-4 border-t border-[#E8E3D8]">
                <p className="text-gray-500 text-xs mb-1">ملاحظاتك</p>
                <p className="text-gray-700 text-sm">{booking.notes}</p>
              </div>
            )}
          </Card>

          {booking.sellerNote && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs font-medium text-amber-700 mb-1">رد صاحب المساحة:</p>
              <p className="text-sm text-amber-800">{booking.sellerNote}</p>
            </div>
          )}

          {booking.status === 'PENDING' && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="w-full bg-red-50 text-red-600 border border-red-200 py-2.5 rounded-xl text-sm font-medium hover:bg-red-100 disabled:opacity-60"
            >
              {cancelling ? 'جاري الإلغاء...' : 'إلغاء الحجز'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
