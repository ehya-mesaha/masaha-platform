'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { formatDate, formatTimeRange } from '@/lib/format'

type Unit = { id: string; label: string }
type Occupancy = {
  id: string
  title: string
  startTime: string
  endTime: string
  status: 'PLANNED' | 'CONFIRMED'
  unit: Unit | null
}

export default function PrivateOccupancyPage() {
  const { id } = useParams<{ id: string }>()
  const [items, setItems] = useState<Occupancy[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch(`/api/spaces/${id}/occupancies`).then(response => response.json()).then(data => {
      setItems(data.occupancies || [])
      setUnits(data.units || [])
    })
  }, [id])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    const form = new FormData(event.currentTarget)
    const response = await fetch(`/api/spaces/${id}/occupancies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    })
    const data = await response.json()
    if (!response.ok) return setMessage(data.error || 'تعذر الحفظ')
    setItems(current => [...current, data.occupancy].sort((a, b) => a.startTime.localeCompare(b.startTime)))
    event.currentTarget.reset()
    setMessage('تم حفظ الإشغال الخاص')
  }

  async function remove(occupancyId: string) {
    if (!confirm('هل تريد حذف هذا الإشغال الخاص؟')) return
    const response = await fetch(`/api/spaces/${id}/occupancies`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ occupancyId }),
    })
    if (response.ok) setItems(current => current.filter(item => item.id !== occupancyId))
  }

  return (
    <div className="dashboard-page">
      <Link href="/seller/spaces" className="text-sm font-bold text-[#6B7566] hover:text-[#1B3A2D]">← مساحاتي</Link>
      <div className="page-hero mb-6 mt-5 p-7">
        <p className="text-xs font-bold text-[#C49A3C]">جدولة المدرسة</p>
        <h1 className="mt-2 text-3xl font-extrabold text-white">إشغال خاص للمدرسة</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-white/65">احجز فترات للاستخدام الداخلي دون تعديل جدول التوفر الأسبوعي. لن تكون متاحة لطالبي المساحات وستكون مجانية للمدرسة.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[.85fr_1.15fr]">
        <form onSubmit={submit} className="rounded-2xl border border-[#E1D9CA] bg-white p-5">
          <h2 className="font-extrabold text-[#1B3A2D]">إضافة إشغال</h2>
          <div className="mt-5 space-y-4">
            <Field label="العنوان"><input name="title" required placeholder="مثال: حفل تخرج" className="field" /></Field>
            <Field label="الوحدة">
              <select name="unitId" className="field bg-white">
                <option value="">جميع الوحدات</option>
                {units.map(unit => <option key={unit.id} value={unit.id}>{unit.label}</option>)}
              </select>
            </Field>
            <Field label="التاريخ"><input type="date" name="date" required className="field" dir="ltr" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="من"><input type="time" name="startTime" required className="field" dir="ltr" /></Field>
              <Field label="إلى"><input type="time" name="endTime" required className="field" dir="ltr" /></Field>
            </div>
            <Field label="الحالة">
              <select name="status" className="field bg-white"><option value="CONFIRMED">مؤكد</option><option value="PLANNED">مخطط</option></select>
            </Field>
          </div>
          {message && <p className="mt-4 rounded-xl bg-[#F7F3EB] px-4 py-3 text-sm text-[#1B3A2D]">{message}</p>}
          <button className="btn-primary mt-5 w-full rounded-xl py-3 text-sm font-bold">حفظ الإشغال الخاص</button>
        </form>

        <section className="rounded-2xl border border-[#E1D9CA] bg-white p-5">
          <h2 className="font-extrabold text-[#1B3A2D]">الإشغالات الخاصة القادمة</h2>
          <div className="mt-5 space-y-3">
            {items.map(item => (
              <article key={item.id} className="flex items-start justify-between gap-4 rounded-2xl border border-[#E8E1D3] p-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <strong className="text-[#14201A]">{item.title}</strong>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${item.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{item.status === 'CONFIRMED' ? 'مؤكد' : 'مخطط'}</span>
                  </div>
                  <p className="mt-2 text-xs text-[#6B7566]">{formatDate(item.startTime)} · <span className="time-value">{formatTimeRange(item.startTime, item.endTime)}</span></p>
                  <p className="mt-1 text-xs text-[#6B7566]">{item.unit?.label || 'جميع الوحدات'}</p>
                </div>
                <button onClick={() => remove(item.id)} className="text-xs font-bold text-red-600">حذف</button>
              </article>
            ))}
            {items.length === 0 && <p className="rounded-xl bg-[#F7F3EB] p-6 text-center text-sm text-[#6B7566]">لا توجد إشغالات خاصة قادمة.</p>}
          </div>
        </section>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-bold text-[#59655D]">{label}</span>{children}</label>
}
