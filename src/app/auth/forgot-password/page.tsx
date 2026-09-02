'use client'

import { useState } from 'react'
import Link from 'next/link'
import BrandLogo from '@/components/brand/BrandLogo'
import { AuthField, MailIcon } from '@/components/auth/AuthField'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setMessage('')
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('يرجى إدخال بريد إلكتروني بصيغة صحيحة')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'تعذر إرسال الطلب. حاول مرة أخرى.')
        return
      }
      setMessage(data.message)
    } catch {
      setError('تعذر الاتصال بالخادم. حاول مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#F5F1E8] px-4 py-10">
      <section className="auth-form-card w-full max-w-md p-8 text-center lg:p-10">
        <Link href="/" className="mx-auto mb-8 inline-flex" aria-label="مساحة">
          <BrandLogo variant="horizontal" tone="green" className="auth-brand-logo-mobile" priority />
        </Link>
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#0E3B34]/10 text-[#0E3B34]">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 14v2m-5 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 002 2zm2-10V7a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-[#1B1B1B]">نسيت كلمة المرور؟</h1>
        <p className="mt-2 text-sm leading-7 text-[#5F6764]">أدخل بريدك الإلكتروني وسنرسل لك رابطًا آمنًا لاختيار كلمة مرور جديدة.</p>

        {message ? (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold leading-6 text-green-700">
            {message}
            <p className="mt-2 text-xs font-medium text-[#3F4B47]">تحقق أيضًا من مجلد الرسائل غير المرغوب فيها.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 text-start">
            {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}
            <AuthField
              label="البريد الإلكتروني"
              icon={MailIcon}
              value={email}
              onChange={setEmail}
              type="email"
              dir="ltr"
              autoComplete="email"
              placeholder="name@example.com"
            />
            <button disabled={loading} className="btn-primary mt-5 flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-bold disabled:opacity-60">
              {loading ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}
            </button>
          </form>
        )}
        <Link href="/auth/login" className="mt-6 inline-block text-sm font-bold text-[#0E3B34] underline underline-offset-4">العودة لتسجيل الدخول</Link>
      </section>
    </main>
  )
}
