import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const city = searchParams.get('city')
    const typeId = searchParams.get('typeId')
    const status = searchParams.get('status') || 'APPROVED'

    const where: Record<string, unknown> = { status }
    if (city) where.city = { contains: city, mode: 'insensitive' }
    if (typeId) where.typeId = typeId

    const spaces = await prisma.space.findMany({
      where,
      include: {
        type: true,
        images: { orderBy: { order: 'asc' }, take: 1 },
        seller: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
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
    const { name, typeId, description, city, district, address, capacity, price, pricePeriod, images, amenityIds } = body

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
        capacity: capacity ? Number(capacity) : null,
        price: Number(price),
        pricePeriod: pricePeriod || 'hour',
        sellerId: user.id as string,
        status: 'PENDING_REVIEW',
        images: images?.length
          ? { create: images.map((url: string, i: number) => ({ url, order: i })) }
          : undefined,
        amenities: amenityIds?.length
          ? { create: amenityIds.map((amenityId: string) => ({ amenityId })) }
          : undefined,
      },
      include: { type: true, images: true, amenities: { include: { amenity: true } } },
    })

    return NextResponse.json({ space }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
