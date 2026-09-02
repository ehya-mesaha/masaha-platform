'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import BrandLogo from '@/components/brand/BrandLogo'
import AuthPasswordField from '@/components/auth/AuthPasswordField'
import { getPasswordStrength } from '@/lib/passwordStrength'

export default function ResetPasswordPage() {
  return <Suspense fallback={null}><ResetPasswordForm /></Suspense>
}

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    if (!token) {
      setError('رابط إعادة التعيين غير صالح. اطلب رابطًا جديدًا.')
      return
    }
    if (getPasswordStrength(password).score === 0) {
      setError('اختر كلمة مرور قوية من 8 أحرف على الأقل وتجنب الكلمات الشائعة.')
      return
    }
    if (password !== confirmation) {
      setError('كلمتا المرور غير متطابقتين.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'تعذر تغيير كلمة المرور. حاول مرة أخرى.')
        return
      }
      router.replace('/auth/login?passwordReset=1')
      router.refresh()
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
        <h1 className="text-2xl font-extrabold text-[#1B1B1B]">أنشئ كلمة مرور جديدة</h1>
        <p className="mt-2 text-sm leading-7 text-[#5F6764]">اختر كلمة مرور قوية لحماية حسابك. سيُعاد توجيهك لتسجيل الدخول بعد الحفظ.</p>
        <form onSubmit={submit} className="mt-6 space-y-4 text-start">
          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-700">{error}</p>}
          <AuthPasswordField label="كلمة المرور الجديدة" value={password} onChange={setPassword} placeholder="8 أحرف على الأقل" autoComplete="new-password" showStrength />
          <AuthPasswordField label="تأكيد كلمة المرور الجديدة" value={confirmation} onChange={setConfirmation} placeholder="أعد إدخال كلمة المرور" autoComplete="new-password" error={confirmation && confirmation !== password ? 'كلمتا المرور غير متطابقتين.' : undefined} />
          <button disabled={loading} className="btn-primary flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-bold disabled:opacity-60">
            {loading ? 'جاري الحفظ...' : 'حفظ كلمة المرور الجديدة'}
          </button>
        </form>
        <Link href="/auth/forgot-password" className="mt-6 inline-block text-sm font-bold text-[#0E3B34] underline underline-offset-4">طلب رابط جديد</Link>
      </section>
    </main>
  )
}
