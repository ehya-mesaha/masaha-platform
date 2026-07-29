import Link from 'next/link'
import BrandLogo from '@/components/brand/BrandLogo'

export default async function SellerApplicationSuccess({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams
  return <main className="grid min-h-screen place-items-center bg-[#F5F1E8] px-4">
    <section className="premium-card max-w-2xl p-8 text-center">
      <Link href="/" className="mb-6 inline-flex" aria-label="إحياء مساحة">
        <BrandLogo variant="horizontal" tone="green" className="status-brand-logo" priority />
      </Link>
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#E7F2E9] text-[#0E3B34]"><svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></span>
      <h1 className="mt-5 text-2xl font-extrabold text-[#1B1B1B]">تم استلام طلبك بنجاح</h1>
      <div className="mt-5 space-y-4 text-start text-sm leading-8 text-[#5F6764]">
        <p>سيقوم فريق إحياء مساحة بمراجعة البيانات والمستندات وإعداد عقد وساطة وتسويق عقاري عبر منصة فال التابعة للهيئة العامة للعقار.</p>
        <p>بعد إرسال العقد، سيصل إلى مالك العقار أو معتمد الجهة إشعار من الهيئة العامة للعقار يحتوي على رابط مراجعة العقد. يجب قبول العقد أو رفضه خلال 7 أيام من تاريخ الإرسال.</p>
        <p>بعد اعتماد العقد، سيتم تفعيل حساب صاحب المساحة، ويمكنكم بعدها إضافة القاعات والمساحات التابعة للعقار.</p>
        <p className="rounded-xl border border-[#B99A63]/35 bg-[#F5F1E8] px-4 py-3 font-bold text-[#0E3B34]">ملاحظة: في حال عدم اتخاذ إجراء خلال 7 أيام، تنتهي مهلة اعتماد العقد، ويلزم التواصل مع فريق إحياء مساحة لإعادة الإجراء.</p>
      </div>
      {ref && <p dir="ltr" className="mt-4 rounded-xl bg-[#F5F1E8] px-4 py-3 text-xs font-bold text-[#3F4B47]">Reference: {ref}</p>}
      <Link href="/" className="mt-6 inline-flex rounded-xl bg-[#0E3B34] px-6 py-3 text-sm font-bold text-white">العودة إلى الرئيسية</Link>
    </section>
  </main>
}
