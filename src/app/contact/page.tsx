'use client'

import { FormEvent, useState } from 'react'
import PublicNavbar from '@/components/layout/PublicNavbar'
import Footer from '@/components/layout/Footer'
import { useLanguage } from '@/components/i18n/LanguageProvider'

const copy = {
  ar: {
    eyebrow: 'نحن هنا لمساعدتك',
    title: 'تواصل مع فريق إحياء مساحة',
    intro: 'أرسل استفسارك أو اقتراحك أو شكواك، وسيتابعها الفريق المختص بوضوح واهتمام.',
    type: 'نوع الرسالة',
    inquiry: 'استفسار',
    suggestion: 'اقتراح',
    complaint: 'شكوى',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    phone: 'رقم الجوال',
    subject: 'الموضوع',
    message: 'تفاصيل الرسالة',
    submit: 'إرسال الرسالة',
    sending: 'جاري الإرسال...',
    success: 'تم استلام رسالتك بنجاح. سيتواصل معك فريقنا قريبًا.',
    error: 'تعذر إرسال الرسالة. يرجى المحاولة مرة أخرى.',
    details: 'بيانات الشركة',
    city: 'الخبر، المملكة العربية السعودية',
  },
  en: {
    eyebrow: 'We are here to help',
    title: 'Contact the Ehya Masaha team',
    intro: 'Send an inquiry, suggestion, or complaint and the right team will follow up with care and clarity.',
    type: 'Message type',
    inquiry: 'Inquiry',
    suggestion: 'Suggestion',
    complaint: 'Complaint',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    subject: 'Subject',
    message: 'Message details',
    submit: 'Send message',
    sending: 'Sending...',
    success: 'Your message was received. Our team will contact you soon.',
    error: 'The message could not be sent. Please try again.',
    details: 'Company details',
    city: 'Al Khobar, Saudi Arabia',
  },
}

export default function ContactPage() {
  const { locale } = useLanguage()
  const text = copy[locale]
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setFeedback(null)
    const form = new FormData(event.currentTarget)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(form.entries())),
      })
      if (!response.ok) throw new Error()
      event.currentTarget.reset()
      setFeedback({ type: 'success', message: text.success })
    } catch {
      setFeedback({ type: 'error', message: text.error })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F3EB]">
      <PublicNavbar />
      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[.72fr_1.28fr] lg:px-8 lg:py-20">
        <aside className="rounded-3xl bg-[#10281E] p-7 text-white sm:p-9 lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs font-extrabold text-[#D8B455]">{text.eyebrow}</p>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight">{text.title}</h1>
          <p className="mt-5 text-sm leading-8 text-white/70">{text.intro}</p>
          <div className="mt-10 border-t border-white/12 pt-7">
            <h2 className="font-bold">{text.details}</h2>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              <li dir="ltr">info@ehyamesaha.sa</li>
              <li dir="ltr">+966 50 491 3274</li>
              <li>{text.city}</li>
            </ul>
          </div>
        </aside>

        <form onSubmit={submit} className="rounded-3xl border border-[#E1D9CA] bg-white p-6 shadow-[0_24px_60px_-45px_rgba(15,34,25,.5)] sm:p-9">
          <fieldset className="grid grid-cols-3 gap-2">
            <legend className="mb-3 text-sm font-extrabold text-[#1B3A2D]">{text.type}</legend>
            {[
              ['INQUIRY', text.inquiry],
              ['SUGGESTION', text.suggestion],
              ['COMPLAINT', text.complaint],
            ].map(([value, label], index) => (
              <label key={value} className="cursor-pointer">
                <input className="peer sr-only" type="radio" name="type" value={value} defaultChecked={index === 0} />
                <span className="block rounded-xl border border-[#DDD5C5] px-3 py-3 text-center text-xs font-bold text-[#566159] transition peer-checked:border-[#1B3A2D] peer-checked:bg-[#1B3A2D] peer-checked:text-white">{label}</span>
              </label>
            ))}
          </fieldset>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <ContactField label={text.name} name="name" required />
            <ContactField label={text.email} name="email" type="email" required dir="ltr" />
            <ContactField label={text.phone} name="phone" type="tel" dir="ltr" />
            <ContactField label={text.subject} name="subject" />
          </div>
          <label className="mt-5 block">
            <span className="mb-2 block text-xs font-extrabold text-[#4E5B52]">{text.message}</span>
            <textarea name="message" required rows={7} className="field resize-y" />
          </label>
          {feedback && (
            <p role="status" className={`mt-5 rounded-xl px-4 py-3 text-sm font-bold ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`}>
              {feedback.message}
            </p>
          )}
          <button disabled={loading} className="btn-primary mt-6 min-h-12 w-full rounded-xl px-6 py-3 text-sm font-extrabold disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? text.sending : text.submit}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  )
}

function ContactField({ label, name, type = 'text', required = false, dir }: { label: string; name: string; type?: string; required?: boolean; dir?: 'ltr' | 'rtl' }) {
  return (
    <label>
      <span className="mb-2 block text-xs font-extrabold text-[#4E5B52]">{label}</span>
      <input name={name} type={type} required={required} className="field" dir={dir} />
    </label>
  )
}
