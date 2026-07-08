'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import PublicNavbar from '@/components/layout/PublicNavbar'
import Footer from '@/components/layout/Footer'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import DatePickerCalendar from '@/components/ui/DatePickerCalendar'

const DAY_NAMES = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
const POLICY_LABEL: Record<string, { name: string; desc: string; color: string }> = {
  FLEXIBLE: { name: 'مرنة', desc: 'استرداد كامل قبل ٢٤ ساعة', color: 'bg-green-50 text-green-700 border-green-200' },
  MODERATE: { name: 'متوسطة', desc: 'استرداد كامل قبل ٥ أيام', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  STRICT: { name: 'صارمة', desc: 'استرداد ٥٠٪ قبل ٧ أيام', color: 'bg-red-50 text-red-700 border-red-200' },
}

type WorkingHour = { dayOfWeek: number; isOpen: boolean; openTime: string; closeTime: string }
type Service = { id: string; name: string; description: string | null; price: number; pricingType: string }
type Rule = { id: string; rule: string }
type Space = {
  id: string
  name: string
  description: string | null
  city: string
  district: string | null
  address: string | null
  streetName: string | null
  buildingNumber: string | null
  postalCode: string | null
  landmarks: string | null
  latitude: number | null
  longitude: number | null
  capacity: number | null
  price: number
  pricePeriod: string
  status: string
  minBookingHours: number | null
  maxAdvanceBookingDays: number | null
  cancellationPolicy: string
  type: { name: string }
  seller: { name: string; email: string; phone: string | null }
  images: { id: string; url: string; order: number }[]
  amenities: { amenity: { id: string; name: string; icon: string | null } }[]
  workingHours: WorkingHour[]
  services: Service[]
  rules: Rule[]
}

export default function SpaceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [space, setSpace] = useState<Space | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookingForm, setBookingForm] = useState({ date: '', startTime: '', endTime: '', persons: '', notes: '' })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [todayValue] = useState(() => new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetch(`/api/spaces/${id}`)
      .then(r => r.json())
      .then(data => { setSpace(data.space); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault()
    setBookingError('')
    if (!bookingForm.date) {
      setBookingError('اختر تاريخ الحجز من التقويم')
      return
    }
    setBookingLoading(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spaceId: id, ...bookingForm }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 401) { router.push('/auth/login'); return }
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

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>

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
  const openDays = (space.workingHours || []).filter(wh => wh.isOpen).sort((a, b) => a.dayOfWeek - b.dayOfWeek)
  const policy = POLICY_LABEL[space.cancellationPolicy] || POLICY_LABEL.FLEXIBLE

  const fullAddress = [space.streetName, space.buildingNumber ? `مبنى ${space.buildingNumber}` : null, space.district, space.city]
    .filter(Boolean).join('، ')

  const maxBookingDate = space.maxAdvanceBookingDays
    ? new Date(new Date(`${todayValue}T00:00:00`).getTime() + space.maxAdvanceBookingDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    : undefined
  const openDaySet = new Set(openDays.map(wh => wh.dayOfWeek))
  const hasOpenDayRules = openDaySet.size > 0
  const mapHref = space.latitude && space.longitude
    ? `https://www.google.com/maps/search/?api=1&query=${space.latitude},${space.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress || space.city)}`

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Image Gallery */}
            <div className="mb-2">
              <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100">
                {sortedImages.length > 0 ? (
                  <img src={sortedImages[activeImage]?.url} alt={space.name} className="w-full h-full object-cover" />
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
                    <button key={img.id} onClick={() => setActiveImage(i)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImage ? 'border-[#1B3A2D]' : 'border-transparent'}`}>
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Space Info */}
            <div className="bg-white rounded-2xl border border-[#E8E3D8] p-6">
              <div className="flex items-start justify-between mb-3">
                <h1 className="font-display text-2xl font-extrabold text-[#14201A]">{space.name}</h1>
                <span className="bg-[#1B3A2D]/10 text-[#1B3A2D] text-xs font-medium px-3 py-1 rounded-full">{space.type.name}</span>
              </div>
              <p className="text-[#6B7566] text-sm flex items-center gap-1 mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {fullAddress || `${space.city}${space.district ? `، ${space.district}` : ''}`}
              </p>
              {space.description && <p className="text-[#4A554D] text-sm leading-relaxed mb-4">{space.description}</p>}

              <div className="flex flex-wrap gap-4 pt-4 border-t border-[#E8E3D8]">
                {space.capacity && (
                  <div className="flex items-center gap-2 text-sm text-[#4A554D]">
                    <svg className="w-4 h-4 text-[#1B3A2D]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    الطاقة الاستيعابية: {space.capacity} شخص
                  </div>
                )}
                {space.minBookingHours && (
                  <div className="flex items-center gap-2 text-sm text-[#4A554D]">
                    <svg className="w-4 h-4 text-[#1B3A2D]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    الحد الأدنى: {space.minBookingHours} {space.minBookingHours === 1 ? 'ساعة' : 'ساعات'}
                  </div>
                )}
              </div>
            </div>

            {/* Working Hours */}
            {openDays.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#E8E3D8] p-6">
                <h3 className="font-display font-extrabold text-[#14201A] text-base mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#C49A3C]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  أيام وساعات العمل
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DAY_NAMES.map((name, i) => {
                    const wh = openDays.find(d => d.dayOfWeek === i)
                    return (
                      <div key={i} className={`flex items-center justify-between p-3 rounded-xl text-sm ${wh ? 'bg-[#F7F3EB]' : 'bg-gray-50'}`}>
                        <span className={`font-medium ${wh ? 'text-[#14201A]' : 'text-[#6B7566]'}`}>{name}</span>
                        {wh ? (
                          <span className="text-[#1B3A2D] font-medium" dir="ltr">{wh.openTime} - {wh.closeTime}</span>
                        ) : (
                          <span className="text-[#6B7566] text-xs">مغلق</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Amenities */}
            {space.amenities.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#E8E3D8] p-6">
                <h3 className="font-display font-extrabold text-[#14201A] text-base mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#C49A3C]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  المرافق والتجهيزات
                </h3>
                <div className="flex flex-wrap gap-2">
                  {space.amenities.map(({ amenity }) => (
                    <span key={amenity.id} className="bg-[#F7F3EB] text-[#1B3A2D] text-sm px-3 py-1.5 rounded-full border border-[#E8E3D8]">
                      {amenity.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Extra Services */}
            {space.services && space.services.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#E8E3D8] p-6">
                <h3 className="font-display font-extrabold text-[#14201A] text-base mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#C49A3C]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  خدمات إضافية
                </h3>
                <div className="space-y-3">
                  {space.services.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-[#F7F3EB]">
                      <div>
                        <p className="text-sm font-medium text-[#14201A]">{s.name}</p>
                        {s.description && <p className="text-xs text-[#6B7566] mt-0.5">{s.description}</p>}
                      </div>
                      <div className="text-end">
                        <span className="text-sm font-bold text-[#1B3A2D]">{s.price.toLocaleString('ar-SA')} ر.س</span>
                        <p className="text-[10px] text-[#6B7566]">{s.pricingType === 'PER_PERSON' ? 'للشخص' : 'للحجز'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rules */}
            {space.rules && space.rules.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#E8E3D8] p-6">
                <h3 className="font-display font-extrabold text-[#14201A] text-base mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#C49A3C]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  قواعد الاستخدام
                </h3>
                <ul className="space-y-2">
                  {space.rules.map(r => (
                    <li key={r.id} className="flex items-center gap-2 text-sm text-[#4A554D]">
                      <svg className="w-3.5 h-3.5 text-[#C49A3C] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {r.rule}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Map */}
            {space.latitude && space.longitude && (
              <div className="bg-white rounded-2xl border border-[#E8E3D8] p-6">
                <h3 className="font-display font-extrabold text-[#14201A] text-base mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#C49A3C]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  الموقع على الخريطة
                </h3>
                <div className="rounded-xl overflow-hidden border border-[#E8E3D8]">
                  <iframe
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${space.longitude - 0.01},${space.latitude - 0.01},${space.longitude + 0.01},${space.latitude + 0.01}&layer=mapnik&marker=${space.latitude},${space.longitude}`}
                    className="w-full h-64"
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                </div>
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-[#1B3A2D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0F2219] transition-colors"
                >
                  فتح الموقع في الخرائط
                </a>
                {space.landmarks && (
                  <p className="text-xs text-[#6B7566] mt-2">معالم قريبة: {space.landmarks}</p>
                )}
              </div>
            )}
            {(!space.latitude || !space.longitude) && (
              <div className="bg-white rounded-2xl border border-[#E8E3D8] p-6">
                <h3 className="font-display font-extrabold text-[#14201A] text-base mb-2">الموقع</h3>
                <p className="text-sm text-[#6B7566] mb-4">{fullAddress || space.city}</p>
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-[#1B3A2D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0F2219] transition-colors"
                >
                  فتح الموقع في الخرائط
                </a>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Pricing & Book */}
            <div className="bg-white rounded-2xl border border-[#E8E3D8] p-6 sticky top-20">
              <div className="mb-4">
                <span className="text-3xl font-extrabold text-[#1B3A2D]">{space.price.toLocaleString('ar-SA')}</span>
                <span className="text-[#6B7566] text-sm me-1"> ر.س / {priceLabel}</span>
              </div>

              <button onClick={() => setBookingOpen(true)}
                className="w-full bg-[#1B3A2D] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-[#0F2219] transition-colors mb-4">
                طلب حجز
              </button>

              {/* Cancellation Policy */}
              <div className={`p-3 rounded-xl border text-center mb-4 ${policy.color}`}>
                <p className="text-xs font-bold">سياسة الإلغاء: {policy.name}</p>
                <p className="text-[10px] mt-0.5">{policy.desc}</p>
              </div>

              {/* Seller Info */}
              <div className="border-t border-[#E8E3D8] pt-4">
                <h4 className="text-xs font-bold text-[#6B7566] mb-3">صاحب المساحة</h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1B3A2D] to-[#0F2219] flex items-center justify-center text-[#C49A3C] font-bold text-lg">
                    {space.seller.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#14201A]">{space.seller.name}</p>
                    {space.seller.phone && <p className="text-xs text-[#6B7566]" dir="ltr">{space.seller.phone}</p>}
                    <p className="text-xs text-[#6B7566]" dir="ltr">{space.seller.email}</p>
                  </div>
                </div>
              </div>

              {/* Location summary */}
              {(space.postalCode || space.buildingNumber) && (
                <div className="border-t border-[#E8E3D8] pt-4 mt-4">
                  <h4 className="text-xs font-bold text-[#6B7566] mb-2">تفاصيل العنوان</h4>
                  <div className="text-sm text-[#4A554D] space-y-1">
                    {space.streetName && <p>الشارع: {space.streetName}</p>}
                    {space.buildingNumber && <p>رقم المبنى: {space.buildingNumber}</p>}
                    {space.postalCode && <p>الرمز البريدي: {space.postalCode}</p>}
                  </div>
                </div>
              )}

              {/* Booking rules */}
              {(space.minBookingHours || space.maxAdvanceBookingDays) && (
                <div className="border-t border-[#E8E3D8] pt-4 mt-4">
                  <h4 className="text-xs font-bold text-[#6B7566] mb-2">قواعد الحجز</h4>
                  <div className="text-xs text-[#4A554D] space-y-1.5">
                    {space.minBookingHours && <p>الحد الأدنى للحجز: {space.minBookingHours} {space.minBookingHours === 1 ? 'ساعة' : 'ساعات'}</p>}
                    {space.maxAdvanceBookingDays && <p>الحجز المسبق: حتى {space.maxAdvanceBookingDays} يوم</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      <Modal open={bookingOpen} onClose={() => { setBookingOpen(false); setBookingSuccess(false); setBookingError('') }} title="طلب حجز">
        {bookingSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#14201A] mb-2">تم إرسال طلب الحجز!</h3>
            <p className="text-[#6B7566] text-sm mb-6">سيتواصل معك صاحب المساحة للتأكيد</p>
            <button onClick={() => { setBookingOpen(false); setBookingSuccess(false) }}
              className="bg-[#1B3A2D] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#0F2219]">
              حسناً
            </button>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="space-y-4">
            {bookingError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{bookingError}</div>
            )}
            <div>
              <label className="block text-xs font-bold text-[#4A554D] mb-1.5">التاريخ</label>
              <DatePickerCalendar
                value={bookingForm.date}
                onChange={date => setBookingForm(p => ({ ...p, date }))}
                minDate={todayValue}
                maxDate={maxBookingDate}
                isDateEnabled={date => !hasOpenDayRules || openDaySet.has(date.getDay())}
              />
              <input type="hidden" value={bookingForm.date}
                onChange={e => setBookingForm(p => ({ ...p, date: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
                required min={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#4A554D] mb-1.5">وقت البداية</label>
                <input type="time" value={bookingForm.startTime}
                  onChange={e => setBookingForm(p => ({ ...p, startTime: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#4A554D] mb-1.5">وقت النهاية</label>
                <input type="time" value={bookingForm.endTime}
                  onChange={e => setBookingForm(p => ({ ...p, endTime: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]" required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4A554D] mb-1.5">عدد الأشخاص</label>
              <input type="number" value={bookingForm.persons}
                onChange={e => setBookingForm(p => ({ ...p, persons: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
                placeholder="اختياري" min={1} />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4A554D] mb-1.5">ملاحظات</label>
              <textarea value={bookingForm.notes}
                onChange={e => setBookingForm(p => ({ ...p, notes: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D] resize-none"
                rows={3} placeholder="أي متطلبات خاصة..." />
            </div>
            <button type="submit" disabled={bookingLoading}
              className="w-full bg-[#1B3A2D] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#0F2219] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
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
