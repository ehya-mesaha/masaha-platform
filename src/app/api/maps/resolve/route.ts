import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_HOSTS = new Set(['maps.app.goo.gl', 'goo.gl', 'www.google.com', 'google.com', 'maps.google.com'])

async function fetchFinalUrl(url: URL) {
  const response = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; EhyaMasaha/1.0; +https://ehyamesaha.sa)',
      'Accept-Language': 'ar,en;q=0.8',
    },
    signal: AbortSignal.timeout(8000),
  })
  return new URL(response.url)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const input = new URL(typeof body.url === 'string' ? body.url : '')
    if (input.protocol !== 'https:' || !ALLOWED_HOSTS.has(input.hostname)) {
      return NextResponse.json({ error: 'رابط غير مدعوم' }, { status: 400 })
    }

    let resolved = await fetchFinalUrl(input)

    // Google sometimes redirects non-browser requests through a consent interstitial
    // (consent.google.com or a "/sorry/" captcha wall) instead of the final maps URL.
    // When that happens the real destination is preserved in the `continue` query param —
    // follow it once more so the resolver doesn't fail on a perfectly valid link.
    if (resolved.hostname === 'consent.google.com' || resolved.pathname.startsWith('/sorry')) {
      const continueUrl = resolved.searchParams.get('continue')
      if (continueUrl) {
        try {
          resolved = await fetchFinalUrl(new URL(continueUrl))
        } catch {
          // fall through to the not-supported check below
        }
      }
    }

    const isGoogleHost = ALLOWED_HOSTS.has(resolved.hostname) || resolved.hostname.endsWith('.google.com')
    if (!isGoogleHost) {
      return NextResponse.json({ error: 'وجهة غير مدعومة' }, { status: 400 })
    }
    return NextResponse.json({ url: resolved.toString() })
  } catch {
    return NextResponse.json({ error: 'تعذر قراءة الرابط' }, { status: 400 })
  }
}
