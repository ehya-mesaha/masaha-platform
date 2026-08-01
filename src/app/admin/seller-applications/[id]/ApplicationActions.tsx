'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminDeleteButton from '@/components/admin/AdminDeleteButton'

export default function ApplicationActions({ id, initialNotes, schoolName }: { id: string; initialNotes?: string | null; schoolName: string }) {
  const router = useRouter()
  const [notes, setNotes] = useState(initialNotes || '')
  const [loading, setLoading] = useState('')
  async function update(status: string) {
    setLoading(status)
    const response = await fetch(`/api/admin/seller-applications/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status, adminNotes: notes }) })
    setLoading('')
    if (response.ok) router.refresh()
  }
  return <section className="premium-card p-6"><h2 className="mb-4 font-extrabold text-[#1B1B1B]">قرار الإدارة</h2><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="ملاحظات المراجعة أو التعديلات المطلوبة..." className="min-h-28 w-full rounded-xl border border-[#D8D1C7] p-4 text-sm outline-none focus:border-[#0E3B34]" /><div className="mt-4 grid gap-2 sm:grid-cols-2"><Action text="إرسال العقد" status="CONTRACT_SENT" update={update} loading={loading} /><Action text="طلب تعديلات" status="CHANGES_REQUESTED" update={update} loading={loading} /><Action text="اعتماد وتفعيل الحساب" status="APPROVED" update={update} loading={loading} primary /><Action text="رفض الطلب" status="REJECTED" update={update} loading={loading} danger /></div>
    <div className="mt-6 border-t border-[#E4DDD2] pt-5">
      <p className="mb-3 text-xs font-bold text-[#4F5B56]">حذف نهائي</p>
      <AdminDeleteButton
        endpoint={`/api/admin/seller-applications/${id}`}
        label="حذف الطلب نهائيًا"
        className="w-full rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
        confirmMessage={`سيتم حذف طلب انضمام "${schoolName}" نهائيًا. لن يؤثر هذا على حساب المستخدم نفسه.`}
        redirectTo="/admin/seller-applications"
      />
    </div>
  </section>
}
function Action({ text, status, update, loading, primary, danger }: { text: string; status: string; update: (status: string) => void; loading: string; primary?: boolean; danger?: boolean }) { return <button disabled={Boolean(loading)} onClick={() => update(status)} className={`rounded-xl px-4 py-3 text-sm font-bold disabled:opacity-50 ${primary ? 'bg-[#0E3B34] text-white' : danger ? 'bg-red-50 text-red-700' : 'bg-[#F5F1E8] text-[#33423F]'}`}>{loading === status ? 'جاري الحفظ...' : text}</button> }
