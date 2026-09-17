import { timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'

import { expireStalePaymentOrders } from '@/lib/streampay/service'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(request: Request) {
  return runReconciliation(request)
}

export async function POST(request: Request) {
  return runReconciliation(request)
}

async function runReconciliation(request: Request) {
  if (!isAuthorized(request.headers.get('authorization'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const result = await expireStalePaymentOrders()
  return NextResponse.json({ ok: true, ...result })
}

/**
 * Accepts the dedicated reconciliation secret (the GitHub workflow) or Vercel's CRON_SECRET,
 * which Vercel Cron sends as a bearer token when that variable is set on the project.
 */
function isAuthorized(header: string | null) {
  if (!header?.startsWith('Bearer ')) return false
  const providedBytes = Buffer.from(header.slice(7))
  return [process.env.STREAMPAY_RECONCILE_SECRET, process.env.CRON_SECRET].some(value => {
    const secret = value?.trim()
    if (!secret || secret.startsWith('replace_')) return false
    const expectedBytes = Buffer.from(secret)
    return expectedBytes.length === providedBytes.length && timingSafeEqual(expectedBytes, providedBytes)
  })
}
