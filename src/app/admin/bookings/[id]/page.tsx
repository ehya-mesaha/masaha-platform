import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Badge, { getBookingStatusBadge } from '@/components/ui/Badge'
import AdminBookingActions from '@/components/admin/AdminBookingActions'
import { formatDate, formatNumber, formatTimeRange } from '@/lib/format'

export const dynamic = 'force-dynamic'

export default async function AdminBookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      buyer: { select: { name: true, email: true, phone: true } },
      unit: { select: { label: true } },
      services: true,
      space: {
        include: {
          type: { select: { name: true } },
          seller: { select: { name: true, email: true, phone: true } },
          rules: true,
          amenities: { include: { amenity: true } },
          serviceConfigs: { include: { catalog: true } },
        },
      },
    },
  })
  if (!booking) notFound()
  const badge = getBookingStatusBadge(booking.status)
  const enabledServices = booking.space.serviceConfigs.filter((service) => service.isEnabled)

  return (
    <div className="dashboard-page">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/bookings" className="text-sm font-extrabold text-[#0E3B34]">← العودة إلى الحجوزات</Link>
        <div className="flex gap-2">
          <a href={`/api/admin/exports/bookings?format=xlsx`} className="rounded-xl border border-[#D8D1C7] bg-white px-4 py-2 text-xs font-extrabold text-[#0E3B34]">تصدير الحجوزات</a>
          <span dir="ltr" className="rounded-xl bg-[#F1E9D8] px-4 py-2 font-mono text-xs font-bold text-[#6F592D]">{booking.id}</span>
        </div>
      </div>

      <header className="page-hero mb-6 p-6">
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold text-[#B99A63]">ملف الحجز التشغيلي</p>
            <h1 className="text-2xl font-extrabold text-white">{booking.space.name}</h1>
            <p className="mt-2 text-sm text-white/65">{booking.space.type.name} · {booking.unit.label} · {formatDate(booking.date)}</p>
          </div>
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <section className="premium-card p-6">
            <h2 className="text-lg font-extrabold text-[#17221E]">تفاصيل الموعد والحجز</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Info label="التاريخ" value={formatDate(booking.date)} />
              <Info label="الوقت" value={formatTimeRange(booking.startTime, booking.endTime)} ltr />
              <Info label="المدة" value={`${formatNumber(booking.totalHours)} ساعة`} />
              <Info label="عدد الأشخاص" value={booking.persons ? formatNumber(booking.persons) : 'غير محدد'} />
            </div>
            {booking.notes && <p className="mt-4 rounded-xl bg-[#FAF8F3] p-4 text-sm leading-7 text-[#46524D]">{booking.notes}</p>}
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <PartyCard title="طالب المساحة" name={booking.buyer.name} email={booking.buyer.email} phone={booking.buyer.phone} />
            <PartyCard title="صاحب المساحة" name={booking.space.seller.name} email={booking.space.seller.email} phone={booking.space.seller.phone} />
          </section>

          <section className="premium-card p-6">
            <h2 className="text-lg font-extrabold text-[#17221E]">الخدمات المرتبطة بالحجز</h2>
            {booking.services.length ? (
              <div className="mt-4 divide-y divide-[#E8E1D7]">
                {booking.services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <div>
                      <strong className="text-[#25322E]">{service.name}</strong>
                      <p className="mt-1 text-xs text-[#707975]">الكمية: {formatNumber(service.quantity)}</p>
                    </div>
                    <span className="font-extrabold text-[#0E3B34]">{formatNumber(service.lineTotal)} ر.س</span>
                  </div>
                ))}
              </div>
            ) : <p className="mt-4 text-sm text-[#707975]">لا توجد خدمات إضافية على هذا الحجز.</p>}
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <ListCard title="شروط وقواعد المساحة" items={booking.space.rules.map((rule) => rule.rule)} empty="لم يضف صاحب المساحة قواعد خاصة." />
            <ListCard title="الخدمات المتاحة في المساحة" items={enabledServices.map((service) => service.catalog.name)} empty="لا توجد خدمات مساحة مفعلة." />
          </section>

          <section className="premium-card p-6">
            <h2 className="text-lg font-extrabold text-[#17221E]">المرافق والتجهيزات</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {booking.space.amenities.length ? booking.space.amenities.map(({ amenity }) => (
                <span key={amenity.id} className="rounded-full border border-[#D8D1C7] bg-[#FAF8F3] px-3 py-1.5 text-xs font-bold text-[#46524D]">{amenity.name}</span>
              )) : <p className="text-sm text-[#707975]">لا توجد مرافق مسجلة.</p>}
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="premium-card p-5">
            <p className="text-xs font-bold text-[#B1872E]">الملخص التشغيلي</p>
            <div className="mt-4 space-y-3">
              <MoneyRow label="السعر الأساسي" value={booking.basePrice} />
              <MoneyRow label="الخصم" value={booking.discountAmount} />
              <MoneyRow label="الخدمات الإضافية" value={booking.servicesTotal} />
              <div className="border-t border-[#D8D1C7] pt-3"><MoneyRow label="الإجمالي" value={booking.grandTotal} strong /></div>
            </div>
          </section>
          <section className="premium-card p-5">
            <h2 className="mb-4 text-base font-extrabold text-[#17221E]">إدارة حالة الحجز</h2>
            <AdminBookingActions id={booking.id} currentStatus={booking.status} initialNote={booking.sellerNote} />
          </section>
          {booking.cancelledAt && (
            <section className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-900">
              <strong>سجل الإلغاء</strong>
              <p className="mt-2 text-xs leading-6">تم الإلغاء في {formatDate(booking.cancelledAt)}.</p>
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}

function Info({ label, value, ltr = false }: { label: string; value: string; ltr?: boolean }) {
  return <div className="rounded-xl border border-[#E2DACE] bg-[#FAF8F3] p-4">
    <p className="text-[11px] font-bold text-[#707975]">{label}</p>
    <p className="mt-1 text-sm font-extrabold text-[#25322E]" dir={ltr ? 'ltr' : undefined}>{value}</p>
  </div>
}
function PartyCard({ title, name, email, phone }: { title: string; name: string; email: string; phone: string | null }) {
  return <section className="premium-card p-5">
    <p className="text-xs font-bold text-[#B1872E]">{title}</p>
    <h2 className="mt-2 text-lg font-extrabold text-[#17221E]">{name}</h2>
    <p dir="ltr" className="mt-2 text-right text-xs text-[#68736E]">{email}</p>
    <p dir="ltr" className="mt-1 text-right text-xs text-[#68736E]">{phone || '—'}</p>
  </section>
}
function ListCard({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return <section className="premium-card p-5">
    <h2 className="text-base font-extrabold text-[#17221E]">{title}</h2>
    {items.length ? <ul className="mt-4 space-y-2">{items.map((item, index) => <li key={`${item}-${index}`} className="flex gap-2 text-sm leading-7 text-[#46524D]"><span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B99A63]" />{item}</li>)}</ul> : <p className="mt-4 text-sm text-[#707975]">{empty}</p>}
  </section>
}
function MoneyRow({ label, value, strong = false }: { label: string; value: number; strong?: boolean }) {
  return <div className="flex items-center justify-between gap-3">
    <span className={`text-sm ${strong ? 'font-extrabold text-[#17221E]' : 'text-[#68736E]'}`}>{label}</span>
    <strong className={strong ? 'text-lg text-[#0E3B34]' : 'text-sm text-[#25322E]'}>{formatNumber(value)} ر.س</strong>
  </div>
}
