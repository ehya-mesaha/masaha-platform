'use client'

import { use, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { formatDate, formatTimeRange } from '@/lib/format'
import { DAY_NAMES } from '@/components/spaces/create/types'
import { datesInRange, riyadhNoon, riyadhToday, shiftDate } from '@/lib/schedule'

type Unit = { id: string; label: string }
type Closure = {
  id: string
  title: string
  startTime: string
  endTime: string
  seriesId: string | null
  unit: Unit | null
}

export default function ClosuresPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [items, setItems] = useState<Closure[]>([])
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: 'صيانة أو عدم توفر',
    startDate: riyadhToday(),
    endDate: riyadhToday(),
    startTime: '08:00',
    endTime: '22:00',
    weekdays: [] as number[],
  })

  const repeats = form.endDate > form.startDate
  const dates = useMemo(
    () => (repeats ? datesInRange(form.startDate, form.endDate, form.weekdays) : form.startDate ? [form.startDate] : []),
    [repeats, form.startDate, form.endDate, form.weekdays],
  )
  const timesValid = Boolean(form.startTime && form.endTime && form.startTime < form.endTime)

  async function load() {
    const response = await fetch(`/api/spaces/${id}/closures`)
    if (response.ok) setItems(await response.json())
  }

  useEffect(() => {
    let cancelled = false
    fetch(`/api/spaces/${id}/closures`)
      .then(response => (response.ok ? response.json() : []))
      .then(rows => { if (!cancelled) setItems(rows) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [id])

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm(current => ({ ...current, [key]: value }))
    setMessage(null)
  }

  function toggleWeekday(day: number) {
    set('weekdays', form.weekdays.includes(day)
      ? form.weekdays.filter(value => value !== day)
      : [...form.weekdays, day].sort())
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setMessage(null)
    if (!timesValid) return setMessage({ tone: 'error', text: 'وقت النهاية يجب أن يكون بعد وقت البداية.' })
    if (dates.length === 0) return setMessage({ tone: 'error', text: 'لا توجد أيام مطابقة داخل هذه الفترة.' })

    setSaving(true)
    try {
      const response = await fetch(`/api/spaces/${id}/closures`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          startDate: form.startDate,
          endDate: form.endDate,
          weekdays: form.weekdays,
          startTime: form.startTime,
          endTime: form.endTime,
        }),
      })
      const data = await response.json()
      if (!response.ok) return setMessage({ tone: 'error', text: data.error || 'تعذر الحفظ' })
      setMessage({
        tone: 'success',
        text: (data.created || 1) > 1 ? `تم تسجيل ${data.created} فترة إغلاق.` : 'تم تسجيل الإغلاق المؤقت.',
      })
      void load()
    } catch {
      setMessage({ tone: 'error', text: 'تعذر الاتصال بالخادم.' })
    } finally {
      setSaving(false)
    }
  }

  async function remove(closure: Closure, wholeSeries: boolean) {
    const query = wholeSeries && closure.seriesId
      ? `seriesId=${encodeURIComponent(closure.seriesId)}`
      : `closureId=${closure.id}`
    await fetch(`/api/spaces/${id}/closures?${query}`, { method: 'DELETE' })
    void load()
  }

  const groups = useMemo(() => {
    const byKey = new Map<string, Closure[]>()
    for (const item of items) {
      const key = item.seriesId || item.id
      byKey.set(key, [...(byKey.get(key) || []), item])
    }
    return [...byKey.entries()].map(([key, occurrences]) => ({ key, occurrences }))
  }, [items])

  return (
    <div className="dashboard-page">
      <Link href="/seller/spaces" className="mb-4 inline-flex text-sm font-bold text-[#0E3B34]">العودة إلى مساحاتي</Link>

      <header className="page-hero mb-6 p-6">
        <p className="mb-2 text-xs font-bold text-[#B99A63]">التحكم بالتوفر</p>
        <h1 className="text-2xl font-extrabold text-white">إغلاق مؤقت</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-white/65">
          استخدمه للصيانة أو الحالات الطارئة — ليوم واحد أو لفترة ممتدة تتكرر في أيام محددة.
          تُستبعد الفترة فورًا من نتائج التوفر.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
        <form onSubmit={submit} className="premium-card p-6">
          <h2 className="mb-4 font-extrabold text-[#1B1B1B]">إضافة فترة إغلاق</h2>

          <label className="mb-4 block text-sm font-bold">
            السبب
            <input
              required
              value={form.title}
              onChange={event => set('title', event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#D8D1C7] px-4 py-3 font-normal"
            />
          </label>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <label className="text-sm font-bold">
              من تاريخ
              <input
                required
                type="date"
                dir="ltr"
                value={form.startDate}
                onChange={event => {
                  const startDate = event.target.value
                  setForm(current => ({
                    ...current,
                    startDate,
                    endDate: current.endDate < startDate ? startDate : current.endDate,
                  }))
                  setMessage(null)
                }}
                className="mt-1.5 w-full rounded-xl border border-[#D8D1C7] px-3 py-3 font-normal"
              />
            </label>
            <label className="text-sm font-bold">
              إلى تاريخ
              <input
                required
                type="date"
                dir="ltr"
                min={form.startDate}
                value={form.endDate}
                onChange={event => set('endDate', event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#D8D1C7] px-3 py-3 font-normal"
              />
            </label>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-[#5F6764]">مدة سريعة:</span>
            {[
              { label: 'يوم', days: 0 },
              { label: 'أسبوع', days: 6 },
              { label: 'أسبوعان', days: 13 },
              { label: 'شهر', days: 29 },
            ].map(option => (
              <button
                key={option.label}
                type="button"
                onClick={() => set('endDate', shiftDate(form.startDate || riyadhToday(), { days: option.days }))}
                className="rounded-full border border-[#D8D1C7] bg-white px-3 py-1.5 text-[11px] font-bold text-[#0E3B34] transition-colors hover:border-[#0E3B34] hover:bg-[#F5F1E8]"
              >
                {option.label}
              </button>
            ))}
          </div>

          {repeats && (
            <fieldset className="mb-4 rounded-2xl border border-[#E8E1D3] bg-[#FBFAF6] p-4">
              <legend className="px-2 text-xs font-extrabold text-[#0E3B34]">أيام التكرار</legend>
              <p className="mb-3 text-[11px] leading-5 text-[#5F6764]">بدون اختيار، يسري الإغلاق كل يوم في الفترة.</p>
              <div className="flex flex-wrap gap-2">
                {DAY_NAMES.map((name, day) => {
                  const active = form.weekdays.includes(day)
                  return (
                    <button
                      key={day}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleWeekday(day)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                        active
                          ? 'border-[#0E3B34] bg-[#0E3B34] text-white'
                          : 'border-[#D8D1C7] bg-white text-[#3F4B47] hover:border-[#0E3B34]'
                      }`}
                    >
                      {name}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          )}

          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm font-bold">
              من الساعة
              <input required type="time" dir="ltr" value={form.startTime} onChange={event => set('startTime', event.target.value)} className="mt-1.5 w-full rounded-xl border border-[#D8D1C7] px-3 py-3 font-normal" />
            </label>
            <label className="text-sm font-bold">
              إلى الساعة
              <input required type="time" dir="ltr" value={form.endTime} onChange={event => set('endTime', event.target.value)} className="mt-1.5 w-full rounded-xl border border-[#D8D1C7] px-3 py-3 font-normal" />
            </label>
          </div>

          <p className="mt-4 rounded-xl border border-[#0E3B34]/15 bg-[#F4F8F6] px-4 py-3 text-xs font-bold text-[#0E3B34]">
            {dates.length > 0 && timesValid
              ? dates.length === 1
                ? `فترة واحدة · ${formatDate(riyadhNoon(dates[0]))}`
                : `${dates.length} فترة · من ${formatDate(riyadhNoon(dates[0]))} إلى ${formatDate(riyadhNoon(dates[dates.length - 1]))}`
              : 'أكمل الفترة والأوقات لعرض ما سيُغلق.'}
          </p>

          {message && (
            <p className={`mt-4 text-sm font-bold ${message.tone === 'success' ? 'text-[#0E3B34]' : 'text-red-700'}`}>
              {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={saving || dates.length === 0 || !timesValid}
            className="mt-5 w-full rounded-xl bg-[#0E3B34] px-4 py-3 font-bold text-white disabled:opacity-60"
          >
            {saving ? 'جاري الحفظ...' : dates.length > 1 ? `حفظ ${dates.length} فترة` : 'حفظ الإغلاق'}
          </button>
        </form>

        <section className="premium-card p-6">
          <h2 className="mb-4 font-extrabold text-[#1B1B1B]">الإغلاقات النشطة</h2>
          {groups.length === 0 ? (
            <p className="rounded-xl bg-[#F5F1E8] p-6 text-center text-sm text-[#5F6764]">لا توجد إغلاقات مؤقتة.</p>
          ) : (
            <div className="space-y-3">
              {groups.map(({ key, occurrences }) => {
                const first = occurrences[0]
                const last = occurrences[occurrences.length - 1]
                const isSeries = occurrences.length > 1
                return (
                  <article key={key} className="flex items-start justify-between gap-4 rounded-xl border border-[#D8D1C7] p-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-[#1B1B1B]">{first.title}</p>
                        {isSeries && (
                          <span className="rounded-full bg-[#0E3B34]/10 px-2.5 py-1 text-[10px] font-bold text-[#0E3B34]">
                            متكرر · {occurrences.length} فترة
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-[#5F6764]">
                        {isSeries ? `${formatDate(first.startTime)} — ${formatDate(last.startTime)}` : formatDate(first.startTime)}
                        {' · '}
                        <span className="time-value">{formatTimeRange(first.startTime, first.endTime)}</span>
                        {first.unit ? ` · ${first.unit.label}` : ' · جميع الوحدات'}
                      </p>
                    </div>
                    <button onClick={() => remove(first, isSeries)} className="flex-none text-xs font-bold text-red-700 hover:underline">
                      {isSeries ? 'إلغاء الكل' : 'إلغاء'}
                    </button>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
