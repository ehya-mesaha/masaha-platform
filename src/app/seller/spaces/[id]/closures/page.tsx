'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDate, formatTimeRange } from '@/lib/format'

type Closure = { id: string; title: string; startTime: string; endTime: string; unit: { label: string } | null }

export default function ClosuresPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [items, setItems] = useState<Closure[]>([])
  const [form, setForm] = useState({ title: 'صيانة أو عدم توفر', date: '', start: '08:00', end: '22:00' })
  const [message, setMessage] = useState('')
  async function load() { const response = await fetch(`/api/spaces/${id}/closures`); if (response.ok) setItems(await response.json()) }
  useEffect(() => {
    let cancelled = false
    fetch(`/api/spaces/${id}/closures`)
      .then((response) => response.ok ? response.json() : [])
      .then((rows) => { if (!cancelled) setItems(rows) })
    return () => { cancelled = true }
  }, [id])

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setMessage('')
    const response = await fetch(`/api/spaces/${id}/closures`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: form.title, startTime: `${form.date}T${form.start}:00+03:00`, endTime: `${form.date}T${form.end}:00+03:00` }),
    })
    const data = await response.json()
    setMessage(response.ok ? 'تم تسجيل الإغلاق المؤقت.' : data.error)
    if (response.ok) void load()
  }
  async function remove(closureId: string) { await fetch(`/api/spaces/${id}/closures?closureId=${closureId}`, { method: 'DELETE' }); void load() }

  return <div className="dashboard-page">
    <Link href="/seller/spaces" className="mb-4 inline-flex text-sm font-bold text-[#1B3A2D]">العودة إلى مساحاتي</Link>
    <header className="page-hero mb-6 p-6"><p className="mb-2 text-xs font-bold text-[#D8B455]">التحكم بالتوفر</p><h1 className="text-2xl font-extrabold text-white">إغلاق مؤقت</h1><p className="mt-2 text-sm text-white/65">استخدمه للصيانة أو الحالات الطارئة؛ تُستبعد الفترة فورًا من نتائج التوفر.</p></header>
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <form onSubmit={submit} className="premium-card p-6">
        <h2 className="mb-4 font-extrabold text-[#14201A]">إضافة فترة إغلاق</h2>
        <label className="mb-4 block text-sm font-bold">السبب<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#DDD6C8] px-4 py-3 font-normal" /></label>
        <label className="mb-4 block text-sm font-bold">التاريخ<input required type="date" dir="ltr" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#DDD6C8] px-4 py-3 font-normal" /></label>
        <div className="grid grid-cols-2 gap-3">{(['start', 'end'] as const).map((key) => <label key={key} className="text-sm font-bold">{key === 'start' ? 'من' : 'إلى'}<input required type="time" dir="ltr" value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#DDD6C8] px-3 py-3 font-normal" /></label>)}</div>
        {message && <p className="mt-4 text-sm font-bold text-[#1B3A2D]">{message}</p>}
        <button className="mt-5 w-full rounded-xl bg-[#1B3A2D] px-4 py-3 font-bold text-white">حفظ الإغلاق</button>
      </form>
      <section className="premium-card p-6">
        <h2 className="mb-4 font-extrabold text-[#14201A]">الإغلاقات النشطة</h2>
        {items.length === 0 ? <p className="rounded-xl bg-[#F7F3EB] p-6 text-center text-sm text-[#6B7566]">لا توجد إغلاقات مؤقتة.</p> : <div className="space-y-3">{items.map((item) => <article key={item.id} className="flex items-center justify-between rounded-xl border border-[#E8E3D8] p-4"><div><p className="font-bold text-[#14201A]">{item.title}</p><p className="mt-1 text-xs text-[#6B7566]">{formatDate(item.startTime)} · <span className="time-value">{formatTimeRange(item.startTime, item.endTime)}</span>{item.unit ? ` · ${item.unit.label}` : ' · جميع الوحدات'}</p></div><button onClick={() => remove(item.id)} className="text-xs font-bold text-red-700">إلغاء</button></article>)}</div>}
      </section>
    </div>
  </div>
}
