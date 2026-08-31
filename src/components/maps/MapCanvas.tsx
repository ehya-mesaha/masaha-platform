'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  LatLng, MAX_LATITUDE, MAX_ZOOM, MIN_ZOOM, TILE_SIZE,
  clamp, latToWorldY, lngToWorldX, worldSize, worldXToLng, worldYToLat,
} from '@/lib/geo'

export type MapView = { center: LatLng; zoom: number }

type Props = {
  /** Where to look. Treated as a target: the map adopts it whenever it changes. */
  center: LatLng
  zoom: number
  /** The pin. Omit for a map with no pin yet. */
  marker?: LatLng | null
  /** Allow panning and zooming. */
  interactive?: boolean
  /** Called when the user clicks the map or drags the pin. Enables pin editing. */
  onPick?: (point: LatLng) => void
  onViewChange?: (view: MapView) => void
  height?: number
  className?: string
  ariaLabel?: string
  /** Extra controls rendered inside the map frame (top-start corner). */
  overlay?: React.ReactNode
}

const TILE_URL = (z: number, x: number, y: number) => `https://tile.openstreetmap.org/${z}/${x}/${y}.png`

/** Movement under this many pixels still counts as a click, not a drag. */
const CLICK_SLOP = 5

export default function MapCanvas({
  center, zoom, marker, interactive = true, onPick, onViewChange,
  height = 340, className = '', ariaLabel = 'خريطة', overlay,
}: Props) {
  const frameRef = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState({ width: 0, height })
  const [view, setView] = useState<MapView>({ center, zoom })
  const [loaded, setLoaded] = useState<Set<string>>(() => new Set())
  const [wheelHint, setWheelHint] = useState(false)
  const [draggingPin, setDraggingPin] = useState(false)

  const canEditPin = Boolean(onPick)

  // Adopt the target view whenever the parent moves it somewhere new. Comparing values
  // (not identity) keeps a parent that rebuilds the object every render from resetting
  // the user's own panning on each keystroke elsewhere in the form.
  const appliedTarget = useRef('')
  useEffect(() => {
    const key = `${center.lat.toFixed(7)},${center.lng.toFixed(7)},${zoom}`
    if (appliedTarget.current === key) return
    appliedTarget.current = key
    setView({ center, zoom })
  }, [center, zoom])

  // Track the frame's real pixel size; all projection depends on it.
  useLayoutEffect(() => {
    const node = frameRef.current
    if (!node) return
    const measure = () => {
      const rect = node.getBoundingClientRect()
      setSize({ width: Math.round(rect.width), height: Math.round(rect.height) })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const emitView = useCallback((next: MapView) => {
    appliedTarget.current = `${next.center.lat.toFixed(7)},${next.center.lng.toFixed(7)},${next.zoom}`
    setView(next)
    onViewChange?.(next)
  }, [onViewChange])

  const { width, height: frameHeight } = size
  const world = worldSize(view.zoom)

  // Top-left corner of the viewport in world pixels. Everything else derives from this.
  const origin = useMemo(() => {
    const cx = lngToWorldX(view.center.lng, view.zoom)
    let cy = latToWorldY(view.center.lat, view.zoom)
    // Keep the viewport inside the world vertically so you cannot pan into grey space.
    if (world > frameHeight) cy = clamp(cy, frameHeight / 2, world - frameHeight / 2)
    return { x: cx - width / 2, y: cy - frameHeight / 2 }
  }, [view, width, frameHeight, world])

  const toPixel = useCallback((point: LatLng) => ({
    x: lngToWorldX(point.lng, view.zoom) - origin.x,
    y: latToWorldY(point.lat, view.zoom) - origin.y,
  }), [view.zoom, origin])

  const toLatLng = useCallback((px: number, py: number): LatLng => ({
    lat: clamp(worldYToLat(origin.y + py, view.zoom), -MAX_LATITUDE, MAX_LATITUDE),
    lng: ((worldXToLng(origin.x + px, view.zoom) + 540) % 360) - 180,
  }), [view.zoom, origin])

  const tiles = useMemo(() => {
    if (!width || !frameHeight) return []
    const n = Math.pow(2, view.zoom)
    const x0 = Math.floor(origin.x / TILE_SIZE)
    const x1 = Math.floor((origin.x + width) / TILE_SIZE)
    const y0 = Math.max(0, Math.floor(origin.y / TILE_SIZE))
    const y1 = Math.min(n - 1, Math.floor((origin.y + frameHeight) / TILE_SIZE))

    const out: { key: string; url: string; left: number; top: number }[] = []
    for (let x = x0; x <= x1; x += 1) {
      for (let y = y0; y <= y1; y += 1) {
        const wrappedX = ((x % n) + n) % n   // wrap around the antimeridian
        out.push({
          key: `${view.zoom}/${wrappedX}/${y}/${x}`,
          url: TILE_URL(view.zoom, wrappedX, y),
          left: x * TILE_SIZE - origin.x,
          top: y * TILE_SIZE - origin.y,
        })
      }
    }
    return out
  }, [view.zoom, origin, width, frameHeight])

  /** Zoom while holding the point under the cursor still — the behaviour users expect. */
  const zoomAround = useCallback((delta: number, anchorX?: number, anchorY?: number) => {
    const nextZoom = clamp(view.zoom + delta, MIN_ZOOM, MAX_ZOOM)
    if (nextZoom === view.zoom) return
    if (anchorX === undefined || anchorY === undefined || !width || !frameHeight) {
      emitView({ center: view.center, zoom: nextZoom })
      return
    }
    const anchor = toLatLng(anchorX, anchorY)
    const scale = Math.pow(2, nextZoom)
    const ax = ((anchor.lng + 180) / 360) * TILE_SIZE * scale
    const ay = latToWorldY(anchor.lat, nextZoom)
    // Solve for the centre that keeps `anchor` under the same screen pixel.
    const newOriginX = ax - anchorX
    const newOriginY = ay - anchorY
    emitView({
      center: {
        lat: worldYToLat(newOriginY + frameHeight / 2, nextZoom),
        lng: worldXToLng(newOriginX + width / 2, nextZoom),
      },
      zoom: nextZoom,
    })
  }, [view, width, frameHeight, toLatLng, emitView])

  const panByPixels = useCallback((dx: number, dy: number) => {
    emitView({
      center: {
        lat: worldYToLat(origin.y + frameHeight / 2 + dy, view.zoom),
        lng: worldXToLng(origin.x + width / 2 + dx, view.zoom),
      },
      zoom: view.zoom,
    })
  }, [origin, width, frameHeight, view.zoom, emitView])

  // --- Pointer handling: pan, click-to-pick, pinch-to-zoom -------------------
  const gesture = useRef({
    pointers: new Map<number, { x: number; y: number }>(),
    lastX: 0, lastY: 0, startX: 0, startY: 0,
    moved: 0, pinchDistance: 0, panning: false,
  })

  function localPoint(event: React.PointerEvent) {
    const rect = event.currentTarget.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!interactive && !canEditPin) return
    const point = localPoint(event)
    const state = gesture.current
    state.pointers.set(event.pointerId, point)
    if (state.pointers.size === 2) {
      const [a, b] = Array.from(state.pointers.values())
      state.pinchDistance = Math.hypot(a.x - b.x, a.y - b.y)
      state.panning = false
      return
    }
    state.lastX = point.x; state.lastY = point.y
    state.startX = point.x; state.startY = point.y
    state.moved = 0
    state.panning = interactive
    // Throws if the pointer has already been released; the gesture still works without capture.
    try { event.currentTarget.setPointerCapture(event.pointerId) } catch {}
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const state = gesture.current
    if (!state.pointers.has(event.pointerId)) return
    const point = localPoint(event)
    state.pointers.set(event.pointerId, point)

    if (state.pointers.size === 2 && interactive) {
      const [a, b] = Array.from(state.pointers.values())
      const distance = Math.hypot(a.x - b.x, a.y - b.y)
      if (state.pinchDistance > 0) {
        const ratio = distance / state.pinchDistance
        if (ratio > 1.35 || ratio < 0.74) {
          const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
          zoomAround(ratio > 1 ? 1 : -1, mid.x, mid.y)
          state.pinchDistance = distance
        }
      }
      return
    }

    if (!state.panning) return
    const dx = point.x - state.lastX
    const dy = point.y - state.lastY
    state.moved += Math.abs(dx) + Math.abs(dy)
    state.lastX = point.x; state.lastY = point.y
    if (dx || dy) panByPixels(-dx, -dy)
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const state = gesture.current
    const had = state.pointers.delete(event.pointerId)
    if (state.pointers.size < 2) state.pinchDistance = 0
    if (!had) return
    try { event.currentTarget.releasePointerCapture(event.pointerId) } catch {}

    // A press that barely moved is a click: drop the pin there.
    if (canEditPin && state.moved < CLICK_SLOP && event.type === 'pointerup') {
      const point = localPoint(event)
      if (point.x >= 0 && point.y >= 0 && point.x <= width && point.y <= frameHeight) {
        onPick?.(toLatLng(point.x, point.y))
      }
    }
    state.panning = false
  }

  // Plain wheel must keep scrolling the page — hijacking it traps the reader mid-form.
  // Ctrl/⌘ + wheel zooms, and a plain wheel over the map explains that once.
  useEffect(() => {
    const node = frameRef.current
    if (!node || !interactive) return
    let hintTimer: ReturnType<typeof setTimeout>
    const onWheel = (event: WheelEvent) => {
      if (!(event.ctrlKey || event.metaKey)) {
        setWheelHint(true)
        clearTimeout(hintTimer)
        hintTimer = setTimeout(() => setWheelHint(false), 1600)
        return
      }
      event.preventDefault()
      const rect = node.getBoundingClientRect()
      zoomAround(event.deltaY < 0 ? 1 : -1, event.clientX - rect.left, event.clientY - rect.top)
    }
    node.addEventListener('wheel', onWheel, { passive: false })
    return () => { node.removeEventListener('wheel', onWheel); clearTimeout(hintTimer) }
  }, [interactive, zoomAround])

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!interactive) return
    const step = event.shiftKey ? 200 : 60
    const moves: Record<string, [number, number]> = {
      ArrowUp: [0, -step], ArrowDown: [0, step], ArrowLeft: [-step, 0], ArrowRight: [step, 0],
    }
    if (moves[event.key]) {
      event.preventDefault()
      panByPixels(...moves[event.key])
      return
    }
    if (event.key === '+' || event.key === '=') { event.preventDefault(); zoomAround(1, width / 2, frameHeight / 2) }
    if (event.key === '-' || event.key === '_') { event.preventDefault(); zoomAround(-1, width / 2, frameHeight / 2) }
  }

  // --- Pin dragging ---------------------------------------------------------
  function handlePinPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!canEditPin) return
    event.stopPropagation()
    event.preventDefault()
    setDraggingPin(true)
    const frame = frameRef.current
    if (!frame) return
    const move = (moveEvent: PointerEvent) => {
      const rect = frame.getBoundingClientRect()
      onPick?.(toLatLng(
        clamp(moveEvent.clientX - rect.left, 0, rect.width),
        clamp(moveEvent.clientY - rect.top, 0, rect.height),
      ))
    }
    const up = () => {
      setDraggingPin(false)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
  }

  const markerPixel = marker ? toPixel(marker) : null
  const markerVisible = markerPixel
    && markerPixel.x >= -60 && markerPixel.x <= width + 60
    && markerPixel.y >= -80 && markerPixel.y <= frameHeight + 80

  return (
    <div
      ref={frameRef}
      className={`map-canvas ${interactive ? 'is-interactive' : ''} ${canEditPin ? 'is-editable' : ''} ${className}`}
      style={{ height }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
      onDoubleClick={event => {
        if (!interactive) return
        const rect = event.currentTarget.getBoundingClientRect()
        zoomAround(1, event.clientX - rect.left, event.clientY - rect.top)
      }}
      role={interactive ? 'application' : 'img'}
      aria-label={ariaLabel}
      tabIndex={interactive ? 0 : -1}
    >
      <div className="map-canvas-tiles">
        {tiles.map(tile => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={tile.key}
            src={tile.url}
            alt=""
            width={TILE_SIZE}
            height={TILE_SIZE}
            draggable={false}
            loading="eager"
            onLoad={() => setLoaded(current => {
              if (current.has(tile.url)) return current
              const next = new Set(current)
              next.add(tile.url)
              return next
            })}
            onError={event => { (event.currentTarget as HTMLImageElement).style.visibility = 'hidden' }}
            style={{
              position: 'absolute',
              left: tile.left,
              top: tile.top,
              width: TILE_SIZE,
              height: TILE_SIZE,
              opacity: loaded.has(tile.url) ? 1 : 0,
            }}
          />
        ))}
      </div>

      {markerVisible && markerPixel && (
        <div
          className={`map-canvas-pin ${draggingPin ? 'is-dragging' : ''} ${canEditPin ? 'is-draggable' : ''}`}
          style={{ left: markerPixel.x, top: markerPixel.y }}
          onPointerDown={handlePinPointerDown}
          role={canEditPin ? 'button' : undefined}
          aria-label={canEditPin ? 'اسحب الدبوس لضبط الموقع' : 'موقع المساحة'}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2c-3.87 0-7 3.13-7 7 0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
            />
            <circle cx="12" cy="9" r="2.6" fill="#fff" />
          </svg>
          <span className="map-canvas-pin-shadow" aria-hidden="true" />
        </div>
      )}

      {overlay && <div className="map-canvas-overlay">{overlay}</div>}

      {interactive && (
        <div className="map-canvas-zoom" dir="ltr">
          <button
            type="button"
            onClick={() => zoomAround(1, width / 2, frameHeight / 2)}
            disabled={view.zoom >= MAX_ZOOM}
            aria-label="تكبير الخريطة"
          >+</button>
          <button
            type="button"
            onClick={() => zoomAround(-1, width / 2, frameHeight / 2)}
            disabled={view.zoom <= MIN_ZOOM}
            aria-label="تصغير الخريطة"
          >−</button>
        </div>
      )}

      {wheelHint && (
        <div className="map-canvas-hint" role="status">
          استخدم Ctrl + عجلة الفأرة للتكبير
        </div>
      )}

      <a
        className="map-canvas-attribution"
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noreferrer noopener"
        onPointerDown={event => event.stopPropagation()}
      >
        © OpenStreetMap
      </a>
    </div>
  )
}
