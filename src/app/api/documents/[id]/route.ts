import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const { id } = await params
    const doc = await prisma.userDocument.findUnique({ where: { id } })
    if (!doc) {
      return NextResponse.json({ error: 'المستند غير موجود' }, { status: 404 })
    }

    const url = new URL(doc.fileUrl)
    const pathParts = url.pathname.split('/storage/v1/object/public/documents/')
    const filePath = pathParts[1] || url.pathname.split('/documents/').pop()

    if (!filePath) {
      return NextResponse.json({ error: 'مسار الملف غير صالح' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin.storage
      .from('documents')
      .createSignedUrl(filePath, 3600)

    if (error || !data?.signedUrl) {
      console.error('Signed URL error:', error)
      return NextResponse.json({ error: 'فشل إنشاء رابط التحميل' }, { status: 500 })
    }

    return NextResponse.json({ url: data.signedUrl })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
