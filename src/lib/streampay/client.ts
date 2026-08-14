import 'server-only'

const STREAM_API_BASE_URL = 'https://stream-app-service.streampay.sa/api/v2'
const REQUEST_TIMEOUT_MS = 15_000

type StreamObject = Record<string, unknown>

export class StreamPayError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message)
    this.name = 'StreamPayError'
  }
}

export type StreamPaymentLink = StreamObject & {
  id: string
  url: string
  status?: string
  currency?: string
  amount?: string
  amount_in_smallest_unit?: number
  amount_collected_in_smallest_unit?: number
  organization_consumer_id?: string | null
}

export type StreamInvoice = StreamObject & {
  id: string
  status?: string
  currency?: string
  total_amount?: string
  total_amount_in_smallest_unit?: number
  paid_amount?: string
  paid_amount_in_smallest_unit?: number
  remaining_amount?: string
  remaining_amount_in_smallest_unit?: number
  total_refunded?: string
  net_received?: string
  no_of_payments?: number | null
  payment_link_id?: string | null
}

export type StreamPayment = StreamObject & {
  id: string
  current_status?: string
  currency?: string
  amount?: string
  amount_in_smallest_unit?: number
  amount_refunded?: string
  invoice_id?: string | null
}

export function getStreamEnvironment() {
  const raw = process.env.STREAMPAY_EXPECTED_SANDBOX?.trim().toLowerCase()
  if (raw !== 'true' && raw !== 'false') {
    throw new StreamPayError('STREAMPAY_EXPECTED_SANDBOX must be true or false', 503, 'NOT_CONFIGURED')
  }
  return raw === 'true' ? 'sandbox' : 'live'
}

export function assertStreamPayConfigured() {
  const apiKey = process.env.STREAMPAY_X_API_KEY?.trim()
  if (!apiKey || apiKey.startsWith('replace_')) {
    throw new StreamPayError('StreamPay is not configured yet', 503, 'NOT_CONFIGURED')
  }
  getStreamEnvironment()
}

function getHeaders() {
  assertStreamPayConfigured()
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'x-api-key': process.env.STREAMPAY_X_API_KEY!.trim(),
  }
  const branchId = process.env.STREAMPAY_BRANCH_ID?.trim()
  if (branchId && !branchId.startsWith('replace_')) headers['x-branch-id'] = branchId
  return headers
}

async function streamRequest<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${STREAM_API_BASE_URL}${path}`, {
      ...init,
      headers: { ...getHeaders(), ...(init?.headers || {}) },
      cache: 'no-store',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
  } catch (error) {
    const message = error instanceof Error && error.name === 'TimeoutError'
      ? 'StreamPay request timed out'
      : 'Could not reach StreamPay'
    throw new StreamPayError(message, 502, 'NETWORK_ERROR')
  }

  const raw = await response.text()
  let body: StreamObject | null = null
  if (raw) {
    try {
      body = JSON.parse(raw) as StreamObject
    } catch {
      body = null
    }
  }

  if (!response.ok) {
    const code = typeof body?.code === 'string' ? body.code : undefined
    const detail = typeof body?.message === 'string'
      ? body.message
      : typeof body?.detail === 'string'
        ? body.detail
        : `StreamPay returned ${response.status}`
    throw new StreamPayError(detail.slice(0, 300), response.status, code)
  }

  return body as T
}

export async function getStreamOrganization() {
  return streamRequest<StreamObject>('/me')
}

export async function createStreamConsumer(input: {
  name: string
  email?: string
  phoneNumber?: string
  externalId: string
}) {
  return streamRequest<StreamObject & { id: string }>('/consumers', {
    method: 'POST',
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      phone_number: input.phoneNumber,
      external_id: input.externalId,
      communication_methods: input.email ? ['EMAIL'] : undefined,
    }),
  })
}

export async function listStreamConsumers(searchTerm: string) {
  const params = new URLSearchParams({ page: '1', limit: '100', search_term: searchTerm })
  return streamRequest<{ data?: Array<StreamObject & { id: string }> }>(`/consumers?${params}`)
}

export async function createStreamProduct(input: {
  orderId: string
  name: string
  description: string
  amountHalalas: number
}) {
  return streamRequest<StreamObject & { id: string }>('/products', {
    method: 'POST',
    body: JSON.stringify({
      name: input.name.slice(0, 160),
      description: input.description.slice(0, 512),
      type: 'ONE_OFF',
      is_one_time: true,
      prices: [{
        currency: 'SAR',
        amount: formatHalalas(input.amountHalalas),
        is_price_inclusive_of_vat: true,
        is_price_exempt_from_vat: false,
      }],
      external_metadata: {
        platform: 'ehya_masaha',
        platform_order_id: input.orderId,
      },
    }),
  })
}

export async function createStreamPaymentLink(input: {
  orderId: string
  checkoutToken: string
  consumerId: string
  productId: string
  expiresAt: Date
  siteUrl: string
}) {
  const returnUrl = `${input.siteUrl}/payment/stream/return?token=${encodeURIComponent(input.checkoutToken)}`
  return streamRequest<StreamPaymentLink>('/payment_links', {
    method: 'POST',
    body: JSON.stringify({
      name: `Masaha booking ${input.orderId}`.slice(0, 160),
      description: `Payment for Masaha booking order ${input.orderId}`.slice(0, 512),
      items: [{ product_id: input.productId, quantity: 1 }],
      contact_information_type: 'EMAIL',
      currency: 'SAR',
      max_number_of_payments: 1,
      valid_until: input.expiresAt.toISOString(),
      organization_consumer_id: input.consumerId,
      success_redirect_url: `${returnUrl}&outcome=success`,
      failure_redirect_url: `${returnUrl}&outcome=failure`,
      custom_metadata: {
        platform: 'ehya_masaha',
        platform_order_id: input.orderId,
      },
    }),
  })
}

export async function getStreamPaymentLink(id: string) {
  return streamRequest<StreamPaymentLink>(`/payment_links/${encodeURIComponent(id)}`)
}

export async function getStreamInvoice(id: string) {
  return streamRequest<StreamInvoice>(`/invoices/${encodeURIComponent(id)}`)
}

export async function getStreamPayment(id: string) {
  return streamRequest<StreamPayment>(`/payments/${encodeURIComponent(id)}`)
}

export async function deactivateStreamPaymentLink(id: string) {
  return streamRequest<StreamPaymentLink>(`/payment_links/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({
      status: 'INACTIVE',
      deactivate_message: 'انتهت مهلة إتمام الحجز. يرجى إنشاء حجز جديد.',
    }),
  })
}

