import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { signEmailVerificationToken } from '@/lib/auth'
import { sendConfirmationEmail } from '@/lib/email'
import { getSiteUrl } from '@/lib/site'

const GENERIC_MESSAGE = 'إذا كان بريدك مسجلاً وغير مؤكد بعد، سيصلك رابط تأكيد جديد خلال دقائق.'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: 'يرجى إدخال البريد الإلكتروني' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email: String(email).trim().toLowerCase() } })
    // Always respond with the same generic message so this endpoint can't be used to check which emails are registered.
    if (!user || user.emailVerifiedAt) {
      return NextResponse.json({ message: GENERIC_MESSAGE })
    }

    const token = await signEmailVerificationToken(user.id)
    const confirmUrl = `${getSiteUrl()}/api/auth/confirm-email?token=${token}`
    try {
      await sendConfirmationEmail({ to: user.email, name: user.name, confirmUrl })
    } catch (error) {
      console.error('Failed to resend confirmation email', error)
    }

    return NextResponse.json({ message: GENERIC_MESSAGE })
  } catch (error) {
    console.error('Resend confirmation failed', error)
    return NextResponse.json({ error: 'حدث خطأ غير متوقع' }, { status: 500 })
  }
}
