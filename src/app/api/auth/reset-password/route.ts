import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { isPasswordResetTokenCurrent, SESSION_COOKIE_NAME, verifyPasswordResetToken } from '@/lib/auth'
import { getPasswordStrength } from '@/lib/passwordStrength'

const INVALID_TOKEN_MESSAGE = 'رابط إعادة التعيين غير صالح أو انتهت صلاحيته. اطلب رابطًا جديدًا.'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()
    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: INVALID_TOKEN_MESSAGE }, { status: 400 })
    }
    if (typeof password !== 'string' || getPasswordStrength(password).score === 0) {
      return NextResponse.json({ error: 'اختر كلمة مرور قوية من 8 أحرف على الأقل وتجنب الكلمات الشائعة.' }, { status: 400 })
    }

    let resetToken: { userId: string; version: string }
    try {
      resetToken = await verifyPasswordResetToken(token)
    } catch {
      return NextResponse.json({ error: INVALID_TOKEN_MESSAGE }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: resetToken.userId } })
    if (!user || !isPasswordResetTokenCurrent(user.id, user.password, resetToken.version)) {
      return NextResponse.json({ error: INVALID_TOKEN_MESSAGE }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { password: await bcrypt.hash(password, 12) },
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
    console.error('Password reset failed', error)
    return NextResponse.json({ error: 'تعذر تغيير كلمة المرور حاليًا. حاول مرة أخرى.' }, { status: 500 })
  }
}
