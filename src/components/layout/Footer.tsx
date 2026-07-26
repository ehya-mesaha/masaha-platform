'use client'

import Link from 'next/link'
import { useLanguage } from '@/components/i18n/LanguageProvider'
import BrandLogo from '@/components/brand/BrandLogo'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="site-footer bg-[#0E3B34] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="footer-brand-link mb-5 inline-flex" aria-label={t('brand')}>
              <BrandLogo variant="horizontal" tone="white" className="site-footer-logo" alt={t('brand')} />
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed">
              {t('footerDesc')}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">{t('quickLinks')}</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/spaces" className="hover:text-[#B99A63] transition-colors">{t('navSpaces')}</Link></li>
              <li><Link href="/about" className="hover:text-[#B99A63] transition-colors">{t('navAbout')}</Link></li>
              <li><Link href="/contact" className="hover:text-[#B99A63] transition-colors">{t('navContact')}</Link></li>
              <li><Link href="/auth/register?seller=1" className="hover:text-[#B99A63] transition-colors">{t('navAddSpace')}</Link></li>
              <li><Link href="/auth/login" className="hover:text-[#B99A63] transition-colors">{t('login')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">{t('contactUs')}</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li dir="ltr">info@ehyamesaha.sa</li>
              <li dir="ltr">+966 50 491 3274</li>
              <li>{t('riyadhSaudi')}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} {t('brand')}. {t('footerRights')}
        </div>
      </div>
    </footer>
  )
}
