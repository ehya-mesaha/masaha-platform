'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import PublicNavbar from '@/components/layout/PublicNavbar'
import Footer from '@/components/layout/Footer'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import DatePickerCalendar from '@/components/ui/DatePickerCalendar'
import StartConversationButton from '@/components/chat/StartConversationButton'
import { formatSpaceNumber } from '@/lib/format'

const DAY_NAMES = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
const POLICY_LABEL: Record<string, { name: string; desc: string; color: string }> = {
  FLEXIBLE: { name: 'مرنة', desc: 'استرداد كامل عند الإلغاء قبل موعد الحجز بـ24 ساعة', color: 'bg-green-50 text-green-700 border-green-200' },
  MODERATE: { name: 'متوسطة', desc: 'استرداد 50% عند الإلغاء قبل موعد الحجز بـ5 أيام', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  STRICT: { name: 'صارمة', desc: 'لا يُسترد أي مبلغ عند إلغاء الحجز', color: 'bg-red-50 text-red-700 border-red-200' },
}

const PRINT_MATRIX_FIELDS: Array<[key: 'bwSingle' | 'bwDouble' | 'colorSingle' | 'colorDouble', label: string]> = [
  ['bwSingle', 'أبيض وأسود - وجه واحد'],
  ['bwDouble', 'أبيض وأسود - وجهين'],
  ['colorSingle', 'ملون - وجه واحد'],
  ['colorDouble', 'ملون - وجهين'],
]

type PrintMatrixConfig = { bwSingle?: number; bwDouble?: number; colorSingle?: number; colorDouble?: number }
type WorkingHour = { dayOfWeek: number; isOpen: boolean; openTime: string; closeTime: string }
type Service = { id: string; name: string; description: string | null; price: number; pricingType: string; config: PrintMatrixConfig | null }
type PricingTier = { minHours: number; discountPercent: number }
type Rule = { id: string; rule: string }
type Review = {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  buyer: { id: string; name: string }
  booking: { id: string; date: string }
}
type Space = {
  id: string
  refSeq: number
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
  advertisingLicenseNumber: string | null
  type: { name: string }
  seller: { id: string; name: string; email: string; phone: string | null; avatarUrl: string | null }
  images: { id: string; url: string; order: number }[]
  amenities: { amenity: { id: string; name: string; icon: string | null } }[]
  workingHours: WorkingHour[]
  services: Service[]
  pricingTiers: PricingTier[]
  rules: Rule[]
  reviews: Review[]
  reviewSummary: { average: number; count: number }
}

function RatingStars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  return (
    <div className={`flex items-center gap-0.5 ${size === 'md' ? 'text-lg' : 'text-sm'}`} aria-label={`${rating} من 5`}>
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} className={star <= Math.round(rating) ? 'text-[#B99A63]' : 'text-[#D8D1C7]'}>
          ★
        </span>
      ))}
    </div>
  )
}

function parseHours(start: string, end: string) {
  if (!start || !end) return 0
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  if ([sh, sm, eh, em].some(n => Number.isNaN(n))) return 0
  return Math.max(0, (eh * 60 + em - (sh * 60 + sm)) / 60)
}

type ServiceSelection = { enabled: boolean; quantity: number; matrix: PrintMatrixConfig }

function serviceLineTotal(service: Service, selection: ServiceSelection, persons: number, hours: number) {
  if (!selection.enabled) return 0
  if (service.pricingType === 'PRINT_MATRIX') {
    const config = service.config || {}
    return PRINT_MATRIX_FIELDS.reduce((sum, [key]) => sum + (Number(config[key]) || 0) * (Number(selection.matrix[key]) || 0), 0)
  }
  let quantity = Math.max(1, selection.quantity || 1)
  if (service.pricingType === 'PER_PERSON') quantity = Math.max(1, persons || quantity)
  if (service.pricingType === 'PER_HOUR') quantity = quantity * hours
  return service.price * quantity
}

const STEP_TITLES = ['بيانات الحجز', 'اختيار الخدمات', 'مراجعة الطلب', 'الدفع والإتمام']

