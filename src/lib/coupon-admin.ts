import { COUPON_CODE_PATTERN, normalizeCouponCode } from '@/lib/coupons'
import type { CouponDiscountType } from '@/generated/prisma'

export class CouponInputError extends Error {}

export type CouponInput = {
  code: string
  description: string | null
  discountType: CouponDiscountType
  discountValue: number
  maxDiscountAmount: number | null
  minBookingAmount: number | null
  startsAt: Date
  endsAt: Date
  maxRedemptions: number | null
  maxPerUser: number | null
  isActive: boolean
}

function optionalNumber(value: unknown, label: string, { min = 0, max = 10_000_000 } = {}) {
  if (value === '' || value === null || value === undefined) return null
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) throw new CouponInputError(label)
  return Math.round(parsed * 100) / 100
}

function optionalCount(value: unknown, label: string) {
  if (value === '' || value === null || value === undefined) return null
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 1_000_000) throw new CouponInputError(label)
  return parsed
}

function requiredDate(value: unknown, label: string) {
  const parsed = new Date(String(value ?? ''))
  if (Number.isNaN(parsed.valueOf())) throw new CouponInputError(label)
  return parsed
}

/** Validates an admin-supplied coupon payload, rejecting any shape a buyer could not redeem. */
export function parseCouponInput(body: Record<string, unknown>): CouponInput {
  const code = normalizeCouponCode(body.code)
  if (!COUPON_CODE_PATTERN.test(code)) {
    throw new CouponInputError('رمز الكوبون يجب أن يكون من 3 إلى 32 حرفًا إنجليزيًا أو رقمًا، ويسمح بالشرطة والشرطة السفلية.')
  }

  const discountType: CouponDiscountType = body.discountType === 'FIXED' ? 'FIXED' : 'PERCENTAGE'
  const rawValue = Number(body.discountValue)
  if (!Number.isFinite(rawValue) || rawValue <= 0) {
    throw new CouponInputError('أدخل قيمة خصم أكبر من صفر.')
  }
  if (discountType === 'PERCENTAGE' && rawValue > 100) {
    throw new CouponInputError('نسبة الخصم لا يمكن أن تتجاوز 100%.')
  }
  const discountValue = Math.round(rawValue * 100) / 100

  const maxDiscountAmount = discountType === 'PERCENTAGE'
    ? optionalNumber(body.maxDiscountAmount, 'الحد الأقصى للخصم غير صحيح.')
    : null
  if (maxDiscountAmount != null && maxDiscountAmount <= 0) {
    throw new CouponInputError('الحد الأقصى للخصم يجب أن يكون أكبر من صفر.')
  }

  const minBookingAmount = optionalNumber(body.minBookingAmount, 'الحد الأدنى لقيمة الحجز غير صحيح.')
  const startsAt = requiredDate(body.startsAt, 'تاريخ بداية الكوبون غير صحيح.')
  const endsAt = requiredDate(body.endsAt, 'تاريخ انتهاء الكوبون غير صحيح.')
  if (endsAt <= startsAt) {
    throw new CouponInputError('تاريخ الانتهاء يجب أن يكون بعد تاريخ البداية.')
  }

  // A 100% coupon would produce a zero-value charge, which the payment gateway cannot
  // process, so it is refused at creation time instead of failing the buyer at checkout.
  if (discountType === 'PERCENTAGE' && discountValue === 100 && maxDiscountAmount == null) {
    throw new CouponInputError('خصم 100% بدون حد أقصى يجعل قيمة الدفع صفرًا ولا تقبله بوابة الدفع. أضف حدًا أقصى للخصم أو قلل النسبة.')
  }

  return {
    code,
    description: typeof body.description === 'string' && body.description.trim() ? body.description.trim().slice(0, 500) : null,
    discountType,
    discountValue,
    maxDiscountAmount,
    minBookingAmount,
    startsAt,
    endsAt,
    maxRedemptions: optionalCount(body.maxRedemptions, 'عدد مرات الاستخدام الإجمالي غير صحيح.'),
    maxPerUser: optionalCount(body.maxPerUser, 'عدد مرات الاستخدام لكل مستخدم غير صحيح.'),
    isActive: body.isActive !== false,
  }
}
