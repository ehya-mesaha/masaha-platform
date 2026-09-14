'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  SpaceFormData, SpaceType, City, Amenity, ServiceCatalogItem, getInitialForm,
} from '@/components/spaces/create/types'
import StepIndicator from '@/components/spaces/create/StepIndicator'
import StepBasicInfo from '@/components/spaces/create/StepBasicInfo'
import StepLocation from '@/components/spaces/create/StepLocation'
import StepPhotos from '@/components/spaces/create/StepPhotos'
import StepAmenities from '@/components/spaces/create/StepAmenities'
import StepServices from '@/components/spaces/create/StepServices'
import StepSchedule from '@/components/spaces/create/StepSchedule'
import StepPricing from '@/components/spaces/create/StepPricing'
import StepTerms from '@/components/spaces/create/StepTerms'
import StepReview from '@/components/spaces/create/StepReview'
import { getCompletedSteps, getStepError, STEP_LABELS } from '@/components/spaces/create/validation'
import Spinner from '@/components/ui/Spinner'
import { spaceToFormData, type SpaceApiPayload } from '@/lib/space-form'

const TOTAL_STEPS = 9

const STEPS = [
  StepBasicInfo, StepLocation, StepPhotos, StepAmenities, StepServices,
  StepSchedule, StepPricing, StepTerms, StepReview,
] as const

export type SpaceWizardProps = {
  /** `create` starts blank; `edit` loads the space and unlocks every step up front. */
  mode: 'create' | 'edit'
  /** Required in edit mode — the space whose data is loaded and saved back. */
  spaceId?: string
  /** Extra controls only the platform admin sees, rendered above the step body. */
  adminPanel?: React.ReactNode
  eyebrow: string
  title: string
  subtitle: string
  submitLabel: string
  /** Resolves to an error message to show, or null when the save succeeded. */
  onSubmit: (form: SpaceFormData) => Promise<string | null>
  /** Shown under the header in edit mode — e.g. that saving sends the space back to review. */
  notice?: string
}

/**
 * The nine-step space form, shared by "add a space", "edit my space" and the admin editor.
 *
 * Editing used to run through a cut-down form with a handful of fields, so an owner could
 * not touch their location, schedule, services, pricing tiers or terms at all — and because
 * the save endpoint rebuilds those relations from the payload, every edit silently wiped
 * the ones the small form left out. Sharing the real wizard is what makes "edit everything"
 * true, rather than a longer list of fields that might still miss one.
 */
