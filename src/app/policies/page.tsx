import type { Metadata } from 'next'
import Link from 'next/link'
import PublicNavbar from '@/components/layout/PublicNavbar'
import Footer from '@/components/layout/Footer'
import LegalEnglishGuide from '@/components/legal/LegalEnglishGuide'
import legalDocuments from '@/data/legal-documents.json'

export const metadata: Metadata = {
  title: 'السياسات والشروط | مساحة',
  description:
    'الوثائق القانونية الرسمية المنظمة لاستخدام منصة إحياء مساحة والحجوزات وأصحاب المساحات والخصوصية والملكية الفكرية.',
  alternates: { canonical: '/policies' },
}

const DOCUMENT_META: Record<string, { shortTitle: string; englishTitle: string; number: string }> = {
  'platform-terms': {
    shortTitle: 'شروط الاستخدام',
    englishTitle: 'Platform Terms of Use',
    number: '01',
  },
  'booking-terms': {
    shortTitle: 'شروط الحجز والخدمات',
    englishTitle: 'Booking & Service Terms',
    number: '02',
  },
  'owner-terms': {
    shortTitle: 'شروط أصحاب المساحات',
    englishTitle: 'Space Owner Terms',
    number: '03',
  },
  privacy: {
    shortTitle: 'سياسة الخصوصية',
    englishTitle: 'Privacy Policy',
    number: '04',
  },
  'intellectual-property': {
    shortTitle: 'الملكية الفكرية',
    englishTitle: 'Intellectual Property',
    number: '05',
  },
}

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <PublicNavbar />
      <main dir="rtl" data-no-translate="true">
        <section className="relative overflow-hidden bg-[#092C27] text-white">
          <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_15%_30%,#B99A63_0,transparent_28%),linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:auto,46px_46px,46px_46px]" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:items-end">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#B99A63]/30 bg-[#B99A63]/10 px-3.5 py-2 text-xs font-extrabold text-[#E0C589]">
                  <ShieldIcon />
                  الوثائق القانونية الرسمية
                </div>
                <h1 className="max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                  وضوح يحفظ الحقوق،
                  <span className="block text-[#D7B66D]">وثقة تنظّم كل علاقة.</span>
                </h1>
                <p className="mt-6 max-w-3xl text-sm leading-8 text-white/70 sm:text-base">
                  هذه هي النسخة الرسمية الكاملة للوثائق الخمس المنظمة لاستخدام منصة إحياء مساحة.
                  يُرجى قراءتها قبل إنشاء الحساب أو إضافة مساحة أو إتمام الحجز.
                </p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/[.055] p-5 backdrop-blur">
                <p className="text-xs font-bold text-[#D7B66D]">النسخة المعتمدة</p>
                <p className="mt-2 text-lg font-extrabold">الإصدار الأول</p>
                <p className="mt-1 text-xs leading-6 text-white/55">آخر تحديث: 26-7-2026 — 12-2-1448</p>
                <a
                  href="/legal/ehya-masaha-legal-pack.docx"
                  download
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-[#0E3B34] transition hover:bg-[#F4E8CE]"
                >
                  <DownloadIcon />
                  تنزيل الحزمة القانونية
                </a>
              </div>
            </div>
          </div>
        </section>

        <LegalEnglishGuide />

        <section className="border-b border-[#DED5C7] bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {legalDocuments.map((document) => {
                const meta = DOCUMENT_META[document.id]
                return (
                  <a
                    key={document.id}
                    href={`#${document.id}`}
                    className="group flex items-center gap-3 rounded-2xl border border-[#E1D9CD] bg-[#FAF8F3] p-4 transition hover:-translate-y-0.5 hover:border-[#B99A63] hover:bg-white hover:shadow-lg"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#0E3B34] text-xs font-extrabold text-[#D7B66D]">
                      {meta.number}
                    </span>
                    <span className="min-w-0">
                      <strong className="block text-sm text-[#17221E]">{meta.shortTitle}</strong>
                      <span className="mt-0.5 block truncate text-[10px] text-[#7B827E]" dir="ltr">
                        {meta.englishTitle}
                      </span>
                    </span>
                  </a>
                )
              })}
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[270px_minmax(0,1fr)] lg:px-8 lg:py-16">
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-[22px] border border-[#DED5C7] bg-white p-4 shadow-[0_18px_50px_rgba(9,44,39,.06)]">
              <p className="px-3 pb-3 text-xs font-extrabold text-[#8D7342]">فهرس الوثائق</p>
              <nav className="space-y-1">
                {legalDocuments.map((document) => {
                  const meta = DOCUMENT_META[document.id]
                  return (
                    <a key={document.id} href={`#${document.id}`} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-[#4E5A55] transition hover:bg-[#EEF3EE] hover:text-[#0E3B34]">
                      <span className="text-[11px] font-extrabold text-[#B1872E]">{meta.number}</span>
                      {meta.shortTitle}
                    </a>
                  )
                })}
              </nav>
              <div className="mt-4 rounded-xl bg-[#0E3B34] p-4 text-white">
                <p className="text-xs font-extrabold">هل لديك استفسار قانوني؟</p>
                <Link href="/contact" className="mt-3 inline-flex text-xs font-bold text-[#E0C589] underline underline-offset-4">
                  تواصل مع فريق إحياء مساحة
                </Link>
              </div>
            </div>
          </aside>

          <div className="space-y-10">
            <div className="rounded-2xl border border-[#D8D1C7] bg-[#FFFDF9] p-5 text-sm leading-8 text-[#5B655F]">
              <strong className="text-[#0E3B34]">ملاحظة لغوية:</strong>{' '}
              النص العربي أدناه هو النص القانوني الرسمي المعتمد. تظهر عناوين إنجليزية مساندة
              لتسهيل الوصول، ولا تحل محل النسخة العربية.
            </div>
            {legalDocuments.map((document) => (
              <LegalDocument key={document.id} document={document} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function LegalDocument({
  document,
}: {
  document: (typeof legalDocuments)[number]
}) {
  const meta = DOCUMENT_META[document.id]
  return (
    <article id={document.id} className="scroll-mt-28 overflow-hidden rounded-[28px] border border-[#D8D1C7] bg-white shadow-[0_24px_70px_rgba(17,40,32,.055)]">
      <header className="border-b border-[#E5DDD1] bg-gradient-to-l from-[#F8F3E8] to-white px-6 py-7 sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-extrabold tracking-wider text-[#B1872E]">الوثيقة {meta.number}</p>
            <h2 className="mt-2 text-2xl font-extrabold leading-tight text-[#102F29] sm:text-3xl">{document.title}</h2>
            <p className="mt-2 text-xs font-semibold text-[#767E7A]" dir="ltr">{meta.englishTitle}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2 text-[11px] font-bold">
            <span className="rounded-full bg-[#0E3B34] px-3 py-1.5 text-white">{document.version}</span>
            <span className="rounded-full border border-[#D8D1C7] bg-white px-3 py-1.5 text-[#6F756F]">{document.updatedAt}</span>
          </div>
        </div>
      </header>
      <div className="space-y-4 px-6 py-8 sm:px-8 sm:py-10">
        {document.paragraphs.map((paragraph, index) => (
          <LegalParagraph
            key={`${document.id}-${index}`}
            paragraph={paragraph}
            previous={document.paragraphs[index - 1]}
          />
        ))}
      </div>
    </article>
  )
}

function LegalParagraph({ paragraph, previous }: { paragraph: string; previous?: string }) {
  if (paragraph.startsWith('الإصدار') || paragraph.startsWith('آخر تحديث')) return null
  if (paragraph.startsWith('المادة ')) {
    return (
      <div className="mt-10 flex items-center gap-3 first:mt-0">
        <span className="rounded-full bg-[#0E3B34] px-3 py-1.5 text-xs font-extrabold text-[#E0C589]">{paragraph}</span>
        <span className="h-px flex-1 bg-[#E3DCCF]" />
      </div>
    )
  }
  if (previous?.startsWith('المادة ')) {
    return <h3 className="pb-1 text-xl font-extrabold text-[#17221E]">{paragraph}</h3>
  }
  if (/^(أولاً|ثانياً|ثالثاً|رابعاً|خامساً|سادساً|سابعاً|ثامناً|تاسعاً|عاشراً)[.:]/.test(paragraph)) {
    return <h3 className="mt-8 border-r-4 border-[#B99A63] pr-4 text-lg font-extrabold text-[#0E3B34]">{paragraph}</h3>
  }
  if (paragraph.startsWith('•')) {
    return <p className="flex gap-3 pr-3 text-sm leading-8 text-[#46524D]"><span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B99A63]" /><span>{paragraph.slice(1).trim()}</span></p>
  }
  if (/^\d+\./.test(paragraph)) {
    const [number, ...rest] = paragraph.split('.')
    return <p className="flex gap-3 rounded-xl bg-[#FAF8F3] px-4 py-3 text-sm leading-8 text-[#46524D]"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#E9DFCA] text-xs font-extrabold text-[#795F2D]">{number}</span><span>{rest.join('.').trim()}</span></p>
  }
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paragraph)) {
    return <a href={`mailto:${paragraph}`} dir="ltr" className="inline-flex rounded-lg bg-[#EEF3EE] px-3 py-2 text-sm font-extrabold text-[#0E3B34] hover:underline">{paragraph}</a>
  }
  return <p className="text-sm leading-8 text-[#46524D] sm:text-[15px]">{paragraph}</p>
}

function ShieldIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3 5 6v5c0 4.6 2.8 8 7 10 4.2-2 7-5.4 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg>
}

function DownloadIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 20h14" /></svg>
}
