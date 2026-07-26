'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

type SpaceTypeOption = { id: string; name: string }

type Props = {
  types: SpaceTypeOption[]
}

const initialForm = {
  typeId: '',
  spaceType: '',
  city: '',
  district: '',
  expectedDate: '',
  capacity: '',
  budgetMin: '',
  budgetMax: '',
  details: '',
}

export default function SpaceNeedRequestForm({ types }: Props) {
  const router = useRouter()
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const selectedTypeName = useMemo(
    () => types.find(type => type.id === form.typeId)?.name || '',
    [form.typeId, types]
  )

  function updateField(name: keyof typeof initialForm, value: string) {
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'typeId' && value ? { spaceType: '' } : {}),
    }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const res = await fetch('/api/space-needs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          spaceType: selectedTypeName || form.spaceType,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'تعذر إرسال الطلب')
        return
      }
      setMessage('تم إرسال احتياجك بنجاح. سيظهر الطلب لدى فريق مساحة لمراجعته.')
      setForm(initialForm)
      router.refresh()
    } catch {
      setError('حدث خطأ في الاتصال. حاول مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="premium-card overflow-hidden animate-in">
      <div className="h-1.5 bg-gradient-to-l from-[#0E3B34] via-[#B99A63] to-[#0E3B34]" />
      <div className="p-6 lg:p-7">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D8D1C7] bg-[#FAF8F3] text-[#B99A63]">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.77 59.77 0 0121.485 12 59.768 59.768 0 013.27 20.876L6 12zm0 0h7.5" />
            </svg>
          </div>
          <p className="text-xs font-bold text-[#B99A63]">تقديم احتياج مساحة</p>
          <h1 className="mt-1 text-2xl font-extrabold text-[#1B1B1B]">لم تجد المساحة المناسبة؟</h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[#5F6764]">
            قدم احتياجك وسيقوم فريقنا بتوفير خيارات مطابقة لمتطلباتك خلال 24 ساعة.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
            {message}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-[#3F4B47]">نوع المساحة المطلوبة</span>
            <select
              value={form.typeId}
              onChange={e => updateField('typeId', e.target.value)}
              className="field bg-white"
            >
              <option value="">اختر نوع المساحة</option>
              {types.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-[#3F4B47]">نوع آخر إن لم يكن موجودا</span>
            <input
              value={form.spaceType}
              onChange={e => updateField('spaceType', e.target.value)}
              disabled={Boolean(form.typeId)}
              placeholder="مثال: قاعة ورشة عمل"
              className="field disabled:bg-gray-50 disabled:text-gray-400"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-[#3F4B47]">المدينة</span>
            <input
              value={form.city}
              onChange={e => updateField('city', e.target.value)}
              placeholder="مثال: الرياض"
              className="field"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-[#3F4B47]">الحي المفضل</span>
            <input
              value={form.district}
              onChange={e => updateField('district', e.target.value)}
              placeholder="مثال: حي الملقا"
              className="field"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-[#3F4B47]">التاريخ المتوقع</span>
            <input
              type="date"
              value={form.expectedDate}
              onChange={e => updateField('expectedDate', e.target.value)}
              className="field"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-[#3F4B47]">السعة المطلوبة</span>
            <input
              type="number"
              min={1}
              value={form.capacity}
              onChange={e => updateField('capacity', e.target.value)}
              placeholder="عدد الأشخاص"
              className="field"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-[#3F4B47]">الميزانية من (ر.س / ساعة)</span>
            <input
              type="number"
              min={0}
              value={form.budgetMin}
              onChange={e => updateField('budgetMin', e.target.value)}
              placeholder="مثال: 100"
              className="field"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-[#3F4B47]">الميزانية إلى (ر.س / ساعة)</span>
            <input
              type="number"
              min={0}
              value={form.budgetMax}
              onChange={e => updateField('budgetMax', e.target.value)}
              placeholder="مثال: 200"
              className="field"
            />
          </label>
        </div>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-bold text-[#3F4B47]">تفاصيل إضافية (اختياري)</span>
          <textarea
            value={form.details}
            onChange={e => updateField('details', e.target.value)}
            rows={4}
            placeholder="اذكر أي متطلبات خاصة مثل: توفر شاشة عرض ذكية، ضيافة معينة، أو تجهيزات محددة..."
            className="field resize-none"
          />
        </label>

        <div className="mt-5 flex flex-col gap-3 border-t border-[#D8D1C7] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#5F6764]">سيتم التواصل معك عبر البريد الإلكتروني المسجل.</p>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary inline-flex items-center justify-center rounded-xl px-7 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
          </button>
        </div>
      </div>
    </form>
  )
}
