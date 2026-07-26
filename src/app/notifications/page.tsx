import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/format'

export default async function NotificationsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')
  const notifications = await prisma.notification.findMany({ where: { userId: String(user.id) }, orderBy: { createdAt: 'desc' }, take: 100 })
  return <main className="min-h-screen bg-[#F7F3EB] px-4 py-10"><div className="mx-auto max-w-3xl"><Link href={user.role === 'SELLER' ? '/seller/dashboard' : user.role === 'ADMIN' ? '/admin/dashboard' : '/buyer/bookings'} className="text-sm font-bold text-[#1B3A2D]">العودة إلى لوحة التحكم</Link><header className="page-hero mb-6 mt-4 p-6"><p className="mb-2 text-xs font-bold text-[#D8B455]">التحديثات</p><h1 className="text-2xl font-extrabold text-white">الإشعارات</h1></header><section className="premium-card overflow-hidden">{notifications.length === 0 ? <p className="p-12 text-center text-sm text-[#6B7566]">لا توجد إشعارات</p> : <div className="divide-y divide-[#E8E3D8]">{notifications.map((notification) => <article key={notification.id} className="p-5"><div className="flex justify-between gap-3"><div><h2 className="font-extrabold text-[#14201A]">{notification.title}</h2><p className="mt-2 text-sm leading-7 text-[#4A554D]">{notification.message}</p></div><time className="shrink-0 text-xs text-[#7A847D]">{formatDate(notification.createdAt)}</time></div>{notification.href && <Link href={notification.href} className="mt-3 inline-flex text-xs font-bold text-[#1B3A2D]">فتح التفاصيل</Link>}</article>)}</div>}</section></div></main>
}
