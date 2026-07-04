'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('seller') === '1' ? 'SELLER' : 'BUYER'

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: defaultRole,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
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
      if (role === 'SELLER') router.push('/seller/dashboard')
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
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 -start-16 w-72 h-72 rounded-full bg-[#C49A3C]/20 blur-3xl" />
          <div className="absolute bottom-0 -end-20 w-96 h-96 rounded-full bg-[#C49A3C]/10 blur-3xl" />
        </div>

        <Link href="/" className="relative flex items-center gap-3">
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
          <div className="eyebrow mb-6"><span>انضم إلينا</span></div>
          <h2 className="font-display text-4xl lg:text-5xl font-extrabold leading-tight mb-5">
            ابدأ رحلتك
            <br />
            في عالم <span className="text-[#C49A3C]">مساحة</span>.
          </h2>
          <p className="text-white/70 text-base leading-relaxed max-w-md mb-8">
            سواء كنت تبحث عن مساحة مثالية لعملك أو تريد استثمار مساحتك، منصتنا تفتح لك الأبواب.
          </p>

          <div className="space-y-3 pt-4 border-t border-white/10">
            {[
              'تسجيل مجاني بالكامل',
              'واجهة سهلة الاستخدام',
              'دعم فني على مدار الساعة',
            ].map(f => (
              <div key={f} className="flex items-center gap-3 text-sm text-white/80">
                <div className="w-5 h-5 rounded-full bg-[#C49A3C]/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-[#C49A3C]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {f}
              </div>
            ))}
          </div>
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
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 bg-[#F7F3EB] bg-paper">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#244A3A] to-[#0F2219] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#C49A3C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-xl font-extrabold text-[#1B3A2D]">مساحة</span>
          </div>

          <div className="card-elevated p-8">
            <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-[#14201A] mb-1.5">إنشاء حساب جديد</h1>
            <p className="text-[#6B7566] text-sm mb-6">اختر نوع حسابك للمتابعة</p>

            {/* Role selector */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                {
                  role: 'BUYER',
                  title: 'مستأجر',
                  desc: 'أبحث عن مساحة',
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  ),
                },
                {
                  role: 'SELLER',
                  title: 'صاحب مساحة',
                  desc: 'أعرض مساحتي',
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 7l9-4 9 4M4 21V10m16 11V10M9 21v-6a3 3 0 016 0v6" />
                    </svg>
                  ),
                },
              ].map(opt => (
                <button
                  key={opt.role}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, role: opt.role }))}
                  className={`p-4 rounded-xl border-2 text-start transition-all ${
                    form.role === opt.role
                      ? 'border-[#1B3A2D] bg-[#1B3A2D]/5 shadow-sm'
                      : 'border-[#ECE6D8] bg-white hover:border-[#C49A3C]/50'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${
                    form.role === opt.role ? 'bg-[#1B3A2D] text-[#C49A3C]' : 'bg-[#F7F3EB] text-[#4A554D]'
                  }`}>
                    {opt.icon}
                  </div>
                  <div className="text-sm font-bold text-[#14201A]">{opt.title}</div>
                  <div className="text-xs text-[#6B7566] mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4 flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#4A554D] mb-1.5 tracking-wide">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="field"
                  placeholder="محمد أحمد"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4A554D] mb-1.5 tracking-wide">
                    رقم الجوال
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    className="field"
                    placeholder="05xxxxxxxx"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A554D] mb-1.5 tracking-wide">
                    البريد
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="field"
                    placeholder="example@email.com"
                    required
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A554D] mb-1.5 tracking-wide">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="field"
                  placeholder="٦ أحرف على الأقل"
                  required
                  minLength={6}
                />
              </div>

              <p className="text-[11px] text-[#6B7566] pt-1 leading-relaxed">
                بإنشائك حساب جديد فأنت توافق على{' '}
                <a href="#" className="text-[#1B3A2D] font-bold hover:underline">الشروط والأحكام</a>
                {' '}و{' '}
                <a href="#" className="text-[#1B3A2D] font-bold hover:underline">سياسة الخصوصية</a>.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2 mt-3"
              >
                {loading && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-[#6B7566]">
              لديك حساب بالفعل؟{' '}
              <Link href="/auth/login" className="text-[#1B3A2D] font-bold hover:text-[#C49A3C] transition-colors">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}
