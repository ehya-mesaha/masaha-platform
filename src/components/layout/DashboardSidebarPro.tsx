'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import LanguageToggle from '@/components/i18n/LanguageToggle'
import { useLanguage } from '@/components/i18n/LanguageProvider'
import ThemeToggle from '@/components/theme/ThemeToggle'
import type { TranslationKey } from '@/lib/i18n'
import BrandLogo from '@/components/brand/BrandLogo'

type Role = 'SELLER' | 'BUYER' | 'ADMIN'

interface SidebarProps {
  role: Role
  userName?: string
  avatarUrl?: string | null
}

const iconClass = 'h-4 w-4'
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
  policies: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  messages: 'M8 10h8m-8 4h5m8-2a9 9 0 11-4.219-7.625L21 3l-1.375 4.219A8.96 8.96 0 0121 12z',
  needs: 'M6 12L3.269 3.126A59.77 59.77 0 0121.485 12 59.768 59.768 0 013.27 20.876L6 12zm0 0h7.5',
  reports: 'M3 3v18h18M7 16l3-3 3 2 5-7',
  dataCenter: 'M4 5h16M4 12h16M4 19h16M8 3v18M16 3v18',
  extraServices: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z',
  reviews: 'M12 3l2.5 5.1 5.6.8-4 3.9.9 5.5-5-2.6-5 2.6.9-5.5-4-3.9 5.6-.8L12 3z',
  coupons: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
}

type SidebarLink = {
  href: string
  labelKey: TranslationKey
  icon: string
}

const sellerLinks: SidebarLink[] = [
  { href: '/seller/dashboard', labelKey: 'dashboard', icon: ICONS.dashboard },
  { href: '/seller/spaces', labelKey: 'mySpaces', icon: ICONS.spaces },
  { href: '/seller/spaces/new', labelKey: 'addSpace', icon: ICONS.add },
  { href: '/seller/bookings', labelKey: 'bookingRequests', icon: ICONS.bookings },
  { href: '/seller/conversations', labelKey: 'conversations', icon: ICONS.messages },
  { href: '/seller/settings', labelKey: 'settings', icon: ICONS.settings },
  { href: '/policies', labelKey: 'policies', icon: ICONS.policies },
]

const buyerLinks: SidebarLink[] = [
  { href: '/buyer/bookings', labelKey: 'myBookings', icon: ICONS.bookings },
  { href: '/spaces', labelKey: 'navSpaces', icon: ICONS.search },
  { href: '/buyer/space-needs', labelKey: 'needSpace', icon: ICONS.needs },
  { href: '/buyer/services', labelKey: 'partnerServices', icon: ICONS.extraServices },
  { href: '/buyer/conversations', labelKey: 'conversations', icon: ICONS.messages },
  { href: '/buyer/settings', labelKey: 'settings', icon: ICONS.settings },
  { href: '/policies', labelKey: 'policies', icon: ICONS.policies },
]

const adminLinks: SidebarLink[] = [
  { href: '/admin/dashboard', labelKey: 'dashboard', icon: ICONS.dashboard },
  { href: '/admin/spaces', labelKey: 'spaces', icon: ICONS.spaces },
  { href: '/admin/users', labelKey: 'users', icon: ICONS.users },
  { href: '/admin/bookings', labelKey: 'bookings', icon: ICONS.bookings },
  { href: '/admin/seller-applications', labelKey: 'sellerApplications', icon: ICONS.policies },
  { href: '/admin/service-requests', labelKey: 'serviceRequests', icon: ICONS.extraServices },
  { href: '/admin/space-needs', labelKey: 'spaceNeeds', icon: ICONS.needs },
  { href: '/admin/contact-messages', labelKey: 'contactMessages', icon: ICONS.messages },
  { href: '/admin/reviews', labelKey: 'reviews', icon: ICONS.reviews },
  { href: '/admin/reports', labelKey: 'reports', icon: ICONS.reports },
  { href: '/admin/data-center', labelKey: 'dataCenter', icon: ICONS.dataCenter },
  { href: '/admin/conversations', labelKey: 'conversations', icon: ICONS.messages },
  { href: '/admin/coupons', labelKey: 'coupons', icon: ICONS.coupons },
  { href: '/admin/categories', labelKey: 'categories', icon: ICONS.tags },
  { href: '/admin/settings', labelKey: 'settings', icon: ICONS.settings },
]

const roleLinks: Record<Role, SidebarLink[]> = {
  SELLER: sellerLinks,
  BUYER: buyerLinks,
  ADMIN: adminLinks,
}

const roleLabelKey: Record<Role, TranslationKey> = {
  SELLER: 'roleSeller',
  BUYER: 'roleBuyer',
  ADMIN: 'roleAdmin',
}

