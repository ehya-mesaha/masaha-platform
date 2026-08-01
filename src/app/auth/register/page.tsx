'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import PublicNavbar from '@/components/layout/PublicNavbar'
import { getPasswordStrength, STRENGTH_LEVELS } from '@/lib/passwordStrength'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [touched, setTouched] = useState({ email: false, password: false })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const emailValid = form.email === '' || EMAIL_PATTERN.test(form.email)
  const strength = useMemo(() => getPasswordStrength(form.password), [form.password])
  const passwordTooWeak = form.password.length > 0 && strength.score === 0

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
    <div className="min-h-screen bg-[#F5F1E8]">
      <PublicNavbar />
      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <section className="page-hero p-8">
          <p className="mb-3 text-xs font-bold text-[#B99A63]">إحياء مساحة</p>
          <h1 className="text-3xl font-extrabold leading-tight text-white">أنشئ حساب طالب مساحة</h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-white/70">احجز المساحات والبرامج مباشرة، واحتفظ بكل حجوزاتك في لوحة واحدة.</p>
          <div className="mt-8 rounded-2xl border border-white/15 bg-white/10 p-5">
            <p className="font-bold text-white">هل أنت صاحب مساحة؟</p>
            <p className="mt-2 text-sm text-white/65">لأمان وجودة المنصة، يوجد مسار انضمام مستقل لمراجعة بيانات الجهة ومستنداتها.</p>
            <Link href="/seller-application" className="mt-4 inline-flex rounded-xl bg-[#B99A63] px-4 py-2.5 text-sm font-bold text-[#1B1B1B]">تقديم طلب انضمام</Link>
          </div>
        </section>

        <form onSubmit={submit} className="premium-card p-7">
          <h2 className="text-2xl font-extrabold text-[#1B1B1B]">إنشاء حساب جديد</h2>
          <p className="mb-6 mt-2 text-sm text-[#5F6764]">جميع الحقول الأساسية مطلوبة.</p>
          {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="الاسم الكامل" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
            <Field label="رقم الجوال" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} dir="ltr" type="tel" />
            <Field
              label="البريد الإلكتروني"
              value={form.email}
              onChange={(value) => setForm({ ...form, email: value })}
              onBlur={() => setTouched((current) => ({ ...current, email: true }))}
              dir="ltr"
              type="email"
              error={touched.email && !emailValid ? 'صيغة البريد الإلكتروني غير صحيحة' : undefined}
            />

            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-[#33423F]">كلمة المرور</span>
              <div className="relative">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  dir="ltr"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  onBlur={() => setTouched((current) => ({ ...current, password: true }))}
                  className={`w-full rounded-xl border bg-white px-4 py-3 pe-11 outline-none ${
                    touched.password && passwordTooWeak ? 'border-red-300 focus:border-red-500' : 'border-[#D8D1C7] focus:border-[#0E3B34]'
                  }`}
                  placeholder="8 أحرف على الأقل"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  className="absolute inset-y-0 end-0 grid w-11 place-items-center text-[#8B9389] transition-colors hover:text-[#0E3B34]"
                >
                  {showPassword ? (
                    <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.774 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>

              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {STRENGTH_LEVELS.slice(1).map((level) => (
                      <span
                        key={level.score}
                        className="h-1.5 flex-1 rounded-full transition-colors"
                        style={{ backgroundColor: strength.score >= level.score ? strength.color : '#E4DED1' }}
                      />
                    ))}
                  </div>
                  <p className="mt-1.5 text-xs font-semibold" style={{ color: strength.color }}>
                    قوة كلمة المرور: {strength.label}
                  </p>
                </div>
              )}
              {touched.password && passwordTooWeak && (
                <p className="mt-1.5 text-xs font-semibold text-red-600">
                  كلمة المرور ضعيفة جدًا. استخدم 8 أحرف على الأقل مع مزيج من الحروف والأرقام
                </p>
              )}
            </label>
          </div>
          <button disabled={loading} className="mt-6 w-full rounded-xl bg-[#0E3B34] px-5 py-3 font-bold text-white transition-colors hover:bg-[#092C27] disabled:opacity-60">{loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}</button>
          <p className="mt-5 text-center text-sm text-[#5F6764]">لديك حساب؟ <Link href="/auth/login" className="font-bold text-[#0E3B34]">تسجيل الدخول</Link></p>
        </form>
      </main>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  onBlur,
  type = 'text',
  dir,
  error,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  type?: string
  dir?: 'ltr'
  error?: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-[#33423F]">{label}</span>
      <input
        required
        type={type}
        dir={dir}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        className={`w-full rounded-xl border bg-white px-4 py-3 outline-none ${error ? 'border-red-300 focus:border-red-500' : 'border-[#D8D1C7] focus:border-[#0E3B34]'}`}
      />
      {error && <p className="mt-1.5 text-xs font-semibold text-red-600">{error}</p>}
    </label>
  )
}
