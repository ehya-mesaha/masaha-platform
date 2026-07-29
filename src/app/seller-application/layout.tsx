import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'انضم كصاحب مساحة | إحياء مساحة',
  description: 'قدّم طلب انضمام صاحب مساحة لعرض القاعات والمساحات غير المستغلة وإدارتها عبر منصة إحياء مساحة.',
  alternates: { canonical: '/seller-application' },
}

export default function SellerApplicationLayout({ children }: { children: React.ReactNode }) {
  return children
}
