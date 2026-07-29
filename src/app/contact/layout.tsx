import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'تواصل معنا | إحياء مساحة',
  description: 'تواصل مع فريق إحياء مساحة للاستفسارات والاقتراحات والشكاوى. نرد خلال مدة لا تتجاوز 72 ساعة بإذن الله.',
  alternates: { canonical: '/contact' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
