'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
        return
      }

      const role = data.user.role
      if (role === 'ADMIN') router.push('/admin/dashboard')
      else if (role === 'SELLER') router.push('/seller/dashboard')
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
      {/* Left panel - dark green */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1B3A2D] flex-col justify-between p-12">
        <Link href="/" className="text-3xl font-bold text-[#C49A3C]">مساحة</Link>
        <div>
          <h2 className="text-white text-3xl font-bold leading-tight mb-4">
            مرحباً بك مجدداً في منصة مساحة
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            سجّل دخولك للوصول إلى لوحة التحكم وإدارة مساحاتك وحجوزاتك بكل سهولة.
          </p>
        </div>
        <p className="text-gray-500 text-sm">© {new Date().getFullYear()} مساحة. جميع الحقوق محفوظة.</p>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#F5F0E6]">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/" className="text-2xl font-bold text-[#C49A3C]">مساحة</Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-[#E8E3D8] p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">تسجيل الدخول</h1>
            <p className="text-gray-500 text-sm mb-6">أدخل بياناتك للدخول إلى حسابك</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  البريد الإلكتروني
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A2D]/30 focus:border-[#1B3A2D]"
                  placeholder="••••••••"
                  required
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
                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-gray-500">
              ليس لديك حساب؟{' '}
              <Link href="/auth/register" className="text-[#1B3A2D] font-medium hover:underline">
                إنشاء حساب جديد
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">
              بيانات تجريبية: admin@masaha.sa / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
