import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import { cookies, headers } from 'next/headers'
import Script from 'next/script'
import './globals.css'
import LanguageProvider from '@/components/i18n/LanguageProvider'
import FirstVisitOpening from '@/components/layout/FirstVisitOpening'
import ExperienceLayer from '@/components/layout/ExperienceLayer'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-cairo',
})

export async function generateMetadata(): Promise<Metadata> {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()])
  const isEnglish = cookieStore.get('masaha_locale')?.value === 'en'
  const host =
    headerStore.get('x-forwarded-host') ??
    headerStore.get('host') ??
    'masaha-project.vercel.app'
  const protocol =
    headerStore.get('x-forwarded-proto') ??
    (host.includes('localhost') ? 'http' : 'https')
  const metadataBase = new URL(`${protocol}://${host}`)
  const title = isEnglish
    ? 'Ehya Masaha | Spaces that bring your ideas to life'
    : 'إحياء مساحة | مساحات تحيي أفكارك'
  const description = isEnglish
    ? 'Discover and book distinctive spaces by the hour for meetings, training, workshops, and shared work across Saudi Arabia.'
    : 'اكتشف واحجز مساحات مميزة بالساعة للاجتماعات والتدريب وورش العمل والعمل المشترك في مختلف مدن المملكة.'

  return {
    metadataBase,
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: isEnglish ? 'en_US' : 'ar_SA',
      siteName: isEnglish ? 'Ehya Masaha' : 'إحياء مساحة',
      images: [
        {
          url: '/og.png',
          width: 1731,
          height: 909,
          alt: 'Ehya Masaha — Space for what comes next',
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

  return (
    <html lang={locale} dir={dir} className={cairo.variable}>
      <Script id="masaha-opening-state" strategy="beforeInteractive">
        {`try{document.documentElement.dataset.masahaOpening=localStorage.getItem('masaha_opening_v3')==='seen'?'seen':'new'}catch(e){document.documentElement.dataset.masahaOpening='new'}`}
      </Script>
      <body>
        <LanguageProvider initialLocale={locale}>
          <ExperienceLayer />
          <FirstVisitOpening />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
