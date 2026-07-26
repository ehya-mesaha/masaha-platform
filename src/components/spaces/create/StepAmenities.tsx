'use client'

import { StepProps } from './types'

export default function StepAmenities({ form, update, amenities }: StepProps) {
  const techAmenities = amenities?.filter(a => a.category === 'tech') || []
  const comfortAmenities = amenities?.filter(a => a.category === 'comfort') || []
  const otherAmenities = amenities?.filter(a => !a.category) || []

  function toggle(id: string) {
    update(
      'amenityIds',
      form.amenityIds.includes(id)
        ? form.amenityIds.filter(a => a !== id)
        : [...form.amenityIds, id],
    )
  }

  function AmenityButton({ id, name }: { id: string; name: string }) {
    const selected = form.amenityIds.includes(id)
    return (
      <button
        type="button"
        onClick={() => toggle(id)}
        className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
          selected
            ? 'border-[#1B3A2D] bg-[#1B3A2D]/5 text-[#1B3A2D]'
            : 'border-[#ECE6D8] bg-white text-[#4A554D] hover:border-[#1B3A2D]/40'
        }`}
      >
        {selected && (
          <svg className="w-4 h-4 text-[#1B3A2D]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {name}
      </button>
    )
  }

  return (
    <div>
      <h2 className="font-display text-xl font-extrabold text-[#14201A] mb-1">المرافق والتجهيزات المتاحة</h2>
      <p className="text-[#6B7566] text-sm mb-6">حدد جميع المرافق المتوفرة في مساحتك. يجب اختيار مرفق واحد على الأقل قبل المتابعة.</p>

      {techAmenities.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-[#14201A] mb-3">التجهيزات التقنية والعرض</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {techAmenities.map(a => <AmenityButton key={a.id} id={a.id} name={a.name} />)}
          </div>
        </div>
      )}

      {comfortAmenities.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-[#14201A] mb-3">الراحة والخدمات الأساسية</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {comfortAmenities.map(a => <AmenityButton key={a.id} id={a.id} name={a.name} />)}
          </div>
        </div>
      )}

      {otherAmenities.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-[#14201A] mb-3">أخرى</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {otherAmenities.map(a => <AmenityButton key={a.id} id={a.id} name={a.name} />)}
          </div>
        </div>
      )}
    </div>
  )
}
