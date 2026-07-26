import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const [types, amenities, ownerServices, partnerServices] = await Promise.all([
      prisma.spaceType.findMany({ orderBy: { name: 'asc' } }),
      prisma.amenity.findMany({ orderBy: { name: 'asc' } }),
      prisma.serviceCatalog.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] }),
      prisma.partnerService.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] }),
    ])
    return NextResponse.json({ types, amenities, ownerServices, partnerServices })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'حدث خطأ أثناء تحميل التصنيفات' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    const body = await req.json()
    const name = clean(body.name)
    if (!name) return NextResponse.json({ error: 'الاسم مطلوب' }, { status: 400 })

    if (body.type === 'space-type') {
      return NextResponse.json({ item: await prisma.spaceType.create({ data: { name } }) }, { status: 201 })
    }
    if (body.type === 'amenity') {
      return NextResponse.json({ item: await prisma.amenity.create({ data: { name, category: clean(body.category) || null } }) }, { status: 201 })
    }
    if (body.type === 'owner-service') {
      const item = await prisma.serviceCatalog.create({
        data: {
          name,
          description: clean(body.description),
          category: clean(body.category) || 'other',
          pricingType: pricingType(body.pricingType),
          defaultPrice: nullableNumber(body.price),
          sortOrder: Number(body.sortOrder) || 0,
        },
      })
      return NextResponse.json({ item }, { status: 201 })
    }
    if (body.type === 'partner-service') {
      const item = await prisma.partnerService.create({
        data: {
          name,
          description: clean(body.description),
          pricingType: pricingType(body.pricingType),
          indicativePrice: nullableNumber(body.price),
          sortOrder: Number(body.sortOrder) || 0,
        },
      })
      return NextResponse.json({ item }, { status: 201 })
    }
    return NextResponse.json({ error: 'النوع غير صحيح' }, { status: 400 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'تعذر إضافة العنصر. تحقق من عدم تكرار الاسم.' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    const body = await req.json()
    const name = clean(body.name)
    if (!body.id || !name) return NextResponse.json({ error: 'البيانات غير مكتملة' }, { status: 400 })

    let item
    if (body.type === 'space-type') item = await prisma.spaceType.update({ where: { id: body.id }, data: { name } })
    else if (body.type === 'amenity') item = await prisma.amenity.update({ where: { id: body.id }, data: { name, category: clean(body.category) || null } })
    else if (body.type === 'owner-service') {
      item = await prisma.serviceCatalog.update({
        where: { id: body.id },
        data: {
          name,
          description: clean(body.description),
          category: clean(body.category) || 'other',
          pricingType: pricingType(body.pricingType),
          defaultPrice: nullableNumber(body.price),
          isActive: body.isActive !== false,
        },
      })
    } else if (body.type === 'partner-service') {
      item = await prisma.partnerService.update({
        where: { id: body.id },
        data: {
          name,
          description: clean(body.description),
          pricingType: pricingType(body.pricingType),
          indicativePrice: nullableNumber(body.price),
          isActive: body.isActive !== false,
        },
      })
    } else return NextResponse.json({ error: 'النوع غير صحيح' }, { status: 400 })
    return NextResponse.json({ item })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'تعذر تحديث العنصر' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    const { type, id } = await req.json()
    if (type === 'space-type') await prisma.spaceType.delete({ where: { id } })
    else if (type === 'amenity') await prisma.amenity.delete({ where: { id } })
    else if (type === 'owner-service') await prisma.serviceCatalog.delete({ where: { id } })
    else if (type === 'partner-service') await prisma.partnerService.delete({ where: { id } })
    else return NextResponse.json({ error: 'النوع غير صحيح' }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'لا يمكن حذف عنصر مستخدم حاليًا' }, { status: 409 })
  }
}

function clean(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function nullableNumber(value: unknown) {
  if (value === '' || value === null || value === undefined) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function pricingType(value: unknown) {
  const allowed = ['PER_BOOKING', 'PER_PERSON', 'PER_HOUR', 'PER_ITEM', 'PER_TEN_PAGES', 'CUSTOM'] as const
  return allowed.includes(value as typeof allowed[number]) ? value as typeof allowed[number] : 'PER_BOOKING'
}
