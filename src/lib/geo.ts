/**
 * Geographic helpers shared by every map surface in the platform.
 *
 * The platform used to render maps through `openstreetmap.org/export/embed.html`
 * inside an <iframe>. That approach could not work correctly for picking a point:
 * the embed silently refits the requested bbox to the iframe's aspect ratio, so the
 * visible extent never matched what we asked for, and the picker converted clicks to
 * coordinates with a *linear* interpolation even though Web Mercator latitude is
 * logarithmic. Both errors compounded, so a click could land hundreds of metres from
 * where the seller pointed.
 *
 * Everything here is pure and framework-free so the projection can be tested directly.
 */

export const TILE_SIZE = 256

/** Web Mercator cannot represent the poles; this is the standard cutoff. */
export const MAX_LATITUDE = 85.05112878

export const MIN_ZOOM = 3
export const MAX_ZOOM = 19

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/** Total width/height of the world in pixels at a given zoom level. */
export function worldSize(zoom: number) {
  return TILE_SIZE * Math.pow(2, zoom)
}

export function lngToWorldX(lng: number, zoom: number) {
  return ((lng + 180) / 360) * worldSize(zoom)
}

export function latToWorldY(lat: number, zoom: number) {
  const clamped = clamp(lat, -MAX_LATITUDE, MAX_LATITUDE)
  const rad = (clamped * Math.PI) / 180
  const y = Math.log(Math.tan(rad) + 1 / Math.cos(rad))
  return (1 - y / Math.PI) * 0.5 * worldSize(zoom)
}

export function worldXToLng(x: number, zoom: number) {
  return (x / worldSize(zoom)) * 360 - 180
}

export function worldYToLat(y: number, zoom: number) {
  const n = Math.PI * (1 - (2 * y) / worldSize(zoom))
  return (Math.atan(Math.sinh(n)) * 180) / Math.PI
}

export type LatLng = { lat: number; lng: number }

export function isValidLatLng(value: unknown): value is LatLng {
  if (!value || typeof value !== 'object') return false
  const { lat, lng } = value as LatLng
  return (
    Number.isFinite(lat) && Number.isFinite(lng) &&
    Math.abs(lat) <= 90 && Math.abs(lng) <= 180 &&
    !(lat === 0 && lng === 0)
  )
}

