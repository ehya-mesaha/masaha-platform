import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const city = searchParams.get('city')
    const typeId = searchParams.get('typeId')
    const status = searchParams.get('status') || 'APPROVED'
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const minCapacity = searchParams.get('minCapacity')
    const amenityIds = searchParams.get('amenityIds')
    const sort = searchParams.get('sort') || 'newest'

    const where: Record<string, unknown> = { status }
    if (city && city !== 'all') where.city = city
    if (typeId && typeId !== 'all') where.typeId = typeId
    if (minPrice) where.price = { ...(where.price as object || {}), gte: Number(minPrice) }
    if (maxPrice) where.price = { ...(where.price as object || {}), lte: Number(maxPrice) }
    if (minCapacity) where.capacity = { gte: Number(minCapacity) }
    if (amenityIds) {
      const ids = amenityIds.split(',')
      where.amenities = { some: { amenityId: { in: ids } } }
    }

    let orderBy: Record<string, string> = { createdAt: 'desc' }
    if (sort === 'price_asc') orderBy = { price: 'asc' }
    else if (sort === 'price_desc') orderBy = { price: 'desc' }

    const spaces = await prisma.space.findMany({
      where,
      include: {
        type: true,
        images: { orderBy: { order: 'asc' }, take: 1 },
        seller: { select: { name: true } },
      },
      orderBy,
    })

    return NextResponse.json({ spaces })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== 'SELLER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const body = await req.json()
    const {
      name, typeId, description, city, district, address, capacity,
      price, pricePeriod, images, amenityIds,
      streetName, buildingNumber, postalCode, landmarks,
      latitude, longitude,
      workingHours, services, rules,
      minBookingHours, maxAdvanceBookingDays, cancellationPolicy,
    } = body

    if (!name || !typeId || !city || !price) {
      return NextResponse.json({ error: 'يرجى إدخال جميع البيانات المطلوبة' }, { status: 400 })
    }

    const space = await prisma.space.create({
      data: {
        name,
        typeId,
        description,
        city,
        district,
        address,
        streetName: streetName || null,
        buildingNumber: buildingNumber || null,
        postalCode: postalCode || null,
        landmarks: landmarks || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        capacity: capacity ? Number(capacity) : null,
        price: Number(price),
        pricePeriod: pricePeriod || 'hour',
        minBookingHours: minBookingHours ? Number(minBookingHours) : null,
        maxAdvanceBookingDays: maxAdvanceBookingDays ? Number(maxAdvanceBookingDays) : null,
        cancellationPolicy: cancellationPolicy || 'FLEXIBLE',
        sellerId: user.id as string,
        status: 'PENDING_REVIEW',
        images: images?.length
          ? { create: images.map((url: string, i: number) => ({ url, order: i })) }
          : undefined,
        amenities: amenityIds?.length
          ? { create: amenityIds.map((amenityId: string) => ({ amenityId })) }
          : undefined,
        workingHours: workingHours?.length
          ? {
              create: workingHours
                .filter((wh: { isOpen: boolean }) => wh.isOpen)
                .map((wh: { dayOfWeek: number; isOpen: boolean; openTime: string; closeTime: string }) => ({
                  dayOfWeek: wh.dayOfWeek,
                  isOpen: true,
                  openTime: wh.openTime,
                  closeTime: wh.closeTime,
                })),
            }
          : undefined,
        services: services?.length
          ? {
              create: services.map((s: { name: string; description: string; price: string; pricingType: string }) => ({
                name: s.name,
                description: s.description || null,
                price: Number(s.price),
                pricingType: s.pricingType || 'PER_BOOKING',
              })),
            }
          : undefined,
        rules: rules?.length
          ? {
              create: rules
                .filter((r: { isDefault: boolean }) => r.isDefault)
                .map((r: { rule: string; isDefault: boolean }) => ({
                  rule: r.rule,
                  isDefault: r.isDefault,
                })),
            }
          : undefined,
      },
      include: {
        type: true,
        images: true,
        amenities: { include: { amenity: true } },
        workingHours: true,
        services: true,
        rules: true,
      },
    })

    return NextResponse.json({ space }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
