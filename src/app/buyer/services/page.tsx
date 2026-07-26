'use client'

import { useEffect, useState } from 'react'
import { formatNumber } from '@/lib/format'

type Service = { id: string; name: string; description: string; indicativePrice: number | null; pricingType: string }

export default function BuyerServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [notes, setNotes] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  useEffect(() => { fetch('/api/partner-services').then((response) => response.json()).then(setServices) }, [])
  async function submit() {
    setLoading(true)
    const response = await fetch('/api/partner-services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: services.filter((service) => selected[service.id]).map((service) => ({ serviceId: service.id, quantity: 1 })), notes }) })
    const data = await response.json()
    setMessage(response.ok ? `تم إرسال طلبك للمراجعة. الرقم: ${data.publicRef}` : data.error)
    setLoading(false)
  }
  return <div className="dashboard-page">
    <header className="page-hero mb-6 p-6"><p className="mb-2 text-xs font-bold text-[#D8B455]">خدمات شركاء إحياء مساحة</p><h1 className="text-2xl font-extrabold text-white">اجعل تجربتك متكاملة</h1><p className="mt-2 text-sm text-white/65">اختر الخدمات المطلوبة وأرسل التفاصيل؛ يراجع الفريق الطلب ويرسل عرضًا نهائيًا. لا يوجد دفع في هذه المرحلة.</p></header>
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="grid gap-4 sm:grid-cols-2">{services.map((service) => <button key={service.id} onClick={() => setSelected({ ...selected, [service.id]: !selected[service.id] })} className={`premium-card p-5 text-right transition ${selected[service.id] ? 'ring-2 ring-[#1B3A2D]' : ''}`}><div className="flex justify-between gap-3"><div><h2 className="font-extrabold text-[#14201A]">{service.name}</h2><p className="mt-2 text-sm leading-6 text-[#6B7566]">{service.description}</p></div><span className={`mt-1 h-5 w-5 rounded border ${selected[service.id] ? 'border-[#1B3A2D] bg-[#1B3A2D]' : 'border-[#CFC6B6]'}`} /></div><p className="mt-4 text-xs font-bold text-[#C49A3C]">{service.indicativePrice ? `يبدأ من ${formatNumber(service.indicativePrice)} ر.س` : 'السعر حسب الطلب'}</p></button>)}</div>
      <aside className="premium-card h-fit p-6 xl:sticky xl:top-6"><h2 className="font-extrabold text-[#14201A]">ملخص الطلب</h2><p className="mt-2 text-sm text-[#6B7566]">{formatNumber(Object.values(selected).filter(Boolean).length)} خدمة مختارة</p><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="موعد الفعالية والتفاصيل وأي متطلبات خاصة..." className="mt-4 min-h-36 w-full rounded-xl border border-[#DDD6C8] p-4 text-sm" />{message && <p className="mt-4 rounded-xl bg-[#F7F3EB] p-3 text-sm font-bold text-[#1B3A2D]">{message}</p>}<button onClick={submit} disabled={loading || !Object.values(selected).some(Boolean)} className="mt-4 w-full rounded-xl bg-[#1B3A2D] px-4 py-3 font-bold text-white disabled:opacity-50">{loading ? 'جاري الإرسال...' : 'إرسال للمراجعة'}</button></aside>
    </div>
  </div>
}
