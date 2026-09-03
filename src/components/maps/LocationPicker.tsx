'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import MapCanvas, { MapView } from './MapCanvas'
import {
  LatLng, SAUDI_CENTER, formatCoordinate,
  formatLatLng, isValidLatLng, lookupCityCenter, mapLinks, parseLocationInput,
} from '@/lib/geo'

export type ResolvedAddress = {
  city: string | null
  district: string | null
  street: string | null
  postalCode: string | null
}

type Props = {
  value: LatLng | null
  onChange: (point: LatLng) => void
  /** The city chosen elsewhere in the form — frames the map before a pin exists. */
  city?: string
  /** Offered to the seller as a one-click fill of the address fields. */
  onUseAddress?: (address: ResolvedAddress) => void
  height?: number
}

type SearchResult = {
  label: string
  lat: number
  lng: number
  city: string | null
  district: string | null
  street: string | null
  postalCode: string | null
}

export default function LocationPicker({ value, onChange, city, onUseAddress, height = 380 }: Props) {
  const fallbackCenter = lookupCityCenter(city) || SAUDI_CENTER
  const [view, setView] = useState<MapView>(() => ({
    center: value || fallbackCenter,
    zoom: value ? 16 : lookupCityCenter(city) ? 12 : 5,
  }))

  const [query, setQuery] = useState('')
  const [search, setSearch] = useState<{ query: string; results: SearchResult[] }>({ query: '', results: [] })
  const [resolving, setResolving] = useState(false)
  const [message, setMessage] = useState<{ tone: 'error' | 'success' | 'info'; text: string } | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const resolvedRef = useRef<string>('')   // the last link/coords text we already acted on
  const [addressEntry, setAddressEntry] = useState<{ key: string; data: ResolvedAddress & { label: string } } | null>(null)
  const [addressLoading, setAddressLoading] = useState(false)
  const [locating, setLocating] = useState(false)
  const [manualOpen, setManualOpen] = useState(false)
  const [manual, setManual] = useState({ lat: '', lng: '' })

  // Follow the city selection only while no pin exists — once the seller has placed a
  // precise point, changing the city text must never move their pin. Adjusting during
  // render (rather than in an effect) keeps the map from painting the old city first.
  const hasPin = isValidLatLng(value)
  const [lastCity, setLastCity] = useState(city)
  if (city !== lastCity) {
    setLastCity(city)
    if (!hasPin) {
      const center = lookupCityCenter(city)
      if (center) setView({ center, zoom: 12 })
    }
  }

  /** Move the pin and bring the map to it. Used by search, links, and geolocation. */
  const placePin = useCallback((point: LatLng, zoom = 17) => {
    onChange(point)
    setView({ center: point, zoom })
  }, [onChange])

  // --- Smart input: one box that takes a pasted map link, raw coordinates, or an address.
  const parsed = parseLocationInput(query)
  // Only free text is searched as it is typed; a link or coordinates are acted on directly.
  const searchText = parsed.kind === 'text' && parsed.query.length >= 3 ? parsed.query : ''

  useEffect(() => {
    if (!searchText) return
    let cancelled = false
    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q: searchText })
        if (city) params.set('city', city)
        const response = await fetch(`/api/maps/search?${params}`)
        const data = await response.json()
        if (!cancelled) {
          setSearch({ query: searchText, results: Array.isArray(data.results) ? data.results : [] })
        }
      } catch {
        if (!cancelled) setSearch({ query: searchText, results: [] })
      }
    }, 450)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [searchText, city])

  // Tying the results to the query they came from means a stale list can never be shown
  // against a newer query, and the spinner needs no state of its own.
  const results = useMemo(
    () => (searchText && search.query === searchText ? search.results : []),
    [searchText, search],
  )
  const searching = Boolean(searchText) && search.query !== searchText

  const resolveLink = useCallback(async (url: string) => {
    // `resolving` drives the button's "جارٍ التحديد..." state; message is set only on a
    // terminal result so there is never a transient message to get stuck.
    setResolving(true)
    setMessage(null)
    try {
      const response = await fetch('/api/maps/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await response.json().catch(() => ({}))
      if (response.ok && isValidLatLng({ lat: data.lat, lng: data.lng })) {
        placePin({ lat: data.lat, lng: data.lng }, data.approximate ? 15 : 17)
        setQuery('')
        setMessage(data.approximate
          ? { tone: 'info', text: 'حددنا الموقع تقريبًا من الرابط — اسحب الدبوس إلى مكان المساحة بالضبط.' }
          : { tone: 'success', text: 'تم تحديد الموقع من الرابط. تحقق منه على الخريطة بالأسفل.' })
      } else {
        setMessage({
          tone: 'error',
          text: data.error
            || 'لم نتمكن من قراءة هذا الرابط. افتح الموقع في خرائط Google، اضغط على الدبوس، وانسخ الإحداثيات الظاهرة (مثل 24.7136, 46.6753) والصقها هنا — أو حدّد الموقع على الخريطة بالأسفل.',
        })
      }
    } catch {
      setMessage({ tone: 'error', text: 'تعذر الاتصال بالخادم. الصق الإحداثيات أو حدّد الموقع على الخريطة بالأسفل.' })
    } finally {
      setResolving(false)
    }
  }, [placePin])

  const chooseResult = useCallback((result: SearchResult) => {
    placePin({ lat: result.lat, lng: result.lng })
    setQuery('')
    setMessage({ tone: 'success', text: 'تم تحديد الموقع. اسحب الدبوس لضبطه بدقة.' })
  }, [placePin])

  /** Act on whatever is in the field: coordinates → place, link → resolve, text → search. */
  const runInput = useCallback((rawValue: string) => {
    const p = parseLocationInput(rawValue)
    if (p.kind === 'empty') {
      setMessage({ tone: 'error', text: 'الصق رابط الموقع أو الإحداثيات، أو اكتب اسم الحي أو معلمًا قريبًا.' })
      return
    }
    if (p.kind === 'coords') {
      resolvedRef.current = rawValue.trim()
      placePin(p.point)
      setQuery('')
      setMessage({ tone: 'success', text: 'تم تحديد الموقع من الإحداثيات. تحقق منه على الخريطة بالأسفل.' })
      return
    }
    if (p.kind === 'url') {
      resolvedRef.current = rawValue.trim()
      resolveLink(p.url)
      return
    }
    if (results.length > 0) {
      chooseResult(results[0])
      return
    }
    setMessage({ tone: 'info', text: 'لا توجد نتائج مطابقة. جرّب صياغة أخرى أو حدّد الموقع على الخريطة بالأسفل.' })
  }, [placePin, resolveLink, chooseResult, results])

  function submitQuery() {
    setMessage(null)
    runInput(query)
  }

  // Auto-act when the seller pastes a link or coordinates — no button press needed.
  // Reading the field value after the paste settles is the reliable way to get the
  // full text (a paste can replace a selection, prepend, or append).
  function handlePaste() {
    window.setTimeout(() => {
      const text = inputRef.current?.value ?? ''
      const p = parseLocationInput(text)
      if ((p.kind === 'url' || p.kind === 'coords') && text.trim() !== resolvedRef.current) {
        runInput(text)
      }
    }, 0)
  }

  function useMyLocation() {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setMessage({ tone: 'error', text: 'المتصفح لا يدعم تحديد الموقع.' })
      return
    }
    setLocating(true)
    setMessage(null)
    navigator.geolocation.getCurrentPosition(
      position => {
        setLocating(false)
        placePin({ lat: position.coords.latitude, lng: position.coords.longitude }, 17)
        setMessage({ tone: 'success', text: 'تم تحديد موقعك الحالي. اسحب الدبوس إن لزم.' })
      },
      error => {
        setLocating(false)
        setMessage({
          tone: 'error',
          text: error.code === error.PERMISSION_DENIED
            ? 'تم رفض إذن الموقع. فعّله من إعدادات المتصفح أو حدّد الموقع يدويًا.'
            : 'تعذر تحديد موقعك الحالي. حدّد الموقع على الخريطة.',
        })
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  }

  // --- Address behind the pin ----------------------------------------------
  // Keyed by the point it describes, so the address on screen always belongs to the pin
  // currently shown rather than to wherever the pin used to be.
  const addressKey = isValidLatLng(value) ? `${value.lat.toFixed(5)},${value.lng.toFixed(5)}` : ''
  const address = addressEntry && addressEntry.key === addressKey ? addressEntry.data : null

  useEffect(() => {
    if (!addressKey) return
    const [lat, lng] = addressKey.split(',')
    let cancelled = false
    const timer = setTimeout(async () => {
      setAddressLoading(true)
      try {
        const response = await fetch(`/api/maps/reverse?lat=${lat}&lng=${lng}`)
        const data = await response.json()
        if (!cancelled && data.result) setAddressEntry({ key: addressKey, data: data.result })
      } catch {
        /* leave the previous address in place; the panel simply shows coordinates */
      } finally {
        if (!cancelled) setAddressLoading(false)
      }
    }, 700)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [addressKey])

  function applyManual() {
    const point = { lat: Number(manual.lat), lng: Number(manual.lng) }
    if (!isValidLatLng(point)) {
      setMessage({ tone: 'error', text: 'أدخل خط عرض وخط طول صحيحين.' })
      return
    }
    placePin(point)
    setMessage({ tone: 'success', text: 'تم تحديث الموقع من الإحداثيات.' })
  }

  const links = value && isValidLatLng(value) ? mapLinks(value) : null

  return (
    <div className="space-y-3">
      {/* One field for both a pasted link and a place search. */}
      <div className="rounded-2xl border border-[#D8D1C7] bg-white p-4">
        <label htmlFor="location-search" className="block text-sm font-bold text-[#1B1B1B] mb-1">
          الصق رابط الموقع من خرائط Google
        </label>
        <p className="text-xs text-[#5F6764] mb-2.5">
          افتح مكان مساحتك في خرائط Google، اضغط «مشاركة» ← «نسخ الرابط»، ثم الصقه هنا — سيُحدَّد الموقع فورًا.
          يمكنك أيضًا لصق الإحداثيات مباشرة، أو كتابة اسم الحي للبحث.
        </p>
        <div className="relative">
          <div className="flex gap-2">
            <input
              id="location-search"
              ref={inputRef}
              value={query}
              onChange={event => { setQuery(event.target.value); setMessage(null) }}
              onPaste={handlePaste}
              onKeyDown={event => {
                if (event.key === 'Enter') { event.preventDefault(); submitQuery() }
                // Dismiss the list but keep what was typed.
                if (event.key === 'Escape') setSearch({ query: '', results: [] })
              }}
              placeholder="الصق الرابط هنا، أو: 24.7136, 46.6753 — أو: حي الملقا الرياض"
              className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border border-[#D8D1C7] text-sm focus:outline-none focus:border-[#0E3B34]"
              autoComplete="off"
              dir="auto"
            />
            <button
              type="button"
              onClick={submitQuery}
              disabled={resolving}
              className="shrink-0 px-4 py-2.5 rounded-xl bg-[#0E3B34] text-white text-sm font-semibold hover:bg-[#092C27] transition-colors disabled:opacity-60"
            >
              {resolving ? 'جارٍ التحديد...' : 'تحديد'}
            </button>
          </div>

          {(searching || results.length > 0) && (
            <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-[#D8D1C7] bg-white shadow-lg">
              {searching && (
                <p className="px-4 py-3 text-xs text-[#5F6764]">جارٍ البحث...</p>
              )}
              {!searching && results.map((result, index) => (
                <button
                  key={`${result.lat}-${result.lng}-${index}`}
                  type="button"
                  onClick={() => chooseResult(result)}
                  className="block w-full border-b border-[#EFE9DE] px-4 py-2.5 text-start text-xs leading-relaxed text-[#3F4B47] last:border-b-0 hover:bg-[#F5F1E8]"
                >
                  {result.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={useMyLocation}
            disabled={locating}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#0E3B34]/20 bg-[#F5F1E8] px-3 py-2 text-xs font-bold text-[#0E3B34] hover:bg-[#0E3B34]/10 transition-colors disabled:opacity-60"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
              <path strokeLinecap="round" d="M12 2v3m0 14v3M2 12h3m14 0h3" />
            </svg>
            {locating ? 'جارٍ التحديد...' : 'استخدام موقعي الحالي'}
          </button>
          <button
            type="button"
            onClick={() => setManualOpen(open => !open)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#D8D1C7] bg-white px-3 py-2 text-xs font-bold text-[#5F6764] hover:border-[#0E3B34]/40 transition-colors"
          >
            إدخال الإحداثيات يدويًا
          </button>
        </div>

        {manualOpen && (
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <input
              value={manual.lat}
              onChange={event => setManual(current => ({ ...current, lat: event.target.value }))}
              placeholder="خط العرض 24.7136"
              dir="ltr"
              className="w-full rounded-lg border border-[#D8D1C7] px-3 py-2 text-xs focus:outline-none focus:border-[#0E3B34]"
            />
            <input
              value={manual.lng}
              onChange={event => setManual(current => ({ ...current, lng: event.target.value }))}
              placeholder="خط الطول 46.6753"
              dir="ltr"
              className="w-full rounded-lg border border-[#D8D1C7] px-3 py-2 text-xs focus:outline-none focus:border-[#0E3B34]"
            />
            <button
              type="button"
              onClick={applyManual}
              className="rounded-lg bg-[#0E3B34] px-4 py-2 text-xs font-bold text-white hover:bg-[#092C27]"
            >
              تطبيق
            </button>
          </div>
        )}

        {resolving ? (
          <p className="mt-2.5 flex items-center gap-2 text-xs font-semibold text-[#5F6764]">
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#0E3B34]/25 border-t-[#0E3B34]" />
            جارٍ قراءة الرابط وتحديد الموقع...
          </p>
        ) : message ? (
          <p className={`mt-2.5 text-xs font-semibold ${
            message.tone === 'error' ? 'text-[#B44A3C]'
              : message.tone === 'success' ? 'text-emerald-700'
              : 'text-[#5F6764]'
          }`}>
            {message.text}
          </p>
        ) : null}
      </div>

      <MapCanvas
        center={view.center}
        zoom={view.zoom}
        marker={value}
        onPick={point => { onChange(point); setMessage(null) }}
        onViewChange={setView}
        height={height}
        ariaLabel="اختر موقع المساحة على الخريطة"
        overlay={
          <span className="inline-block rounded-lg bg-white/95 px-3 py-1.5 text-[11px] font-bold text-[#0E3B34] shadow-sm">
            {hasPin ? 'اسحب الدبوس أو اضغط لتحريكه' : 'اضغط على الخريطة لتحديد الموقع'}
          </span>
        }
      />

      {/* Confirmation panel: coordinates, the address behind them, and a way to verify. */}
      <div className="rounded-2xl border border-[#D8D1C7] bg-[#F5F1E8] p-4">
        {hasPin && value ? (
          <>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#5F6764] mb-1">الموقع المحدد</p>
                <p className="text-sm font-semibold text-[#1B1B1B]" dir="ltr">{formatLatLng(value)}</p>
                {addressLoading && <p className="mt-1 text-xs text-[#5F6764]">جارٍ جلب العنوان...</p>}
                {!addressLoading && address?.label && (
                  <p className="mt-1 text-xs leading-relaxed text-[#3F4B47]">{address.label}</p>
                )}
              </div>
              {links && (
                <a
                  href={links.google}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="shrink-0 rounded-xl border border-[#0E3B34]/15 bg-white px-4 py-2 text-xs font-semibold text-[#0E3B34] hover:bg-[#0E3B34]/5 transition-colors"
                >
                  تحقق في خرائط Google
                </a>
              )}
            </div>

            {onUseAddress && address && (address.city || address.district || address.street || address.postalCode) && (
              <button
                type="button"
                onClick={() => onUseAddress(address)}
                className="mt-3 w-full rounded-xl border border-dashed border-[#0E3B34]/35 bg-white px-4 py-2.5 text-xs font-bold text-[#0E3B34] hover:bg-[#0E3B34]/5 transition-colors"
              >
                تعبئة حقول العنوان من هذا الموقع
              </button>
            )}
          </>
        ) : (
          <p className="text-xs font-semibold text-[#5F6764]">
            لم يتم تحديد موقع بعد — ابحث بالأعلى أو اضغط على الخريطة لوضع الدبوس.
          </p>
        )}
      </div>
    </div>
  )
}

export { formatCoordinate }
