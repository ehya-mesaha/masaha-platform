'use client'

import { useRouter } from 'next/navigation'
import SpaceWizard from '@/components/spaces/SpaceWizard'
import type { SpaceFormData } from '@/components/spaces/create/types'
import { LEGAL_VERSION } from '@/lib/legal'

export default function NewSpacePage() {
  const router = useRouter()

  async function submit(form: SpaceFormData) {
    const response = await fetch('/api/spaces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, legalVersion: LEGAL_VERSION }),
    })
    const data = await response.json()
    if (!response.ok) return data.error || 'حدث خطأ'
    router.push('/seller/spaces')
    return null
  }

  return (
    <SpaceWizard
      mode="create"
      eyebrow="إضافة احترافية · 9 خطوات إلزامية"
      title="إضافة مساحة جديدة"
      subtitle="أكمل كل خطوة لضمان نشر بيانات واضحة وجاهزة للحجز المباشر."
      submitLabel="نشر المساحة"
      onSubmit={submit}
    />
  )
}
