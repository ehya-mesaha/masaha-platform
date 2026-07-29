'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/components/i18n/LanguageProvider'
import SearchableSelect from '@/components/ui/SearchableSelect'

const DAYS = [
  { value: 0, ar: 'الأحد', en: 'Sun' },
  { value: 1, ar: 'الإثنين', en: 'Mon' },
  { value: 2, ar: 'الثلاثاء', en: 'Tue' },
  { value: 3, ar: 'الأربعاء', en: 'Wed' },
  { value: 4, ar: 'الخميس', en: 'Thu' },
  { value: 5, ar: 'الجمعة', en: 'Fri' },
  { value: 6, ar: 'السبت', en: 'Sat' },
]

function minutes(value: string) {
  const [hours = 0, mins = 0] = value.split(':').map(Number)
  return hours * 60 + mins
}

function countSessions(startDate: string, endDate: string, weekdays: number[]) {
  if (!startDate || !endDate || weekdays.length === 0) return 0
  const start = new Date(`${startDate}T12:00:00`)
  const end = new Date(`${endDate}T12:00:00`)
  if (end < start) return 0

  let count = 0
  const cursor = new Date(start)
  while (cursor <= end) {
    if (weekdays.includes(cursor.getDay())) count += 1
    cursor.setDate(cursor.getDate() + 1)
  }
  return count
}

type SearchOption = { id: string; name: string }

