'use client'

import { useEffect, useMemo, useState } from 'react'

type Coupon = {
  id: string
  code: string
  description: string | null
  discountType: 'PERCENTAGE' | 'FIXED'
  discountValue: number
  maxDiscountAmount: number | null
  minBookingAmount: number | null
  startsAt: string
  endsAt: string
  maxRedemptions: number | null
  maxPerUser: number | null
  isActive: boolean
  createdAt: string
  createdByName: string | null
  usedCount: number
  confirmedCount: number
  totalDiscount: number
}

type Draft = {
  code: string
  description: string
  discountType: 'PERCENTAGE' | 'FIXED'
  discountValue: string
  maxDiscountAmount: string
  minBookingAmount: string
  startsAt: string
  endsAt: string
  maxRedemptions: string
  maxPerUser: string
  isActive: boolean
}

type Feedback = { tone: 'success' | 'error'; text: string }

const emptyDraft: Draft = {
  code: '',
  description: '',
  discountType: 'PERCENTAGE',
  discountValue: '',
  maxDiscountAmount: '',
  minBookingAmount: '',
  startsAt: '',
  endsAt: '',
  maxRedemptions: '',
  maxPerUser: '',
  isActive: true,
}

type Lifecycle = { label: string; tone: 'success' | 'warning' | 'gray' | 'danger' }

/** What a buyer would actually experience right now, rather than the isActive flag alone. */
function lifecycle(coupon: Coupon): Lifecycle {
  if (!coupon.isActive) return { label: 'غير مفعل', tone: 'gray' }
  const now = Date.now()
  if (new Date(coupon.startsAt).getTime() > now) return { label: 'لم يبدأ بعد', tone: 'warning' }
  if (new Date(coupon.endsAt).getTime() <= now) return { label: 'منتهي', tone: 'danger' }
  if (coupon.maxRedemptions != null && coupon.usedCount >= coupon.maxRedemptions) {
    return { label: 'اكتمل الاستخدام', tone: 'danger' }
  }
  return { label: 'فعال الآن', tone: 'success' }
}

const TONE_CLASSES: Record<Lifecycle['tone'], string> = {
  success: 'border-green-200 bg-green-50 text-green-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  danger: 'border-red-200 bg-red-50 text-red-700',
  gray: 'border-gray-200 bg-gray-100 text-gray-600',
}

