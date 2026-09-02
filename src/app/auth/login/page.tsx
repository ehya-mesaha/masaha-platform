'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import LanguageToggle from '@/components/i18n/LanguageToggle'
import ThemeToggle from '@/components/theme/ThemeToggle'
import BrandLogo from '@/components/brand/BrandLogo'
import { AuthField, MailIcon } from '@/components/auth/AuthField'
import AuthPasswordField from '@/components/auth/AuthPasswordField'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')
  const [passwordReset, setPasswordReset] = useState(false)

  useEffect(() => {
    setPasswordReset(new URLSearchParams(window.location.search).get('passwordReset') === '1')
  }, [])

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setNeedsConfirmation(false)
    setResendMessage('')
    const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await response.json()
    if (!response.ok) {
      setError(data.error || 'تعذر تسجيل الدخول')
      setNeedsConfirmation(data.code === 'EMAIL_NOT_VERIFIED')
      setLoading(false)
      return
    }
    router.push(data.user.role === 'ADMIN' ? '/admin/dashboard' : data.user.role === 'SELLER' ? '/seller/dashboard' : '/buyer/bookings')
    router.refresh()
  }

  async function resendConfirmation() {
    if (resending) return
    setResending(true)
    setResendMessage('')
    try {
      const response = await fetch('/api/auth/resend-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
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
    <div className="auth-shell grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
      <section className="auth-visual hidden flex-col justify-between p-12 text-white lg:flex">
        <Link href="/" className="relative inline-flex" aria-label="مساحة">
          <BrandLogo variant="horizontal" tone="white" className="auth-brand-logo" priority />
        </Link>
        <div className="relative">
          <p className="mb-4 text-xs font-bold text-[#B99A63]">مرحبًا بعودتك</p>
          <h1 className="max-w-lg text-5xl font-extrabold leading-tight">مساحة لما هو قادم.</h1>
          <p className="mt-5 max-w-lg text-sm leading-8 text-white/70">أدر مساحاتك أو حجوزاتك وجدولك بسهولة من لوحة موحدة وواضحة.</p>
        </div>
        <div className="relative flex justify-between text-xs text-white/45"><span>© {new Date().getFullYear()} إحياء مساحة</span><Link href="/policies">السياسات والأحكام</Link></div>
      </section>

      <main className="relative grid place-items-center bg-[#F5F1E8] p-6">
        <div className="absolute left-6 top-6 flex items-center gap-2"><ThemeToggle /><LanguageToggle /></div>
        <form onSubmit={submit} className="auth-form-card w-full max-w-md p-8 lg:p-10">
          <Link href="/" className="mb-8 inline-flex lg:hidden" aria-label="مساحة">
            <BrandLogo variant="horizontal" tone="green" className="auth-brand-logo-mobile" priority />
          </Link>
          <h2 className="text-3xl font-extrabold text-[#1B1B1B]">تسجيل الدخول</h2>
          <p className="mb-7 mt-2 text-sm text-[#5F6764]">أدخل بيانات حسابك للوصول إلى لوحة التحكم.</p>
          {passwordReset && <p className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.</p>}
          {error && (
            <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              <p>{error}</p>
              {needsConfirmation && (
                <button
                  type="button"
                  onClick={resendConfirmation}
                  disabled={resending}
                  className="mt-2 text-xs font-bold text-[#0E3B34] underline underline-offset-4 disabled:opacity-50"
                >
                  {resending ? 'جاري الإرسال...' : 'إعادة إرسال رابط التأكيد'}
                </button>
              )}
              {resendMessage && <p className="mt-2 text-xs font-semibold text-[#0E3B34]">{resendMessage}</p>}
            </div>
          )}
          <div className="space-y-4">
            <AuthField
              label="البريد الإلكتروني"
              icon={MailIcon}
              value={form.email}
              onChange={(value) => setForm({ ...form, email: value })}
              dir="ltr"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
            />
            <AuthPasswordField
              label="كلمة المرور"
              value={form.password}
              onChange={(value) => setForm({ ...form, password: value })}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <div className="-mt-1 text-start">
              <Link href="/auth/forgot-password" className="text-xs font-bold text-[#0E3B34] underline underline-offset-4 hover:text-[#B99A63]">
                نسيت كلمة المرور؟
              </Link>
            </div>
          </div>
          <button disabled={loading} className="btn-primary mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold disabled:opacity-60">
            {loading ? (
              'جاري تسجيل الدخول...'
            ) : (
              <>
                تسجيل الدخول
                <svg className="h-4 w-4 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" /></svg>
              </>
            )}
          </button>
          <p className="mt-6 text-center text-sm text-[#5F6764]">ليس لديك حساب؟ <Link href="/auth/register" className="font-bold text-[#0E3B34]">إنشاء حساب</Link></p>
          <Link href="/seller-application" className="mt-3 block text-center text-xs font-bold text-[#B99A63]">تقديم طلب انضمام صاحب مساحة</Link>
        </form>
      </main>
    </div>
  )
}
