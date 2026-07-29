'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ContactMessageAction({ id, initialIsRead }: { id: string; initialIsRead: boolean }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  async function toggle() {
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/contact-messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: !initialIsRead }),
      })
      if (!response.ok) throw new Error()
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <button type="button" onClick={toggle} disabled={saving} className="rounded-xl border border-[#D8D1C7] bg-white px-4 py-2 text-xs font-extrabold text-[#0E3B34] transition hover:border-[#0E3B34] disabled:opacity-50">
      {saving ? 'جارٍ الحفظ…' : initialIsRead ? 'إعادة فتح الرسالة' : 'تحديد كمقروءة'}
    </button>
  )
}
