'use client'

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

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
  return <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}

const SpaceImageLightbox = forwardRef<SpaceImageLightboxHandle, Props>(function SpaceImageLightbox(
  { images, activeIndex, spaceName, onActiveIndexChange },
  ref,
) {
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [zoom, setZoom] = useState(MIN_ZOOM)
  const image = images[activeIndex]

  function resetZoom() { setZoom(MIN_ZOOM) }
  function close() {
    setClosing(true)
    window.setTimeout(() => { setOpen(false); setClosing(false); resetZoom() }, 180)
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

      {open && (
        <div
          className={`lightbox-overlay fixed inset-0 z-[60] flex flex-col bg-[#050f0d]/96 text-white backdrop-blur-sm ${closing ? 'is-closing' : 'is-opening'}`}
          role="dialog"
          aria-modal="true"
          aria-label={`${spaceName} image viewer`}
        >
          <header className="flex shrink-0 items-center justify-between px-4 py-3 sm:px-8 sm:py-5">
            <div>
              <p className="text-base font-bold sm:text-lg">{spaceName}</p>
              <p className="mt-1 text-sm text-white/65">{activeIndex + 1} / {images.length}</p>
            </div>
            <button type="button" onClick={close} className="lightbox-close" aria-label="Close image viewer"><Icon name="close" /></button>
          </header>

          <div className="relative min-h-0 flex-1 overflow-hidden">
            <button type="button" onClick={() => changeImage(-1)} className="lightbox-arrow start-3 sm:start-8" aria-label="Previous image" disabled={images.length < 2}><Icon name="previous" /></button>
            <div className="flex h-full w-full items-center justify-center p-2 sm:p-4" onClick={close}>
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
            <button type="button" onClick={() => changeImage(1)} className="lightbox-arrow end-3 sm:end-8" aria-label="Next image" disabled={images.length < 2}><Icon name="next" /></button>
          </div>

          <footer className="flex shrink-0 flex-col items-center gap-4 px-4 py-4 sm:flex-row sm:justify-center sm:py-5">
            <div className="flex items-center gap-2 rounded-2xl bg-white/10 p-1.5">
              <button type="button" onClick={() => setZoom(current => Math.max(MIN_ZOOM, current - 0.25))} className="lightbox-zoom-button" aria-label="Zoom out" disabled={zoom === MIN_ZOOM}><Icon name="minus" /></button>
              <button type="button" onClick={resetZoom} className="lightbox-zoom-value" aria-label="Reset zoom">{Math.round(zoom * 100)}%</button>
              <button type="button" onClick={() => setZoom(current => Math.min(MAX_ZOOM, current + 0.25))} className="lightbox-zoom-button" aria-label="Zoom in" disabled={zoom === MAX_ZOOM}><Icon name="plus" /></button>
            </div>
            {images.length > 1 && (
              <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
                {images.map((thumbnail, index) => <button key={thumbnail.id} type="button" onClick={() => openAt(index)} className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${index === activeIndex ? 'border-[#B99A63]' : 'border-white/20 opacity-60 hover:opacity-100'}`} aria-label={`Open image ${index + 1}`}><img src={thumbnail.url} alt="" className="h-full w-full object-cover" /></button>)}
              </div>
            )}
          </footer>
        </div>
      )}
    </>
  )
})

export default SpaceImageLightbox
