'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Badge, { getBookingStatusBadge } from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import Link from 'next/link'
import { formatDate, formatNumber, formatTimeRange } from '@/lib/format'

type Booking = {
  id: string
  status: string
  date: string
  startTime: string
  endTime: string
  persons: number | null
  notes: string | null
  sellerNote: string | null
  grandTotal: number
  unit: { label: string }
  services: { id: string; name: string; quantity: number; unitPrice: number; lineTotal: number }[]
  space: { name: string; city: string; type: { name: string } }
  buyer: { name: string; email: string; phone: string | null }
}

export default function SellerBookingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [note, setNote] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/bookings/${id}`)
      .then(r => r.json())
      .then(data => {
        setBooking(data.booking)
        setNote(data.booking?.sellerNote || '')
        setLoading(false)
      })
      .catch(() => {
        setError('تعذر تحميل تفاصيل الحجز')
        setLoading(false)
      })
  }, [id])

  async function handleAction(status: string) {
    setError('')
    setActionLoading(true)
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, sellerNote: note }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'تعذر تحديث حالة الحجز')
        return
      }
      setBooking(prev => prev ? { ...prev, status: data.booking.status, sellerNote: data.booking.sellerNote } : null)
    } catch {
      setError('تعذر الاتصال بالخادم')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return <div className="p-8 flex justify-center"><Spinner size="lg" /></div>
  if (!booking) return <div className="p-8 text-center text-gray-500">الحجز غير موجود</div>

  const { variant, label } = getBookingStatusBadge(booking.status)

  return (
    <div className="dashboard-page">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/seller/bookings" className="text-gray-400 hover:text-gray-600 text-sm">← حجوزاتي</Link>
      </div>

      <div className="max-w-2xl">
        <div className="page-hero mb-6 p-6 animate-in">
          <div className="relative flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-[#C49A3C] mb-2">حجز مؤكد</p>
              <h1 className="text-2xl font-extrabold text-white">تفاصيل الحجز</h1>
              <p className="mt-1 text-sm text-white/65">{booking.space.name}</p>
            </div>
            <Badge variant={variant}>{label}</Badge>
          </div>
        </div>

        <div className="space-y-4 motion-list">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">معلومات طالب المساحة</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">الاسم</span><span className="font-medium">{booking.buyer.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">البريد</span><span className="font-medium">{booking.buyer.email}</span></div>
              {booking.buyer.phone && <div className="flex justify-between"><span className="text-gray-500">الجوال</span><span className="font-medium">{booking.buyer.phone}</span></div>}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">تفاصيل الحجز</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">المساحة</span><p className="font-medium mt-0.5">{booking.space.name}</p></div>
              <div><span className="text-gray-500">النوع</span><p className="font-medium mt-0.5">{booking.space.type.name}</p></div>
              <div><span className="text-gray-500">التاريخ</span><p className="font-medium mt-0.5">{formatDate(booking.date)}</p></div>
              <div><span className="text-gray-500">الوقت</span><p className="time-value font-medium mt-0.5">{formatTimeRange(booking.startTime, booking.endTime)}</p></div>
              {booking.persons && <div><span className="text-gray-500">عدد الأشخاص</span><p className="font-medium mt-0.5">{booking.persons}</p></div>}
              <div><span className="text-gray-500">الوحدة</span><p className="font-medium mt-0.5">{booking.unit.label}</p></div>
            </div>
            {booking.notes && (
              <div className="mt-4 pt-4 border-t border-[#E8E3D8]">
                <p className="text-gray-500 text-xs mb-1">ملاحظات طالب المساحة</p>
                <p className="text-gray-700 text-sm">{booking.notes}</p>
              </div>
            )}
          </Card>

          {booking.services.length > 0 && (
            <Card>
              <h3 className="mb-4 font-semibold text-gray-900">خدمات المساحة المطلوبة</h3>
              <div className="space-y-2">
                {booking.services.map(service => (
                  <div key={service.id} className="grid grid-cols-[1fr_auto] gap-4 rounded-xl border border-[#E8E3D8] px-4 py-3 text-sm">
                    <div>
                      <strong className="text-[#1B3A2D]">{service.name}</strong>
                      <p className="mt-1 text-xs text-gray-500">الكمية {service.quantity} × {formatNumber(service.unitPrice)} ر.س</p>
                    </div>
                    <strong className="self-center text-[#1B3A2D]">{formatNumber(service.lineTotal)} ر.س</strong>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between border-t border-[#E8E3D8] pt-4 font-extrabold text-[#1B3A2D]">
                <span>إجمالي الحجز</span><span>{formatNumber(booking.grandTotal)} ر.س</span>
              </div>
            </Card>
          )}

          {booking.sellerNote && (
            <Card>
              <h3 className="font-semibold text-gray-900 mb-2">ملاحظتك</h3>
              <p className="text-gray-700 text-sm">{booking.sellerNote}</p>
            </Card>
          )}

          {booking.status === 'CONFIRMED' && (
            <Card>
              <h3 className="font-semibold text-gray-900 mb-2">إنهاء الحجز</h3>
              <p className="text-gray-500 text-sm mb-4">
                بعد اكتمال استخدام المساحة، علّم الحجز كمكتمل ليتمكن طالب المساحة من إضافة تقييمه.
              </p>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={3}
                placeholder="ملاحظة داخلية اختيارية..."
                className="mb-4 w-full resize-none rounded-xl border border-[#E8E3D8] px-4 py-2.5 text-sm focus:border-[#1B3A2D] focus:outline-none"
              />
              <button
                onClick={() => handleAction('COMPLETED')}
                disabled={actionLoading}
                className="w-full rounded-xl bg-[#1B3A2D] py-3 text-sm font-semibold text-white hover:bg-[#0F2219] disabled:opacity-60"
              >
                {actionLoading ? 'جاري التحديث...' : 'تمييز الحجز كمكتمل'}
              </button>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
