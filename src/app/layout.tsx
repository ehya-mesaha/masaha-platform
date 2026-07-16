import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import './globals.css'
import LanguageProvider from '@/components/i18n/LanguageProvider'

export const metadata: Metadata = {
  title: 'مساحة | منصة حجز المساحات المرنة',
  description: 'اكتشف واحجز أفضل المساحات المكتبية وقاعات التدريب والاستوديوهات في مكان واحد.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const locale = cookieStore.get('masaha_locale')?.value === 'en' ? 'en' : 'ar'
  const dir = locale === 'en' ? 'ltr' : 'rtl'

  return (
    <html lang={locale} dir={dir}>
      <body>
        <LanguageProvider initialLocale={locale}>{children}</LanguageProvider>
      </body>
    </html>
  )
}
