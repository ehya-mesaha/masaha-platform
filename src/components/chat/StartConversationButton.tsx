'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  sellerId?: string
  spaceId?: string
  admin?: boolean
  label: string
  variant?: 'primary' | 'secondary'
}

export default function StartConversationButton({ sellerId, spaceId, admin, label, variant = 'secondary' }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function startConversation() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(admin ? { admin: true } : { sellerId, spaceId }),
      })
      const data = await res.json()
      if (res.status === 401) {
        router.push('/auth/login')
        return
      }
      if (!res.ok) throw new Error(data.error || 'تعذر فتح المحادثة')

      const meRes = await fetch('/api/auth/me')
      const meData = await meRes.json()
      const role = meData.user?.role
      const basePath = role === 'SELLER'
        ? '/seller/conversations'
        : role === 'ADMIN'
          ? '/admin/conversations'
          : '/buyer/conversations'

      router.push(`${basePath}?chat=${data.conversation.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر فتح المحادثة')
    } finally {
      setLoading(false)
    }
  }

  const className = variant === 'primary'
    ? 'bg-[#0E3B34] text-white hover:bg-[#092C27]'
    : 'border border-[#D8D1C7] bg-white text-[#0E3B34] hover:border-[#0E3B34] hover:bg-[#F5F1E8]'

  return (
    <div>
      <button
        type="button"
        onClick={startConversation}
        disabled={loading}
        className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 ${className}`}
      >
        <span aria-hidden>✉</span>
        {loading ? 'جاري الفتح...' : label}
      </button>
      {error && <p className="mt-2 text-center text-xs text-red-600">{error}</p>}
    </div>
  )
}
