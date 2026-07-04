import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import PublicNavbar from '@/components/layout/PublicNavbar'
import Footer from '@/components/layout/Footer'
import SpaceCard from '@/components/spaces/SpaceCard'

async function getFeaturedSpaces() {
  try {
    return await prisma.space.findMany({
      where: { status: 'APPROVED' },
      include: {
        type: true,
        images: { orderBy: { order: 'asc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    })
  } catch {
    return []
  }
}

async function getTypes() {
  try {
    return await prisma.spaceType.findMany({ orderBy: { name: 'asc' } })
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [spaces, types] = await Promise.all([getFeaturedSpaces(), getTypes()])

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F3EB]">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden hero-pattern text-white">
        {/* Decorative shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-24 -start-20 w-72 h-72 rounded-full bg-[#C49A3C]/20 blur-3xl" />
          <div className="absolute -bottom-32 -end-20 w-[500px] h-[500px] rounded-full bg-[#C49A3C]/10 blur-3xl" />
          <svg className="absolute top-0 end-0 w-64 h-64 text-[#C49A3C]/10" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="1" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-28 pb-24 lg:pb-36">
          <div className="max-w-3xl fade-up">
            <div className="eyebrow mb-6">
              <span>منصة مساحة</span>
            </div>
            <h1 className="font-display text-[42px] leading-[1.15] sm:text-5xl lg:text-6xl font-extrabold text-white mb-6">
              مساحات تلهم إبداعك،
              <br />
              <span className="bg-gradient-to-l from-[#E8D6A8] via-[#C49A3C] to-[#D4AA4C] bg-clip-text text-transparent">
                وتلبي احتياجاتك
              </span>
            </h1>
            <p className="text-white/75 text-lg leading-relaxed max-w-2xl mb-10">
              اكتشف واحجز أفضل المساحات المكتبية، قاعات التدريب، والاستوديوهات المرنة
              بكل سهولة وبدون التزامات طويلة الأمد.
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-2 shadow-2xl border border-white/20 max-w-4xl">
              <form action="/spaces" method="get" className="flex flex-col md:flex-row gap-1 md:gap-0 md:divide-x md:divide-x-reverse divide-[#ECE6D8]">
                <div className="flex-1 px-4 py-3 md:py-2">
                  <label className="block text-[11px] text-[#6B7566] mb-1 font-bold tracking-wider uppercase">
                    الموقع
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="المدينة، الحي، أو المعلم"
                    className="w-full text-[#14201A] text-sm focus:outline-none bg-transparent placeholder:text-[#B5B0A2]"
                  />
                </div>
                <div className="flex-1 px-4 py-3 md:py-2">
                  <label className="block text-[11px] text-[#6B7566] mb-1 font-bold tracking-wider uppercase">
                    نوع المساحة
                  </label>
                  <input
                    type="text"
                    name="type"
                    placeholder="قاعة تدريب، مكتب..."
                    className="w-full text-[#14201A] text-sm focus:outline-none bg-transparent placeholder:text-[#B5B0A2]"
                  />
                </div>
                <div className="flex-1 px-4 py-3 md:py-2">
                  <label className="block text-[11px] text-[#6B7566] mb-1 font-bold tracking-wider uppercase">
                    التاريخ
                  </label>
                  <input
                    type="date"
                    name="date"
                    className="w-full text-[#14201A] text-sm focus:outline-none bg-transparent placeholder:text-[#B5B0A2]"
                  />
                </div>
                <div className="p-1 md:p-1.5 flex items-stretch">
                  <button
                    type="submit"
                    className="btn-primary rounded-xl px-6 py-3 text-sm font-semibold whitespace-nowrap flex items-center gap-2 w-full justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    ابحث الآن
                  </button>
                </div>
              </form>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-3 gap-6 mt-10 max-w-2xl">
              {[
                { value: '+500', label: 'مساحة متاحة' },
                { value: '+50', label: 'مدينة' },
                { value: '24/7', label: 'دعم متواصل' },
              ].map(s => (
                <div key={s.label}>
                  <div className="font-display text-2xl lg:text-3xl font-extrabold text-[#C49A3C]">{s.value}</div>
                  <div className="text-white/70 text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* wave divider */}
        <div className="absolute bottom-0 start-0 end-0 h-16 bg-gradient-to-b from-transparent to-[#F7F3EB]" />
      </section>

      {/* Category tabs */}
      {types.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
          <div className="bg-white border border-[#ECE6D8] rounded-2xl p-3 flex gap-2 overflow-x-auto shadow-sm">
            <Link
              href="/spaces"
              className="flex-shrink-0 px-4 py-2 rounded-xl bg-[#1B3A2D] text-white text-sm font-semibold whitespace-nowrap"
            >
              جميع المساحات
            </Link>
            {types.slice(0, 6).map(t => (
              <Link
                key={t.id}
                href={`/spaces?typeId=${t.id}`}
                className="flex-shrink-0 px-4 py-2 rounded-xl text-[#4A554D] text-sm font-medium hover:bg-[#F7F3EB] transition-colors whitespace-nowrap"
              >
                {t.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Spaces */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="eyebrow mb-3"><span>مختارات</span></div>
            <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-[#14201A]">
              مساحات مميزة
            </h2>
            <p className="text-[#6B7566] mt-2">اكتشف أفضل المساحات المتاحة للحجز الآن</p>
          </div>
          <Link
            href="/spaces"
            className="hidden sm:inline-flex items-center gap-1 text-[#1B3A2D] text-sm font-semibold hover:gap-2 transition-all"
          >
            عرض الكل
            <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {spaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.map((space) => (
              <SpaceCard
                key={space.id}
                id={space.id}
                name={space.name}
                city={space.city}
                district={space.district}
                type={space.type.name}
                price={space.price}
                pricePeriod={space.pricePeriod}
                capacity={space.capacity}
                imageUrl={space.images[0]?.url}
              />
            ))}
          </div>
        ) : (
          <div className="card-elevated py-20 px-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F7F3EB] flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#C49A3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-[#14201A] mb-1">لا توجد مساحات بعد</h3>
            <p className="text-[#6B7566] text-sm mb-6">كن أول من يعرض مساحته على المنصة</p>
            <Link
              href="/auth/register?seller=1"
              className="inline-flex btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold"
            >
              أضف مساحتك الآن
            </Link>
          </div>
        )}
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white border-y border-[#ECE6D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-14">
            <div className="eyebrow mb-3 justify-center inline-flex"><span>خطوات بسيطة</span></div>
            <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-[#14201A]">
              كيف تعمل مساحة؟
            </h2>
            <p className="text-[#6B7566] mt-3 max-w-md mx-auto">ثلاث خطوات تفصلك عن مساحتك التالية</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                step: '01',
                title: 'ابحث عن مساحتك',
                desc: 'استخدم البحث والفلاتر لإيجاد المساحة المناسبة لك بالمدينة والنوع والتاريخ.',
                icon: (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'اطلب الحجز',
                desc: 'أرسل طلب حجز بالتاريخ والوقت والملاحظات، وسيتم مراجعته من صاحب المساحة.',
                icon: (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'استمتع بمساحتك',
                desc: 'بعد قبول الطلب، احضر في الموعد واستفد من مساحتك المرنة والمريحة.',
                icon: (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div key={item.step} className="relative card-elevated p-8">
                {/* Corner accent */}
                <div className="absolute top-6 end-6 text-4xl font-display font-extrabold text-[#F7F3EB] leading-none">
                  {item.step}
                </div>
                <div className="w-14 h-14 rounded-xl bg-[#1B3A2D] text-[#C49A3C] flex items-center justify-center mb-5 relative">
                  <div className="w-7 h-7">{item.icon}</div>
                </div>
                <h3 className="font-display text-xl font-extrabold text-[#14201A] mb-2">{item.title}</h3>
                <p className="text-[#6B7566] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / features strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '🛡️', title: 'مساحات موثقة', desc: 'مراجعة من فريق الإدارة' },
            { icon: '⚡', title: 'حجز سريع', desc: 'خلال دقائق فقط' },
            { icon: '💬', title: 'دعم فوري', desc: 'رد سريع على استفساراتك' },
            { icon: '📍', title: 'مواقع متعددة', desc: 'في أهم المدن السعودية' },
          ].map(f => (
            <div key={f.title} className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F7F3EB] border border-[#ECE6D8] flex items-center justify-center text-2xl flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <h4 className="font-bold text-[#14201A] text-sm mb-1">{f.title}</h4>
                <p className="text-[#6B7566] text-xs leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative overflow-hidden rounded-3xl hero-pattern p-10 lg:p-16 text-center text-white">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-0 start-1/4 w-72 h-72 rounded-full bg-[#C49A3C] blur-3xl" />
          </div>
          <div className="relative max-w-2xl mx-auto">
            <div className="eyebrow mb-4 justify-center inline-flex"><span>لأصحاب المساحات</span></div>
            <h2 className="font-display text-3xl lg:text-4xl font-extrabold mb-4">
              هل تمتلك مساحة غير مستغلة؟
            </h2>
            <p className="text-white/70 mb-8">
              أضف مساحتك على منصة مساحة، واستقبل طلبات الحجز من عملاء محتملين، وابدأ في تحويل مساحتك إلى مصدر دخل.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/auth/register?seller=1" className="btn-gold px-8 py-3.5 rounded-xl inline-flex items-center justify-center gap-2">
                أضف مساحتك مجاناً
                <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/spaces" className="border border-white/20 hover:bg-white/5 px-8 py-3.5 rounded-xl text-white font-semibold text-sm inline-flex items-center justify-center">
                تصفح المساحات
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
