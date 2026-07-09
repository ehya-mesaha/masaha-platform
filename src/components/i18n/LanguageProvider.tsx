'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getDirection, Locale, TranslationKey, translations } from '@/lib/i18n'

type LanguageContextValue = {
  locale: Locale
  dir: 'rtl' | 'ltr'
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function getInitialLocale(): Locale {
  if (typeof document === 'undefined') return 'ar'
  const cookieLocale = document.cookie
    .split('; ')
    .find(row => row.startsWith('masaha_locale='))
    ?.split('=')[1]
  if (cookieLocale === 'en' || cookieLocale === 'ar') return cookieLocale
  const stored = window.localStorage.getItem('masaha_locale')
  return stored === 'en' || stored === 'ar' ? stored : 'ar'
}

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => getInitialLocale())

  const dir = getDirection(locale)

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = dir
    document.body.dataset.locale = locale
    window.localStorage.setItem('masaha_locale', locale)
    document.cookie = `masaha_locale=${locale}; path=/; max-age=31536000; SameSite=Lax`
  }, [locale, dir])

  const value = useMemo<LanguageContextValue>(() => ({
    locale,
    dir,
    setLocale: setLocaleState,
    toggleLocale: () => setLocaleState(prev => prev === 'ar' ? 'en' : 'ar'),
    t: key => translations[locale][key],
  }), [locale, dir])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
