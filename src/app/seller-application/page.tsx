'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import PublicNavbar from '@/components/layout/PublicNavbar'
import { LEGAL_LINKS } from '@/lib/legal'

type DocType = 'NATIONAL_ID' | 'COMMERCIAL_REGISTER' | 'TITLE_DEED' | 'POWER_OF_ATTORNEY'

const REQUIRED_DOC_TYPES: DocType[] = ['NATIONAL_ID', 'COMMERCIAL_REGISTER', 'TITLE_DEED']
const PROPERTY_OWNERSHIP_DOCUMENTS = [
  'صك إلكتروني', 'صك السجل العقاري', 'عقد إيجار إلكتروني', 'حالة تعاقدية في منصة إيجار',
  'صك ورقي', 'حجة استحكام', 'صك عقار مع حصر ورثة', 'صك تمويلي',
  'صك عقار مع عقد بيع', 'صك عقار مع شهادة وقفية', 'صك عقار مع إسناد عقار',
  'وثيقة ملكية المنفعة', 'صك عقار مع صك ولاية', 'صك عقار مع أمر قضائي',
  'عقد واقف', 'صك عقار مع قرار وزاري', 'وثيقة هيئة المدن الاقتصادية',
]

export default function SellerApplicationPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', schoolName: '', branchName: '',
    commercialRegisterNo: '', nationalIdNumber: '', multipleOwners: false, powerOfAttorneyNumber: '',
    consentAccepted: false,
  })
  const [documents, setDocuments] = useState<{ type: DocType; fileUrl: string }[]>([])
  const [uploading, setUploading] = useState<DocType | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPropertyDocsInfo, setShowPropertyDocsInfo] = useState(false)

  async function upload(file: File, type: DocType) {
    setUploading(type)
    setError('')
    const payload = new FormData()
    payload.append('file', file)
    payload.append('bucket', 'documents')
    try {
      const response = await fetch('/api/upload', { method: 'POST', body: payload })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setDocuments((current) => [...current.filter((document) => document.type !== type), { type, fileUrl: data.url }])
    } catch {
      setError('تعذر رفع المستند. تحقق من نوع الملف وحجمه ثم أعد المحاولة.')
    } finally {
      setUploading(null)
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (REQUIRED_DOC_TYPES.some((type) => !documents.some((document) => document.type === type))) {
      setError('يرجى إرفاق جميع المستندات المطلوبة: الهوية الوطنية، السجل التجاري، وصك الملكية أو ما يثبت الحق.')
      return
    }
    setLoading(true)
    setError('')
    const response = await fetch('/api/seller-applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, documents }),
    })
    const data = await response.json()
    if (!response.ok) {
      setError(data.error || 'تعذر إرسال الطلب')
      setLoading(false)
      return
    }
    router.push(`/seller-application/success?ref=${encodeURIComponent(data.id)}`)
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <PublicNavbar />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <header className="page-hero mb-7 p-8">
          <p className="mb-2 text-xs font-bold text-[#B99A63]">انضم إلى شبكة إحياء مساحة</p>
          <h1 className="text-3xl font-extrabold text-white">طلب انضمام صاحب مساحة</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">مسار واضح لمراجعة بيانات المدرسة أو الجهة، ثم إرسال عقد الوساطة واعتماد الحساب.</p>
        </header>

        <form onSubmit={submit} className="space-y-5">
          <Section title="1. بيانات المسؤول">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="الاسم الكامل" value={form.name} set={(value) => setForm({ ...form, name: value })} />
              <Field label="رقم الجوال" value={form.phone} set={(value) => setForm({ ...form, phone: value })} dir="ltr" />
              <Field label="البريد الإلكتروني" value={form.email} set={(value) => setForm({ ...form, email: value })} type="email" dir="ltr" />
              <Field label="كلمة المرور" value={form.password} set={(value) => setForm({ ...form, password: value })} type="password" dir="ltr" />
            </div>
          </Section>

          <Section title="2. بيانات الجهة">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="اسم المدرسة أو الجهة" value={form.schoolName} set={(value) => setForm({ ...form, schoolName: value })} />
              <Field label="اسم الفرع (اختياري)" value={form.branchName} set={(value) => setForm({ ...form, branchName: value })} />
              <Field label="رقم السجل التجاري" value={form.commercialRegisterNo} set={(value) => setForm({ ...form, commercialRegisterNo: value })} dir="ltr" />
              <Field label="رقم الهوية الوطنية" value={form.nationalIdNumber} set={(value) => setForm({ ...form, nationalIdNumber: value })} dir="ltr" />
            </div>
            <label className="mt-4 flex items-center gap-3 rounded-xl bg-[#F5F1E8] p-4 text-sm font-bold text-[#33423F]">
              <input type="checkbox" checked={form.multipleOwners} onChange={(event) => setForm({ ...form, multipleOwners: event.target.checked })} />
              العقار مملوك لأكثر من شخص
            </label>
            {form.multipleOwners && <div className="mt-4"><Field label="رقم الوكالة (اختياري)" value={form.powerOfAttorneyNumber} set={(value) => setForm({ ...form, powerOfAttorneyNumber: value })} dir="ltr" required={false} /></div>}
          </Section>

          <Section title="3. المستندات">
            <p className="mb-4 text-sm text-[#5F6764]">PDF أو صورة واضحة. تحفظ المستندات للمراجعة الإدارية فقط.</p>
            <div className="mb-3 flex items-center justify-between rounded-xl bg-[#F5F1E8] px-3 py-2 text-xs font-bold text-[#33423F]">
              <span>وثيقة الملكية تكون إحدى الوثائق المقبولة الموضحة هنا</span>
              <button type="button" onClick={() => setShowPropertyDocsInfo(true)} className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-[#0E3B34] text-sm font-extrabold text-[#0E3B34] transition-colors hover:bg-[#0E3B34] hover:text-white" aria-label="عرض وثائق الملكية المقبولة">i</button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Upload label="الهوية الوطنية" type="NATIONAL_ID" required uploaded={documents.some((item) => item.type === 'NATIONAL_ID')} uploading={uploading} onFile={upload} />
              <Upload label="السجل التجاري" type="COMMERCIAL_REGISTER" required uploaded={documents.some((item) => item.type === 'COMMERCIAL_REGISTER')} uploading={uploading} onFile={upload} />
              <Upload label="صك الملكية أو ما يثبت الحق" type="TITLE_DEED" required uploaded={documents.some((item) => item.type === 'TITLE_DEED')} uploading={uploading} onFile={upload} />
              {form.multipleOwners && <Upload label="الوكالة الشرعية (اختياري)" type="POWER_OF_ATTORNEY" required={false} uploaded={documents.some((item) => item.type === 'POWER_OF_ATTORNEY')} uploading={uploading} onFile={upload} />}
            </div>
          </Section>

          {showPropertyDocsInfo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="property-documents-title">
              <button type="button" className="absolute inset-0 bg-[#061B18]/60 backdrop-blur-sm" onClick={() => setShowPropertyDocsInfo(false)} aria-label="إغلاق قائمة وثائق الملكية" />
              <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl" dir="rtl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 id="property-documents-title" className="text-lg font-extrabold text-[#1B1B1B]">وثائق الملكية المقبولة</h2>
                    <p className="mt-1 text-sm text-[#5F6764]">تكون وثيقة الملكية إحدى الوثائق الآتية:</p>
                  </div>
                  <button type="button" onClick={() => setShowPropertyDocsInfo(false)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F5F1E8] text-xl font-bold text-[#0E3B34]" aria-label="إغلاق">×</button>
                </div>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {PROPERTY_OWNERSHIP_DOCUMENTS.map((document) => <li key={document} className="rounded-lg bg-[#F7F4EC] px-3 py-2 text-sm font-semibold text-[#33423F]">{document}</li>)}
                </ul>
              </div>
            </div>
          )}

          <section className="premium-card p-6">
            <label className="flex items-start gap-3 text-sm leading-7 text-[#33423F]">
              <input required className="mt-2" type="checkbox" checked={form.consentAccepted} onChange={(event) => setForm({ ...form, consentAccepted: event.target.checked })} />
              <span>
                أقر بصحة البيانات والمستندات المرفقة، وبأن مقدم الطلب أو معتمد الجهة مخول نظامًا بتمثيل مالك العقار أو مالكه، وأوافق على{' '}
                <LegalLink href={LEGAL_LINKS.platformTerms}>الشروط والأحكام</LegalLink>
                {' '}و
                <LegalLink href={LEGAL_LINKS.privacy}>سياسة الخصوصية</LegalLink>
                {' '}و
                <LegalLink href={LEGAL_LINKS.intellectualProperty}>سياسة الملكية الفكرية</LegalLink>
                ، وأوافق على استخدام هذه البيانات لإعداد عقد الوساطة العقارية عبر منصة فال التابعة للهيئة العامة للعقار.
              </span>
            </label>
            {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}
            <button disabled={loading || uploading !== null} className="mt-5 w-full rounded-xl bg-[#0E3B34] px-5 py-3 font-bold text-white disabled:opacity-60">{loading ? 'جاري إرسال الطلب...' : 'إرسال طلب الانضمام'}</button>
            <p className="mt-4 text-center text-xs text-[#5F6764]">لديك حساب؟ <Link href="/auth/login" className="font-bold text-[#0E3B34]">تسجيل الدخول</Link></p>
          </section>
        </form>
      </main>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) { return <section className="premium-card p-6"><h2 className="mb-5 text-lg font-extrabold text-[#1B1B1B]">{title}</h2>{children}</section> }
function LegalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} target="_blank" rel="noopener noreferrer" className="font-extrabold text-[#0E3B34] underline decoration-[#B99A63] decoration-2 underline-offset-4 hover:text-[#B1872E]">{children}</Link>
}
function Field({ label, value, set, type = 'text', dir, required = true }: { label: string; value: string; set: (value: string) => void; type?: string; dir?: 'ltr'; required?: boolean }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-bold text-[#33423F]">{label}</span><input required={required} type={type} dir={dir} value={value} onChange={(event) => set(event.target.value)} className="w-full rounded-xl border border-[#D8D1C7] px-4 py-3 outline-none focus:border-[#0E3B34]" /></label>
}
function Upload({ label, type, required, uploaded, uploading, onFile }: { label: string; type: DocType; required: boolean; uploaded: boolean; uploading: DocType | null; onFile: (file: File, type: DocType) => void }) {
  return <label className={`cursor-pointer rounded-2xl border p-4 ${uploaded ? 'border-green-300 bg-green-50' : 'border-dashed border-[#D8D1C7] bg-[#FAF8F3]'}`}><span className="block text-sm font-bold text-[#1B1B1B]">{label}{required ? ' *' : ''}</span><span className="mt-1 block text-xs text-[#5F6764]">{uploading === type ? 'جاري الرفع...' : uploaded ? 'تم الرفع — اضغط للاستبدال' : 'اضغط لاختيار الملف'}</span><input required={required && !uploaded} type="file" accept="image/*,.pdf" className="sr-only" onChange={(event) => event.target.files?.[0] && onFile(event.target.files[0], type)} /></label>
}
