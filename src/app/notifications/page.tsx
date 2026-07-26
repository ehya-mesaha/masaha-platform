import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/format'
import BrandLogo from '@/components/brand/BrandLogo'

export default async function NotificationsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')
  const notifications = await prisma.notification.findMany({ where: { userId: String(user.id) }, orderBy: { createdAt: 'desc' }, take: 100 })
  return <main className="min-h-screen bg-[#F5F1E8] px-4 py-10"><div className="mx-auto max-w-3xl"><div className="flex items-center justify-between gap-4"><Link href="/" aria-label="إحياء مساحة"><BrandLogo variant="horizontal" tone="green" className="notification-brand-logo" priority /></Link><Link href={user.role === 'SELLER' ? '/seller/dashboard' : user.role === 'ADMIN' ? '/admin/dashboard' : '/buyer/bookings'} className="text-sm font-bold text-[#0E3B34]">العودة إلى لوحة التحكم</Link></div><header className="page-hero mb-6 mt-5 p-6"><p className="mb-2 text-xs font-bold text-[#B99A63]">التحديثات</p><h1 className="text-2xl font-extrabold text-white">الإشعارات</h1></header><section className="premium-card overflow-hidden">{notifications.length === 0 ? <p className="p-12 text-center text-sm text-[#5F6764]">لا توجد إشعارات</p> : <div className="divide-y divide-[#D8D1C7]">{notifications.map((notification) => <article key={notification.id} className="p-5"><div className="flex justify-between gap-3"><div><h2 className="font-extrabold text-[#1B1B1B]">{notification.title}</h2><p className="mt-2 text-sm leading-7 text-[#3F4B47]">{notification.message}</p></div><time className="shrink-0 text-xs text-[#7A847D]">{formatDate(notification.createdAt)}</time></div>{notification.href && <Link href={notification.href} className="mt-3 inline-flex text-xs font-bold text-[#0E3B34]">فتح التفاصيل</Link>}</article>)}</div>}</section></div></main>
}
