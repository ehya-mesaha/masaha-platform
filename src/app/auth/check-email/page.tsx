'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import BrandLogo from '@/components/brand/BrandLogo'

export default function CheckEmailPage() {
  return (
    <Suspense fallback={null}>
      <CheckEmailContent />
    </Suspense>
  )
}

function CheckEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const [resending, setResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')

  async function resend() {
    if (!email || resending) return
    setResending(true)
    setResendMessage('')
    try {
      const response = await fetch('/api/auth/resend-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      setResendMessage(data.message || 'تم إرسال الطلب.')
    } catch {
      setResendMessage('تعذر الاتصال بالخادم. حاول مرة أخرى.')
    } finally {
      setResending(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#F5F1E8] px-4">
      <section className="premium-card max-w-lg p-8 text-center">
        <Link href="/" className="mb-6 inline-flex" aria-label="مساحة">
          <BrandLogo variant="horizontal" tone="green" className="status-brand-logo" priority />
        </Link>
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#0E3B34]/10 text-[#0E3B34]">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-[#1B1B1B]">تحقق من بريدك الإلكتروني</h1>
        <p className="mt-3 text-sm leading-7 text-[#5F6764]">
          أرسلنا رابط تأكيد إلى {email ? <span dir="ltr" className="font-bold text-[#1B1B1B]">{email}</span> : 'بريدك الإلكتروني'}. اضغط على الرابط داخل الرسالة لتفعيل حسابك، ثم سجّل الدخول.
        </p>
        <div className="mt-5 rounded-xl bg-[#FAF8F3] p-4 text-right text-xs leading-6 text-[#3F4B47]">
          <p>1. افتح بريدك الإلكتروني وابحث عن رسالة من إحياء مساحة.</p>
          <p>2. اضغط على زر «تأكيد البريد الإلكتروني».</p>
          <p>3. عد إلى هذه المنصة وسجّل الدخول ببياناتك.</p>
        </div>

        {email && (
          <button
            type="button"
            onClick={resend}
            disabled={resending}
            className="mt-5 text-sm font-bold text-[#0E3B34] underline underline-offset-4 disabled:opacity-50"
          >
            {resending ? 'جاري الإرسال...' : 'لم يصلك البريد؟ إعادة الإرسال'}
          </button>
        )}
        {resendMessage && <p className="mt-3 text-xs font-semibold text-[#0E3B34]">{resendMessage}</p>}

        <div className="mt-6 flex items-center justify-center gap-4">
          <Link href="/auth/login" className="inline-flex rounded-xl bg-[#0E3B34] px-6 py-3 text-sm font-bold text-white">تسجيل الدخول</Link>
          <Link href="/" className="text-sm font-bold text-[#5F6764]">العودة إلى الرئيسية</Link>
        </div>
      </section>
    </main>
  )
}
