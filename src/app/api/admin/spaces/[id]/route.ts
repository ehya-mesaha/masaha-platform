import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    const { id } = await params
    const { status, adminNotes, advertisingLicenseNumber, imageUrls } = await request.json()
    const validStatuses = ['APPROVED', 'REJECTED', 'INACTIVE', 'PENDING_REVIEW']
    if (status !== undefined && !validStatuses.includes(status)) return NextResponse.json({ error: 'الحالة غير صحيحة' }, { status: 400 })
    const before = await prisma.space.findUnique({ where: { id }, include: { images: true } })
    if (!before) return NextResponse.json({ error: 'المساحة غير موجودة' }, { status: 404 })
    const urls = Array.isArray(imageUrls) ? imageUrls.map(String).map((url) => url.trim()).filter(Boolean).slice(0, 20) : undefined

    const space = await prisma.$transaction(async (tx) => {
      if (urls) {
        await tx.spaceImage.deleteMany({ where: { spaceId: id } })
        if (urls.length) await tx.spaceImage.createMany({ data: urls.map((url, order) => ({ spaceId: id, url, order })) })
      }
      const updated = await tx.space.update({
        where: { id },
        data: {
          ...(status !== undefined ? { status } : {}),
          ...(adminNotes !== undefined ? { adminNotes } : {}),
          ...(advertisingLicenseNumber !== undefined ? { advertisingLicenseNumber: String(advertisingLicenseNumber).trim() || null } : {}),
        },
        include: {
          type: true,
          seller: { select: { id: true, name: true, email: true, phone: true } },
          images: { orderBy: { order: 'asc' } },
          amenities: { include: { amenity: true } },
          workingHours: true,
          services: true,
          serviceConfigs: {
            where: { isEnabled: true },
            include: { catalog: true },
            orderBy: { catalog: { sortOrder: 'asc' } },
          },
          rules: true,
        },
      })
      await tx.adminAuditLog.create({
        data: {
          actorId: String(admin.id),
          action: 'UPDATE_SPACE',
          entityType: 'Space',
          entityId: id,
          before: JSON.parse(JSON.stringify(before)),
          after: JSON.parse(JSON.stringify(updated)),
        },
      })
      return updated
    })
    return NextResponse.json({
      space: {
        ...space,
        services: space.serviceConfigs.length > 0
          ? space.serviceConfigs.map(config => ({
              id: config.id,
              name: config.catalog.name,
              description: config.details || config.catalog.description,
              price: config.price ?? config.catalog.defaultPrice ?? 0,
              pricingType: config.catalog.pricingType,
            }))
          : space.services,
      },
    })
  } catch (error) {
    console.error('Admin space update failed', error)
    return NextResponse.json({ error: 'تعذر تحديث المساحة' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    const { id } = await params
    const before = await prisma.space.findUnique({ where: { id } })
    if (!before) return NextResponse.json({ error: 'المساحة غير موجودة' }, { status: 404 })

    await prisma.$transaction(async (tx) => {
      // Bookings (and their services/reviews) reference the space with no cascade — clear them first.
      await tx.booking.deleteMany({ where: { spaceId: id } })
      await tx.space.delete({ where: { id } })
      await tx.adminAuditLog.create({
        data: {
          actorId: String(admin.id),
          action: 'DELETE_SPACE',
          entityType: 'Space',
          entityId: id,
          before: JSON.parse(JSON.stringify(before)),
        },
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin space delete failed', error)
    return NextResponse.json({ error: 'تعذر حذف المساحة' }, { status: 500 })
  }
}
