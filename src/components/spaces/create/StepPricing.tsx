'use client'

import { StepProps } from './types'

export default function StepPricing({ form, update }: StepProps) {
  function updateTier(index: number, value: string) {
    update('pricingTiers', form.pricingTiers.map((tier, currentIndex) => currentIndex === index ? { ...tier, discountPercent: value } : tier))
  }

  return (
    <div>
      <h2 className="font-display mb-1 text-xl font-extrabold text-[#1B1B1B]">التسعير بالساعة</h2>
      <p className="mb-6 text-sm text-[#5F6764]">جميع الحجوزات تُحسب بالساعات. حدّد السعر الأساسي، ثم راجع خصومات المدة التلقائية.</p>

      <div className="space-y-6">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[#3F4B47]">سعر الساعة (ريال سعودي)</span>
          <span className="flex overflow-hidden rounded-xl border border-[#D8D1C7] bg-white transition focus-within:border-[#0E3B34] focus-within:ring-4 focus-within:ring-[#0E3B34]/5" dir="ltr">
            <input
              type="number"
              value={form.price}
              onChange={event => update('price', event.target.value)}
              placeholder="100"
              min="1"
              className="min-w-0 flex-1 px-4 py-3 text-lg font-bold outline-none"
              dir="ltr"
            />
            <span className="flex items-center border-l border-[#D8D1C7] bg-[#F5F1E8] px-4 text-sm font-bold text-[#0E3B34]" dir="rtl">ر.س / ساعة</span>
          </span>
        </label>

        <div>
          <div className="mb-3">
            <h3 className="text-sm font-extrabold text-[#0E3B34]">خصومات المدة</h3>
            <p className="mt-1 text-xs text-[#5F6764]">يُطبق أعلى خصم مؤهل فقط، ولا تُجمع الخصومات.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {form.pricingTiers.map((tier, index) => (
              <label key={tier.minHours} className="rounded-2xl border border-[#D8D1C7] bg-[#FAF8F3] p-4">
                <span className="text-xs font-bold text-[#5F6764]">من {tier.minHours} ساعات</span>
                <span className="mt-3 flex items-center gap-2" dir="ltr">
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={tier.discountPercent}
                    onChange={event => updateTier(index, event.target.value)}
                    className="min-w-0 flex-1 rounded-lg border border-[#D8D1C7] bg-white px-3 py-2 text-center font-extrabold outline-none focus:border-[#0E3B34]"
                  />
                  <span className="font-extrabold text-[#B99A63]">%</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        {form.price && (
          <div className="rounded-2xl border border-[#0E3B34]/10 bg-[#0E3B34]/5 p-4">
            <p className="text-sm text-[#0E3B34]">
              السعر الأساسي: <strong>{Number(form.price).toLocaleString('en-US')} ر.س / ساعة</strong>
            </p>
            <p className="mt-1 text-xs text-[#5C675F]">يظهر لطالب المساحة تفصيل الساعات والخصم والإجمالي قبل تأكيد الحجز.</p>
          </div>
        )}
      </div>
    </div>
  )
}
