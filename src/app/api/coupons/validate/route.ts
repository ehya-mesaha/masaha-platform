import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import {
  CouponError,
  describeCouponValue,
  evaluateCoupon,
  fromHalalas,
  normalizeCouponCode,
  toHalalas,
} from '@/lib/coupons'

/**
 * Previews what a coupon is worth before the buyer commits to paying. This is a preview
 * only: /api/bookings recomputes the subtotal from the space's own pricing and re-runs the
 * very same evaluation before reserving the coupon, so a tampered or stale amount here can
 * never change what is actually charged.
 */

const attempts = new Map<string, { count: number; resetAt: number }>()
const ATTEMPT_WINDOW_MS = 60_000
const ATTEMPT_LIMIT = 20

// Per-instance only, so it is a speed bump against code guessing rather than a hard quota.
function throttle(userId: string) {
  const now = Date.now()
  const entry = attempts.get(userId)
  if (!entry || entry.resetAt <= now) {
    attempts.set(userId, { count: 1, resetAt: now + ATTEMPT_WINDOW_MS })
    return true
  }
  entry.count += 1
  return entry.count <= ATTEMPT_LIMIT
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'BUYER') {
      return NextResponse.json({ error: 'يجب تسجيل الدخول كطالب مساحة لاستخدام كوبون الخصم' }, { status: 401 })
    }
    if (!throttle(String(user.id))) {
      return NextResponse.json({ error: 'محاولات كثيرة خلال وقت قصير. انتظر دقيقة ثم أعد المحاولة.' }, { status: 429 })
    }

    const body = await req.json()
    const code = normalizeCouponCode(body.code)
    const amount = Number(body.amount)
    if (!code) return NextResponse.json({ error: 'أدخل رمز الكوبون' }, { status: 400 })
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: 'أكمل بيانات الحجز أولًا حتى نحسب قيمة الخصم' }, { status: 400 })
    }

    const subtotalHalalas = toHalalas(amount)
    const { coupon, discountHalalas } = await evaluateCoupon(prisma, {
      code,
      userId: String(user.id),
      subtotalHalalas,
    })

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        summary: describeCouponValue(coupon),
      },
      discount: fromHalalas(discountHalalas),
      total: fromHalalas(subtotalHalalas - discountHalalas),
    })
  } catch (error) {
    if (error instanceof CouponError) {
      return NextResponse.json({ valid: false, code: error.code, error: error.message }, { status: 422 })
    }
    console.error(error)
    return NextResponse.json({ error: 'تعذر التحقق من الكوبون الآن. حاول مرة أخرى.' }, { status: 500 })
  }
}
