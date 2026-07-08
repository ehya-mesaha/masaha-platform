import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'مساحة | منصة حجز المساحات المرنة',
  description: 'اكتشف واحجز أفضل المساحات المكتبية وقاعات التدريب والاستوديوهات في مكان واحد.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
