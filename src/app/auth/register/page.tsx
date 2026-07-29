'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import PublicNavbar from '@/components/layout/PublicNavbar'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
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
    router.push('/buyer/bookings')
    router.refresh()
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
            <Field label="البريد الإلكتروني" value={form.email} onChange={(value) => setForm({ ...form, email: value })} dir="ltr" type="email" />
            <Field label="كلمة المرور" value={form.password} onChange={(value) => setForm({ ...form, password: value })} dir="ltr" type="password" />
          </div>
          <button disabled={loading} className="mt-6 w-full rounded-xl bg-[#0E3B34] px-5 py-3 font-bold text-white disabled:opacity-60">{loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}</button>
          <p className="mt-5 text-center text-sm text-[#5F6764]">لديك حساب؟ <Link href="/auth/login" className="font-bold text-[#0E3B34]">تسجيل الدخول</Link></p>
        </form>
      </main>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', dir }: { label: string; value: string; onChange: (value: string) => void; type?: string; dir?: 'ltr' }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-bold text-[#33423F]">{label}</span><input required type={type} dir={dir} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-[#D8D1C7] bg-white px-4 py-3 outline-none focus:border-[#0E3B34]" /></label>
}