export default function DashboardSidebarPro({ role, userName, avatarUrl }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { dir, t } = useLanguage()
  const links = roleLinks[role]
  const [unreadConversations, setUnreadConversations] = useState(0)
  const [open, setOpen] = useState(false)
  const settingsHref = role === 'ADMIN' ? '/admin/settings' : role === 'SELLER' ? '/seller/settings' : '/buyer/settings'

  useEffect(() => {
    let cancelled = false

    async function loadUnread() {
      try {
        const res = await fetch('/api/conversations')
        if (!res.ok) return
        const data = await res.json()
        const count = (data.conversations || []).reduce(
          (total: number, conversation: { unreadCount?: number }) => total + (conversation.unreadCount || 0),
          0
        )
        if (!cancelled) setUnreadConversations(count)
      } catch {
        if (!cancelled) setUnreadConversations(0)
      }
    }

    loadUnread()
    const timer = window.setInterval(loadUnread, 30000)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="dashboard-mobile-bar sticky top-0 z-30 flex items-center justify-between border-b border-[#0E3B34]/10 bg-[#0E3B34] px-4 py-3 lg:hidden">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 hover:bg-white/10"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Link href="/" className="flex items-center" aria-label={t('brand')}>
          <BrandLogo variant="horizontal" tone="white" className="dashboard-mobile-logo" alt={t('brand')} />
        </Link>
        <Link href={settingsHref} className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#B99A63] to-[#b08832] text-sm font-extrabold text-[#092C27]">
          {avatarUrl ? (
            <img src={avatarUrl} alt={userName || 'profile'} className="h-full w-full object-cover" />
          ) : (
            userName?.charAt(0) || '?'
          )}
        </Link>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`dashboard-sidebar fixed inset-y-0 z-50 flex w-72 flex-col overflow-hidden border-white/[0.06] bg-[#092C27] transition-transform duration-300 ease-out lg:relative lg:z-auto lg:min-h-screen lg:w-64 lg:!translate-x-0 ${
          dir === 'rtl' ? 'right-0' : 'left-0'
        } ${
          open ? 'translate-x-0' : dir === 'rtl' ? 'max-lg:translate-x-full' : 'max-lg:-translate-x-full'
        }`}
      >
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />

      <div className="relative border-b border-white/[0.06] px-5 py-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="group flex items-center" aria-label={t('brand')}>
            <BrandLogo variant="horizontal" tone="white" className="dashboard-sidebar-logo" alt={t('brand')} />
          </Link>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 lg:hidden"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <Link href={settingsHref} onClick={() => setOpen(false)} className="mt-5 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.04] p-3 transition-colors hover:bg-white/[0.08]">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#B99A63] to-[#b08832] text-lg font-extrabold text-[#092C27]">
            {avatarUrl ? (
              <img src={avatarUrl} alt={userName || 'profile'} className="h-full w-full object-cover" />
            ) : (
              userName?.charAt(0) || '?'
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{userName}</p>
            <p className="text-[11px] font-medium text-white/50">{t(roleLabelKey[role])}</p>
          </div>
        </Link>
      </div>

      <nav className="dashboard-nav relative flex flex-1 flex-col gap-0.5 px-3 py-5">
        <div className="mb-3 flex items-center gap-2 px-3">
          <LanguageToggle className="flex-1 justify-between" compact={false} />
          <ThemeToggle className="theme-toggle-compact" />
        </div>
        <p className="mb-2 px-3 text-[10px] font-bold uppercase text-white/40">{t('menu')}</p>
        {links.map((link) => {
          const isConversations = link.href.includes('/conversations')
          const isActive =
            pathname === link.href ||
            (link.href !== '/spaces' &&
              link.href !== '/seller/spaces/new' &&
              pathname.startsWith(link.href))
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`dashboard-nav-link relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'is-active bg-white text-[#0E3B34] shadow-sm'
                  : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              <span className={isActive ? 'text-[#0E3B34]' : 'text-[#B99A63]/80'}>
                <SvgIcon d={link.icon} />
              </span>
              <span>{t(link.labelKey)}</span>
              {isConversations && unreadConversations > 0 && (
                <span className={`ms-auto flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${
                  isActive ? 'bg-[#B99A63] text-[#1B1B1B]' : 'bg-[#B99A63] text-[#092C27]'
                }`}>
                  {unreadConversations > 9 ? '9+' : unreadConversations}
                </span>
              )}
              {isActive && <span className={`${isConversations && unreadConversations > 0 ? '' : 'ms-auto'} dashboard-nav-marker`} aria-hidden="true" />}
            </Link>
          )
        })}
      </nav>

      <div className="relative border-t border-white/[0.06] px-3 py-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-red-500/15 hover:text-red-300"
        >
          <span className="text-[#B99A63]/80"><SvgIcon d={ICONS.logout} /></span>
          {t('logout')}
        </button>
      </div>
      </aside>
    </>
  )
}
