import Link from 'next/link'

export default function PoliciesPage() {
  return <div className="min-h-screen bg-[#F7F3EB]">
    <header className="bg-gradient-to-b from-[#1B3A2D] to-[#0F2219] text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link href="/" className="text-sm font-bold text-white/70">العودة إلى الرئيسية</Link>
        <h1 className="mt-6 text-4xl font-extrabold">السياسات والأحكام</h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-white/70">نلتزم في إحياء مساحة بالوضوح وحماية حقوق أصحاب المساحات وطلابها.</p>
        <nav className="mt-6 flex flex-wrap gap-2">{[['#terms', 'شروط الاستخدام'], ['#privacy', 'الخصوصية'], ['#cancellation', 'الإلغاء'], ['#usage', 'الاستخدام المقبول']].map(([href, label]) => <a key={href} href={href} className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold hover:bg-white/20">{label}</a>)}</nav>
      </div>
    </header>
    <main className="mx-auto max-w-4xl space-y-7 px-6 py-10">
      <PolicyCard id="terms" title="شروط الاستخدام">
        <Intro>باستخدام منصة إحياء مساحة، فإنك توافق على هذه الشروط وعلى تقديم بيانات صحيحة وحديثة.</Intro>
        <Item num="1" title="التعريفات">«صاحب المساحة» هو الجهة التي تعرض المساحة، و«طالب المساحة» هو المستخدم الذي يحجزها، و«المنصة» هي إحياء مساحة وخدماتها الرقمية.</Item>
        <Item num="2" title="الأهلية والحساب">يجب أن يكون المستخدم مؤهلًا نظاميًا، وأن يحافظ على سرية حسابه. يحق للإدارة تعليق الحسابات المضللة أو المخالفة.</Item>
        <Item num="3" title="توثيق أصحاب المساحات">يخضع طلب الانضمام ومعلومات الجهة والمستندات وعقد الوساطة لمراجعة الإدارة قبل تفعيل الحساب أو نشر المساحات.</Item>
        <Item num="4" title="الحجز المباشر">يصبح الحجز مؤكدًا مباشرة عند اكتمال التحقق من التوفر. لا يحتاج الحجز إلى قبول لاحق من صاحب المساحة.</Item>
        <Item num="5" title="التزامات صاحب المساحة">تقديم وصف وصور وبيانات ترخيص دقيقة، والمحافظة على سلامة المساحة وتوفرها في الوقت المؤكد.</Item>
        <Item num="6" title="التزامات طالب المساحة">احترام قواعد المكان والوقت والسعة المحددة، وتحمل مسؤولية الأضرار الناتجة عن سوء الاستخدام.</Item>
        <Item num="7" title="حدود المسؤولية">تقدم المنصة خدمة تنظيم وربط تقني، وتدعم حل النزاعات وفق البيانات المتاحة والأنظمة المعمول بها.</Item>
      </PolicyCard>

      <PolicyCard id="privacy" title="سياسة الخصوصية">
        <Intro>تتعامل إحياء مساحة مع البيانات الشخصية وفق الأنظمة المعمول بها في المملكة العربية السعودية.</Intro>
        <Item num="1" title="البيانات التي نجمعها">بيانات الحساب والتواصل، ومستندات التحقق لأصحاب المساحات، وبيانات الحجوزات والرسائل والتقييمات.</Item>
        <Item num="2" title="أغراض الاستخدام">تشغيل الحساب والحجوزات، التحقق من الجهات، التواصل بين الأطراف، تحسين الخدمة، والامتثال للمتطلبات النظامية.</Item>
        <Item num="3" title="الوصول والحماية">يقتصر الوصول إلى المستندات والبيانات الحساسة على الأشخاص المخولين، مع تطبيق ضوابط أمنية وسجل لإجراءات الإدارة.</Item>
        <Item num="4" title="حقوق المستخدم">يمكنك طلب تصحيح بياناتك أو الاستفسار عن معالجتها عبر <a dir="ltr" href="mailto:info@ehyamesaha.sa" className="font-bold text-[#1B3A2D]">info@ehyamesaha.sa</a>.</Item>
      </PolicyCard>

      <PolicyCard id="cancellation" title="سياسة الإلغاء">
        <Intro>يمكن لطالب المساحة إلغاء الحجز من صفحة «حجوزاتي». يعرض النظام النتيجة المحسوبة قبل التأكيد، وفق السياسة المحددة للمساحة.</Intro>
        <div className="grid gap-4 sm:grid-cols-3">
          <PolicyBox title="مرنة" tone="green">استحقاق كامل عند الإلغاء قبل 24 ساعة من بداية الحجز.</PolicyBox>
          <PolicyBox title="متوسطة" tone="amber">استحقاق 50% عند الإلغاء قبل 5 أيام من بداية الحجز.</PolicyBox>
          <PolicyBox title="صارمة" tone="red">غير قابلة للاسترداد.</PolicyBox>
        </div>
        <Item num="1" title="طريقة الاحتساب">تُحسب المهلة من وقت الإلغاء الفعلي إلى وقت بداية الحجز، وتُحفظ نتيجة الاحتساب ضمن سجل الحجز.</Item>
        <Item num="2" title="إلغاء صاحب المساحة">يُسجل الإلغاء ويُشعر طالب المساحة، وقد تتخذ الإدارة إجراءً عند تكراره.</Item>
        <Item num="3" title="الظروف الاستثنائية">تراجع الإدارة الحالات القاهرة أو النزاعات بناءً على المستندات والأنظمة السارية.</Item>
        <p className="rounded-xl border border-[#E8E3D8] bg-[#FBFAF7] p-4 text-xs leading-6 text-[#6B7566]">ملاحظة: المنصة لا تنفذ تحصيلًا أو استردادًا ماليًا في الإصدار الحالي؛ تظهر القيم للاحتساب والتوثيق فقط.</p>
      </PolicyCard>

      <PolicyCard id="usage" title="سياسة الاستخدام المقبول">
        <Item num="1" title="المحتوى">يجب أن تكون الأوصاف والصور والتقييمات حقيقية ومحترمة وغير مضللة.</Item>
        <Item num="2" title="الأمان">يُحظر محاولة الوصول غير المصرح به أو إساءة استخدام الحسابات أو تعطيل الخدمة.</Item>
        <Item num="3" title="الإشراف">يحق للإدارة إخفاء المحتوى المخالف، وتعليق الحساب، والاحتفاظ بسجل القرار الإداري.</Item>
      </PolicyCard>
    </main>
    <footer className="pb-10 text-center text-xs text-[#6B7566]">جميع الحقوق محفوظة © {new Date().getFullYear()} إحياء مساحة · <span dir="ltr">+966 50 491 3274</span></footer>
  </div>
}

function PolicyCard({ id, title, children }: { id: string; title: string; children: React.ReactNode }) { return <section id={id} className="scroll-mt-6 rounded-2xl border border-[#ECE6D8] bg-white p-6 lg:p-8"><h2 className="mb-6 text-xl font-extrabold text-[#14201A]">{title}</h2><div className="space-y-5 text-sm leading-8 text-[#4A554D]">{children}</div></section> }
function Intro({ children }: { children: React.ReactNode }) { return <p className="font-bold text-[#1B3A2D]">{children}</p> }
function Item({ num, title, children }: { num: string; title: string; children: React.ReactNode }) { return <div className="border-r-2 border-[#C49A3C]/40 pr-4"><h3 className="font-extrabold text-[#14201A]">{num}. {title}</h3><p>{children}</p></div> }
function PolicyBox({ title, tone, children }: { title: string; tone: 'green' | 'amber' | 'red'; children: React.ReactNode }) {
  const classes = { green: 'border-green-200 bg-green-50', amber: 'border-amber-200 bg-amber-50', red: 'border-red-200 bg-red-50' }
  return <div className={`rounded-xl border p-5 ${classes[tone]}`}><h3 className="font-extrabold text-[#14201A]">{title}</h3><p className="mt-2 text-xs leading-6">{children}</p></div>
}
