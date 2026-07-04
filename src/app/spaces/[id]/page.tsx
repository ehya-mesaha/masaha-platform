'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import PublicNavbar from '@/components/layout/PublicNavbar'
import Footer from '@/components/layout/Footer'
import Badge, { getSpaceStatusBadge } from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'

type Space = {
  id: string
  name: string
  description: string | null
  city: string
  district: string | null
  address: string | null
  capacity: number | null
  price: number
  pricePeriod: string
  status: string
  type: { name: string }
  seller: { name: string; email: string; phone: string | null }
  images: { id: string; url: string; order: number }[]
  amenities: { amenity: { id: string; name: string; icon: string | null } }[]
}

export default function SpaceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [space, setSpace] = useState<Space | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    date: '',
    startTime: '',
    endTime: '',
    persons: '',
    notes: '',
  })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    fetch(`/api/spaces/${id}`)
      .then(r => r.json())
      .then(data => {
        setSpace(data.space)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault()
    setBookingError('')
    setBookingLoading(true)

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spaceId: id, ...bookingForm }),
      })
      const data = await res.json()

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/auth/login')
          return
        }
        setBookingError(data.error || 'حدث خطأ')
        return
      }

      setBookingSuccess(true)
    } catch {
      setBookingError('حدث خطأ في الاتصال')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!space) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🏢</div>
            <h2 className="text-xl font-semibold text-gray-700">المساحة غير موجودة</h2>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const priceLabel = space.pricePeriod === 'day' ? 'يوم' : 'ساعة'
  const sortedImages = [...space.images].sort((a, b) => a.order - b.order)

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-6">
              <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100">
                {sortedImages.length > 0 ? (
                  <img
                    src={sortedImages[activeImage]?.url}
                    alt={space.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1B3A2D]/10 to-[#C49A3C]/10">
                    <svg className="w-24 h-24 text-[#1B3A2D]/20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
                    </svg>
                  </div>
                )}
              </div>
              {sortedImages.length > 1 && (
                <div className="flex gap-2 mt-3">
                  {sortedImages.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(i)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        i === activeImage ? 'border-[#1B3A2D]' : 'border-transparent'
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Space Info */}
            <div className="bg-white rounded-2xl border border-[#E8E3D8] p-6 mb-4">
              <div className="flex items-start justify-between mb-3">
                <h1 className="text-2xl font-bold text-gray-900">{space.name}</h1>
                <span className="bg-[#1B3A2D]/10 text-[#1B3A2D] text-xs font-medium px-3 py-1 rounded-full">
                  {space.type.name}
                </span>
              </div>

              <p className="text-gray-500 text-sm flex items-center gap-1 mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {space.city}{space.district ? `، ${space.district}` : ''}
                {space.address ? ` - ${space.address}` : ''}
              </p>

              {space.description && (
                <p className="text-gray-700 text-sm leading-relaxed mb-4">{space.description}</p>
              )}

              <div className="flex flex-wrap gap-4 pt-4 border-t border-[#E8E3D8]">
                {space.capacity && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-[#1B3A2D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    الطاقة الاستيعابية: {space.capacity} شخص
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            {space.amenities.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#E8E3D8] p-6">
                <h3 className="font-semibold text-gray-900 mb-4">المرافق والخدمات</h3>
                <div className="flex flex-wrap gap-2">
                  {space.amenities.map(({ amenity }) => (
                    <span
                      key={amenity.id}
                      className="bg-[#F5F0E6] text-[#1B3A2D] text-sm px-3 py-1.5 rounded-full border border-[#E8E3D8]"
                    >
                      {amenity.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#E8E3D8] p-6 sticky top-20">
              <div className="mb-4">
                <span className="text-3xl font-bold text-[#1B3A2D]">{space.price.toLocaleString('ar-SA')}</span>
                <span className="text-gray-400 text-sm me-1"> ر.س / {priceLabel}</span>
              </div>

              <button
                onClick={() => setBookingOpen(true)}
                className="w-full bg-[#1B3A2D] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#0F2219] transition-colors mb-4"
              >
                طلب حجز
              </button>

              <div className="border-t border-[#E8E3D8] pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">صاحب المساحة</h4>
                <p className="text-gray-900 font-medium">{space.seller.name}</p>
                {space.seller.phone && (
                  <p className="text-gray-500 text-sm">{space.seller.phone}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      <Modal open={bookingOpen} onClose={() => { setBookingOpen(false); setBookingSuccess(false); setBookingError('') }} title="طلب حجز">
        {bookingSuccess ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">تم إرسال طلب الحجز!</h3>
            <p className="text-gray-500 text-sm mb-6">سيتواصل معك صاحب المساحة للتأكيد</p>
            <button
              onClick={() => { setBookingOpen(false); setBookingSuccess(false) }}
              className="bg-[#1B3A2D] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0F2219]"
            >
              حسناً
            </button>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="space-y-4">
            {bookingError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                {bookingError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">التاريخ</label>
              <input
                type="date"
                value={bookingForm.date}
                onChange={e => setBookingForm(p => ({ ...p, date: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">وقت البداية</label>
                <input
                  type="time"
                  value={bookingForm.startTime}
                  onChange={e => setBookingForm(p => ({ ...p, startTime: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">وقت النهاية</label>
                <input
                  type="time"
                  value={bookingForm.endTime}
                  onChange={e => setBookingForm(p => ({ ...p, endTime: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">عدد الأشخاص</label>
              <input
                type="number"
                value={bookingForm.persons}
                onChange={e => setBookingForm(p => ({ ...p, persons: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
                placeholder="اختياري"
                min={1}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">ملاحظات</label>
              <textarea
                value={bookingForm.notes}
                onChange={e => setBookingForm(p => ({ ...p, notes: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D] resize-none"
                rows={3}
                placeholder="أي متطلبات خاصة..."
              />
            </div>

            <button
              type="submit"
              disabled={bookingLoading}
              className="w-full bg-[#1B3A2D] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#0F2219] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {bookingLoading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {bookingLoading ? 'جاري الإرسال...' : 'إرسال طلب الحجز'}
            </button>
          </form>
        )}
      </Modal>

      <Footer />
    </div>
  )
}
