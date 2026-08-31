import { NextRequest, NextResponse } from 'next/server'
import { extractCoordinates, extractCoordinatesFromHtml, isValidLatLng } from '@/lib/geo'

/**
 * Turns a pasted map link into coordinates.
 *
 * Short links (maps.app.goo.gl, g.co, share.google…) carry no coordinates at all —
 * they have to be followed to their destination first. Google also serves non-browser
 * clients a consent interstitial instead of the real page, and for some share links the
 * coordinates never reach the final URL and only appear in the HTML body, so all three
 * are handled here rather than leaving the browser to guess.
 */

const SHORT_LINK_HOSTS = new Set([
  'maps.app.goo.gl', 'goo.gl', 'g.co', 'share.google', 'maps.google.com',
  'www.google.com', 'google.com',
])

const ALLOWED_HOSTS = new Set([
  ...SHORT_LINK_HOSTS,
  'openstreetmap.org', 'www.openstreetmap.org', 'osm.org',
  'maps.apple.com',
])

const MAX_BODY_BYTES = 400_000

function isAllowedHost(hostname: string) {
  return ALLOWED_HOSTS.has(hostname)
    || hostname.endsWith('.google.com')
    || hostname.endsWith('.google.com.sa')
}

async function fetchPage(url: URL) {
  const response = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
    headers: {
      // A real browser UA — Google serves short links a bare redirect stub otherwise.
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'ar,en;q=0.8',
    },
    signal: AbortSignal.timeout(9000),
  })
  return response
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

    // Preferred source: the resolved URL itself, which carries the exact pin.
    const fromUrl = extractCoordinates(resolved.toString())
    let point = fromUrl
    let approximate = false

    // Fallback: some share links keep the location only in the page markup.
    if (!point) {
      try {
        const text = (await response.text()).slice(0, MAX_BODY_BYTES)
        const fromHtml = extractCoordinatesFromHtml(text)
        if (fromHtml) {
          point = fromHtml.point
          approximate = fromHtml.approximate
        }
      } catch { /* body unavailable — reported as not-found below */ }
    }

    if (!isValidLatLng(point)) {
      return NextResponse.json(
        { url: resolved.toString(), error: 'تعذر استخراج الإحداثيات من هذا الرابط' },
        { status: 422 },
      )
    }

    return NextResponse.json({ url: resolved.toString(), lat: point.lat, lng: point.lng, approximate })
  } catch {
    return NextResponse.json({ error: 'تعذر قراءة الرابط. تحقق من اتصالك وحاول مرة أخرى.' }, { status: 400 })
  }
}
