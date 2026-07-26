import Link from 'next/link'

export default function PendingApprovalPage() {
  return <main className="grid min-h-screen place-items-center bg-[#F7F3EB] px-4">
    <section className="premium-card max-w-lg p-8 text-center">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-amber-50 text-amber-700"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></span>
      <h1 className="mt-5 text-2xl font-extrabold text-[#14201A]">طلبك قيد المراجعة</h1>
      <p className="mt-3 text-sm leading-7 text-[#6B7566]">يراجع فريق إحياء مساحة بيانات الجهة والمستندات وعقد الوساطة. سنبلغك عند طلب تعديل أو عند تفعيل الحساب.</p>
      <div className="mt-5 rounded-xl bg-[#FBFAF7] p-4 text-right text-xs leading-6 text-[#4A554D]">
        <p>1. مراجعة بيانات الجهة والمستندات.</p>
        <p>2. إرسال عقد الوساطة واستكمال الاعتماد.</p>
        <p>3. تفعيل الحساب والبدء بإضافة المساحات.</p>
      </div>
      <Link href="/" className="mt-6 inline-flex rounded-xl bg-[#1B3A2D] px-6 py-3 text-sm font-bold text-white">العودة إلى الرئيسية</Link>
    </section>
  </main>
}
