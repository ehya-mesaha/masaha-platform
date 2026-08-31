import { NextRequest, NextResponse } from 'next/server'
import { reverseGeocode } from '@/lib/nominatim'
import { isValidLatLng } from '@/lib/geo'

/** The address behind a pin, so the seller can confirm the point is the right one. */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const point = { lat: Number(params.get('lat')), lng: Number(params.get('lng')) }

  if (!isValidLatLng(point)) {
    return NextResponse.json({ error: 'إحداثيات غير صالحة' }, { status: 400 })
  }

  try {
    const result = await reverseGeocode(point.lat, point.lng)
    return NextResponse.json(
      { result },
      { headers: { 'Cache-Control': 'public, max-age=600, s-maxage=86400, stale-while-revalidate=86400' } },
    )
  } catch (error) {
    console.error('Reverse geocode failed', error)
    return NextResponse.json({ error: 'تعذر جلب العنوان الآن', result: null }, { status: 502 })
  }
}
