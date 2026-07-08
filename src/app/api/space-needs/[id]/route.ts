import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

const VALID_STATUSES = ['NEW', 'IN_REVIEW', 'MATCHED', 'CLOSED']

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const status = typeof body.status === 'string' ? body.status : ''
    const adminNote = typeof body.adminNote === 'string' ? body.adminNote.trim() : ''

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'حالة الطلب غير صحيحة' }, { status: 400 })
    }

    const request = await prisma.spaceNeedRequest.update({
      where: { id },
      data: { status, adminNote: adminNote || null },
      include: {
        buyer: { select: { name: true, email: true, phone: true } },
        type: { select: { name: true } },
      },
    })

    return NextResponse.json({ request })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ أثناء تحديث الطلب' }, { status: 500 })
  }
}
