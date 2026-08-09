'use client'

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { createPortal } from 'react-dom'

type GalleryImage = { id: string; url: string }
type Props = { images: GalleryImage[]; activeIndex: number; spaceName: string; onActiveIndexChange: (index: number) => void }
export type SpaceImageLightboxHandle = { openAt: (index: number) => void }

const MIN_ZOOM = 1
const MAX_ZOOM = 3

function Icon({ name }: { name: 'close' | 'minus' | 'plus' | 'next' | 'previous' | 'expand' }) {
  const paths = {
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    minus: <path d="M5 12h14" />,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    next: <path d="m9 5 7 7-7 7" />,
    previous: <path d="m15 5-7 7 7 7" />,
    expand: <><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" /></>,
  }
  return <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}

const SpaceImageLightbox = forwardRef<SpaceImageLightboxHandle, Props>(function SpaceImageLightbox(
  { images, activeIndex, spaceName, onActiveIndexChange },
  ref,
) {
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [zoom, setZoom] = useState(MIN_ZOOM)
  const [mounted, setMounted] = useState(false)
  const image = images[activeIndex]

  useEffect(() => {
    // Portals need a browser document; this only ever runs after the client mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  function resetZoom() { setZoom(MIN_ZOOM) }
  function close() {
    setClosing(true)
    window.setTimeout(() => { setOpen(false); setClosing(false); resetZoom() }, 160)
  }
  function openAt(index: number) { onActiveIndexChange(index); setClosing(false); setOpen(true); resetZoom() }
  function changeImage(step: number) {
    if (images.length < 2) return
    onActiveIndexChange((activeIndex + step + images.length) % images.length)
    resetZoom()
  }

  useImperativeHandle(ref, () => ({ openAt }))

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowLeft') changeImage(-1)
      if (event.key === 'ArrowRight') changeImage(1)
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  })

  if (!image) return null

  const overlay = open && mounted ? createPortal(
    <div
      className={`lightbox-overlay fixed inset-0 z-[999] bg-black/95 text-white ${closing ? 'is-closing' : 'is-opening'}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${spaceName} image viewer`}
    >
      <div className="flex h-full w-full items-center justify-center p-4 sm:p-10" onClick={close}>
        <div className="lightbox-frame flex h-full w-full items-center justify-center">
          <img
            src={image.url}
            alt={`${spaceName} ${activeIndex + 1}`}
            className="max-h-full max-w-full select-none object-contain transition-transform duration-200"
            style={{ transform: `scale(${zoom})` }}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      </div>

      <div className="lightbox-topbar">
        <button type="button" onClick={close} className="lightbox-round" aria-label="إغلاق"><Icon name="close" /></button>
        {images.length > 1 && <span className="lightbox-counter">{activeIndex + 1} / {images.length}</span>}
        <div className="lightbox-zoom-group">
          <button type="button" onClick={() => setZoom(current => Math.max(MIN_ZOOM, current - 0.25))} className="lightbox-round" aria-label="تصغير" disabled={zoom === MIN_ZOOM}><Icon name="minus" /></button>
          <button type="button" onClick={() => setZoom(current => Math.min(MAX_ZOOM, current + 0.25))} className="lightbox-round" aria-label="تكبير" disabled={zoom === MAX_ZOOM}><Icon name="plus" /></button>
        </div>
      </div>

      {images.length > 1 && (
        <>
          <button type="button" onClick={() => changeImage(-1)} className="lightbox-nav start-3 sm:start-6" aria-label="الصورة السابقة"><Icon name="previous" /></button>
          <button type="button" onClick={() => changeImage(1)} className="lightbox-nav end-3 sm:end-6" aria-label="الصورة التالية"><Icon name="next" /></button>
        </>
      )}
    </div>,
    document.body,
  ) : null

  return (
    <>
      <button type="button" className="space-detail-gallery-main" aria-label="Open images" onClick={() => openAt(activeIndex)}>
        <img src={image.url} alt={spaceName} />
        <span className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#092C27]/65 to-transparent" />
        <span className="absolute bottom-4 start-4 inline-flex items-center gap-2 rounded-xl border border-white/30 bg-[#061B18]/75 px-4 py-3 text-sm font-bold text-white shadow-lg backdrop-blur-sm">
          <Icon name="expand" />
          <span>{activeIndex + 1} / {images.length}</span>
        </span>
      </button>
      {overlay}
    </>
  )
})

export default SpaceImageLightbox
