'use client'

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

export type Theme = 'light' | 'dark'

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)
const COOKIE_NAME = 'masaha_theme'

function persistTheme(theme: Theme) {
  window.localStorage.setItem(COOKIE_NAME, theme)
  document.cookie = `${COOKIE_NAME}=${theme}; path=/; max-age=31536000; SameSite=Lax`
}

export default function ThemeProvider({ children, initialTheme = 'light' }: { children: React.ReactNode; initialTheme?: Theme }) {
  // First render always matches what the server sent (via the cookie it read) — reading
  // localStorage/matchMedia here would let the client's first paint disagree with the
  // server-rendered HTML and throw a hydration mismatch (same class of bug as the i18n
  // locale provider). The actual page colors are FOUC-free regardless, via the inline
  // beforeInteractive script in the root layout that sets data-theme before hydration —
  // this state only drives the toggle button's own icon.
  const [theme, setThemeState] = useState<Theme>(initialTheme)
  const skipDomSync = useRef(true)

  // Once mounted, align React's state with whatever the inline script already resolved
  // (stored preference, or system preference if the visitor never chose).
  useEffect(() => {
    const current = document.documentElement.dataset.theme
    const resolved: Theme = current === 'dark' ? 'dark' : current === 'light' ? 'light' : theme
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (resolved !== theme) setThemeState(resolved)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Skip the very first sync pass — the inline script already applied the correct value
  // before hydration, so writing here too (with a possibly-stale first-render theme)
  // would briefly flash the wrong colors before the reconciliation above corrects it.
  useEffect(() => {
    if (skipDomSync.current) {
      skipDomSync.current = false
      return
    }
    document.documentElement.dataset.theme = theme
    persistTheme(theme)
  }, [theme])

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    setTheme: setThemeState,
    toggleTheme: () => setThemeState(current => current === 'dark' ? 'light' : 'dark'),
  }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
