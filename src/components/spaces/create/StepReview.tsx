'use client'

import { StepProps, DAY_NAMES } from './types'

export default function StepReview({ form, update: _, types, amenities }: StepProps) {
  const typeName = types?.find(t => t.id === form.typeId)?.name || '—'
  const selectedAmenities = amenities?.filter(a => form.amenityIds.includes(a.id)) || []
  const activeRules = form.rules.filter(r => r.isDefault)
  const openDays = form.workingHours.filter(wh => wh.isOpen)

  const policyLabel: Record<string, string> = {
    FLEXIBLE: 'مرنة',
    MODERATE: 'متوسطة',
    STRICT: 'صارمة',
  }

  return (
    <div>
      <h2 className="font-display text-xl font-extrabold text-[#14201A] mb-1">المراجعة والنشر</h2>
      <p className="text-[#6B7566] text-sm mb-6">راجع جميع المعلومات قبل إرسال المساحة للمراجعة والنشر.</p>

      <div className="space-y-4">
        {/* Basic Info */}
        <Section title="المعلومات الأساسية">
          <Row label="اسم المساحة" value={form.name || '—'} />
          <Row label="التصنيف" value={typeName} />
          <Row label="السعة" value={form.capacity ? `${form.capacity} شخص` : '—'} />
          {form.description && <Row label="الوصف" value={form.description} />}
        </Section>

        {/* Location */}
        <Section title="الموقع والعنوان">
          <Row label="المدينة" value={form.city || '—'} />
          {form.district && <Row label="الحي" value={form.district} />}
          {form.streetName && <Row label="الشارع" value={form.streetName} />}
          {form.buildingNumber && <Row label="رقم المبنى" value={form.buildingNumber} />}
          {form.postalCode && <Row label="الرمز البريدي" value={form.postalCode} />}
        </Section>

        {/* Images */}
        {form.images.length > 0 && (
          <Section title="الصور">
            <div className="grid grid-cols-4 gap-2">
              {form.images.map((url, i) => (
                <div key={i} className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Amenities */}
        {selectedAmenities.length > 0 && (
          <Section title="المرافق والتجهيزات">
            <div className="flex flex-wrap gap-2">
              {selectedAmenities.map(a => (
                <span key={a.id} className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#1B3A2D]/5 text-[#1B3A2D] border border-[#1B3A2D]/10">
                  {a.name}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Services */}
        {form.services.length > 0 && (
          <Section title="الخدمات الإضافية">
            {form.services.map((s, i) => (
              <Row
                key={i}
                label={s.name}
                value={`${Number(s.price).toLocaleString('ar-SA')} ر.س / ${s.pricingType === 'PER_PERSON' ? 'للشخص' : 'للحجز'}`}
              />
            ))}
          </Section>
        )}

        {/* Schedule */}
        {openDays.length > 0 && (
          <Section title="ساعات العمل">
            {openDays.map(wh => (
              <Row
                key={wh.dayOfWeek}
                label={DAY_NAMES[wh.dayOfWeek]}
                value={`${wh.openTime} - ${wh.closeTime}`}
              />
            ))}
          </Section>
        )}

        {/* Pricing */}
        <Section title="التسعير">
          <Row
            label="السعر"
            value={form.price ? `${Number(form.price).toLocaleString('ar-SA')} ر.س / ${form.pricePeriod === 'day' ? 'يوم' : 'ساعة'}` : '—'}
          />
        </Section>

        {/* Terms */}
        <Section title="الشروط">
          <Row label="سياسة الإلغاء" value={policyLabel[form.cancellationPolicy] || '—'} />
          {activeRules.length > 0 && (
            <div className="mt-2">
              <span className="text-[11px] font-bold text-[#6B7566]">القواعد:</span>
              <ul className="mt-1 space-y-1">
                {activeRules.map((r, i) => (
                  <li key={i} className="text-xs text-[#4A554D] flex items-center gap-2">
                    <svg className="w-3 h-3 text-[#1B3A2D]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {r.rule}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>

        {/* Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <p className="font-medium mb-1">ملاحظة مهمة</p>
          <p className="text-xs">بعد إضافة المساحة، ستخضع لمراجعة الإدارة قبل نشرها للعملاء.</p>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-xl border border-[#ECE6D8] bg-white">
      <h3 className="text-sm font-bold text-[#14201A] mb-3">{title}</h3>
      {children}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-1.5 text-sm">
      <span className="text-[#6B7566] text-xs">{label}</span>
      <span className="text-[#14201A] font-medium text-xs text-end max-w-[60%]">{value}</span>
    </div>
  )
}
