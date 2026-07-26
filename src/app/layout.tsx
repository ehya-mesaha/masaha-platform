import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import Script from 'next/script'
import './globals.css'
import LanguageProvider from '@/components/i18n/LanguageProvider'
import FirstVisitOpening from '@/components/layout/FirstVisitOpening'

export const metadata: Metadata = {
  title: 'إحياء مساحة | مساحات موثوقة لبرامجك وفعالياتك',
  description: 'ابحث عن القاعات والمساحات المناسبة واحجزها مباشرة لبرامجك التعليمية وفعالياتك.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const locale = cookieStore.get('masaha_locale')?.value === 'en' ? 'en' : 'ar'
  const dir = locale === 'en' ? 'ltr' : 'rtl'

  return (
    <html lang={locale} dir={dir}>
      <Script id="masaha-opening-state" strategy="beforeInteractive">
        {`try{document.documentElement.dataset.masahaOpening=localStorage.getItem('masaha_opening_v1')==='seen'?'seen':'new'}catch(e){document.documentElement.dataset.masahaOpening='new'}`}
      </Script>
      <body>
        <LanguageProvider initialLocale={locale}>
          <FirstVisitOpening />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
