import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const space = await prisma.space.findUnique({
      where: { id },
      include: {
        type: true,
        seller: { select: { name: true, email: true, phone: true } },
        images: { orderBy: { order: 'asc' } },
        amenities: { include: { amenity: true } },
        workingHours: { orderBy: { dayOfWeek: 'asc' } },
        services: true,
        rules: true,
      },
    })

    if (!space) {
      return NextResponse.json({ error: 'المساحة غير موجودة' }, { status: 404 })
    }

    return NextResponse.json({ space })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

    const { id } = await params
    const space = await prisma.space.findUnique({ where: { id } })
    if (!space) return NextResponse.json({ error: 'المساحة غير موجودة' }, { status: 404 })

    if (space.sellerId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
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

    await prisma.spaceImage.deleteMany({ where: { spaceId: id } })
    await prisma.spaceAmenity.deleteMany({ where: { spaceId: id } })
    await prisma.spaceWorkingHours.deleteMany({ where: { spaceId: id } })
    await prisma.spaceService.deleteMany({ where: { spaceId: id } })
    await prisma.spaceRule.deleteMany({ where: { spaceId: id } })

    const updated = await prisma.space.update({
      where: { id },
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
        status: user.role === 'ADMIN' ? space.status : 'PENDING_REVIEW',
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
                .map((wh: { dayOfWeek: number; openTime: string; closeTime: string }) => ({
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
      include: { type: true, images: true, workingHours: true, services: true, rules: true },
    })

    return NextResponse.json({ space: updated })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

    const { id } = await params
    const space = await prisma.space.findUnique({ where: { id } })
    if (!space) return NextResponse.json({ error: 'المساحة غير موجودة' }, { status: 404 })

    if (space.sellerId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    await prisma.space.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
