'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import BrandLogo from '@/components/brand/BrandLogo'

type Role = 'SELLER' | 'BUYER' | 'ADMIN'
type NavLink = { href: string; label: string; icon: keyof typeof ICONS }

const ICONS = {
  dashboard: 'M3 12 12 3l9 9M5 10v10h14V10M9 20v-6h6v6',
  spaces: 'M4 21V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16M8 7h5M8 11h5M8 15h5M2 21h20',
  add: 'M12 5v14M5 12h14',
  bookings: 'M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87',
  tags: 'M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3.4 13.4A2 2 0 0 1 3 12V5a2 2 0 0 1 2-2h7a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.6ZM7 7h.01',
  messages: 'M21 12a9 9 0 1 1-4-7.5L21 3l-1.5 4A9 9 0 0 1 21 12ZM8 10h8M8 14h5',
  search: 'm21 21-5-5m2-6a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
  reports: 'M4 20V10m6 10V4m6 16v-7m4 7H2',
  needs: 'M3 11 21 3l-8 18-2-8-8-2Z',
  contact: 'M4 5h16v14H4V5Zm0 2 8 6 8-6',
  reviews: 'm12 2 3 6 7 .9-5 4.8 1.2 6.8L12 17l-6.2 3.5L7 13.7 2 8.9 9 8l3-6Z',
  services: 'M12 2v20M2 12h20M5 5l14 14M19 5 5 19',
  notifications: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
  settings: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z',
}

const links: Record<Role, NavLink[]> = {
  SELLER: [
    { href: '/seller/dashboard', label: 'لوحة التحكم', icon: 'dashboard' },
    { href: '/seller/spaces', label: 'مساحاتي', icon: 'spaces' },
    { href: '/seller/spaces/new', label: 'إضافة مساحة', icon: 'add' },
    { href: '/seller/bookings', label: 'الحجوزات', icon: 'bookings' },
    { href: '/seller/conversations', label: 'المحادثات', icon: 'messages' },
    { href: '/notifications', label: 'الإشعارات', icon: 'notifications' },
    { href: '/seller/settings', label: 'الإعدادات', icon: 'settings' },
  ],
  BUYER: [
    { href: '/buyer/bookings', label: 'حجوزاتي', icon: 'bookings' },
    { href: '/spaces', label: 'البحث عن مساحة', icon: 'search' },
    { href: '/buyer/space-needs', label: 'احتياج مساحة', icon: 'needs' },
    { href: '/buyer/services', label: 'الخدمات الإضافية', icon: 'services' },
    { href: '/buyer/conversations', label: 'المحادثات', icon: 'messages' },
    { href: '/notifications', label: 'الإشعارات', icon: 'notifications' },
    { href: '/buyer/settings', label: 'الإعدادات', icon: 'settings' },
  ],
  ADMIN: [
    { href: '/admin/dashboard', label: 'لوحة التحكم', icon: 'dashboard' },
    { href: '/admin/spaces', label: 'المساحات', icon: 'spaces' },
    { href: '/admin/seller-applications', label: 'طلبات الانضمام', icon: 'needs' },
    { href: '/admin/users', label: 'المستخدمون', icon: 'users' },
    { href: '/admin/bookings', label: 'الحجوزات', icon: 'bookings' },
    { href: '/admin/categories', label: 'التصنيفات والخدمات', icon: 'tags' },
    { href: '/admin/service-requests', label: 'طلبات الخدمات', icon: 'services' },
    { href: '/admin/contact-messages', label: 'التواصل والشكاوى', icon: 'contact' },
    { href: '/admin/reviews', label: 'مراجعة التقييمات', icon: 'reviews' },
    { href: '/admin/conversations', label: 'المحادثات', icon: 'messages' },
    { href: '/admin/reports', label: 'التقارير التشغيلية', icon: 'reports' },
  ],
}

const roleLabel = { SELLER: 'صاحب مساحة', BUYER: 'طالب مساحة', ADMIN: 'مدير النظام' }

export default function DashboardSidebar({ role, userName }: { role: Role; userName?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
    router.refresh()
  }
  return <aside className="relative flex min-h-screen w-64 flex-col overflow-hidden bg-gradient-to-b from-[#0E3B34] to-[#092C27]">
    <div className="border-b border-white/10 px-5 py-5">
      <Link href="/" className="flex items-center gap-3">
        <BrandLogo variant="horizontal" tone="white" className="dashboard-sidebar-logo" />
      </Link>
      <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#B99A63] text-lg font-extrabold text-[#1B1B1B]">{userName?.charAt(0) || '؟'}</span>
        <div className="min-w-0"><p className="truncate text-sm font-bold text-white">{userName}</p><p className="text-[11px] text-white/50">{roleLabel[role]}</p></div>
      </div>
    </div>
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-5">
      <p className="mb-2 px-3 text-[10px] font-bold tracking-wider text-white/35">القائمة</p>
      {links[role].map((link) => {
        const active = pathname === link.href || (link.href !== '/spaces' && link.href !== '/seller/spaces/new' && pathname.startsWith(`${link.href}/`))
        return <Link key={link.href} href={link.href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${active ? 'bg-white text-[#0E3B34]' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}><span className={active ? 'text-[#0E3B34]' : 'text-[#B99A63]'}><NavIcon path={ICONS[link.icon]} /></span>{link.label}</Link>
      })}
    </nav>
    <div className="border-t border-white/10 p-3"><button onClick={logout} className="w-full rounded-xl px-3 py-2.5 text-right text-sm font-bold text-white/70 hover:bg-red-500/10 hover:text-red-200">تسجيل الخروج</button></div>
  </aside>
}

function NavIcon({ path }: { path: string }) { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={path} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg> }
