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

export default async function HomePage() {
  const spaces = await getFeaturedSpaces()

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="bg-[#1B3A2D] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 start-10 w-64 h-64 rounded-full bg-[#C49A3C] blur-3xl" />
          <div className="absolute bottom-0 end-0 w-96 h-96 rounded-full bg-[#C49A3C] blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
              مساحات تلهم إبداعك،
              <br />
              <span className="text-[#C49A3C]">وتلبي احتياجاتك</span>
            </h1>
            <p className="text-gray-300 text-lg mb-10 leading-relaxed max-w-2xl">
              اكتشف واحجز أفضل المساحات المكتبية، قاعات التدريب، والاستوديوهات المرنة بكل سهولة وبدون التزامات طويلة الأمد.
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-2xl">
              <form action="/spaces" method="get" className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1 font-medium">الموقع</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="المدينة، الحي، أو المعلم"
                    className="w-full text-gray-900 text-sm focus:outline-none bg-transparent"
                  />
                </div>
                <div className="w-px bg-gray-200 hidden sm:block" />
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1 font-medium">النوع</label>
                  <input
                    type="text"
                    name="type"
                    placeholder="قاعة تدريب، مكتب..."
                    className="w-full text-gray-900 text-sm focus:outline-none bg-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#1B3A2D] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#0F2219] transition-colors whitespace-nowrap"
                >
                  ابحث الآن
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Spaces */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">مساحات مميزة</h2>
            <p className="text-gray-500 text-sm mt-1">اكتشف أفضل المساحات المتاحة للحجز</p>
          </div>
          <Link
            href="/spaces"
            className="text-[#1B3A2D] text-sm font-medium hover:underline flex items-center gap-1"
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
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E3D8]">
            <div className="text-6xl mb-4">🏢</div>
            <p className="text-gray-500">لا توجد مساحات متاحة حالياً</p>
            <Link href="/auth/register?seller=1" className="mt-4 inline-block text-[#1B3A2D] font-medium hover:underline">
              هل أنت صاحب مساحة؟ أضف مساحتك الآن
            </Link>
          </div>
        )}
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white py-16 border-y border-[#E8E3D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900">كيف تعمل مساحة؟</h2>
            <p className="text-gray-500 mt-2">ثلاث خطوات بسيطة للحجز</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '١',
                title: 'ابحث عن مساحتك',
                desc: 'ابحث بالمدينة والنوع والتاريخ لإيجاد المساحة المناسبة لك',
                icon: '🔍',
              },
              {
                step: '٢',
                title: 'اطلب الحجز',
                desc: 'أرسل طلب حجز للمساحة المناسبة وانتظر التأكيد من صاحب المساحة',
                icon: '📝',
              },
              {
                step: '٣',
                title: 'استمتع بمساحتك',
                desc: 'بعد القبول، احضر واستخدم مساحتك في الوقت المناسب',
                icon: '🎉',
              },
            ].map((item) => (
              <div key={item.step} className="text-center p-6 rounded-2xl hover:bg-[#F5F0E6] transition-colors">
                <div className="w-16 h-16 bg-[#1B3A2D]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                  {item.icon}
                </div>
                <div className="text-[#C49A3C] font-bold text-sm mb-2">الخطوة {item.step}</div>
                <h3 className="text-gray-900 font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#1B3A2D] rounded-3xl p-10 text-center text-white">
          <h2 className="text-3xl font-bold mb-3">هل تمتلك مساحة؟</h2>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto">
            أضف مساحتك على منصة مساحة وابدأ في استقبال طلبات الحجز من عملاء متحققين
          </p>
          <Link
            href="/auth/register?seller=1"
            className="bg-[#C49A3C] text-white font-semibold px-8 py-3 rounded-xl hover:bg-[#b08832] transition-colors inline-block"
          >
            أضف مساحتك مجاناً
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
