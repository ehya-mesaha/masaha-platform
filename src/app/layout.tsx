import type { Metadata } from 'next'
import './globals.css'
import LanguageProvider from '@/components/i18n/LanguageProvider'

export const metadata: Metadata = {
  title: 'مساحة | منصة حجز المساحات المرنة',
  description: 'اكتشف واحجز أفضل المساحات المكتبية وقاعات التدريب والاستوديوهات في مكان واحد.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
