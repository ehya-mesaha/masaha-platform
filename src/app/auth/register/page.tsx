'use client'

import { useState, useRef, Suspense } from 'react'
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
  const [documents, setDocuments] = useState<{ type: string; fileUrl: string }[]>([])
  const [uploading, setUploading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const idRef = useRef<HTMLInputElement>(null)
  const crRef = useRef<HTMLInputElement>(null)

  async function uploadDoc(file: File, docType: string) {
    setUploading(docType)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('bucket', 'documents')
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok && data.url) {
        setDocuments(prev => {
          const filtered = prev.filter(d => d.type !== docType)
          return [...filtered, { type: docType, fileUrl: data.url }]
        })
      } else {
        setError(data.error || 'فشل رفع الملف')
      }
    } catch {
      setError('فشل رفع الملف')
    } finally {
      setUploading(null)
    }
  }

  const hasNationalId = documents.some(d => d.type === 'NATIONAL_ID')
  const hasCommercialReg = documents.some(d => d.type === 'COMMERCIAL_REGISTER')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.role === 'SELLER' && (!hasNationalId || !hasCommercialReg)) {
      setError('يرجى رفع الهوية الوطنية والسجل التجاري')
      return
    }

    setLoading(true)

    try {
      const body: Record<string, unknown> = { ...form }
      if (form.role === 'SELLER') body.documents = documents

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'حدث خطأ')
        setLoading(false)
        return
      }

      if (data.pending) {
        setSuccess(true)
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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F3EB] p-6">
        <div className="card-elevated max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-extrabold text-[#14201A] mb-3">تم إنشاء حسابك بنجاح!</h1>
          <p className="text-[#6B7566] text-sm leading-relaxed mb-6">
            سيتم مراجعة مستنداتك وتفعيل حسابك خلال ٢٤ ساعة عمل. سنرسل لك إشعاراً عبر البريد الإلكتروني.
          </p>
          <Link href="/" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    )
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
          <div className="eyebrow mb-6"><span>{form.role === 'SELLER' ? 'انضم إلى شبكة مساحة' : 'انضم إلينا'}</span></div>
          <h2 className="font-display text-4xl lg:text-5xl font-extrabold leading-tight mb-5">
            {form.role === 'SELLER' ? (
              <>ابدأ في استثمار<br />مساحاتك <span className="text-[#C49A3C]">غير المستغلة</span></>
            ) : (
              <>ابدأ رحلتك<br />في عالم <span className="text-[#C49A3C]">مساحة</span>.</>
            )}
          </h2>
          <p className="text-white/70 text-base leading-relaxed max-w-md mb-8">
            {form.role === 'SELLER'
              ? 'والوصول إلى شريحة واسعة من العملاء والشركات.'
              : 'سواء كنت تبحث عن مساحة مثالية لعملك أو تريد استثمار مساحتك، منصتنا تفتح لك الأبواب.'}
          </p>

          <div className="space-y-3 pt-4 border-t border-white/10">
            {(form.role === 'SELLER'
              ? [
                  'إدارة متكاملة للحجوزات والمواعيد',
                  'تحويلات مالية آمنة ومنتظمة',
                  'دعم فني مخصص لأصحاب المساحات',
                ]
              : [
                  'تسجيل مجاني بالكامل',
                  'واجهة سهلة الاستخدام',
                  'دعم فني على مدار الساعة',
                ]
            ).map(f => (
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
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 bg-[#F7F3EB] bg-paper overflow-y-auto">
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
            <p className="text-[#6B7566] text-sm mb-6">أدخل بياناتك للبدء في استخدام المنصة</p>

            {/* Role selector */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
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
                {
                  role: 'BUYER',
                  title: 'مشغل (مستأجر)',
                  desc: 'أبحث عن مساحة',
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4A554D] mb-1.5 tracking-wide">
                    الاسم الكامل / اسم المنشأة
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="field"
                    placeholder="أدخل الاسم"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A554D] mb-1.5 tracking-wide">
                    رقم الجوال
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    className="field"
                    placeholder="05X XXX XXXX"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4A554D] mb-1.5 tracking-wide">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="field"
                    placeholder="example@domain.com"
                    required
                    dir="ltr"
                  />
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
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* Seller document uploads */}
              {form.role === 'SELLER' && (
                <div className="pt-2">
                  <label className="block text-xs font-bold text-[#4A554D] mb-2 tracking-wide">
                    التحقق من الهوية (مطلوب لأصحاب المساحات)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* National ID */}
                    <div
                      onClick={() => !uploading && idRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                        hasNationalId
                          ? 'border-green-300 bg-green-50/50'
                          : 'border-[#E8E3D8] hover:border-[#C49A3C]/50 hover:bg-[#F7F3EB]/50'
                      }`}
                    >
                      {uploading === 'NATIONAL_ID' ? (
                        <svg className="animate-spin h-8 w-8 text-[#1B3A2D] mx-auto mb-2" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : hasNationalId ? (
                        <svg className="w-8 h-8 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-8 h-8 text-[#C49A3C] mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                        </svg>
                      )}
                      <p className="text-xs font-medium text-[#14201A]">إرفاق الهوية الوطنية</p>
                      <p className="text-[10px] text-[#6B7566] mt-0.5">{hasNationalId ? 'تم الرفع' : 'PDF أو صورة'}</p>
                      <input
                        ref={idRef}
                        type="file"
                        accept=".pdf,image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={e => {
                          if (e.target.files?.[0]) uploadDoc(e.target.files[0], 'NATIONAL_ID')
                          e.target.value = ''
                        }}
                      />
                    </div>

                    {/* Commercial Register */}
                    <div
                      onClick={() => !uploading && crRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                        hasCommercialReg
                          ? 'border-green-300 bg-green-50/50'
                          : 'border-[#E8E3D8] hover:border-[#C49A3C]/50 hover:bg-[#F7F3EB]/50'
                      }`}
                    >
                      {uploading === 'COMMERCIAL_REGISTER' ? (
                        <svg className="animate-spin h-8 w-8 text-[#1B3A2D] mx-auto mb-2" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : hasCommercialReg ? (
                        <svg className="w-8 h-8 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-8 h-8 text-[#C49A3C] mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      )}
                      <p className="text-xs font-medium text-[#14201A]">إرفاق السجل التجاري</p>
                      <p className="text-[10px] text-[#6B7566] mt-0.5">{hasCommercialReg ? 'تم الرفع' : 'اختياري - PDF أو صورة'}</p>
                      <input
                        ref={crRef}
                        type="file"
                        accept=".pdf,image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={e => {
                          if (e.target.files?.[0]) uploadDoc(e.target.files[0], 'COMMERCIAL_REGISTER')
                          e.target.value = ''
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2 pt-1">
                <input type="checkbox" required className="mt-1 accent-[#1B3A2D]" />
                <p className="text-[11px] text-[#6B7566] leading-relaxed">
                  أوافق على{' '}
                  <a href="#" className="text-[#1B3A2D] font-bold hover:underline">شروط الاستخدام</a>
                  {' '}و{' '}
                  <a href="#" className="text-[#1B3A2D] font-bold hover:underline">سياسة الخصوصية</a>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || uploading !== null}
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
