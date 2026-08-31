import { NextRequest, NextResponse } from 'next/server'
import { searchPlaces } from '@/lib/nominatim'

/** Address/landmark search for the seller's location picker. */
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim() || ''
  const city = request.nextUrl.searchParams.get('city')?.trim() || undefined
  if (query.length < 3) {
    return NextResponse.json({ results: [] })
  }

  try {
    const results = await searchPlaces(query, city)
    return NextResponse.json(
      { results },
      { headers: { 'Cache-Control': 'public, max-age=600, s-maxage=86400, stale-while-revalidate=86400' } },
    )
  } catch (error) {
    console.error('Place search failed', error)
    return NextResponse.json({ error: 'تعذر البحث عن العنوان الآن', results: [] }, { status: 502 })
  }
}