export function formatHalalas(amountHalalas: number) {
  if (!Number.isSafeInteger(amountHalalas) || amountHalalas < 1) {
    throw new StreamPayError('Invalid payment amount', 400, 'INVALID_AMOUNT')
  }
  return (amountHalalas / 100).toFixed(2)
}

export function readHalalas(value: StreamObject) {
  if (Number.isSafeInteger(value.amount_in_smallest_unit)) {
    return value.amount_in_smallest_unit as number
  }
  if (typeof value.amount === 'string' && /^\d+(\.\d{1,2})?$/.test(value.amount)) {
    return Math.round(Number(value.amount) * 100)
  }
  throw new StreamPayError('StreamPay response did not include a valid amount', 502, 'INVALID_PROVIDER_RESPONSE')
}

export function readInvoiceTotalHalalas(invoice: StreamInvoice) {
  if (Number.isSafeInteger(invoice.total_amount_in_smallest_unit)) {
    return invoice.total_amount_in_smallest_unit as number
  }
  return readDecimalHalalas(invoice.total_amount, 'invoice total')
}

export function readInvoicePaidHalalas(invoice: StreamInvoice) {
  if (Number.isSafeInteger(invoice.paid_amount_in_smallest_unit)) {
    return invoice.paid_amount_in_smallest_unit as number
  }
  return readDecimalHalalas(invoice.paid_amount, 'invoice paid amount')
}

export function readInvoiceRemainingHalalas(invoice: StreamInvoice) {
  if (Number.isSafeInteger(invoice.remaining_amount_in_smallest_unit)) {
    return invoice.remaining_amount_in_smallest_unit as number
  }
  return readDecimalHalalas(invoice.remaining_amount, 'invoice remaining amount')
}

export function readDecimalHalalas(value: unknown, fieldName: string) {
  if (typeof value === 'string' && /^\d+(\.\d{1,2})?$/.test(value)) {
    return Math.round(Number(value) * 100)
  }
  throw new StreamPayError(`StreamPay response did not include a valid ${fieldName}`, 502, 'INVALID_PROVIDER_RESPONSE')
}

export function assertSafeCheckoutUrl(rawUrl: string) {
  let url: URL
  try {
    url = new URL(rawUrl)
  } catch {
    throw new StreamPayError('StreamPay returned an invalid checkout URL', 502, 'INVALID_PROVIDER_RESPONSE')
  }
  const safeHost = url.hostname === 'streampay.sa' || url.hostname.endsWith('.streampay.sa')
  if (url.protocol !== 'https:' || !safeHost) {
    throw new StreamPayError('StreamPay returned an unsafe checkout URL', 502, 'INVALID_PROVIDER_RESPONSE')
  }
  url.searchParams.set('language', 'ar')
  return url.toString()
}
