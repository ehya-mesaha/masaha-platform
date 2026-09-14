import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { SESSION_COOKIE_NAME } from '@/lib/auth'
import { getPasswordStrength } from '@/lib/passwordStrength'

export const runtime = 'nodejs'

const INVALID_TOKEN_MESSAGE = 'رابط إعادة التعيين غير صالح أو انتهت صلاحيته. اطلب رابطًا جديدًا.'

class InvalidResetTokenError extends Error {}

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()
    if (!token || typeof token !== 'string' || token.length > 256) {
      return NextResponse.json({ error: INVALID_TOKEN_MESSAGE }, { status: 400 })
    }
    if (typeof password !== 'string' || password.length > 128 || getPasswordStrength(password).score === 0) {
      return NextResponse.json({ error: 'اختر كلمة مرور قوية من 8 أحرف على الأقل وتجنب الكلمات الشائعة.' }, { status: 400 })
    }

    const tokenHash = createHash('sha256').update(token).digest('hex')
    const passwordHash = await bcrypt.hash(password, 12)
    await prisma.$transaction(async (tx) => {
      const resetToken = await tx.passwordResetToken.findFirst({
        where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } },
      })
      if (!resetToken) throw new InvalidResetTokenError()

      const consumed = await tx.passwordResetToken.updateMany({
        where: { id: resetToken.id, usedAt: null, expiresAt: { gt: new Date() } },
        data: { usedAt: new Date() },
      })
      if (consumed.count !== 1) throw new InvalidResetTokenError()

      await tx.user.update({ where: { id: resetToken.userId }, data: { password: passwordHash } })
      await tx.passwordResetToken.deleteMany({ where: { userId: resetToken.userId, id: { not: resetToken.id } } })
    })

    const response = NextResponse.json({ message: 'تم تغيير كلمة المرور بنجاح.' })
    response.cookies.set(SESSION_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0),
      maxAge: 0,
      path: '/',
    })
    return response
  } catch (error) {
    if (error instanceof InvalidResetTokenError) {
      return NextResponse.json({ error: INVALID_TOKEN_MESSAGE }, { status: 400 })
    }
    console.error('Password reset failed', error)
    return NextResponse.json({ error: 'تعذر تغيير كلمة المرور حاليًا. حاول مرة أخرى.' }, { status: 500 })
  }
}
