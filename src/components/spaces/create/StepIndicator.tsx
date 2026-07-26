'use client'

import { STEP_LABELS } from './validation'

type Props = {
  current: number
  completed: Set<number>
  furthestStep: number
  onStepClick?: (step: number) => void
}

export default function StepIndicator({ current, completed, furthestStep, onStepClick }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-[#D8D1C7] p-5">
      <h3 className="text-sm font-bold text-[#1B1B1B] mb-4">خطوات الإضافة</h3>
      <div className="space-y-1">
        {STEP_LABELS.map((label, index) => {
          const num = index + 1
          const done = completed.has(num)
          const active = current === num
          const reachable = num <= furthestStep
          return (
            <button
              key={num}
              type="button"
              onClick={() => reachable && onStepClick?.(num)}
              disabled={!reachable}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-start ${
                active
                  ? 'bg-[#0E3B34] text-white font-semibold'
                  : reachable
                  ? 'text-[#0E3B34] hover:bg-[#F5F1E8] cursor-pointer font-medium'
                  : 'text-[#5F6764] cursor-default'
              }`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                active
                  ? 'bg-[#B99A63] text-white'
                  : done
                  ? 'bg-[#0E3B34]/10 text-[#0E3B34]'
                  : 'bg-[#F5F1E8] text-[#5F6764]'
              }`}>
                {done ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : num}
              </span>
              <span className="truncate">{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