function toDateTimeLocal(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.valueOf())) return ''
  const pad = (part: number) => String(part).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function formatDateTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.valueOf())) return '—'
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function formatNumber(value: number) {
  return value.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/coupons')
      .then(response => response.json())
      .then(result => setCoupons(result.coupons || []))
      .catch(() => setFeedback({ tone: 'error', text: 'تعذر تحميل الكوبونات' }))
      .finally(() => setLoading(false))
  }, [])

  const stats = useMemo(() => ({
    total: coupons.length,
    live: coupons.filter(coupon => lifecycle(coupon).tone === 'success').length,
    redemptions: coupons.reduce((sum, coupon) => sum + coupon.confirmedCount, 0),
    discounted: coupons.reduce((sum, coupon) => sum + coupon.totalDiscount, 0),
  }), [coupons])

  const visible = useMemo(() => {
    const term = search.trim().toUpperCase()
    if (!term) return coupons
    return coupons.filter(coupon => coupon.code.includes(term) || (coupon.description || '').toUpperCase().includes(term))
  }, [coupons, search])

  function patch(changes: Partial<Draft>) {
    setDraft(current => ({ ...current, ...changes }))
  }

  function closeForm() {
    setFormOpen(false)
    setEditingId(null)
  }

  function openCreate() {
    setEditingId(null)
    setDraft(emptyDraft)
    setFormOpen(true)
    setFeedback(null)
  }

  function openEdit(coupon: Coupon) {
    setEditingId(coupon.id)
    setDraft({
      code: coupon.code,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      maxDiscountAmount: coupon.maxDiscountAmount != null ? String(coupon.maxDiscountAmount) : '',
      minBookingAmount: coupon.minBookingAmount != null ? String(coupon.minBookingAmount) : '',
      startsAt: toDateTimeLocal(coupon.startsAt),
      endsAt: toDateTimeLocal(coupon.endsAt),
      maxRedemptions: coupon.maxRedemptions != null ? String(coupon.maxRedemptions) : '',
      maxPerUser: coupon.maxPerUser != null ? String(coupon.maxPerUser) : '',
      isActive: coupon.isActive,
    })
    setFormOpen(true)
    setFeedback(null)
  }

  async function save() {
    setSaving(true)
    setFeedback(null)
    try {
      const response = await fetch(editingId ? `/api/admin/coupons/${editingId}` : '/api/admin/coupons', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...draft,
          startsAt: draft.startsAt ? new Date(draft.startsAt).toISOString() : '',
          endsAt: draft.endsAt ? new Date(draft.endsAt).toISOString() : '',
        }),
      })
      const result = await response.json()
      if (!response.ok) {
        setFeedback({ tone: 'error', text: result.error || 'تعذر حفظ الكوبون' })
        return
      }
      setCoupons(current => editingId
        ? current.map(coupon => coupon.id === editingId ? { ...coupon, ...result.coupon } : coupon)
        : [result.coupon, ...current])
      setDraft(emptyDraft)
      closeForm()
      setFeedback({ tone: 'success', text: editingId ? 'تم تحديث الكوبون بنجاح' : 'تم إنشاء الكوبون بنجاح' })
    } catch {
      setFeedback({ tone: 'error', text: 'حدث خطأ في الاتصال' })
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(coupon: Coupon) {
    const response = await fetch(`/api/admin/coupons/${coupon.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statusOnly: true, isActive: !coupon.isActive }),
    })
    const result = await response.json()
    if (!response.ok) {
      setFeedback({ tone: 'error', text: result.error || 'تعذر تحديث حالة الكوبون' })
      return
    }
    setCoupons(current => current.map(item => item.id === coupon.id ? { ...item, ...result.coupon } : item))
    setFeedback({ tone: 'success', text: result.coupon.isActive ? 'تم تفعيل الكوبون' : 'تم إيقاف الكوبون' })
  }

  async function remove(coupon: Coupon) {
    if (!confirm(`سيتم حذف الكوبون ${coupon.code} نهائيًا. هل تريد المتابعة؟`)) return
    const response = await fetch(`/api/admin/coupons/${coupon.id}`, { method: 'DELETE' })
    const result = await response.json()
    if (!response.ok) {
      setFeedback({ tone: 'error', text: result.error || 'تعذر حذف الكوبون' })
      return
    }
    setCoupons(current => current.filter(item => item.id !== coupon.id))
    setFeedback({ tone: 'success', text: 'تم حذف الكوبون' })
  }

  return (
    <div className="dashboard-page">
      <div className="page-hero mb-7 p-7">
        <p className="text-xs font-bold text-[#B99A63]">تحكم الإدارة</p>
        <h1 className="mt-2 text-3xl font-extrabold text-white">كوبونات الخصم</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-white/65">
          أنشئ كوبونات الخصم وتحكم في قيمتها ومدتها وعدد مرات استخدامها. يُطبَّق الخصم على إجمالي الحجز قبل الانتقال لبوابة الدفع، فيدفع طالب المساحة المبلغ بعد الخصم مباشرة.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="إجمالي الكوبونات" value={formatNumber(stats.total)} />
        <StatCard label="كوبونات فعالة الآن" value={formatNumber(stats.live)} accent />
        <StatCard label="مرات الاستخدام المؤكدة" value={formatNumber(stats.redemptions)} />
        <StatCard label="إجمالي الخصومات الممنوحة" value={`${formatNumber(stats.discounted)} ر.س`} />
      </div>

      {feedback && (
        <p className={`mb-4 rounded-xl border px-4 py-3 text-sm font-bold ${feedback.tone === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
          {feedback.text}
        </p>
      )}

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <button onClick={openCreate} className="btn-primary rounded-xl px-5 py-2.5 text-sm font-bold">كوبون جديد</button>
        <input
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="ابحث برمز الكوبون أو وصفه"
          className="field max-w-xs py-2.5"
        />
      </div>

      {formOpen && (
        <section className="mb-7 rounded-2xl border border-[#D8D1C7] bg-white p-6 shadow-[0_20px_55px_-45px_rgba(9,44,39,.55)]">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-extrabold text-[#0E3B34]">{editingId ? 'تعديل الكوبون' : 'إنشاء كوبون جديد'}</h2>
              <p className="mt-1 text-xs leading-6 text-[#5F6764]">اترك أي حقل اختياري فارغًا ليكون بلا حد.</p>
            </div>
            <button onClick={closeForm} className="rounded-lg px-3 py-1.5 text-xs font-bold text-[#5F6764] hover:bg-gray-100">إغلاق</button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="رمز الكوبون" hint="حروف إنجليزية وأرقام فقط، مثل WELCOME30">
              <input
                value={draft.code}
                onChange={event => patch({ code: event.target.value.toUpperCase() })}
                placeholder="WELCOME30"
                className="field py-2.5 tracking-widest"
                dir="ltr"
              />
            </Field>

            <Field label="وصف الكوبون (اختياري)" hint="يظهر لفريق الإدارة فقط">
              <input
                value={draft.description}
                onChange={event => patch({ description: event.target.value })}
                placeholder="حملة ترحيبية للعملاء الجدد"
                className="field py-2.5"
              />
            </Field>

            <Field label="نوع الخصم">
              <div className="grid grid-cols-2 gap-2">
                {DISCOUNT_TYPES.map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => patch({ discountType: value, maxDiscountAmount: value === 'FIXED' ? '' : draft.maxDiscountAmount })}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition-colors ${draft.discountType === value ? 'border-[#0E3B34] bg-[#F5F1E8] text-[#0E3B34]' : 'border-[#D8D1C7] bg-white text-[#5F6764] hover:bg-gray-50'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </Field>

            <Field label={draft.discountType === 'PERCENTAGE' ? 'قيمة الخصم بالنسبة المئوية' : 'قيمة الخصم بالريال'}>
              <input
                type="number"
                min="0"
                step="0.01"
                max={draft.discountType === 'PERCENTAGE' ? '100' : undefined}
                value={draft.discountValue}
                onChange={event => patch({ discountValue: event.target.value })}
                placeholder={draft.discountType === 'PERCENTAGE' ? '30' : '50'}
                className="field py-2.5"
                dir="ltr"
              />
            </Field>

            {draft.discountType === 'PERCENTAGE' && (
              <Field label="الحد الأقصى للخصم (اختياري)" hint="مثال: خصم 30% وبحد أقصى 100 ريال">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={draft.maxDiscountAmount}
                  onChange={event => patch({ maxDiscountAmount: event.target.value })}
                  placeholder="100"
                  className="field py-2.5"
                  dir="ltr"
                />
              </Field>
            )}

            <Field label="الحد الأدنى لقيمة الحجز (اختياري)" hint="لا يُقبل الكوبون إذا كان إجمالي الحجز أقل من هذه القيمة">
              <input
                type="number"
                min="0"
                step="0.01"
                value={draft.minBookingAmount}
                onChange={event => patch({ minBookingAmount: event.target.value })}
                placeholder="300"
                className="field py-2.5"
                dir="ltr"
              />
            </Field>

            <Field label="تاريخ ووقت بداية الكوبون">
              <input
                type="datetime-local"
                value={draft.startsAt}
                onChange={event => patch({ startsAt: event.target.value })}
                className="field py-2.5"
                dir="ltr"
              />
            </Field>

            <Field label="تاريخ ووقت انتهاء الكوبون">
              <input
                type="datetime-local"
                value={draft.endsAt}
                onChange={event => patch({ endsAt: event.target.value })}
                className="field py-2.5"
                dir="ltr"
              />
            </Field>

            <Field label="عدد مرات الاستخدام الإجمالي (اختياري)" hint="اتركه فارغًا ليكون غير محدود">
              <input
                type="number"
                min="1"
                step="1"
                value={draft.maxRedemptions}
                onChange={event => patch({ maxRedemptions: event.target.value })}
                placeholder="100"
                className="field py-2.5"
                dir="ltr"
              />
            </Field>

            <Field label="عدد مرات الاستخدام لكل حساب (اختياري)" hint="اتركه فارغًا ليكون غير محدود">
              <input
                type="number"
                min="1"
                step="1"
                value={draft.maxPerUser}
                onChange={event => patch({ maxPerUser: event.target.value })}
                placeholder="1"
                className="field py-2.5"
                dir="ltr"
              />
            </Field>
          </div>

          <label className="mt-4 flex w-fit items-center gap-2 rounded-xl border border-[#D8D1C7] bg-white px-4 py-2.5 text-sm font-bold text-[#33423F]">
            <input type="checkbox" checked={draft.isActive} onChange={event => patch({ isActive: event.target.checked })} />
            الكوبون فعال
          </label>

          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={save} disabled={saving} className="btn-primary rounded-xl px-6 py-2.5 text-sm font-bold disabled:opacity-60">
              {saving ? 'جاري الحفظ...' : editingId ? 'حفظ التعديلات' : 'إنشاء الكوبون'}
            </button>
            <button onClick={closeForm} className="rounded-xl border border-[#D8D1C7] bg-white px-6 py-2.5 text-sm font-bold text-[#5F6764] hover:bg-gray-50">
              إلغاء
            </button>
          </div>
        </section>
      )}

      {loading ? (
        <p className="rounded-2xl border border-[#D8D1C7] bg-white p-8 text-center text-sm text-[#5F6764]">جاري تحميل الكوبونات...</p>
      ) : visible.length === 0 ? (
        <p className="rounded-2xl border border-[#D8D1C7] bg-white p-8 text-center text-sm text-[#5F6764]">
          {coupons.length === 0 ? 'لا توجد كوبونات بعد. ابدأ بإنشاء أول كوبون خصم.' : 'لا يوجد كوبون مطابق لبحثك.'}
        </p>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {visible.map(coupon => {
            const state = lifecycle(coupon)
            const usageLimit = coupon.maxRedemptions
            const usagePercent = usageLimit ? Math.min(100, Math.round(coupon.usedCount / usageLimit * 100)) : 0
            return (
              <article key={coupon.id} className="rounded-2xl border border-[#D8D1C7] bg-white p-5 shadow-[0_20px_55px_-45px_rgba(9,44,39,.55)]">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-extrabold tracking-widest text-[#0E3B34]" dir="ltr">{coupon.code}</p>
                    {coupon.description && <p className="mt-1 text-xs leading-6 text-[#5F6764]">{coupon.description}</p>}
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs font-bold ${TONE_CLASSES[state.tone]}`}>{state.label}</span>
                </div>

                <p className="mt-4 text-2xl font-extrabold text-[#B99A63]" dir="ltr">
                  {coupon.discountType === 'PERCENTAGE' ? `${formatNumber(coupon.discountValue)}%` : `${formatNumber(coupon.discountValue)} SAR`}
                </p>
                {coupon.discountType === 'PERCENTAGE' && coupon.maxDiscountAmount != null && (
                  <p className="mt-1 text-xs font-bold text-[#5F6764]">بحد أقصى {formatNumber(coupon.maxDiscountAmount)} ر.س</p>
                )}

                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <Detail label="يبدأ" value={formatDateTime(coupon.startsAt)} />
                  <Detail label="ينتهي" value={formatDateTime(coupon.endsAt)} />
                  <Detail
                    label="الحد الأدنى للحجز"
                    value={coupon.minBookingAmount != null ? `${formatNumber(coupon.minBookingAmount)} SAR` : 'بدون حد'}
                  />
                  <Detail
                    label="لكل حساب"
                    value={coupon.maxPerUser != null ? formatNumber(coupon.maxPerUser) : 'غير محدود'}
                  />
                  <Detail label="استخدامات مؤكدة" value={formatNumber(coupon.confirmedCount)} />
                  <Detail label="إجمالي الخصم الممنوح" value={`${formatNumber(coupon.totalDiscount)} SAR`} />
                </dl>

                <div className="mt-4">
                  <div className="flex justify-between text-xs font-bold text-[#5F6764]">
                    <span>مرات الاستخدام</span>
                    <span dir="ltr">{formatNumber(coupon.usedCount)}{usageLimit ? ` / ${formatNumber(usageLimit)}` : ''}</span>
                  </div>
                  {usageLimit ? (
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                      <div className={`h-full rounded-full ${usagePercent >= 100 ? 'bg-red-500' : 'bg-[#0E3B34]'}`} style={{ width: `${usagePercent}%` }} />
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-[#5F6764]">عدد الاستخدامات غير محدود</p>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-[#D8D1C7] pt-4">
                  <button onClick={() => openEdit(coupon)} className="rounded-lg border border-[#D8D1C7] bg-white px-4 py-2 text-xs font-bold text-[#0E3B34] hover:bg-gray-50">تعديل</button>
                  <button onClick={() => toggleActive(coupon)} className="rounded-lg border border-[#D8D1C7] bg-white px-4 py-2 text-xs font-bold text-[#5F6764] hover:bg-gray-50">
                    {coupon.isActive ? 'إيقاف التفعيل' : 'تفعيل'}
                  </button>
                  <button onClick={() => remove(coupon)} className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100">حذف</button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

const DISCOUNT_TYPES: Array<[Draft['discountType'], string]> = [
  ['PERCENTAGE', 'نسبة مئوية'],
  ['FIXED', 'مبلغ ثابت بالريال'],
]

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${accent ? 'border-[#B99A63]/40 bg-[#F5F1E8]' : 'border-[#D8D1C7] bg-white'}`}>
      <p className="text-xs font-bold text-[#5F6764]">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-[#0E3B34]" dir="ltr">{value}</p>
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-[#33423F]">{label}</label>
      {children}
      {hint && <p className="mt-1.5 text-[11px] leading-5 text-[#5F6764]">{hint}</p>}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-bold text-[#5F6764]">{label}</dt>
      <dd className="mt-0.5 font-bold text-[#1B1B1B]" dir="ltr">{value}</dd>
    </div>
  )
}
