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
    <div className="bg-white rounded-2xl border border-[#ECE6D8] p-5">
      <h3 className="text-sm font-bold text-[#14201A] mb-4">خطوات الإضافة</h3>
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
                  ? 'bg-[#1B3A2D] text-white font-semibold'
                  : reachable
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
