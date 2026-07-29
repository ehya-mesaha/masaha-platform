'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const statuses = [
  ['DRAFT', 'مسودة'],
  ['UNDER_REVIEW', 'قيد المراجعة'],
  ['QUOTED', 'تم التسعير'],
  ['ACCEPTED', 'مقبول'],
  ['REJECTED', 'مرفوض'],
  ['COMPLETED', 'مكتمل'],
] as const

export default function ServiceRequestActions({
  id,
  initialStatus,
  initialQuotedTotal,
  initialAdminNotes,
}: {
  id: string
  initialStatus: string
  initialQuotedTotal: number | null
  initialAdminNotes: string | null
}) {
  const router = useRouter()
  const [status, setStatus] = useState(initialStatus)
  const [quotedTotal, setQuotedTotal] = useState(initialQuotedTotal?.toString() || '')
  const [adminNotes, setAdminNotes] = useState(initialAdminNotes || '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function save() {
    setSaving(true)
    setMessage('')
    try {
      const response = await fetch(`/api/admin/service-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, quotedTotal, adminNotes }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'تعذر حفظ الطلب.')
      setMessage('تم حفظ التحديث.')
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'تعذر حفظ الطلب.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-5 grid gap-3 border-t border-[#E4DDD2] pt-5 sm:grid-cols-2 lg:grid-cols-[180px_180px_1fr_auto] lg:items-end">
      <label className="text-xs font-bold text-[#4F5B56]">
        حالة الطلب
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-2 w-full rounded-xl border border-[#D8D1C7] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0E3B34]">
          {statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <label className="text-xs font-bold text-[#4F5B56]">
        السعر المعتمد (ر.س)
        <input type="number" min="0" step="0.01" value={quotedTotal} onChange={(event) => setQuotedTotal(event.target.value)} className="mt-2 w-full rounded-xl border border-[#D8D1C7] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0E3B34]" />
      </label>
      <label className="text-xs font-bold text-[#4F5B56]">
        ملاحظة الإدارة
        <input value={adminNotes} onChange={(event) => setAdminNotes(event.target.value)} maxLength={3000} className="mt-2 w-full rounded-xl border border-[#D8D1C7] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0E3B34]" />
      </label>
      <button type="button" disabled={saving} onClick={save} className="rounded-xl bg-[#0E3B34] px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#155449] disabled:opacity-50">
        {saving ? 'جارٍ الحفظ…' : 'حفظ'}
      </button>
      {message && <p className="text-xs font-bold text-[#0E3B34] sm:col-span-2 lg:col-span-4">{message}</p>}
    </div>
  )
}
