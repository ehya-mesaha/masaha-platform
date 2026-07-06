'use client'

import { StepProps, SAUDI_CITIES } from './types'

export default function StepLocation({ form, update }: StepProps) {
  const lat = parseFloat(form.latitude) || 24.7136
  const lng = parseFloat(form.longitude) || 46.6753

  return (
    <div>
      <h2 className="font-display text-xl font-extrabold text-[#14201A] mb-1">الموقع والعنوان التفصيلي</h2>
      <p className="text-[#6B7566] text-sm mb-6">حدد موقع المساحة بدقة وأدخل تفاصيل العنوان لتسهيل وصول العملاء إليها.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4A554D] mb-1.5">المدينة</label>
              <select
                value={form.city}
                onChange={e => update('city', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D] bg-white"
              >
                <option value="">اختر المدينة</option>
                {SAUDI_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A554D] mb-1.5">الحي</label>
              <input
                value={form.district}
                onChange={e => update('district', e.target.value)}
                placeholder="الملقا"
                className="w-full px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4A554D] mb-1.5">اسم الشارع</label>
            <input
              value={form.streetName}
              onChange={e => update('streetName', e.target.value)}
              placeholder="طريق الأمير محمد بن سعد بن عبدالعزيز"
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4A554D] mb-1.5">رقم المبنى</label>
              <input
                value={form.buildingNumber}
                onChange={e => update('buildingNumber', e.target.value)}
                placeholder="3492"
                className="w-full px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A554D] mb-1.5">الرمز البريدي</label>
              <input
                value={form.postalCode}
                onChange={e => update('postalCode', e.target.value)}
                placeholder="13521"
                className="w-full px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4A554D] mb-1.5">معالم قريبة أو إرشادات إضافية (اختياري)</label>
            <input
              value={form.landmarks}
              onChange={e => update('landmarks', e.target.value)}
              placeholder="بجوار مجمع الأعمال..."
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
            />
          </div>
        </div>

        {/* Map */}
        <div>
          <div className="rounded-xl overflow-hidden border border-[#E8E3D8] bg-gray-100" style={{ height: 320 }}>
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`}
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#6B7566] mb-1">خط العرض</label>
              <input
                value={form.latitude}
                onChange={e => update('latitude', e.target.value)}
                placeholder="24.7954"
                dir="ltr"
                className="w-full px-3 py-2 rounded-lg border border-[#E8E3D8] text-xs focus:outline-none focus:border-[#1B3A2D]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#6B7566] mb-1">خط الطول</label>
              <input
                value={form.longitude}
                onChange={e => update('longitude', e.target.value)}
                placeholder="46.6012"
                dir="ltr"
                className="w-full px-3 py-2 rounded-lg border border-[#E8E3D8] text-xs focus:outline-none focus:border-[#1B3A2D]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
