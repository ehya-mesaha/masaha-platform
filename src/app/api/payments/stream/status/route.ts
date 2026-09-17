import { NextResponse } from 'next/server'

import { getCurrentUser } from '@/lib/auth'
import { getPaymentOrderStatus } from '@/lib/streampay/service'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'BUYER') {
    return NextResponse.json({ error: 'يجب تسجيل الدخول لمتابعة حالة الدفع.' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json() as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'طلب غير صالح.' }, { status: 400 })
  }

  const checkoutToken = readUuid(body.checkoutToken)
  if (!checkoutToken) return NextResponse.json({ error: 'رقم متابعة الدفع غير صالح.' }, { status: 400 })

  // The invoice, payment and link IDs StreamPay may append to the return URL are not used:
  // the order is verified by looking its invoice up directly, so a tampered URL changes nothing.
  let order
  try {
    order = await getPaymentOrderStatus(checkoutToken, user.id as string)
  } catch (error) {
    console.error('Payment status check failed', error)
    return NextResponse.json({ error: 'تعذر التحقق من عملية الدفع الآن. سنعيد المحاولة تلقائيًا.' }, { status: 503 })
  }
  if (!order) return NextResponse.json({ error: 'عملية الدفع غير موجودة.' }, { status: 404 })

  return NextResponse.json({
    status: order.status,
    expiresAt: order.expiresAt,
    bookingId: order.bookings[0]?.id || null,
    retryCheckoutUrl: order.status === 'CHECKOUT_CREATED' && order.expiresAt > new Date()
      ? order.checkoutUrl
      : null,
  })
}

function readUuid(value: unknown) {
  if (typeof value !== 'string') return null
  const normalized = value.trim().toLowerCase()
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(normalized)
    ? normalized
    : null
}
