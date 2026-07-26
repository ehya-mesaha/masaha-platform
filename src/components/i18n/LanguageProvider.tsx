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
  const [locale, setLocaleState] = useState<Locale>(() => getInitialLocale(initialLocale))

  const dir = getDirection(locale)

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
        const source = storedSource ?? current
        if (!storedSource) originalText.set(textNode, source)
        const nextValue = latinDigits(locale === 'en' ? translateDomText(source) : source)
        if (textNode.nodeValue !== nextValue) textNode.nodeValue = nextValue
        return
      }

      if (node.nodeType !== Node.ELEMENT_NODE) return
      const element = node as Element
      if (ignoredTags.has(element.tagName)) return

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
