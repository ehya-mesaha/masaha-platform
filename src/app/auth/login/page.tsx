'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'حدث خطأ')
        setLoading(false)
        return
      }

      const role = data.user.role
      if (role === 'ADMIN') router.push('/admin/dashboard')
      else if (role === 'SELLER') router.push('/seller/dashboard')
      else router.push('/buyer/bookings')

      router.refresh()
    } catch {
      setError('حدث خطأ في الاتصال')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[45%] relative hero-pattern flex-col justify-between p-12 text-white overflow-hidden">
        {/* Decorative */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 -start-16 w-72 h-72 rounded-full bg-[#C49A3C]/20 blur-3xl" />
          <div className="absolute bottom-0 -end-20 w-96 h-96 rounded-full bg-[#C49A3C]/10 blur-3xl" />
        </div>

        <Link href="/" className="relative flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur border border-white/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-[#C49A3C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-extrabold">مساحة</span>
            <span className="text-[11px] text-white/60">MASAHA PLATFORM</span>
          </div>
        </Link>

        <div className="relative fade-up">
          <div className="eyebrow mb-6"><span>مرحباً بعودتك</span></div>
          <h2 className="font-display text-4xl lg:text-5xl font-extrabold leading-tight mb-5">
            مساحتك،
            <br />
            بوابتك للنجاح.
          </h2>
          <p className="text-white/70 text-base leading-relaxed max-w-md">
            قم بإدارة مساحاتك، متابعة حجوزاتك، وتنمية أعمالك بكل سهولة واحترافية من خلال لوحة تحكم متكاملة.
          </p>
        </div>

        <div className="relative flex items-center justify-between text-xs text-white/50">
          <span>© {new Date().getFullYear()} مساحة</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white/80">الخصوصية</a>
            <a href="#" className="hover:text-white/80">الشروط</a>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-[#F7F3EB] bg-paper">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#244A3A] to-[#0F2219] flex items-center justify-center">
              <svg className="w-6 h-6 text-[#C49A3C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold text-[#1B3A2D]">مساحة</span>
          </div>

          <div className="card-elevated p-8 lg:p-10">
            <h1 className="font-display text-3xl font-extrabold text-[#14201A] mb-1.5">تسجيل الدخول</h1>
            <p className="text-[#6B7566] text-sm mb-7">أدخل بياناتك للوصول إلى لوحة التحكم</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5 flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A554D] mb-2 tracking-wide">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <svg className="absolute end-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B5B0A2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="field !pe-11"
                    placeholder="admin@masaha.sa"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-[#4A554D] tracking-wide">
                    كلمة المرور
                  </label>
                  <Link href="#" className="text-xs text-[#C49A3C] font-semibold hover:underline">
                    نسيت كلمة المرور؟
                  </Link>
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-4 top-1/2 -translate-y-1/2 text-[#B5B0A2] hover:text-[#1B3A2D]"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    className="field !pe-11"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-[#4A554D] cursor-pointer select-none pt-1">
                <input type="checkbox" className="rounded border-[#ECE6D8] text-[#1B3A2D] focus:ring-[#1B3A2D]/30" />
                <span>تذكرني في المرة القادمة</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                {loading && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                {!loading && (
                  <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-[#ECE6D8]" />
              <span className="text-xs text-[#B5B0A2]">أو</span>
              <div className="flex-1 h-px bg-[#ECE6D8]" />
            </div>

            <p className="text-center text-sm text-[#6B7566]">
              ليس لديك حساب في مساحة؟{' '}
              <Link href="/auth/register" className="text-[#1B3A2D] font-bold hover:text-[#C49A3C] transition-colors">
                سجل الآن
              </Link>
            </p>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#B5B0A2]">
            <div className="w-8 h-px bg-[#ECE6D8]" />
            <span>بيانات تجريبية: admin@masaha.sa / admin123</span>
            <div className="w-8 h-px bg-[#ECE6D8]" />
          </div>
        </div>
      </div>
    </div>
  )
}
