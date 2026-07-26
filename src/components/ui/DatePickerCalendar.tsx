'use client'

import { useMemo, useState } from 'react'

type DatePickerCalendarProps = {
  value: string
  onChange: (value: string) => void
  minDate?: string
  maxDate?: string
  isDateEnabled?: (date: Date) => boolean
}

const DAY_LABELS = ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت']
const MONTH_FORMATTER = new Intl.DateTimeFormat('ar-SA-u-nu-latn', { month: 'long', year: 'numeric' })
const DAY_FORMATTER = new Intl.NumberFormat('en-US')

function toDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function toValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export default function DatePickerCalendar({
  value,
  onChange,
  minDate,
  maxDate,
  isDateEnabled,
}: DatePickerCalendarProps) {
  const today = startOfDay(new Date())
  const min = minDate ? toDate(minDate) : today
  const max = maxDate ? toDate(maxDate) : null
  const selectedDate = value ? toDate(value) : null
  const [visibleMonth, setVisibleMonth] = useState(() => selectedDate || min)

  const days = useMemo(() => {
    const first = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1)
    const monthStartOffset = first.getDay()
    const gridStart = new Date(first)
    gridStart.setDate(first.getDate() - monthStartOffset)

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(gridStart)
      date.setDate(gridStart.getDate() + index)
      return date
    })
  }, [visibleMonth])

  function isDisabled(date: Date) {
    const normalized = startOfDay(date)
    if (normalized < startOfDay(min)) return true
    if (max && normalized > startOfDay(max)) return true
    if (isDateEnabled && !isDateEnabled(date)) return true
    return false
  }

  function moveMonth(direction: number) {
    setVisibleMonth(current => new Date(current.getFullYear(), current.getMonth() + direction, 1))
  }

  return (
    <div className="rounded-2xl border border-[#E8E3D8] bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => moveMonth(1)}
          className="w-9 h-9 rounded-xl border border-[#E8E3D8] text-[#1B3A2D] hover:bg-[#F7F3EB] transition-colors"
          aria-label="الشهر التالي"
        >
          ‹
        </button>
        <div className="text-sm font-extrabold text-[#14201A]">
          {MONTH_FORMATTER.format(visibleMonth)}
        </div>
        <button
          type="button"
          onClick={() => moveMonth(-1)}
          className="w-9 h-9 rounded-xl border border-[#E8E3D8] text-[#1B3A2D] hover:bg-[#F7F3EB] transition-colors"
          aria-label="الشهر السابق"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-[#6B7566] mb-1">
        {DAY_LABELS.map(day => (
          <span key={day} className="py-1">{day}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map(date => {
          const dateValue = toValue(date)
          const inMonth = date.getMonth() === visibleMonth.getMonth()
          const selected = value === dateValue
          const disabled = isDisabled(date)

          return (
            <button
              key={dateValue}
              type="button"
              onClick={() => !disabled && onChange(dateValue)}
              disabled={disabled}
              className={`aspect-square rounded-xl text-sm font-bold transition-colors ${
                selected
                  ? 'bg-[#1B3A2D] text-white shadow-sm'
                  : disabled
                    ? 'text-[#C9C2B3] bg-[#F7F3EB]/40 cursor-not-allowed'
                    : inMonth
                      ? 'text-[#14201A] hover:bg-[#1B3A2D]/10'
                      : 'text-[#B5B0A2] hover:bg-[#F7F3EB]'
              }`}
            >
              {DAY_FORMATTER.format(date.getDate())}
            </button>
          )
        })}
      </div>
    </div>
  )
}
