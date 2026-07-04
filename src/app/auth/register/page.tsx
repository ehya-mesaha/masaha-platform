'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

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
        return
      }

      const role = data.user.role
      if (role === 'SELLER') router.push('/seller/dashboard')
      else router.push('/buyer/bookings')

      router.refresh()
    } catch {
      setError('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1B3A2D] flex-col justify-between p-12">
        <Link href="/" className="text-3xl font-bold text-[#C49A3C]">مساحة</Link>
        <div>
          <h2 className="text-white text-3xl font-bold leading-tight mb-4">
            انضم إلى مجتمع مساحة
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            سواء كنت تبحث عن مساحة للعمل أو تريد تأجير مساحتك، ابدأ رحلتك معنا اليوم.
          </p>
        </div>
        <p className="text-gray-500 text-sm">© {new Date().getFullYear()} مساحة. جميع الحقوق محفوظة.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#F5F0E6]">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/" className="text-2xl font-bold text-[#C49A3C]">مساحة</Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-[#E8E3D8] p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">إنشاء حساب جديد</h1>
            <p className="text-gray-500 text-sm mb-6">أدخل بياناتك لإنشاء حسابك</p>

            {/* Role selector */}
            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={() => setForm(p => ({ ...p, role: 'BUYER' }))}
                className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-colors ${
                  form.role === 'BUYER'
                    ? 'border-[#1B3A2D] bg-[#1B3A2D] text-white'
                    : 'border-[#E8E3D8] text-gray-600 hover:border-[#1B3A2D]'
                }`}
              >
                🏢 مستأجر
              </button>
              <button
                type="button"
                onClick={() => setForm(p => ({ ...p, role: 'SELLER' }))}
                className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-colors ${
                  form.role === 'SELLER'
                    ? 'border-[#1B3A2D] bg-[#1B3A2D] text-white'
                    : 'border-[#E8E3D8] text-gray-600 hover:border-[#1B3A2D]'
                }`}
              >
                🔑 صاحب مساحة
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">الاسم الكامل</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A2D]/30 focus:border-[#1B3A2D]"
                  placeholder="محمد أحمد"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">رقم الجوال</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A2D]/30 focus:border-[#1B3A2D]"
                  placeholder="05xxxxxxxx"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A2D]/30 focus:border-[#1B3A2D]"
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">كلمة المرور</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A2D]/30 focus:border-[#1B3A2D]"
                  placeholder="٦ أحرف على الأقل"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1B3A2D] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#0F2219] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
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

            <p className="mt-5 text-center text-sm text-gray-500">
              لديك حساب؟{' '}
              <Link href="/auth/login" className="text-[#1B3A2D] font-medium hover:underline">
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