export default function SpaceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [space, setSpace] = useState<Space | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [todayValue] = useState(() => new Date().toISOString().split('T')[0])

  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookingStep, setBookingStep] = useState(1)
  const [bookingForm, setBookingForm] = useState({ requesterIdNumber: '', date: '', startTime: '', endTime: '', persons: '', purpose: '' })
  const [selectedServices, setSelectedServices] = useState<Record<string, ServiceSelection>>({})
  const [paymentMethod, setPaymentMethod] = useState('mada')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(false)

  useEffect(() => {
    fetch(`/api/spaces/${id}`)
      .then(r => r.json())
      .then(data => { setSpace(data.space); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  function openBooking() {
    setBookingStep(1)
    setBookingError('')
    setBookingOpen(true)
  }

  function closeBooking() {
    setBookingOpen(false)
    setBookingSuccess(false)
    setBookingError('')
  }

  function toggleService(serviceId: string) {
    setSelectedServices(current => {
      const existing = current[serviceId] || { enabled: false, quantity: 1, matrix: {} }
      return { ...current, [serviceId]: { ...existing, enabled: !existing.enabled } }
    })
  }

  function updateServiceQuantity(serviceId: string, quantity: number) {
    setSelectedServices(current => ({
      ...current,
      [serviceId]: { ...(current[serviceId] || { enabled: true, quantity: 1, matrix: {} }), quantity: Math.max(1, quantity) },
    }))
  }

  function updateServiceMatrix(serviceId: string, key: keyof PrintMatrixConfig, value: number) {
    setSelectedServices(current => {
      const existing = current[serviceId] || { enabled: true, quantity: 1, matrix: {} }
      return { ...current, [serviceId]: { ...existing, matrix: { ...existing.matrix, [key]: Math.max(0, value) } } }
    })
  }

  const hours = useMemo(() => parseHours(bookingForm.startTime, bookingForm.endTime), [bookingForm.startTime, bookingForm.endTime])
  const persons = Number(bookingForm.persons) || 0

  const pricing = useMemo(() => {
    if (!space) return { basePrice: 0, discountPercent: 0, discountAmount: 0, servicesTotal: 0, grandTotal: 0, serviceLines: [] as { name: string; total: number }[] }
    const basePrice = space.price * hours
    const tier = [...space.pricingTiers].sort((a, b) => b.minHours - a.minHours).find(t => hours >= t.minHours)
    const discountPercent = tier?.discountPercent ?? 0
    const discountAmount = basePrice * discountPercent / 100
    const serviceLines = space.services
      .filter(service => selectedServices[service.id]?.enabled)
      .map(service => ({ name: service.name, total: serviceLineTotal(service, selectedServices[service.id], persons, hours) }))
      .filter(line => line.total > 0)
    const servicesTotal = serviceLines.reduce((sum, line) => sum + line.total, 0)
    const grandTotal = basePrice - discountAmount + servicesTotal
    return { basePrice, discountPercent, discountAmount, servicesTotal, grandTotal, serviceLines }
  }, [space, hours, persons, selectedServices])

  function validateStep(step: number): string {
    if (step === 1) {
      if (!bookingForm.requesterIdNumber.trim()) return 'أدخل رقم الهوية الوطنية أو السجل التجاري'
      if (!bookingForm.date) return 'اختر تاريخ الحجز من التقويم'
      if (!bookingForm.startTime || !bookingForm.endTime) return 'حدد وقت البداية والنهاية'
      if (hours <= 0) return 'يجب أن يكون وقت النهاية بعد وقت البداية'
    }
    if (step === 4 && !agreedToTerms) return 'يجب الموافقة على الشروط والأحكام لإتمام الحجز'
    return ''
  }

  function goNext() {
    const error = validateStep(bookingStep)
    if (error) { setBookingError(error); return }
    setBookingError('')
    setBookingStep(current => Math.min(4, current + 1))
  }

  function goPrev() {
    setBookingError('')
    setBookingStep(current => Math.max(1, current - 1))
  }

  async function handleConfirmBooking() {
    const error = validateStep(4)
    if (error) { setBookingError(error); return }
    setBookingError('')
    setBookingLoading(true)
    try {
      const services = Object.entries(selectedServices)
        .filter(([, selection]) => selection.enabled)
        .map(([configId, selection]) => ({ configId, quantity: selection.quantity, matrix: selection.matrix }))

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spaceId: id,
          requesterIdNumber: bookingForm.requesterIdNumber,
          date: bookingForm.date,
          startTime: bookingForm.startTime,
          endTime: bookingForm.endTime,
          persons: bookingForm.persons,
          notes: bookingForm.purpose,
          services,
        }),
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
            <svg className="mx-auto mb-4 h-12 w-12 text-[#0E3B34]" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M4 20h16M6 20V5h12v15M9 9h2m2 0h2m-6 4h2m2 0h2" /></svg>
            <h2 className="text-xl font-semibold text-gray-700">المساحة غير موجودة</h2>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const priceLabel = 'ساعة'
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
    <div className="min-h-screen flex flex-col bg-paper">
      <PublicNavbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-28 pt-6 sm:px-6 sm:pb-12 lg:px-8 lg:py-10 animate-in">
        <nav className="mb-5 flex items-center gap-2 text-xs text-[#778078]" aria-label="مسار الصفحة">
          <Link href="/" className="transition-colors hover:text-[#0E3B34]">الرئيسية</Link>
          <svg className="h-3 w-3 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" /></svg>
          <Link href="/spaces" className="transition-colors hover:text-[#0E3B34]">المساحات</Link>
          <svg className="h-3 w-3 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" /></svg>
          <span className="max-w-44 truncate font-semibold text-[#1B1B1B]">{space.name}</span>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Image Gallery */}
            <div className="mb-4">
              <div className="space-detail-gallery">
                {sortedImages.length > 0 ? (
                  <button type="button" className="space-detail-gallery-main" aria-label="الصورة الرئيسية">
                    <img src={sortedImages[activeImage]?.url} alt={space.name} />
                    <span className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#092C27]/55 to-transparent" />
                    <span className="absolute bottom-4 start-4 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-black/25 px-3 py-2 text-xs font-bold text-white backdrop-blur-md">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V6.75A2.25 2.25 0 0 1 5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75v9.75m-18 0v.75a2.25 2.25 0 0 0 2.25 2.25h13.5A2.25 2.25 0 0 0 21 17.25v-.75M3 16.5l5.25-5.25 3.75 3.75 2.25-2.25L21 16.5M14.25 8.25h.008v.008h-.008V8.25Z" /></svg>
                      {activeImage + 1} / {sortedImages.length}
                    </span>
                  </button>
                ) : (
                  <div className="space-detail-gallery-main flex items-center justify-center bg-gradient-to-br from-[#0E3B34]/10 to-[#B99A63]/10">
                    <svg className="w-24 h-24 text-[#0E3B34]/20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
                    </svg>
                  </div>
                )}
                {[1, 2].map(offset => {
                  const index = sortedImages.length > offset ? offset : -1
                  const image = index >= 0 ? sortedImages[index] : null
                  return image ? (
                    <button key={`${image.id}-${offset}`} type="button" onClick={() => setActiveImage(index)} aria-label={`عرض الصورة ${index + 1}`}>
                      <img src={image.url} alt="" />
                      {offset === 2 && sortedImages.length > 2 && (
                        <span className="absolute inset-0 grid place-items-center bg-[#092C27]/35 text-sm font-bold text-white backdrop-blur-[1px] transition-colors hover:bg-[#092C27]/25">عرض الصور</span>
                      )}
                    </button>
                  ) : (
                    <div key={offset} className="grid place-items-center bg-[#EDE8DE] text-[#0E3B34]/20">
                      <svg className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 20h16M6 20V7l6-3 6 3v13M9 10h2m2 0h2m-6 4h2m2 0h2" /></svg>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Space Info */}
            <section className="space-detail-section pt-3">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="mb-2 text-xs font-bold text-[#A3802F]">{space.type.name} · {space.city}</p>
                  <h1 className="font-display text-3xl font-extrabold leading-tight text-[#1B1B1B] sm:text-4xl">{space.name}</h1>
                  <p dir="ltr" className="mt-1.5 text-right font-mono text-xs font-bold text-[#8B9389]">{formatSpaceNumber(space.refSeq)}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <RatingStars rating={space.reviewSummary.average} />
                    <span className="text-xs font-semibold text-[#0E3B34]">
                      {space.reviewSummary.count > 0
                        ? `${space.reviewSummary.average.toLocaleString('en-US')} من 5`
                        : 'لا توجد تقييمات بعد'}
                    </span>
                    {space.reviewSummary.count > 0 && (
                      <span className="text-xs text-[#5F6764]">
                        ({space.reviewSummary.count.toLocaleString('en-US')} تقييم)
                      </span>
                    )}
                  </div>
                </div>
                <span className="hidden rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700 sm:inline-flex">مساحة معتمدة</span>
              </div>
              <p className="text-[#5F6764] text-sm flex items-center gap-1 mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {fullAddress || `${space.city}${space.district ? `، ${space.district}` : ''}`}
              </p>
              {space.description && <p className="text-[#3F4B47] text-sm leading-relaxed mb-4">{space.description}</p>}

              <div className="mb-5 grid grid-cols-3 divide-x divide-x-reverse divide-[#E0D8CA] border-y border-[#E0D8CA] py-4">
                <div className="px-3 first:ps-0">
                  <p className="text-[11px] font-bold text-[#5F6764]">السعر</p>
                  <p className="mt-1 text-lg font-extrabold text-[#0E3B34]">
                    {space.price.toLocaleString('en-US')} ر.س
                    <span className="text-xs font-semibold text-[#5F6764]"> / {priceLabel}</span>
                  </p>
                </div>
                <div className="px-3">
                  <p className="text-[11px] font-bold text-[#5F6764]">نوع المساحة</p>
                  <p className="mt-1 text-sm font-extrabold text-[#1B1B1B]">{space.type.name}</p>
                </div>
                <div className="px-3 last:pe-0">
                  <p className="text-[11px] font-bold text-[#5F6764]">السعة</p>
                  <p className="mt-1 text-sm font-extrabold text-[#1B1B1B]">
                    {space.capacity ? `${space.capacity.toLocaleString('en-US')} شخص` : 'غير محددة'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4 border-t border-[#D8D1C7]">
                {space.capacity && (
                  <div className="flex items-center gap-2 text-sm text-[#3F4B47]">
                    <svg className="w-4 h-4 text-[#0E3B34]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    الطاقة الاستيعابية: {space.capacity} شخص
                  </div>
                )}
                {space.minBookingHours && (
                  <div className="flex items-center gap-2 text-sm text-[#3F4B47]">
                    <svg className="w-4 h-4 text-[#0E3B34]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    الحد الأدنى: {space.minBookingHours} {space.minBookingHours === 1 ? 'ساعة' : 'ساعات'}
                  </div>
                )}
              </div>
            </section>

            {/* Working Hours */}
            {openDays.length > 0 && (
              <div className="space-detail-section">
                <h3 className="font-display font-extrabold text-[#1B1B1B] text-base mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#B99A63]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  أيام وساعات العمل
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DAY_NAMES.map((name, i) => {
                    const wh = openDays.find(d => d.dayOfWeek === i)
                    return (
                      <div key={i} className={`flex items-center justify-between p-3 rounded-xl text-sm ${wh ? 'bg-[#F5F1E8]' : 'bg-gray-50'}`}>
                        <span className={`font-medium ${wh ? 'text-[#1B1B1B]' : 'text-[#5F6764]'}`}>{name}</span>
                        {wh ? (
                          <span className="text-[#0E3B34] font-medium" dir="ltr">{wh.openTime} - {wh.closeTime}</span>
                        ) : (
                          <span className="text-[#5F6764] text-xs">مغلق</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Amenities */}
            {space.amenities.length > 0 && (
              <div className="space-detail-section">
                <h3 className="font-display font-extrabold text-[#1B1B1B] text-base mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#B99A63]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  المرافق والتجهيزات
                </h3>
                <div className="flex flex-wrap gap-2">
                  {space.amenities.map(({ amenity }) => (
                    <span key={amenity.id} className="bg-[#F5F1E8] text-[#0E3B34] text-sm px-3 py-1.5 rounded-full border border-[#D8D1C7]">
                      {amenity.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Extra Services — read-only info here; selection happens in the booking flow */}
            <div className="space-detail-section">
                <h3 className="font-display font-extrabold text-[#1B1B1B] text-base mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#B99A63]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  خدمات المساحة
                </h3>
                {space.services && space.services.length > 0 ? (
                  <>
                    <div className="space-y-2">
                      {space.services.map(s => (
                        <div key={s.id} className="flex items-center justify-between gap-4 rounded-xl border border-[#D8D1C7] bg-[#F5F1E8] p-3">
                          <div>
                            <span className="text-sm font-medium text-[#1B1B1B]">{s.name}</span>
                            {s.description && <p className="text-xs text-[#5F6764] mt-0.5">{s.description}</p>}
                          </div>
                          <div className="text-end flex-none">
                            {s.pricingType === 'PRINT_MATRIX' ? (
                              <span className="text-xs font-bold text-[#0E3B34]">تفاصيل الأسعار عند الحجز</span>
                            ) : (
                              <>
                                <span className="text-sm font-bold text-[#0E3B34]">{s.price.toLocaleString('en-US')} ر.س</span>
                                <p className="text-[10px] text-[#5F6764]">{pricingTypeLabel(s.pricingType)}</p>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-[#5F6764]">يمكنك اختيار الخدمات وتحديد كمياتها بعد الضغط على «احجز».</p>
                  </>
                ) : (
                  <div className="rounded-xl border border-dashed border-[#D8D1C7] bg-[#FAF8F3] p-4 text-sm text-[#5F6764]">
                    لا توجد خدمات إضافية مفعلة لهذه المساحة حاليًا.
                  </div>
                )}
              </div>

            {/* Rules */}
            <div className="space-detail-section">
                <h3 className="font-display font-extrabold text-[#1B1B1B] text-base mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#B99A63]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  قواعد الاستخدام
                </h3>
                {space.rules && space.rules.length > 0 ? (
                  <ul className="space-y-2">
                    {space.rules.map(r => (
                    <li key={r.id} className="flex items-center gap-2 text-sm text-[#3F4B47]">
                      <svg className="w-3.5 h-3.5 text-[#B99A63] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {r.rule}
                    </li>
                    ))}
                  </ul>
                ) : (
                  <div className="rounded-xl border border-dashed border-[#D8D1C7] bg-[#FAF8F3] p-4 text-sm text-[#5F6764]">
                    لم يضف صاحب المساحة قواعد استخدام إضافية بعد.
                  </div>
                )}
              </div>

            {/* Reviews */}
            <div className="space-detail-section overflow-hidden">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-display font-extrabold text-[#1B1B1B] text-base flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#B99A63]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.519 4.674c.3.921-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.519-4.674a1 1 0 00-.363-1.118L3.077 10.1c-.783-.57-.38-1.81.588-1.81H8.58a1 1 0 00.95-.69l1.519-4.674z" />
                    </svg>
                    التقييمات والآراء
                  </h3>
                  <p className="mt-1 text-xs text-[#5F6764]">
                    آراء المستأجرين الذين أكملوا حجوزاتهم.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#D8D1C7] bg-[#F5F1E8] px-5 py-4 text-center shadow-inner">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl font-extrabold text-[#0E3B34]">
                      {space.reviewSummary.count > 0 ? space.reviewSummary.average.toLocaleString('en-US') : '-'}
                    </span>
                    <RatingStars rating={space.reviewSummary.average} size="md" />
                  </div>
                  <p className="text-[11px] text-[#5F6764]">
                    {space.reviewSummary.count > 0
                      ? `${space.reviewSummary.count.toLocaleString('en-US')} تقييم موثق`
                      : 'غير متاح حالياً'}
                  </p>
                </div>
              </div>

              {space.reviews.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#D8D1C7] bg-[#FAF8F3] p-8 text-center animate-in">
                  <p className="text-sm font-semibold text-[#1B1B1B]">لا توجد تقييمات لهذه المساحة حتى الآن</p>
                  <p className="mt-1 text-xs text-[#5F6764]">ستظهر التقييمات هنا بعد أن يكمل المستأجرون حجوزاتهم.</p>
                </div>
              ) : (
                <div className="space-y-3 motion-list">
                  {space.reviews.map(review => (
                    <div key={review.id} className="rounded-2xl border border-[#D8D1C7] bg-[#FAF8F3] p-4 hover-lift">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-[#1B1B1B]">{review.buyer.name}</p>
                          <p className="text-[11px] text-[#8B9389]">حجز بتاريخ {review.booking.date}</p>
                        </div>
                        <RatingStars rating={review.rating} />
                      </div>
                      {review.comment ? (
                        <p className="text-sm leading-6 text-[#3F4B47]">{review.comment}</p>
                      ) : (
                        <p className="text-sm text-[#8B9389]">تقييم بدون تعليق</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Map */}
            {space.latitude && space.longitude && (
              <div className="space-detail-section">
                <h3 className="font-display font-extrabold text-[#1B1B1B] text-base mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#B99A63]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  الموقع على الخريطة
                </h3>
                <div className="rounded-xl overflow-hidden border border-[#D8D1C7]">
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
                  className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-[#0E3B34] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#092C27] transition-colors"
                >
                  فتح الموقع في الخرائط
                </a>
                {space.landmarks && (
                  <p className="text-xs text-[#5F6764] mt-2">معالم قريبة: {space.landmarks}</p>
                )}
              </div>
            )}
            {(!space.latitude || !space.longitude) && (
              <div className="space-detail-section">
                <h3 className="font-display font-extrabold text-[#1B1B1B] text-base mb-2">الموقع</h3>
                <p className="text-sm text-[#5F6764] mb-4">{fullAddress || space.city}</p>
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-[#0E3B34] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#092C27] transition-colors"
                >
                  فتح الموقع في الخرائط
                </a>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Pricing & Book */}
            <div className="booking-panel sticky top-24">
              <div className="booking-panel-head p-6">
                <p className="mb-1 text-[11px] font-bold text-white/55">السعر يبدأ من</p>
                <span className="text-3xl font-extrabold text-white">{space.price.toLocaleString('en-US')}</span>
                <span className="me-1 text-sm text-white/65"> ر.س / {priceLabel}</span>
                <div className="mt-4 flex items-center gap-2 text-[11px] text-white/65">
                  <svg className="h-4 w-4 text-[#B99A63]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M12 3l7.5 3v5.25c0 4.14-3.2 7.85-7.5 9.75-4.3-1.9-7.5-5.61-7.5-9.75V6L12 3Z" /></svg>
                  حجز مباشر ومؤكد فور توفر الموعد
                </div>
              </div>

              <div className="p-6">

              <button onClick={openBooking}
                className="btn-gold mb-3 flex w-full items-center justify-center gap-2 rounded-lg py-3.5 text-sm font-extrabold">
                احجز
              </button>

              <div className="mb-4 space-y-2">
                <StartConversationButton
                  sellerId={space.seller.id}
                  spaceId={space.id}
                  label="محادثة صاحب المساحة"
                />
              </div>

              {/* Cancellation Policy */}
              <div className={`p-3 rounded-xl border text-center mb-4 ${policy.color}`}>
                <p className="text-xs font-bold">سياسة الإلغاء: {policy.name}</p>
                <p className="text-[10px] mt-0.5">{policy.desc}</p>
              </div>

              {/* Seller Info */}
              <div className="border-t border-[#D8D1C7] pt-4">
                <h4 className="text-xs font-bold text-[#5F6764] mb-3">صاحب المساحة</h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0E3B34] to-[#092C27] flex items-center justify-center text-[#B99A63] font-bold text-lg overflow-hidden">
                    {space.seller.avatarUrl ? (
                      <img src={space.seller.avatarUrl} alt={space.seller.name} className="h-full w-full object-cover" />
                    ) : (
                      space.seller.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1B1B1B]">{space.seller.name}</p>
                    {space.seller.phone && <p className="text-xs text-[#5F6764]" dir="ltr">{space.seller.phone}</p>}
                    <p className="text-xs text-[#5F6764]" dir="ltr">{space.seller.email}</p>
                    <Link href={`/sellers/${space.seller.id}`} className="mt-1 inline-flex text-xs font-bold text-[#0E3B34] hover:text-[#B99A63]">
                      عرض ملف صاحب المساحة
                    </Link>
                  </div>
                </div>
              </div>

              {/* Location summary */}
              {(space.postalCode || space.buildingNumber) && (
                <div className="border-t border-[#D8D1C7] pt-4 mt-4">
                  <h4 className="text-xs font-bold text-[#5F6764] mb-2">تفاصيل العنوان</h4>
                  <div className="text-sm text-[#3F4B47] space-y-1">
                    {space.streetName && <p>الشارع: {space.streetName}</p>}
                    {space.buildingNumber && <p>رقم المبنى: {space.buildingNumber}</p>}
                    {space.postalCode && <p>الرمز البريدي: {space.postalCode}</p>}
                  </div>
                </div>
              )}

              {/* Booking rules */}
              {(space.minBookingHours || space.maxAdvanceBookingDays) && (
                <div className="border-t border-[#D8D1C7] pt-4 mt-4">
                  <h4 className="text-xs font-bold text-[#5F6764] mb-2">قواعد الحجز</h4>
                  <div className="text-xs text-[#3F4B47] space-y-1.5">
                    {space.minBookingHours && <p>الحد الأدنى للحجز: {space.minBookingHours} {space.minBookingHours === 1 ? 'ساعة' : 'ساعات'}</p>}
                    {space.maxAdvanceBookingDays && <p>الحجز المسبق: حتى {space.maxAdvanceBookingDays} يوم</p>}
                  </div>
                </div>
              )}
              <div className="mt-5 flex items-center justify-center gap-2 border-t border-[#D8D1C7] pt-4 text-[11px] font-semibold text-[#5F6764]">
                <svg className="h-4 w-4 text-[#0E3B34]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-10 0v3H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2Zm3-11V7a3 3 0 0 1 6 0v3H9Z" /></svg>
                حجزك وبياناتك محفوظة داخل منصة إحياء مساحة
              </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="mobile-booking-bar">
        <div>
          <p className="text-[10px] font-bold text-[#5F6764]">{space.name}</p>
          <p className="font-display text-lg font-extrabold text-[#1B1B1B]">{space.price.toLocaleString('en-US')} <span className="text-xs font-semibold text-[#5F6764]">ر.س / {priceLabel}</span></p>
        </div>
        <button onClick={openBooking}
          className="btn-primary min-w-36 rounded-lg px-5 py-3 text-sm font-bold">
          احجز
        </button>
      </div>

      {/* Booking Modal — 4-step flow: booking data -> services -> review -> payment */}
      <Modal open={bookingOpen} onClose={closeBooking} title={bookingSuccess ? 'تم الحجز' : STEP_TITLES[bookingStep - 1]}>
        {bookingSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#1B1B1B] mb-2">تم تأكيد حجزك!</h3>
            <p className="text-[#5F6764] text-sm mb-6">ستجد تفاصيل الموعد والوحدة في صفحة حجوزاتي.</p>
            <button onClick={closeBooking}
              className="bg-[#0E3B34] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#092C27]">
              حسناً
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Step indicator */}
            <div className="flex items-center gap-1.5">
              {STEP_TITLES.map((title, index) => (
                <div key={title} className="flex flex-1 items-center gap-1.5">
                  <span className={`flex h-6 w-6 flex-none items-center justify-center rounded-full text-[11px] font-bold ${
                    index + 1 <= bookingStep ? 'bg-[#0E3B34] text-white' : 'bg-[#F5F1E8] text-[#5F6764]'
                  }`}>{index + 1}</span>
                  {index < STEP_TITLES.length - 1 && <span className={`h-0.5 flex-1 rounded ${index + 1 < bookingStep ? 'bg-[#0E3B34]' : 'bg-[#E8E1D3]'}`} />}
                </div>
              ))}
            </div>

            {bookingError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{bookingError}</div>
            )}

            {/* Step 1: Booking data */}
            {bookingStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#3F4B47] mb-1.5">رقم الهوية الوطنية أو السجل التجاري</label>
                  <input value={bookingForm.requesterIdNumber}
                    onChange={e => setBookingForm(p => ({ ...p, requesterIdNumber: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D8D1C7] text-sm focus:outline-none focus:border-[#0E3B34]"
                    placeholder="أدخل الرقم" dir="ltr" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3F4B47] mb-1.5">التاريخ</label>
                  <DatePickerCalendar
                    value={bookingForm.date}
                    onChange={date => setBookingForm(p => ({ ...p, date }))}
                    minDate={todayValue}
                    maxDate={maxBookingDate}
                    isDateEnabled={date => !hasOpenDayRules || openDaySet.has(date.getDay())}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#3F4B47] mb-1.5">وقت البداية</label>
                    <input type="time" value={bookingForm.startTime}
                      onChange={e => setBookingForm(p => ({ ...p, startTime: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D8D1C7] text-sm focus:outline-none focus:border-[#0E3B34]" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3F4B47] mb-1.5">وقت النهاية</label>
                    <input type="time" value={bookingForm.endTime}
                      onChange={e => setBookingForm(p => ({ ...p, endTime: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D8D1C7] text-sm focus:outline-none focus:border-[#0E3B34]" dir="ltr" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3F4B47] mb-1.5">عدد الحضور</label>
                  <input type="number" value={bookingForm.persons}
                    onChange={e => setBookingForm(p => ({ ...p, persons: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D8D1C7] text-sm focus:outline-none focus:border-[#0E3B34]"
                    placeholder="اختياري" min={1} dir="ltr" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3F4B47] mb-1.5">وصف الفعالية</label>
                  <textarea value={bookingForm.purpose}
                    onChange={e => setBookingForm(p => ({ ...p, purpose: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D8D1C7] text-sm focus:outline-none focus:border-[#0E3B34] resize-none"
                    rows={3} placeholder="اكتب نبذة عن الفعالية أو الغرض من الحجز..." />
                </div>
              </div>
            )}

            {/* Step 2: Services */}
            {bookingStep === 2 && (
              <div className="space-y-3">
                {space.services.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#D8D1C7] bg-[#FAF8F3] p-4 text-sm text-[#5F6764]">
                    لا توجد خدمات إضافية متاحة لهذه المساحة.
                  </div>
                ) : space.services.map(service => {
                  const selection = selectedServices[service.id] || { enabled: false, quantity: 1, matrix: {} }
                  return (
                    <div key={service.id} className={`rounded-xl border p-3 transition ${selection.enabled ? 'border-[#0E3B34]/30 bg-[#F5F1E8]' : 'border-[#D8D1C7] bg-white'}`}>
                      <label className="flex cursor-pointer items-center justify-between gap-3">
                        <span className="flex items-center gap-2">
                          <input type="checkbox" checked={selection.enabled} onChange={() => toggleService(service.id)} className="h-4 w-4 accent-[#0E3B34]" />
                          <span className="text-sm font-medium text-[#1B1B1B]">{service.name}</span>
                        </span>
                        {service.pricingType !== 'PRINT_MATRIX' && (
                          <span className="text-xs font-bold text-[#0E3B34]">{service.price.toLocaleString('en-US')} ر.س · {pricingTypeLabel(service.pricingType)}</span>
                        )}
                      </label>
                      {service.description && <p className="mt-1 text-xs text-[#5F6764]">{service.description}</p>}

                      {selection.enabled && service.pricingType === 'PRINT_MATRIX' && (
                        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#D8D1C7] pt-3">
                          {PRINT_MATRIX_FIELDS.map(([key, label]) => {
                            const unitPrice = Number(service.config?.[key]) || 0
                            if (unitPrice <= 0) return null
                            return (
                              <label key={key} className="block">
                                <span className="mb-1 block text-[10px] text-[#5F6764]">{label} · {unitPrice.toLocaleString('en-US')} ر.س / 10 صفحات</span>
                                <input type="number" min="0" value={selection.matrix[key] ?? ''}
                                  onChange={e => updateServiceMatrix(service.id, key, Number(e.target.value) || 0)}
                                  className="w-full rounded-lg border border-[#D8D1C7] px-2 py-1.5 text-xs" dir="ltr"
                                  placeholder="عدد الأطقم (10 صفحات)" />
                              </label>
                            )
                          })}
                        </div>
                      )}

                      {selection.enabled && service.pricingType !== 'PRINT_MATRIX' && service.pricingType !== 'PER_PERSON' && service.pricingType !== 'PER_BOOKING' && (
                        <div className="mt-3 border-t border-[#D8D1C7] pt-3">
                          <label className="block max-w-32">
                            <span className="mb-1 block text-[10px] text-[#5F6764]">{service.pricingType === 'PER_HOUR' ? 'العدد (لكل ساعة)' : 'الكمية'}</span>
                            <input type="number" min="1" value={selection.quantity}
                              onChange={e => updateServiceQuantity(service.id, Number(e.target.value) || 1)}
                              className="w-full rounded-lg border border-[#D8D1C7] px-2 py-1.5 text-xs" dir="ltr" />
                          </label>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Step 3: Review */}
            {bookingStep === 3 && (
              <div className="space-y-4">
                <div className="rounded-xl border border-[#D8D1C7] bg-[#F5F1E8] p-4 text-sm">
                  <p className="mb-1 flex justify-between"><span className="text-[#5F6764]">التاريخ</span><span className="font-bold text-[#1B1B1B]" dir="ltr">{bookingForm.date}</span></p>
                  <p className="mb-1 flex justify-between"><span className="text-[#5F6764]">الوقت</span><span className="font-bold text-[#1B1B1B]" dir="ltr">{bookingForm.startTime} - {bookingForm.endTime}</span></p>
                  <p className="mb-1 flex justify-between"><span className="text-[#5F6764]">عدد الساعات</span><span className="font-bold text-[#1B1B1B]">{hours.toLocaleString('en-US')}</span></p>
                  {bookingForm.persons && <p className="flex justify-between"><span className="text-[#5F6764]">عدد الحضور</span><span className="font-bold text-[#1B1B1B]">{bookingForm.persons}</span></p>}
                </div>

                <div className="rounded-xl border border-[#D8D1C7] p-4 text-sm">
                  <p className="mb-2 flex justify-between"><span className="text-[#5F6764]">السعر الأساسي</span><span className="font-bold text-[#1B1B1B]">{pricing.basePrice.toLocaleString('en-US')} ر.س</span></p>
                  {pricing.discountAmount > 0 && (
                    <p className="mb-2 flex justify-between text-green-700"><span>خصم المدة ({pricing.discountPercent.toLocaleString('en-US')}%)</span><span className="font-bold">-{pricing.discountAmount.toLocaleString('en-US')} ر.س</span></p>
                  )}
                  {pricing.serviceLines.map(line => (
                    <p key={line.name} className="mb-2 flex justify-between text-[#3F4B47]"><span>{line.name}</span><span className="font-bold">{line.total.toLocaleString('en-US')} ر.س</span></p>
                  ))}
                  <div className="mt-2 flex justify-between border-t border-[#D8D1C7] pt-2 text-base">
                    <span className="font-bold text-[#1B1B1B]">الإجمالي</span>
                    <span className="font-extrabold text-[#0E3B34]">{pricing.grandTotal.toLocaleString('en-US')} ر.س</span>
                  </div>
                </div>

                {bookingForm.purpose && (
                  <div className="rounded-xl border border-dashed border-[#D8D1C7] p-3 text-xs text-[#5F6764]">
                    <span className="font-bold text-[#3F4B47]">وصف الفعالية: </span>{bookingForm.purpose}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Payment */}
            {bookingStep === 4 && (
              <div className="space-y-4">
                <div className="rounded-xl border border-[#D8D1C7] bg-[#F5F1E8] p-4 text-center">
                  <p className="text-xs font-bold text-[#5F6764]">المبلغ المطلوب</p>
                  <p className="text-2xl font-extrabold text-[#0E3B34]">{pricing.grandTotal.toLocaleString('en-US')} ر.س</p>
                </div>

                <div className="space-y-2">
                  {[
                    { value: 'mada', label: 'مدى' },
                    { value: 'card', label: 'بطاقة ائتمان (فيزا / ماستركارد)' },
                    { value: 'apple_pay', label: 'Apple Pay' },
                  ].map(method => (
                    <label key={method.value} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm font-medium ${paymentMethod === method.value ? 'border-[#0E3B34] bg-[#F5F1E8]' : 'border-[#D8D1C7]'}`}>
                      <input type="radio" name="paymentMethod" checked={paymentMethod === method.value} onChange={() => setPaymentMethod(method.value)} className="h-4 w-4 accent-[#0E3B34]" />
                      {method.label}
                    </label>
                  ))}
                </div>

                <label className="flex cursor-pointer items-start gap-2 text-xs text-[#3F4B47]">
                  <input type="checkbox" checked={agreedToTerms} onChange={() => setAgreedToTerms(current => !current)} className="mt-0.5 h-4 w-4 accent-[#0E3B34]" />
                  <span>أقر بأنني اطلعت على تفاصيل الحجز وأحكام وشروط إحياء مساحة، ووافقت على شروط وأحكام صاحب المساحة، وسياسة الإلغاء والاسترداد، وألتزم بجميع التعليمات المنظمة لاستخدام المساحة، وأتحمل مسؤولية أي أضرار أو مخالفات تصدر مني أو من أي من الحضور أثناء فترة الحجز.</span>
                </label>
              </div>
            )}

            {/* Step navigation */}
            <div className="flex gap-3 pt-2">
              {bookingStep > 1 && (
                <button type="button" onClick={goPrev}
                  className="flex-1 rounded-xl border border-[#D8D1C7] py-3 text-sm font-semibold text-[#3F4B47] hover:bg-[#F5F1E8] transition-colors">
                  السابق
                </button>
              )}
              {bookingStep < 4 ? (
                <button type="button" onClick={goNext}
                  className="flex-1 rounded-xl bg-[#0E3B34] py-3 text-sm font-semibold text-white hover:bg-[#092C27] transition-colors">
                  التالي
                </button>
              ) : (
                <button type="button" onClick={handleConfirmBooking} disabled={bookingLoading}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#0E3B34] py-3 text-sm font-semibold text-white hover:bg-[#092C27] transition-colors disabled:opacity-60">
                  {bookingLoading && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {bookingLoading ? 'جاري التأكيد...' : `ادفع ${pricing.grandTotal.toLocaleString('en-US')} ر.س`}
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Footer />
    </div>
  )
}

function pricingTypeLabel(type: string) {
  const labels: Record<string, string> = {
    PER_BOOKING: 'للحجز',
    PER_PERSON: 'للشخص',
    PER_HOUR: 'بالساعة',
    PER_ITEM: 'للقطعة',
    PER_TEN_PAGES: 'لكل 10 صفحات',
    PRINT_MATRIX: 'مصفوفة طباعة',
  }
  return labels[type] || 'حسب الخدمة'
}
