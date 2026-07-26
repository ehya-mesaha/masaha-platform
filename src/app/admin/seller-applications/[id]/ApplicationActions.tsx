'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ApplicationActions({ id, initialNotes }: { id: string; initialNotes?: string | null }) {
  const router = useRouter()
  const [notes, setNotes] = useState(initialNotes || '')
  const [loading, setLoading] = useState('')
  async function update(status: string) {
    setLoading(status)
    const response = await fetch(`/api/admin/seller-applications/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status, adminNotes: notes }) })
    setLoading('')
    if (response.ok) router.refresh()
  }
  return <section className="premium-card p-6"><h2 className="mb-4 font-extrabold text-[#1B1B1B]">قرار الإدارة</h2><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="ملاحظات المراجعة أو التعديلات المطلوبة..." className="min-h-28 w-full rounded-xl border border-[#D8D1C7] p-4 text-sm outline-none focus:border-[#0E3B34]" /><div className="mt-4 grid gap-2 sm:grid-cols-2"><Action text="إرسال العقد" status="CONTRACT_SENT" update={update} loading={loading} /><Action text="طلب تعديلات" status="CHANGES_REQUESTED" update={update} loading={loading} /><Action text="اعتماد وتفعيل الحساب" status="APPROVED" update={update} loading={loading} primary /><Action text="رفض الطلب" status="REJECTED" update={update} loading={loading} danger /></div></section>
}
function Action({ text, status, update, loading, primary, danger }: { text: string; status: string; update: (status: string) => void; loading: string; primary?: boolean; danger?: boolean }) { return <button disabled={Boolean(loading)} onClick={() => update(status)} className={`rounded-xl px-4 py-3 text-sm font-bold disabled:opacity-50 ${primary ? 'bg-[#0E3B34] text-white' : danger ? 'bg-red-50 text-red-700' : 'bg-[#F5F1E8] text-[#33423F]'}`}>{loading === status ? 'جاري الحفظ...' : text}</button> }
