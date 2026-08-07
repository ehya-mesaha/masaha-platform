'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import LanguageToggle from '@/components/i18n/LanguageToggle'
import { useLanguage } from '@/components/i18n/LanguageProvider'
import ThemeToggle from '@/components/theme/ThemeToggle'
import BrandLogo from '@/components/brand/BrandLogo'

type User = {
  id: string
  name: string
  email: string
  role: string
  avatarUrl?: string | null
} | null

export default function PublicNavbar() {
  const [user, setUser] = useState<User>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { t } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => { if (data.user) setUser(data.user) })
      .catch(() => {})

    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/')
    router.refresh()
  }

  function getDashboardLink() {
    if (!user) return '/auth/login'
    if (user.role === 'ADMIN') return '/admin/dashboard'
    if (user.role === 'SELLER') return '/seller/dashboard'
    return '/buyer/bookings'
  }

  const isActive = (href: string) => pathname === href

  const navLinks = [
    { href: '/' },
    { href: '/spaces' },
    { href: '/about' },
    { href: '/contact' },
  ]

  function getNavLabel(href: string) {
    if (href === '/') return t('navHome')
    if (href === '/spaces') return t('navSpaces')
    if (href === '/about') return t('navAbout')
    if (href === '/contact') return t('navContact')
    return t('navHome')
  }

  return (
    <nav
      className={`public-navbar sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'is-scrolled bg-white/85 backdrop-blur-md border-b border-[#D8D1C7] shadow-[0_4px_20px_-16px_rgba(20,32,26,0.25)]'
          : 'bg-white/60 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <span className="public-navbar-thread" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">
          {/* Logo */}
          <Link href="/" className="public-brand group" aria-label={t('brand')}>
            <BrandLogo
              variant="horizontal"
              tone="green"
              className="public-brand-logo"
              priority
              alt={t('brand')}
            />
          </Link>

          {/* Desktop Nav */}
          <div className="public-nav-links hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`public-nav-link px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? 'is-active text-[#0E3B34] bg-[#0E3B34]/5'
                    : 'text-[#3F4B47] hover:text-[#0E3B34] hover:bg-[#0E3B34]/5'
                }`}
              >
                {getNavLabel(link.href)}
              </Link>
            ))}
            {!user && (
              <Link
                href="/auth/register?seller=1"
                className="public-nav-link px-4 py-2 rounded-lg text-sm font-medium text-[#3F4B47] hover:text-[#0E3B34] hover:bg-[#0E3B34]/5 transition-all"
              >
                {t('navAddSpace')}
              </Link>
            )}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
            {user ? (
              <>
                <Link
                  href={getDashboardLink()}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#F5F1E8] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#0E3B34] text-white text-sm font-bold flex items-center justify-center overflow-hidden">
                    {user.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  <span className="text-sm font-medium text-[#0E3B34]">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-[#5F6764] hover:text-red-600 px-3 py-2 transition-colors"
                >
                  {t('signOut')}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-[#0E3B34] px-4 py-2 rounded-lg hover:bg-[#0E3B34]/5 transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/auth/register"
                  className="btn-primary text-sm font-semibold px-5 py-2.5 rounded-lg"
                >
                  {t('register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="public-menu-trigger md:hidden p-2 text-[#0E3B34] rounded-lg hover:bg-[#0E3B34]/5"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="public-mobile-menu md:hidden border-t border-[#D8D1C7] py-3 flex flex-col gap-1">
            <div className="flex items-center gap-2 px-3 pb-2">
              <LanguageToggle className="flex-1 justify-between" />
              <ThemeToggle />
            </div>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-[#0E3B34] text-sm font-medium px-3 py-2.5 rounded-lg hover:bg-[#0E3B34]/5"
              >
                {getNavLabel(link.href)}
              </Link>
            ))}
            {user ? (
              <>
                <Link href={getDashboardLink()} className="text-[#0E3B34] text-sm font-medium px-3 py-2.5 rounded-lg hover:bg-[#0E3B34]/5">
                  {t('dashboard')}
                </Link>
                <button onClick={handleLogout} className="text-start text-red-600 text-sm font-medium px-3 py-2.5">
                  {t('logout')}
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2 border-t border-[#D8D1C7] mt-2">
                <Link href="/auth/login" className="flex-1 text-center text-sm font-medium border border-[#D8D1C7] py-2.5 rounded-lg">
                  {t('login')}
                </Link>
                <Link href="/auth/register" className="flex-1 text-center btn-primary text-sm font-semibold py-2.5 rounded-lg">
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
