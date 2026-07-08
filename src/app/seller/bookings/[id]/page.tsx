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
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/seller/bookings" className="text-gray-400 hover:text-gray-600 text-sm">← طلبات الحجز</Link>
      </div>

      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">تفاصيل الحجز</h1>
          <Badge variant={variant}>{label}</Badge>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">معلومات المستأجر</h3>
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
              <div><span className="text-gray-500">التاريخ</span><p className="font-medium mt-0.5">{booking.date}</p></div>
              <div><span className="text-gray-500">الوقت</span><p className="font-medium mt-0.5">{booking.startTime} - {booking.endTime}</p></div>
              {booking.persons && <div><span className="text-gray-500">عدد الأشخاص</span><p className="font-medium mt-0.5">{booking.persons}</p></div>}
            </div>
            {booking.notes && (
              <div className="mt-4 pt-4 border-t border-[#E8E3D8]">
                <p className="text-gray-500 text-xs mb-1">ملاحظات المستأجر</p>
                <p className="text-gray-700 text-sm">{booking.notes}</p>
              </div>
            )}
          </Card>

          {booking.status === 'PENDING' && (
            <Card>
              <h3 className="font-semibold text-gray-900 mb-3">ردك على الطلب</h3>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={3}
                placeholder="ملاحظة للمستأجر (اختياري)..."
                className="w-full px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D] resize-none mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => handleAction('ACCEPTED')}
                  disabled={actionLoading}
                  className="flex-1 bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-60"
                >
                  قبول الطلب
                </button>
                <button
                  onClick={() => handleAction('REJECTED')}
                  disabled={actionLoading}
                  className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-60"
                >
                  رفض الطلب
                </button>
              </div>
            </Card>
          )}

          {booking.sellerNote && booking.status !== 'PENDING' && (
            <Card>
              <h3 className="font-semibold text-gray-900 mb-2">ملاحظتك</h3>
              <p className="text-gray-700 text-sm">{booking.sellerNote}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
