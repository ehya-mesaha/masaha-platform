import Link from 'next/link'
import BrandLogo from '@/components/brand/BrandLogo'

const STATUS_CONTENT: Record<string, { icon: 'success' | 'error'; title: string; body: string }> = {
  success: {
    icon: 'success',
    title: 'تم تأكيد بريدك الإلكتروني',
    body: 'تم تفعيل حسابك بنجاح. يمكنك الآن تسجيل الدخول والبدء في استخدام إحياء مساحة.',
  },
  already: {
    icon: 'success',
    title: 'تم تأكيد هذا الحساب مسبقًا',
    body: 'بريدك الإلكتروني مؤكد بالفعل. يمكنك تسجيل الدخول مباشرة.',
  },
  invalid: {
    icon: 'error',
    title: 'رابط التأكيد غير صالح',
    body: 'هذا الرابط منتهي الصلاحية أو غير صحيح. يمكنك طلب رابط تأكيد جديد من صفحة تسجيل الدخول.',
  },
}

export default async function ConfirmedPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams
  const content = STATUS_CONTENT[status || ''] || STATUS_CONTENT.invalid
  const isSuccess = content.icon === 'success'

  return (
    <main className="grid min-h-screen place-items-center bg-[#F5F1E8] px-4">
      <section className="premium-card max-w-lg p-8 text-center">
        <Link href="/" className="mb-6 inline-flex" aria-label="إحياء مساحة">
          <BrandLogo variant="horizontal" tone="green" className="status-brand-logo" priority />
        </Link>
        <span className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${isSuccess ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {isSuccess ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          )}
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-[#1B1B1B]">{content.title}</h1>
        <p className="mt-3 text-sm leading-7 text-[#5F6764]">{content.body}</p>
        <Link href="/auth/login" className="mt-6 inline-flex rounded-xl bg-[#0E3B34] px-6 py-3 text-sm font-bold text-white">
          {isSuccess ? 'تسجيل الدخول' : 'الذهاب لتسجيل الدخول'}
        </Link>
      </section>
    </main>
  )
}
