'use client'

import { StepProps } from './types'

export default function StepBasicInfo({ form, update, types, categoriesLoading, categoriesError }: StepProps) {
  const hasTypes = Boolean(types?.length)

  return (
    <div>
      <h2 className="font-display text-xl font-extrabold text-[#14201A] mb-1">المعلومات الأساسية للمساحة</h2>
      <p className="text-[#6B7566] text-sm mb-6">أدخل التفاصيل الأولية لمساحتك لتساعد طالبي المساحات في فهم طبيعتها واستخداماتها.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#4A554D] mb-1.5">اسم المساحة <Required /></label>
          <input
            value={form.name}
            onChange={e => update('name', e.target.value)}
            placeholder="قاعة الابتكار للاجتماعات"
            className="w-full px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
          />
        </div>

        <div className="rounded-2xl border border-[#E8E1D3] bg-[#F7F3EB] p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <label className="block text-sm font-extrabold text-[#1B3A2D]">عدد القاعات المماثلة <Required /></label>
              <p className="mt-1 text-xs leading-6 text-[#6B7566]">سننشئ وحدة مستقلة لكل قاعة لإدارة التوفر ومنع تعارض الحجوزات.</p>
            </div>
            <div className="flex w-full items-center overflow-hidden rounded-xl border border-[#D9D1C2] bg-white sm:w-44" dir="ltr">
              <button
                type="button"
                onClick={() => update('identicalUnitsCount', String(Math.max(1, Number(form.identicalUnitsCount || 1) - 1)))}
                className="grid h-11 w-12 place-items-center text-xl font-bold text-[#1B3A2D] hover:bg-[#F7F3EB]"
                aria-label="تقليل عدد القاعات"
              >−</button>
              <input
                type="number"
                min="1"
                max="100"
                value={form.identicalUnitsCount}
                onChange={event => update('identicalUnitsCount', String(Math.max(1, Math.min(100, Number(event.target.value) || 1))))}
                className="h-11 min-w-0 flex-1 border-x border-[#E8E1D3] text-center font-extrabold outline-none"
              />
              <button
                type="button"
                onClick={() => update('identicalUnitsCount', String(Math.min(100, Number(form.identicalUnitsCount || 1) + 1)))}
                className="grid h-11 w-12 place-items-center text-xl font-bold text-[#1B3A2D] hover:bg-[#F7F3EB]"
                aria-label="زيادة عدد القاعات"
              >+</button>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {Array.from({ length: Math.min(6, Number(form.identicalUnitsCount) || 1) }, (_, index) => (
              <span key={index} className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#1B3A2D]">قاعة {101 + index}</span>
            ))}
            {Number(form.identicalUnitsCount) > 6 && <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#9A7424]">+{Number(form.identicalUnitsCount) - 6}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-[#4A554D] mb-1.5">تصنيف المساحة <Required /></label>
            <select
              value={form.typeId}
              onChange={e => update('typeId', e.target.value)}
              disabled={categoriesLoading || !hasTypes}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D] bg-white"
            >
              {(categoriesLoading || !hasTypes) && (
                <option value="">
                  {categoriesLoading ? 'جاري تحميل التصنيفات...' : 'لا توجد تصنيفات متاحة'}
                </option>
              )}
              <option value="">اختر التصنيف</option>
              {types?.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            {categoriesError && (
              <p className="mt-1.5 text-xs text-red-600">{categoriesError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4A554D] mb-1.5">السعة الاستيعابية (أشخاص) <Required /></label>
            <div className="flex items-center border border-[#E8E3D8] rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => update('capacity', String(Math.max(1, Number(form.capacity || 1) - 1)))}
                className="px-3 py-2.5 text-[#4A554D] hover:bg-[#F7F3EB] transition-colors text-lg"
              >
                −
              </button>
              <input
                type="number"
                value={form.capacity}
                onChange={e => update('capacity', e.target.value)}
                className="flex-1 text-center py-2.5 text-sm focus:outline-none border-x border-[#E8E3D8] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min={1}
                placeholder="12"
              />
              <button
                type="button"
                onClick={() => update('capacity', String(Number(form.capacity || 0) + 1))}
                className="px-3 py-2.5 text-[#4A554D] hover:bg-[#F7F3EB] transition-colors text-lg"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4A554D] mb-1.5">وصف المساحة <Required /></label>
          <textarea
            value={form.description}
            onChange={e => update('description', e.target.value)}
            rows={4}
            placeholder="قاعة اجتماعات حديثة ومجهزة بأحدث التقنيات، مثالية لورش العمل والاجتماعات التنفيذية..."
            className="w-full px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D] resize-none"
          />
        </div>
      </div>
    </div>
  )
}

function Required() {
  return <span className="text-[#B44A3C]" aria-label="مطلوب">*</span>
}
