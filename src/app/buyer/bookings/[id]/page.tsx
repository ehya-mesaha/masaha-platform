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
  totalHours: number
  basePrice: number
  discountAmount: number
  servicesTotal: number
  grandTotal: number
  unit: { label: string }
  services: { id: string; name: string; quantity: number; unitPrice: number; lineTotal: number }[]
  review: {
    id: string
    rating: number
    comment: string | null
    createdAt: string
  } | null
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
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [cancellation, setCancellation] = useState<{ refundPercent: number; refundAmount: number } | null>(null)

  useEffect(() => {
    fetch(`/api/bookings/${id}`)
      .then(r => r.json())
      .then(data => { setBooking(data.booking); setCancellation(data.cancellation); setLoading(false) })
  }, [id])

  async function handleCancel() {
    if (!confirm(`هل أنت متأكد من إلغاء الحجز؟ مبلغ الاسترداد المتوقع: ${formatNumber(cancellation?.refundAmount ?? 0)} ر.س`)) return
    setCancelling(true)
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CANCELLED_BY_BUYER' }),
    })
    if (res.ok) {
      const data = await res.json()
      setBooking(prev => prev ? { ...prev, status: data.booking.status } : null)
      setCancellation(data.cancellation)
    }
    setCancelling(false)
  }

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault()
    setReviewError('')
    if (!reviewRating) {
      setReviewError('اختر عدد النجوم أولاً')
      return
    }

    setReviewLoading(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: id, rating: reviewRating, comment: reviewComment }),
      })
      const data = await res.json()
      if (!res.ok) {
        setReviewError(data.error || 'تعذر إرسال التقييم')
        return
      }
      setBooking(prev => prev ? { ...prev, review: data.review } : prev)
      setReviewComment('')
    } catch {
      setReviewError('حدث خطأ في الاتصال')
    } finally {
      setReviewLoading(false)
    }
  }

  if (loading) return <div className="p-8 flex justify-center"><Spinner size="lg" /></div>
  if (!booking) return <div className="p-8 text-center text-gray-500">الحجز غير موجود</div>

  const { variant, label } = getBookingStatusBadge(booking.status)

  return (
    <div className="dashboard-page">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/buyer/bookings" className="text-gray-400 hover:text-gray-600 text-sm">← حجوزاتي</Link>
      </div>

      <div className="max-w-2xl">
        <div className="page-hero mb-6 p-6 animate-in">
          <div className="relative flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-[#C49A3C] mb-2">حجز موثق</p>
              <h1 className="text-2xl font-extrabold text-white">تفاصيل الحجز</h1>
              <p className="mt-1 text-sm text-white/65">{booking.space.name}</p>
            </div>
            <Badge variant={variant}>{label}</Badge>
          </div>
        </div>

        <div className="space-y-4 motion-list">
          {booking.space.images[0]?.url && (
            <div className="h-52 rounded-2xl overflow-hidden shadow-[0_24px_70px_-44px_rgba(15,34,25,0.7)]">
              <img src={booking.space.images[0].url} alt={booking.space.name} className="w-full h-full object-cover" />
            </div>
          )}

          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">المساحة</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">الاسم</span><span className="font-medium">{booking.space.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">النوع</span><span className="font-medium">{booking.space.type.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">المدينة</span><span className="font-medium">{booking.space.city}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">السعر</span><span className="font-medium">{formatNumber(booking.space.price)} ر.س / ساعة</span></div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">تفاصيل الحجز</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">التاريخ</span><p className="font-medium mt-0.5">{formatDate(booking.date)}</p></div>
              <div><span className="text-gray-500">الوقت</span><p className="time-value font-medium mt-0.5">{formatTimeRange(booking.startTime, booking.endTime)}</p></div>
              {booking.persons && <div><span className="text-gray-500">عدد الأشخاص</span><p className="font-medium mt-0.5">{booking.persons}</p></div>}
              <div><span className="text-gray-500">الوحدة</span><p className="font-medium mt-0.5">{booking.unit.label}</p></div>
            </div>
            {booking.notes && (
              <div className="mt-4 pt-4 border-t border-[#E8E3D8]">
                <p className="text-gray-500 text-xs mb-1">ملاحظاتك</p>
                <p className="text-gray-700 text-sm">{booking.notes}</p>
              </div>
            )}
          </Card>

          {booking.services.length > 0 && (
            <Card>
              <h3 className="mb-4 font-semibold text-gray-900">خدمات المساحة</h3>
              <div className="overflow-hidden rounded-xl border border-[#E8E3D8]">
                {booking.services.map(service => (
                  <div key={service.id} className="grid grid-cols-[1fr_auto] gap-3 border-b border-[#EEE8DC] px-4 py-3 text-sm last:border-0">
                    <div>
                      <strong className="block text-[#1B3A2D]">{service.name}</strong>
                      <span className="text-xs text-gray-500">{service.quantity} × {formatNumber(service.unitPrice)} ر.س</span>
                    </div>
                    <strong className="self-center text-[#1B3A2D]">{formatNumber(service.lineTotal)} ر.س</strong>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card>
            <h3 className="mb-4 font-semibold text-gray-900">ملخص التكلفة</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">السعر الأساسي</span><span>{formatNumber(booking.basePrice)} ر.س</span></div>
              {booking.discountAmount > 0 && <div className="flex justify-between text-emerald-700"><span>الخصم</span><span>-{formatNumber(booking.discountAmount)} ر.س</span></div>}
              {booking.servicesTotal > 0 && <div className="flex justify-between"><span className="text-gray-500">الخدمات</span><span>{formatNumber(booking.servicesTotal)} ر.س</span></div>}
              <div className="flex justify-between border-t border-[#E8E3D8] pt-3 text-base font-extrabold text-[#1B3A2D]"><span>الإجمالي</span><span>{formatNumber(booking.grandTotal)} ر.س</span></div>
            </div>
          </Card>

          {booking.sellerNote && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs font-medium text-amber-700 mb-1">رد صاحب المساحة:</p>
              <p className="text-sm text-amber-800">{booking.sellerNote}</p>
            </div>
          )}

          {booking.status === 'COMPLETED' && (
            <Card>
              <h3 className="font-semibold text-gray-900 mb-2">تقييم تجربتك</h3>
              {booking.review ? (
                <div className="rounded-2xl border border-green-200 bg-green-50 p-5 animate-in">
                  <div className="mb-2 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} className={star <= booking.review!.rating ? 'text-[#C49A3C] text-xl' : 'text-[#D8CFBE] text-xl'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-green-700">تم إرسال تقييمك بنجاح</p>
                  {booking.review.comment && (
                    <p className="mt-2 text-sm text-green-800">{booking.review.comment}</p>
                  )}
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {reviewError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {reviewError}
                    </div>
                  )}
                  <div>
                    <p className="mb-2 text-xs font-bold text-gray-500">عدد النجوم</p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className={`h-12 w-12 rounded-2xl border text-2xl transition-all hover:-translate-y-0.5 ${
                            star <= reviewRating
                              ? 'border-[#C49A3C] bg-[#F7F3EB] text-[#C49A3C] shadow-sm'
                              : 'border-[#E8E3D8] bg-white text-[#D8CFBE] hover:border-[#C49A3C]'
                          }`}
                          aria-label={`${star} نجوم`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-gray-500">تعليقك</label>
                    <textarea
                      value={reviewComment}
                      onChange={e => setReviewComment(e.target.value)}
                      rows={4}
                      maxLength={1000}
                      placeholder="شارك رأيك عن المساحة وتجربة الحجز..."
                      className="w-full resize-none rounded-xl border border-[#E8E3D8] px-4 py-3 text-sm focus:border-[#1B3A2D] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="w-full rounded-xl bg-[#1B3A2D] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0F2219] disabled:opacity-60"
                  >
                    {reviewLoading ? 'جاري إرسال التقييم...' : 'إرسال التقييم'}
                  </button>
                </form>
              )}
            </Card>
          )}

          {booking.status === 'CONFIRMED' && (
            <Card>
              <h3 className="font-semibold text-gray-900">إلغاء الحجز</h3>
              <p className="mt-2 text-sm leading-7 text-gray-600">
                تطبق سياسة الإلغاء المتفق عليها. مبلغ الاسترداد المتوقع حاليًا:
                <strong className="mx-1 text-[#1B3A2D]">{formatNumber(cancellation?.refundAmount ?? 0)} ر.س</strong>
                ({cancellation?.refundPercent ?? 0}%).
              </p>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="mt-4 w-full rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-60"
              >
                {cancelling ? 'جاري الإلغاء...' : 'إلغاء الحجز'}
              </button>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
