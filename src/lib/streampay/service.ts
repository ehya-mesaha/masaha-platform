import 'server-only'

import { Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { getSiteUrl } from '@/lib/site'
import {
  assertSafeCheckoutUrl,
  assertStreamPayConfigured,
  createStreamConsumer,
  createStreamPaymentLink,
  createStreamProduct,
  deactivateStreamPaymentLink,
  getStreamEnvironment,
  getStreamInvoice,
  getStreamOrganization,
  getStreamPayment,
  getStreamPaymentLink,
  listStreamConsumers,
  readDecimalHalalas,
  readHalalas,
  readInvoicePaidHalalas,
  readInvoiceRemainingHalalas,
  readInvoiceTotalHalalas,
  StreamPayError,
  type StreamInvoice,
  type StreamPayment,
  type StreamPaymentLink,
} from '@/lib/streampay/client'

type ReconcileInput = {
  orderId?: string
  checkoutToken?: string
  paymentLinkId?: string | null
  invoiceId?: string | null
  paymentId?: string | null
}

let environmentCheck: Promise<void> | null = null

export async function createCheckoutForOrder(orderId: string) {
  assertStreamPayConfigured()
  await assertExpectedStreamEnvironment()

  const order = await prisma.paymentOrder.findUnique({
    where: { id: orderId },
    include: {
      buyer: { select: { id: true, name: true, email: true, phone: true } },
      bookings: { include: { space: { select: { name: true } } } },
    },
  })
  if (!order) throw new StreamPayError('Payment order not found', 404, 'ORDER_NOT_FOUND')
  if (order.status === 'CHECKOUT_CREATED' && order.checkoutUrl) {
    return { checkoutUrl: order.checkoutUrl, checkoutToken: order.checkoutToken }
  }
  if (order.status !== 'PENDING') {
    throw new StreamPayError('Payment order cannot create a checkout', 409, 'INVALID_ORDER_STATUS')
  }
  if (order.expiresAt <= new Date()) {
    await expireOrder(order.id)
    throw new StreamPayError('The booking payment window has expired', 409, 'ORDER_EXPIRED')
  }

  let paymentLinkId: string | undefined
  try {
    const consumerId = await getOrCreateStreamConsumer(order.buyer)
    const spaceName = order.bookings[0]?.space.name || 'مساحة'
    const product = await createStreamProduct({
      orderId: order.id,
      name: `حجز ${spaceName}`,
      description: `حجز عبر منصة إحياء مساحة - رقم العملية ${order.id}`,
      amountHalalas: order.amountHalalas,
    })
    const paymentLink = await createStreamPaymentLink({
      orderId: order.id,
      checkoutToken: order.checkoutToken,
      consumerId,
      productId: product.id,
      expiresAt: order.expiresAt,
      siteUrl: getSiteUrl(),
    })
    paymentLinkId = paymentLink.id
    const checkoutUrl = assertSafeCheckoutUrl(paymentLink.url)

    await prisma.paymentOrder.update({
      where: { id: order.id },
      data: {
        status: 'CHECKOUT_CREATED',
        streamConsumerId: consumerId,
        streamProductId: product.id,
        streamPaymentLinkId: paymentLink.id,
        checkoutUrl,
        lastError: null,
      },
    })
    return { checkoutUrl, checkoutToken: order.checkoutToken }
  } catch (error) {
    if (paymentLinkId) {
      try {
        await deactivateStreamPaymentLink(paymentLinkId)
      } catch {
        // The reconciliation endpoint will find and handle any unresolved order later.
      }
    }
    const message = safeErrorMessage(error)
    await prisma.$transaction([
      prisma.paymentOrder.update({
        where: { id: order.id },
        data: { status: 'FAILED', failedAt: new Date(), lastError: message },
      }),
      prisma.booking.updateMany({
        where: { paymentOrderId: order.id, status: 'PENDING_PAYMENT' },
        data: { status: 'PAYMENT_FAILED' },
      }),
    ])
    throw error
  }
}

export async function reconcileStreamOrder(input: ReconcileInput) {
  assertStreamPayConfigured()
  if (!input.orderId && !input.checkoutToken) {
    throw new StreamPayError('Payment order identifier is required', 400, 'ORDER_ID_REQUIRED')
  }
  const order = await prisma.paymentOrder.findFirst({
    where: input.orderId ? { id: input.orderId } : { checkoutToken: input.checkoutToken },
    include: {
      bookings: { include: { space: { select: { id: true, name: true, sellerId: true } } } },
    },
  })
  if (!order) throw new StreamPayError('Payment order not found', 404, 'ORDER_NOT_FOUND')
  if (order.status === 'PAID') return { order, result: 'paid' as const }
  if (order.status === 'REFUND_PENDING') return { order, result: 'refund_pending' as const }
  if (!order.streamPaymentLinkId) {
    return { order, result: 'pending' as const }
  }
  if (input.paymentLinkId && input.paymentLinkId !== order.streamPaymentLinkId) {
    throw new StreamPayError('Payment link does not match this order', 400, 'PAYMENT_MISMATCH')
  }

  const link = await getStreamPaymentLink(order.streamPaymentLinkId)
  verifyPaymentLink(order, link)
  if (link.status !== 'COMPLETED') {
    return { order, result: 'pending' as const }
  }
  if (!input.invoiceId) {
    await prisma.paymentOrder.update({
      where: { id: order.id },
      data: { lastError: 'StreamPay completed the link, but no invoice ID was available for final verification.' },
    })
    return { order, result: 'pending' as const }
  }

  const invoice = await getStreamInvoice(input.invoiceId)
  verifyInvoice(order, invoice)
  let payment: StreamPayment | null = null
  if (input.paymentId) {
    payment = await getStreamPayment(input.paymentId)
    verifyPayment(order, invoice, payment)
  }

  const result = await confirmPaidOrder({
    orderId: order.id,
    invoiceId: invoice.id,
    paymentId: payment?.id || input.paymentId || null,
  })
  const updated = await prisma.paymentOrder.findUniqueOrThrow({ where: { id: order.id } })
  return { order: updated, result }
}

export async function getPaymentOrderStatus(checkoutToken: string, buyerId: string) {
  const order = await prisma.paymentOrder.findFirst({
    where: { checkoutToken, buyerId },
    select: {
      id: true,
      status: true,
      expiresAt: true,
      checkoutToken: true,
      checkoutUrl: true,
      bookings: { select: { id: true }, take: 1 },
    },
  })
  if (!order) return null
  if (['PENDING', 'CHECKOUT_CREATED'].includes(order.status) && order.expiresAt <= new Date()) {
    await expireOrder(order.id)
    return { ...order, status: 'EXPIRED' as const }
  }
  return order
}

export async function expireStalePaymentOrders(limit = 50) {
  const orders = await prisma.paymentOrder.findMany({
    where: { status: { in: ['PENDING', 'CHECKOUT_CREATED'] }, expiresAt: { lte: new Date() } },
    orderBy: { expiresAt: 'asc' },
    take: Math.min(Math.max(limit, 1), 100),
  })
  const results = { expired: 0, heldForReview: 0 }
  for (const order of orders) {
    if (order.streamPaymentLinkId) {
      try {
        const link = await getStreamPaymentLink(order.streamPaymentLinkId)
        const collected = Number.isSafeInteger(link.amount_collected_in_smallest_unit)
          ? link.amount_collected_in_smallest_unit!
          : 0
        if (link.status === 'COMPLETED' || collected > 0) {
          await prisma.paymentOrder.update({
            where: { id: order.id },
            data: { lastError: 'Expired locally but StreamPay reports collected funds; manual reconciliation is required.' },
          })
          results.heldForReview += 1
          continue
        }
        if (link.status === 'ACTIVE') await deactivateStreamPaymentLink(order.streamPaymentLinkId)
      } catch (error) {
        await prisma.paymentOrder.update({
          where: { id: order.id },
          data: { lastError: `Expiry check failed: ${safeErrorMessage(error)}` },
        })
        results.heldForReview += 1
        continue
      }
    }
    await expireOrder(order.id)
    results.expired += 1
  }
  return results
}

export async function syncStreamRefund(orderId: string, paymentId: string) {
  const [order, payment] = await Promise.all([
    prisma.paymentOrder.findUnique({ where: { id: orderId } }),
    getStreamPayment(paymentId),
  ])
  if (!order) throw new StreamPayError('Payment order not found', 404, 'ORDER_NOT_FOUND')
  if (payment.currency !== order.currency || readHalalas(payment) !== order.amountHalalas) {
    throw new StreamPayError('Refund payment does not match the order', 409, 'PAYMENT_MISMATCH')
  }
  const refundedHalalas = readDecimalHalalas(payment.amount_refunded, 'payment refunded amount')
  if (refundedHalalas < 1 || refundedHalalas > order.amountHalalas) {
    throw new StreamPayError('Invalid refunded amount from StreamPay', 409, 'PAYMENT_MISMATCH')
  }

  await prisma.$transaction(async tx => {
    const newlyRefundedHalalas = refundedHalalas - order.refundedHalalas
    await tx.paymentOrder.update({
      where: { id: order.id },
      data: {
        refundedHalalas,
        status: refundedHalalas === order.amountHalalas ? 'REFUNDED' : 'PARTIALLY_REFUNDED',
      },
    })
    if (newlyRefundedHalalas <= 0) return
    const matchingRequest = await tx.paymentRefund.findFirst({
      where: {
        paymentOrderId: order.id,
        amountHalalas: newlyRefundedHalalas,
        status: { in: ['PENDING', 'PROCESSING'] },
      },
      orderBy: { requestedAt: 'asc' },
    })
    if (matchingRequest) {
      await tx.paymentRefund.update({
        where: { id: matchingRequest.id },
        data: { status: 'COMPLETED', processedAt: new Date(), lastError: null },
      })
    } else {
      await tx.paymentRefund.create({
        data: {
          paymentOrderId: order.id,
          amountHalalas: newlyRefundedHalalas,
          status: 'COMPLETED',
          reason: 'STREAMPAY_REFUND_WEBHOOK',
          note: 'Refund observed from StreamPay and synchronized automatically.',
          processedAt: new Date(),
        },
      })
    }
  })
}

async function assertExpectedStreamEnvironment() {
  if (!environmentCheck) {
    environmentCheck = (async () => {
      const response = await getStreamOrganization()
      const organization = response.organization
      const sandbox = organization && typeof organization === 'object'
        ? (organization as Record<string, unknown>).sandbox
        : undefined
      if (typeof sandbox !== 'boolean') {
        throw new StreamPayError('Could not verify whether the StreamPay account is sandbox or live', 502, 'INVALID_PROVIDER_RESPONSE')
      }
      const expectedSandbox = getStreamEnvironment() === 'sandbox'
      if (sandbox !== expectedSandbox) {
        throw new StreamPayError(
          `StreamPay environment mismatch: expected ${expectedSandbox ? 'sandbox' : 'live'}`,
          503,
          'ENVIRONMENT_MISMATCH',
        )
      }
    })().catch(error => {
      environmentCheck = null
      throw error
    })
  }
  return environmentCheck
}

async function getOrCreateStreamConsumer(user: { id: string; name: string; email: string; phone: string | null }) {
  const environment = getStreamEnvironment()
  const existing = await prisma.paymentProviderCustomer.findUnique({
    where: { provider_environment_userId: { provider: 'STREAMPAY', environment, userId: user.id } },
  })
  if (existing) return existing.providerCustomerId

  let consumerId: string
  try {
    const created = await createStreamConsumer({
      name: user.name,
      email: user.email,
      phoneNumber: normalizeSaudiPhone(user.phone),
      externalId: user.id,
    })
    consumerId = created.id
  } catch (error) {
    if (!(error instanceof StreamPayError) || error.code !== 'DUPLICATE_CONSUMER') throw error
    const listed = await listStreamConsumers(user.email)
    const match = listed.data?.find(item => item.external_id === user.id || item.email === user.email)
    if (!match) throw error
    consumerId = match.id
  }

  const mapping = await prisma.paymentProviderCustomer.upsert({
    where: { provider_environment_userId: { provider: 'STREAMPAY', environment, userId: user.id } },
    create: { provider: 'STREAMPAY', environment, userId: user.id, providerCustomerId: consumerId },
    update: { providerCustomerId: consumerId },
  })
  return mapping.providerCustomerId
}

function verifyPaymentLink(order: { amountHalalas: number; currency: string; streamConsumerId: string | null }, link: StreamPaymentLink) {
  if (link.currency !== order.currency || readHalalas(link) !== order.amountHalalas) {
    throw new StreamPayError('Payment link amount or currency mismatch', 409, 'PAYMENT_MISMATCH')
  }
  if (order.streamConsumerId && link.organization_consumer_id && link.organization_consumer_id !== order.streamConsumerId) {
    throw new StreamPayError('Payment customer mismatch', 409, 'PAYMENT_MISMATCH')
  }
  if (link.status === 'COMPLETED') {
    if (!Number.isSafeInteger(link.amount_collected_in_smallest_unit)) {
      throw new StreamPayError('Completed payment link is missing the collected amount', 502, 'INVALID_PROVIDER_RESPONSE')
    }
    if (link.amount_collected_in_smallest_unit !== order.amountHalalas) {
      throw new StreamPayError('Collected payment amount mismatch', 409, 'PAYMENT_MISMATCH')
    }
  }
}

function verifyInvoice(order: { amountHalalas: number; currency: string; streamPaymentLinkId: string | null }, invoice: StreamInvoice) {
  if (invoice.status !== 'COMPLETED') {
    throw new StreamPayError('StreamPay invoice is not completed', 409, 'PAYMENT_NOT_COMPLETED')
  }
  if (invoice.currency !== order.currency || readInvoiceTotalHalalas(invoice) !== order.amountHalalas) {
    throw new StreamPayError('Invoice amount or currency mismatch', 409, 'PAYMENT_MISMATCH')
  }
  if (readInvoicePaidHalalas(invoice) !== order.amountHalalas || readInvoiceRemainingHalalas(invoice) !== 0) {
    throw new StreamPayError('Invoice is not fully paid', 409, 'PAYMENT_NOT_COMPLETED')
  }
  if (readDecimalHalalas(invoice.total_refunded, 'invoice refunded amount') !== 0) {
    throw new StreamPayError('Invoice was already refunded', 409, 'PAYMENT_MISMATCH')
  }
  if (invoice.no_of_payments !== null && invoice.no_of_payments !== undefined && invoice.no_of_payments !== 1) {
    throw new StreamPayError('Installment invoices are not accepted for bookings', 409, 'PAYMENT_MISMATCH')
  }
  if (invoice.payment_link_id && invoice.payment_link_id !== order.streamPaymentLinkId) {
    throw new StreamPayError('Invoice payment link mismatch', 409, 'PAYMENT_MISMATCH')
  }
}

function verifyPayment(order: { amountHalalas: number; currency: string }, invoice: StreamInvoice, payment: StreamPayment) {
  if (!['SUCCEEDED', 'SETTLED'].includes(payment.current_status || '')) {
    throw new StreamPayError('StreamPay payment is not successful', 409, 'PAYMENT_NOT_COMPLETED')
  }
  if (payment.currency !== order.currency || readHalalas(payment) !== order.amountHalalas) {
    throw new StreamPayError('Payment amount or currency mismatch', 409, 'PAYMENT_MISMATCH')
  }
  if (payment.invoice_id && payment.invoice_id !== invoice.id) {
    throw new StreamPayError('Payment invoice mismatch', 409, 'PAYMENT_MISMATCH')
  }
}

async function confirmPaidOrder(input: { orderId: string; invoiceId: string; paymentId: string | null }) {
  return prisma.$transaction(async tx => {
    const order = await tx.paymentOrder.findUnique({
      where: { id: input.orderId },
      include: { bookings: { include: { space: { select: { id: true, name: true, sellerId: true } } } } },
    })
    if (!order) throw new StreamPayError('Payment order not found', 404, 'ORDER_NOT_FOUND')
    if (order.status === 'PAID') return 'paid' as const

    const spaceIds = Array.from(new Set(order.bookings.map(booking => booking.spaceId))).sort()
    for (const spaceId of spaceIds) {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${spaceId}))`
    }

    const bookingIds = order.bookings.map(booking => booking.id)
    for (const booking of order.bookings) {
      const conflict = await tx.booking.findFirst({
        where: {
          id: { notIn: bookingIds },
          unitId: booking.unitId,
          status: 'CONFIRMED',
          startTime: { lt: booking.endTime },
          endTime: { gt: booking.startTime },
        },
        select: { id: true },
      })
      if (conflict) {
        await tx.paymentOrder.update({
          where: { id: order.id },
          data: {
            status: 'REFUND_PENDING',
            paidAt: new Date(),
            streamInvoiceId: input.invoiceId,
            streamPaymentId: input.paymentId,
            lastError: 'A booking conflict was detected after payment; full refund required.',
          },
        })
        await tx.booking.updateMany({
          where: { paymentOrderId: order.id, status: 'PENDING_PAYMENT' },
          data: { status: 'PAYMENT_FAILED' },
        })
        await tx.paymentRefund.create({
          data: {
            paymentOrderId: order.id,
            amountHalalas: order.amountHalalas,
            reason: 'BOOKING_CONFLICT_AFTER_PAYMENT',
            note: 'Full refund must be processed by the platform team.',
          },
        })
        return 'refund_pending' as const
      }
    }

    await tx.paymentOrder.update({
      where: { id: order.id },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        streamInvoiceId: input.invoiceId,
        streamPaymentId: input.paymentId,
        lastError: null,
      },
    })
    await tx.booking.updateMany({
      where: { paymentOrderId: order.id, status: 'PENDING_PAYMENT' },
      data: { status: 'CONFIRMED' },
    })

    const sellerNotices = new Map<string, { name: string; bookingId: string; count: number }>()
    for (const booking of order.bookings) {
      const current = sellerNotices.get(booking.space.sellerId)
      sellerNotices.set(booking.space.sellerId, {
        name: booking.space.name,
        bookingId: booking.id,
        count: (current?.count || 0) + 1,
      })
    }
    await tx.notification.createMany({
      data: [
        ...Array.from(sellerNotices.entries()).map(([userId, notice]) => ({
          userId,
          title: 'حجز جديد مؤكد ومدفوع',
          message: `تم تأكيد ${notice.count.toLocaleString('en-US')} جلسة مدفوعة في ${notice.name}.`,
          href: `/seller/bookings/${notice.bookingId}`,
        })),
        {
          userId: order.buyerId,
          title: 'تم تأكيد الدفع والحجز',
          message: 'تم التحقق من عملية الدفع وتأكيد حجزك بنجاح.',
          href: `/buyer/bookings/${order.bookings[0]?.id || ''}`,
        },
      ],
    })
    return 'paid' as const
  }, {
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    maxWait: 10_000,
    timeout: 20_000,
  })
}

async function expireOrder(orderId: string) {
  await prisma.$transaction([
    prisma.paymentOrder.updateMany({
      where: { id: orderId, status: { in: ['PENDING', 'CHECKOUT_CREATED'] } },
      data: { status: 'EXPIRED', lastError: null },
    }),
    prisma.booking.updateMany({
      where: { paymentOrderId: orderId, status: 'PENDING_PAYMENT' },
      data: { status: 'PAYMENT_EXPIRED' },
    }),
  ])
}

function normalizeSaudiPhone(phone: string | null) {
  if (!phone) return undefined
  const digits = phone.replace(/\D/g, '')
  const normalized = digits.startsWith('00966')
    ? `+${digits.slice(2)}`
    : digits.startsWith('966')
      ? `+${digits}`
      : digits.startsWith('05')
        ? `+966${digits.slice(1)}`
        : digits.startsWith('5')
          ? `+966${digits}`
          : undefined
  return normalized && /^\+\d{8,15}$/.test(normalized) ? normalized : undefined
}

export function safeErrorMessage(error: unknown) {
  return error instanceof Error ? error.message.slice(0, 500) : 'Unknown payment error'
}
