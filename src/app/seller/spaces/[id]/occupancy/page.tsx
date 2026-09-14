'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { formatDate, formatTimeRange } from '@/lib/format'
import { DAY_NAMES } from '@/components/spaces/create/types'
import { datesInRange, riyadhNoon, riyadhToday, shiftDate } from '@/lib/schedule'

type Unit = { id: string; label: string }
type Occupancy = {
  id: string
  title: string
  startTime: string
  endTime: string
  status: 'PLANNED' | 'CONFIRMED'
  seriesId: string | null
  unit: Unit | null
}

/** One card in the list: either a single date, or a whole repeating programme. */
type Group = {
  key: string
  seriesId: string | null
  title: string
  status: Occupancy['status']
  unitLabel: string
  occurrences: Occupancy[]
}

export default function PrivateOccupancyPage() {
  const { id } = useParams<{ id: string }>()
  const [items, setItems] = useState<Occupancy[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    title: '',
    unitId: '',
    status: 'CONFIRMED' as Occupancy['status'],
    startDate: riyadhToday(),
    endDate: riyadhToday(),
    startTime: '08:00',
    endTime: '12:00',
    weekdays: [] as number[],
  })

  const repeats = form.endDate > form.startDate
  const dates = useMemo(
    () => (repeats ? datesInRange(form.startDate, form.endDate, form.weekdays) : form.startDate ? [form.startDate] : []),
    [repeats, form.startDate, form.endDate, form.weekdays],
  )
  const timesValid = Boolean(form.startTime && form.endTime && form.startTime < form.endTime)

  useEffect(() => {
    fetch(`/api/spaces/${id}/occupancies`)
      .then(response => response.json())
      .then(data => {
        setItems(data.occupancies || [])
        setUnits(data.units || [])
      })
      .catch(() => {})
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

  /** Jump the end date forward — the shortcut for "this runs for a term". */
  function extendTo(months: number) {
    setForm(current => ({
      ...current,
      endDate: shiftDate(current.startDate || riyadhToday(), { months }),
      // A multi-month block that repeats every single day is almost never what is meant,
      // so seed the working week the first time the range is stretched.
      weekdays: current.weekdays.length ? current.weekdays : [0, 1, 2, 3, 4],
    }))
    setMessage(null)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)

    if (!timesValid) return setMessage({ tone: 'error', text: 'وقت النهاية يجب أن يكون بعد وقت البداية.' })
    if (dates.length === 0) {
      return setMessage({
        tone: 'error',
        text: repeats ? 'لا توجد أيام مطابقة داخل هذه الفترة. اختر أيام أسبوع أخرى.' : 'حدد تاريخ الإشغال.',
      })
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/spaces/${id}/occupancies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          unitId: form.unitId,
          status: form.status,
          startDate: form.startDate,
          endDate: form.endDate,
          weekdays: form.weekdays,
          startTime: form.startTime,
          endTime: form.endTime,
        }),
      })
      const data = await response.json()
      if (!response.ok) return setMessage({ tone: 'error', text: data.error || 'تعذر الحفظ' })

      const created: Occupancy[] = data.occupancies || []
      setItems(current => [...current, ...created].sort((a, b) => a.startTime.localeCompare(b.startTime)))
      setForm(current => ({ ...current, title: '' }))
      setMessage({
        tone: 'success',
        text: created.length > 1
          ? `تم حجز ${created.length} موعدًا للإشغال الخاص.`
          : 'تم حفظ الإشغال الخاص.',
      })
    } catch {
      setMessage({ tone: 'error', text: 'تعذر الاتصال بالخادم.' })
    } finally {
      setSaving(false)
    }
  }

  async function removeGroup(group: Group) {
    const isSeries = Boolean(group.seriesId)
    const confirmText = isSeries
      ? `سيتم حذف كل مواعيد «${group.title}» (${group.occurrences.length} موعدًا). هل تريد المتابعة؟`
      : 'هل تريد حذف هذا الإشغال الخاص؟'
    if (!confirm(confirmText)) return

    const response = await fetch(`/api/spaces/${id}/occupancies`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isSeries ? { seriesId: group.seriesId } : { occupancyId: group.occurrences[0].id }),
    })
    if (!response.ok) return setMessage({ tone: 'error', text: 'تعذر الحذف.' })
    const removedIds = new Set(group.occurrences.map(item => item.id))
    setItems(current => current.filter(item => !removedIds.has(item.id)))
  }

  async function removeOne(occupancy: Occupancy) {
    const response = await fetch(`/api/spaces/${id}/occupancies`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ occupancyId: occupancy.id }),
    })
    if (response.ok) setItems(current => current.filter(item => item.id !== occupancy.id))
  }

  const groups = useMemo<Group[]>(() => {
    const byKey = new Map<string, Group>()
    for (const item of items) {
      const key = item.seriesId || item.id
      const existing = byKey.get(key)
      if (existing) existing.occurrences.push(item)
      else byKey.set(key, {
        key,
        seriesId: item.seriesId,
        title: item.title,
        status: item.status,
        unitLabel: item.unit?.label || 'جميع الوحدات',
        occurrences: [item],
      })
    }
    return [...byKey.values()].sort((a, b) =>
      a.occurrences[0].startTime.localeCompare(b.occurrences[0].startTime))
  }, [items])

  return (
    <div className="dashboard-page">
      <Link href="/seller/spaces" className="text-sm font-bold text-[#5F6764] hover:text-[#0E3B34]">← مساحاتي</Link>

      <div className="page-hero mb-6 mt-5 p-6 sm:p-7">
        <p className="text-xs font-bold text-[#B99A63]">جدولة المدرسة</p>
        <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">إشغال خاص</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-white/65">
          احجز فترات للاستخدام الداخلي دون تعديل جدول التوفر الأسبوعي — ليوم واحد أو لبرنامج يتكرر أسابيع وشهورًا.
          لن تظهر هذه الفترات لطالبي المساحات، وهي مجانية لك.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
        <form onSubmit={submit} className="rounded-2xl border border-[#D8D1C7] bg-white p-5 sm:p-6">
          <h2 className="text-base font-extrabold text-[#0E3B34]">إضافة إشغال</h2>
          <p className="mt-1 text-xs leading-6 text-[#5F6764]">
            اختر تاريخ البداية والنهاية. إن كانت النهاية بعد البداية، حدّد أيام الأسبوع التي يتكرر فيها الإشغال.
          </p>

          <div className="mt-5 space-y-4">
            <Field label="عنوان الإشغال">
              <input
                name="title"
                required
                value={form.title}
                onChange={event => set('title', event.target.value)}
                placeholder="مثال: حصص التقوية · حفل تخرج"
                className="field"
              />
            </Field>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="الوحدة">
                <select value={form.unitId} onChange={event => set('unitId', event.target.value)} className="field bg-white">
                  <option value="">جميع الوحدات</option>
                  {units.map(unit => <option key={unit.id} value={unit.id}>{unit.label}</option>)}
                </select>
              </Field>
              <Field label="الحالة">
                <select
                  value={form.status}
                  onChange={event => set('status', event.target.value as Occupancy['status'])}
                  className="field bg-white"
                >
                  <option value="CONFIRMED">مؤكد</option>
                  <option value="PLANNED">مخطط</option>
                </select>
              </Field>
            </div>

            <fieldset className="rounded-2xl border border-[#E8E1D3] bg-[#FBFAF6] p-4">
              <legend className="px-2 text-xs font-extrabold text-[#0E3B34]">الفترة</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="من تاريخ">
                  <input
                    type="date"
                    required
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
                    className="field"
                  />
                </Field>
                <Field label="إلى تاريخ">
                  <input
                    type="date"
                    required
                    dir="ltr"
                    min={form.startDate}
                    value={form.endDate}
                    onChange={event => set('endDate', event.target.value)}
                    className="field"
                  />
                </Field>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-[#5F6764]">مدة سريعة:</span>
                {[
                  { label: 'يوم واحد', months: 0 },
                  { label: 'شهر', months: 1 },
                  { label: '3 أشهر', months: 3 },
                  { label: '6 أشهر', months: 6 },
                ].map(option => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => (option.months === 0
                      ? set('endDate', form.startDate)
                      : extendTo(option.months))}
                    className="rounded-full border border-[#D8D1C7] bg-white px-3 py-1.5 text-[11px] font-bold text-[#0E3B34] transition-colors hover:border-[#0E3B34] hover:bg-[#F5F1E8]"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            {repeats && (
              <fieldset className="rounded-2xl border border-[#E8E1D3] bg-[#FBFAF6] p-4">
                <legend className="px-2 text-xs font-extrabold text-[#0E3B34]">أيام التكرار</legend>
                <p className="mb-3 text-[11px] leading-5 text-[#5F6764]">
                  اختر الأيام داخل هذه الفترة. بدون اختيار، يتكرر الإشغال كل يوم.
                </p>
                <div className="flex flex-wrap gap-2">
                  {DAY_NAMES.map((name, day) => {
                    const active = form.weekdays.includes(day)
                    return (
                      <button
                        key={day}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleWeekday(day)}
                        className={`rounded-full border px-3.5 py-2 text-xs font-bold transition-colors ${
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
              <Field label="من الساعة">
                <input type="time" required dir="ltr" value={form.startTime} onChange={event => set('startTime', event.target.value)} className="field" />
              </Field>
              <Field label="إلى الساعة">
                <input type="time" required dir="ltr" value={form.endTime} onChange={event => set('endTime', event.target.value)} className="field" />
              </Field>
            </div>

            {/* What is actually about to be booked, before it is booked. */}
            <div className="rounded-2xl border border-[#0E3B34]/15 bg-[#F4F8F6] px-4 py-3">
              {dates.length > 0 && timesValid ? (
                <>
                  <p className="text-sm font-bold text-[#0E3B34]">
                    {dates.length === 1
                      ? `موعد واحد · ${formatDate(riyadhNoon(dates[0]))}`
                      : `${dates.length} موعدًا · من ${formatDate(riyadhNoon(dates[0]))} إلى ${formatDate(riyadhNoon(dates[dates.length - 1]))}`}
                  </p>
                  <p className="mt-1 text-xs text-[#5F6764]">
                    يوميًا <span className="time-value" dir="ltr">{form.startTime} – {form.endTime}</span>
                    {form.unitId ? ` · ${units.find(unit => unit.id === form.unitId)?.label}` : ' · جميع الوحدات'}
                  </p>
                </>
              ) : (
                <p className="text-xs font-bold text-[#8A6A1E]">أكمل الفترة والأوقات لعرض المواعيد التي ستُحجز.</p>
              )}
            </div>
          </div>

          {message && (
            <p className={`mt-4 rounded-xl px-4 py-3 text-sm font-bold ${
              message.tone === 'success' ? 'bg-[#F0F6F2] text-[#0E3B34]' : 'bg-red-50 text-red-700'
            }`}>
              {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={saving || dates.length === 0 || !timesValid}
            className="btn-primary mt-5 w-full rounded-xl py-3 text-sm font-bold disabled:opacity-60"
          >
            {saving ? 'جاري الحفظ...' : dates.length > 1 ? `حفظ ${dates.length} موعدًا` : 'حفظ الإشغال الخاص'}
          </button>
        </form>

        <section className="rounded-2xl border border-[#D8D1C7] bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-extrabold text-[#0E3B34]">الإشغالات الخاصة القادمة</h2>
            <span className="rounded-full bg-[#F5F1E8] px-3 py-1 text-[10px] font-bold text-[#5F6764]">
              {items.length} موعدًا
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {groups.map(group => {
              const first = group.occurrences[0]
              const last = group.occurrences[group.occurrences.length - 1]
              const isSeries = group.occurrences.length > 1
              const isOpen = expanded === group.key
              return (
                <article key={group.key} className="rounded-2xl border border-[#D8D1C7] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="text-[#1B1B1B]">{group.title}</strong>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          group.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {group.status === 'CONFIRMED' ? 'مؤكد' : 'مخطط'}
                        </span>
                        {isSeries && (
                          <span className="rounded-full bg-[#0E3B34]/10 px-2.5 py-1 text-[10px] font-bold text-[#0E3B34]">
                            متكرر · {group.occurrences.length} موعدًا
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-xs text-[#5F6764]">
                        {isSeries
                          ? `${formatDate(first.startTime)} — ${formatDate(last.startTime)}`
                          : formatDate(first.startTime)}
                        {' · '}
                        <span className="time-value">{formatTimeRange(first.startTime, first.endTime)}</span>
                      </p>
                      <p className="mt-1 text-xs text-[#5F6764]">{group.unitLabel}</p>

                      {isSeries && (
                        <button
                          type="button"
                          onClick={() => setExpanded(isOpen ? null : group.key)}
                          className="mt-2 text-xs font-bold text-[#0E3B34] hover:underline"
                        >
                          {isOpen ? 'إخفاء المواعيد' : 'عرض كل المواعيد'}
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => removeGroup(group)}
                      className="flex-none text-xs font-bold text-red-600 hover:underline"
                    >
                      {isSeries ? 'حذف الكل' : 'حذف'}
                    </button>
                  </div>

                  {isSeries && isOpen && (
                    <ul className="mt-4 space-y-1.5 border-t border-[#EEE8DC] pt-3">
                      {group.occurrences.map(occurrence => (
                        <li key={occurrence.id} className="flex items-center justify-between gap-3 text-xs text-[#5F6764]">
                          <span>
                            {formatDate(occurrence.startTime)} · <span className="time-value">{formatTimeRange(occurrence.startTime, occurrence.endTime)}</span>
                          </span>
                          <button onClick={() => removeOne(occurrence)} className="font-bold text-red-600 hover:underline">
                            حذف هذا اليوم
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              )
            })}

            {groups.length === 0 && (
              <p className="rounded-xl bg-[#F5F1E8] p-6 text-center text-sm text-[#5F6764]">لا توجد إشغالات خاصة قادمة.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-[#59655D]">{label}</span>
      {children}
    </label>
  )
}
