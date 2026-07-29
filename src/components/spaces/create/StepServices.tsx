'use client'

import { useMemo, useState } from 'react'
import { PrintMatrixConfig, ServiceItem, StepProps } from './types'

const MATRIX_FIELDS: Array<[keyof PrintMatrixConfig, string]> = [
  ['bwSingle', 'أبيض وأسود - وجه واحد'],
  ['bwDouble', 'أبيض وأسود - وجهين'],
  ['colorSingle', 'ملون - وجه واحد'],
  ['colorDouble', 'ملون - وجهين'],
]

const TABS = [
  ['الكل', 'all'],
  ['الضيافة', 'ضيافة'],
  ['مطبوعات', 'مطبوعات'],
  ['تنظيم', 'تنظيم'],
  ['تنظيف', 'تنظيف'],
] as const

const APPROVED_SERVICE_NAMES = new Set([
  'المطبوعات',
  'منظم',
  'تنظيف بعد الاستخدام',
  'مياه',
  'قهوة عربية',
  'شاي',
  'ضيافة خفيفة',
])

function normalizeName(value: string) {
  return value.normalize('NFD').replace(/[\u064B-\u065F\u0670]/g, '')
}

export default function StepServices({ form, update, serviceCatalog = [] }: StepProps) {
  const [activeTab, setActiveTab] = useState('all')
  const services = useMemo(
    () => form.services.filter(service => APPROVED_SERVICE_NAMES.has(normalizeName(service.name))),
    [form.services],
  )
  const visibleServices = useMemo(
    () => activeTab === 'all' ? services : services.filter(service => service.category === activeTab),
    [activeTab, services],
  )
  const enabledCount = services.filter(service => service.isEnabled).length
  const allEnabled = services.length > 0 && enabledCount === services.length

  function change(catalogId: string, values: Partial<ServiceItem>) {
    update('services', services.map(service => service.catalogId === catalogId ? { ...service, ...values } : service))
  }

  function toggleAll() {
    const visibleIds = new Set(services.map(service => service.catalogId))
    update('services', form.services.map(service => (
      visibleIds.has(service.catalogId) ? { ...service, isEnabled: !allEnabled } : service
    )))
  }

  return (
    <div>
      <h2 className="font-display mb-1 text-xl font-extrabold text-[#1B1B1B]">إضافة خدمات المساحة</h2>
      <p className="mb-6 text-sm text-[#5F6764]">الخدمات اختيارية بالكامل. فعّل فقط ما تقدمه لمساحتك وحدد سعره؛ ولا يمكن إضافة خدمات خارج القائمة المعتمدة.</p>

      <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-[#D8D1C7] bg-[#F5F1E8] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <strong className="text-sm text-[#0E3B34]">الخدمات المعتمدة من الإدارة</strong>
          <p className="mt-1 text-xs text-[#5F6764]">{enabledCount} من {services.length} خدمات مفعلة لمساحتك.</p>
        </div>
        <Toggle checked={allEnabled} onChange={toggleAll} label="تفعيل جميع الخدمات" />
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {TABS.map(([label, value]) => (
          <button
            type="button"
            key={value}
            onClick={() => setActiveTab(value)}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold transition ${activeTab === value ? 'border-[#0E3B34] bg-[#0E3B34] text-white' : 'border-[#D8D1C7] bg-white text-[#58635B]'}`}
          >{label}</button>
        ))}
      </div>

      {serviceCatalog.length === 0 || services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D8D1C7] p-8 text-center text-sm text-[#5F6764]">
          لم تُضف الإدارة خدمات إلى الدليل بعد.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {visibleServices.map(service => (
            <article key={service.catalogId} className={`service-option-card rounded-2xl border p-4 transition ${service.isEnabled ? 'is-enabled border-[#0E3B34]/30 bg-[#FBFDFB]' : 'border-[#D8D1C7] bg-white'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-extrabold text-[#0E3B34]">{service.name}</p>
                  <p className="mt-1 text-xs leading-6 text-[#5F6764]">{service.description}</p>
                </div>
                <Toggle checked={service.isEnabled} onChange={() => change(service.catalogId, { isEnabled: !service.isEnabled })} label={`تفعيل ${service.name}`} />
              </div>

              {service.isEnabled && (
                <div className="mt-4 space-y-3 border-t border-[#D8D1C7] pt-4">
                  {service.pricingType === 'PRINT_MATRIX' ? (
                    <div>
                      <span className="mb-1.5 block text-[11px] font-bold text-[#5F6764]">أسعار الطباعة (ريال لكل 10 صفحات) · حدّد سعرك الخاص لكل نوع</span>
                      <div className="grid grid-cols-2 gap-2">
                        {MATRIX_FIELDS.map(([key, label]) => (
                          <label key={key} className="block">
                            <span className="mb-1 block text-[10px] text-[#5F6764]">{label}</span>
                            <input
                              type="number"
                              min="0"
                              value={service.config?.[key] ?? ''}
                              onChange={event => change(service.catalogId, { config: { ...service.config, [key]: Number(event.target.value) || 0 } })}
                              className="field py-2 text-sm"
                              dir="ltr"
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-bold text-[#5F6764]">السعر (ريال) · {pricingLabel(service.pricingType)}</span>
                      <input
                        type="number"
                        min="0"
                        value={service.price}
                        onChange={event => change(service.catalogId, { price: event.target.value })}
                        className="field py-2 text-sm"
                        dir="ltr"
                      />
                    </label>
                  )}
                  {(service.name === 'المطبوعات' || service.name === 'ضيافة خفيفة') && (
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-bold text-[#5F6764]">{service.name === 'المطبوعات' ? 'رقم التواصل وتفاصيل أسعار الطباعة' : 'تفاصيل الخدمة'}</span>
                      <textarea
                        rows={2}
                        value={service.details}
                        onChange={event => change(service.catalogId, { details: event.target.value })}
                        placeholder={service.name === 'المطبوعات' ? 'رقم واتساب وتفاصيل أسعار الطباعة' : 'مثال: ميني ساندويتش، معجنات، عصائر، فواكه…'}
                        className="field resize-none text-sm"
                      />
                    </label>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

function pricingLabel(type: string) {
  const labels: Record<string, string> = {
    PER_BOOKING: 'لكل حجز',
    PER_PERSON: 'لكل فرد',
    PER_HOUR: 'بالساعة',
    PER_ITEM: 'للقطعة',
    PER_TEN_PAGES: 'لكل 10 صفحات',
    PRINT_MATRIX: 'مصفوفة طباعة',
  }
  return labels[type] || 'حسب الخدمة'
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-label={label}
      aria-pressed={checked}
      className={`relative h-6 w-11 flex-none rounded-full transition ${checked ? 'bg-[#0E3B34]' : 'bg-[#CDD2CE]'}`}
    >
      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${checked ? 'start-6' : 'start-1'}`} />
    </button>
  )
}