export default function SpaceWizard({
  mode, spaceId, adminPanel, eyebrow, title, subtitle, submitLabel, onSubmit, notice,
}: SpaceWizardProps) {
  const isEdit = mode === 'edit'
  const [step, setStep] = useState(1)
  const [furthestStep, setFurthestStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(() => new Set())
  const [form, setForm] = useState<SpaceFormData>(getInitialForm)
  const [types, setTypes] = useState<SpaceType[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [serviceCatalog, setServiceCatalog] = useState<ServiceCatalogItem[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState('')
  const [booting, setBooting] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const errorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false

    async function boot() {
      try {
        const catalogResponse = await fetch('/api/catalog')
        if (!catalogResponse.ok) throw new Error('categories')
        const data = await catalogResponse.json()
        if (cancelled) return

        const catalog: ServiceCatalogItem[] = data.ownerServices || []
        setTypes(data.types || [])
        setCities(data.cities || [])
        setAmenities(data.amenities || [])
        setServiceCatalog(catalog)
        setCategoriesError('')

        if (!isEdit || !spaceId) {
          setForm(current => (current.services.length ? current : {
            ...current,
            services: catalog.map(service => ({
              catalogId: service.id,
              name: service.name,
              description: service.description,
              price: service.defaultPrice === null ? '' : String(service.defaultPrice),
              pricingType: service.pricingType,
              category: service.category,
              isEnabled: false,
              details: '',
              config: service.defaultConfig || {},
            })),
          }))
          return
        }

        const spaceResponse = await fetch(`/api/spaces/${spaceId}`)
        const spaceData = await spaceResponse.json()
        if (cancelled) return
        if (!spaceResponse.ok || !spaceData.space) {
          setError(spaceData.error || 'تعذر تحميل بيانات المساحة.')
          return
        }

        const loaded = spaceToFormData(spaceData.space as SpaceApiPayload, catalog)
        setForm(loaded)
        // Everything is already filled in, so the owner can jump straight to the one step
        // they came to change instead of clicking "التالي" eight times.
        setCompletedSteps(getCompletedSteps(loaded))
        setFurthestStep(TOTAL_STEPS)
      } catch {
        if (!cancelled) setCategoriesError('تعذر تحميل البيانات. حدّث الصفحة أو تواصل مع مدير النظام.')
      } finally {
        if (!cancelled) {
          setCategoriesLoading(false)
          setBooting(false)
        }
      }
    }

    void boot()
    return () => { cancelled = true }
  }, [isEdit, spaceId])

  const update = useCallback((field: string, value: unknown) => {
    setForm(previous => ({ ...previous, [field]: value }))
    setError('')
    setCompletedSteps(current => {
      const next = new Set(current)
      next.delete(step)
      return next
    })
    // A new space has to be re-walked from the step that changed; an edit keeps every step
    // reachable, because the rest of the space is already valid and saved.
    if (!isEdit) setFurthestStep(current => Math.min(current, step))
  }, [step, isEdit])

  const showError = useCallback((text: string) => {
    setError(text)
    window.requestAnimationFrame(() => errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
  }, [])

  function goToStep(target: number) {
    setError('')
    setStep(Math.min(Math.max(target, 1), TOTAL_STEPS))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function next() {
    if (step === 1 && categoriesLoading) return setError('انتظر حتى يتم تحميل التصنيفات')
    if (step === 1 && categoriesError) return setError(categoriesError)

    const stepError = getStepError(step, form)
    if (stepError) return showError(stepError)

    setCompletedSteps(current => new Set(current).add(step))
    setFurthestStep(current => Math.max(current, Math.min(step + 1, TOTAL_STEPS)))
    goToStep(step + 1)
  }

  async function handleSubmit() {
    const validationError = getStepError(TOTAL_STEPS, form)
    if (validationError) return showError(validationError)

    setError('')
    setLoading(true)
    try {
      const failure = await onSubmit(form)
      if (failure) showError(failure)
    } catch {
      showError('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  const stepProps = useMemo(
    () => ({ form, update, types, cities, amenities, serviceCatalog, categoriesLoading, categoriesError }),
    [form, update, types, cities, amenities, serviceCatalog, categoriesLoading, categoriesError],
  )

  const progress = isEdit
    ? Math.round((completedSteps.size / (TOTAL_STEPS - 1)) * 100)
    : Math.round(((step - 1) / (TOTAL_STEPS - 1)) * 100)
  const StepComponent = STEPS[step - 1]

  if (booting) {
    return <div className="dashboard-page flex justify-center py-24"><Spinner size="lg" /></div>
  }

  return (
    <div className="dashboard-page space-wizard-page">
      <div className="mx-auto max-w-6xl">
        <div className="page-hero mb-6 overflow-hidden p-6 sm:p-8">
          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-extrabold text-[#B99A63]">{eyebrow}</p>
              <h1 className="font-display text-2xl font-extrabold text-white sm:text-3xl">{title}</h1>
              <p className="mt-2 text-sm text-white/65">{subtitle}</p>
            </div>
            <div className="min-w-48">
              <div className="mb-2 flex justify-between text-[11px] font-bold text-white/70">
                <span>{isEdit ? `مكتمل ${completedSteps.size} من ${TOTAL_STEPS - 1}` : `الخطوة ${step} من ${TOTAL_STEPS}`}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
                <span className="block h-full rounded-full bg-[#B99A63] transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>

        {notice && (
          <p className="mb-6 rounded-2xl border border-[#E3D6B8] bg-[#FBF6EA] px-5 py-4 text-sm leading-7 text-[#6A5419]">
            {notice}
          </p>
        )}

        {adminPanel}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <StepIndicator current={step} completed={completedSteps} furthestStep={furthestStep} onStepClick={goToStep} />
            </div>
          </div>

          <div>
            {/* Mobile step indicator */}
            <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-2 lg:hidden">
              {Array.from({ length: TOTAL_STEPS }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => index + 1 <= furthestStep && goToStep(index + 1)}
                  disabled={index + 1 > furthestStep}
                  className={`h-8 w-8 flex-shrink-0 rounded-full text-xs font-bold transition-colors ${
                    step === index + 1
                      ? 'bg-[#0E3B34] text-white'
                      : completedSteps.has(index + 1)
                        ? 'bg-[#0E3B34]/10 text-[#0E3B34]'
                        : 'bg-[#F5F1E8] text-[#5F6764]'
                  }`}
                >
                  {completedSteps.has(index + 1) ? '✓' : index + 1}
                </button>
              ))}
            </div>

            <div className="space-wizard-card rounded-2xl border border-[#D8D1C7] bg-white p-5 sm:p-7">
              {error && (
                <div ref={errorRef} role="alert" aria-live="assertive" className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-red-100 font-bold">!</span>
                  {error}
                </div>
              )}

              <div className="mb-6 flex items-center justify-between gap-3 border-b border-[#EEE8DC] pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#A27B25]">الخطوة {step}</span>
                  <p className="mt-1 text-sm font-extrabold text-[#1B1B1B]">{STEP_LABELS[step - 1]}</p>
                </div>
                <span className="hidden rounded-full bg-[#F5F1E8] px-3 py-1.5 text-[10px] font-bold text-[#5F6764] sm:inline">
                  {isEdit ? 'انتقل لأي خطوة وعدّل ما تريد' : 'جميع الحقول الأساسية مطلوبة'}
                </span>
              </div>

              <StepComponent {...stepProps} />

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#D8D1C7] pt-6">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => goToStep(step - 1)}
                    className="rounded-xl border border-[#D8D1C7] px-6 py-2.5 text-sm font-medium text-[#3F4B47] transition-colors hover:bg-[#F5F1E8]"
                  >
                    السابق
                  </button>
                ) : <span />}

                <div className="flex flex-wrap items-center gap-3">
                  {/* In edit mode nothing forces a walk to the last step: the owner can
                      change one field on any step and save from where they stand. */}
                  {isEdit && (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="rounded-xl bg-[#B99A63] px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#A3802F] disabled:opacity-60"
                    >
                      {loading ? 'جاري الحفظ...' : submitLabel}
                    </button>
                  )}

                  {step < TOTAL_STEPS ? (
                    <button
                      type="button"
                      onClick={next}
                      className="rounded-xl bg-[#0E3B34] px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#092C27]"
                    >
                      التالي
                    </button>
                  ) : !isEdit ? (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex items-center gap-2 rounded-xl bg-[#B99A63] px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#A3802F] disabled:opacity-60"
                    >
                      {loading && (
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      )}
                      {loading ? 'جاري الحفظ...' : submitLabel}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
