'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import SpaceWizard from '@/components/spaces/SpaceWizard'
import type { SpaceFormData } from '@/components/spaces/create/types'
import Badge, { getSpaceStatusBadge } from '@/components/ui/Badge'

const STATUS_OPTIONS = [
  { value: 'APPROVED', label: 'معتمدة ومنشورة', hint: 'مرئية للجميع وقابلة للحجز الآن.' },
  { value: 'PENDING_REVIEW', label: 'بانتظار المراجعة', hint: 'تنتظر قرارك — غير مرئية لطالبي المساحات.' },
  { value: 'REJECTED', label: 'مرفوضة', hint: 'أرسل سبب الرفض في الملاحظات ليعرف المالك ما يصححه.' },
  { value: 'INACTIVE', label: 'معطّلة', hint: 'تُسحب من النتائج فورًا دون حذف بياناتها.' },
  { value: 'DRAFT', label: 'مسودة', hint: 'لم تُرسل للمراجعة بعد.' },
] as const

const RING_BY_STATUS: Record<string, string> = {
  APPROVED: 'ring-green-200 focus:border-green-600',
  PENDING_REVIEW: 'ring-amber-200 focus:border-amber-600',
  REJECTED: 'ring-red-200 focus:border-red-600',
  INACTIVE: 'ring-gray-200 focus:border-gray-500',
  DRAFT: 'ring-gray-200 focus:border-gray-500',
}

/** A status change that takes a live listing away from buyers, or puts one in front of them. */
function isConsequentialChange(from: string, to: string) {
  if (from === to) return false
  return from === 'APPROVED' || to === 'APPROVED'
}

/**
 * The admin's copy of the space form: the same nine steps the owner gets, plus the fields
 * only the platform manages — publication status, the advertising licence, and the internal
 * note shown back to the owner on rejection.
 */
export default function AdminEditSpacePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [status, setStatus] = useState('')
  const [originalStatus, setOriginalStatus] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [ownerName, setOwnerName] = useState('')

  useEffect(() => {
    let cancelled = false
    fetch(`/api/spaces/${id}`)
      .then(response => response.json())
      .then(data => {
        if (cancelled || !data.space) return
        const loadedStatus = data.space.status || 'PENDING_REVIEW'
        setStatus(loadedStatus)
        setOriginalStatus(loadedStatus)
        setAdminNotes(data.space.adminNotes || '')
        setLicenseNumber(data.space.advertisingLicenseNumber || '')
        setOwnerName(data.space.seller?.name || '')
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [id])

  async function submit(form: SpaceFormData) {
    const response = await fetch(`/api/spaces/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, status, adminNotes, advertisingLicenseNumber: licenseNumber }),
    })
    const data = await response.json()
    if (!response.ok) return data.error || 'تعذر حفظ التعديلات'
    router.push(`/admin/spaces/${id}`)
    return null
  }

  const statusChanged = status !== originalStatus && originalStatus !== ''
  const consequential = statusChanged && isConsequentialChange(originalStatus, status)
  const activeOption = STATUS_OPTIONS.find(option => option.value === status)

  const adminPanel = (
    <section className="mb-6 rounded-2xl border border-[#0E3B34]/15 bg-[#F7FAF8] p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#A27B25]">تحكم مدير المنصة</p>
          <h2 className="mt-1 text-sm font-extrabold text-[#0E3B34]">
            بيانات إدارية{ownerName ? ` · المالك: ${ownerName}` : ''}
          </h2>
        </div>
        <Link href={`/admin/spaces/${id}`} className="text-xs font-bold text-[#0E3B34] hover:underline">
          ← عرض صفحة المساحة
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-bold text-[#59655D]">حالة النشر</span>
            {status && <Badge variant={getSpaceStatusBadge(status).variant}>{getSpaceStatusBadge(status).label}</Badge>}
          </div>
          <select
            value={status}
            onChange={event => setStatus(event.target.value)}
            className={`w-full rounded-lg border border-[#D8D1C7] bg-white px-4 py-2.5 text-sm ring-2 ring-transparent transition-colors focus:outline-none ${status ? RING_BY_STATUS[status] : ''}`}
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          {activeOption && <p className="mt-1.5 text-[11px] leading-5 text-[#8B9389]">{activeOption.hint}</p>}
          {statusChanged && (
            <p className={`mt-2 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold ${
              consequential ? 'bg-amber-50 text-amber-800' : 'bg-[#0E3B34]/5 text-[#0E3B34]'
            }`}>
              <span aria-hidden="true">{consequential ? '⚠' : '↻'}</span>
              سيتغير من «{getSpaceStatusBadge(originalStatus).label}» إلى «{getSpaceStatusBadge(status).label}» عند الحفظ
              {consequential && (status === 'APPROVED' ? ' — ستصبح مرئية للجميع فورًا.' : ' — ستُسحب من النتائج فورًا.')}
            </p>
          )}
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-[#59655D]">رقم الترخيص الإعلاني</span>
          <input
            value={licenseNumber}
            onChange={event => setLicenseNumber(event.target.value)}
            dir="ltr"
            placeholder="7700000000"
            className="w-full rounded-lg border border-[#D8D1C7] bg-white px-4 py-2.5 text-sm focus:border-[#0E3B34] focus:outline-none"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="mb-1.5 block text-xs font-bold text-[#59655D]">
            ملاحظات الإدارة <span className="font-normal text-[#8B9389]">(تظهر لصاحب المساحة)</span>
          </span>
          <textarea
            value={adminNotes}
            onChange={event => setAdminNotes(event.target.value)}
            rows={3}
            placeholder="سبب الرفض أو التعديل المطلوب..."
            className="w-full resize-none rounded-lg border border-[#D8D1C7] bg-white px-4 py-2.5 text-sm focus:border-[#0E3B34] focus:outline-none"
          />
          {status === 'REJECTED' && !adminNotes.trim() && (
            <p className="mt-1.5 text-[11px] font-bold text-amber-700">
              المساحة مرفوضة بلا سبب مذكور — أضف ملاحظة ليعرف المالك ما يصححه.
            </p>
          )}
        </label>
      </div>

      <p className="mt-4 text-xs leading-6 text-[#5F6764]">
        تُحفظ هذه البيانات مع بقية التعديلات عند الضغط على «حفظ كمدير». تعديل المدير لا يعيد المساحة إلى المراجعة —
        الحالة المختارة أعلاه هي الحالة التي تُحفظ.
      </p>
    </section>
  )

  return (
    <SpaceWizard
      mode="edit"
      spaceId={id}
      adminPanel={adminPanel}
      eyebrow="إدارة المنصة · تعديل كامل"
      title="تعديل بيانات المساحة"
      subtitle="عدّل أي بيان في المساحة نيابةً عن المالك، بنفس النموذج الذي يستخدمه."
      submitLabel="حفظ كمدير"
      notice="لديك صلاحية تعديل كل بيانات المساحة: الاسم والتصنيف والموقع على الخريطة والصور والمرافق والخدمات وجدول التوفر والتسعير والشروط، إضافةً إلى الحقول الإدارية بالأسفل."
      onSubmit={submit}
    />
  )
}
