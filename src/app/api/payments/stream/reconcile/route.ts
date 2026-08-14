import { timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'

import { expireStalePaymentOrders } from '@/lib/streampay/service'

export const runtime = 'nodejs'

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

function isAuthorized(header: string | null) {
  const secret = process.env.STREAMPAY_RECONCILE_SECRET?.trim()
  if (!secret || secret.startsWith('replace_') || !header?.startsWith('Bearer ')) return false
  const provided = header.slice(7)
  const expectedBytes = Buffer.from(secret)
  const providedBytes = Buffer.from(provided)
  return expectedBytes.length === providedBytes.length && timingSafeEqual(expectedBytes, providedBytes)
}
