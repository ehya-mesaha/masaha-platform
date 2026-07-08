import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

function cleanString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function cleanOptionalString(value: unknown) {
  const text = cleanString(value)
  return text || null
}

function cleanNumber(value: unknown) {
  if (value === null || value === undefined || value === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

    const where = user.role === 'ADMIN'
      ? {}
      : user.role === 'BUYER'
        ? { buyerId: user.id as string }
        : null

    if (!where) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

    const requests = await prisma.spaceNeedRequest.findMany({
      where,
      include: {
        buyer: { select: { name: true, email: true, phone: true } },
        type: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ requests })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ أثناء تحميل طلبات الاحتياج' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'BUYER') {
      return NextResponse.json({ error: 'يجب تسجيل الدخول كمستأجر لإرسال الطلب' }, { status: 401 })
    }

    const body = await req.json()
    const typeId = cleanOptionalString(body.typeId)
    const customType = cleanString(body.spaceType)
    const city = cleanString(body.city)
    const district = cleanOptionalString(body.district)
    const expectedDate = cleanOptionalString(body.expectedDate)
    const capacity = cleanNumber(body.capacity)
    const budgetMin = cleanNumber(body.budgetMin)
    const budgetMax = cleanNumber(body.budgetMax)
    const details = cleanOptionalString(body.details)

    if (!city || !capacity || capacity < 1) {
      return NextResponse.json({ error: 'يرجى إدخال المدينة والسعة المطلوبة بشكل صحيح' }, { status: 400 })
    }

    if (budgetMin !== null && budgetMax !== null && budgetMin > budgetMax) {
      return NextResponse.json({ error: 'الحد الأدنى للميزانية يجب أن يكون أقل من الحد الأعلى' }, { status: 400 })
    }

    let selectedType: { id: string; name: string } | null = null
    if (typeId) {
      selectedType = await prisma.spaceType.findUnique({ where: { id: typeId }, select: { id: true, name: true } })
      if (!selectedType) {
        return NextResponse.json({ error: 'نوع المساحة غير صحيح' }, { status: 400 })
      }
    }

    const spaceType = selectedType?.name || customType
    if (!spaceType) {
      return NextResponse.json({ error: 'يرجى اختيار أو كتابة نوع المساحة المطلوبة' }, { status: 400 })
    }

    const request = await prisma.spaceNeedRequest.create({
      data: {
        buyerId: user.id as string,
        typeId: selectedType?.id ?? null,
        spaceType,
        city,
        district,
        expectedDate,
        capacity,
        budgetMin,
        budgetMax,
        details,
      },
      include: {
        buyer: { select: { name: true, email: true, phone: true } },
        type: { select: { name: true } },
      },
    })

    return NextResponse.json({ request }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ أثناء إرسال الطلب' }, { status: 500 })
  }
}
