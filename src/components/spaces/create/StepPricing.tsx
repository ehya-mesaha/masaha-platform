'use client'

import { StepProps } from './types'

export default function StepPricing({ form, update }: StepProps) {
  function updateTier(index: number, value: string) {
    update('pricingTiers', form.pricingTiers.map((tier, currentIndex) => currentIndex === index ? { ...tier, discountPercent: value } : tier))
  }

  return (
    <div>
      <h2 className="font-display mb-1 text-xl font-extrabold text-[#14201A]">التسعير بالساعة</h2>
      <p className="mb-6 text-sm text-[#6B7566]">جميع الحجوزات تُحسب بالساعات. حدّد السعر الأساسي، ثم راجع خصومات المدة التلقائية.</p>

      <div className="space-y-6">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[#4A554D]">سعر الساعة (ريال سعودي)</span>
          <span className="relative block">
            <input
              type="number"
              value={form.price}
              onChange={event => update('price', event.target.value)}
              placeholder="100"
              min="0"
              className="w-full rounded-xl border border-[#E8E3D8] px-4 py-3 text-lg font-bold outline-none focus:border-[#1B3A2D]"
              dir="ltr"
            />
            <span className="pointer-events-none absolute inset-y-0 end-4 flex items-center text-sm text-[#6B7566]">ر.س / ساعة</span>
          </span>
        </label>

        <div>
          <div className="mb-3">
            <h3 className="text-sm font-extrabold text-[#1B3A2D]">خصومات المدة</h3>
            <p className="mt-1 text-xs text-[#6B7566]">يُطبق أعلى خصم مؤهل فقط، ولا تُجمع الخصومات.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {form.pricingTiers.map((tier, index) => (
              <label key={tier.minHours} className="rounded-2xl border border-[#E8E1D3] bg-[#FBF8F1] p-4">
                <span className="text-xs font-bold text-[#6B7566]">من {tier.minHours} ساعات</span>
                <span className="mt-3 flex items-center gap-2" dir="ltr">
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={tier.discountPercent}
                    onChange={event => updateTier(index, event.target.value)}
                    className="min-w-0 flex-1 rounded-lg border border-[#DDD5C5] bg-white px-3 py-2 text-center font-extrabold outline-none focus:border-[#1B3A2D]"
                  />
                  <span className="font-extrabold text-[#C49A3C]">%</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        {form.price && (
          <div className="rounded-2xl border border-[#1B3A2D]/10 bg-[#1B3A2D]/5 p-4">
            <p className="text-sm text-[#1B3A2D]">
              السعر الأساسي: <strong>{Number(form.price).toLocaleString('en-US')} ر.س / ساعة</strong>
            </p>
            <p className="mt-1 text-xs text-[#5C675F]">يظهر لطالب المساحة تفصيل الساعات والخصم والإجمالي قبل تأكيد الحجز.</p>
          </div>
        )}
      </div>
    </div>
  )
}
