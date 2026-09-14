import { NextRequest, NextResponse } from 'next/server'
import {
  extractCoordinates, extractCoordinatesFromHtml, extractPlaceName,
  isValidLatLng, isWithinServiceArea,
} from '@/lib/geo'
import { searchPlaces } from '@/lib/nominatim'

/**
 * Turns a pasted map link into coordinates.
 *
 * Short links (maps.app.goo.gl, g.co, share.google…) carry no coordinates at all —
 * they have to be followed to their destination first. Google also serves non-browser
 * clients a consent interstitial instead of the real page, and for some share links the
 * coordinates never reach the final URL and only appear in the HTML body, so all three
 * are handled here rather than leaving the browser to guess.
 *
 * The one thing this must never do is hand back Google's *fallback* viewport. When Google
 * cannot resolve a link for a server-side client it still renders a map — centred on the
 * requesting IP. Our host runs in Ashburn, Virginia, so every unresolved Riyadh link came
 * back as a pin in Loudoun County. Anything short of the place's own pin is therefore
 * checked against the area the platform serves, and a link that fails that check falls
 * back to geocoding the place *name* out of the URL against Saudi Arabia instead.
 */

const ALLOWED_HOSTS = new Set([
  'maps.app.goo.gl', 'goo.gl', 'g.co', 'share.google',
  'maps.google.com', 'www.google.com', 'google.com',
  'maps.google.com.sa', 'www.google.com.sa', 'google.com.sa',
  'openstreetmap.org', 'www.openstreetmap.org', 'osm.org',
  'maps.apple.com',
])

const MAX_BODY_BYTES = 600_000

function isAllowedHost(hostname: string) {
  return ALLOWED_HOSTS.has(hostname)
    || /(^|\.)google\.(com|com\.sa|com\.eg|ae|sa)$/.test(hostname)
}

async function fetchPage(url: URL) {
  const response = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
    headers: {
      // A real browser UA — Google serves short links a bare redirect stub otherwise.
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      // Ask Google for the Saudi edition of the page; its unresolved fallback viewport
      // follows the regional edition rather than the datacentre it is served from.
      'Accept-Language': 'ar-SA,ar;q=0.9,en;q=0.6',
    },
    signal: AbortSignal.timeout(9000),
  })
  return response
}

/** Geocode the place name Google left in the URL, restricted to Saudi Arabia. */
async function geocodePlaceName(url: string) {
  const name = extractPlaceName(url)
  if (!name) return null
  try {
    const [best] = await searchPlaces(name, undefined, 1)
    if (!best) return null
    const point = { lat: best.lat, lng: best.lng }
    return isValidLatLng(point) ? { point, label: best.label } : null
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const raw = typeof body.url === 'string' ? body.url.trim() : ''
    if (!raw) {
      return NextResponse.json({ error: 'الرابط مطلوب' }, { status: 400 })
    }

    // The link may already contain the coordinates — no network call needed.
    const direct = extractCoordinates(raw)
    if (direct) {
      return NextResponse.json({ url: raw, lat: direct.lat, lng: direct.lng })
    }

    let input: URL
    try {
      input = new URL(raw)
    } catch {
      return NextResponse.json({ error: 'رابط غير صالح' }, { status: 400 })
    }

    if (input.protocol !== 'https:' || !isAllowedHost(input.hostname)) {
      return NextResponse.json(
        { error: 'رابط غير مدعوم. استخدم رابطًا من خرائط Google أو OpenStreetMap.' },
        { status: 400 },
      )
    }

    let response = await fetchPage(input)
    let resolved = new URL(response.url)

    // Google redirects non-browser requests through a consent screen or a captcha wall;
    // the real destination survives in the `continue` parameter.
    if (resolved.hostname.startsWith('consent.') || resolved.pathname.startsWith('/sorry')) {
      const continueUrl = resolved.searchParams.get('continue')
      if (continueUrl) {
        try {
          response = await fetchPage(new URL(continueUrl))
          resolved = new URL(response.url)
        } catch { /* fall through to whatever we already have */ }
      }
    }

    if (!isAllowedHost(resolved.hostname)) {
      return NextResponse.json({ error: 'وجهة غير مدعومة' }, { status: 400 })
    }

    const resolvedUrl = resolved.toString()

    // Preferred source: the resolved URL itself, which carries the exact pin.
    const fromUrl = extractCoordinates(resolvedUrl)
    if (fromUrl) {
      return NextResponse.json({ url: resolvedUrl, lat: fromUrl.lat, lng: fromUrl.lng })
    }

    // Next: the page markup. A pin found there is as good as one in the URL; a viewport is
    // only Google's camera and is accepted solely when it lands inside the service area.
    let point: { lat: number; lng: number } | null = null
    let approximate = false
    try {
      const text = (await response.text()).slice(0, MAX_BODY_BYTES)
      const found = extractCoordinatesFromHtml(text)
      if (found && (found.source === 'pin' || isWithinServiceArea(found.point))) {
        point = found.point
        approximate = found.source === 'viewport'
      }
    } catch { /* body unavailable — the name fallback below still has a chance */ }

    // Last resort: geocode the place name out of the URL. Nominatim is pinned to Saudi
    // Arabia, so this cannot drift to another country the way Google's fallback did.
    if (!point) {
      const geocoded = await geocodePlaceName(resolvedUrl)
      if (geocoded) {
        point = geocoded.point
        approximate = true
      }
    }

    if (!isValidLatLng(point)) {
      return NextResponse.json(
        { url: resolvedUrl, error: 'تعذر استخراج الإحداثيات من هذا الرابط. افتح الموقع في خرائط Google، اضغط مطولًا على المكان، وانسخ الإحداثيات.' },
        { status: 422 },
      )
    }

    return NextResponse.json({ url: resolvedUrl, lat: point.lat, lng: point.lng, approximate })
  } catch {
    return NextResponse.json({ error: 'تعذر قراءة الرابط. تحقق من اتصالك وحاول مرة أخرى.' }, { status: 400 })
  }
}
