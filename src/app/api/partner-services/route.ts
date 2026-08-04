import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  return NextResponse.json(
    await prisma.partnerService.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] }),
    { headers: { 'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600' } },
  )
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'BUYER') return NextResponse.json({ error: 'سجّل الدخول كطالب مساحة' }, { status: 401 })
  const { items, notes, bookingId } = await request.json()
  if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: 'اختر خدمة واحدة على الأقل' }, { status: 400 })
  const serviceIds = items.map((item: { serviceId: string }) => item.serviceId)
  const services = await prisma.partnerService.findMany({ where: { id: { in: serviceIds }, isActive: true } })
  if (services.length !== new Set(serviceIds).size) return NextResponse.json({ error: 'إحدى الخدمات غير متاحة' }, { status: 400 })
  const byId = new Map(services.map((service) => [service.id, service]))
  const estimatedTotal = items.reduce((total: number, item: { serviceId: string; quantity?: number }) => total + (byId.get(item.serviceId)?.indicativePrice || 0) * Math.max(Number(item.quantity) || 1, 1), 0)
  const requestRow = await prisma.partnerServiceRequest.create({
    data: {
      publicRef: `SR-${Date.now().toString(36).toUpperCase()}`,
      buyerId: String(user.id),
      bookingId: bookingId || null,
      notes: notes || null,
      status: 'UNDER_REVIEW',
      estimatedTotal,
      items: { create: items.map((item: { serviceId: string; quantity?: number; details?: string }) => ({ serviceId: item.serviceId, quantity: Math.max(Number(item.quantity) || 1, 1), details: item.details || null, estimatedPrice: byId.get(item.serviceId)?.indicativePrice })) },
    },
  })
  return NextResponse.json(requestRow, { status: 201 })
}
