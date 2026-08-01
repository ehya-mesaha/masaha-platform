import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signEmailVerificationToken } from '@/lib/auth'
import { sendConfirmationEmail } from '@/lib/email'
import { getSiteUrl } from '@/lib/site'
import { getPasswordStrength } from '@/lib/passwordStrength'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone, role } = await request.json()
    if (role === 'SELLER') {
      return NextResponse.json({ error: 'يرجى استخدام نموذج طلب انضمام أصحاب المساحات' }, { status: 400 })
    }
    if (!name || !email || !password) return NextResponse.json({ error: 'يرجى إدخال جميع البيانات المطلوبة' }, { status: 400 })
    if (!EMAIL_PATTERN.test(String(email).trim())) {
      return NextResponse.json({ error: 'يرجى إدخال بريد إلكتروني بصيغة صحيحة' }, { status: 400 })
    }
    if (String(password).length < 8) return NextResponse.json({ error: 'كلمة المرور يجب أن تتكون من 8 أحرف على الأقل' }, { status: 400 })
    if (getPasswordStrength(String(password)).score === 0) {
      return NextResponse.json({ error: 'كلمة المرور ضعيفة جدًا. أضف أحرفًا وأرقامًا أكثر تنوعًا وتجنّب الكلمات الشائعة' }, { status: 400 })
    }

    const normalizedEmail = String(email).trim().toLowerCase()
    if (await prisma.user.findUnique({ where: { email: normalizedEmail } })) {
      return NextResponse.json({ error: 'البريد الإلكتروني مستخدم بالفعل' }, { status: 409 })
    }
    const user = await prisma.user.create({
      data: {
        name: String(name).trim(),
        email: normalizedEmail,
        phone: phone ? String(phone).trim() : null,
        password: await bcrypt.hash(String(password), 12),
        role: 'BUYER',
        status: 'ACTIVE',
      },
    })

    const verificationToken = await signEmailVerificationToken(user.id)
    const confirmUrl = `${getSiteUrl()}/api/auth/confirm-email?token=${verificationToken}`
    try {
      await sendConfirmationEmail({ to: user.email, name: user.name, confirmUrl })
    } catch (error) {
      console.error('Failed to send confirmation email', error)
    }

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } }, { status: 201 })
  } catch (error) {
    console.error('Registration failed', error)
    return NextResponse.json({ error: 'حدث خطأ غير متوقع' }, { status: 500 })
  }
}
