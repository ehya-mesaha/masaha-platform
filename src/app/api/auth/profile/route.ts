import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

    const body = await req.json()
    const { name, phone, avatarUrl, currentPassword, newPassword } = body

    const dbUser = await prisma.user.findUnique({ where: { id: user.id as string } })
    if (!dbUser) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })

    const data: Record<string, unknown> = {}

    if (name && name.trim()) data.name = name.trim()
    if (phone !== undefined) data.phone = phone.trim() || null
    if (avatarUrl !== undefined) data.avatarUrl = typeof avatarUrl === 'string' && avatarUrl.trim() ? avatarUrl.trim() : null

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'يرجى إدخال كلمة المرور الحالية' }, { status: 400 })
      }
      const valid = await bcrypt.compare(currentPassword, dbUser.password)
      if (!valid) {
        return NextResponse.json({ error: 'كلمة المرور الحالية غير صحيحة' }, { status: 400 })
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' }, { status: 400 })
      }
      data.password = await bcrypt.hash(newPassword, 10)
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'لا توجد بيانات للتحديث' }, { status: 400 })
    }

    const updated = await prisma.user.update({
      where: { id: user.id as string },
      data,
      select: { id: true, name: true, email: true, phone: true, avatarUrl: true },
    })

    return NextResponse.json({ user: updated })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
