'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminDeleteButton from '@/components/admin/AdminDeleteButton'

type Props = {
  id: string
  initialStatus: string
  initialNote?: string | null
  city: string
}

const STATUSES = [
  { value: 'NEW', label: 'جديد' },
  { value: 'IN_REVIEW', label: 'قيد المراجعة' },
  { value: 'MATCHED', label: 'تم توفير خيارات' },
  { value: 'CLOSED', label: 'مغلق' },
]

export default function AdminSpaceNeedActions({ id, initialStatus, initialNote, city }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState(initialStatus)
  const [adminNote, setAdminNote] = useState(initialNote || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function save() {
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`/api/space-needs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNote }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'تعذر تحديث الطلب')
        return
      }
      router.refresh()
    } catch {
      setError('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <select value={status} onChange={e => setStatus(e.target.value)} className="field bg-white py-2 text-xs">
        {STATUSES.map(item => (
          <option key={item.value} value={item.value}>{item.label}</option>
        ))}
      </select>
      <textarea
        value={adminNote}
        onChange={e => setAdminNote(e.target.value)}
        rows={2}
        placeholder="ملاحظة داخلية للفريق..."
        className="field resize-none py-2 text-xs"
      />
      {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
      <button
        type="button"
        onClick={save}
        disabled={loading}
        className="w-full rounded-xl bg-[#0E3B34] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#092C27] disabled:opacity-60"
      >
        {loading ? 'جاري الحفظ...' : 'حفظ التحديث'}
      </button>
      <AdminDeleteButton
        endpoint={`/api/space-needs/${id}`}
        label="حذف الطلب نهائيًا"
        className="w-full rounded-xl border border-red-200 bg-red-50 py-2 text-xs font-bold text-red-700 transition-colors hover:bg-red-100"
        confirmMessage={`سيتم حذف طلب احتياج المساحة في "${city}" نهائيًا.`}
      />
    </div>
  )
}
