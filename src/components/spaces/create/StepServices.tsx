'use client'

import { useMemo, useState } from 'react'
import { ServiceItem, StepProps } from './types'

const TABS = [
  ['الكل', 'all'],
  ['الضيافة', 'ضيافة'],
  ['مطبوعات', 'مطبوعات'],
  ['تنظيم', 'تنظيم'],
  ['تنظيف', 'تنظيف'],
] as const

export default function StepServices({ form, update, serviceCatalog = [] }: StepProps) {
  const [activeTab, setActiveTab] = useState('all')
  const services = form.services
  const visibleServices = useMemo(
    () => activeTab === 'all' ? services : services.filter(service => service.category === activeTab),
    [activeTab, services],
  )
  const allEnabled = services.length > 0 && services.every(service => service.isEnabled)

  function change(catalogId: string, values: Partial<ServiceItem>) {
    update('services', services.map(service => service.catalogId === catalogId ? { ...service, ...values } : service))
  }

  function toggleAll() {
    update('services', services.map(service => ({ ...service, isEnabled: !allEnabled })))
  }

  return (
    <div>
      <h2 className="font-display mb-1 text-xl font-extrabold text-[#14201A]">إضافة خدمات المساحة</h2>
      <p className="mb-6 text-sm text-[#6B7566]">اختر الخدمات التي تقدمها وحدد الأسعار والتفاصيل. القائمة محددة وتُدار من إدارة إحياء مساحة.</p>

      <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-[#E8E1D3] bg-[#F7F3EB] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <strong className="text-sm text-[#1B3A2D]">تفعيل جميع الخدمات</strong>
          <p className="mt-1 text-xs text-[#6B7566]">يمكنك إيقاف أي خدمة على حدة وتعديل سعرها.</p>
        </div>
        <Toggle checked={allEnabled} onChange={toggleAll} label="تفعيل جميع الخدمات" />
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {TABS.map(([label, value]) => (
          <button
            type="button"
            key={value}
            onClick={() => setActiveTab(value)}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold transition ${activeTab === value ? 'border-[#1B3A2D] bg-[#1B3A2D] text-white' : 'border-[#DDD5C5] bg-white text-[#58635B]'}`}
          >{label}</button>
        ))}
      </div>

      {serviceCatalog.length === 0 && services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D8CFBE] p-8 text-center text-sm text-[#6B7566]">
          لم تُضف الإدارة خدمات إلى الدليل بعد.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {visibleServices.map(service => (
            <article key={service.catalogId} className={`rounded-2xl border p-4 transition ${service.isEnabled ? 'border-[#1B3A2D]/30 bg-[#FBFDFB]' : 'border-[#E8E1D3] bg-white'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-extrabold text-[#1B3A2D]">{service.name}</p>
                  <p className="mt-1 text-xs leading-6 text-[#6B7566]">{service.description}</p>
                </div>
                <Toggle checked={service.isEnabled} onChange={() => change(service.catalogId, { isEnabled: !service.isEnabled })} label={`تفعيل ${service.name}`} />
              </div>

              {service.isEnabled && (
                <div className="mt-4 space-y-3 border-t border-[#E8E1D3] pt-4">
                  <label className="block">
                    <span className="mb-1 block text-[11px] font-bold text-[#6B7566]">السعر (ريال)</span>
                    <input
                      type="number"
                      min="0"
                      value={service.price}
                      onChange={event => change(service.catalogId, { price: event.target.value })}
                      className="field py-2 text-sm"
                      dir="ltr"
                    />
                  </label>
                  {(service.name === 'المطبوعات' || service.name === 'ضيافة خفيفة') && (
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-bold text-[#6B7566]">تفاصيل الخدمة</span>
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

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-label={label}
      aria-pressed={checked}
      className={`relative h-6 w-11 flex-none rounded-full transition ${checked ? 'bg-[#1B3A2D]' : 'bg-[#CDD2CE]'}`}
    >
      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${checked ? 'start-6' : 'start-1'}`} />
    </button>
  )
}
