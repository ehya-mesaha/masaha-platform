import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const types = await prisma.spaceType.findMany({ orderBy: { name: 'asc' } })
    const amenities = await prisma.amenity.findMany({ orderBy: { name: 'asc' } })
    return NextResponse.json({ types, amenities })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const { type, name, icon } = await req.json()

    if (type === 'space-type') {
      const created = await prisma.spaceType.create({ data: { name } })
      return NextResponse.json({ item: created }, { status: 201 })
    } else if (type === 'amenity') {
      const created = await prisma.amenity.create({ data: { name, icon } })
      return NextResponse.json({ item: created }, { status: 201 })
    }

    return NextResponse.json({ error: 'النوع غير صحيح' }, { status: 400 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const { type, id } = await req.json()

    if (type === 'space-type') {
      await prisma.spaceType.delete({ where: { id } })
    } else if (type === 'amenity') {
      await prisma.amenity.delete({ where: { id } })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
