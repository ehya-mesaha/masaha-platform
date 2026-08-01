'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminDeleteButton from '@/components/admin/AdminDeleteButton'

export default function AdminBookingActions({ id, currentStatus, initialNote, spaceName, buyerName }: { id: string; currentStatus: string; initialNote: string | null; spaceName: string; buyerName: string }) {
  const router = useRouter()
  const [status, setStatus] = useState('COMPLETED')
  const [adminNote, setAdminNote] = useState(initialNote || '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const deleteSection = (
    <div className="mt-5 border-t border-[#E4DDD2] pt-5">
      <p className="mb-3 text-xs font-bold text-[#4F5B56]">حذف نهائي</p>
      <AdminDeleteButton
        endpoint={`/api/admin/bookings/${id}`}
        label="حذف الحجز نهائيًا"
        className="w-full rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
        confirmMessage={`سيتم حذف حجز "${buyerName}" في "${spaceName}" نهائيًا مع أي تقييم مرتبط به. لا يمكن التراجع عن هذا الإجراء.`}
        redirectTo="/admin/bookings"
      />
    </div>
  )

  if (currentStatus !== 'CONFIRMED') {
    return <div>
      <div className="rounded-2xl border border-[#D8D1C7] bg-[#FAF8F3] p-4 text-sm leading-7 text-[#5F6764]">
        هذا الحجز مغلق تشغيلياً. تظل بياناته متاحة للمراجعة والتصدير ولا يمكن إعادة فتحه من هذه الصفحة.
      </div>
      {deleteSection}
    </div>
  }

  async function save() {
    setSaving(true)
    setMessage('')
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNote }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'تعذر تحديث الحجز.')
      setMessage('تم تحديث الحجز وإشعار طالب المساحة.')
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'تعذر تحديث الحجز.')
    } finally {
      setSaving(false)
    }
  }

  return <div className="space-y-4">
    <label className="block text-xs font-bold text-[#4F5B56]">
      الإجراء التشغيلي
      <select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-2 w-full rounded-xl border border-[#D8D1C7] bg-white px-4 py-3 text-sm outline-none focus:border-[#0E3B34]">
        <option value="COMPLETED">تحديد كمكتمل</option>
        <option value="CANCELLED_BY_BUYER">إلغاء بطلب طالب المساحة</option>
        <option value="CANCELLED_BY_SELLER">إلغاء من صاحب المساحة</option>
      </select>
    </label>
    <label className="block text-xs font-bold text-[#4F5B56]">
      ملاحظة القرار
      <textarea value={adminNote} onChange={(event) => setAdminNote(event.target.value)} rows={4} maxLength={3000} className="mt-2 w-full resize-none rounded-xl border border-[#D8D1C7] bg-white px-4 py-3 text-sm leading-7 outline-none focus:border-[#0E3B34]" />
    </label>
    <button type="button" onClick={save} disabled={saving} className="w-full rounded-xl bg-[#0E3B34] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#155449] disabled:opacity-50">
      {saving ? 'جارٍ الحفظ…' : 'حفظ القرار وإشعار المستخدم'}
    </button>
    {message && <p className="text-xs font-bold text-[#0E3B34]">{message}</p>}
    {deleteSection}
  </div>
}
