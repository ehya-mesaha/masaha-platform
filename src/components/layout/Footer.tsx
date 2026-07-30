'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/components/i18n/LanguageProvider'
import BrandLogo from '@/components/brand/BrandLogo'

const COPY = {
  ar: {
    legalTitle: 'الوثائق القانونية',
    terms: 'شروط الاستخدام',
    bookingTerms: 'الحجز والإلغاء والاسترداد',
    ownerTerms: 'شروط أصحاب المساحات',
    privacy: 'سياسة الخصوصية',
    intellectualProperty: 'حقوق الملكية الفكرية',
    credentials: 'بيانات وتراخيص المنشأة',
    credentialsHint: 'بيانات رسمية للشفافية والامتثال',
    taxLabel: 'السجل التجاري',
    falLabel: 'رخصة فال',
  },
  en: {
    legalTitle: 'Legal Documents',
    terms: 'Terms of Use',
    bookingTerms: 'Booking, Cancellation & Refunds',
    ownerTerms: 'Space Owner Terms',
    privacy: 'Privacy Policy',
    intellectualProperty: 'Intellectual Property',
    credentials: 'Business Credentials & Licenses',
    credentialsHint: 'Official details published for transparency and compliance',
    taxLabel: 'Commercial Registration',
    falLabel: 'FAL License',
  },
} as const

export default function Footer() {
  const { t, locale } = useLanguage()
  const copy = COPY[locale]

  return (
    <footer className="site-footer mt-auto overflow-hidden bg-[#092C27] text-white">
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-5">
            <p className="text-xs font-extrabold text-[#D7B66D]">{copy.credentials}</p>
            <p className="mt-1 text-sm text-white/55">{copy.credentialsHint}</p>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            <CredentialCard
              image="/legal/saudi-registry.avif"
              alt={locale === 'ar' ? 'الشعار الرسمي للسجل التجاري' : 'Official commercial registration emblem'}
              label={copy.taxLabel}
              number="7054732743"
              imageClassName="h-[58px] w-[58px] object-contain"
            />
            <CredentialCard
              image="/legal/fal-license.png"
              alt={locale === 'ar' ? 'شعار رخصة فال' : 'FAL license logo'}
              label={copy.falLabel}
              number="1200049989"
              imageClassName="h-[46px] w-[78px] object-contain"
            />
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-[1.2fr_.8fr_1fr_.8fr]">
            <div>
              <Link href="/" className="footer-brand-link mb-5 inline-flex" aria-label={t('brand')}>
                <BrandLogo variant="horizontal" tone="white" className="site-footer-logo" alt={t('brand')} />
              </Link>
              <p className="max-w-md text-sm leading-7 text-white/60">{t('footerDesc')}</p>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-extrabold text-white">{t('quickLinks')}</h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li><FooterLink href="/spaces">{t('navSpaces')}</FooterLink></li>
                <li><FooterLink href="/about">{t('navAbout')}</FooterLink></li>
                <li><FooterLink href="/contact">{t('navContact')}</FooterLink></li>
                <li><FooterLink href="/auth/register?seller=1">{t('navAddSpace')}</FooterLink></li>
                <li><FooterLink href="/auth/login">{t('login')}</FooterLink></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-extrabold text-white">{copy.legalTitle}</h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li><FooterLink href="/terms">{copy.terms}</FooterLink></li>
                <li><FooterLink href="/refund-policy">{copy.bookingTerms}</FooterLink></li>
                <li><FooterLink href="/space-owner-terms">{copy.ownerTerms}</FooterLink></li>
                <li><FooterLink href="/privacy-policy">{copy.privacy}</FooterLink></li>
                <li><FooterLink href="/policies#intellectual-property">{copy.intellectualProperty}</FooterLink></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-extrabold text-white">{t('contactUs')}</h4>
              <ul className="space-y-3 text-sm text-white/60">
                <li dir="ltr"><a href="mailto:info@ehyamesaha.sa" className="transition hover:text-[#D7B66D]">info@ehyamesaha.sa</a></li>
                <li dir="ltr"><a href="tel:+966504913274" className="transition hover:text-[#D7B66D]">+966 50 491 3274</a></li>
                <li>{t('riyadhSaudi')}</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} {t('brand')}. {t('footerRights')}</span>
            <span dir="ltr">ehyamesaha.sa · Saudi Arabia</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function CredentialCard({
  image,
  alt,
  label,
  number,
  imageClassName,
}: {
  image: string
  alt: string
  label: string
  number: string
  imageClassName: string
}) {
  return (
    <div className="flex min-h-[92px] items-center gap-4 rounded-xl border border-white/10 bg-white/[.035] p-4">
      <span className="grid h-[66px] min-w-[90px] place-items-center overflow-hidden rounded-lg bg-white p-2">
        <Image src={image} alt={alt} width={100} height={70} className={imageClassName} />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-bold text-white/55">{label}</span>
        <strong className="mt-1 block font-mono text-lg tracking-[.08em] text-white" dir="ltr">{number}</strong>
      </span>
    </div>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="inline-flex items-center gap-2 transition hover:text-[#D7B66D]">
    <span className="h-1 w-1 rounded-full bg-[#B99A63]/70" />
    {children}
  </Link>
}
