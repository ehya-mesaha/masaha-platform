import type { Metadata } from 'next'
import PublicNavbar from '@/components/layout/PublicNavbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'من نحن | إحياء مساحة',
  description: 'تعرف على رؤية ورسالة وقيم إحياء مساحة.',
}

const values = ['الثقة', 'الكفاءة', 'الشراكة', 'الاستدامة', 'الابتكار', 'الاحترافية']

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F7F3EB]">
      <PublicNavbar />
      <main>
        <section className="relative overflow-hidden bg-[#10281E] px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,#C49A3C_0,transparent_35%),linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:auto,44px_44px,44px_44px]" />
          <div className="relative mx-auto max-w-6xl">
            <p className="eyebrow mb-5">من نحن</p>
            <h1 className="max-w-4xl font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-7xl">
              نبذة عن <span className="text-[#D8B455]">إحياء مساحة</span>
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
            <h2 className="font-display text-3xl font-extrabold text-[#14201A] sm:text-4xl">قيمنا</h2>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {values.map((value, index) => (
                <div key={value} className="rounded-2xl border border-[#E8E1D3] bg-[#FBF8F1] p-5 text-center">
                  <span className="text-xs font-extrabold text-[#B1872E]">{String(index + 1).padStart(2, '0')}</span>
                  <strong className="mt-3 block text-sm text-[#1B3A2D]">{value}</strong>
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
    <article className="rounded-3xl border border-[#E1D9CA] bg-white p-7 shadow-[0_24px_60px_-45px_rgba(15,34,25,.5)] sm:p-9">
      <span className="text-sm font-extrabold text-[#C49A3C]">{number}</span>
      <h2 className="mt-5 font-display text-3xl font-extrabold text-[#1B3A2D]">{title}</h2>
      <p className="mt-4 text-sm leading-8 text-[#5D685F] sm:text-base">{text}</p>
    </article>
  )
}
