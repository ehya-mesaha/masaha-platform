'use client'

import { useState, useEffect } from 'react'
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

export default function NewSpacePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<SpaceFormData>(getInitialForm)
  const [types, setTypes] = useState<SpaceType[]>([])
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [serviceCatalog, setServiceCatalog] = useState<ServiceCatalogItem[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
    if (step === 1 && !form.name.trim()) {
      setError('يرجى إدخال اسم المساحة')
      return
    }
    if (step === 1 && !form.typeId) {
      setError('يرجى اختيار تصنيف المساحة')
      return
    }
    if (step === 1 && (!form.name || !form.typeId)) {
      setError('يرجى إدخال اسم المساحة والتصنيف')
      return
    }
    if (step === 2 && !form.city) {
      setError('يرجى اختيار المدينة')
      return
    }
    if (step === 7 && !form.price) {
      setError('يرجى إدخال السعر')
      return
    }
    setError('')
    setStep(s => Math.min(s + 1, 9))
  }

  function prev() {
    setError('')
    setStep(s => Math.max(s - 1, 1))
  }

  async function handleSubmit() {
    setError('')
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
    <div className="p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-extrabold text-[#14201A]">إضافة مساحة جديدة</h1>
          <p className="text-[#6B7566] text-sm mt-1">أدخل معلومات مساحتك في 9 خطوات</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <StepIndicator current={step} onStepClick={setStep} />
            </div>
          </div>

          <div>
            {/* Mobile step indicator */}
            <div className="lg:hidden flex items-center gap-2 mb-4 overflow-x-auto pb-2">
              {Array.from({ length: 9 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => i + 1 < step && setStep(i + 1)}
                  className={`w-8 h-8 rounded-full flex-shrink-0 text-xs font-bold transition-colors ${
                    step === i + 1
                      ? 'bg-[#1B3A2D] text-white'
                      : step > i + 1
                      ? 'bg-[#1B3A2D]/10 text-[#1B3A2D]'
                      : 'bg-[#F7F3EB] text-[#6B7566]'
                  }`}
                >
                  {step > i + 1 ? '✓' : i + 1}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-[#ECE6D8] p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

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
