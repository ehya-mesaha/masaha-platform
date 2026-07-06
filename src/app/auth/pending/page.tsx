import Link from 'next/link'

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F3EB] p-6">
      <div className="card-elevated max-w-md w-full p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-[#C49A3C]/10 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-[#C49A3C]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="font-display text-2xl font-extrabold text-[#14201A] mb-3">
          حسابك قيد المراجعة
        </h1>

        <p className="text-[#6B7566] text-sm leading-relaxed mb-6">
          شكراً لتسجيلك في منصة مساحة. يتم حالياً مراجعة مستنداتك والتحقق من بياناتك.
          سيتم إشعارك عبر البريد الإلكتروني فور اعتماد حسابك.
        </p>

        <div className="bg-[#F7F3EB] rounded-xl p-4 mb-6 text-start">
          <p className="text-xs font-bold text-[#1B3A2D] mb-2">ما الذي يحدث الآن؟</p>
          <ul className="space-y-2 text-xs text-[#6B7566]">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#1B3A2D] text-white flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">1</span>
              يتم مراجعة الهوية الوطنية والسجل التجاري
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#1B3A2D]/20 text-[#1B3A2D] flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">2</span>
              التحقق من صحة البيانات المقدمة
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#1B3A2D]/20 text-[#1B3A2D] flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">3</span>
              تفعيل الحساب وإرسال إشعار بالبريد الإلكتروني
            </li>
          </ul>
        </div>

        <p className="text-xs text-[#6B7566] mb-4">
          عادةً تتم المراجعة خلال <strong className="text-[#1B3A2D]">٢٤ ساعة عمل</strong>
        </p>

        <Link
          href="/"
          className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  )
}
