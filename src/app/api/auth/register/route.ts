import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone, role } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'يرجى إدخال جميع البيانات المطلوبة' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'البريد الإلكتروني مستخدم بالفعل' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const userRole = role === 'SELLER' ? 'SELLER' : 'BUYER'

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: userRole,
      },
    })

    const token = await signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    })

    const res = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })

    res.cookies.set('masaha_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return res
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}
