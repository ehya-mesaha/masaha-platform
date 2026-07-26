'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function FavoriteButton({ spaceId }: { spaceId: string }) {
  const router = useRouter()
  const [favorite, setFavorite] = useState(false)
  useEffect(() => {
    let cancelled = false
    fetch(`/api/favorites?spaceId=${encodeURIComponent(spaceId)}`).then((response) => response.json()).then((data) => { if (!cancelled) setFavorite(Boolean(data.favorite)) })
    return () => { cancelled = true }
  }, [spaceId])
  async function toggle(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    const response = await fetch('/api/favorites', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ spaceId }) })
    if (response.status === 401) return router.push('/auth/login')
    if (response.ok) setFavorite(Boolean((await response.json()).favorite))
  }
  return <button type="button" onClick={toggle} aria-label={favorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'} className="grid h-9 w-9 place-items-center rounded-full border border-white/30 bg-white/90 text-[#1B3A2D]">
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill={favorite ? 'currentColor' : 'none'}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </button>
}
