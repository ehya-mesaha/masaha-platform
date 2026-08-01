import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { SESSION_COOKIE_NAME, sessionCookieOptions, signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email: String(email).trim().toLowerCase() } })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: 'بيانات الدخول غير صحيحة' }, { status: 401 })
    }

    if (user.status === 'SUSPENDED') {
      return NextResponse.json({ error: 'تم تعليق حسابك. يرجى التواصل مع الإدارة' }, { status: 403 })
    }

    if (user.status === 'PENDING_APPROVAL') {
      return NextResponse.json({ error: 'طلب الانضمام قيد المراجعة. سيتم إشعارك عند التفعيل' }, { status: 403 })
    }

    if (!user.emailVerifiedAt) {
      return NextResponse.json({ error: 'يرجى تأكيد بريدك الإلكتروني أولاً. تحقق من صندوق الوارد', code: 'EMAIL_NOT_VERIFIED' }, { status: 403 })
    }

    const token = await signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      status: user.status,
    })

    const res = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })

    res.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions())

    return res
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ غير متوقع' }, { status: 500 })
  }
}
