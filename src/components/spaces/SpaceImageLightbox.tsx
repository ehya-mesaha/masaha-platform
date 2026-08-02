'use client'

import { useEffect, useRef, useState } from 'react'

type GalleryImage = { id: string; url: string }
type Props = { images: GalleryImage[]; activeIndex: number; spaceName: string; onActiveIndexChange: (index: number) => void }

const MIN_ZOOM = 1
const MAX_ZOOM = 4

export default function SpaceImageLightbox({ images, activeIndex, spaceName, onActiveIndexChange }: Props) {
  const [open, setOpen] = useState(false)
  const [zoom, setZoom] = useState(MIN_ZOOM)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const dragRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null)
  const image = images[activeIndex]

  function resetZoom() { setZoom(MIN_ZOOM); setPan({ x: 0, y: 0 }) }
  function close() { setOpen(false); resetZoom() }
  function openAt(index: number) { onActiveIndexChange(index); setOpen(true); resetZoom() }
  function changeImage(direction: number) {
    if (images.length < 2) return
    onActiveIndexChange((activeIndex + direction + images.length) % images.length)
    resetZoom()
  }

  useEffect(() => {
    if (!open) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowLeft') changeImage(-1)
      if (event.key === 'ArrowRight') changeImage(1)
      if (event.key === '+' || event.key === '=') setZoom(current => Math.min(MAX_ZOOM, current + 0.25))
      if (event.key === '-') setZoom(current => Math.max(MIN_ZOOM, current - 0.25))
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  })

  if (!image) return null

  return (
    <>
      <button type="button" className="space-detail-gallery-main" aria-label="Open image viewer" onClick={() => openAt(activeIndex)}>
        <img src={image.url} alt={spaceName} />
        <span className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#092C27]/55 to-transparent" />
        <span className="absolute bottom-4 start-4 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-black/25 px-3 py-2 text-xs font-bold text-white backdrop-blur-md">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V6.75A2.25 2.25 0 0 1 5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75v9.75m-18 0v.75a2.25 2.25 0 0 0 2.25 2.25h13.5A2.25 2.25 0 0 0 21 17.25v-.75M3 16.5l5.25-5.25 3.75 3.75 2.25-2.25L21 16.5M14.25 8.25h.008v.008h-.008V8.25Z" /></svg>
          {activeIndex + 1} / {images.length}
        </span>
      </button>

      {open && <div className="fixed inset-0 z-[60] flex flex-col bg-[#061B18]/95 p-3 text-white backdrop-blur-md sm:p-5" role="dialog" aria-modal="true" aria-label={`${spaceName} image viewer`}>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-bold">{activeIndex + 1} / {images.length}</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setZoom(current => Math.max(MIN_ZOOM, current - 0.25))} className="lightbox-control" aria-label="Zoom out">−</button>
            <button type="button" onClick={resetZoom} className="lightbox-zoom-label" aria-label="Reset zoom">{Math.round(zoom * 100)}%</button>
            <button type="button" onClick={() => setZoom(current => Math.min(MAX_ZOOM, current + 0.25))} className="lightbox-control" aria-label="Zoom in">+</button>
            <button type="button" onClick={close} className="lightbox-control ms-2" aria-label="Close image viewer">×</button>
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center py-3" onWheel={event => { event.preventDefault(); setZoom(current => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, current + (event.deltaY < 0 ? 0.2 : -0.2)))) }}>
          {images.length > 1 && <button type="button" onClick={() => changeImage(-1)} className="lightbox-arrow start-1 sm:start-4" aria-label="Previous image">‹</button>}
          <div className="flex h-full w-full items-center justify-center overflow-hidden" onPointerDown={event => { if (zoom > 1) { event.currentTarget.setPointerCapture(event.pointerId); dragRef.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y } } }} onPointerMove={event => { if (!dragRef.current) return; setPan({ x: dragRef.current.panX + event.clientX - dragRef.current.x, y: dragRef.current.panY + event.clientY - dragRef.current.y }) }} onPointerUp={() => { dragRef.current = null }} onPointerCancel={() => { dragRef.current = null }}>
            <img src={image.url} alt={`${spaceName} ${activeIndex + 1}`} draggable={false} className="max-h-full max-w-full select-none object-contain transition-transform duration-150" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, cursor: zoom > 1 ? 'grab' : 'zoom-in' }} onDoubleClick={() => zoom === 1 ? setZoom(2) : resetZoom()} />
          </div>
          {images.length > 1 && <button type="button" onClick={() => changeImage(1)} className="lightbox-arrow end-1 sm:end-4" aria-label="Next image">›</button>}
        </div>

        <div className="flex justify-center gap-2 overflow-x-auto pb-1">
          {images.map((thumbnail, index) => <button key={thumbnail.id} type="button" onClick={() => openAt(index)} className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${index === activeIndex ? 'border-[#B99A63]' : 'border-white/20 opacity-70'}`} aria-label={`Open image ${index + 1}`}><img src={thumbnail.url} alt="" className="h-full w-full object-cover" /></button>)}
        </div>
      </div>}
    </>
  )
}
