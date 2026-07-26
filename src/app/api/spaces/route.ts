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
      price, images, amenityIds,
      streetName, buildingNumber, postalCode, landmarks,
      latitude, longitude,
      workingHours, services, rules,
      minBookingHours, maxAdvanceBookingDays, cancellationPolicy,
      identicalUnitsCount, pricingTiers,
    } = body

    if (!name || !typeId || !city || !price) {
      return NextResponse.json({ error: 'يرجى إدخال جميع البيانات المطلوبة' }, { status: 400 })
    }

    const unitsCount = Math.max(1, Math.min(100, Number(identicalUnitsCount) || 1))
    const publicRef = `S${new Date().getFullYear()}${Date.now().toString().slice(-8)}`
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
        pricePeriod: 'hour',
        publicRef,
        identicalUnitsCount: unitsCount,
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
        units: {
          create: Array.from({ length: unitsCount }, (_, index) => ({ label: `قاعة ${101 + index}` })),
        },
        pricingTiers: pricingTiers?.length
          ? {
              create: pricingTiers
                .filter((tier: { minHours: string; discountPercent: string }) => Number(tier.minHours) > 0 && Number(tier.discountPercent) >= 0)
                .map((tier: { minHours: string; discountPercent: string }) => ({
                  minHours: Number(tier.minHours),
                  discountPercent: Number(tier.discountPercent),
                })),
            }
          : undefined,
        serviceConfigs: services?.length
          ? {
              create: services
                .filter((service: { isEnabled: boolean; catalogId: string }) => service.isEnabled && service.catalogId)
                .map((service: { catalogId: string; price: string; details: string }) => ({
                  catalogId: service.catalogId,
                  isEnabled: true,
                  price: service.price === '' ? null : Number(service.price),
                  details: service.details || null,
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
        units: true,
        pricingTiers: true,
        serviceConfigs: { include: { catalog: true } },
        rules: true,
      },
    })

    return NextResponse.json({ space }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
