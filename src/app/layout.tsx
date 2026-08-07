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

const SITE_URL = 'https://ehyamesaha.sa'
const AR_TITLE = 'إحياء مساحة | لإحياء المساحات غير المستغلة'
const EN_TITLE = 'Ehya Masaha | Reviving Underutilized Spaces'

const cairo = localFont({
  src: '../../public/fonts/ibm-plex-sans-arabic.woff',
  display: 'swap',
  variable: '--font-cairo',
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
    applicationName: isEnglish ? 'Ehya Masaha' : 'إحياء مساحة',
    title,
    description,
    keywords: isEnglish
      ? ['space rental Saudi Arabia', 'hourly space booking', 'training rooms', 'meeting rooms', 'classrooms', 'underutilized spaces', 'Ehya Masaha']
      : ['إحياء مساحة', 'تأجير مساحات', 'حجز قاعات بالساعة', 'قاعات تدريب', 'قاعات اجتماعات', 'فصول دراسية', 'مساحات غير مستغلة', 'مساحات عمل'],
    authors: [{ name: isEnglish ? 'Ehya Masaha' : 'إحياء مساحة', url: SITE_URL }],
    creator: isEnglish ? 'Ehya Masaha' : 'إحياء مساحة',
    publisher: isEnglish ? 'Ehya Masaha' : 'إحياء مساحة',
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
      siteName: isEnglish ? 'Ehya Masaha' : 'إحياء مساحة',
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
        name: 'إحياء مساحة',
        alternateName: 'Ehya Masaha',
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
        name: 'إحياء مساحة',
        alternateName: 'Ehya Masaha',
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
          {`try{var t=localStorage.getItem('masaha_theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}`}
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
