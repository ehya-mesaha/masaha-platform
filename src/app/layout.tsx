import type { Metadata } from 'next'
import { Tajawal } from 'next/font/google'
import './globals.css'

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
  display: 'swap',
  variable: '--font-tajawal',
})

export const metadata: Metadata = {
  title: 'مساحة | منصة حجز المساحات المرنة',
  description: 'اكتشف واحجز أفضل المساحات المكتبية وقاعات التدريب والاستوديوهات في مكان واحد.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className={tajawal.className}>{children}</body>
    </html>
  )
}
