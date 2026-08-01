'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import BrandLogo from '@/components/brand/BrandLogo'
import LanguageToggle from '@/components/i18n/LanguageToggle'
import { AuthField, UserIcon, PhoneIcon, MailIcon } from '@/components/auth/AuthField'
import AuthPasswordField from '@/components/auth/AuthPasswordField'
import { getPasswordStrength } from '@/lib/passwordStrength'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const FEATURES = [
  'احجز المساحات والبرامج المتكررة مباشرة دون انتظار',
  'تابع كل حجوزاتك وفواتيرك من لوحة واحدة',
  'تواصل مباشر مع أصحاب المساحات قبل الحجز',
]

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [touched, setTouched] = useState({ email: false, password: false })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const emailValid = form.email === '' || EMAIL_PATTERN.test(form.email)
  const passwordTooWeak = form.password.length > 0 && getPasswordStrength(form.password).score === 0

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setTouched({ email: true, password: true })
    setError('')

    if (!EMAIL_PATTERN.test(form.email)) {
      setError('يرجى إدخال بريد إلكتروني بصيغة صحيحة')
      return
    }
    if (getPasswordStrength(form.password).score === 0) {
      setError('كلمة المرور ضعيفة جدًا. أضف أحرفًا وأرقامًا أكثر تنوعًا وتجنّب الكلمات الشائعة')
      return
    }

    setLoading(true)
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, role: 'BUYER' }),
    })
    const data = await response.json()
    if (!response.ok) {
      setError(data.error || 'تعذر إنشاء الحساب')
      setLoading(false)
      return
    }
    router.push(`/auth/check-email?email=${encodeURIComponent(form.email)}`)
  }

  return (
    <div className="auth-shell grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
      <section className="auth-visual hidden flex-col justify-between p-12 text-white lg:flex">
        <Link href="/" className="relative inline-flex" aria-label="إحياء مساحة">
          <BrandLogo variant="horizontal" tone="white" className="auth-brand-logo" priority />
        </Link>
        <div className="relative">
          <p className="mb-4 text-xs font-bold text-[#B99A63]">إحياء مساحة</p>
          <h1 className="max-w-lg text-5xl font-extrabold leading-tight">أنشئ حسابك وابدأ الحجز.</h1>
          <p className="mt-5 max-w-lg text-sm leading-8 text-white/70">احجز المساحات والبرامج مباشرة، واحتفظ بكل حجوزاتك في لوحة واحدة.</p>
          <ul className="mt-7 space-y-3">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm text-white/80">
                <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-[#B99A63]/20 text-[#D7B66D]">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </span>
                {feature}
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
            <p className="font-bold text-white">هل أنت صاحب مساحة؟</p>
            <p className="mt-2 text-sm text-white/65">لأمان وجودة المنصة، يوجد مسار انضمام مستقل لمراجعة بيانات الجهة ومستنداتها.</p>
            <Link href="/seller-application" className="btn-gold mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm">تقديم طلب انضمام</Link>
          </div>
        </div>
        <div className="relative flex justify-between text-xs text-white/45"><span>© {new Date().getFullYear()} إحياء مساحة</span><Link href="/policies">السياسات والأحكام</Link></div>
      </section>

      <main className="relative grid place-items-center bg-[#F5F1E8] p-6 py-10">
        <div className="absolute left-6 top-6"><LanguageToggle /></div>
        <form onSubmit={submit} className="auth-form-card w-full max-w-xl p-8 lg:p-10">
          <Link href="/" className="mb-6 inline-flex lg:hidden" aria-label="إحياء مساحة">
            <BrandLogo variant="horizontal" tone="green" className="auth-brand-logo-mobile" priority />
          </Link>
          <h2 className="text-3xl font-extrabold text-[#1B1B1B]">إنشاء حساب جديد</h2>
          <p className="mb-7 mt-2 text-sm text-[#5F6764]">جميع الحقول الأساسية مطلوبة.</p>
          {error && <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            <AuthField
              label="الاسم الكامل"
              icon={UserIcon}
              value={form.name}
              onChange={(value) => setForm({ ...form, name: value })}
              autoComplete="name"
            />
            <AuthField
              label="رقم الجوال"
              icon={PhoneIcon}
              value={form.phone}
              onChange={(value) => setForm({ ...form, phone: value })}
              dir="ltr"
              type="tel"
              autoComplete="tel"
            />
            <AuthField
              label="البريد الإلكتروني"
              icon={MailIcon}
              value={form.email}
              onChange={(value) => setForm({ ...form, email: value })}
              onBlur={() => setTouched((current) => ({ ...current, email: true }))}
              dir="ltr"
              type="email"
              autoComplete="email"
              error={touched.email && !emailValid ? 'صيغة البريد الإلكتروني غير صحيحة' : undefined}
            />
            <AuthPasswordField
              label="كلمة المرور"
              value={form.password}
              onChange={(value) => setForm({ ...form, password: value })}
              onBlur={() => setTouched((current) => ({ ...current, password: true }))}
              placeholder="8 أحرف على الأقل"
              autoComplete="new-password"
              showStrength
              error={
                touched.password && passwordTooWeak
                  ? 'كلمة المرور ضعيفة جدًا. استخدم 8 أحرف على الأقل مع مزيج من الحروف والأرقام'
                  : undefined
              }
            />
          </div>
          <button
            disabled={loading}
            className="btn-primary mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold disabled:opacity-60"
          >
            {loading ? (
              'جاري إنشاء الحساب...'
            ) : (
              <>
                إنشاء الحساب
                <svg className="h-4 w-4 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" /></svg>
              </>
            )}
          </button>
          <p className="mt-6 text-center text-sm text-[#5F6764]">لديك حساب؟ <Link href="/auth/login" className="font-bold text-[#0E3B34]">تسجيل الدخول</Link></p>
        </form>
      </main>
    </div>
  )
}
