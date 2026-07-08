'use client'

import { StepProps, DAY_NAMES } from './types'

export default function StepSchedule({ form, update }: StepProps) {
  const nextDays = Array.from({ length: 14 }, (_, index) => {
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

  return (
    <div>
      <h2 className="font-display text-xl font-extrabold text-[#14201A] mb-1">التوفر والجدول</h2>
      <p className="text-[#6B7566] text-sm mb-6">حدد الأيام والأوقات التي تكون مساحتك فيها متاحة للحجز، بالإضافة إلى قواعد الحجز الأساسية.</p>

      {/* Weekly schedule */}
      <div className="rounded-xl border border-[#ECE6D8] overflow-hidden mb-6">
        <div className="grid grid-cols-[1fr_80px_1fr_1fr] bg-[#F7F3EB]/60 px-4 py-2.5 text-[11px] font-bold text-[#6B7566] tracking-wide border-b border-[#ECE6D8]">
          <span>اليوم</span>
          <span className="text-center">متاح</span>
          <span className="text-center">من</span>
          <span className="text-center">إلى</span>
        </div>
        {form.workingHours.map(wh => (
          <div
            key={wh.dayOfWeek}
            className={`grid grid-cols-[1fr_80px_1fr_1fr] items-center px-4 py-3 border-b border-[#ECE6D8] last:border-b-0 ${
              !wh.isOpen ? 'bg-gray-50/50' : ''
            }`}
          >
            <span className={`text-sm font-medium ${wh.isOpen ? 'text-[#14201A]' : 'text-[#6B7566]'}`}>
              {DAY_NAMES[wh.dayOfWeek]}
            </span>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => toggleDay(wh.dayOfWeek)}
                className={`w-10 h-6 rounded-full transition-colors relative ${
                  wh.isOpen ? 'bg-[#1B3A2D]' : 'bg-gray-300'
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
                    className="px-2 py-1.5 rounded-lg border border-[#E8E3D8] text-xs focus:outline-none focus:border-[#1B3A2D] w-28"
                  />
                </div>
                <div className="flex justify-center">
                  <input
                    type="time"
                    value={wh.closeTime}
                    onChange={e => updateTime(wh.dayOfWeek, 'closeTime', e.target.value)}
                    className="px-2 py-1.5 rounded-lg border border-[#E8E3D8] text-xs focus:outline-none focus:border-[#1B3A2D] w-28"
                  />
                </div>
              </>
            ) : (
              <span className="col-span-2 text-center text-xs text-[#6B7566]">(يوم راحة) مغلق</span>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#E8E3D8] bg-white p-4 mb-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-[#14201A]">معاينة التقويم</h3>
            <p className="text-xs text-[#6B7566] mt-1">هذه الأيام هي التي سيستطيع المستأجر اختيارها عند طلب الحجز.</p>
          </div>
          <span className="rounded-full bg-[#1B3A2D]/10 px-3 py-1 text-xs font-bold text-[#1B3A2D]">الأسبوعان القادمان</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {nextDays.map(({ date, hours }) => {
            const isOpen = Boolean(hours?.isOpen)
            return (
              <div
                key={date.toISOString()}
                className={`rounded-xl border p-3 text-center ${
                  isOpen
                    ? 'border-[#1B3A2D]/15 bg-[#1B3A2D]/5'
                    : 'border-[#E8E3D8] bg-[#F7F3EB]/60'
                }`}
              >
                <p className={`text-xs font-bold ${isOpen ? 'text-[#1B3A2D]' : 'text-[#6B7566]'}`}>
                  {DAY_NAMES[date.getDay()]}
                </p>
                <p className="text-lg font-extrabold text-[#14201A] mt-1">
                  {date.getDate().toLocaleString('ar-SA')}
                </p>
                <p className={`text-[11px] mt-1 ${isOpen ? 'text-[#1B3A2D]' : 'text-[#9A9488]'}`}>
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
          <label className="block text-sm font-medium text-[#4A554D] mb-1.5">الحد الأدنى لمدة الحجز</label>
          <select
            value={form.minBookingHours}
            onChange={e => update('minBookingHours', e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D] bg-white"
          >
            <option value="1">ساعة واحدة</option>
            <option value="2">ساعتان</option>
            <option value="3">3 ساعات</option>
            <option value="4">4 ساعات</option>
            <option value="8">يوم كامل</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#4A554D] mb-1.5">مدة أقصى للحجز المسبق</label>
          <select
            value={form.maxAdvanceBookingDays}
            onChange={e => update('maxAdvanceBookingDays', e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D] bg-white"
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
