import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

const ALLOWED_TYPES = new Set(['INQUIRY', 'SUGGESTION', 'COMPLAINT'])

function text(value: unknown, max = 5000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const type = text(body.type, 32)
    const name = text(body.name, 120)
    const email = text(body.email, 180).toLowerCase()
    const phone = text(body.phone, 30)
    const subject = text(body.subject, 180)
    const message = text(body.message)

    if (!ALLOWED_TYPES.has(type) || !name || !email.includes('@') || message.length < 5) {
      return NextResponse.json({ error: 'يرجى تعبئة البيانات المطلوبة بشكل صحيح' }, { status: 400 })
    }

    const user = await getCurrentUser()
    const created = await prisma.contactMessage.create({
      data: {
        type: type as 'INQUIRY' | 'SUGGESTION' | 'COMPLAINT',
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
        userId: typeof user?.id === 'string' ? user.id : null,
      },
      select: { id: true },
    })

    return NextResponse.json({ id: created.id }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'تعذر إرسال الرسالة' }, { status: 500 })
  }
}
