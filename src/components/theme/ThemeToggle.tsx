'use client'

import { useTheme } from './ThemeProvider'

export default function ThemeToggle({ className = '', showLabel = false }: { className?: string; showLabel?: boolean }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
      title={isDark ? 'الوضع الفاتح' : 'الوضع الداكن'}
      data-no-translate="true"
      className={`theme-toggle ${showLabel ? 'theme-toggle-labeled' : ''} ${className}`}
    >
      <span className={`theme-toggle-icon ${isDark ? 'is-dark' : ''}`} aria-hidden="true">
        <svg className="theme-toggle-sun" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4.2" />
          <path strokeLinecap="round" d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.55 1.55M17.85 17.85l1.55 1.55M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.55-1.55M17.85 6.15l1.55-1.55" />
        </svg>
        <svg className="theme-toggle-moon" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
      </span>
      {showLabel && <span className="theme-toggle-label">{isDark ? 'الوضع الداكن' : 'الوضع الفاتح'}</span>}
    </button>
  )
}
