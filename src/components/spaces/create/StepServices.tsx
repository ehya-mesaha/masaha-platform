'use client'

import { StepProps, ServiceItem } from './types'

const TEMPLATES: ServiceItem[] = [
  { name: 'ضيافة مميزة (قهوة مختصة وحلى)', description: 'تقديم ضيافة فاخرة للحضور طوال فترة الحجز', price: '50', pricingType: 'PER_PERSON' },
  { name: 'دعم تقني مخصص', description: 'فني متواجد لضمان عمل الأجهزة والعروض بسلاسة', price: '150', pricingType: 'PER_BOOKING' },
]

export default function StepServices({ form, update }: StepProps) {
  const services = form.services

  function addService(template?: ServiceItem) {
    const newService = template || { name: '', description: '', price: '', pricingType: 'PER_BOOKING' }
    update('services', [...services, newService])
  }

  function removeService(index: number) {
    update('services', services.filter((_, i) => i !== index))
  }

  function updateService(index: number, field: string, value: string) {
    const updated = services.map((s, i) => i === index ? { ...s, [field]: value } : s)
    update('services', updated)
  }

  const usedTemplates = services.map(s => s.name)

  return (
    <div>
      <h2 className="font-display text-xl font-extrabold text-[#14201A] mb-1">الخدمات الإضافية</h2>
      <p className="text-[#6B7566] text-sm mb-6">قدم خدمات إضافية بمقابل مادي لزيادة إيراداتك وتوفير تجربة متكاملة للعملاء.</p>

      {/* Templates */}
      {TEMPLATES.filter(t => !usedTemplates.includes(t.name)).length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-bold text-[#6B7566] mb-2">خدمات مقترحة</p>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.filter(t => !usedTemplates.includes(t.name)).map(t => (
              <button
                key={t.name}
                type="button"
                onClick={() => addService(t)}
                className="px-4 py-2 rounded-lg text-xs font-medium border border-dashed border-[#C49A3C]/50 text-[#C49A3C] hover:bg-[#C49A3C]/5 transition-colors"
              >
                + {t.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Services list */}
      <div className="space-y-4">
        {services.map((service, i) => (
          <div key={i} className="p-4 rounded-xl border border-[#ECE6D8] bg-white">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-bold text-[#6B7566]">خدمة {i + 1}</span>
              <button
                type="button"
                onClick={() => removeService(i)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#6B7566] mb-1">اسم الخدمة</label>
                <input
                  value={service.name}
                  onChange={e => updateService(i, 'name', e.target.value)}
                  placeholder="مثال: تصوير فوتوغرافي"
                  className="w-full px-3 py-2 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#6B7566] mb-1">السعر (ريال)</label>
                  <input
                    type="number"
                    value={service.price}
                    onChange={e => updateService(i, 'price', e.target.value)}
                    placeholder="50"
                    min={0}
                    className="w-full px-3 py-2 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6B7566] mb-1">نوع التسعير</label>
                  <select
                    value={service.pricingType}
                    onChange={e => updateService(i, 'pricingType', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D] bg-white"
                  >
                    <option value="PER_PERSON">للشخص</option>
                    <option value="PER_BOOKING">للحجز</option>
                  </select>
                </div>
              </div>
            </div>

            {service.description && (
              <p className="mt-2 text-xs text-[#6B7566]">{service.description}</p>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => addService()}
        className="mt-4 flex items-center gap-2 text-sm font-medium text-[#1B3A2D] hover:text-[#C49A3C] transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        إضافة خدمة جديدة
      </button>
    </div>
  )
}
