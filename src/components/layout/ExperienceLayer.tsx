'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const revealSelector = [
  '.page-hero',
  '.premium-card',
  '.category-link',
  '.space-card',
  '.space-detail-section',
  '.home-proof-item',
  '.home-owner-cta',
  '.dashboard-page > section',
  '.dashboard-page > article',
  '[data-reveal]',
].join(',')

export default function ExperienceLayer() {
  const pathname = usePathname()
  const progressRef = useRef<HTMLDivElement | null>(null)
  const pendingTimer = useRef<number | null>(null)

  useEffect(() => {
    progressRef.current?.classList.remove('is-active')
    if (pendingTimer.current) window.clearTimeout(pendingTimer.current)
  }, [pathname])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.documentElement.classList.add('motion-ready')

    if (reduceMotion) return

    const observed = new WeakSet<Element>()
    const reveal = (element: Element) => {
      element.classList.add('is-revealed')
      observer.unobserve(element)
    }
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) reveal(entry.target)
        })
      },
      { rootMargin: '0px 0px -7% 0px', threshold: 0.08 },
    )

    const register = (root: ParentNode) => {
      const elements = root instanceof Element && root.matches(revealSelector)
        ? [root, ...root.querySelectorAll(revealSelector)]
        : [...root.querySelectorAll(revealSelector)]

      elements.forEach((element, index) => {
        if (observed.has(element) || element.closest('.first-visit-opening')) return
        observed.add(element)
        element.classList.add('reveal-target')
        ;(element as HTMLElement).style.setProperty('--reveal-order', String(index % 6))
        if (element.getBoundingClientRect().top < window.innerHeight * 0.94) reveal(element)
        else observer.observe(element)
      })
    }

    register(document)
    const mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node instanceof Element) register(node)
        })
      })
    })
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
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
