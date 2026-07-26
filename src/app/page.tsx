import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import PublicNavbar from '@/components/layout/PublicNavbar'
import Footer from '@/components/layout/Footer'
import SpaceCard from '@/components/spaces/SpaceCard'
import RecurringSearchForm from '@/components/spaces/RecurringSearchForm'

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

const ArrowIcon = () => (
  <svg className="h-4 w-4 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
  </svg>
)

export default async function HomePage() {
  const [spaces, types] = await Promise.all([getFeaturedSpaces(), getTypes()])

  return (
    <div className="public-shell min-h-screen">
      <PublicNavbar />

      <section className="home-hero-premium relative overflow-hidden text-white">
        <div className="home-hero-photo absolute inset-0 -z-20" aria-hidden="true" />
        <div className="home-hero-overlay absolute inset-0 -z-10" aria-hidden="true" />
        <div className="home-hero-architecture" aria-hidden="true">
          <span className="hero-architecture-frame" />
          <span className="hero-architecture-axis" />
          <span className="hero-architecture-orbit" />
        </div>
        <div className="home-hero-index" aria-hidden="true"><span>01</span><i /><span>05</span></div>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-[#E4C878]/70 to-transparent" />

        <div className="home-hero-content relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl fade-up">
            <p className="home-hero-kicker mb-6">مساحات مختارة بعناية في المملكة</p>
            <h1 className="font-display max-w-4xl text-[42px] font-extrabold leading-[1.1] text-white sm:text-6xl lg:text-[72px]">
              مساحة تناسب
              <br />
              <span className="text-[#E0BE69]">احتياجك</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              قاعات دراسية، مكاتب، قاعات اجتماعات… مصممة لتصل للمكان الأنسب لك.
            </p>
            <RecurringSearchForm />
          </div>
        </div>

        <div className="home-proof-rail">
          <div className="mx-auto grid max-w-7xl grid-cols-1 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-5 lg:px-8">
            {[
              ['M9 12.75 11.25 15 15 9.75M12 3l7.5 3v5.25c0 4.14-3.2 7.85-7.5 9.75-4.3-1.9-7.5-5.61-7.5-9.75V6L12 3Z', 'مساحات موثوقة', 'تم اعتمادها من الفريق المختص.'],
              ['M8 7V3m8 4V3M6 11h12M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z', 'حجز واضح ومرن', 'اختر الموعد والمساحة المناسبة بسهولة.'],
              ['M8 10h8m-8 4h5m8-2a9 9 0 1 1-4.2-7.63L21 3l-1.37 4.22A8.96 8.96 0 0 1 21 12Z', 'تواصل مباشر', 'رتّب احتياجك مع صاحب المساحة قبل الحجز.'],
              ['M4 6h16M4 12h16M4 18h10', 'خدمات تحسّن تجربتك', 'إضافات تساعدك على تجهيز المساحة لاستخدامك.'],
              ['M7 11h10M7 15h6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z', 'ادفع بأمان', 'دفع موثوق ومنظم من داخل المنصة.'],
            ].map(([path, title, desc]) => (
              <div key={title} className="home-proof-item">
                <span className="home-proof-icon">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={path} /></svg>
                </span>
                <span>
                  <strong className="block text-sm text-white">{title}</strong>
                  <span className="mt-0.5 block text-[11px] text-white/55">{desc}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {types.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="eyebrow mb-3"><span>ابدأ من احتياجك</span></div>
              <h2 className="font-display text-3xl font-extrabold text-[#14201A] lg:text-4xl">لكل فكرة، مساحة مناسبة</h2>
            </div>
            <Link href="/spaces" className="inline-flex items-center text-sm font-bold text-[#1B3A2D] transition-colors hover:text-[#C49A3C]">
              عرض جميع المساحات
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 stagger-grid">
            {types.slice(0, 5).map((type, index) => (
              <Link key={type.id} href={`/spaces?typeId=${type.id}`} className="category-link group">
                <span className="text-[11px] font-bold text-[#A3802F]">0{index + 1}</span>
                <span className="relative z-10 flex items-end">
                  <strong className="font-display text-base text-[#14201A] sm:text-lg">{type.name}</strong>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="border-y border-[#E8E1D3] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <div className="eyebrow mb-3"><span>مختارات إحياء مساحة</span></div>
              <h2 className="font-display text-3xl font-extrabold text-[#14201A] lg:text-4xl">أماكن تستحق الاكتشاف</h2>
              <p className="mt-2 text-[#6B7566]">أحدث المساحات المعتمدة والمتاحة لطلب الحجز الآن.</p>
            </div>
            <Link href="/spaces" className="hidden items-center gap-2 text-sm font-bold text-[#1B3A2D] transition-colors hover:text-[#C49A3C] sm:inline-flex">تصفح الكل <ArrowIcon /></Link>
          </div>

          {spaces.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger-grid">
              {spaces.map(space => (
                <SpaceCard key={space.id} id={space.id} name={space.name} city={space.city} district={space.district}
                  type={space.type.name} price={space.price} pricePeriod={space.pricePeriod} capacity={space.capacity}
                  imageUrl={space.images[0]?.url} />
              ))}
            </div>
          ) : (
            <div className="border-y border-[#E8E1D3] py-16 text-center">
              <h3 className="font-display text-xl font-extrabold text-[#14201A]">المختارات الجديدة قيد التجهيز</h3>
              <p className="mt-2 text-sm text-[#6B7566]">يمكنك إضافة مساحتك الآن لتكون من أوائل المساحات المعروضة.</p>
              <Link href="/auth/register?seller=1" className="btn-primary mt-6 inline-flex rounded-lg px-6 py-3 text-sm font-bold">أضف مساحتك</Link>
            </div>
          )}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <div className="eyebrow mb-3"><span>من البحث إلى الحجز</span></div>
            <h2 className="font-display text-3xl font-extrabold leading-tight text-[#14201A] lg:text-5xl">رحلة بسيطة، وقرار أوضح.</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#6B7566]">صممنا كل خطوة لتكون احتياجات برنامجك واضحة، من البحث وحتى تأكيد الحجز والخدمات.</p>
          </div>
          <div className="divide-y divide-[#DCD4C4] border-y border-[#DCD4C4] motion-list">
            {[
              ['01', 'ابحث بدقة', 'حدد المدينة والنوع والميزانية والسعة والأيام والأوقات التي تناسبك.'],
              ['02', 'راجع كل التفاصيل', 'قارن الصور والمرافق والخدمات والقواعد والموقع وتقييمات المشترين السابقين.'],
              ['03', 'احجز مباشرة', 'اختر الموعد والوحدة المتاحة، ثم أكّد حجزك فورًا من حسابك.'],
              ['04', 'اطلب خدمات', 'أضف الخدمات التي تحتاجها لتجهيز المساحة وتجربة الحضور.'],
              ['05', 'ادفع بأمان', 'راجع التكلفة بوضوح وأكمل حجزك بثقة من مكان واحد.'],
            ].map(([step, title, desc]) => (
              <div key={step} className="grid gap-4 py-8 sm:grid-cols-[4rem_1fr] sm:items-center">
                <span className="font-display text-2xl font-extrabold text-[#C49A3C]">{step}</span>
                <span>
                  <strong className="font-display block text-xl text-[#14201A]">{title}</strong>
                  <span className="mt-1 block text-sm leading-6 text-[#6B7566]">{desc}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="home-owner-cta px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
          <div className="max-w-2xl">
            <p className="home-hero-kicker mb-5">لأصحاب المساحات</p>
            <h2 className="font-display text-3xl font-extrabold leading-tight text-white lg:text-5xl">حوّل المساحة غير المستغلة إلى فرصة مستمرة.</h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/68">أضف تفاصيل مساحات مدرستك ووحداتها ومواعيدها وخدماتها، وابدأ استقبال حجوزات مؤكدة من باحثين جادين.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/auth/register?seller=1" className="btn-gold inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3.5 text-sm">ابدأ عرض مساحتك <ArrowIcon /></Link>
              <Link href="/spaces" className="inline-flex items-center justify-center rounded-lg border border-white/22 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/10">استكشف السوق</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
