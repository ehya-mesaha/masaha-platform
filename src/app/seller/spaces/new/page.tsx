'use client'

import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SpaceFormData, SpaceType, Amenity, ServiceCatalogItem, getInitialForm } from '@/components/spaces/create/types'
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
import { getStepError, STEP_LABELS } from '@/components/spaces/create/validation'

export default function NewSpacePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [furthestStep, setFurthestStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(() => new Set())
  const [form, setForm] = useState<SpaceFormData>(getInitialForm)
  const [types, setTypes] = useState<SpaceType[]>([])
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [serviceCatalog, setServiceCatalog] = useState<ServiceCatalogItem[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const errorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/admin/categories')
      .then(r => {
        if (!r.ok) throw new Error('categories')
        return r.json()
      })
      .then(data => {
        setTypes(data.types || [])
        setAmenities(data.amenities || [])
        const catalog: ServiceCatalogItem[] = data.ownerServices || []
        setServiceCatalog(catalog)
        setForm(current => current.services.length ? current : {
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
          })),
        })
        setCategoriesError('')
      })
      .catch(() => setCategoriesError('تعذر تحميل التصنيفات. حدّث الصفحة أو تواصل مع مدير النظام.'))
      .finally(() => setCategoriesLoading(false))
  }, [])

  function update(field: string, value: unknown) {
    setForm(p => ({ ...p, [field]: value }))
    setCompletedSteps(current => {
      const nextCompleted = new Set(current)
      nextCompleted.delete(step)
      return nextCompleted
    })
    setFurthestStep(current => Math.min(current, step))
  }

  function next() {
    if (step === 1 && categoriesLoading) {
      setError('انتظر حتى يتم تحميل التصنيفات')
      return
    }
    if (step === 1 && categoriesError) {
      setError(categoriesError)
      return
    }
    const stepError = getStepError(step, form)
    if (stepError) {
      setError(stepError)
      window.requestAnimationFrame(() => errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
      return
    }
    setError('')
    setCompletedSteps(current => new Set(current).add(step))
    const nextStep = Math.min(step + 1, 9)
    setFurthestStep(current => Math.max(current, nextStep))
    setStep(nextStep)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function prev() {
    setError('')
    setStep(s => Math.max(s - 1, 1))
  }

  async function handleSubmit() {
    setError('')
    const validationError = getStepError(9, form)
    if (validationError) {
      setError(validationError)
      window.requestAnimationFrame(() => errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/spaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'حدث خطأ')
        return
      }
      router.push('/seller/spaces')
    } catch {
      setError('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  const stepProps = { form, update, types, amenities, serviceCatalog, categoriesLoading, categoriesError }
  const progress = Math.round(((step - 1) / 8) * 100)

  const StepComponent = [
    StepBasicInfo,
    StepLocation,
    StepPhotos,
    StepAmenities,
    StepServices,
    StepSchedule,
    StepPricing,
    StepTerms,
    StepReview,
  ][step - 1]

  return (
    <div className="dashboard-page space-wizard-page">
      <div className="mx-auto max-w-6xl">
        <div className="page-hero mb-6 overflow-hidden p-6 sm:p-8">
          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-extrabold text-[#E4C878]">إضافة احترافية · 9 خطوات إلزامية</p>
              <h1 className="font-display text-2xl font-extrabold text-white sm:text-3xl">إضافة مساحة جديدة</h1>
              <p className="mt-2 text-sm text-white/65">أكمل كل خطوة لضمان نشر بيانات واضحة وجاهزة للحجز المباشر.</p>
            </div>
            <div className="min-w-48">
              <div className="mb-2 flex justify-between text-[11px] font-bold text-white/70">
                <span>الخطوة {step} من 9</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
                <span className="block h-full rounded-full bg-[#E4C878] transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <StepIndicator current={step} completed={completedSteps} furthestStep={furthestStep} onStepClick={setStep} />
            </div>
          </div>

          <div>
            {/* Mobile step indicator */}
            <div className="lg:hidden flex items-center gap-2 mb-4 overflow-x-auto pb-2">
              {Array.from({ length: 9 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => i + 1 <= furthestStep && setStep(i + 1)}
                  disabled={i + 1 > furthestStep}
                  className={`w-8 h-8 rounded-full flex-shrink-0 text-xs font-bold transition-colors ${
                    step === i + 1
                      ? 'bg-[#1B3A2D] text-white'
                    : completedSteps.has(i + 1)
                      ? 'bg-[#1B3A2D]/10 text-[#1B3A2D]'
                      : 'bg-[#F7F3EB] text-[#6B7566]'
                  }`}
                >
                  {completedSteps.has(i + 1) ? '✓' : i + 1}
                </button>
              ))}
            </div>

            <div className="space-wizard-card bg-white rounded-2xl border border-[#ECE6D8] p-5 sm:p-7">
              {error && (
                <div ref={errorRef} role="alert" aria-live="assertive" className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-red-100 font-bold">!</span>
                  {error}
                </div>
              )}

              <div className="mb-6 flex items-center justify-between border-b border-[#EEE8DC] pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#A27B25]">الخطوة {step}</span>
                  <p className="mt-1 text-sm font-extrabold text-[#14201A]">{STEP_LABELS[step - 1]}</p>
                </div>
                <span className="rounded-full bg-[#F7F3EB] px-3 py-1.5 text-[10px] font-bold text-[#6B7566]">جميع الحقول الأساسية مطلوبة</span>
              </div>

              <StepComponent {...stepProps} />

              <div className="flex justify-between mt-8 pt-6 border-t border-[#ECE6D8]">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prev}
                    className="px-6 py-2.5 rounded-xl text-sm font-medium border border-[#E8E3D8] text-[#4A554D] hover:bg-[#F7F3EB] transition-colors"
                  >
                    السابق
                  </button>
                ) : <span />}

                {step < 9 ? (
                  <button
                    type="button"
                    onClick={next}
                    className="px-8 py-2.5 rounded-xl text-sm font-semibold bg-[#1B3A2D] text-white hover:bg-[#0F2219] transition-colors"
                  >
                    التالي
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-8 py-2.5 rounded-xl text-sm font-semibold bg-[#C49A3C] text-white hover:bg-[#A3802F] disabled:opacity-60 transition-colors flex items-center gap-2"
                  >
                    {loading && (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    )}
                    {loading ? 'جاري الحفظ...' : 'نشر المساحة'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
