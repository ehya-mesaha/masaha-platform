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
  listCompletedStreamInvoicesForLink,
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
import { confirmCouponRedemption, releaseCouponRedemption, releaseCouponRedemptionArgs } from '@/lib/coupons'

type ReconcileInput = {
  orderId?: string
  checkoutToken?: string
  paymentLinkId?: string | null
  invoiceId?: string | null
  paymentId?: string | null
}

export type ReconcileResult = 'paid' | 'refund_pending' | 'pending'

/** Bookings a payment can still confirm. Expired or failed holds come back if money arrives. */
const CONFIRMABLE_BOOKING_STATUSES = ['PENDING_PAYMENT', 'PAYMENT_EXPIRED', 'PAYMENT_FAILED'] as const

/** Consumer creation errors that mean "this person already exists at StreamPay". */
const EXISTING_CONSUMER_CODES = new Set(['DUPLICATE_CONSUMER', 'PHONE_ALREADY_REGISTERED', 'RESOURCE_ALREADY_EXISTS'])

let environmentCheck: Promise<void> | null = null

export async function createCheckoutForOrder(orderId: string) {
  assertStreamPayConfigured()
  await assertExpectedStreamEnvironment()

  const order = await prisma.paymentOrder.findUnique({
    where: { id: orderId },
    include: {
      buyer: { select: { id: true, name: true, email: true, phone: true } },
      bookings: { take: 1, select: { space: { select: { name: true } } } },
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
    const spaceName = order.bookings[0]?.space.name || 'مساحة'
    // Independent of each other, so they go out together rather than one after the other.
    const [consumerId, product] = await Promise.all([
      getStreamConsumerForCheckout(order.buyer),
      createStreamProduct({
        orderId: order.id,
        name: `حجز ${spaceName}`,
        description: `حجز عبر منصة إحياء مساحة - رقم العملية ${order.id}`,
        amountHalalas: order.amountHalalas,
      }),
    ])
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
    console.error('StreamPay checkout creation failed', { orderId: order.id, error })
    if (paymentLinkId) {
      try {
        await deactivateStreamPaymentLink(paymentLinkId)
      } catch {
        // The reconciliation endpoint will find and handle any unresolved order later.
      }
    }
    const message = safeErrorMessage(error)
    // Batched, not interactive: an interactive transaction here would run on Prisma's 5s
    // default and, on expiry, throw over the StreamPay error the caller needs to report.
    try {
      await prisma.$transaction([
        prisma.paymentOrder.update({
          where: { id: order.id },
          data: { status: 'FAILED', failedAt: new Date(), lastError: message },
        }),
        prisma.booking.updateMany({
          where: { paymentOrderId: order.id, status: 'PENDING_PAYMENT' },
          data: { status: 'PAYMENT_FAILED' },
        }),
        prisma.couponRedemption.updateMany(releaseCouponRedemptionArgs(order.id)),
      ])
    } catch (cleanupError) {
      // Reconciliation picks the order up later; the original failure is what matters here.
      console.error('Failed to mark payment order as failed', cleanupError)
    }
    throw error
  }
}

/**
 * Settles an order against what StreamPay actually holds. Confirmation rests on a COMPLETED,
 * fully paid invoice that belongs to this order's own payment link - never on the link's
 * status alone, because StreamPay also reports links that simply expired unpaid as
 * COMPLETED. The invoice is looked up by link when no ID is supplied, so this works the
 * same from a webhook, from the return page, or from the scheduled sweep.
 */
export async function reconcileStreamOrder(input: ReconcileInput): Promise<{ result: ReconcileResult }> {
  assertStreamPayConfigured()
  if (!input.orderId && !input.checkoutToken) {
    throw new StreamPayError('Payment order identifier is required', 400, 'ORDER_ID_REQUIRED')
  }
  const order = await prisma.paymentOrder.findFirst({
    where: input.orderId ? { id: input.orderId } : { checkoutToken: input.checkoutToken },
    select: { id: true, status: true, amountHalalas: true, currency: true, streamConsumerId: true, streamPaymentLinkId: true },
  })
  if (!order) throw new StreamPayError('Payment order not found', 404, 'ORDER_NOT_FOUND')
  const settled = settledResult(order.status)
  if (settled) return { result: settled }
  if (!order.streamPaymentLinkId) return { result: 'pending' }
  if (input.paymentLinkId && input.paymentLinkId !== order.streamPaymentLinkId) {
    throw new StreamPayError('Payment link does not match this order', 400, 'PAYMENT_MISMATCH')
  }

  const invoice = await findCompletedInvoice(order.streamPaymentLinkId, input.invoiceId)
  if (!invoice) return { result: 'pending' }

  const link = await getStreamPaymentLink(order.streamPaymentLinkId)
  const collectedNote = verifyPaymentLink(order, link)
  verifyInvoice(order, invoice)
  let payment: StreamPayment | null = null
  if (input.paymentId) {
    payment = await getStreamPayment(input.paymentId)
    verifyPayment(order, invoice, payment)
  }

  const result = await confirmPaidOrder({
    orderId: order.id,
    invoiceId: invoice.id,
    paymentId: payment?.id || firstSuccessfulPaymentId(invoice),
    note: collectedNote,
  })
  return { result }
}

/**
 * The buyer's view of their order, brought up to date with StreamPay first. The invoice is
 * found by payment link rather than taken from the return URL, which the buyer can edit,
 * so confirmation here needs no webhook and no trusted query string.
 */
export async function getPaymentOrderStatus(checkoutToken: string, buyerId: string) {
  const order = await findOwnedOrder(checkoutToken, buyerId)
  if (!order) return null
  const unresolved = ['PENDING', 'CHECKOUT_CREATED'].includes(order.status)
  if (unresolved && order.expiresAt <= new Date()) {
    await settleOrExpireOrder(order)
  } else if ((unresolved || order.status === 'EXPIRED') && order.streamPaymentLinkId) {
    try {
      await reconcileStreamOrder({ orderId: order.id })
    } catch (error) {
      console.error('StreamPay status verification failed', { orderId: order.id, error })
    }
  } else {
    return order
  }
  return findOwnedOrder(checkoutToken, buyerId)
}

function findOwnedOrder(checkoutToken: string, buyerId: string) {
  return prisma.paymentOrder.findFirst({
    where: { checkoutToken, buyerId },
    select: {
      id: true,
      status: true,
      expiresAt: true,
      checkoutToken: true,
      checkoutUrl: true,
      streamPaymentLinkId: true,
      bookings: { select: { id: true }, take: 1 },
    },
  })
}

export async function expireStalePaymentOrders(limit = 50) {
  const orders = await prisma.paymentOrder.findMany({
    where: { status: { in: ['PENDING', 'CHECKOUT_CREATED'] }, expiresAt: { lte: new Date() } },
    select: { id: true, streamPaymentLinkId: true },
    orderBy: { expiresAt: 'asc' },
    take: Math.min(Math.max(limit, 1), 100),
  })
  const results = { expired: 0, confirmed: 0, heldForReview: 0 }
  for (const order of orders) {
    const outcome = await settleOrExpireOrder(order)
    if (outcome === 'expired') results.expired += 1
    else if (outcome === 'held') results.heldForReview += 1
    else results.confirmed += 1
  }
  return results
}

/**
 * Closes an order whose payment window has passed. A payment that did land is confirmed
 * rather than thrown away; otherwise the link is switched off at StreamPay (which keeps
 * links open longer than we ask) and the hold is released. Anything uncertain - money
 * collected without a completed invoice, or StreamPay unreachable - is left for review.
 */
async function settleOrExpireOrder(order: { id: string; streamPaymentLinkId: string | null }) {
  if (order.streamPaymentLinkId) {
    try {
      const { result } = await reconcileStreamOrder({ orderId: order.id })
      if (result !== 'pending') return result
      const link = await getStreamPaymentLink(order.streamPaymentLinkId)
      const collected = Number.isSafeInteger(link.amount_collected_in_smallest_unit) ? link.amount_collected_in_smallest_unit! : 0
      if (collected > 0) {
        await prisma.paymentOrder.update({
          where: { id: order.id },
          data: { lastError: 'StreamPay reports collected funds but no completed invoice yet; manual reconciliation may be required.' },
        })
        return 'held' as const
      }
      if (link.status === 'ACTIVE') await deactivateStreamPaymentLink(order.streamPaymentLinkId)
    } catch (error) {
      await prisma.paymentOrder.update({
        where: { id: order.id },
        data: { lastError: `Expiry check failed: ${safeErrorMessage(error)}` },
      })
      return 'held' as const
    }
  }
  await expireOrder(order.id)
  return 'expired' as const
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
  }, { maxWait: 15_000, timeout: 30_000 })
}

