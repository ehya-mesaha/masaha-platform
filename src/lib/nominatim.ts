/**
 * Thin server-side wrapper around OpenStreetMap's Nominatim geocoder.
 *
 * Nominatim's usage policy requires a User-Agent that identifies the application and
 * discourages bursts of traffic, so every call goes through the server (never the
 * browser) and responses are cached at the edge.
 */

const NOMINATIM = 'https://nominatim.openstreetmap.org'

const HEADERS = {
  'User-Agent': 'EhyaMasaha/1.0 (https://ehyamesaha.sa)',
  'Accept': 'application/json',
  'Accept-Language': 'ar,en;q=0.8',
}

export type GeocodeResult = {
  label: string
  lat: number
  lng: number
  city: string | null
  district: string | null
  street: string | null
  postalCode: string | null
}

type NominatimAddress = {
  road?: string
  pedestrian?: string
  neighbourhood?: string
  suburb?: string
  quarter?: string
  city?: string
  town?: string
  village?: string
  state?: string
  postcode?: string
}

type NominatimPlace = {
  lat: string
  lon: string
  display_name?: string
  name?: string
  address?: NominatimAddress
}

function toResult(place: NominatimPlace): GeocodeResult | null {
  const lat = Number(place.lat)
  const lng = Number(place.lon)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null

  const address = place.address || {}
  return {
    label: place.display_name || place.name || `${lat}, ${lng}`,
    lat,
    lng,
    city: address.city || address.town || address.village || null,
    district: address.neighbourhood || address.suburb || address.quarter || null,
    street: address.road || address.pedestrian || null,
    postalCode: address.postcode || null,
  }
}

async function runSearch(query: string, limit: number): Promise<GeocodeResult[]> {
  const url = new URL(`${NOMINATIM}/search`)
  url.searchParams.set('q', query)
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('limit', String(limit))
  url.searchParams.set('countrycodes', 'sa')
  url.searchParams.set('accept-language', 'ar')

  const response = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(9000) })
  if (!response.ok) throw new Error(`nominatim search failed: ${response.status}`)

  const places = (await response.json()) as NominatimPlace[]
  return places.map(toResult).filter((item): item is GeocodeResult => item !== null)
}

/**
 * Nominatim matches against indexed place names, so the administrative words Saudis
 * naturally type are treated as part of the name and kill the match: "حي الملقا الرياض"
 * returns nothing while "الملقا الرياض" returns three results. Strip those words so the
 * way people actually describe a location still finds it.
 */
function relaxQuery(query: string) {
  return query
    .replace(/(^|\s)(حي|أحياء|مدينة|محافظة|منطقة|ضاحية|مخطط)(\s|$)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Free-text search, biased to Saudi Arabia since that is the platform's market.
 *
 * Falls back progressively — relaxed wording, then the wording plus the city already
 * chosen in the form — but only when the previous attempt found nothing, to stay inside
 * Nominatim's usage policy.
 */
export async function searchPlaces(query: string, city?: string, limit = 6): Promise<GeocodeResult[]> {
  const attempts = [query]

  const relaxed = relaxQuery(query)
  if (relaxed && relaxed !== query) attempts.push(relaxed)

  const withCity = city?.trim()
  if (withCity && !query.includes(withCity)) {
    attempts.push(`${relaxed || query} ${withCity}`)
  }

  for (const attempt of attempts) {
    if (!attempt) continue
    const results = await runSearch(attempt, limit)
    if (results.length > 0) return results
  }
  return []
}

/** Address for a point — shown under the pin so the seller can confirm it is right. */
export async function reverseGeocode(lat: number, lng: number): Promise<GeocodeResult | null> {
  const url = new URL(`${NOMINATIM}/reverse`)
  url.searchParams.set('lat', String(lat))
  url.searchParams.set('lon', String(lng))
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('zoom', '18')
  url.searchParams.set('accept-language', 'ar')

  const response = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(9000) })
  if (!response.ok) throw new Error(`nominatim reverse failed: ${response.status}`)

  const place = (await response.json()) as NominatimPlace & { error?: string }
  if (place.error) return null
  return toResult(place)
}
