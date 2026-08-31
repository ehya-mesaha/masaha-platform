'use client'

import { useMemo, useState } from 'react'
import { PrintMatrixConfig, ServiceItem, StepProps } from './types'
import { getServiceCategoryMeta } from '@/lib/serviceCategoryIcons'

const MATRIX_FIELDS: Array<[keyof PrintMatrixConfig, string]> = [
  ['bwSingle', 'أبيض وأسود - وجه واحد'],
  ['bwDouble', 'أبيض وأسود - وجهين'],
  ['colorSingle', 'ملون - وجه واحد'],
  ['colorDouble', 'ملون - وجهين'],
]

export default function StepServices({ form, update, serviceCatalog = [] }: StepProps) {
  const [activeTab, setActiveTab] = useState('all')
  const services = form.services

  const tabs = useMemo(() => {
    const seen = new Set<string>()
    const list: string[] = []
    for (const service of services) {
      if (!seen.has(service.category)) {
        seen.add(service.category)
        list.push(service.category)
      }
    }
    return ['all', ...list]
  }, [services])

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
      <p className="mb-6 text-sm text-[#5F6764]">الخدمات اختيارية بالكامل. فعّل فقط ما تقدمه لمساحتك وحدد سعره؛ الدليل يُحدَّث تلقائيًا كلما أضافت الإدارة خدمة جديدة.</p>

      <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-[#D8D1C7] bg-gradient-to-l from-[#F5F1E8] to-[#FBF8F0] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-[#0E3B34] text-white shadow-sm">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </span>
          <div>
            <strong className="text-sm text-[#0E3B34]">الخدمات المعتمدة من الإدارة</strong>
            <p className="mt-0.5 text-xs text-[#5F6764]">{enabledCount} من {services.length} خدمات مفعلة لمساحتك.</p>
          </div>
        </div>
        <ToggleRow checked={allEnabled} onChange={toggleAll} label="تفعيل جميع الخدمات" />
      </div>

      {tabs.length > 2 && (
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {tabs.map((value) => {
            const meta = value === 'all' ? { label: 'الكل', icon: null } : getServiceCategoryMeta(value)
            return (
              <button
                type="button"
                key={value}
                onClick={() => setActiveTab(value)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold transition-colors ${activeTab === value ? 'border-[#0E3B34] bg-[#0E3B34] text-white' : 'border-[#D8D1C7] bg-white text-[#58635B] hover:border-[#B99A63]'}`}
              >
                {meta.icon && (
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">{meta.icon}</svg>
                )}
                {meta.label}
              </button>
            )
          })}
        </div>
      )}

      {serviceCatalog.length === 0 || services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D8D1C7] p-8 text-center text-sm text-[#5F6764]">
          لم تُضف الإدارة خدمات إلى الدليل بعد.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {visibleServices.map(service => {
            const meta = getServiceCategoryMeta(service.category)
            return (
              <article
                key={service.catalogId}
                className={`service-option-card relative overflow-hidden rounded-2xl border p-4 transition-all ${service.isEnabled ? 'is-enabled border-[#0E3B34] bg-[#F7FBF9] shadow-[0_10px_30px_-22px_rgba(14,59,52,0.5)]' : 'border-[#D8D1C7] bg-white hover:border-[#B99A63]/50'}`}
              >
                {service.isEnabled && <span className="absolute inset-y-0 start-0 w-1 bg-[#0E3B34]" />}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className={`grid h-10 w-10 flex-none place-items-center rounded-xl ${service.isEnabled ? 'bg-[#0E3B34] text-white' : 'bg-[#F5F1E8] text-[#8B9389]'}`}>
                      <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">{meta.icon}</svg>
                    </span>
                    <div>
                      <p className="font-extrabold text-[#1B1B1B]">{service.name}</p>
                      <p className="mt-1 text-xs leading-6 text-[#5F6764]">{service.description}</p>
                      {service.pricingType !== 'PRINT_MATRIX' && (
                        <span className="mt-1.5 inline-block rounded-full bg-[#F5F1E8] px-2.5 py-1 text-[10px] font-bold text-[#0E3B34]">{pricingLabel(service.pricingType)}</span>
                      )}
                    </div>
                  </div>
                  <Toggle checked={service.isEnabled} onChange={() => change(service.catalogId, { isEnabled: !service.isEnabled })} label={`تفعيل ${service.name}`} />
                </div>

                {service.isEnabled && (
                  <div className="mt-4 space-y-3 border-t border-[#0E3B34]/10 pt-4">
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
                      <label className="block max-w-[200px]">
                        <span className="mb-1 block text-[11px] font-bold text-[#5F6764]">السعر (ريال)</span>
                        {/* Number leads, ر.س trails on the right — same addon layout as the
                            hourly-price field in StepPricing, which sidesteps any overlap. */}
                        <span className="flex overflow-hidden rounded-xl border border-[#D8D1C7] bg-white transition focus-within:border-[#0E3B34] focus-within:ring-4 focus-within:ring-[#0E3B34]/5" dir="ltr">
                          <input
                            type="number"
                            min="0"
                            value={service.price}
                            onChange={event => change(service.catalogId, { price: event.target.value })}
                            className="min-w-0 flex-1 px-3 py-2 text-sm font-bold outline-none"
                            dir="ltr"
                          />
                          <span className="flex items-center border-l border-[#D8D1C7] bg-[#F5F1E8] px-3 text-xs font-bold text-[#0E3B34]">ر.س</span>
                        </span>
                      </label>
                    )}
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-bold text-[#5F6764]">{service.name === 'المطبوعات' ? 'رقم التواصل وتفاصيل أسعار الطباعة' : 'تفاصيل إضافية (اختياري)'}</span>
                      <textarea
                        rows={2}
                        value={service.details}
                        onChange={event => change(service.catalogId, { details: event.target.value })}
                        placeholder={service.name === 'المطبوعات' ? 'رقم واتساب وتفاصيل أسعار الطباعة' : 'أضف أي تفاصيل تساعد المستأجر على فهم الخدمة…'}
                        className="field resize-none text-sm"
                      />
                    </label>
                  </div>
                )}
              </article>
            )
          })}
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
      className={`relative h-6 w-11 flex-none rounded-full transition-colors ${checked ? 'bg-[#0E3B34]' : 'bg-[#CDD2CE]'}`}
    >
      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${checked ? 'start-6' : 'start-1'}`} />
    </button>
  )
}

function ToggleRow({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      className={`flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-xs font-bold transition-colors ${checked ? 'border-[#0E3B34] bg-[#0E3B34] text-white' : 'border-[#D8D1C7] bg-white text-[#3F4B47] hover:border-[#B99A63]'}`}
    >
      <span className={`relative h-5 w-9 flex-none rounded-full transition-colors ${checked ? 'bg-white/25' : 'bg-[#CDD2CE]'}`}>
        <span className={`absolute top-1 h-3 w-3 rounded-full shadow-sm transition-all ${checked ? 'start-5 bg-white' : 'start-1 bg-white'}`} />
      </span>
      {label}
    </button>
  )
}
