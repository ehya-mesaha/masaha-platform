'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

type Role = 'SELLER' | 'BUYER' | 'ADMIN'

interface SidebarProps {
  role: Role
  userName?: string
}

const iconClass = 'w-4 h-4'
const SvgIcon = ({ d }: { d: string }) => (
  <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
)

const ICONS = {
  dashboard: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  spaces: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  add: 'M12 4v16m8-8H4',
  bookings: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  users: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  tags: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
  settings: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z',
  logout: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
}

const sellerLinks = [
  { href: '/seller/dashboard', label: 'لوحة التحكم', icon: ICONS.dashboard },
  { href: '/seller/spaces', label: 'مساحاتي', icon: ICONS.spaces },
  { href: '/seller/spaces/new', label: 'إضافة مساحة', icon: ICONS.add },
  { href: '/seller/bookings', label: 'طلبات الحجز', icon: ICONS.bookings },
  { href: '/seller/settings', label: 'الإعدادات', icon: ICONS.settings },
]

const buyerLinks = [
  { href: '/buyer/bookings', label: 'حجوزاتي', icon: ICONS.bookings },
  { href: '/spaces', label: 'تصفح المساحات', icon: ICONS.search },
  { href: '/buyer/settings', label: 'الإعدادات', icon: ICONS.settings },
]

const adminLinks = [
  { href: '/admin/dashboard', label: 'لوحة التحكم', icon: ICONS.dashboard },
  { href: '/admin/spaces', label: 'المساحات', icon: ICONS.spaces },
  { href: '/admin/users', label: 'المستخدمون', icon: ICONS.users },
  { href: '/admin/bookings', label: 'الحجوزات', icon: ICONS.bookings },
  { href: '/admin/categories', label: 'التصنيفات', icon: ICONS.tags },
]

const roleLinks: Record<Role, typeof sellerLinks> = {
  SELLER: sellerLinks,
  BUYER: buyerLinks,
  ADMIN: adminLinks,
}

const roleLabel: Record<Role, string> = {
  SELLER: 'صاحب مساحة',
  BUYER: 'مستأجر',
  ADMIN: 'مدير النظام',
}

export default function DashboardSidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const links = roleLinks[role]

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-[#1B3A2D] via-[#1B3A2D] to-[#0F2219] flex flex-col relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 -end-16 w-64 h-64 rounded-full bg-[#C49A3C]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -start-16 w-64 h-64 rounded-full bg-[#C49A3C]/5 blur-3xl pointer-events-none" />

      {/* Logo & user */}
      <div className="relative px-5 py-5 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#C49A3C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-extrabold text-white">مساحة</span>
            <span className="text-[9px] text-white/40">MASAHA</span>
          </div>
        </Link>

        <div className="mt-5 flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C49A3C] to-[#b08832] flex items-center justify-center text-[#0F2219] font-extrabold text-lg">
            {userName?.charAt(0) || '?'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-semibold truncate">{userName}</p>
            <p className="text-white/50 text-[11px] font-medium">{roleLabel[role]}</p>
          </div>
        </div>
      </div>

      {/* Links */}
      <nav className="relative flex-1 px-3 py-5 flex flex-col gap-0.5">
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-3 mb-2">القائمة</p>
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== '/spaces' &&
              link.href !== '/seller/spaces/new' &&
              pathname.startsWith(link.href))
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-white text-[#1B3A2D] shadow-sm'
                  : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              <span className={isActive ? 'text-[#1B3A2D]' : 'text-[#C49A3C]/80'}>
                <SvgIcon d={link.icon} />
              </span>
              <span>{link.label}</span>
              {isActive && (
                <svg className="w-3.5 h-3.5 ms-auto rotate-180" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="relative px-3 py-4 border-t border-white/[0.06]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-red-500/15 hover:text-red-300 transition-colors"
        >
          <span className="text-[#C49A3C]/80"><SvgIcon d={ICONS.logout} /></span>
          تسجيل الخروج
        </button>
      </div>
    </aside>
  )
}
