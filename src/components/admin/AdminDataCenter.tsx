'use client'

import { useMemo, useState } from 'react'
import { useLanguage } from '@/components/i18n/LanguageProvider'

type DatasetId =
  | 'all'
  | 'users'
  | 'spaces'
  | 'bookings'
  | 'seller-applications'
  | 'service-requests'
  | 'space-needs'
  | 'contact-messages'
  | 'reviews'
  | 'audit-log'

type DatasetCard = {
  id: DatasetId
  count: number
}

type AuditItem = {
  id: string
  actor: string
  action: string
  entityType: string
  createdAt: string
}

const COPY = {
  ar: {
    eyebrow: 'مركز بيانات الإدارة العليا',
    title: 'بيانات المنصة، جاهزة لاتخاذ القرار.',
    description:
      'صدّر السجلات المصرح بها بصيغة Excel أو PDF، وحدد الفترة الزمنية عند الحاجة. تستبعد الملفات كلمات المرور والمستندات الحساسة تلقائياً.',
    total: 'إجمالي السجلات القابلة للتصدير',
    datasets: 'مجموعات بيانات',
    security: 'تصدير محمي للمدير فقط',
    from: 'من تاريخ',
    to: 'إلى تاريخ',
    clear: 'مسح الفترة',
    excel: 'Excel',
    pdf: 'PDF',
    exportAll: 'تصدير ملف الإدارة الشامل',
    records: 'سجل',
    empty: 'لا توجد سجلات',
    auditTitle: 'أحدث نشاط إداري',
    auditDescription: 'يُسجل كل تصدير وتعديل للمراجعة والحوكمة.',
    noAudit: 'لا توجد إجراءات إدارية مسجلة بعد.',
    legal: 'الخصوصية أولاً',
    legalText:
      'تُخفى أرقام الهوية في التصدير الجماعي، ولا تُصدر كلمات المرور أو روابط المستندات. استخدم الملفات للأغراض الإدارية المصرح بها فقط.',
    names: {
      all: 'كل بيانات المنصة',
      users: 'المستخدمون',
      spaces: 'المساحات',
      bookings: 'الحجوزات',
      'seller-applications': 'طلبات أصحاب المساحات',
      'service-requests': 'طلبات الخدمات',
      'space-needs': 'احتياجات المساحات',
      'contact-messages': 'رسائل التواصل',
      reviews: 'التقييمات',
      'audit-log': 'سجل الإدارة',
    },
  },
  en: {
    eyebrow: 'Super Admin Data Center',
    title: 'Platform data, ready for decisions.',
    description:
      'Export authorized records as Excel or PDF and apply an optional date range. Passwords and sensitive documents are automatically excluded.',
    total: 'Exportable records',
    datasets: 'Datasets',
    security: 'Admin-only protected export',
    from: 'From date',
    to: 'To date',
    clear: 'Clear range',
    excel: 'Excel',
    pdf: 'PDF',
    exportAll: 'Export complete admin workbook',
    records: 'records',
    empty: 'No records',
    auditTitle: 'Recent admin activity',
    auditDescription: 'Every export and management action is logged for governance.',
    noAudit: 'No administrative actions have been recorded yet.',
    legal: 'Privacy first',
    legalText:
      'National IDs are masked in bulk exports, while passwords and document links are never exported. Use files only for authorized administrative purposes.',
    names: {
      all: 'All platform data',
      users: 'Users',
      spaces: 'Spaces',
      bookings: 'Bookings',
      'seller-applications': 'Space-owner applications',
      'service-requests': 'Service requests',
      'space-needs': 'Space needs',
      'contact-messages': 'Contact messages',
      reviews: 'Reviews',
      'audit-log': 'Admin audit log',
    },
  },
} as const

const icons: Record<DatasetId, React.ReactNode> = {
  all: <path d="M4 5h16M4 12h16M4 19h16M8 3v18M16 3v18" />,
  users: <><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 5" /></>,
  spaces: <path d="M4 21V5l8-3 8 3v16M8 8h2m4 0h2M8 12h2m4 0h2M9 21v-5h6v5" />,
  bookings: <path d="M6 3v3m12-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Zm3 8h3v3H8z" />,
  'seller-applications': <path d="M9 12h6m-6 4h6M8 3h8l4 4v14H4V3h4Zm8 0v5h5" />,
  'service-requests': <path d="m12 3 2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.3-4.5 2.3.9-5-3.6-3.5 5-.7L12 3Z" />,
  'space-needs': <path d="M12 21s7-4.7 7-11a7 7 0 1 0-14 0c0 6.3 7 11 7 11Z" />,
  'contact-messages': <path d="M4 5h16v12H8l-4 4V5Zm4 4h8m-8 4h5" />,
  reviews: <path d="m12 3 2.5 5.1 5.6.8-4 3.9.9 5.5-5-2.6-5 2.6.9-5.5-4-3.9 5.6-.8L12 3Z" />,
  'audit-log': <path d="M12 8v5l3 2M4 4v5h5M5.5 8A8 8 0 1 1 4 13" />,
}

