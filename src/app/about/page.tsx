import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import PublicNavbar from '@/components/layout/PublicNavbar'
import Footer from '@/components/layout/Footer'

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const isEnglish = cookieStore.get('masaha_locale')?.value === 'en'
  return {
    title: isEnglish ? 'About Us | Mesaha' : 'من نحن | مساحة',
    description: isEnglish
      ? 'Learn about the vision, mission, and values of Mesaha (Ehya Masaha).'
      : 'تعرف على رؤية ورسالة وقيم منصة مساحة.',
  }
}

const values = ['الثقة', 'الكفاءة', 'الشراكة', 'الاستدامة', 'الابتكار', 'الاحترافية']

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <PublicNavbar />
      <main>
        <section className="relative overflow-hidden bg-[#092C27] px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,#B99A63_0,transparent_35%),linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:auto,44px_44px,44px_44px]" />
          <div className="relative mx-auto max-w-6xl">
            <p className="eyebrow mb-5">من نحن</p>
            <h1 className="max-w-4xl font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-7xl">
              نبذة عن <span className="text-[#B99A63]">إحياء مساحة</span>
            </h1>
            <p className="mt-7 max-w-3xl text-base leading-9 text-white/75 sm:text-lg">
              شركة ناشئة متخصصة في تعظيم الاستفادة من المساحات غير المستغلة من خلال حلول متكاملة للربط، والتشغيل، والإدارة، والتقنية.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <ArticleCard
            number="01"
            title="الرؤية"
            text="أن تصبح إحياء مساحة شركة رائدة في تعظيم الاستفادة من المساحات غير المستغلة."
          />
          <ArticleCard
            number="02"
            title="الرسالة"
            text="إحياء المساحات غير المستغلة وتحويلها إلى أصول منتجة اقتصاديًا واجتماعيًا من خلال حلول مبتكرة تحقق قيمة مستدامة لجميع الأطراف."
          />
        </section>

        <section className="border-y border-[#E3DCCF] bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <p className="eyebrow mb-3">ما يقودنا</p>
            <h2 className="font-display text-3xl font-extrabold text-[#1B1B1B] sm:text-4xl">قيمنا</h2>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {values.map((value, index) => (
                <div key={value} className="rounded-2xl border border-[#D8D1C7] bg-[#FAF8F3] p-5 text-center">
                  <span className="text-xs font-extrabold text-[#B1872E]">{String(index + 1).padStart(2, '0')}</span>
                  <strong className="mt-3 block text-sm text-[#0E3B34]">{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function ArticleCard({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <article className="rounded-3xl border border-[#D8D1C7] bg-white p-7 shadow-[0_24px_60px_-45px_rgba(9, 44, 39,.5)] sm:p-9">
      <span className="text-sm font-extrabold text-[#B99A63]">{number}</span>
      <h2 className="mt-5 font-display text-3xl font-extrabold text-[#0E3B34]">{title}</h2>
      <p className="mt-4 text-sm leading-8 text-[#5D685F] sm:text-base">{text}</p>
    </article>
  )
}
