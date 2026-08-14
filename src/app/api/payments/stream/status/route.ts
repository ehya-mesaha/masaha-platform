import { NextResponse } from 'next/server'

import { getCurrentUser } from '@/lib/auth'
import { StreamPayError } from '@/lib/streampay/client'
import { getPaymentOrderStatus, reconcileStreamOrder } from '@/lib/streampay/service'

export const runtime = 'nodejs'

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

  const ownedOrder = await getPaymentOrderStatus(checkoutToken, user.id as string)
  if (!ownedOrder) return NextResponse.json({ error: 'عملية الدفع غير موجودة.' }, { status: 404 })

  const invoiceId = readUuid(body.invoiceId)
  const paymentId = readUuid(body.paymentId)
  const paymentLinkId = readUuid(body.paymentLinkId)

  if (invoiceId) {
    try {
      await reconcileStreamOrder({ checkoutToken, invoiceId, paymentId, paymentLinkId })
    } catch (error) {
      if (!(error instanceof StreamPayError) || !['PAYMENT_NOT_COMPLETED', 'NETWORK_ERROR'].includes(error.code || '')) {
        console.error('StreamPay return verification failed', error)
      }
    }
  }

  const order = await getPaymentOrderStatus(checkoutToken, user.id as string)
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
