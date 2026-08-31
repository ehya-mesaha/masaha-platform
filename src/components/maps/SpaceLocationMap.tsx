'use client'

import { useState } from 'react'
import MapCanvas from './MapCanvas'
import { LatLng, formatLatLng, isValidLatLng, mapLinks } from '@/lib/geo'

type Props = {
  latitude?: number | null
  longitude?: number | null
  /** Written out under the map and used for the fallback search when there is no pin. */
  address?: string
  city?: string | null
  /** Show the raw coordinates and a copy button (seller and admin views). */
  showCoordinates?: boolean
  height?: number
  className?: string
}

/**
 * Read-only map for a space. Used by the public space page, the seller's own space
 * view, and the admin review screen so all three show the location identically.
 *
 * When a space has no coordinates the map is replaced by an address card rather than a
 * misleading pin — an empty map centred on a city was previously indistinguishable
 * from a real, precisely-placed one.
 */
export default function SpaceLocationMap({
  latitude, longitude, address, city, showCoordinates = false, height = 300, className = '',
}: Props) {
  const [copied, setCopied] = useState(false)
  const point: LatLng = { lat: Number(latitude), lng: Number(longitude) }
  const hasPin = isValidLatLng(point)

  const links = hasPin
    ? mapLinks(point, address)
    : {
        google: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || city || '')}`,
        googleDirections: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address || city || '')}`,
        apple: `https://maps.apple.com/?q=${encodeURIComponent(address || city || '')}`,
        osm: `https://www.openstreetmap.org/search?query=${encodeURIComponent(address || city || '')}`,
      }

  async function copyCoordinates() {
    if (!hasPin) return
    try {
      await navigator.clipboard.writeText(`${point.lat}, ${point.lng}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard unavailable — the value is on screen anyway */ }
  }

  const writtenAddress = address || city || ''

  return (
    <div className={className}>
      {hasPin ? (
        <MapCanvas
          center={point}
          zoom={16}
          marker={point}
          height={height}
          ariaLabel={`موقع ${address || 'المساحة'} على الخريطة`}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-[#D8D1C7] bg-[#F5F1E8] p-5 text-center">
          <p className="text-sm font-bold text-[#3F4B47]">
            {writtenAddress ? 'لم يحدد صاحب المساحة موقعًا دقيقًا' : 'الموقع غير متوفر'}
          </p>
          {writtenAddress && <p className="mt-1 text-xs text-[#5F6764]">{writtenAddress}</p>}
        </div>
      )}

      {address && hasPin && (
        <p className="mt-3 text-xs leading-relaxed text-[#5F6764]">{address}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={links.googleDirections}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#0E3B34] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#092C27]"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.4 2.3a1 1 0 01-1.4-.9V5.6a1 1 0 01.6-.9L9 2m0 18l6-3m-6 3V2m6 15l5.4 2.3a1 1 0 001.4-.9V2.6a1 1 0 00-.6-.9L15 -1m0 18V-1m0 0L9 2" />
          </svg>
          الاتجاهات
        </a>
        <a
          href={links.google}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center justify-center rounded-xl border border-[#0E3B34]/20 bg-white px-4 py-2.5 text-sm font-semibold text-[#0E3B34] transition-colors hover:bg-[#0E3B34]/5"
        >
          فتح في الخرائط
        </a>
      </div>

      {showCoordinates && hasPin && (
        <button
          type="button"
          onClick={copyCoordinates}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#D8D1C7] bg-white px-3 py-2 text-xs font-semibold text-[#5F6764] transition-colors hover:border-[#0E3B34]/40"
          dir="ltr"
        >
          <span>{formatLatLng(point)}</span>
          <span className="text-[#0E3B34]">{copied ? '✓' : '⧉'}</span>
        </button>
      )}
    </div>
  )
}
