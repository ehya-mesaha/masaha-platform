import Link from 'next/link'

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-[#F7F3EB]">
      {/* Header */}
      <header className="bg-gradient-to-b from-[#1B3A2D] to-[#0F2219] text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            العودة للرئيسية
          </Link>
          <h1 className="font-display text-3xl lg:text-4xl font-extrabold mb-3">السياسات والأحكام</h1>
          <p className="text-white/70 text-sm max-w-lg">
            نلتزم في منصة مساحة بالشفافية الكاملة. اقرأ سياساتنا وأحكامنا لمعرفة حقوقك والتزاماتك عند استخدام المنصة.
          </p>

          {/* Quick nav */}
          <div className="flex flex-wrap gap-2 mt-6">
            <a href="#terms" className="px-4 py-2 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 transition-colors">شروط الاستخدام</a>
            <a href="#privacy" className="px-4 py-2 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 transition-colors">سياسة الخصوصية</a>
            <a href="#cancellation" className="px-4 py-2 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 transition-colors">سياسة الإلغاء</a>
            <a href="#usage" className="px-4 py-2 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 transition-colors">سياسة الاستخدام</a>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {/* Terms of Service */}
        <section id="terms" className="bg-white rounded-2xl border border-[#ECE6D8] p-6 lg:p-8 scroll-mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#1B3A2D] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#C49A3C]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-xl font-extrabold text-[#14201A]">شروط الاستخدام</h2>
              <p className="text-xs text-[#6B7566]">آخر تحديث: يوليو ٢٠٢٦</p>
            </div>
          </div>

          <div className="text-sm text-[#4A554D] leading-relaxed space-y-5">
            <p className="font-bold text-[#1B3A2D]">مرحباً بك في منصة مساحة. باستخدامك لهذه المنصة، فإنك توافق على الالتزام بالشروط والأحكام التالية:</p>

            <PolicySection num="١" title="التعريفات">
              تشير &ldquo;المنصة&rdquo; إلى موقع مساحة الإلكتروني وتطبيقاته. يُقصد بـ &ldquo;صاحب المساحة&rdquo; الطرف الذي يعرض مساحته للإيجار. يُقصد بـ &ldquo;المستأجر&rdquo; الطرف الذي يحجز المساحة.
            </PolicySection>

            <PolicySection num="٢" title="الأهلية والتسجيل">
              يجب أن يكون المستخدم قد بلغ سن الرشد النظامي (١٨ عاماً) في المملكة العربية السعودية. يلتزم المستخدم بتقديم بيانات صحيحة ودقيقة عند التسجيل، ويتحمل مسؤولية تحديثها. يحق للمنصة تعليق أو إلغاء أي حساب يتضمن بيانات مضللة أو غير صحيحة.
            </PolicySection>

            <PolicySection num="٣" title="التحقق من الهوية">
              يُلزم أصحاب المساحات بتقديم وثائق التحقق (الهوية الوطنية والسجل التجاري إن وُجد) كشرط لتفعيل حساباتهم. تخضع جميع الحسابات لمراجعة إدارية قبل الموافقة عليها.
            </PolicySection>

            <PolicySection num="٤" title="الحجوزات والمدفوعات">
              تُعدّ عملية الحجز مُلزمة لكلا الطرفين بمجرد التأكيد. يلتزم المستأجر بسداد المبلغ المتفق عليه وفقاً لشروط الدفع المحددة. تخضع عمليات الإلغاء لسياسة الإلغاء المعتمدة من قبل صاحب المساحة (مرنة، متوسطة، أو صارمة).
            </PolicySection>

            <PolicySection num="٥" title="التزامات صاحب المساحة">
              يلتزم صاحب المساحة بتقديم وصف دقيق وصور حقيقية للمساحة المعروضة. يتحمل صاحب المساحة مسؤولية صيانة المساحة وضمان سلامتها وملاءمتها للاستخدام المعلن. يحق للمنصة إزالة أي إعلان يتضمن معلومات مضللة.
            </PolicySection>

            <PolicySection num="٦" title="التزامات المستأجر">
              يلتزم المستأجر باحترام قواعد استخدام المساحة المحددة من قبل مالكها. يتحمل المستأجر مسؤولية أي أضرار تلحق بالمساحة خلال فترة الاستخدام. يلتزم المستأجر بإخلاء المساحة في الموعد المحدد.
            </PolicySection>

            <PolicySection num="٧" title="حدود المسؤولية">
              المنصة وسيط تقني بين أصحاب المساحات والمستأجرين، ولا تتحمل مسؤولية مباشرة عن جودة المساحات أو النزاعات بين الأطراف. تسعى المنصة لحل النزاعات ودياً وفق آليات التواصل المتاحة.
            </PolicySection>

            <PolicySection num="٨" title="التعديلات">
              يحق للمنصة تعديل هذه الشروط في أي وقت، ويُعدّ استمرار استخدام المنصة بعد التعديل موافقة ضمنية على الشروط المحدّثة.
            </PolicySection>
          </div>
        </section>

        {/* Privacy Policy */}
        <section id="privacy" className="bg-white rounded-2xl border border-[#ECE6D8] p-6 lg:p-8 scroll-mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#1B3A2D] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#C49A3C]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-xl font-extrabold text-[#14201A]">سياسة الخصوصية</h2>
              <p className="text-xs text-[#6B7566]">آخر تحديث: يوليو ٢٠٢٦</p>
            </div>
          </div>

          <div className="text-sm text-[#4A554D] leading-relaxed space-y-5">
            <p className="font-bold text-[#1B3A2D]">تلتزم منصة مساحة بحماية خصوصية مستخدميها وبياناتهم الشخصية وفقاً للأنظمة المعمول بها في المملكة العربية السعودية.</p>

            <PolicySection num="١" title="البيانات التي نجمعها">
              نقوم بجمع البيانات التالية: الاسم الكامل أو اسم المنشأة، البريد الإلكتروني، رقم الجوال، وثائق التحقق من الهوية (لأصحاب المساحات)، وبيانات الحجوزات والمعاملات المالية.
            </PolicySection>

            <PolicySection num="٢" title="كيفية استخدام البيانات">
              نستخدم بياناتك لأغراض: التحقق من الهوية وتفعيل الحساب، إتمام عمليات الحجز والتواصل بين الأطراف، تحسين خدمات المنصة وتجربة المستخدم، والامتثال للمتطلبات النظامية والقانونية.
            </PolicySection>

            <PolicySection num="٣" title="حماية البيانات">
              نتخذ إجراءات أمنية مناسبة لحماية بياناتك من الوصول غير المصرح به أو التعديل أو الإفشاء أو الإتلاف، بما في ذلك تشفير البيانات الحساسة واستخدام بروتوكولات أمان متقدمة.
            </PolicySection>

            <PolicySection num="٤" title="مشاركة البيانات">
              لا نشارك بياناتك الشخصية مع أطراف ثالثة إلا في الحالات التالية: بموافقتك الصريحة، لإتمام عملية حجز (مشاركة بيانات التواصل الضرورية مع الطرف الآخر)، أو بموجب طلب رسمي من جهة حكومية مختصة.
            </PolicySection>

            <PolicySection num="٥" title="ملفات تعريف الارتباط">
              تستخدم المنصة ملفات تعريف الارتباط (Cookies) لتحسين تجربة التصفح وتذكّر تفضيلات المستخدم. يمكنك التحكم في إعدادات الكوكيز من خلال متصفحك.
            </PolicySection>

            <PolicySection num="٦" title="حقوق المستخدم">
              يحق لك الوصول إلى بياناتك الشخصية وتعديلها أو حذفها. يمكنك طلب نسخة من بياناتك المخزنة لدينا. يحق لك الاعتراض على معالجة بياناتك في أي وقت عبر التواصل مع فريق الدعم.
            </PolicySection>

            <PolicySection num="٧" title="الاحتفاظ بالبيانات">
              نحتفظ ببياناتك طالما كان حسابك نشطاً أو حسب ما تقتضيه المتطلبات النظامية. عند حذف الحساب، يتم حذف البيانات الشخصية خلال ٣٠ يوماً، باستثناء ما يُلزمنا النظام بالاحتفاظ به.
            </PolicySection>

            <PolicySection num="٨" title="التواصل">
              لأي استفسارات تتعلق بسياسة الخصوصية، يُرجى التواصل معنا عبر البريد الإلكتروني: support@masaha.sa
            </PolicySection>
          </div>
        </section>

        {/* Cancellation Policy */}
        <section id="cancellation" className="bg-white rounded-2xl border border-[#ECE6D8] p-6 lg:p-8 scroll-mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#1B3A2D] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#C49A3C]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-xl font-extrabold text-[#14201A]">سياسة الإلغاء والاسترداد</h2>
              <p className="text-xs text-[#6B7566]">آخر تحديث: يوليو ٢٠٢٦</p>
            </div>
          </div>

          <div className="text-sm text-[#4A554D] leading-relaxed space-y-5">
            <p className="font-bold text-[#1B3A2D]">تتيح منصة مساحة لأصحاب المساحات اختيار سياسة الإلغاء المناسبة لمساحاتهم. فيما يلي تفاصيل كل سياسة:</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
              <div className="p-5 rounded-xl border-2 border-green-200 bg-green-50/50">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-green-800 text-sm mb-2">السياسة المرنة</h3>
                <ul className="text-xs text-green-700 space-y-1.5">
                  <li>- استرداد كامل عند الإلغاء قبل ٢٤ ساعة</li>
                  <li>- استرداد ٥٠٪ عند الإلغاء قبل ١٢ ساعة</li>
                  <li>- لا استرداد بعد ذلك</li>
                </ul>
              </div>

              <div className="p-5 rounded-xl border-2 border-amber-200 bg-amber-50/50">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-amber-800 text-sm mb-2">السياسة المتوسطة</h3>
                <ul className="text-xs text-amber-700 space-y-1.5">
                  <li>- استرداد كامل عند الإلغاء قبل ٥ أيام</li>
                  <li>- استرداد ٥٠٪ عند الإلغاء قبل ٣ أيام</li>
                  <li>- لا استرداد بعد ذلك</li>
                </ul>
              </div>

              <div className="p-5 rounded-xl border-2 border-red-200 bg-red-50/50">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <h3 className="font-bold text-red-800 text-sm mb-2">السياسة الصارمة</h3>
                <ul className="text-xs text-red-700 space-y-1.5">
                  <li>- استرداد ٥٠٪ عند الإلغاء قبل ٧ أيام</li>
                  <li>- لا استرداد بعد ذلك</li>
                  <li>- مناسبة للمناسبات الكبيرة</li>
                </ul>
              </div>
            </div>

            <PolicySection num="١" title="آلية الإلغاء">
              يمكن للمستأجر إلغاء الحجز من خلال لوحة التحكم الخاصة به. يتم احتساب فترة الإلغاء من لحظة تقديم الطلب وحتى موعد بدء الحجز. تُطبق سياسة الإلغاء المعتمدة من قبل صاحب المساحة عند عرض المساحة.
            </PolicySection>

            <PolicySection num="٢" title="الاسترداد">
              في حال استحقاق الاسترداد، يتم إعادة المبلغ خلال ٧-١٤ يوم عمل إلى وسيلة الدفع الأصلية. قد تختلف مدة الاسترداد حسب مزود خدمة الدفع.
            </PolicySection>

            <PolicySection num="٣" title="الظروف الاستثنائية">
              في حالات القوة القاهرة (كوارث طبيعية، أوامر حكومية، أو أحداث غير متوقعة) يحق للمستأجر الحصول على استرداد كامل بغض النظر عن سياسة الإلغاء المعتمدة.
            </PolicySection>

            <PolicySection num="٤" title="إلغاء صاحب المساحة">
              إذا ألغى صاحب المساحة الحجز، يحصل المستأجر على استرداد كامل للمبلغ. قد يتعرض صاحب المساحة لعقوبات إدارية في حال تكرار الإلغاء من جانبه.
            </PolicySection>
          </div>
        </section>

        {/* Usage Policy */}
        <section id="usage" className="bg-white rounded-2xl border border-[#ECE6D8] p-6 lg:p-8 scroll-mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#1B3A2D] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#C49A3C]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-xl font-extrabold text-[#14201A]">سياسة الاستخدام المقبول</h2>
              <p className="text-xs text-[#6B7566]">آخر تحديث: يوليو ٢٠٢٦</p>
            </div>
          </div>

          <div className="text-sm text-[#4A554D] leading-relaxed space-y-5">
            <p className="font-bold text-[#1B3A2D]">تهدف هذه السياسة إلى ضمان بيئة آمنة ومحترمة لجميع مستخدمي المنصة.</p>

            <PolicySection num="١" title="السلوكيات المحظورة">
              يُمنع استخدام المنصة لأي أغراض غير قانونية أو مخالفة للأنظمة المعمول بها. يُحظر نشر محتوى مسيء أو مضلل أو ينتهك حقوق الملكية الفكرية للآخرين. يُمنع محاولة الوصول غير المصرح به إلى حسابات المستخدمين أو أنظمة المنصة.
            </PolicySection>

            <PolicySection num="٢" title="المحتوى المنشور">
              يتحمل المستخدم المسؤولية الكاملة عن المحتوى الذي ينشره (صور، أوصاف، تقييمات). يجب أن تكون صور المساحات حقيقية وحديثة وتعكس الحالة الفعلية للمساحة. يحق للمنصة حذف أي محتوى ينتهك هذه السياسة دون إشعار مسبق.
            </PolicySection>

            <PolicySection num="٣" title="التقييمات والمراجعات">
              يجب أن تكون التقييمات صادقة ومبنية على تجربة فعلية. يُحظر نشر تقييمات مزيفة أو تحريض الآخرين على نشر تقييمات غير حقيقية. يحق للمنصة إزالة التقييمات المخالفة وتعليق الحسابات المسيئة.
            </PolicySection>

            <PolicySection num="٤" title="الإجراءات التأديبية">
              في حال مخالفة هذه السياسة، تحتفظ المنصة بحقها في: إرسال تنبيه للمستخدم المخالف، تعليق الحساب مؤقتاً أو دائماً، إزالة المحتوى المخالف، ورفع بلاغ للجهات المختصة عند الضرورة.
            </PolicySection>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center py-6 text-xs text-[#6B7566]">
          <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} منصة مساحة</p>
          <p className="mt-1">للتواصل: support@masaha.sa</p>
        </div>
      </div>
    </div>
  )
}

function PolicySection({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div className="border-r-2 border-[#C49A3C]/30 pr-4">
      <h3 className="font-bold text-[#14201A] text-sm mb-1">{num}. {title}</h3>
      <p>{children}</p>
    </div>
  )
}
