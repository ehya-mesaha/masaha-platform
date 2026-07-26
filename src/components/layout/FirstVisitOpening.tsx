'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/components/i18n/LanguageProvider'

const OPENING_KEY = 'masaha_opening_v3'

type Phase = 'playing' | 'leaving' | 'done'

export default function FirstVisitOpening() {
  const { locale } = useLanguage()
  const [phase, setPhase] = useState<Phase>('playing')
  const finishing = useRef(false)
  const exitTimer = useRef<number | null>(null)
  const finishTimer = useRef<number | null>(null)

  const finish = useCallback(() => {
    if (finishing.current) return
    finishing.current = true
    setPhase('leaving')
    try {
      window.localStorage.setItem(OPENING_KEY, 'seen')
    } catch {
      // The opening still closes when storage is unavailable.
    }

    exitTimer.current = window.setTimeout(() => {
      document.documentElement.dataset.masahaOpening = 'seen'
      document.body.classList.remove('masaha-opening-active')
      setPhase('done')
    }, 760)
  }, [])

  useEffect(() => {
    if (document.documentElement.dataset.masahaOpening === 'seen') {
      return
    }

    document.documentElement.dataset.masahaOpening = 'new'
    document.body.classList.add('masaha-opening-active')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    finishTimer.current = window.setTimeout(finish, reducedMotion ? 700 : 3600)

    return () => {
      if (finishTimer.current) window.clearTimeout(finishTimer.current)
      if (exitTimer.current) window.clearTimeout(exitTimer.current)
      document.body.classList.remove('masaha-opening-active')
    }
  }, [finish])

  if (phase === 'done') return null

  const isEnglish = locale === 'en'

  return (
    <div
      className={`first-visit-opening ${phase === 'leaving' ? 'is-leaving' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={isEnglish ? 'Welcome to Ehya Masaha' : 'مرحباً بك في إحياء مساحة'}
      data-no-translate="true"
      data-testid="masaha-opening"
    >
      <div className="opening-curtain opening-curtain-start" aria-hidden="true" />
      <div className="opening-curtain opening-curtain-end" aria-hidden="true" />
      <div className="opening-photo" aria-hidden="true" />
      <div className="opening-shade" aria-hidden="true" />
      <div className="opening-grid" aria-hidden="true" />
      <div className="opening-coordinates" aria-hidden="true">
        <span>26.2172° N</span>
        <span>50.1971° E</span>
      </div>

      <button type="button" onClick={finish} className="opening-skip">
        {isEnglish ? 'Skip intro' : 'تخطي المقدمة'}
        <svg className="h-4 w-4 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
        </svg>
      </button>

      <div className="opening-stage">
        <div className="opening-index" aria-hidden="true">
          <span>01</span><i /><span>03</span>
        </div>
        <div className="opening-room" aria-hidden="true">
          <span className="opening-line opening-line-top" />
          <span className="opening-line opening-line-side" />
          <span className="opening-line opening-line-floor" />
          <span className="opening-line opening-line-end" />
          <span className="opening-door">
            <span className="opening-door-light" />
          </span>
        </div>

        <div className="opening-copy">
          <p className="opening-kicker">
            {isEnglish ? 'Every idea needs its space' : 'كل فكرة تحتاج مساحتها'}
          </p>

          <div className="opening-brand">
            <span className="opening-mark" aria-hidden="true">
              <svg viewBox="0 0 48 48" fill="none">
                <path className="opening-mark-roof" d="M8 23.5 24 9l16 14.5" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                <path className="opening-mark-home" d="M12 21v17h24V21M20 38V27h8v11" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span>
              <strong>{isEnglish ? 'EHYA MASAHA' : 'إحياء مساحة'}</strong>
              <small>{isEnglish ? 'SPACE FOR WHAT COMES NEXT' : 'مساحة لما هو قادم'}</small>
            </span>
          </div>

          <p className="opening-message">
            {isEnglish
              ? 'A place for work, connection, and the next great thing.'
              : 'مكان للعمل، للتواصل، وللفكرة القادمة.'}
          </p>
        </div>
      </div>

      <div className="opening-progress" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}
