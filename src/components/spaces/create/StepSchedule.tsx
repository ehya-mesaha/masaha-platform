'use client'

import { StepProps, DAY_NAMES } from './types'

export default function StepSchedule({ form, update }: StepProps) {
  const nextDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() + index)
    const hours = form.workingHours.find(wh => wh.dayOfWeek === date.getDay())
    return { date, hours }
  })

  function toggleDay(dayOfWeek: number) {
    const updated = form.workingHours.map(wh =>
      wh.dayOfWeek === dayOfWeek ? { ...wh, isOpen: !wh.isOpen } : wh,
    )
    update('workingHours', updated)
  }

  function updateTime(dayOfWeek: number, field: 'openTime' | 'closeTime', value: string) {
    const updated = form.workingHours.map(wh =>
      wh.dayOfWeek === dayOfWeek ? { ...wh, [field]: value } : wh,
    )
    update('workingHours', updated)
  }

  function applyPreset(preset: 'weekdays' | 'everyday') {
    update('workingHours', form.workingHours.map(day => ({
      ...day,
      isOpen: preset === 'everyday' || day.dayOfWeek < 5,
    })))
  }

  function copyFirstOpenHours() {
    const source = form.workingHours.find(day => day.isOpen)
    if (!source) return
    update('workingHours', form.workingHours.map(day => (
      day.isOpen ? { ...day, openTime: source.openTime, closeTime: source.closeTime } : day
    )))
  }

  const openDaysCount = form.workingHours.filter(day => day.isOpen).length

  return (
    <div>
      <h2 className="font-display text-xl font-extrabold text-[#1B1B1B] mb-1">التوفر والجدول</h2>
      <p className="text-[#5F6764] text-sm mb-6">حدد يومًا متاحًا واحدًا على الأقل، ثم اضبط الساعات وقواعد الحجز المباشر.</p>

      <div className="mb-4 flex flex-col justify-between gap-3 rounded-2xl border border-[#D8D1C7] bg-[#F5F1E8] p-4 sm:flex-row sm:items-center">
        <div>
          <strong className="text-sm text-[#1B1B1B]">{openDaysCount} أيام متاحة أسبوعيًا</strong>
          <p className="mt-1 text-xs text-[#5F6764]">استخدم الإعدادات السريعة ثم عدّل أي يوم بشكل مستقل.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => applyPreset('weekdays')} className="rounded-lg border border-[#D8D1C7] bg-white px-3 py-2 text-[11px] font-bold text-[#0E3B34] hover:border-[#B99A63]">أيام العمل</button>
          <button type="button" onClick={() => applyPreset('everyday')} className="rounded-lg border border-[#D8D1C7] bg-white px-3 py-2 text-[11px] font-bold text-[#0E3B34] hover:border-[#B99A63]">كل الأسبوع</button>
          <button type="button" onClick={copyFirstOpenHours} className="rounded-lg bg-[#0E3B34] px-3 py-2 text-[11px] font-bold text-white hover:bg-[#092C27]">توحيد الساعات</button>
        </div>
      </div>

      {/* Weekly schedule */}
      <div className="rounded-xl border border-[#D8D1C7] overflow-hidden mb-6">
        <div className="hidden grid-cols-[1fr_80px_1fr_1fr] bg-[#F5F1E8]/60 px-4 py-2.5 text-[11px] font-bold text-[#5F6764] tracking-wide border-b border-[#D8D1C7] sm:grid">
          <span>اليوم</span>
          <span className="text-center">متاح</span>
          <span className="text-center">من</span>
          <span className="text-center">إلى</span>
        </div>
        {form.workingHours.map(wh => (
          <div
            key={wh.dayOfWeek}
            className={`grid grid-cols-[1fr_auto] gap-3 items-center px-4 py-3 border-b border-[#D8D1C7] last:border-b-0 sm:grid-cols-[1fr_80px_1fr_1fr] ${
              !wh.isOpen ? 'bg-gray-50/50' : ''
            }`}
          >
            <span className={`text-sm font-medium ${wh.isOpen ? 'text-[#1B1B1B]' : 'text-[#5F6764]'}`}>
              {DAY_NAMES[wh.dayOfWeek]}
            </span>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => toggleDay(wh.dayOfWeek)}
                aria-label={`${wh.isOpen ? 'إغلاق' : 'فتح'} يوم ${DAY_NAMES[wh.dayOfWeek]}`}
                aria-pressed={wh.isOpen}
                className={`w-10 h-6 rounded-full transition-colors relative ${
                  wh.isOpen ? 'bg-[#0E3B34]' : 'bg-gray-300'
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                  wh.isOpen ? 'start-5' : 'start-1'
                }`} />
              </button>
            </div>
            {wh.isOpen ? (
              <>
                <div className="flex justify-center">
                  <input
                    type="time"
                    value={wh.openTime}
                    onChange={e => updateTime(wh.dayOfWeek, 'openTime', e.target.value)}
                    className="w-full rounded-lg border border-[#D8D1C7] px-2 py-1.5 text-xs focus:border-[#0E3B34] focus:outline-none sm:w-28"
                    dir="ltr"
                  />
                </div>
                <div className="flex justify-center">
                  <input
                    type="time"
                    value={wh.closeTime}
                    onChange={e => updateTime(wh.dayOfWeek, 'closeTime', e.target.value)}
                    className="w-full rounded-lg border border-[#D8D1C7] px-2 py-1.5 text-xs focus:border-[#0E3B34] focus:outline-none sm:w-28"
                    dir="ltr"
                  />
                </div>
              </>
            ) : (
              <span className="col-span-2 text-center text-xs text-[#5F6764]">(يوم راحة) مغلق</span>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#D8D1C7] bg-white p-4 mb-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-[#1B1B1B]">معاينة التقويم</h3>
            <p className="text-xs text-[#5F6764] mt-1">معاينة واضحة للأيام التي يستطيع طالب المساحة حجزها مباشرة.</p>
          </div>
          <span className="rounded-full bg-[#0E3B34]/10 px-3 py-1 text-xs font-bold text-[#0E3B34]">الأسبوع القادم</span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {nextDays.map(({ date, hours }) => {
            const isOpen = Boolean(hours?.isOpen)
            return (
              <div
                key={date.toISOString()}
                className={`rounded-xl border p-3 text-center ${
                  isOpen
                    ? 'border-[#0E3B34]/15 bg-[#0E3B34]/5'
                    : 'border-[#D8D1C7] bg-[#F5F1E8]/60'
                }`}
              >
                <p className={`text-xs font-bold ${isOpen ? 'text-[#0E3B34]' : 'text-[#5F6764]'}`}>
                  {DAY_NAMES[date.getDay()]}
                </p>
                <p className="text-lg font-extrabold text-[#1B1B1B] mt-1">
                  {date.getDate().toLocaleString('en-US')}
                </p>
                <p className={`time-value text-[11px] mt-1 ${isOpen ? 'text-[#0E3B34]' : 'text-[#9A9488]'}`}>
                  {isOpen && hours ? `${hours.openTime} - ${hours.closeTime}` : 'مغلق'}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Booking rules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#3F4B47] mb-1.5">الحد الأدنى لمدة الحجز</label>
          <select
            value={form.minBookingHours}
            onChange={e => update('minBookingHours', e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-[#D8D1C7] text-sm focus:outline-none focus:border-[#0E3B34] bg-white"
          >
            <option value="1">ساعة واحدة</option>
            <option value="2">ساعتان</option>
            <option value="3">3 ساعات</option>
            <option value="4">4 ساعات</option>
            <option value="8">8 ساعات</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#3F4B47] mb-1.5">مدة أقصى للحجز المسبق</label>
          <select
            value={form.maxAdvanceBookingDays}
            onChange={e => update('maxAdvanceBookingDays', e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-[#D8D1C7] text-sm focus:outline-none focus:border-[#0E3B34] bg-white"
          >
            <option value="30">شهر واحد</option>
            <option value="60">شهران</option>
            <option value="90">3 أشهر</option>
            <option value="180">6 أشهر</option>
            <option value="365">سنة</option>
          </select>
        </div>
      </div>
    </div>
  )
}
