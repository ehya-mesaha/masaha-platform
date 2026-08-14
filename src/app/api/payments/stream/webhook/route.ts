import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { reconcileStreamOrder, safeErrorMessage, syncStreamRefund } from '@/lib/streampay/service'

export const runtime = 'nodejs'

const MAX_WEBHOOK_BYTES = 256 * 1024
const SUCCESS_EVENTS = new Set(['PAYMENT_SUCCEEDED', 'INVOICE_COMPLETED'])

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get('content-length') || '0')
  if (Number.isFinite(contentLength) && contentLength > MAX_WEBHOOK_BYTES) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 })
  }

  const rawBody = await request.text()
  if (new TextEncoder().encode(rawBody).byteLength > MAX_WEBHOOK_BYTES) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 })
  }

  const signature = request.headers.get('x-webhook-signature')
  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: Record<string, unknown>
  try {
    payload = JSON.parse(rawBody) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const eventType = readString(payload.event_type)
  if (!eventType) return NextResponse.json({ error: 'Missing event type' }, { status: 400 })

  const payloadHash = createHash('sha256').update(rawBody).digest('hex')
  let event = await prisma.streamWebhookEvent.findUnique({ where: { payloadHash } })
  if (event?.status === 'PROCESSED') return NextResponse.json({ received: true, duplicate: true })

  if (!event) {
    try {
      event = await prisma.streamWebhookEvent.create({
        data: {
          payloadHash,
          eventType,
          entityType: readString(payload.entity_type),
          entityId: readString(payload.entity_id),
          providerTime: readDate(payload.timestamp),
        },
      })
    } catch {
      event = await prisma.streamWebhookEvent.findUnique({ where: { payloadHash } })
      if (event?.status === 'PROCESSED') return NextResponse.json({ received: true, duplicate: true })
    }
  } else if (event.status === 'FAILED') {
    event = await prisma.streamWebhookEvent.update({
      where: { id: event.id },
      data: { status: 'RECEIVED', lastError: null },
    })
  }

  if (!event) return NextResponse.json({ error: 'Could not record webhook' }, { status: 500 })

  try {
    const data = readObject(payload.data)
    const metadata = readObject(data?.metadata)
    const paymentLink = readObject(data?.payment_link)
    const invoice = readObject(data?.invoice)
    const payment = readObject(data?.payment)
    const orderId = readString(metadata?.platform_order_id)
    const paymentLinkId = readString(paymentLink?.id)

    const order = orderId
      ? await prisma.paymentOrder.findUnique({ where: { id: orderId } })
      : paymentLinkId
        ? await prisma.paymentOrder.findUnique({ where: { streamPaymentLinkId: paymentLinkId } })
        : null

    if (order && SUCCESS_EVENTS.has(eventType)) {
      const invoiceId = eventType === 'INVOICE_COMPLETED'
        ? readString(payload.entity_id)
        : readString(invoice?.id)
      const paymentId = eventType === 'PAYMENT_SUCCEEDED'
        ? readString(payload.entity_id)
        : readString(payment?.id)
      await reconcileStreamOrder({
        orderId: order.id,
        paymentLinkId,
        invoiceId,
        paymentId,
      })
    } else if (order && eventType === 'PAYMENT_REFUNDED') {
      const refundedPaymentId = readString(payload.entity_id) || readString(payment?.id)
      if (!refundedPaymentId) throw new Error('Refund webhook did not include a payment ID')
      await syncStreamRefund(order.id, refundedPaymentId)
    } else if (order && ['PAYMENT_LINK_PAY_ATTEMPT_FAILED', 'PAYMENT_FAILED', 'PAYMENT_CANCELED'].includes(eventType)) {
      await prisma.paymentOrder.update({
        where: { id: order.id },
        data: { lastError: `StreamPay event: ${eventType}` },
      })
    }

    await prisma.streamWebhookEvent.update({
      where: { id: event.id },
      data: {
        status: 'PROCESSED',
        processedAt: new Date(),
        paymentOrderId: order?.id || null,
        lastError: null,
      },
    })
    return NextResponse.json({ received: true })
  } catch (error) {
    await prisma.streamWebhookEvent.update({
      where: { id: event.id },
      data: { status: 'FAILED', lastError: safeErrorMessage(error) },
    })
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

function verifySignature(rawBody: string, header: string | null) {
  const secret = process.env.STREAMPAY_WEBHOOK_SECRET?.trim()
  if (!secret || secret.startsWith('replace_') || !header) return false

  const parts = Object.fromEntries(header.split(',').map(part => {
    const [key, ...rest] = part.trim().split('=')
    return [key, rest.join('=')]
  }))
  const timestamp = parts.t
  const received = parts.v1
  if (!/^\d{10}$/.test(timestamp || '') || !/^[0-9a-f]{64}$/i.test(received || '')) return false

  const tolerance = Math.min(
    Math.max(Number(process.env.STREAMPAY_WEBHOOK_TOLERANCE_SECONDS) || 600, 60),
    3600,
  )
  if (Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp)) > tolerance) return false

  const expected = createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest()
  const actual = Buffer.from(received, 'hex')
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

function readObject(value: unknown) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null
}

function readString(value: unknown) {
  return typeof value === 'string' && value.length <= 512 ? value : null
}

function readDate(value: unknown) {
  if (typeof value !== 'string') return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}
