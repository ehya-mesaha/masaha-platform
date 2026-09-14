'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
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

  // Navigating with the menu open must not leave it covering the new page. Every link in
  // the panel closes it on click; this catches the routes that arrive another way — the
  // browser's back button, most of all. Adjusting during render rather than in an effect
  // keeps the closed menu from painting for a frame first.
  const [menuPathname, setMenuPathname] = useState(pathname)
  if (menuPathname !== pathname) {
    setMenuPathname(pathname)
    setMenuOpen(false)
  }

  // While the panel is open the page behind it stays put: Escape closes, and the body is
  // frozen so a scroll gesture over the backdrop does not drag the page away underneath.
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false) }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

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
    <>
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
              onClick={() => setMenuOpen(open => !open)}
              aria-label={t('menu')}
              aria-expanded={menuOpen}
              aria-controls="public-mobile-menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>

        </div>
      </nav>

      {/*
        The panel is fixed and portalled to <body>, not part of the navbar's flow.

        It used to render inside the sticky bar, so opening it grew the bar, pushed the whole
        document down, and the browser's scroll anchoring "corrected" for that shift — with
        `scroll-behavior: smooth` on <html>, the correction was an animated scroll, and
        tapping the hamburger visibly threw the reader down the page. Out of flow, opening
        the menu changes no layout at all, so there is nothing to correct.

        The portal is what makes `fixed` mean the viewport: `.route-frame` wraps every page in
        an entry animation whose `both` fill-mode leaves a resolved `transform` behind for
        good, and a transformed ancestor becomes the containing block for fixed descendants —
        which pinned the panel 832px above the screen instead of under the bar.
      */}
      {menuOpen && typeof document !== 'undefined' && createPortal(
        <>
          <button
            type="button"
            aria-label={t('closeMenu')}
            onClick={() => setMenuOpen(false)}
            className="public-menu-backdrop fixed inset-0 top-[68px] z-40 bg-[#0E1F1B]/35 backdrop-blur-[2px] md:hidden"
          />
          <div
            id="public-mobile-menu"
            className="public-mobile-menu fixed inset-x-0 top-[68px] z-50 max-h-[calc(100dvh-68px)] overflow-y-auto overscroll-contain border-b border-[#D8D1C7] bg-white px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_24px_48px_-28px_rgba(20,32,26,.55)] md:hidden"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 px-1 pb-2">
                <LanguageToggle className="flex-1 justify-between" />
                <ThemeToggle />
              </div>
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-lg px-3 py-3 text-sm font-medium ${
                    isActive(link.href) ? 'bg-[#0E3B34]/5 text-[#0E3B34]' : 'text-[#0E3B34] hover:bg-[#0E3B34]/5'
                  }`}
                >
                  {getNavLabel(link.href)}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    href={getDashboardLink()}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-3 text-sm font-medium text-[#0E3B34] hover:bg-[#0E3B34]/5"
                  >
                    {t('dashboard')}
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); void handleLogout() }}
                    className="rounded-lg px-3 py-3 text-start text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    {t('logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/register?seller=1"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-3 text-sm font-medium text-[#0E3B34] hover:bg-[#0E3B34]/5"
                  >
                    {t('navAddSpace')}
                  </Link>
                  <div className="mt-2 flex gap-2 border-t border-[#D8D1C7] pt-3">
                    <Link
                      href="/auth/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex-1 rounded-lg border border-[#D8D1C7] py-3 text-center text-sm font-medium text-[#0E3B34]"
                    >
                      {t('login')}
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setMenuOpen(false)}
                      className="btn-primary flex-1 rounded-lg py-3 text-center text-sm font-semibold"
                    >
                      {t('register')}
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </>,
        document.body,
      )}
    </>
  )
}
