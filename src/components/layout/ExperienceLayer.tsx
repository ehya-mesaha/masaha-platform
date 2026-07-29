'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function ExperienceLayer() {
  const pathname = usePathname()
  const progressRef = useRef<HTMLDivElement | null>(null)
  const pendingTimer = useRef<number | null>(null)

  useEffect(() => {
    progressRef.current?.classList.remove('is-active')
    if (pendingTimer.current) window.clearTimeout(pendingTimer.current)
  }, [pathname])

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!finePointer.matches || reduceMotion.matches) return

    let animationFrame = 0
    const onPointerMove = (event: PointerEvent) => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`)
        document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`)
      })
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented
        || event.button !== 0
        || event.metaKey
        || event.ctrlKey
        || event.shiftKey
        || event.altKey
      ) return

      const target = event.target
      if (!(target instanceof Element)) return
      const anchor = target.closest('a') as HTMLAnchorElement | null
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return

      const destination = new URL(anchor.href, window.location.href)
      if (destination.origin !== window.location.origin) return
      if (
        destination.pathname === window.location.pathname
        && destination.search === window.location.search
      ) return

      progressRef.current?.classList.add('is-active')
      if (pendingTimer.current) window.clearTimeout(pendingTimer.current)
      pendingTimer.current = window.setTimeout(() => progressRef.current?.classList.remove('is-active'), 4000)
    }

    document.addEventListener('click', onDocumentClick, true)
    return () => {
      document.removeEventListener('click', onDocumentClick, true)
      if (pendingTimer.current) window.clearTimeout(pendingTimer.current)
    }
  }, [])

  return (
    <>
      <div ref={progressRef} className="route-progress" aria-hidden="true">
        <span />
      </div>
      <div className="ambient-pointer" aria-hidden="true" />
    </>
  )
}
