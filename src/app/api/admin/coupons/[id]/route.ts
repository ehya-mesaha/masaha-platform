import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { CouponInputError, parseCouponInput } from '@/lib/coupon-admin'
import { ACTIVE_REDEMPTION_STATUSES, fromHalalas } from '@/lib/coupons'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    const { id } = await params

    const before = await prisma.coupon.findUnique({ where: { id } })
    if (!before) return NextResponse.json({ error: 'الكوبون غير موجود' }, { status: 404 })

    const body = await req.json()
    // A status-only toggle keeps the rest of the coupon exactly as it is, so switching a
    // coupon off never has to re-pass validation for fields the admin did not touch.
    const data = body.statusOnly === true
      ? { isActive: body.isActive !== false }
      : parseCouponInput(body)

    const coupon = await prisma.$transaction(async tx => {
      const updated = await tx.coupon.update({ where: { id }, data })
      await tx.adminAuditLog.create({
        data: {
          actorId: String(admin.id),
          action: 'UPDATE_COUPON',
          entityType: 'Coupon',
          entityId: id,
          before: JSON.parse(JSON.stringify(before)),
          after: JSON.parse(JSON.stringify(updated)),
        },
      })
      return updated
    })

    const redemptions = await prisma.couponRedemption.findMany({
      where: { couponId: id },
      select: { status: true, discountHalalas: true },
    })
    const confirmed = redemptions.filter(redemption => redemption.status === 'CONFIRMED')
    return NextResponse.json({
      // createdByName is deliberately omitted: the client merges this into the row it
      // already holds, and returning null here would blank the creator it already knows.
      coupon: {
        ...coupon,
        usedCount: redemptions.filter(redemption => ACTIVE_REDEMPTION_STATUSES.includes(redemption.status as 'RESERVED' | 'CONFIRMED')).length,
        confirmedCount: confirmed.length,
        totalDiscount: fromHalalas(confirmed.reduce((sum, redemption) => sum + redemption.discountHalalas, 0)),
      },
    })
  } catch (error) {
    if (error instanceof CouponInputError) return NextResponse.json({ error: error.message }, { status: 400 })
    if (isDuplicateCodeError(error)) {
      return NextResponse.json({ error: 'يوجد كوبون بنفس الرمز. اختر رمزًا مختلفًا.' }, { status: 409 })
    }
    console.error(error)
    return NextResponse.json({ error: 'تعذر تحديث الكوبون' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    const { id } = await params

    const before = await prisma.coupon.findUnique({ where: { id } })
    if (!before) return NextResponse.json({ error: 'الكوبون غير موجود' }, { status: 404 })

    // Redeemed coupons are part of the payment record, so they are switched off rather than
    // deleted; erasing them would break the audit trail behind money already collected.
    const redemptions = await prisma.couponRedemption.count({ where: { couponId: id } })
    if (redemptions > 0) {
      return NextResponse.json(
        { error: 'لا يمكن حذف كوبون مستخدم في حجوزات. أوقف تفعيله بدلًا من حذفه للحفاظ على سجل العمليات.' },
        { status: 409 },
      )
    }

    await prisma.$transaction(async tx => {
      await tx.coupon.delete({ where: { id } })
      await tx.adminAuditLog.create({
        data: {
          actorId: String(admin.id),
          action: 'DELETE_COUPON',
          entityType: 'Coupon',
          entityId: id,
          before: JSON.parse(JSON.stringify(before)),
        },
      })
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'تعذر حذف الكوبون' }, { status: 500 })
  }
}

/**
 * Prisma 7 throws its error from inside the generated runtime, and that class is not always
 * the same identity as the re-exported `Prisma.PrismaClientKnownRequestError`, so `instanceof`
 * can miss a genuine unique-constraint violation. The error code is checked structurally.
 */
function isDuplicateCodeError(error: unknown) {
  return typeof error === 'object' && error !== null && (error as { code?: unknown }).code === 'P2002'
}