export default function RecurringSearchForm({ types, cities }: { types: SearchOption[]; cities: SearchOption[] }) {
  const router = useRouter()
  const { locale } = useLanguage()
  const isEnglish = locale === 'en'
  const [mode, setMode] = useState<'program' | 'single'>('program')
  const [cityId, setCityId] = useState('')
  const [typeId, setTypeId] = useState('')
  const [capacity, setCapacity] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [weekdays, setWeekdays] = useState<number[]>([])
  const [sessionStart, setSessionStart] = useState('16:00')
  const [sessionEnd, setSessionEnd] = useState('18:00')
  const [error, setError] = useState('')

  const summary = useMemo(() => {
    const sessions = mode === 'single' && startDate ? 1 : countSessions(startDate, endDate, weekdays)
    const durationMinutes = Math.max(0, minutes(sessionEnd) - minutes(sessionStart))
    return {
      sessions,
      durationHours: durationMinutes / 60,
      totalHours: sessions * durationMinutes / 60,
    }
  }, [endDate, mode, sessionEnd, sessionStart, startDate, weekdays])

  function toggleDay(day: number) {
    setError('')
    setWeekdays(current => current.includes(day) ? current.filter(item => item !== day) : [...current, day])
  }

  function reset() {
    setCityId('')
    setTypeId('')
    setCapacity('')
    setStartDate('')
    setEndDate('')
    setWeekdays([])
    setSessionStart('16:00')
    setSessionEnd('18:00')
    setError('')
  }

  function submit() {
    if (!startDate) {
      setError(isEnglish ? 'Choose the booking start date.' : 'اختر تاريخ بداية الحجز.')
      return
    }
    if (mode === 'program' && !endDate) {
      setError(isEnglish ? 'Choose the program end date.' : 'اختر تاريخ نهاية البرنامج.')
      return
    }
    if (mode === 'program' && endDate < startDate) {
      setError(isEnglish ? 'The end date must be after the start date.' : 'يجب أن يكون تاريخ النهاية بعد تاريخ البداية.')
      return
    }
    if (mode === 'program' && weekdays.length === 0) {
      setError(isEnglish ? 'Choose at least one weekday for the program.' : 'اختر يومًا واحدًا على الأقل للبرنامج.')
      return
    }
    if (minutes(sessionEnd) <= minutes(sessionStart)) {
      setError(isEnglish ? 'The end time must be after the start time.' : 'يجب أن يكون وقت النهاية بعد وقت البداية.')
      return
    }

    setError('')
    const query = new URLSearchParams()
    query.set('mode', mode)
    if (mode === 'program') query.set('fullyAvailable', '1')
    const selectedCity = cities.find(option => option.id === cityId)
    if (selectedCity) query.set('city', selectedCity.name)
    if (typeId) query.set('typeId', typeId)
    if (capacity) query.set('capacity', capacity)
    if (startDate) query.set(mode === 'program' ? 'startDate' : 'date', startDate)
    if (endDate && mode === 'program') query.set('endDate', endDate)
    if (weekdays.length && mode === 'program') query.set('weekdays', weekdays.join(','))
    query.set('startTime', sessionStart)
    query.set('endTime', sessionEnd)
    router.push(`/spaces?${query.toString()}`)
  }

  const dateFormatter = new Intl.DateTimeFormat(isEnglish ? 'en-US' : 'ar-SA-u-nu-latn', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="home-search-card relative isolate mt-9 max-w-5xl rounded-2xl border border-white/35 bg-white text-[#1B1B1B] shadow-[0_28px_70px_-32px_rgba(0,0,0,.85)]">
      <div className="flex rounded-t-2xl border-b border-[#D8D1C7] bg-[#FAF8F3] p-1.5">
        <button
          type="button"
          onClick={() => {
            setMode('program')
            setError('')
          }}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-extrabold transition ${mode === 'program' ? 'bg-[#0E3B34] text-white shadow-sm' : 'text-[#5F6A61] hover:bg-white'}`}
        >
          {isEnglish ? 'Recurring program' : 'برنامج متكرر'}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('single')
            setError('')
          }}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-extrabold transition ${mode === 'single' ? 'bg-[#0E3B34] text-white shadow-sm' : 'text-[#5F6A61] hover:bg-white'}`}
        >
          {isEnglish ? 'One-time booking' : 'حجز مرة واحدة'}
        </button>
      </div>

      <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-3">
        <Field label={isEnglish ? 'City' : 'المدينة'}>
          <SearchableSelect
            value={cityId}
            onChange={setCityId}
            options={cities}
            placeholder={isEnglish ? 'Choose a city' : 'اختر المدينة'}
            searchPlaceholder={isEnglish ? 'Search cities...' : 'ابحث عن مدينة...'}
            emptyText={isEnglish ? 'No matching city' : 'لا توجد مدينة مطابقة'}
            allLabel={isEnglish ? 'All cities' : 'جميع المدن'}
            buttonClassName="program-field"
            ariaLabel={isEnglish ? 'City' : 'المدينة'}
          />
        </Field>
        <Field label={isEnglish ? 'Space type' : 'نوع المساحة'}>
          <SearchableSelect
            value={typeId}
            onChange={setTypeId}
            options={types}
            placeholder={isEnglish ? 'Choose a space type' : 'اختر نوع المساحة'}
            searchPlaceholder={isEnglish ? 'Search space types...' : 'ابحث عن نوع المساحة...'}
            emptyText={isEnglish ? 'No matching space type' : 'لا يوجد نوع مساحة مطابق'}
            allLabel={isEnglish ? 'All space types' : 'جميع أنواع المساحات'}
            buttonClassName="program-field"
            ariaLabel={isEnglish ? 'Space type' : 'نوع المساحة'}
          />
        </Field>
        <Field label={isEnglish ? 'Number of people' : 'عدد الأشخاص'}>
          <input value={capacity} onChange={event => setCapacity(event.target.value)} type="number" inputMode="numeric" min="1" placeholder="20" className="program-field" dir="ltr" />
        </Field>
        <Field label={isEnglish ? (mode === 'program' ? 'Start date' : 'Booking date') : (mode === 'program' ? 'تاريخ البداية' : 'تاريخ الحجز')}>
          <input value={startDate} onChange={event => { setStartDate(event.target.value); setError('') }} type="date" className="program-field" dir="ltr" />
        </Field>
        {mode === 'program' && (
          <Field label={isEnglish ? 'End date' : 'تاريخ النهاية'}>
            <input value={endDate} min={startDate || undefined} onChange={event => { setEndDate(event.target.value); setError('') }} type="date" className="program-field" dir="ltr" />
          </Field>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Field label={isEnglish ? 'From' : 'من'}>
            <input value={sessionStart} onChange={event => { setSessionStart(event.target.value); setError('') }} type="time" className="program-field" dir="ltr" />
          </Field>
          <Field label={isEnglish ? 'To' : 'إلى'}>
            <input value={sessionEnd} onChange={event => { setSessionEnd(event.target.value); setError('') }} type="time" className="program-field" dir="ltr" />
          </Field>
        </div>
      </div>

      {mode === 'program' && (
        <div className="border-t border-[#EEE8DC] px-4 py-4 sm:px-5">
          <p className="mb-3 text-xs font-extrabold text-[#4D5A51]">{isEnglish ? 'Required weekdays' : 'الأيام المطلوبة'}</p>
          <div className="flex flex-wrap gap-2">
            {DAYS.map(day => (
              <button
                type="button"
                key={day.value}
                onClick={() => toggleDay(day.value)}
                className={`rounded-full border px-3.5 py-2 text-xs font-bold transition ${weekdays.includes(day.value) ? 'border-[#0E3B34] bg-[#0E3B34] text-white' : 'border-[#D8D1C7] bg-white text-[#556159] hover:border-[#B99A63]'}`}
              >
                {isEnglish ? day.en : day.ar}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div role="alert" aria-live="polite" className="mx-4 mb-4 rounded-xl border border-[#D69A8F] bg-[#FFF3F0] px-4 py-3 text-sm font-bold text-[#9C3F32] sm:mx-5">
          {error}
        </div>
      )}

      <div className="grid gap-4 rounded-b-2xl border-t border-[#D8D1C7] bg-[#F5F1E8] p-4 sm:p-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#566259]">
            <strong className="text-[#0E3B34]">{isEnglish ? 'Program summary' : 'ملخص البرنامج'}</strong>
            <span>{summary.durationHours.toLocaleString('en-US')} {isEnglish ? 'hours per session' : 'ساعة لكل جلسة'}</span>
            <span>{summary.sessions.toLocaleString('en-US')} {isEnglish ? 'sessions' : 'جلسة'}</span>
            <span>{isEnglish ? 'Total' : 'الإجمالي'}: {summary.totalHours.toLocaleString('en-US')} {isEnglish ? 'hours' : 'ساعة'}</span>
          </div>
          {startDate && (mode === 'single' || endDate) && (
            <p className="mt-1 text-[11px] text-[#7A837C]">
              {dateFormatter.format(new Date(`${startDate}T12:00:00`))}
              {mode === 'program' && endDate ? ` - ${dateFormatter.format(new Date(`${endDate}T12:00:00`))}` : ''}
            </p>
          )}
          <button type="button" onClick={reset} className="mt-2 text-[11px] font-bold text-[#9A7424] underline underline-offset-4">
            {isEnglish ? 'Reset' : 'إعادة تعيين'}
          </button>
        </div>
        <button type="button" onClick={submit} className="btn-primary min-h-12 rounded-xl px-7 py-3 text-sm font-extrabold">
          {mode === 'program'
            ? (isEnglish ? 'Show spaces available for the program' : 'عرض المساحات المتاحة للبرنامج')
            : (isEnglish ? 'Show available spaces' : 'عرض المساحات المتاحة')}
        </button>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-extrabold text-[#5A655D]">{label}</span>
      {children}
    </label>
  )
}
