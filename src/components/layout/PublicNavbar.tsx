'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type User = {
  id: string
  name: string
  email: string
  role: string
} | null

export default function PublicNavbar() {
  const [user, setUser] = useState<User>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.user) setUser(data.user)
      })
      .catch(() => {})
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

  return (
    <nav className="bg-white border-b border-[#E8E3D8] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-[#C49A3C] tracking-wide">
            مساحة
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-[#1B3A2D] text-sm font-medium transition-colors">
              الرئيسية
            </Link>
            <Link href="/spaces" className="text-gray-600 hover:text-[#1B3A2D] text-sm font-medium transition-colors">
              تصفح المساحات
            </Link>
            <a href="#how-it-works" className="text-gray-600 hover:text-[#1B3A2D] text-sm font-medium transition-colors">
              كيف نعمل
            </a>
            {!user && (
              <Link href="/auth/register?seller=1" className="text-gray-600 hover:text-[#1B3A2D] text-sm font-medium transition-colors">
                أضف مساحتك
              </Link>
            )}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={getDashboardLink()}
                  className="text-sm font-medium text-[#1B3A2D] hover:underline"
                >
                  {user.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-red-600 transition-colors"
                >
                  خروج
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-[#1B3A2D] hover:underline transition-colors"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-[#1B3A2D] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#0F2219] transition-colors"
                >
                  حساب جديد
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
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
          <div className="md:hidden border-t border-[#E8E3D8] py-4 flex flex-col gap-3">
            <Link href="/" className="text-gray-700 text-sm font-medium px-2">الرئيسية</Link>
            <Link href="/spaces" className="text-gray-700 text-sm font-medium px-2">تصفح المساحات</Link>
            {user ? (
              <>
                <Link href={getDashboardLink()} className="text-gray-700 text-sm font-medium px-2">لوحة التحكم</Link>
                <button onClick={handleLogout} className="text-right text-red-600 text-sm font-medium px-2">تسجيل الخروج</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-700 text-sm font-medium px-2">تسجيل الدخول</Link>
                <Link href="/auth/register" className="text-gray-700 text-sm font-medium px-2">حساب جديد</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
