import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const { id } = await params
    const { status, adminNotes } = await req.json()

    const validStatuses = ['APPROVED', 'REJECTED', 'INACTIVE', 'PENDING_REVIEW']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'الحالة غير صحيحة' }, { status: 400 })
    }

    const space = await prisma.space.update({
      where: { id },
      data: { status, adminNotes },
    })

    return NextResponse.json({ space })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
