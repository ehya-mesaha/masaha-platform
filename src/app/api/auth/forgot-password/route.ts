import { NextRequest, NextResponse } from 'next/server'
import { createHash, randomBytes } from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'
import { getSiteUrl } from '@/lib/site'

export const runtime = 'nodejs'

const GENERIC_MESSAGE = 'إذا كان البريد الإلكتروني مسجلاً، فستصلك رسالة لإعادة تعيين كلمة المرور خلال دقائق.'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000
const MAX_REQUESTS_PER_15_MINUTES = 3

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    const normalizedEmail = String(email || '').trim().toLowerCase()

    if (normalizedEmail.length > 254 || !EMAIL_PATTERN.test(normalizedEmail)) {
      return NextResponse.json({ error: 'يرجى إدخال بريد إلكتروني بصيغة صحيحة' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    // Keep this response identical for registered and unregistered emails.
    if (user) {
      const now = new Date()
      const recentRequests = await prisma.passwordResetToken.count({
        where: { userId: user.id, createdAt: { gte: new Date(now.getTime() - 15 * 60 * 1000) } },
      })
      if (recentRequests >= MAX_REQUESTS_PER_15_MINUTES) {
        return NextResponse.json({ message: GENERIC_MESSAGE })
      }

      const token = randomBytes(32).toString('base64url')
      const tokenHash = createHash('sha256').update(token).digest('hex')
      await prisma.$transaction([
        prisma.passwordResetToken.updateMany({
          where: { userId: user.id, usedAt: null },
          data: { usedAt: now },
        }),
        prisma.passwordResetToken.create({
          data: { userId: user.id, tokenHash, expiresAt: new Date(now.getTime() + RESET_TOKEN_TTL_MS) },
        }),
      ])

      const resetUrl = `${getSiteUrl()}/auth/reset-password?token=${encodeURIComponent(token)}`
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
