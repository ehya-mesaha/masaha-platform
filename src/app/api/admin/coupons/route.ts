import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { CouponInputError, parseCouponInput } from '@/lib/coupon-admin'
import { ACTIVE_REDEMPTION_STATUSES, fromHalalas } from '@/lib/coupons'

export async function GET() {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: { select: { name: true } },
        redemptions: { select: { status: true, discountHalalas: true } },
      },
    })

    return NextResponse.json({
      coupons: coupons.map(({ redemptions, ...coupon }) => {
        const confirmed = redemptions.filter(redemption => redemption.status === 'CONFIRMED')
        return {
          ...coupon,
          createdByName: coupon.createdBy?.name || null,
          // Reserved uses are checkouts still in flight; they hold a slot, so the admin sees
          // the same count the redemption limits are enforced against.
          usedCount: redemptions.filter(redemption => ACTIVE_REDEMPTION_STATUSES.includes(redemption.status as 'RESERVED' | 'CONFIRMED')).length,
          confirmedCount: confirmed.length,
          totalDiscount: fromHalalas(confirmed.reduce((sum, redemption) => sum + redemption.discountHalalas, 0)),
        }
      }),
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'حدث خطأ أثناء تحميل الكوبونات' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

    const input = parseCouponInput(await req.json())
    const coupon = await prisma.$transaction(async tx => {
      const created = await tx.coupon.create({ data: { ...input, createdById: String(admin.id) } })
      await tx.adminAuditLog.create({
        data: {
          actorId: String(admin.id),
          action: 'CREATE_COUPON',
          entityType: 'Coupon',
          entityId: created.id,
          after: JSON.parse(JSON.stringify(created)),
        },
      })
      return created
    })
    return NextResponse.json({ coupon: { ...coupon, usedCount: 0, confirmedCount: 0, totalDiscount: 0, createdByName: admin.name } }, { status: 201 })
  } catch (error) {
    if (error instanceof CouponInputError) return NextResponse.json({ error: error.message }, { status: 400 })
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'يوجد كوبون بنفس الرمز. اختر رمزًا مختلفًا.' }, { status: 409 })
    }
    console.error(error)
    return NextResponse.json({ error: 'تعذر إنشاء الكوبون' }, { status: 500 })
  }
}
