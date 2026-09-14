'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getDirection, Locale, TranslationKey, translations } from '@/lib/i18n'
import { translateDomText } from '@/lib/domTranslations'

type LanguageContextValue = {
  locale: Locale
  dir: 'rtl' | 'ltr'
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)
const originalText = new WeakMap<Text, string>()
const originalAttributes = new WeakMap<Element, Partial<Record<'placeholder' | 'aria-label' | 'title', string>>>()
const ignoredTags = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'TEXTAREA', 'CODE', 'PRE'])
const translatedAttributes = ['placeholder', 'aria-label', 'title'] as const
const arabicTextPattern = /[\u0600-\u06FF]/
const arabicDigitsPattern = /[٠-٩]/g

function latinDigits(value: string) {
  return value.replace(arabicDigitsPattern, digit => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
}

function getInitialLocale(fallback: Locale): Locale {
  if (typeof document === 'undefined') return fallback
  const cookieLocale = document.cookie
    .split('; ')
    .find(row => row.startsWith('masaha_locale='))
    ?.split('=')[1]
  if (cookieLocale === 'en' || cookieLocale === 'ar') return cookieLocale
  const stored = window.localStorage.getItem('masaha_locale')
  return stored === 'en' || stored === 'ar' ? stored : fallback
}

export default function LanguageProvider({ children, initialLocale = 'ar' }: { children: React.ReactNode; initialLocale?: Locale }) {
  // Always start from the server-rendered locale so the client's first render
  // matches the server's HTML exactly — reading cookie/localStorage here (even
  // as a lazy initializer) runs during hydration and can disagree with what
  // the server saw, which throws a hydration mismatch on the very first paint.
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  const dir = getDirection(locale)

  // Once hydrated, reconcile with any stored preference the server couldn't see
  // (cookie/localStorage are only readable client-side, so this can't happen
  // during render without risking the mismatch this whole effect exists to avoid).
  useEffect(() => {
    const preferred = getInitialLocale(initialLocale)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (preferred !== locale) setLocaleState(preferred)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = dir
    document.body.dataset.locale = locale
    window.localStorage.setItem('masaha_locale', locale)
    document.cookie = `masaha_locale=${locale}; path=/; max-age=31536000; SameSite=Lax`
  }, [locale, dir])

  useEffect(() => {
    const shouldSkip = (node: Node) => {
      const parent = node.parentElement
      return !parent || ignoredTags.has(parent.tagName) || Boolean(parent.closest('[data-no-translate="true"]'))
    }

    const applyNode = (node: Node) => {
      if (shouldSkip(node)) return

      if (node.nodeType === Node.TEXT_NODE) {
        const textNode = node as Text
        const current = textNode.nodeValue ?? ''
        const storedSource = originalText.get(textNode)
        if (storedSource && !arabicTextPattern.test(current)) {
          const expectedTranslation = translateDomText(storedSource)
          if (current !== expectedTranslation) {
            originalText.delete(textNode)
            return
          }
        }
        if (!storedSource && !arabicTextPattern.test(current)) return
        // React can re-render new Arabic copy into a text node we already recorded - a
        // "loading" line becoming an empty-state line, or a button label changing. The
        // remembered source is stale then, and restoring it would silently undo the
        // update, so the fresh Arabic text becomes the new source instead.
        const isRerenderedArabic = Boolean(storedSource) && current !== storedSource && arabicTextPattern.test(current)
        const source = storedSource && !isRerenderedArabic ? storedSource : current
        if (!storedSource || isRerenderedArabic) originalText.set(textNode, source)
        const nextValue = latinDigits(locale === 'en' ? translateDomText(source) : source)
        if (textNode.nodeValue !== nextValue) textNode.nodeValue = nextValue
        return
      }

      if (node.nodeType !== Node.ELEMENT_NODE) return
      const element = node as Element
      // A textarea's value must remain untouched, but its placeholder and
      // accessibility attributes still need to follow the selected language.
      if (ignoredTags.has(element.tagName) && element.tagName !== 'TEXTAREA') return

      translatedAttributes.forEach(attr => {
        if (!element.hasAttribute(attr)) return
        const current = element.getAttribute(attr) ?? ''
        const original = originalAttributes.get(element) ?? {}
        const storedSource = original[attr]
        if (storedSource && !arabicTextPattern.test(current)) {
          const expectedTranslation = translateDomText(storedSource)
          if (current !== expectedTranslation) {
            delete original[attr]
            originalAttributes.set(element, original)
            return
          }
        }
        if (!storedSource && !arabicTextPattern.test(current)) return
        const source = storedSource ?? current
        if (!storedSource) {
          original[attr] = source
          originalAttributes.set(element, original)
        }
        const nextValue = latinDigits(locale === 'en' ? translateDomText(source) : source)
        if (current !== nextValue) element.setAttribute(attr, nextValue)
      })

      element.childNodes.forEach(applyNode)
    }

    const applyPageTranslations = () => applyNode(document.body)
    applyPageTranslations()

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(applyNode)
        if (mutation.type === 'characterData') applyNode(mutation.target)
        if (mutation.type === 'attributes') applyNode(mutation.target)
      })
    })

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: [...translatedAttributes],
      characterData: true,
      childList: true,
      subtree: true,
    })

    return () => observer.disconnect()
  }, [locale])

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
