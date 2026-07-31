'use client'

import { useMemo, useState } from 'react'

type BaseProps = {
  minDate?: string
  maxDate?: string
  isDateEnabled?: (date: Date) => boolean
  dateStatuses?: Record<string, 'available' | 'unavailable'>
}
type SingleProps = BaseProps & { multiple?: false; value: string; onChange: (value: string) => void }
type MultiProps = BaseProps & { multiple: true; value: string[]; onChange: (dates: string[]) => void }
type DatePickerCalendarProps = SingleProps | MultiProps

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

export default function DatePickerCalendar(props: DatePickerCalendarProps) {
  const { minDate, maxDate, isDateEnabled, dateStatuses = {} } = props
  const today = startOfDay(new Date())
  const min = minDate ? toDate(minDate) : today
  const max = maxDate ? toDate(maxDate) : null
  const selectedValues = props.multiple ? props.value : (props.value ? [props.value] : [])
  const selected = new Set(selectedValues)
  const earliestSelected = [...selectedValues].sort()[0]
  const [visibleMonth, setVisibleMonth] = useState(() => (earliestSelected ? toDate(earliestSelected) : min))

  function handleSelect(dateValue: string) {
    if (props.multiple) {
      const next = selected.has(dateValue) ? props.value.filter(date => date !== dateValue) : [...props.value, dateValue].sort()
      props.onChange(next)
    } else {
      props.onChange(dateValue)
    }
  }

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
    <div className="booking-calendar rounded-lg border border-[#D8D1C7] bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => moveMonth(1)}
          className="w-9 h-9 rounded-xl border border-[#D8D1C7] text-[#0E3B34] hover:bg-[#F5F1E8] transition-colors"
          aria-label="الشهر التالي"
        >
          ‹
        </button>
        <div className="text-sm font-extrabold text-[#1B1B1B]">
          {MONTH_FORMATTER.format(visibleMonth)}
        </div>
        <button
          type="button"
          onClick={() => moveMonth(-1)}
          className="w-9 h-9 rounded-xl border border-[#D8D1C7] text-[#0E3B34] hover:bg-[#F5F1E8] transition-colors"
          aria-label="الشهر السابق"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-[#5F6764] mb-1">
        {DAY_LABELS.map(day => (
          <span key={day} className="py-1">{day}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map(date => {
          const dateValue = toValue(date)
          const inMonth = date.getMonth() === visibleMonth.getMonth()
          const isSelected = selected.has(dateValue)
          const disabled = isDisabled(date)
          const status = dateStatuses[dateValue]

          return (
            <button
              key={dateValue}
              type="button"
              onClick={() => !disabled && handleSelect(dateValue)}
              disabled={disabled}
              aria-label={`${dateValue}${status === 'available' ? '، متاح' : status === 'unavailable' ? '، غير متاح' : ''}`}
              className={`relative aspect-square rounded-lg text-sm font-bold transition-all ${
                isSelected
                  ? status === 'unavailable'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-[#0E3B34] text-white shadow-sm'
                  : disabled
                    ? 'text-[#C9C2B3] bg-[#F5F1E8]/40 cursor-not-allowed'
                    : inMonth
                      ? 'text-[#1B1B1B] hover:bg-[#0E3B34]/10'
                      : 'text-[#B5B0A2] hover:bg-[#F5F1E8]'
              }`}
            >
              {DAY_FORMATTER.format(date.getDate())}
              {status && (
                <span className={`absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${status === 'available' ? 'bg-[#B99A63]' : 'bg-red-300'} ${isSelected ? 'ring-1 ring-white/70' : ''}`} />
              )}
            </button>
          )
        })}
      </div>
      {Object.keys(dateStatuses).length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-[#EEE8DC] pt-3 text-[10px] font-bold text-[#5F6764]">
          <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#0E3B34]" /> متاح ومؤكد</span>
          <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-red-500" /> غير متاح</span>
        </div>
      )}
    </div>
  )
}