/** Great-circle distance in metres — used to tell the seller how far they moved the pin. */
export function distanceMeters(a: LatLng, b: LatLng) {
  const R = 6371008.8
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

/** Six decimals ≈ 11 cm — more precision than a street address can justify. */
export function formatCoordinate(value: number) {
  return value.toFixed(6)
}

export function formatLatLng(point: LatLng) {
  return `${formatCoordinate(point.lat)}, ${formatCoordinate(point.lng)}`
}

/**
 * A single "open in maps" link for a space: by dropped pin when it has coordinates,
 * by address text otherwise. Returns null only when there is nothing at all to search.
 */
export function placeSearchUrl(input: { lat?: number | null; lng?: number | null; query?: string | null }) {
  const point = { lat: Number(input.lat), lng: Number(input.lng) }
  if (isValidLatLng(point)) {
    return `https://www.google.com/maps/search/?api=1&query=${point.lat},${point.lng}`
  }
  const query = (input.query || '').trim()
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : null
}

/** Deep links to the map apps a Saudi user is most likely to have installed. */
export function mapLinks(point: LatLng, label?: string) {
  const pair = `${point.lat},${point.lng}`
  const query = label ? `${encodeURIComponent(label)}` : ''
  return {
    google: `https://www.google.com/maps/search/?api=1&query=${pair}`,
    googleDirections: `https://www.google.com/maps/dir/?api=1&destination=${pair}${query ? `&destination_place_id=` : ''}`,
    apple: `https://maps.apple.com/?ll=${pair}&q=${query || pair}`,
    osm: `https://www.openstreetmap.org/?mlat=${point.lat}&mlon=${point.lng}#map=17/${point.lat}/${point.lng}`,
  }
}

/**
 * Pull coordinates out of anything a seller might paste: a Google Maps share link,
 * an OpenStreetMap permalink, a geo: URI, or a bare "lat, lng" pair.
 *
 * Ordering matters. `!3d…!4d…` is the place's actual pin and is checked before
 * `@lat,lng`, which is only the camera position and can sit far from the pin when the
 * user scrolled after searching.
 */
export function extractCoordinates(value: string): LatLng | null {
  const decoded = fullyDecode(value.trim())

  const patterns: RegExp[] = [
    ...LINK_PATTERNS,
    // "24.7111° N, 46.6734° E" — Google's "What's here?" / coordinate readout.
    /(-?\d{1,2}(?:\.\d+)?)\s*°?\s*([NSns])[,\s]+(-?\d{1,3}(?:\.\d+)?)\s*°?\s*([EWew])/,
    // A bare pair. Requires 3+ decimals so it cannot match a price, phone, or date.
    // Accepts a plain, Arabic (،) or ideographic comma, a slash, or whitespace.
    /(-?\d{1,2}\.\d{3,})\s*[,،/\s]\s*(-?\d{1,3}\.\d{3,})/,
  ]

  for (const pattern of patterns) {
    const match = decoded.match(pattern)
    if (!match) continue
    // The degree pattern has 4 groups (value, hemisphere, value, hemisphere).
    let lat: number, lng: number
    if (match.length >= 5 && /[NSns]/.test(match[2] || '')) {
      lat = Number(match[1]) * (/[Ss]/.test(match[2]) ? -1 : 1)
      lng = Number(match[3]) * (/[Ww]/.test(match[4]) ? -1 : 1)
    } else {
      lat = Number(match[1])
      lng = Number(match[2])
    }
    const candidate = { lat, lng }
    if (isValidLatLng(candidate)) return candidate
  }

  return null
}

/**
 * The first http(s) URL anywhere in a blob of text. Mobile "Share" wraps the link in a
 * sentence, and a single-line <input> strips the newline before it, so the scheme can end
 * up glued to the previous word ("…Googlehttps://…") — hence no leading word boundary.
 */
export function extractUrl(text: string): string | null {
  const match = text.match(/https?:\/\/[^\s<>"'\]}]+/i)
  if (!match) return null
  // Trim trailing sentence punctuation a URL never really ends with.
  return match[0].replace(/[.,;:!؟?)\]]+$/, '')
}

export type LocationInput =
  | { kind: 'coords'; point: LatLng }
  | { kind: 'url'; url: string }
  | { kind: 'text'; query: string }
  | { kind: 'empty' }

/**
 * Classify whatever the seller typed or pasted into the one location field, so the UI
 * has a single place to decide: use these coordinates / resolve this link / search this text.
 */
export function parseLocationInput(raw: string): LocationInput {
  const value = raw.trim()
  if (!value) return { kind: 'empty' }

  const point = extractCoordinates(value)
  if (point) return { kind: 'coords', point }

  const url = extractUrl(value)
  if (url) return { kind: 'url', url }
  if (/^geo:/i.test(value)) return { kind: 'url', url: value }

  return { kind: 'text', query: value }
}

/**
 * Same as `extractCoordinates` but without the bare "lat, lng" fallback.
 *
 * Use this when scanning untrusted free-form text such as a fetched HTML body,
 * where any two decimal numbers near each other would otherwise be mistaken for
 * a coordinate pair.
 */
export function extractCoordinatesStrict(value: string): LatLng | null {
  const decoded = fullyDecode(value)
  for (const pattern of LINK_PATTERNS) {
    const match = decoded.match(pattern)
    if (!match) continue
    const candidate = { lat: Number(match[1]), lng: Number(match[2]) }
    if (isValidLatLng(candidate)) return candidate
  }
  return null
}

/**
 * Coordinates found in a fetched Google Maps page, tagged by how much they can be trusted.
 *
 * `pin` is the place itself. `viewport` is only where Google happened to point the camera,
 * which for a server-side fetch is derived from the *server's* IP rather than the place —
 * that is how a Riyadh link used to come back as Loudoun County, Virginia, the region our
 * host runs in. Callers must never accept a `viewport` point without checking it lands
 * somewhere the platform actually operates.
 */
export type HtmlCoordinates = { point: LatLng; source: 'pin' | 'viewport' }

/**
 * Coordinates embedded in the markup of a Google Maps page, for share links whose URL
 * never carries the pin.
 *
 * Ordering is by trustworthiness, strongest first: the static-map image Google renders for
 * the place is centred on the place, so it is as good as `!3d…!4d…`; the initialization
 * state's camera position is a guess and is reported as such.
 */
export function extractCoordinatesFromHtml(html: string): HtmlCoordinates | null {
  const exact = extractCoordinatesStrict(html)
  if (exact) return { point: exact, source: 'pin' }

  // The og:image/preview thumbnail is a Static Maps call centred on the place itself.
  const staticMap = html.match(
    /staticmap[^"'<>]*?[?&](?:center|markers)=(?:[^"'<>&]*?\|)?(-?\d{1,2}\.\d+)(?:%2C|,)(-?\d{1,3}\.\d+)/i,
  )
  if (staticMap) {
    const candidate = { lat: Number(staticMap[1]), lng: Number(staticMap[2]) }
    if (isValidLatLng(candidate)) return { point: candidate, source: 'pin' }
  }

  // Camera position — longitude before latitude. Geo-IP derived when Google could not
  // resolve the place, so it is the last thing tried and never trusted on its own.
  const viewport = html.match(
    /APP_INITIALIZATION_STATE\s*=\s*\[\[\[[-\d.eE+]+,\s*(-?\d+\.\d+),\s*(-?\d+\.\d+)/,
  )
  if (viewport) {
    const candidate = { lat: Number(viewport[2]), lng: Number(viewport[1]) }
    if (isValidLatLng(candidate)) return { point: candidate, source: 'viewport' }
  }
  return null
}

/**
 * The place name Google keeps in the path of a share link — `/maps/place/<name>/…`.
 *
 * When a link yields no trustworthy coordinates the name is still there, and geocoding it
 * against Saudi Arabia beats showing the seller a pin on another continent.
 */
export function extractPlaceName(url: string): string | null {
  const match = url.match(/\/maps\/(?:place|search|dir)\/([^/@?#]+)/)
  if (!match) return null
  const name = fullyDecode(match[1]).replace(/\+/g, ' ').trim()
  // A name that is really just the coordinates carries nothing extra to search for.
  if (!name || name.length < 3 || /^[-\d.,\s°NSEWnsew]+$/.test(name)) return null
  return name
}

/**
 * The area the platform serves — Saudi Arabia plus enough margin to cover its borders.
 *
 * Used as a sanity gate on coordinates we only half-trust. An exact pin is honoured
 * wherever it lands; a guessed one outside these bounds is discarded rather than shown.
 */
export const SERVICE_AREA_BOUNDS = { minLat: 15.5, maxLat: 33.0, minLng: 34.0, maxLng: 56.5 }

export function isWithinServiceArea(point: LatLng) {
  return (
    point.lat >= SERVICE_AREA_BOUNDS.minLat && point.lat <= SERVICE_AREA_BOUNDS.maxLat &&
    point.lng >= SERVICE_AREA_BOUNDS.minLng && point.lng <= SERVICE_AREA_BOUNDS.maxLng
  )
}

function fullyDecode(value: string) {
  let decoded = value
  // Share links are frequently double-encoded (%252C for the separating comma).
  for (let i = 0; i < 3; i += 1) {
    try {
      const next = decodeURIComponent(decoded)
      if (next === decoded) break
      decoded = next
    } catch { break }
  }
  return decoded
}

/** Patterns that only match inside a recognisable map link, safe for body scanning. */
const LINK_PATTERNS: RegExp[] = [
  // Google Maps place pin — the precise location behind a share link.
  /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/,
  // Google Maps camera position.
  /@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?),\s*[\d.]+[zm]/,
  /@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
  // Common query parameters across Google/Apple/Bing.
  /[?&#](?:q|query|ll|sll|center|destination|viewpoint|daddr|saddr|cp)=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
  // OpenStreetMap marker parameters.
  /[?&]mlat=(-?\d+(?:\.\d+)?)[\s\S]{0,120}?[?&]mlon=(-?\d+(?:\.\d+)?)/,
  // OpenStreetMap permalink hash.
  /#map=[\d.]+\/(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)/,
  // geo: URI, as produced by "share location" on Android.
  /geo:(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
]

/** Approximate city centres, used only to frame the map before a pin exists. */
export const CITY_CENTERS: Record<string, LatLng> = {
  'الرياض': { lat: 24.7136, lng: 46.6753 },
  'جدة': { lat: 21.5433, lng: 39.1728 },
  'مكة المكرمة': { lat: 21.3891, lng: 39.8579 },
  'المدينة المنورة': { lat: 24.5247, lng: 39.5692 },
  'الدمام': { lat: 26.4207, lng: 50.0888 },
  'الخبر': { lat: 26.2172, lng: 50.1971 },
  'الظهران': { lat: 26.2361, lng: 50.0393 },
  'تبوك': { lat: 28.3838, lng: 36.5550 },
  'بريدة': { lat: 26.3260, lng: 43.9750 },
  'حائل': { lat: 27.5114, lng: 41.6900 },
  'الطائف': { lat: 21.2703, lng: 40.4158 },
  'أبها': { lat: 18.2164, lng: 42.5053 },
  'خميس مشيط': { lat: 18.3060, lng: 42.7297 },
  'نجران': { lat: 17.4924, lng: 44.1277 },
  'جازان': { lat: 16.8892, lng: 42.5511 },
  'ينبع': { lat: 24.0895, lng: 38.0618 },
  'الجبيل': { lat: 27.0046, lng: 49.6605 },
  'القطيف': { lat: 26.5205, lng: 49.9975 },
  'الأحساء': { lat: 25.3838, lng: 49.5860 },
  'عنيزة': { lat: 26.0837, lng: 43.9930 },
}

/** Centre of Saudi Arabia — the fallback when no city has been chosen yet. */
export const SAUDI_CENTER: LatLng = { lat: 24.0, lng: 45.0 }

function normalizeCityName(value: string) {
  return value
    .replace(/[ً-ْ]/g, '')       // strip diacritics
    .replace(/[إأآا]/g, 'ا')                // unify alef forms
    .replace(/ة/g, 'ه')                     // unify taa marbuta
    .replace(/\s+/g, ' ')
    .replace(/^(مدينة|محافظة|منطقة)\s+/, '')
    .trim()
}

/** Tolerant city lookup — sellers type "مدينة الخبر" or "الخُبر" and still expect a match. */
export function lookupCityCenter(city: string | null | undefined): LatLng | null {
  if (!city) return null
  if (CITY_CENTERS[city]) return CITY_CENTERS[city]

  const target = normalizeCityName(city)
  if (!target) return null

  for (const [name, center] of Object.entries(CITY_CENTERS)) {
    const candidate = normalizeCityName(name)
    if (candidate === target || target.includes(candidate) || candidate.includes(target)) {
      return center
    }
  }
  return null
}
