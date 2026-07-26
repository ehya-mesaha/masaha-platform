import Card from '@/components/ui/Card'
import { formatNumber } from '@/lib/format'

type Rule = { id: string; rule: string }
type AvailableService = {
  id: string
  name: string
  description: string | null
  price: number
  pricingType: string
}

export default function SpaceCommitmentsCard({
  rules,
  services,
}: {
  rules: Rule[]
  services: AvailableService[]
}) {
  return (
    <Card>
      <div className="mb-5">
        <p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#A27B25]">مرجع الحجز</p>
        <h3 className="mt-1 font-display text-lg font-extrabold text-[#1B1B1B]">قواعد المساحة والخدمات المتاحة</h3>
        <p className="mt-1 text-xs leading-6 text-[#5F6764]">تبقى هذه التفاصيل واضحة لطالب المساحة وصاحبها طوال دورة الحجز.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#D8D1C7] bg-[#FAF8F3] p-4">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-[#0E3B34]">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#0E3B34] text-[#B99A63]">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" /></svg>
            </span>
            قواعد الاستخدام
          </h4>
          {rules.length > 0 ? (
            <ul className="space-y-2.5">
              {rules.map(rule => (
                <li key={rule.id} className="flex items-start gap-2 text-xs leading-6 text-[#3F4B47]">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#B99A63]" />
                  {rule.rule}
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-xl border border-dashed border-[#D8D1C7] bg-white p-3 text-xs leading-6 text-[#5F6764]">لم تُسجل قواعد إضافية لهذه المساحة.</p>
          )}
        </section>

        <section className="rounded-2xl border border-[#D8D1C7] bg-[#FAF8F3] p-4">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-[#0E3B34]">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#0E3B34] text-[#B99A63]">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            </span>
            الخدمات المتاحة
          </h4>
          {services.length > 0 ? (
            <div className="space-y-2">
              {services.map(service => (
                <div key={service.id} className="rounded-xl border border-[#D8D1C7] bg-white px-3 py-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <strong className="text-xs text-[#1B1B1B]">{service.name}</strong>
                    <span className="whitespace-nowrap text-[11px] font-extrabold text-[#0E3B34]">
                      {formatNumber(service.price)} ر.س
                    </span>
                  </div>
                  {service.description && <p className="mt-1 text-[11px] leading-5 text-[#5F6764]">{service.description}</p>}
                  <span className="mt-1.5 inline-block rounded-full bg-[#F5F1E8] px-2 py-0.5 text-[9px] font-bold text-[#7B6840]">
                    {pricingLabel(service.pricingType)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-[#D8D1C7] bg-white p-3 text-xs leading-6 text-[#5F6764]">لا توجد خدمات إضافية مفعلة لهذه المساحة.</p>
          )}
        </section>
      </div>
    </Card>
  )
}

function pricingLabel(type: string) {
  const labels: Record<string, string> = {
    PER_BOOKING: 'لكل حجز',
    PER_PERSON: 'لكل شخص',
    PER_HOUR: 'لكل ساعة',
    PER_ITEM: 'لكل قطعة',
    PER_TEN_PAGES: 'لكل 10 صفحات',
  }
  return labels[type] || 'حسب الخدمة'
}