const auditActionLabel = (action: string, locale: 'ar' | 'en') => {
  const labels: Record<string, { ar: string; en: string }> = {
    EXPORT_XLSX: { ar: 'تصدير Excel', en: 'Excel export' },
    EXPORT_PDF: { ar: 'تصدير PDF', en: 'PDF export' },
    USER_ROLE_CHANGE: { ar: 'تعديل صلاحية مستخدم', en: 'User role changed' },
    USER_STATUS_CHANGE: { ar: 'تعديل حالة مستخدم', en: 'User status changed' },
    SPACE_STATUS_CHANGE: { ar: 'تعديل حالة مساحة', en: 'Space status changed' },
  }
  return labels[action]?.[locale] || action.replaceAll('_', ' ')
}

export default function AdminDataCenter({
  datasets,
  recentAudit,
}: {
  datasets: DatasetCard[]
  recentAudit: AuditItem[]
}) {
  const { locale } = useLanguage()
  const copy = COPY[locale]
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const total = useMemo(
    () => datasets.filter((dataset) => dataset.id !== 'audit-log').reduce((sum, dataset) => sum + dataset.count, 0),
    [datasets]
  )
  const exportable = datasets.filter((dataset) => dataset.id !== 'all')

  const hrefFor = (id: DatasetId, format: 'xlsx' | 'pdf') => {
    const query = new URLSearchParams({ format })
    if (from) query.set('from', from)
    if (to) query.set('to', to)
    return `/api/admin/exports/${id}?${query.toString()}`
  }

  return (
    <div className="dashboard-page" data-no-translate="true">
      <section className="relative mb-6 overflow-hidden rounded-[28px] bg-[#092C27] px-6 py-8 text-white shadow-[0_24px_70px_rgba(9,44,39,.18)] lg:px-9">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_left,black,transparent_85%)]" />
        <div className="relative grid gap-8 xl:grid-cols-[1.35fr_.65fr] xl:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#B99A63]/30 bg-[#B99A63]/10 px-3 py-1.5 text-xs font-bold text-[#E2C98D]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D7B66D] shadow-[0_0_12px_#D7B66D]" />
              {copy.eyebrow}
            </div>
            <h1 className="max-w-3xl text-3xl font-extrabold leading-tight lg:text-4xl">{copy.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/65">{copy.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Metric label={copy.total} value={total.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US')} />
            <Metric label={copy.datasets} value={exportable.length.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US')} />
            <div className="col-span-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[.055] px-4 py-3 text-xs font-bold text-white/75">
              <ShieldIcon />
              {copy.security}
            </div>
          </div>
        </div>
      </section>

      <section className="premium-card mb-6 p-5 lg:p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
          <label className="block text-sm font-bold text-[#25322E]">
            {copy.from}
            <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="mt-2 w-full rounded-xl border border-[#D8D1C7] bg-white px-4 py-3 font-medium outline-none focus:border-[#0E3B34] focus:ring-2 focus:ring-[#0E3B34]/10" />
          </label>
          <label className="block text-sm font-bold text-[#25322E]">
            {copy.to}
            <input type="date" value={to} onChange={(event) => setTo(event.target.value)} className="mt-2 w-full rounded-xl border border-[#D8D1C7] bg-white px-4 py-3 font-medium outline-none focus:border-[#0E3B34] focus:ring-2 focus:ring-[#0E3B34]/10" />
          </label>
          <button type="button" onClick={() => { setFrom(''); setTo('') }} className="rounded-xl border border-[#D8D1C7] px-5 py-3 text-sm font-bold text-[#5F6764] transition hover:bg-[#F5F1E8]">
            {copy.clear}
          </button>
        </div>
      </section>

      <section className="mb-6 rounded-[26px] border border-[#B99A63]/30 bg-gradient-to-br from-[#F7F1E4] to-white p-5 lg:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#0E3B34] text-[#D7B66D] shadow-lg shadow-[#0E3B34]/15">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">{icons.all}</svg>
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-[#17221E]">{copy.exportAll}</h2>
              <p className="mt-1 text-sm text-[#5F6764]">{copy.names.all} · {total.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US')} {copy.records}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <ExportLink href={hrefFor('all', 'xlsx')} label={copy.excel} kind="excel" />
            <ExportLink href={hrefFor('all', 'pdf')} label={copy.pdf} kind="pdf" />
          </div>
        </div>
      </section>

      <section className="mb-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {exportable.map((dataset) => (
          <article key={dataset.id} className="group rounded-[22px] border border-[#D8D1C7] bg-white p-5 shadow-[0_12px_40px_rgba(17,40,32,.045)] transition duration-300 hover:-translate-y-1 hover:border-[#B99A63]/60 hover:shadow-[0_18px_50px_rgba(17,40,32,.09)]">
            <div className="flex items-start justify-between gap-4">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#EEF3EE] text-[#0E3B34] transition group-hover:bg-[#0E3B34] group-hover:text-[#D7B66D]">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{icons[dataset.id]}</svg>
              </span>
              <span className="rounded-full bg-[#F5F1E8] px-3 py-1 text-xs font-extrabold text-[#806D48]">
                {dataset.count ? `${dataset.count.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US')} ${copy.records}` : copy.empty}
              </span>
            </div>
            <h3 className="mt-5 text-base font-extrabold text-[#17221E]">{copy.names[dataset.id]}</h3>
            <div className="mt-5 flex gap-2 border-t border-[#E8E1D7] pt-4">
              <ExportLink href={hrefFor(dataset.id, 'xlsx')} label={copy.excel} kind="excel" compact />
              <ExportLink href={hrefFor(dataset.id, 'pdf')} label={copy.pdf} kind="pdf" compact />
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <div className="premium-card overflow-hidden">
          <div className="border-b border-[#E7E0D5] px-6 py-5">
            <h2 className="text-lg font-extrabold text-[#17221E]">{copy.auditTitle}</h2>
            <p className="mt-1 text-xs leading-6 text-[#6B746F]">{copy.auditDescription}</p>
          </div>
          {recentAudit.length ? (
            <div className="divide-y divide-[#ECE6DC]">
              {recentAudit.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#EEF3EE] text-[#0E3B34]"><ClockIcon /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-extrabold text-[#25322E]">{auditActionLabel(item.action, locale)}</p>
                    <p className="mt-1 truncate text-xs text-[#737B77]">{item.actor} · {item.entityType}</p>
                  </div>
                  <time className="shrink-0 text-[11px] font-semibold text-[#8A8174]">
                    {new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.createdAt))}
                  </time>
                </div>
              ))}
            </div>
          ) : <p className="px-6 py-12 text-center text-sm text-[#737B77]">{copy.noAudit}</p>}
        </div>

        <aside className="rounded-[24px] bg-[#0E3B34] p-6 text-white">
          <span className="grid h-12 w-12 place-items-center rounded-2xl border border-[#B99A63]/30 bg-[#B99A63]/10 text-[#D7B66D]"><ShieldIcon /></span>
          <h2 className="mt-6 text-xl font-extrabold">{copy.legal}</h2>
          <p className="mt-3 text-sm leading-7 text-white/65">{copy.legalText}</p>
          <div className="mt-7 h-px bg-white/10" />
          <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-[#D7B66D]">Ehya Masaha · Super Admin</p>
        </aside>
      </section>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[.055] p-4">
    <p className="text-[11px] font-semibold text-white/50">{label}</p>
    <p className="mt-1 text-2xl font-extrabold text-white">{value}</p>
  </div>
}

function ExportLink({ href, label, kind, compact = false }: { href: string; label: string; kind: 'excel' | 'pdf'; compact?: boolean }) {
  return <a href={href} className={`inline-flex items-center justify-center gap-2 rounded-xl font-extrabold transition active:scale-[.98] ${compact ? 'flex-1 px-3 py-2.5 text-xs' : 'px-5 py-3 text-sm'} ${kind === 'excel' ? 'bg-[#0E3B34] text-white hover:bg-[#155449]' : 'border border-[#0E3B34]/20 bg-white text-[#0E3B34] hover:bg-[#EEF3EE]'}`}>
    {kind === 'excel' ? <SheetIcon /> : <PdfIcon />}
    {label}
  </a>
}

function ShieldIcon() {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3 5 6v5c0 4.6 2.8 8 7 10 4.2-2 7-5.4 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg>
}
function SheetIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M5 3h10l4 4v14H5V3Zm10 0v5h5M8 12h8M8 16h8M11 9v10" /></svg>
}
function PdfIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M6 3h9l4 4v14H6V3Zm9 0v5h5M9 13h6m-6 4h4" /></svg>
}
function ClockIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
}
