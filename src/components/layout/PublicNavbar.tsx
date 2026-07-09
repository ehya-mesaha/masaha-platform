'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import LanguageToggle from '@/components/i18n/LanguageToggle'
import { useLanguage } from '@/components/i18n/LanguageProvider'

type User = {
  id: string
  name: string
  email: string
  role: string
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
    { href: '/#how-it-works' },
  ]

  function getNavLabel(href: string) {
    if (href === '/') return t('navHome')
    if (href === '/spaces') return t('navSpaces')
    return t('navHow')
  }

  return (
    <nav
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-md border-b border-[#ECE6D8] shadow-[0_4px_20px_-16px_rgba(20,32,26,0.25)]'
          : 'bg-white/60 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#244A3A] to-[#0F2219] flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-[#C49A3C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-extrabold text-[#1B3A2D]">{t('brand')}</span>
              <span className="text-[10px] text-[#6B7566] font-medium">{t('brandSub')}</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? 'text-[#1B3A2D] bg-[#1B3A2D]/5'
                    : 'text-[#4A554D] hover:text-[#1B3A2D] hover:bg-[#1B3A2D]/5'
                }`}
              >
                {getNavLabel(link.href)}
              </Link>
            ))}
            {!user && (
              <Link
                href="/auth/register?seller=1"
                className="px-4 py-2 rounded-lg text-sm font-medium text-[#4A554D] hover:text-[#1B3A2D] hover:bg-[#1B3A2D]/5 transition-all"
              >
                {t('navAddSpace')}
              </Link>
            )}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageToggle />
            {user ? (
              <>
                <Link
                  href={getDashboardLink()}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#F7F3EB] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#1B3A2D] text-white text-sm font-bold flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-[#1B3A2D]">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-[#6B7566] hover:text-red-600 px-3 py-2 transition-colors"
                >
                  {t('signOut')}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-[#1B3A2D] px-4 py-2 rounded-lg hover:bg-[#1B3A2D]/5 transition-colors"
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
            className="md:hidden p-2 text-[#1B3A2D] rounded-lg hover:bg-[#1B3A2D]/5"
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
          <div className="md:hidden border-t border-[#ECE6D8] py-3 flex flex-col gap-1 fade-up">
            <div className="px-3 pb-2">
              <LanguageToggle className="w-full justify-between" />
            </div>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-[#1B3A2D] text-sm font-medium px-3 py-2.5 rounded-lg hover:bg-[#1B3A2D]/5"
              >
                {getNavLabel(link.href)}
              </Link>
            ))}
            {user ? (
              <>
                <Link href={getDashboardLink()} className="text-[#1B3A2D] text-sm font-medium px-3 py-2.5 rounded-lg hover:bg-[#1B3A2D]/5">
                  {t('dashboard')}
                </Link>
                <button onClick={handleLogout} className="text-start text-red-600 text-sm font-medium px-3 py-2.5">
                  {t('logout')}
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2 border-t border-[#ECE6D8] mt-2">
                <Link href="/auth/login" className="flex-1 text-center text-sm font-medium border border-[#ECE6D8] py-2.5 rounded-lg">
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
