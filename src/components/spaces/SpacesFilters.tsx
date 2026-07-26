'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type SpaceType = { id: string; name: string }

type FilterParams = {
  city?: string
  typeId?: string
  type?: string
  minPrice?: string
  maxPrice?: string
  capacity?: string
  date?: string
  startTime?: string
  endTime?: string
  days?: string
  pricePeriod?: string
  sort?: string
}

type Props = {
  types: SpaceType[]
  params: FilterParams
}

const DAY_OPTIONS = [
  { value: '0', label: 'الأحد' },
  { value: '1', label: 'الإثنين' },
  { value: '2', label: 'الثلاثاء' },
  { value: '3', label: 'الأربعاء' },
  { value: '4', label: 'الخميس' },
  { value: '5', label: 'الجمعة' },
  { value: '6', label: 'السبت' },
]

const MAX_PRICE = 5000

export default function SpacesFilters({ types, params }: Props) {
  const router = useRouter()
  const initialDays = useMemo(() => new Set((params.days || '').split(',').filter(Boolean)), [params.days])
  const [city, setCity] = useState(params.city || '')
  const [typeId, setTypeId] = useState(params.typeId || '')
  const [minPrice, setMinPrice] = useState(Number(params.minPrice || 0))
  const [maxPrice, setMaxPrice] = useState(Number(params.maxPrice || MAX_PRICE))
  const [capacity, setCapacity] = useState(params.capacity || '')
  const [date, setDate] = useState(params.date || '')
  const [startTime, setStartTime] = useState(params.startTime || '')
  const [endTime, setEndTime] = useState(params.endTime || '')
  const [pricePeriod, setPricePeriod] = useState(params.pricePeriod || '')
  const [sort, setSort] = useState(params.sort || 'newest')
  const [selectedDays, setSelectedDays] = useState(initialDays)

  function toggleDay(value: string) {
    setSelectedDays(prev => {
      const next = new Set(prev)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return next
    })
  }

  function applyFilters() {
    const query = new URLSearchParams()
    if (city.trim()) query.set('city', city.trim())
    if (typeId) query.set('typeId', typeId)
    if (minPrice > 0) query.set('minPrice', String(minPrice))
    if (maxPrice < MAX_PRICE) query.set('maxPrice', String(maxPrice))
    if (capacity) query.set('capacity', capacity)
    if (date) query.set('date', date)
    if (startTime) query.set('startTime', startTime)
    if (endTime) query.set('endTime', endTime)
    if (pricePeriod) query.set('pricePeriod', pricePeriod)
    if (sort && sort !== 'newest') query.set('sort', sort)
    if (selectedDays.size > 0) query.set('days', Array.from(selectedDays).sort().join(','))
    router.push(`/spaces${query.toString() ? `?${query.toString()}` : ''}`)
  }

  function updateMin(value: number) {
    setMinPrice(Math.max(0, Math.min(value, maxPrice)))
  }

  function updateMax(value: number) {
    setMaxPrice(Math.min(MAX_PRICE, Math.max(value, minPrice)))
  }

  return (
    <div className="premium-card p-5 sticky top-20 animate-in">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-[#1B1B1B]">فلترة النتائج</h3>
          <p className="mt-1 text-xs text-[#5F6764]">اختر ما يناسب احتياجك بدقة</p>
        </div>
        <Link href="/spaces" className="text-xs font-semibold text-[#B99A63] hover:text-[#0E3B34]">
          مسح
        </Link>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-[#3F4B47] mb-1.5">المدينة أو الحي</label>
          <input
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="الرياض، جدة..."
            className="field"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#3F4B47] mb-1.5">نوع المساحة</label>
          <select value={typeId} onChange={e => setTypeId(e.target.value)} className="field bg-white">
            <option value="">جميع الأنواع</option>
            {types.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-bold text-[#3F4B47]">السعر</label>
            <span className="text-[11px] font-semibold text-[#0E3B34]">
              {minPrice.toLocaleString('en-US')} - {maxPrice.toLocaleString('en-US')} ر.س
            </span>
          </div>
          <div className="rounded-2xl border border-[#D8D1C7] bg-[#FAF8F3] p-3">
            <input
              type="range"
              min={0}
              max={MAX_PRICE}
              step={50}
              value={minPrice}
              onChange={e => updateMin(Number(e.target.value))}
              className="w-full accent-[#0E3B34]"
              aria-label="الحد الأدنى للسعر"
            />
            <input
              type="range"
              min={0}
              max={MAX_PRICE}
              step={50}
              value={maxPrice}
              onChange={e => updateMax(Number(e.target.value))}
              className="mt-1 w-full accent-[#B99A63]"
              aria-label="الحد الأعلى للسعر"
            />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <input
              type="number"
              min={0}
              value={minPrice}
              onChange={e => updateMin(Number(e.target.value || 0))}
              className="field py-2 text-xs"
              aria-label="أقل سعر"
            />
            <input
              type="number"
              min={0}
              value={maxPrice}
              onChange={e => updateMax(Number(e.target.value || 0))}
              className="field py-2 text-xs"
              aria-label="أعلى سعر"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-bold text-[#3F4B47] mb-1.5">التسعير</label>
            <select value={pricePeriod} onChange={e => setPricePeriod(e.target.value)} className="field bg-white">
              <option value="">الكل</option>
              <option value="hour">بالساعة</option>
              <option value="day">باليوم</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#3F4B47] mb-1.5">السعة</label>
            <input
              type="number"
              min={1}
              value={capacity}
              onChange={e => setCapacity(e.target.value)}
              placeholder="عدد الأشخاص"
              className="field"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#3F4B47] mb-2">الأيام المتاحة</label>
          <div className="grid grid-cols-2 gap-2">
            {DAY_OPTIONS.map(day => {
              const active = selectedDays.has(day.value)
              return (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                    active
                      ? 'border-[#0E3B34] bg-[#0E3B34] text-white shadow-sm'
                      : 'border-[#D8D1C7] bg-white text-[#3F4B47] hover:border-[#B99A63]'
                  }`}
                >
                  {day.label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#3F4B47] mb-1.5">تاريخ محدد</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="field" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-bold text-[#3F4B47] mb-1.5">من</label>
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="field" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#3F4B47] mb-1.5">إلى</label>
            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="field" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#3F4B47] mb-1.5">الترتيب</label>
          <select value={sort} onChange={e => setSort(e.target.value)} className="field bg-white">
            <option value="newest">الأحدث</option>
            <option value="priceAsc">الأقل سعراً</option>
            <option value="priceDesc">الأعلى سعراً</option>
            <option value="capacityDesc">الأكبر سعة</option>
          </select>
        </div>

        <button type="button" onClick={applyFilters} className="btn-primary w-full rounded-xl py-3 text-sm font-semibold">
          تطبيق الفلاتر
        </button>
      </div>
    </div>
  )
}
