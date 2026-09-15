'use client'

import { StepProps } from './types'
import type { Amenity } from './types'

/**
 * This step used to render only amenities whose `category` was literally `'tech'` or
 * `'comfort'`, plus ones with no category at all. Every other category — the Arabic ones
 * from the original catalog seed ('تقنية', 'الموقع', 'الراحة', 'الوصول') and anything an
 * admin has since typed into the free-text category field on /admin/categories — never
 * rendered a button at all. That made those amenities permanently unselectable, and far
 * worse: editing and saving a space that already had one silently dropped it, because the
 * save payload only ever contains the amenity ids the form could show a button for.
 *
 * Every amenity the catalog returns is now shown, grouped by its actual category so the
 * layout stays organized instead of one long list — known category spellings that mean the
 * same thing (the English slugs and the original Arabic labels) are merged under one
 * heading, and anything else becomes its own group under its own label rather than vanishing.
 */
const OTHER_LABEL = 'أخرى'
const GROUP_LABELS: Record<string, string> = {
  tech: 'التجهيزات التقنية والعرض',
  'تقنية': 'التجهيزات التقنية والعرض',
  comfort: 'الراحة والخدمات الأساسية',
  'الراحة': 'الراحة والخدمات الأساسية',
  'الموقع': 'الموقع والوصول',
  'الوصول': 'الموقع والوصول',
  // /admin/categories writes this exact literal when an amenity is saved with no category.
  other: OTHER_LABEL,
}
// Groups appear in this order when present; anything unrecognized sorts after these,
// alphabetically, with "أخرى" always last.
const GROUP_ORDER = [
  GROUP_LABELS.tech,
  GROUP_LABELS.comfort,
  GROUP_LABELS['الموقع'],
]

function groupAmenities(amenities: Amenity[]) {
  const groups = new Map<string, Amenity[]>()
  for (const amenity of amenities) {
    const key = amenity.category?.trim()
    const label = key ? (GROUP_LABELS[key] || key) : OTHER_LABEL
    groups.set(label, [...(groups.get(label) || []), amenity])
  }
  return [...groups.entries()]
    .map(([label, items]) => ({ label, items }))
    .sort((a, b) => {
      if (a.label === OTHER_LABEL) return 1
      if (b.label === OTHER_LABEL) return -1
      const ai = GROUP_ORDER.indexOf(a.label)
      const bi = GROUP_ORDER.indexOf(b.label)
      if (ai === -1 && bi === -1) return a.label.localeCompare(b.label, 'ar')
      if (ai === -1) return 1
      if (bi === -1) return -1
      return ai - bi
    })
}

export default function StepAmenities({ form, update, amenities }: StepProps) {
  const groups = groupAmenities(amenities || [])

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
        aria-pressed={selected}
        className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
          selected
            ? 'border-[#0E3B34] bg-[#0E3B34]/5 text-[#0E3B34]'
            : 'border-[#D8D1C7] bg-white text-[#3F4B47] hover:border-[#0E3B34]/40'
        }`}
      >
        {selected && (
          <svg className="w-4 h-4 text-[#0E3B34]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {name}
      </button>
    )
  }

  return (
    <div>
      <h2 className="font-display text-xl font-extrabold text-[#1B1B1B] mb-1">المرافق والتجهيزات المتاحة</h2>
      <p className="text-[#5F6764] text-sm mb-6">حدد جميع المرافق المتوفرة في مساحتك. يجب اختيار مرفق واحد على الأقل قبل المتابعة.</p>

      {groups.map(group => (
        <div key={group.label} className="mb-6 last:mb-0">
          <h3 className="text-sm font-bold text-[#1B1B1B] mb-3">{group.label}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {group.items.map(a => <AmenityButton key={a.id} id={a.id} name={a.name} />)}
          </div>
        </div>
      ))}
    </div>
  )
}
