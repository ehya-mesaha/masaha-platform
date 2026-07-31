'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Badge, { getBookingStatusBadge } from '@/components/ui/Badge'
import { formatDate, formatNumber, formatTimeRange } from '@/lib/format'
import { useLanguage } from '@/components/i18n/LanguageProvider'

export type BuyerBookingItem = {
  id: string
  status: string
  startTime: string
  endTime: string
  grandTotal: number
  sellerNote: string | null
  hasReview: boolean
  space: {
    name: string
    city: string
    district: string | null
    typeName: string
    imageUrl: string | null
  }
}

type Filter = 'all' | 'upcoming' | 'completed' | 'cancelled'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'الكل' },
  { value: 'upcoming', label: 'القادمة' },
  { value: 'completed', label: 'المكتملة' },
  { value: 'cancelled', label: 'الملغاة' },
]

function isUpcoming(booking: BuyerBookingItem, now: number) {
  return booking.status === 'CONFIRMED' && new Date(booking.endTime).getTime() > now
}

export default function BuyerBookingsHub({ userName, bookings }: { userName: string; bookings: BuyerBookingItem[] }) {
  const { locale } = useLanguage()
  const [filter, setFilter] = useState<Filter>('all')
  const [now] = useState(() => Date.now())
  const upcoming = useMemo(
    () => bookings.filter(booking => isUpcoming(booking, now)).sort((a, b) => +new Date(a.startTime) - +new Date(b.startTime)),
    [bookings, now],
  )
  const completed = bookings.filter(booking => booking.status === 'COMPLETED')
  const needsReview = completed.filter(booking => !booking.hasReview).length
  const totalSpend = bookings.filter(booking => booking.status !== 'CANCELLED').reduce((sum, booking) => sum + booking.grandTotal, 0)

  const visible = bookings.filter(booking => {
    if (filter === 'upcoming') return isUpcoming(booking, now)
    if (filter === 'completed') return booking.status === 'COMPLETED'
    if (filter === 'cancelled') return booking.status === 'CANCELLED'
    return true
  })

  return (
    <div className="buyer-hub dashboard-page">
      <header className="buyer-hub-hero animate-in">
        <div className="buyer-hub-hero-copy">
          <p>مساحتك، مرتبة حول يومك</p>
          <h1>مرحبًا {userName.split(' ')[0]}</h1>
          <span>تابع موعدك القادم، تفاصيل الوصول، والخدمات من مكان واحد.</span>
        </div>
        <Link href="/spaces" className="buyer-hub-primary-action">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.4-4.4m2.4-5.1a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" /></svg>
          ابحث عن مساحة
        </Link>
      </header>

      <section className="buyer-metrics motion-list" aria-label="ملخص الحجوزات">
        <Metric label="حجوزات قادمة" value={upcoming.length} hint={upcoming.length ? 'جاهزة في جدولك' : 'لا يوجد موعد قادم'} icon="calendar" />
        <Metric label="تجارب مكتملة" value={completed.length} hint={needsReview ? `${needsReview} بانتظار تقييمك` : 'كل التقييمات مكتملة'} icon="check" accent={needsReview > 0} />
        <Metric label="إجمالي الحجوزات" value={`${formatNumber(Math.round(totalSpend * 100) / 100)} ${locale === 'en' ? 'SAR' : 'ر.س'}`} hint={`${bookings.length} حجوزات حتى الآن`} icon="wallet" />
      </section>

      {upcoming[0] && <NextBooking booking={upcoming[0]} locale={locale} />}

      <section className="buyer-bookings-section">
        <div className="buyer-section-heading">
          <div>
            <p>سجل رحلتك</p>
            <h2>كل الحجوزات</h2>
          </div>
          <div className="buyer-booking-tabs" role="tablist" aria-label="تصفية الحجوزات">
            {FILTERS.map(item => (
              <button key={item.value} type="button" role="tab" aria-selected={filter === item.value} onClick={() => setFilter(item.value)}>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="buyer-empty-state">
            <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="M8 3v3m8-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" /></svg></span>
            <h3>{bookings.length ? 'لا توجد حجوزات في هذا التصنيف' : 'ابدأ بحجز مساحتك الأولى'}</h3>
            <p>{bookings.length ? 'اختر تصنيفًا آخر لعرض حجوزاتك.' : 'اعثر على مساحة مناسبة وتحقق من موعدها قبل الدفع.'}</p>
            {!bookings.length && <Link href="/spaces">تصفح المساحات</Link>}
          </div>
        ) : (
          <div className="buyer-booking-list motion-list">
            {visible.map(booking => <BookingRow key={booking.id} booking={booking} locale={locale} />)}
          </div>
        )}
      </section>
    </div>
  )
}

function Metric({ label, value, hint, icon, accent = false }: { label: string; value: string | number; hint: string; icon: 'calendar' | 'check' | 'wallet'; accent?: boolean }) {
  const paths = {
    calendar: 'M8 3v3m8-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z',
    check: 'm5 12 4 4L19 6',
    wallet: 'M4 7.5h15v11H4zM4 7.5V6a2 2 0 0 1 2-2h10v3.5m0 5h3',
  }
  return <article className={accent ? 'is-accent' : ''}>
    <span className="buyer-metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d={paths[icon]} /></svg></span>
    <div><p>{label}</p><strong>{value}</strong><small>{hint}</small></div>
  </article>
}

function NextBooking({ booking, locale }: { booking: BuyerBookingItem; locale: 'ar' | 'en' }) {
  return <section className="next-booking animate-in">
    <div className="next-booking-media">
      {booking.space.imageUrl ? <img src={booking.space.imageUrl} alt={booking.space.name} /> : <span>إحياء مساحة</span>}
    </div>
    <div className="next-booking-body">
      <p className="next-booking-kicker"><i /> موعدك القادم</p>
      <h2>{booking.space.name}</h2>
      <p>{booking.space.typeName} · {[booking.space.district, booking.space.city].filter(Boolean).join('، ')}</p>
      <div className="next-booking-facts">
        <span><strong>{formatDate(new Date(booking.startTime), locale)}</strong><small>التاريخ</small></span>
        <span><strong className="time-value">{formatTimeRange(new Date(booking.startTime), new Date(booking.endTime))}</strong><small>الوقت</small></span>
      </div>
    </div>
    <Link href={`/buyer/bookings/${booking.id}`} className="next-booking-link">عرض التفاصيل <span>←</span></Link>
  </section>
}

function BookingRow({ booking, locale }: { booking: BuyerBookingItem; locale: 'ar' | 'en' }) {
  const badge = getBookingStatusBadge(booking.status)
  return <article className="buyer-booking-row">
    <div className="buyer-booking-thumb">
      {booking.space.imageUrl ? <img src={booking.space.imageUrl} alt={booking.space.name} /> : <span>م</span>}
    </div>
    <div className="buyer-booking-main">
      <div><h3>{booking.space.name}</h3><Badge variant={badge.variant}>{badge.label}</Badge></div>
      <p>{booking.space.typeName} · {[booking.space.district, booking.space.city].filter(Boolean).join('، ')}</p>
      <span>{formatDate(new Date(booking.startTime), locale)} · <b className="time-value">{formatTimeRange(new Date(booking.startTime), new Date(booking.endTime))}</b></span>
      {booking.sellerNote && <small>ملاحظة صاحب المساحة: {booking.sellerNote}</small>}
    </div>
    <div className="buyer-booking-end">
      <strong>{formatNumber(Math.round(booking.grandTotal * 100) / 100)} {locale === 'en' ? 'SAR' : 'ر.س'}</strong>
      <Link href={`/buyer/bookings/${booking.id}`}>{booking.status === 'COMPLETED' && !booking.hasReview ? 'قيّم تجربتك' : 'عرض التفاصيل'} <span>←</span></Link>
    </div>
  </article>
}
