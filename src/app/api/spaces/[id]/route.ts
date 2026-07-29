import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { getStepError } from '@/components/spaces/create/validation'
import type { SpaceFormData } from '@/components/spaces/create/types'
import type { Prisma } from '@/generated/prisma'

const APPROVED_OWNER_SERVICES = new Set([
  'المطبوعات',
  'منظم',
  'تنظيف بعد الاستخدام',
  'مياه',
  'قهوة عربية',
  'شاي',
  'ضيافة خفيفة',
])

function normalizeServiceName(value: string) {
  return value.normalize('NFD').replace(/[\u064B-\u065F\u0670]/g, '')
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const space = await prisma.space.findUnique({
      where: { id },
      include: {
        type: true,
        seller: { select: { id: true, name: true, email: true, phone: true, avatarUrl: true } },
        images: { orderBy: { order: 'asc' } },
        amenities: { include: { amenity: true } },
        workingHours: { orderBy: { dayOfWeek: 'asc' } },
        services: true,
        serviceConfigs: {
          where: { isEnabled: true },
          include: { catalog: true },
          orderBy: { catalog: { sortOrder: 'asc' } },
        },
        units: { where: { isActive: true }, orderBy: { label: 'asc' } },
        pricingTiers: { orderBy: { minHours: 'asc' } },
        rules: true,
      },
    })

    if (!space) {
      return NextResponse.json({ error: 'المساحة غير موجودة' }, { status: 404 })
    }

    let reviews: Awaited<ReturnType<typeof prisma.spaceReview.findMany>> = []
    let reviewSummary = { average: 0, count: 0 }

    try {
      const [reviewRows, reviewAggregate] = await Promise.all([
        prisma.spaceReview.findMany({
          where: { spaceId: id, isVisible: true },
          include: {
            buyer: { select: { id: true, name: true } },
            booking: { select: { id: true, date: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 8,
        }),
        prisma.spaceReview.aggregate({
          where: { spaceId: id, isVisible: true },
          _avg: { rating: true },
          _count: { id: true },
        }),
      ])

      reviews = reviewRows
      reviewSummary = {
        average: reviewAggregate._avg.rating ? Number(reviewAggregate._avg.rating.toFixed(1)) : 0,
        count: reviewAggregate._count.id,
      }
    } catch (reviewErr) {
      console.error('Failed to load space reviews', reviewErr)
    }

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
              config: config.config ?? config.catalog.defaultConfig ?? null,
            }))
          : space.services.map(service => ({
              id: service.id,
              name: service.name,
              description: service.description,
              price: service.price,
              pricingType: service.pricingType,
              config: null,
            })),
        reviews,
        reviewSummary,
      },
    })
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
      price, images, amenityIds,
      streetName, buildingNumber, postalCode, landmarks,
      latitude, longitude,
      workingHours, services, rules,
      minBookingHours, maxAdvanceBookingDays, cancellationPolicy,
      identicalUnitsCount, advertisingLicenseNumber, pricingTiers,
    } = body

    const isFullWizardPayload = Array.isArray(workingHours)
      && Array.isArray(services)
      && Array.isArray(rules)
      && Array.isArray(pricingTiers)
      && typeof postalCode === 'string'
    let validationError = ''
    if (isFullWizardPayload) {
      try {
        validationError = getStepError(9, body as SpaceFormData)
      } catch {
        validationError = 'بيانات المساحة غير مكتملة.'
      }
    } else {
      if (typeof name !== 'string' || name.trim().length < 3) validationError = 'أدخل اسمًا واضحًا للمساحة لا يقل عن 3 أحرف.'
      else if (typeof typeId !== 'string' || !typeId) validationError = 'اختر تصنيف المساحة.'
      else if (typeof city !== 'string' || !city.trim()) validationError = 'اختر المدينة.'
      else if (!Number.isFinite(Number(price)) || Number(price) <= 0) validationError = 'أدخل سعرًا صحيحًا للساعة أكبر من صفر.'
      else if (!Array.isArray(images) || images.length < 1) validationError = 'أضف صورة واحدة على الأقل للمساحة.'
    }
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 })

    const [managedType, managedCity] = await Promise.all([
      prisma.spaceType.findUnique({ where: { id: typeId }, select: { id: true } }),
      prisma.city.findUnique({ where: { name: city.trim() }, select: { name: true, isActive: true } }),
    ])
    if (!managedType) {
      return NextResponse.json({ error: 'نوع المساحة المحدد غير متاح. حدّث الصفحة واختر نوعًا من القائمة.' }, { status: 400 })
    }
    if ((!managedCity || !managedCity.isActive) && city.trim() !== space.city) {
      return NextResponse.json({ error: 'المدينة المحددة غير متاحة حاليًا. اختر مدينة من القائمة.' }, { status: 400 })
    }

    const enabledServices = (Array.isArray(services) ? services : [])
      .filter((service: { isEnabled?: boolean; catalogId?: string }) => service.isEnabled && service.catalogId)
    const catalogRows = await prisma.serviceCatalog.findMany({
      where: { id: { in: enabledServices.map((service: { catalogId: string }) => service.catalogId) }, isActive: true },
      select: { id: true, name: true },
    })
    const approvedCatalogIds = new Set(
      catalogRows
        .filter(service => APPROVED_OWNER_SERVICES.has(normalizeServiceName(service.name)))
        .map(service => service.id),
    )
    if (enabledServices.some((service: { catalogId: string }) => !approvedCatalogIds.has(service.catalogId))) {
      return NextResponse.json({ error: 'تتضمن الخدمات اختيارًا غير معتمد من الإدارة.' }, { status: 400 })
    }

    const unitCount = Math.max(1, Math.min(100, Number(identicalUnitsCount) || space.identicalUnitsCount || 1))
    const updated = await prisma.$transaction(async (tx) => {
      await Promise.all([
        tx.spaceImage.deleteMany({ where: { spaceId: id } }),
        tx.spaceAmenity.deleteMany({ where: { spaceId: id } }),
        tx.spaceWorkingHours.deleteMany({ where: { spaceId: id } }),
        tx.spaceRule.deleteMany({ where: { spaceId: id } }),
        tx.pricingTier.deleteMany({ where: { spaceId: id } }),
      ])

      const existingUnits = await tx.spaceUnit.findMany({ where: { spaceId: id }, orderBy: { createdAt: 'asc' } })
      for (let index = 0; index < unitCount; index += 1) {
        const existingUnit = existingUnits[index]
        if (existingUnit) await tx.spaceUnit.update({ where: { id: existingUnit.id }, data: { isActive: true, label: `قاعة ${101 + index}` } })
        else await tx.spaceUnit.create({ data: { spaceId: id, label: `قاعة ${101 + index}` } })
      }
      if (existingUnits.length > unitCount) {
        await tx.spaceUnit.updateMany({ where: { id: { in: existingUnits.slice(unitCount).map((unit) => unit.id) } }, data: { isActive: false } })
      }

      if (Array.isArray(services)) {
        await tx.spaceServiceConfig.deleteMany({ where: { spaceId: id } })
        if (enabledServices.length) {
          await tx.spaceServiceConfig.createMany({
            data: enabledServices.map((service: { catalogId: string; price?: string | number; details?: string; config?: Record<string, unknown> }) => ({
              spaceId: id,
              catalogId: service.catalogId,
              isEnabled: true,
              price: service.price === '' || service.price == null ? null : Number(service.price),
              details: service.details?.trim() || null,
              config: service.config && Object.keys(service.config).length
                ? service.config as Prisma.InputJsonValue
                : undefined,
            })),
          })
        }
      }

      return tx.space.update({
        where: { id },
        data: {
          name,
          typeId,
          description,
          city: managedCity?.name || space.city,
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
          identicalUnitsCount: unitCount,
          advertisingLicenseNumber: user.role === 'ADMIN'
            ? (typeof advertisingLicenseNumber === 'string' ? advertisingLicenseNumber.trim() || null : space.advertisingLicenseNumber)
            : space.advertisingLicenseNumber,
          minBookingHours: minBookingHours ? Number(minBookingHours) : null,
          maxAdvanceBookingDays: maxAdvanceBookingDays ? Number(maxAdvanceBookingDays) : null,
          cancellationPolicy: cancellationPolicy || 'FLEXIBLE',
          status: user.role === 'ADMIN' ? space.status : 'PENDING_REVIEW',
          images: images?.length ? { create: images.map((url: string, index: number) => ({ url, order: index })) } : undefined,
          amenities: amenityIds?.length ? { create: amenityIds.map((amenityId: string) => ({ amenityId })) } : undefined,
          workingHours: workingHours?.length ? { create: workingHours.filter((item: { isOpen: boolean }) => item.isOpen).map((item: { dayOfWeek: number; openTime: string; closeTime: string }) => ({ dayOfWeek: item.dayOfWeek, isOpen: true, openTime: item.openTime, closeTime: item.closeTime })) } : undefined,
          pricingTiers: Array.isArray(pricingTiers) ? { create: pricingTiers.filter((tier: { minHours?: number; discountPercent?: number }) => Number(tier.minHours) > 0 && Number(tier.discountPercent) >= 0).map((tier: { minHours: number; discountPercent: number }) => ({ minHours: Number(tier.minHours), discountPercent: Number(tier.discountPercent) })) } : undefined,
          rules: rules?.length ? { create: rules.filter((rule: { isDefault: boolean }) => rule.isDefault).map((rule: { rule: string; isDefault: boolean }) => ({ rule: rule.rule, isDefault: rule.isDefault })) } : undefined,
        },
        include: { type: true, images: true, workingHours: true, services: true, serviceConfigs: { include: { catalog: true } }, units: true, pricingTiers: true, rules: true },
      })
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
