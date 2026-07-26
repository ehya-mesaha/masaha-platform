'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SaveSearchButton({ criteria }: { criteria: { mode?: string } }) {
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  async function save() {
    const defaultName = criteria.mode === 'program' ? 'بحث برنامج متكرر' : 'بحث عن مساحة'
    const name = window.prompt('اسم البحث المحفوظ', defaultName)
    if (!name) return
    setLoading(true)
    const response = await fetch('/api/saved-searches', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, criteria }) })
    setLoading(false)
    if (response.status === 401) return router.push('/auth/login')
    if (response.ok) setSaved(true)
  }
  return <button onClick={save} disabled={loading || saved} className="rounded-full border border-[#DDD5C5] bg-white px-3 py-1.5 text-xs font-bold text-[#1B3A2D] disabled:opacity-60">{saved ? 'تم حفظ البحث' : loading ? 'جاري الحفظ...' : 'حفظ هذا البحث'}</button>
}