function settledResult(status: string): ReconcileResult | null {
  if (status === 'REFUND_PENDING') return 'refund_pending'
  if (['PAID', 'PARTIALLY_REFUNDED', 'REFUNDED'].includes(status)) return 'paid'
  return null
}

async function findCompletedInvoice(paymentLinkId: string, invoiceId?: string | null) {
  if (invoiceId) {
    const invoice = await getStreamInvoice(invoiceId)
    if (invoice.payment_link_id !== paymentLinkId) {
      throw new StreamPayError('Invoice payment link mismatch', 409, 'PAYMENT_MISMATCH')
    }
    if (invoice.status === 'COMPLETED') return invoice
  }
  const listed = await listCompletedStreamInvoicesForLink(paymentLinkId)
  const match = listed.data?.find(item => item.payment_link_id === paymentLinkId && item.status === 'COMPLETED')
  if (!match) return null
  // The list item is a summary; the verified figures come from the invoice itself.
  return getStreamInvoice(match.id)
}

function firstSuccessfulPaymentId(invoice: StreamInvoice) {
  const payments = Array.isArray(invoice.payments) ? invoice.payments as Array<Record<string, unknown>> : []
  const paid = payments.find(item => ['SUCCEEDED', 'SETTLED'].includes(String(item.current_status)))
  return typeof paid?.id === 'string' ? paid.id : null
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

/**
 * The StreamPay customer a link is issued to. A customer only saves the buyer from typing
 * their email on the checkout page, so no failure here is allowed to block the payment:
 * if StreamPay refuses to create or find one, the link is issued without it.
 */
async function getStreamConsumerForCheckout(user: { id: string; name: string; email: string; phone: string | null }) {
  try {
    return await getOrCreateStreamConsumer(user)
  } catch (error) {
    if (error instanceof StreamPayError && ['NETWORK_ERROR', 'NOT_CONFIGURED'].includes(error.code || '')) throw error
    if (error instanceof StreamPayError && (error.status === 401 || error.status === 403)) throw error
    console.error('StreamPay consumer unavailable; issuing the link without one', { userId: user.id, error })
    return null
  }
}

async function getOrCreateStreamConsumer(user: { id: string; name: string; email: string; phone: string | null }) {
  const environment = getStreamEnvironment()
  const existing = await prisma.paymentProviderCustomer.findUnique({
    where: { provider_environment_userId: { provider: 'STREAMPAY', environment, userId: user.id } },
  })
  if (existing) return existing.providerCustomerId

  const phoneNumber = normalizeSaudiPhone(user.phone)
  let consumerId: string
  try {
    consumerId = (await createStreamConsumer({ name: user.name, email: user.email, phoneNumber, externalId: user.id })).id
  } catch (error) {
    if (!(error instanceof StreamPayError) || !EXISTING_CONSUMER_CODES.has(error.code || '')) throw error
    // Someone at StreamPay already has this email or phone: usually this same buyer from an
    // earlier attempt, occasionally a second account sharing a phone number.
    const match = await findStreamConsumer(user, phoneNumber)
    if (match) {
      consumerId = match
    } else if (phoneNumber) {
      // The phone belongs to a different customer. The email is all checkout needs.
      consumerId = (await createStreamConsumer({ name: user.name, email: user.email, externalId: user.id })).id
    } else {
      throw error
    }
  }

  const mapping = await prisma.paymentProviderCustomer.upsert({
    where: { provider_environment_userId: { provider: 'STREAMPAY', environment, userId: user.id } },
    create: { provider: 'STREAMPAY', environment, userId: user.id, providerCustomerId: consumerId },
    update: { providerCustomerId: consumerId },
  })
  return mapping.providerCustomerId
}

async function findStreamConsumer(user: { id: string; email: string }, phoneNumber: string | undefined) {
  const email = user.email.trim().toLowerCase()
  for (const term of [user.email, phoneNumber]) {
    if (!term) continue
    const listed = await listStreamConsumers(term)
    const items = listed.data || []
    const match = items.find(item => item.external_id === user.id)
      || items.find(item => typeof item.email === 'string' && item.email.trim().toLowerCase() === email)
    if (match) return match.id
  }
  return null
}

/** Returns a note to keep on the order when the link collected more than it should have. */
function verifyPaymentLink(order: { amountHalalas: number; currency: string; streamConsumerId: string | null }, link: StreamPaymentLink) {
  if (link.currency !== order.currency || readHalalas(link) !== order.amountHalalas) {
    throw new StreamPayError('Payment link amount or currency mismatch', 409, 'PAYMENT_MISMATCH')
  }
  if (order.streamConsumerId && link.organization_consumer_id && link.organization_consumer_id !== order.streamConsumerId) {
    throw new StreamPayError('Payment customer mismatch', 409, 'PAYMENT_MISMATCH')
  }
  const collected = link.amount_collected_in_smallest_unit
  if (Number.isSafeInteger(collected) && collected! > order.amountHalalas) {
    return `StreamPay collected ${collected} halalas against ${order.amountHalalas}; check for a duplicate payment to refund.`
  }
  return null
}

function verifyInvoice(order: { amountHalalas: number; currency: string; streamPaymentLinkId: string | null }, invoice: StreamInvoice) {
  if (invoice.status !== 'COMPLETED') {
    throw new StreamPayError('StreamPay invoice is not completed', 409, 'PAYMENT_NOT_COMPLETED')
  }
  // Required, not merely compared when present: this binding is what stops a completed
  // invoice from some other payment being presented as payment for this order.
  if (!invoice.payment_link_id || invoice.payment_link_id !== order.streamPaymentLinkId) {
    throw new StreamPayError('Invoice payment link mismatch', 409, 'PAYMENT_MISMATCH')
  }
  if (invoice.currency !== order.currency || readInvoiceTotalHalalas(invoice) !== order.amountHalalas) {
    throw new StreamPayError('Invoice amount or currency mismatch', 409, 'PAYMENT_MISMATCH')
  }
  // Fully paid and nothing outstanding. This also covers instalments, which stay short of
  // the total until the last one lands. The count of payment rows is not checked: a
  // declined attempt followed by a successful one is still a single full payment.
  if (readInvoicePaidHalalas(invoice) !== order.amountHalalas || readInvoiceRemainingHalalas(invoice) !== 0) {
    throw new StreamPayError('Invoice is not fully paid', 409, 'PAYMENT_NOT_COMPLETED')
  }
  if (readDecimalHalalas(invoice.total_refunded ?? '0', 'invoice refunded amount') !== 0) {
    throw new StreamPayError('Invoice was already refunded', 409, 'PAYMENT_MISMATCH')
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

async function confirmPaidOrder(input: { orderId: string; invoiceId: string; paymentId: string | null; note: string | null }) {
  return prisma.$transaction(async tx => {
    // The webhook's two events and the buyer's return page routinely arrive together. The
    // row lock makes them take turns, and at READ COMMITTED the one that waited then reads
    // the order as PAID and stops, instead of confirming and notifying a second time.
    await tx.$queryRaw`SELECT "id" FROM "PaymentOrder" WHERE "id" = ${input.orderId} FOR UPDATE`
    const order = await tx.paymentOrder.findUnique({
      where: { id: input.orderId },
      include: { bookings: { include: { space: { select: { id: true, name: true, sellerId: true } } } } },
    })
    if (!order) throw new StreamPayError('Payment order not found', 404, 'ORDER_NOT_FOUND')
    const settled = settledResult(order.status)
    if (settled) return settled

    const spaceIds = Array.from(new Set(order.bookings.map(booking => booking.spaceId))).sort()
    for (const spaceId of spaceIds) {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${spaceId}))`
    }

    // A payment can land after the hold expired (StreamPay keeps links open past the window
    // we ask for), so expired and failed holds are confirmable too, provided the slot is
    // still free.
    const payable = order.bookings.filter(booking => (CONFIRMABLE_BOOKING_STATUSES as readonly string[]).includes(booking.status))
    const payableIds = payable.map(booking => booking.id)
    // One query for every session rather than one per session: a long programme would
    // otherwise spend its whole budget here while money sits unconfirmed.
    const conflict = payable.length > 0 && Boolean(await tx.booking.findFirst({
      where: {
        id: { notIn: payableIds },
        status: 'CONFIRMED',
        OR: payable.map(booking => ({
          unitId: booking.unitId,
          startTime: { lt: booking.endTime },
          endTime: { gt: booking.startTime },
        })),
      },
      select: { id: true },
    }))

    if (conflict || payable.length === 0) {
      await tx.paymentOrder.update({
        where: { id: order.id },
        data: {
          status: 'REFUND_PENDING',
          paidAt: new Date(),
          streamInvoiceId: input.invoiceId,
          streamPaymentId: input.paymentId,
          lastError: conflict
            ? 'A booking conflict was detected after payment; full refund required.'
            : 'Payment arrived for an order with no bookings left to confirm; full refund required.',
        },
      })
      await tx.booking.updateMany({
        where: { paymentOrderId: order.id, status: { in: [...CONFIRMABLE_BOOKING_STATUSES] } },
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
      // The booking is being refunded in full, so the buyer keeps the right to reuse the coupon.
      await releaseCouponRedemption(tx, order.id)
      return 'refund_pending' as const
    }

    await tx.paymentOrder.update({
      where: { id: order.id },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        streamInvoiceId: input.invoiceId,
        streamPaymentId: input.paymentId,
        lastError: input.note,
      },
    })
    await tx.booking.updateMany({
      where: { id: { in: payableIds } },
      data: { status: 'CONFIRMED' },
    })
    await confirmCouponRedemption(tx, order.id)

    const sellerNotices = new Map<string, { name: string; bookingId: string; count: number }>()
    for (const booking of payable) {
      const current = sellerNotices.get(booking.space.sellerId)
      sellerNotices.set(booking.space.sellerId, {
        name: booking.space.name,
        bookingId: current?.bookingId || booking.id,
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
          href: `/buyer/bookings/${payable[0].id}`,
        },
      ],
    })
    return 'paid' as const
  }, {
    // READ COMMITTED with explicit locks (the order row, then each space) rather than
    // SERIALIZABLE: a serializable snapshot is taken before the locks are granted, so a
    // confirmation that queued behind another would abort with a serialization failure.
    isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
    // Money has already been taken by the time this runs, so expiring here would leave a
    // paid order unconfirmed. It gets the same generous budget as booking creation.
    maxWait: 15_000,
    timeout: 60_000,
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
    prisma.couponRedemption.updateMany(releaseCouponRedemptionArgs(orderId)),
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
