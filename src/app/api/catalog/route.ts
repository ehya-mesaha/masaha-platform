import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [types, cities, amenities, ownerServices] = await Promise.all([
      prisma.spaceType.findMany({ orderBy: { name: 'asc' } }),
      prisma.city.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      }),
      prisma.amenity.findMany({ orderBy: { name: 'asc' } }),
      prisma.serviceCatalog.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      }),
    ])

    return NextResponse.json(
      { types, cities, amenities, ownerServices },
      { headers: { 'Cache-Control': 'private, max-age=60, stale-while-revalidate=300' } },
    )
  } catch (error) {
    console.error('Failed to load public catalog', error)
    return NextResponse.json({ error: 'تعذر تحميل خيارات المنصة' }, { status: 500 })
  }
}
