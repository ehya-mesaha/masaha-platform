import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signEmailVerificationToken } from '@/lib/auth'
import { sendConfirmationEmail } from '@/lib/email'
import { getSiteUrl } from '@/lib/site'
import { getPasswordStrength } from '@/lib/passwordStrength'

type DocumentInput = { type: 'NATIONAL_ID' | 'COMMERCIAL_REGISTER' | 'TITLE_DEED' | 'POWER_OF_ATTORNEY'; fileUrl: string }

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const required = ['name', 'email', 'phone', 'password', 'schoolName', 'commercialRegisterNo', 'nationalIdNumber']
    if (required.some((field) => !String(body[field] || '').trim())) {
      return NextResponse.json({ error: 'يرجى استكمال جميع البيانات الأساسية' }, { status: 400 })
    }
    if (!body.consentAccepted) return NextResponse.json({ error: 'يجب الموافقة على الإقرار قبل الإرسال' }, { status: 400 })
    if (String(body.password).length < 8) return NextResponse.json({ error: 'كلمة المرور يجب أن تتكون من 8 أحرف على الأقل' }, { status: 400 })
    if (getPasswordStrength(String(body.password)).score === 0) {
      return NextResponse.json({ error: 'كلمة المرور ضعيفة جدًا. أضف أحرفًا وأرقامًا أكثر تنوعًا وتجنّب الكلمات الشائعة' }, { status: 400 })
    }

    const documents = (Array.isArray(body.documents) ? body.documents : []) as DocumentInput[]

    const email = String(body.email).trim().toLowerCase()
    if (await prisma.user.findUnique({ where: { email } })) {
      return NextResponse.json({ error: 'البريد الإلكتروني مستخدم بالفعل' }, { status: 409 })
    }
    const application = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: String(body.name).trim(),
          email,
          phone: String(body.phone).trim(),
          password: await bcrypt.hash(String(body.password), 12),
          role: 'SELLER',
          status: 'PENDING_APPROVAL',
          documents: { create: documents.map((document) => ({ type: document.type, fileUrl: document.fileUrl })) },
        },
      })
      return tx.sellerApplication.create({
        data: {
          userId: user.id,
          schoolName: String(body.schoolName).trim(),
          branchName: body.branchName ? String(body.branchName).trim() : null,
          commercialRegisterNo: String(body.commercialRegisterNo).trim(),
          nationalIdNumber: String(body.nationalIdNumber).trim(),
          multipleOwners: Boolean(body.multipleOwners),
          powerOfAttorneyNumber: body.powerOfAttorneyNumber ? String(body.powerOfAttorneyNumber).trim() : null,
          brokerageContractNo: body.brokerageContractNo ? String(body.brokerageContractNo).trim() : null,
          consentAcceptedAt: new Date(),
        },
      })
    })

    const verificationToken = await signEmailVerificationToken(application.userId)
    const confirmUrl = `${getSiteUrl()}/api/auth/confirm-email?token=${verificationToken}`
    try {
      await sendConfirmationEmail({ to: email, name: String(body.name).trim(), confirmUrl })
    } catch (error) {
      console.error('Failed to send confirmation email', error)
    }

    return NextResponse.json({ id: application.id, status: application.status }, { status: 201 })
  } catch (error) {
    console.error('Seller application failed', error)
    return NextResponse.json({ error: 'تعذر إرسال الطلب حاليًا' }, { status: 500 })
  }
}
