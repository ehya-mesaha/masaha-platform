import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

const MAX_SIZE = 5 * 1024 * 1024
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const DOC_TYPES = ['application/pdf']

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const bucket = (formData.get('bucket') as string) || 'spaces'

    if (!file) {
      return NextResponse.json({ error: 'لم يتم اختيار ملف' }, { status: 400 })
    }

    const allowed = bucket === 'documents' ? [...DOC_TYPES, ...IMAGE_TYPES] : IMAGE_TYPES
    if (!allowed.includes(file.type)) {
      const msg = bucket === 'documents'
        ? 'نوع الملف غير مدعوم. يُسمح بـ PDF, JPG, PNG, WebP'
        : 'نوع الملف غير مدعوم. يُسمح بـ JPG, PNG, WebP'
      return NextResponse.json({ error: msg }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'حجم الملف يتجاوز 5 ميجابايت' }, { status: 400 })
    }

    // For documents bucket, we allow unauthenticated uploads during registration
    // For spaces bucket, require auth
    if (bucket !== 'documents') {
      const user = await getCurrentUser()
      if (!user) {
        return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
      }
    }

    const ext = file.name.split('.').pop() || 'pdf'
    const folder = bucket === 'documents' ? 'pending' : 'uploads'
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'فشل رفع الملف' }, { status: 500 })
    }

    const { data: urlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(path)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
