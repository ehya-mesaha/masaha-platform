import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone, role } = await request.json()
    if (role === 'SELLER') {
      return NextResponse.json({ error: 'يرجى استخدام نموذج طلب انضمام أصحاب المساحات' }, { status: 400 })
    }
    if (!name || !email || !password) return NextResponse.json({ error: 'يرجى إدخال جميع البيانات المطلوبة' }, { status: 400 })
    if (String(password).length < 8) return NextResponse.json({ error: 'كلمة المرور يجب أن تتكون من 8 أحرف على الأقل' }, { status: 400 })

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
    const token = await signToken({ id: user.id, email: user.email, role: user.role, name: user.name, status: user.status })
    const response = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } }, { status: 201 })
    response.cookies.set('masaha_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return response
  } catch (error) {
    console.error('Registration failed', error)
    return NextResponse.json({ error: 'حدث خطأ غير متوقع' }, { status: 500 })
  }
}
