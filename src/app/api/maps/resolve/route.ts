import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_HOSTS = new Set(['maps.app.goo.gl', 'goo.gl', 'www.google.com', 'google.com', 'maps.google.com'])

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const input = new URL(typeof body.url === 'string' ? body.url : '')
    if (input.protocol !== 'https:' || !ALLOWED_HOSTS.has(input.hostname)) {
      return NextResponse.json({ error: 'رابط غير مدعوم' }, { status: 400 })
    }

    const response = await fetch(input, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'User-Agent': 'EhyaMasaha/1.0' },
      signal: AbortSignal.timeout(7000),
    })
    const resolved = new URL(response.url)
    if (!ALLOWED_HOSTS.has(resolved.hostname)) {
      return NextResponse.json({ error: 'وجهة غير مدعومة' }, { status: 400 })
    }
    return NextResponse.json({ url: resolved.toString() })
  } catch {
    return NextResponse.json({ error: 'تعذر قراءة الرابط' }, { status: 400 })
  }
}
