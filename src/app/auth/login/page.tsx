'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import LanguageToggle from '@/components/i18n/LanguageToggle'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await response.json()
    if (!response.ok) {
      setError(data.error || 'تعذر تسجيل الدخول')
      setLoading(false)
      return
    }
    router.push(data.user.role === 'ADMIN' ? '/admin/dashboard' : data.user.role === 'SELLER' ? '/seller/dashboard' : '/buyer/bookings')
    router.refresh()
  }
  return <div className="auth-shell grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
    <section className="auth-visual hidden flex-col justify-between p-12 text-white lg:flex">
      <Link href="/" className="relative"><p className="text-2xl font-extrabold">إحياء مساحة</p><p className="mt-1 text-[10px] tracking-[0.2em] text-white/50">EHYA MASAHA</p></Link>
      <div className="relative"><p className="mb-4 text-xs font-bold text-[#D8B455]">مرحبًا بعودتك</p><h1 className="max-w-lg text-5xl font-extrabold leading-tight">مساحة لما هو قادم.</h1><p className="mt-5 max-w-lg text-sm leading-8 text-white/70">أدر مساحاتك أو حجوزاتك وجدولك بسهولة من لوحة موحدة وواضحة.</p></div>
      <div className="relative flex justify-between text-xs text-white/45"><span>© {new Date().getFullYear()} إحياء مساحة</span><Link href="/policies">السياسات والأحكام</Link></div>
    </section>
    <main className="relative grid place-items-center bg-[#F7F3EB] p-6">
      <div className="absolute left-6 top-6"><LanguageToggle /></div>
      <form onSubmit={submit} className="auth-form-card w-full max-w-md p-8 lg:p-10">
        <Link href="/" className="mb-8 block text-xl font-extrabold text-[#1B3A2D] lg:hidden">إحياء مساحة</Link>
        <h2 className="text-3xl font-extrabold text-[#14201A]">تسجيل الدخول</h2>
        <p className="mb-7 mt-2 text-sm text-[#6B7566]">أدخل بيانات حسابك للوصول إلى لوحة التحكم.</p>
        {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}
        <label className="block"><span className="mb-2 block text-xs font-bold text-[#4A554D]">البريد الإلكتروني</span><input required type="email" dir="ltr" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="field" placeholder="name@example.com" /></label>
        <label className="mt-4 block"><span className="mb-2 block text-xs font-bold text-[#4A554D]">كلمة المرور</span><input required type="password" dir="ltr" autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="field" placeholder="••••••••" /></label>
        <button disabled={loading} className="btn-primary mt-6 w-full rounded-xl py-3.5 text-sm font-bold disabled:opacity-60">{loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}</button>
        <p className="mt-6 text-center text-sm text-[#6B7566]">ليس لديك حساب؟ <Link href="/auth/register" className="font-bold text-[#1B3A2D]">إنشاء حساب</Link></p>
        <Link href="/seller-application" className="mt-3 block text-center text-xs font-bold text-[#C49A3C]">تقديم طلب انضمام صاحب مساحة</Link>
      </form>
    </main>
  </div>
}
