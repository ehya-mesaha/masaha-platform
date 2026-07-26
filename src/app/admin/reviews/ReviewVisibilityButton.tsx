'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ReviewVisibilityButton({ id, visible }: { id: string; visible: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  async function toggle() {
    setLoading(true)
    const response = await fetch(`/api/admin/reviews/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isVisible: !visible }) })
    setLoading(false)
    if (response.ok) router.refresh()
  }
  return <button disabled={loading} onClick={toggle} className={`rounded-xl px-3 py-2 text-xs font-bold ${visible ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{loading ? 'جاري الحفظ...' : visible ? 'إخفاء' : 'إظهار'}</button>
}
