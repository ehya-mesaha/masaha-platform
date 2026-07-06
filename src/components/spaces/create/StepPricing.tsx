'use client'

import { StepProps } from './types'

export default function StepPricing({ form, update }: StepProps) {
  return (
    <div>
      <h2 className="font-display text-xl font-extrabold text-[#14201A] mb-1">التسعير</h2>
      <p className="text-[#6B7566] text-sm mb-6">حدد سعر مساحتك بناءً على الفترة الزمنية المناسبة.</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#4A554D] mb-1.5">السعر (ريال سعودي)</label>
          <div className="relative">
            <input
              type="number"
              value={form.price}
              onChange={e => update('price', e.target.value)}
              placeholder="100"
              min={0}
              className="w-full px-4 py-3 rounded-lg border border-[#E8E3D8] text-lg font-bold focus:outline-none focus:border-[#1B3A2D] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="absolute start-4 top-1/2 -translate-y-1/2 text-[#6B7566] text-sm">ر.س</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4A554D] mb-3">الفترة</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { val: 'hour', label: 'بالساعة', desc: 'مناسب للاجتماعات والجلسات القصيرة' },
              { val: 'day', label: 'باليوم', desc: 'مناسب لورش العمل والفعاليات' },
            ].map(opt => (
              <button
                key={opt.val}
                type="button"
                onClick={() => update('pricePeriod', opt.val)}
                className={`p-4 rounded-xl border-2 text-start transition-all ${
                  form.pricePeriod === opt.val
                    ? 'border-[#1B3A2D] bg-[#1B3A2D]/5'
                    : 'border-[#ECE6D8] hover:border-[#1B3A2D]/40'
                }`}
              >
                <div className={`text-sm font-bold ${form.pricePeriod === opt.val ? 'text-[#1B3A2D]' : 'text-[#14201A]'}`}>
                  {opt.label}
                </div>
                <div className="text-xs text-[#6B7566] mt-1">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {form.price && (
          <div className="p-4 rounded-xl bg-[#1B3A2D]/5 border border-[#1B3A2D]/10">
            <p className="text-sm text-[#1B3A2D]">
              <span className="font-bold">{Number(form.price).toLocaleString('ar-SA')} ر.س</span>
              {' / '}
              {form.pricePeriod === 'day' ? 'يوم' : 'ساعة'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
