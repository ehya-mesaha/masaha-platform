'use client'

import { useLanguage } from './LanguageProvider'

type Props = {
  compact?: boolean
  className?: string
}

export default function LanguageToggle({ compact = false, className = '' }: Props) {
  const { locale, toggleLocale, t } = useLanguage()
  const isEnglish = locale === 'en'

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={t('language')}
      title={t('language')}
      data-no-translate="true"
      className={`language-toggle ${compact ? 'language-toggle-compact' : ''} ${className}`}
    >
      {!compact && (
        <svg className="language-toggle-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.25 2.47 3.4 5.47 3.4 9S14.25 18.53 12 21c-2.25-2.47-3.4-5.47-3.4-9S9.75 5.47 12 3Z" />
        </svg>
      )}
      <span className="language-toggle-segments" aria-hidden="true">
        <span className={!isEnglish ? 'is-active' : ''}>AR</span>
        <span className={isEnglish ? 'is-active' : ''}>EN</span>
      </span>
    </button>
  )
}
