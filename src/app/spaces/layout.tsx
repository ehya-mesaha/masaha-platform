import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'حجز مساحات وقاعات بالساعة | مساحة',
  description: 'ابحث عن قاعات تدريب واجتماعات وفصول ومساحات عمل موثوقة واحجزها بالساعة في مدن المملكة.',
  alternates: { canonical: '/spaces' },
}

export default function SpacesLayout({ children }: { children: React.ReactNode }) {
  return children
}
