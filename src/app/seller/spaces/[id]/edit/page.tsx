'use client'

import { useParams, useRouter } from 'next/navigation'
import SpaceWizard from '@/components/spaces/SpaceWizard'
import type { SpaceFormData } from '@/components/spaces/create/types'
import { LEGAL_VERSION } from '@/lib/legal'

export default function EditSpacePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  async function submit(form: SpaceFormData) {
    const response = await fetch(`/api/spaces/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, legalVersion: LEGAL_VERSION }),
    })
    const data = await response.json()
    if (!response.ok) return data.error || 'حدث خطأ'
    router.push(`/seller/spaces/${id}?submittedForReview=1`)
    return null
  }

  return (
    <SpaceWizard
      mode="edit"
      spaceId={id}
      eyebrow="تعديل كامل · 9 خطوات"
      title="تعديل المساحة"
      subtitle="كل بيانات المساحة قابلة للتعديل — الموقع والصور والمرافق والخدمات والجدول والتسعير والشروط."
      submitLabel="حفظ التغييرات"
      notice="بياناتك الحالية محمّلة في كل خطوة. انتقل مباشرة إلى الخطوة التي تريد تعديلها واحفظ من أي مكان؛ ما لا تغيّره يبقى كما هو. ستنتقل المساحة إلى «بانتظار المراجعة» حتى يعتمدها مدير المنصة."
      onSubmit={submit}
    />
  )
}
