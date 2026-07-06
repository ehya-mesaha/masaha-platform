'use client'

const STEPS = [
  { num: 1, label: 'المعلومات الأساسية' },
  { num: 2, label: 'الموقع والعنوان' },
  { num: 3, label: 'الصور والوسائط' },
  { num: 4, label: 'المرافق والتجهيزات' },
  { num: 5, label: 'الخدمات الإضافية' },
  { num: 6, label: 'التوفر والجدول' },
  { num: 7, label: 'التسعير' },
  { num: 8, label: 'الشروط والأحكام' },
  { num: 9, label: 'المراجعة والنشر' },
]

type Props = {
  current: number
  onStepClick?: (step: number) => void
}

export default function StepIndicator({ current, onStepClick }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-[#ECE6D8] p-5">
      <h3 className="text-sm font-bold text-[#14201A] mb-4">خطوات الإضافة</h3>
      <div className="space-y-1">
        {STEPS.map(s => {
          const done = current > s.num
          const active = current === s.num
          return (
            <button
              key={s.num}
              type="button"
              onClick={() => done && onStepClick?.(s.num)}
              disabled={!done}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-start ${
                active
                  ? 'bg-[#1B3A2D] text-white font-semibold'
                  : done
                  ? 'text-[#1B3A2D] hover:bg-[#F7F3EB] cursor-pointer font-medium'
                  : 'text-[#6B7566] cursor-default'
              }`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                active
                  ? 'bg-[#C49A3C] text-white'
                  : done
                  ? 'bg-[#1B3A2D]/10 text-[#1B3A2D]'
                  : 'bg-[#F7F3EB] text-[#6B7566]'
              }`}>
                {done ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : s.num}
              </span>
              <span className="truncate">{s.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
