import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { signPasswordResetToken } from '@/lib/auth'
import { sendPasswordResetEmail } from '@/lib/email'
import { getSiteUrl } from '@/lib/site'

const GENERIC_MESSAGE = 'إذا كان البريد الإلكتروني مسجلاً، فستصلك رسالة لإعادة تعيين كلمة المرور خلال دقائق.'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    const normalizedEmail = String(email || '').trim().toLowerCase()

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      return NextResponse.json({ error: 'يرجى إدخال بريد إلكتروني بصيغة صحيحة' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    // Keep this response identical for registered and unregistered emails.
    if (user) {
      const token = await signPasswordResetToken(user.id, user.password)
      const resetUrl = `${getSiteUrl()}/auth/reset-password?token=${token}`
      try {
        await sendPasswordResetEmail({ to: user.email, name: user.name, resetUrl })
      } catch (error) {
        console.error('Failed to send password reset email', error)
      }
    }

    return NextResponse.json({ message: GENERIC_MESSAGE })
  } catch (error) {
    console.error('Password reset request failed', error)
    return NextResponse.json({ error: 'تعذر إرسال طلب إعادة التعيين حاليًا. حاول مرة أخرى.' }, { status: 500 })
  }
}
