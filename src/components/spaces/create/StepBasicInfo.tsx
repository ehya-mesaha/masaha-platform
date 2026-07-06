'use client'

import { StepProps } from './types'

export default function StepBasicInfo({ form, update, types }: StepProps) {
  return (
    <div>
      <h2 className="font-display text-xl font-extrabold text-[#14201A] mb-1">المعلومات الأساسية للمساحة</h2>
      <p className="text-[#6B7566] text-sm mb-6">أدخل التفاصيل الأولية لمساحتك لتساعد المشغلين في فهم طبيعتها واستخداماتها.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#4A554D] mb-1.5">اسم المساحة</label>
          <input
            value={form.name}
            onChange={e => update('name', e.target.value)}
            placeholder="قاعة الابتكار للاجتماعات"
            className="w-full px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#4A554D] mb-1.5">تصنيف المساحة</label>
            <select
              value={form.typeId}
              onChange={e => update('typeId', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D] bg-white"
            >
              <option value="">اختر التصنيف</option>
              {types?.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4A554D] mb-1.5">السعة الاستيعابية (أشخاص)</label>
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
          <label className="block text-sm font-medium text-[#4A554D] mb-1.5">وصف المساحة</label>
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
