import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { cookies } from 'next/headers'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import LanguageProvider from '@/components/i18n/LanguageProvider'
import ThemeProvider from '@/components/theme/ThemeProvider'
import FirstVisitOpening from '@/components/layout/FirstVisitOpening'
import ExperienceLayer from '@/components/layout/ExperienceLayer'
import {
  BRAND_NAME_AR, BRAND_NAME_EN, LEGAL_NAME_AR, LEGAL_NAME_EN,
  SITE_TITLE_AR, SITE_TITLE_EN, SITE_URL,
} from '@/lib/brand'

const AR_TITLE = SITE_TITLE_AR
const EN_TITLE = SITE_TITLE_EN

// Cairo — the brand's primary typeface ("خط القاهرة"). Variable weight axis 200–1000
// covers everything from detail copy to display headings from one 70 KB file.
const cairo = localFont({
  src: '../../public/fonts/cairo.woff2',
  weight: '200 1000',
  display: 'swap',
  variable: '--font-cairo',
  fallback: ['Segoe UI', 'Tahoma', 'Arial', 'system-ui', 'sans-serif'],
})

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const isEnglish = cookieStore.get('masaha_locale')?.value === 'en'
  const metadataBase = new URL(SITE_URL)
  const title = isEnglish ? EN_TITLE : AR_TITLE
  const description = isEnglish
    ? 'Discover and book trusted underutilized spaces by the hour for meetings, training, workshops, classrooms, and shared work across Saudi Arabia.'
    : 'منصة سعودية لإحياء المساحات غير المستغلة وربط أصحاب المساحات بالباحثين عن قاعات التدريب والاجتماعات والفصول ومساحات العمل للحجز بالساعة.'

  return {
    metadataBase,
    applicationName: isEnglish ? BRAND_NAME_EN : BRAND_NAME_AR,
    title,
    description,
    keywords: isEnglish
      ? ['space rental Saudi Arabia', 'hourly space booking', 'training rooms', 'meeting rooms', 'classrooms', 'underutilized spaces', 'Mesaha', 'Ehya Masaha']
      : ['مساحة', 'إحياء مساحة', 'تأجير مساحات', 'حجز قاعات بالساعة', 'قاعات تدريب', 'قاعات اجتماعات', 'فصول دراسية', 'مساحات غير مستغلة', 'مساحات عمل'],
    authors: [{ name: isEnglish ? LEGAL_NAME_EN : LEGAL_NAME_AR, url: SITE_URL }],
    creator: isEnglish ? LEGAL_NAME_EN : LEGAL_NAME_AR,
    publisher: isEnglish ? LEGAL_NAME_EN : LEGAL_NAME_AR,
    alternates: {
      canonical: '/',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    category: 'marketplace',
    formatDetection: { email: false, address: false, telephone: false },
    openGraph: {
      title,
      description,
      type: 'website',
      url: '/',
      locale: isEnglish ? 'en_US' : 'ar_SA',
      alternateLocale: isEnglish ? ['ar_SA'] : ['en_US'],
      siteName: isEnglish ? BRAND_NAME_EN : BRAND_NAME_AR,
      images: [
        {
          url: '/og.png',
          width: 1731,
          height: 909,
          alt: isEnglish ? EN_TITLE : AR_TITLE,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og.png'],
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const locale = cookieStore.get('masaha_locale')?.value === 'en' ? 'en' : 'ar'
  const dir = locale === 'en' ? 'ltr' : 'rtl'
  const theme = cookieStore.get('masaha_theme')?.value === 'dark' ? 'dark' : 'light'
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: LEGAL_NAME_AR,
        legalName: LEGAL_NAME_AR,
        alternateName: [BRAND_NAME_AR, BRAND_NAME_EN, LEGAL_NAME_EN],
        url: SITE_URL,
        logo: `${SITE_URL}/brand/logo-stacked-green.png`,
        email: 'info@ehyamesaha.sa',
        telephone: '+966504913274',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'الخبر',
          addressCountry: 'SA',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: BRAND_NAME_AR,
        alternateName: [BRAND_NAME_EN, LEGAL_NAME_AR, LEGAL_NAME_EN],
        inLanguage: ['ar-SA', 'en-SA'],
        publisher: { '@id': `${SITE_URL}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/spaces?city={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  }

  return (
    <html lang={locale} dir={dir} className={cairo.variable} suppressHydrationWarning>
      <body>
        <Script id="masaha-opening-state" strategy="beforeInteractive">
          {`try{document.documentElement.dataset.masahaOpening=localStorage.getItem('masaha_opening_v3')==='seen'?'seen':'new'}catch(e){document.documentElement.dataset.masahaOpening='new'}`}
        </Script>
        <Script id="masaha-theme-state" strategy="beforeInteractive">
          {`try{var t=localStorage.getItem('masaha_theme');document.documentElement.dataset.theme=(t==='dark')?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}`}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
        />
        <LanguageProvider initialLocale={locale}>
          <ThemeProvider initialTheme={theme}>
            <ExperienceLayer />
            <FirstVisitOpening />
            {children}
          </ThemeProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
