import Link from 'next/link'

export default async function SellerApplicationSuccess({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams
  return <main className="grid min-h-screen place-items-center bg-[#F7F3EB] px-4">
    <section className="premium-card max-w-xl p-8 text-center">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#E7F2E9] text-[#1B3A2D]"><svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></span>
      <h1 className="mt-5 text-2xl font-extrabold text-[#14201A]">تم استلام طلبك بنجاح</h1>
      <p className="mt-3 text-sm leading-7 text-[#6B7566]">سيُراجع فريق إحياء مساحة بيانات الجهة والمستندات، ثم يتواصل معك لاستكمال عقد الوساطة وتفعيل الحساب.</p>
      {ref && <p dir="ltr" className="mt-4 rounded-xl bg-[#F7F3EB] px-4 py-3 text-xs font-bold text-[#4A554D]">Reference: {ref}</p>}
      <Link href="/" className="mt-6 inline-flex rounded-xl bg-[#1B3A2D] px-6 py-3 text-sm font-bold text-white">العودة إلى الرئيسية</Link>
    </section>
  </main>
}
