import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import PublicNavbar from '@/components/layout/PublicNavbar'
import Footer from '@/components/layout/Footer'
import SpaceCard from '@/components/spaces/SpaceCard'

export const dynamic = 'force-dynamic'

export const revalidate = 0

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
    <div className="min-h-screen flex flex-col bg-[#F8F6F1]">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="home-hero relative overflow-hidden text-white">
        <div className="absolute inset-0 home-hero-photo" aria-hidden="true" />
        <div className="absolute inset-0 home-hero-overlay" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-[#D8B35B]/70 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-16 lg:pb-20">
          <div className="max-w-4xl fade-up">
            <div className="inline-flex items-center gap-3 mb-6 text-[11px] sm:text-xs font-bold uppercase text-[#E4C878]">
              <span className="h-px w-8 bg-[#C49A3C]" />
              <span>منصة مساحة لحجز المساحات المرنة</span>
            </div>
            <h1 className="font-display max-w-4xl text-[42px] leading-[1.12] sm:text-6xl lg:text-[68px] font-extrabold text-white mb-6">
              المكان المناسب،
              <br />
              <span className="text-[#D9B65C]">لعمل يستحق الأفضل.</span>
            </h1>
            <p className="text-white/78 text-base sm:text-lg leading-8 max-w-2xl mb-9">
              اكتشف مساحات عمل وقاعات تدريب واستوديوهات مختارة بعناية، واحجزها بثقة من منصة واحدة.
            </p>

            <div className="home-search max-w-5xl">
              <form action="/spaces" method="get" className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr_0.9fr_auto] items-stretch">
                <label className="home-search-field">
                  <span>الموقع</span>
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#B28A32] flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 21s7-6.1 7-12A7 7 0 105 9c0 5.9 7 12 7 12Z"/><circle cx="12" cy="9" r="2.3"/></svg>
                    <input type="text" name="city" placeholder="المدينة أو الحي" />
                  </span>
                </label>
                <label className="home-search-field">
                  <span>نوع المساحة</span>
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#B28A32] flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 20h16M6 20V7l6-3 6 3v13M9 10h2m2 0h2m-6 4h2m2 0h2"/></svg>
                    <input type="text" name="type" placeholder="مكتب، قاعة، استوديو" />
                  </span>
                </label>
                <label className="home-search-field">
                  <span>التاريخ</span>
                  <input type="date" name="date" />
                </label>
                <div className="p-2.5">
                  <button type="submit" className="home-search-button">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-5.2-5.2m2.2-5.3a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0Z" /></svg>
                    ابحث الآن
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-white/65">
              {['مساحات موثقة', 'حجز مرن', 'دعم محلي'].map(item => (
                <span key={item} className="inline-flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#D9B65C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 12 4 4L19 6" /></svg>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category tabs */}
      {types.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-10 w-full">
          <div className="bg-white border border-[#E8E1D3] rounded-xl p-2.5 flex gap-2 overflow-x-auto shadow-[0_18px_50px_-38px_rgba(15,34,25,0.7)] animate-in">
            <Link
              href="/spaces"
              className="flex-shrink-0 px-5 py-2.5 rounded-lg bg-[#1B3A2D] text-white text-sm font-semibold whitespace-nowrap"
            >
              جميع المساحات
            </Link>
            {types.slice(0, 6).map(t => (
              <Link
                key={t.id}
                href={`/spaces?typeId=${t.id}`}
                className="flex-shrink-0 px-5 py-2.5 rounded-lg text-[#4A554D] text-sm font-medium hover:bg-[#F7F3EB] transition-colors whitespace-nowrap"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-grid">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 stagger-grid">
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
            ].map((item) => (
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 stagger-grid">
          {[
            { icon: '🛡️', title: 'مساحات موثقة', desc: 'مراجعة من فريق الإدارة' },
            { icon: '⚡', title: 'حجز سريع', desc: 'خلال دقائق فقط' },
            { icon: '💬', title: 'دعم فوري', desc: 'رد سريع على استفساراتك' },
            { icon: '📍', title: 'مواقع متعددة', desc: 'في أهم المدن السعودية' },
          ].map(f => (
            <div key={f.title} className="flex items-start gap-4 premium-card p-4">
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
        <div className="relative overflow-hidden rounded-3xl hero-pattern p-10 lg:p-16 text-center text-white animate-in">
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
