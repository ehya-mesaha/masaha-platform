'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

type Role = 'SELLER' | 'BUYER' | 'ADMIN'

interface SidebarProps {
  role: Role
  userName?: string
}

const sellerLinks = [
  { href: '/seller/dashboard', label: 'لوحة التحكم', icon: '◈' },
  { href: '/seller/spaces', label: 'مساحاتي', icon: '⊞' },
  { href: '/seller/spaces/new', label: 'إضافة مساحة', icon: '+' },
  { href: '/seller/bookings', label: 'طلبات الحجز', icon: '📋' },
  { href: '/seller/settings', label: 'الإعدادات', icon: '⚙' },
]

const buyerLinks = [
  { href: '/buyer/bookings', label: 'حجوزاتي', icon: '📋' },
  { href: '/spaces', label: 'تصفح المساحات', icon: '⊞' },
  { href: '/buyer/settings', label: 'الإعدادات', icon: '⚙' },
]

const adminLinks = [
  { href: '/admin/dashboard', label: 'لوحة التحكم', icon: '◈' },
  { href: '/admin/spaces', label: 'المساحات', icon: '⊞' },
  { href: '/admin/users', label: 'المستخدمون', icon: '👥' },
  { href: '/admin/bookings', label: 'الحجوزات', icon: '📋' },
  { href: '/admin/categories', label: 'التصنيفات', icon: '🏷' },
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
    <aside className="w-64 min-h-screen bg-[#1B3A2D] flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <Link href="/" className="text-2xl font-bold text-[#C49A3C]">
          مساحة
        </Link>
        <div className="mt-2">
          <p className="text-white text-sm font-medium truncate">{userName}</p>
          <p className="text-gray-400 text-xs">{roleLabel[role]}</p>
        </div>
      </div>

      {/* Links */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/spaces' && pathname.startsWith(link.href) && link.href !== '/seller/spaces/new')
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-white/15 text-white'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <span className="text-base w-5 text-center">{link.icon}</span>
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-gray-300 hover:bg-red-500/20 hover:text-red-300 transition-colors"
        >
          <span>🚪</span>
          تسجيل الخروج
        </button>
      </div>
    </aside>
  )
}
