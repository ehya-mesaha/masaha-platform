'use client'

import { Suspense, useState, useEffect, useMemo, useRef } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import PublicNavbar from '@/components/layout/PublicNavbar'
import Footer from '@/components/layout/Footer'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import StartConversationButton from '@/components/chat/StartConversationButton'
import { formatSpaceNumber, formatTime12 } from '@/lib/format'
import { LEGAL_LINKS, LEGAL_UPDATED_AT_AR, LEGAL_VERSION } from '@/lib/legal'
import { generateWeekdayDates, parseDateValue } from '@/lib/sessionDates'

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
type AvailabilityCheck = {
  status: 'checking' | 'available' | 'unavailable' | 'error'
  availableSessions: number
  totalSessions: number
  dates: Record<string, 'available' | 'unavailable'>
}

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
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>}>
      <SpaceDetailPageInner />
    </Suspense>
  )
}

function SpaceDetailPageInner() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [space, setSpace] = useState<Space | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [todayValue] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  })

  const EMPTY_BOOKING_FORM = { requesterIdNumber: '', startTime: '', endTime: '', persons: '', purpose: '' }

  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookingStep, setBookingStep] = useState(1)
  const [bookingForm, setBookingForm] = useState(EMPTY_BOOKING_FORM)
  const [bookingMode, setBookingMode] = useState<'single' | 'program'>('single')
  const [singleDate, setSingleDate] = useState('')
  const [programStart, setProgramStart] = useState('')
  const [programEnd, setProgramEnd] = useState('')
  const [programWeekdays, setProgramWeekdays] = useState<number[]>([])
  const [datesFromSearch, setDatesFromSearch] = useState(false)
  const [selectedServicesByDate, setSelectedServicesByDate] = useState<Record<string, Record<string, ServiceSelection>>>({})
  const [expandedServiceDate, setExpandedServiceDate] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState('mada')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [availabilityCheck, setAvailabilityCheck] = useState<AvailabilityCheck | null>(null)
  const advancingRef = useRef(false)

  const bookingDates = useMemo(() => {
    if (bookingMode === 'single') return singleDate ? [singleDate] : []
    return generateWeekdayDates(programStart, programEnd, programWeekdays)
  }, [bookingMode, singleDate, programStart, programEnd, programWeekdays])

  useEffect(() => {
    fetch(`/api/spaces/${id}`)
      .then(r => r.json())
      .then(data => { setSpace(data.space); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  function updateBookingForm(patch: Partial<typeof EMPTY_BOOKING_FORM>) {
    setBookingForm(current => ({ ...current, ...patch }))
    setBookingError('')
  }

  function openBooking() {
    const firstOpenDay = space?.workingHours.find(item => item.isOpen)
    const spMode = searchParams.get('mode')
    const spDate = searchParams.get('date')
    const spStartDate = searchParams.get('startDate')
    const spEndDate = searchParams.get('endDate')
    const spWeekdays = searchParams.get('weekdays')
    const spStartTime = searchParams.get('startTime')
    const spEndTime = searchParams.get('endTime')

    const hasProgramParams = spMode === 'program' && Boolean(spStartDate) && Boolean(spEndDate) && Boolean(spWeekdays)
    const hasSingleParams = Boolean(spDate)

    setBookingStep(1)
    setBookingError('')
    setBookingMode(hasProgramParams ? 'program' : 'single')
    setSingleDate(hasProgramParams ? '' : spDate || '')
    setProgramStart(hasProgramParams ? spStartDate || '' : '')
    setProgramEnd(hasProgramParams ? spEndDate || '' : '')
    setProgramWeekdays(hasProgramParams ? (spWeekdays || '').split(',').map(Number).filter(n => Number.isInteger(n)) : [])
    setDatesFromSearch(hasProgramParams || hasSingleParams)
    setBookingForm({
      ...EMPTY_BOOKING_FORM,
      startTime: spStartTime || firstOpenDay?.openTime || '09:00',
      endTime: spEndTime || firstOpenDay?.closeTime || '12:00',
    })
    setAvailabilityCheck(null)
    setSelectedServicesByDate({})
    setExpandedServiceDate(null)
    setPaymentMethod('mada')
    setAgreedToTerms(false)
    setBookingOpen(true)
  }

  function closeBooking() {
    setBookingOpen(false)
    setBookingSuccess(false)
    setBookingError('')
    setAvailabilityCheck(null)
  }

  function updateDateServices(date: string, updater: (current: Record<string, ServiceSelection>) => Record<string, ServiceSelection>) {
    setSelectedServicesByDate(current => ({ ...current, [date]: updater(current[date] || {}) }))
  }

  function toggleService(date: string, serviceId: string) {
    updateDateServices(date, services => {
      const existing = services[serviceId] || { enabled: false, quantity: 1, matrix: {} }
      return { ...services, [serviceId]: { ...existing, enabled: !existing.enabled } }
    })
  }

  function updateServiceQuantity(date: string, serviceId: string, quantity: number) {
    updateDateServices(date, services => ({
      ...services,
      [serviceId]: { ...(services[serviceId] || { enabled: true, quantity: 1, matrix: {} }), quantity: Math.max(1, quantity) },
    }))
  }

  function updateServiceMatrix(date: string, serviceId: string, key: keyof PrintMatrixConfig, value: number) {
    updateDateServices(date, services => {
      const existing = services[serviceId] || { enabled: true, quantity: 1, matrix: {} }
      return { ...services, [serviceId]: { ...existing, matrix: { ...existing.matrix, [key]: Math.max(0, value) } } }
    })
  }

  const hours = useMemo(() => parseHours(bookingForm.startTime, bookingForm.endTime), [bookingForm.startTime, bookingForm.endTime])
  const persons = Number(bookingForm.persons) || 0

  const pricing = useMemo(() => {
    const emptyResult = {
      basePrice: 0, discountPercent: 0, discountAmount: 0, servicesTotal: 0, grandTotal: 0, totalHours: 0,
      perDate: [] as { date: string; serviceLines: { name: string; total: number }[]; dateServicesTotal: number }[],
    }
    if (!space || bookingDates.length === 0) return emptyResult

    const totalHours = hours * bookingDates.length
    const basePrice = space.price * totalHours
    const tier = [...space.pricingTiers].sort((a, b) => b.minHours - a.minHours).find(t => totalHours >= t.minHours)
    const tierDiscount = tier?.discountPercent ?? 0
    const recurringDiscount = bookingDates.length > 1 ? 5 : 0
    const discountPercent = Math.max(tierDiscount, recurringDiscount)
    const discountAmount = basePrice * discountPercent / 100

    const perDate = [...bookingDates].sort().map(date => {
      const dateSelections = selectedServicesByDate[date] || {}
      const serviceLines = space.services
        .filter(service => dateSelections[service.id]?.enabled)
        .map(service => ({ name: service.name, total: serviceLineTotal(service, dateSelections[service.id], persons, hours) }))
        .filter(line => line.total > 0)
      return { date, serviceLines, dateServicesTotal: serviceLines.reduce((sum, line) => sum + line.total, 0) }
    })
    const servicesTotal = perDate.reduce((sum, d) => sum + d.dateServicesTotal, 0)
    const grandTotal = basePrice - discountAmount + servicesTotal
    return { basePrice, discountPercent, discountAmount, servicesTotal, grandTotal, totalHours, perDate }
  }, [space, hours, persons, bookingDates, selectedServicesByDate])

  function validateStep(step: number): string {
    if (step === 1) {
      if (!bookingForm.requesterIdNumber.trim()) return 'أدخل رقم الهوية الوطنية أو السجل التجاري'
      if (bookingMode === 'single' && !singleDate) return 'اختر تاريخ الحجز'
      if (bookingMode === 'program' && (!programStart || !programEnd)) return 'اختر تاريخ بداية ونهاية البرنامج'
      if (bookingMode === 'program' && programEnd < programStart) return 'يجب أن يكون تاريخ النهاية بعد تاريخ البداية'
      if (bookingMode === 'program' && programWeekdays.length === 0) return 'اختر يومًا واحدًا على الأقل للبرنامج'
      if (bookingMode === 'single' && singleDate && hasOpenDayRules && !openDaySet.has(parseDateValue(singleDate).getDay())) {
        return 'المساحة مغلقة في هذا اليوم، اختر تاريخًا آخر'
      }
      if (bookingDates.length === 0) return 'لم يتم العثور على مواعيد ضمن المعايير المحددة'
      if (!bookingForm.startTime || !bookingForm.endTime) return 'حدد وقت البداية والنهاية'
      if (hours <= 0) return 'يجب أن يكون وقت النهاية بعد وقت البداية'
    }
    if (step === 4 && !agreedToTerms) return 'يجب الموافقة على الشروط والأحكام لإتمام الحجز'
    return ''
  }

  async function verifyAvailability(showError = true) {
    if (bookingDates.length === 0 || !bookingForm.startTime || !bookingForm.endTime || hours <= 0) return false
    setAvailabilityCheck(current => ({
      status: 'checking',
      availableSessions: current?.availableSessions || 0,
      totalSessions: bookingDates.length,
      dates: current?.dates || {},
    }))
    try {
      const response = await fetch(`/api/spaces/${id}/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dates: bookingDates, startTime: bookingForm.startTime, endTime: bookingForm.endTime }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'تعذر التحقق من الموعد')
      const dates = Object.fromEntries(
        (data.dates as { date: string; available: boolean }[]).map(item => [item.date, item.available ? 'available' : 'unavailable']),
      ) as Record<string, 'available' | 'unavailable'>
      const nextCheck: AvailabilityCheck = {
        status: data.fullyAvailable ? 'available' : 'unavailable',
        availableSessions: data.availableSessions,
        totalSessions: data.totalSessions,
        dates,
      }
      setAvailabilityCheck(nextCheck)
      if (!data.fullyAvailable && showError) {
        setBookingError('بعض المواعيد المحددة غير متاحة. اختر الأيام المعلّمة بالأخضر أو غيّر الوقت.')
      }
      return Boolean(data.fullyAvailable)
    } catch {
      setAvailabilityCheck({ status: 'error', availableSessions: 0, totalSessions: bookingDates.length, dates: {} })
      if (showError) setBookingError('تعذر التحقق من التوفر الآن. حاول مرة أخرى.')
      return false
    }
  }

  async function goNext() {
    if (advancingRef.current) return
    const error = validateStep(bookingStep)
    if (error) { setBookingError(error); return }
    advancingRef.current = true
    try {
      if (bookingStep === 1 && availabilityCheck?.status !== 'available' && !(await verifyAvailability())) return
      setBookingError('')
      setBookingStep(current => Math.min(4, current + 1))
    } finally {
      advancingRef.current = false
    }
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
      const servicesByDate: Record<string, { configId: string; quantity: number; matrix: PrintMatrixConfig }[]> = {}
      for (const date of bookingDates) {
        const dateSelections = selectedServicesByDate[date] || {}
        servicesByDate[date] = Object.entries(dateSelections)
          .filter(([, selection]) => selection.enabled)
          .map(([configId, selection]) => ({ configId, quantity: selection.quantity, matrix: selection.matrix }))
      }

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spaceId: id,
          requesterIdNumber: bookingForm.requesterIdNumber,
          mode: 'dates',
          dates: bookingDates,
          startTime: bookingForm.startTime,
          endTime: bookingForm.endTime,
          persons: bookingForm.persons,
          notes: bookingForm.purpose,
          servicesByDate,
          termsAccepted: true,
          termsVersion: LEGAL_VERSION,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 401) { router.push('/auth/login'); return }
        if (res.status === 409) {
          setBookingStep(1)
          setBookingError('تغيّر توفر الموعد قبل التأكيد. اختر موعدًا آخر وسنتحقق منه فورًا.')
          void verifyAvailability(false)
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
    ? (() => {
        const [year, month, day] = todayValue.split('-').map(Number)
        const future = new Date(year, month - 1, day + space.maxAdvanceBookingDays)
        return `${future.getFullYear()}-${String(future.getMonth() + 1).padStart(2, '0')}-${String(future.getDate()).padStart(2, '0')}`
      })()
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
              <div className={`space-detail-gallery ${sortedImages.length <= 1 ? 'is-single' : sortedImages.length === 2 ? 'is-double' : ''}`}>
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
                {sortedImages.slice(1, 3).map((image, secondaryIndex) => {
                  const index = secondaryIndex + 1
                  return (
                    <button key={`${image.id}-${index}`} type="button" onClick={() => setActiveImage(index)} aria-label={`عرض الصورة ${index + 1}`}>
                      <img src={image.url} alt="" />
                      {secondaryIndex === 1 && sortedImages.length > 3 && (
                        <span className="absolute inset-0 grid place-items-center bg-[#092C27]/35 text-sm font-bold text-white backdrop-blur-[1px] transition-colors hover:bg-[#092C27]/25">عرض الصور</span>
                      )}
                    </button>
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

            {/* Availability */}
            <div className="space-detail-section">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="mb-1 text-[11px] font-extrabold text-[#B99A63]">التوفر الأسبوعي</p>
                    <h3 className="font-display flex items-center gap-2 text-base font-extrabold text-[#1B1B1B]">
                  <svg className="w-4 h-4 text-[#B99A63]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                      الأيام والأوقات المتاحة
                    </h3>
                    <p className="mt-1 text-xs text-[#5F6764]">اختر التاريخ والوقت داخل الحجز لنؤكد التوفر الفعلي قبل الدفع.</p>
                  </div>
                  <button type="button" onClick={openBooking} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#0E3B34] px-4 py-2 text-xs font-extrabold text-[#0E3B34] transition-all hover:-translate-y-0.5 hover:bg-[#0E3B34] hover:text-white">
                    تحقق من موعدك
                  </button>
                </div>
                {openDays.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {DAY_NAMES.map((name, i) => {
                    const wh = openDays.find(d => d.dayOfWeek === i)
                    return (
                      <div key={i} className={`flex items-center justify-between rounded-lg border p-3 text-sm ${wh ? 'border-[#D8D1C7] bg-[#F5F1E8]' : 'border-transparent bg-gray-50'}`}>
                        <span className={`font-medium ${wh ? 'text-[#1B1B1B]' : 'text-[#5F6764]'}`}>{name}</span>
                        {wh ? (
                          <span className="text-[#0E3B34] font-medium" dir="ltr">{formatTime12(wh.openTime)} - {formatTime12(wh.closeTime)}</span>
                        ) : (
                          <span className="text-[#5F6764] text-xs">مغلق</span>
                        )}
                      </div>
                    )
                  })}
                  </div>
                ) : (
                  <div className="availability-flexible-note flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                    <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-white text-lg font-black text-emerald-700">✓</span>
                    <div>
                      <p className="text-sm font-extrabold text-emerald-900">مواعيد مرنة طوال الأسبوع</p>
                      <p className="mt-0.5 text-xs leading-5 text-emerald-700">لا توجد ساعات ثابتة لهذه المساحة. أدخل موعدك وسيتحقق النظام من القاعة المتاحة فورًا.</p>
                    </div>
                  </div>
                )}
              </div>

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
                    onChange={e => updateBookingForm({ requesterIdNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D8D1C7] text-sm focus:outline-none focus:border-[#0E3B34]"
                    placeholder="أدخل الرقم" dir="ltr" />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <label className="block text-xs font-bold text-[#3F4B47]">المواعيد</label>
                    {datesFromSearch && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        مستوردة من بحثك
                      </span>
                    )}
                  </div>
                  <div className="mb-3 flex gap-1.5 rounded-xl border border-[#D8D1C7] bg-[#FAF8F3] p-1">
                    <button type="button" onClick={() => { setBookingMode('single'); setAvailabilityCheck(null); setBookingError('') }}
                      className={`flex-1 rounded-lg px-3 py-2 text-xs font-extrabold transition ${bookingMode === 'single' ? 'bg-[#0E3B34] text-white shadow-sm' : 'text-[#5F6A61] hover:bg-white'}`}>
                      حجز مرة واحدة
                    </button>
                    <button type="button" onClick={() => { setBookingMode('program'); setAvailabilityCheck(null); setBookingError('') }}
                      className={`flex-1 rounded-lg px-3 py-2 text-xs font-extrabold transition ${bookingMode === 'program' ? 'bg-[#0E3B34] text-white shadow-sm' : 'text-[#5F6A61] hover:bg-white'}`}>
                      برنامج متكرر
                    </button>
                  </div>

                  {bookingMode === 'single' ? (
                    <input type="date" value={singleDate} min={todayValue} max={maxBookingDate}
                      onChange={e => { setSingleDate(e.target.value); setAvailabilityCheck(null); setBookingError('') }}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D8D1C7] text-sm focus:outline-none focus:border-[#0E3B34]" dir="ltr" />
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <input type="date" value={programStart} min={todayValue} max={maxBookingDate}
                          onChange={e => { setProgramStart(e.target.value); setAvailabilityCheck(null); setBookingError('') }}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#D8D1C7] text-sm focus:outline-none focus:border-[#0E3B34]" dir="ltr" aria-label="من تاريخ" />
                        <input type="date" value={programEnd} min={programStart || todayValue} max={maxBookingDate}
                          onChange={e => { setProgramEnd(e.target.value); setAvailabilityCheck(null); setBookingError('') }}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#D8D1C7] text-sm focus:outline-none focus:border-[#0E3B34]" dir="ltr" aria-label="إلى تاريخ" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {DAY_NAMES.map((name, dayIndex) => {
                          const closed = hasOpenDayRules && !openDaySet.has(dayIndex)
                          return (
                            <button key={name} type="button" disabled={closed}
                              onClick={() => {
                                setProgramWeekdays(current => current.includes(dayIndex) ? current.filter(d => d !== dayIndex) : [...current, dayIndex])
                                setAvailabilityCheck(null)
                                setBookingError('')
                              }}
                              className={`rounded-full border px-3.5 py-2 text-xs font-bold transition ${
                                programWeekdays.includes(dayIndex)
                                  ? 'border-[#0E3B34] bg-[#0E3B34] text-white'
                                  : closed
                                    ? 'cursor-not-allowed border-[#E8E1D3] bg-[#F5F1E8] text-[#B5B0A2]'
                                    : 'border-[#D8D1C7] bg-white text-[#556159] hover:border-[#B99A63]'
                              }`}>
                              {name}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {bookingDates.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      {[...bookingDates].sort().map(date => (
                        <span key={date} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold text-white ${availabilityCheck?.dates[date] === 'unavailable' ? 'border-red-600 bg-red-600' : 'border-[#0E3B34] bg-[#0E3B34]'}`}>
                          <span dir="ltr">{date}</span>
                        </span>
                      ))}
                      {bookingMode === 'program' && bookingDates.length > 1 && (
                        <span className="text-[11px] font-bold text-[#8B9389]">خصم 5% يُطبّق تلقائيًا لأكثر من يوم</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#3F4B47] mb-1.5">وقت البداية</label>
                    <input type="time" value={bookingForm.startTime}
                      onChange={e => { updateBookingForm({ startTime: e.target.value }); setAvailabilityCheck(null) }}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D8D1C7] text-sm focus:outline-none focus:border-[#0E3B34]" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3F4B47] mb-1.5">وقت النهاية</label>
                    <input type="time" value={bookingForm.endTime}
                      onChange={e => { updateBookingForm({ endTime: e.target.value }); setAvailabilityCheck(null) }}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D8D1C7] text-sm focus:outline-none focus:border-[#0E3B34]" dir="ltr" />
                  </div>
                </div>
                {bookingDates.length > 0 && bookingForm.startTime && bookingForm.endTime && hours > 0 && (
                  <button
                    type="button"
                    onClick={() => void verifyAvailability()}
                    disabled={availabilityCheck?.status === 'checking'}
                    className={`availability-check w-full rounded-lg border px-4 py-3 text-start transition-all ${
                      availabilityCheck?.status === 'available'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                        : availabilityCheck?.status === 'unavailable'
                          ? 'border-red-200 bg-red-50 text-red-700'
                          : 'border-[#D8D1C7] bg-[#FAF8F3] text-[#3F4B47] hover:border-[#B99A63]'
                    }`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span>
                        <strong className="block text-sm">
                          {availabilityCheck?.status === 'checking' && 'جاري التحقق من التوفر...'}
                          {availabilityCheck?.status === 'available' && 'الموعد متاح للحجز'}
                          {availabilityCheck?.status === 'unavailable' && `${availabilityCheck.availableSessions} من ${availabilityCheck.totalSessions} مواعيد متاحة`}
                          {availabilityCheck?.status === 'error' && 'تعذر التحقق، اضغط للمحاولة مجددًا'}
                          {!availabilityCheck && 'تحقق من توفر الموعد'}
                        </strong>
                        <span className="mt-0.5 block text-[11px] opacity-75">نؤكد توفر القاعة قبل انتقالك للخدمات والدفع.</span>
                      </span>
                      <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-white/70 text-base">
                        {availabilityCheck?.status === 'available' ? '✓' : availabilityCheck?.status === 'unavailable' ? '!' : '↻'}
                      </span>
                    </span>
                  </button>
                )}
                <div>
                  <label className="block text-xs font-bold text-[#3F4B47] mb-1.5">عدد الحضور</label>
                  <input type="number" value={bookingForm.persons}
                    onChange={e => updateBookingForm({ persons: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D8D1C7] text-sm focus:outline-none focus:border-[#0E3B34]"
                    placeholder="اختياري" min={1} dir="ltr" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3F4B47] mb-1.5">وصف الفعالية</label>
                  <textarea value={bookingForm.purpose}
                    onChange={e => updateBookingForm({ purpose: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D8D1C7] text-sm focus:outline-none focus:border-[#0E3B34] resize-none"
                    rows={3} placeholder="اكتب نبذة عن الفعالية أو الغرض من الحجز..." />
                </div>
              </div>
            )}

            {/* Step 2: Services (per selected date) */}
            {bookingStep === 2 && (
              <div className="space-y-3">
                {space.services.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#D8D1C7] bg-[#FAF8F3] p-4 text-sm text-[#5F6764]">
                    لا توجد خدمات إضافية متاحة لهذه المساحة.
                  </div>
                ) : [...bookingDates].sort().map((date, index) => {
                  const isOpen = expandedServiceDate ? expandedServiceDate === date : index === 0
                  const dateInfo = pricing.perDate.find(d => d.date === date)
                  const dateSelections = selectedServicesByDate[date] || {}
                  return (
                    <div key={date} className="overflow-hidden rounded-xl border border-[#D8D1C7]">
                      <button type="button" onClick={() => setExpandedServiceDate(isOpen ? null : date)}
                        className="flex w-full items-center justify-between bg-[#F5F1E8] p-3">
                        <span className="text-sm font-bold text-[#1B1B1B]" dir="ltr">{date}</span>
                        <span className="flex items-center gap-2 text-xs font-semibold text-[#5F6764]">
                          {dateInfo && dateInfo.serviceLines.length > 0 && `${dateInfo.serviceLines.length.toLocaleString('en-US')} خدمة · ${dateInfo.dateServicesTotal.toLocaleString('en-US')} ر.س`}
                          <svg className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                          </svg>
                        </span>
                      </button>
                      {isOpen && (
                        <div className="space-y-2 border-t border-[#D8D1C7] p-3">
                          {space.services.map(service => {
                            const selection = dateSelections[service.id] || { enabled: false, quantity: 1, matrix: {} }
                            return (
                              <div key={service.id} className={`rounded-xl border p-3 transition ${selection.enabled ? 'border-[#0E3B34]/30 bg-[#F5F1E8]' : 'border-[#D8D1C7] bg-white'}`}>
                                <label className="flex cursor-pointer items-center justify-between gap-3">
                                  <span className="flex items-center gap-2">
                                    <input type="checkbox" checked={selection.enabled} onChange={() => toggleService(date, service.id)} className="h-4 w-4 accent-[#0E3B34]" />
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
                                            onChange={e => updateServiceMatrix(date, service.id, key, Number(e.target.value) || 0)}
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
                                        onChange={e => updateServiceQuantity(date, service.id, Number(e.target.value) || 1)}
                                        className="w-full rounded-lg border border-[#D8D1C7] px-2 py-1.5 text-xs" dir="ltr" />
                                    </label>
                                  </div>
                                )}
                              </div>
                            )
                          })}
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
                  <p className="mb-1 flex justify-between"><span className="text-[#5F6764]">عدد الأيام</span><span className="font-bold text-[#1B1B1B]">{bookingDates.length.toLocaleString('en-US')}</span></p>
                  <p className="mb-1 flex justify-between"><span className="text-[#5F6764]">الوقت</span><span className="font-bold text-[#1B1B1B]" dir="ltr">{bookingForm.startTime} - {bookingForm.endTime}</span></p>
                  <p className="mb-1 flex justify-between"><span className="text-[#5F6764]">إجمالي الساعات</span><span className="font-bold text-[#1B1B1B]">{pricing.totalHours.toLocaleString('en-US')}</span></p>
                  {bookingForm.persons && <p className="flex justify-between"><span className="text-[#5F6764]">عدد الحضور</span><span className="font-bold text-[#1B1B1B]">{bookingForm.persons}</span></p>}
                </div>

                {bookingDates.length > 1 && (
                  <p className="rounded-xl border border-dashed border-[#D8D1C7] bg-[#FAF8F3] p-3 text-xs text-[#5F6764]">
                    قد تختلف القاعة المخصصة من يوم لآخر حسب التوفر.
                  </p>
                )}

                <div className="space-y-2">
                  {pricing.perDate.map(({ date, serviceLines }) => (
                    <div key={date} className="rounded-xl border border-[#D8D1C7] p-3 text-sm">
                      <p className="mb-1.5 font-bold text-[#1B1B1B]" dir="ltr">{date}</p>
                      <p className="flex justify-between text-xs text-[#5F6764]">
                        <span>سعر المساحة ({hours.toLocaleString('en-US')} ساعة)</span>
                        <span className="font-bold text-[#3F4B47]">{(space.price * hours).toLocaleString('en-US')} ر.س</span>
                      </p>
                      {serviceLines.map(line => (
                        <p key={line.name} className="flex justify-between ps-3 text-xs text-[#5F6764]">
                          <span>+ {line.name}</span>
                          <span className="font-bold text-[#3F4B47]">{line.total.toLocaleString('en-US')} ر.س</span>
                        </p>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-[#D8D1C7] p-4 text-sm">
                  <p className="mb-2 flex justify-between"><span className="text-[#5F6764]">السعر الأساسي (كل الأيام)</span><span className="font-bold text-[#1B1B1B]">{pricing.basePrice.toLocaleString('en-US')} ر.س</span></p>
                  {pricing.discountAmount > 0 && (
                    <p className="mb-2 flex justify-between text-green-700"><span>خصم ({pricing.discountPercent.toLocaleString('en-US')}%)</span><span className="font-bold">-{pricing.discountAmount.toLocaleString('en-US')} ر.س</span></p>
                  )}
                  <p className="mb-2 flex justify-between text-[#3F4B47]"><span>إجمالي الخدمات</span><span className="font-bold">{pricing.servicesTotal.toLocaleString('en-US')} ر.س</span></p>
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
                  <span>
                    أقر بأنني فتحت وقرأت وفهمت{' '}
                    <Link href={LEGAL_LINKS.platformTerms} target="_blank" rel="noopener noreferrer" className="font-extrabold text-[#0E3B34] underline underline-offset-2">شروط استخدام المنصة</Link>
                    {' '}و
                    <Link href={LEGAL_LINKS.bookingTerms} target="_blank" rel="noopener noreferrer" className="font-extrabold text-[#0E3B34] underline underline-offset-2">شروط الحجز والخدمات</Link>
                    {' '}و
                    <Link href={LEGAL_LINKS.privacy} target="_blank" rel="noopener noreferrer" className="font-extrabold text-[#0E3B34] underline underline-offset-2">سياسة الخصوصية</Link>
                    ، ووافقت على شروط صاحب المساحة وسياسة الإلغاء والاسترداد. النسخة الحالية: {LEGAL_UPDATED_AT_AR}.
                  </span>
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
                <button type="button" onClick={() => void goNext()} disabled={availabilityCheck?.status === 'checking'}
                  className="flex-1 rounded-xl bg-[#0E3B34] py-3 text-sm font-semibold text-white hover:bg-[#092C27] transition-colors disabled:cursor-wait disabled:opacity-60">
                  {bookingStep === 1 && availabilityCheck?.status === 'checking' ? 'جاري التحقق...' : 'التالي'}
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
