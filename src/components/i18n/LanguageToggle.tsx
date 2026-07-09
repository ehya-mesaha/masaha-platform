'use client'

import { useLanguage } from './LanguageProvider'
import { localeLabels } from '@/lib/i18n'

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
      className={`language-toggle ${compact ? 'language-toggle-compact' : ''} ${className}`}
    >
      {!compact && <span className="language-toggle-label">{localeLabels[locale]}</span>}
      <span className="language-toggle-track">
        <span className={`language-toggle-thumb ${isEnglish ? 'translate-x-6' : ''}`}>
          {isEnglish ? 'EN' : 'AR'}
        </span>
      </span>
    </button>
  )
}
