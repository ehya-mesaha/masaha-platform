'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/components/i18n/LanguageProvider'
import type { TranslationKey } from '@/lib/i18n'

type SpaceType = { id: string; name: string }

type FilterParams = {
  city?: string
  typeId?: string
  type?: string
  minPrice?: string
  maxPrice?: string
  capacity?: string
  date?: string
  startDate?: string
  endDate?: string
  weekdays?: string
  mode?: string
  fullyAvailable?: string
  startTime?: string
  endTime?: string
  days?: string
  sort?: string
}

type Props = {
  types: SpaceType[]
  params: FilterParams
}

const DAY_OPTIONS = [
  { value: '0', labelKey: 'sunday' },
  { value: '1', labelKey: 'monday' },
  { value: '2', labelKey: 'tuesday' },
  { value: '3', labelKey: 'wednesday' },
  { value: '4', labelKey: 'thursday' },
  { value: '5', labelKey: 'friday' },
  { value: '6', labelKey: 'saturday' },
] satisfies { value: string; labelKey: TranslationKey }[]

const MAX_PRICE = 5000

export default function SpacesFiltersPro({ types, params }: Props) {
  const router = useRouter()
  const { locale, t } = useLanguage()
  const initialDays = useMemo(() => new Set((params.weekdays || params.days || '').split(',').filter(Boolean)), [params.days, params.weekdays])
  const [city, setCity] = useState(params.city || '')
  const [typeId, setTypeId] = useState(params.typeId || '')
  const [minPrice, setMinPrice] = useState(Number(params.minPrice || 0))
  const [maxPrice, setMaxPrice] = useState(Number(params.maxPrice || MAX_PRICE))
  const [capacity, setCapacity] = useState(params.capacity || '')
  const [date, setDate] = useState(params.date || '')
  const [startTime, setStartTime] = useState(params.startTime || '')
  const [endTime, setEndTime] = useState(params.endTime || '')
  const [sort, setSort] = useState(params.sort || 'newest')
  const [fullyAvailable, setFullyAvailable] = useState(params.fullyAvailable !== '0')
  const [selectedDays, setSelectedDays] = useState(initialDays)

  const minPercent = Math.max(0, Math.min(100, (minPrice / MAX_PRICE) * 100))
  const maxPercent = Math.max(0, Math.min(100, (maxPrice / MAX_PRICE) * 100))

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
    if (sort && sort !== 'newest') query.set('sort', sort)
    if (params.mode === 'program') {
      query.set('mode', 'program')
      if (params.startDate) query.set('startDate', params.startDate)
      if (params.endDate) query.set('endDate', params.endDate)
      query.set('fullyAvailable', fullyAvailable ? '1' : '0')
      if (selectedDays.size > 0) query.set('weekdays', Array.from(selectedDays).sort().join(','))
    } else if (selectedDays.size > 0) {
      query.set('days', Array.from(selectedDays).sort().join(','))
    }
    router.push(`/spaces${query.toString() ? `?${query.toString()}` : ''}`)
  }

  function updateMin(value: number) {
    setMinPrice(Math.max(0, Math.min(value, maxPrice)))
  }

  function updateMax(value: number) {
    setMaxPrice(Math.min(MAX_PRICE, Math.max(value, minPrice)))
  }

  return (
    <div className="premium-card sticky top-20 p-5 animate-in">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-[#14201A]">{t('filterResults')}</h3>
          <p className="mt-1 text-xs text-[#6B7566]">{t('filterHint')}</p>
        </div>
        <Link href="/spaces" className="text-xs font-semibold text-[#C49A3C] hover:text-[#1B3A2D]">
          {t('clear')}
        </Link>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-[#4A554D]">{t('cityDistrict')}</label>
          <input
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder={t('cityPlaceholder')}
            className="field"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-[#4A554D]">{t('spaceType')}</label>
          <select value={typeId} onChange={e => setTypeId(e.target.value)} className="field bg-white">
            <option value="">{t('allTypes')}</option>
            {types.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-bold text-[#4A554D]">{t('hourlyPriceRange')}</label>
            <span className="text-[11px] font-semibold text-[#1B3A2D]">
              {minPrice.toLocaleString('en-US')} - {maxPrice.toLocaleString('en-US')} {locale === 'ar' ? 'ر.س' : 'SAR'}
            </span>
          </div>
          <div className="rounded-2xl border border-[#E8E3D8] bg-[#FBFAF7] px-3 py-5">
            <div className="relative h-8" dir="ltr">
              <div className="absolute left-1 right-1 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#D8D1C4]" />
              <div
                className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#C49A3C]"
                style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
              />
              <input
                type="range"
                min={0}
                max={MAX_PRICE}
                step={50}
                value={minPrice}
                onChange={e => updateMin(Number(e.target.value))}
                className="dual-range-input"
                aria-label={t('minPrice')}
              />
              <input
                type="range"
                min={0}
                max={MAX_PRICE}
                step={50}
                value={maxPrice}
                onChange={e => updateMax(Number(e.target.value))}
                className="dual-range-input"
                aria-label={t('maxPrice')}
              />
            </div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <input
              type="number"
              min={0}
              value={minPrice}
              onChange={e => updateMin(Number(e.target.value || 0))}
              className="field py-2 text-xs"
              aria-label={t('minPrice')}
            />
            <input
              type="number"
              min={0}
              value={maxPrice}
              onChange={e => updateMax(Number(e.target.value || 0))}
              className="field py-2 text-xs"
              aria-label={t('maxPrice')}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-[#4A554D]">{t('capacity')}</label>
          <input
            type="number"
            min={1}
            value={capacity}
            onChange={e => setCapacity(e.target.value)}
            placeholder={t('capacityPlaceholder')}
            className="field"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold text-[#4A554D]">{t('availableDays')}</label>
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
                      ? 'border-[#1B3A2D] bg-[#1B3A2D] text-white shadow-sm'
                      : 'border-[#E8E3D8] bg-white text-[#4A554D] hover:border-[#C49A3C]'
                  }`}
                >
                  {t(day.labelKey)}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-[#4A554D]">{t('specificDate')}</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="field" dir="ltr" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-[#4A554D]">{t('from')}</label>
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="field" dir="ltr" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-[#4A554D]">{t('to')}</label>
            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="field" dir="ltr" />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-[#4A554D]">{t('sort')}</label>
          <select value={sort} onChange={e => setSort(e.target.value)} className="field bg-white">
            <option value="newest">{t('newest')}</option>
            <option value="priceAsc">{t('priceAsc')}</option>
            <option value="priceDesc">{t('priceDesc')}</option>
            <option value="capacityDesc">{t('capacityDesc')}</option>
          </select>
        </div>

        {params.mode === 'program' && (
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E8E3D8] bg-[#FBFAF7] p-3">
            <input type="checkbox" checked={fullyAvailable} onChange={(event) => setFullyAvailable(event.target.checked)} className="mt-1" />
            <span>
              <strong className="block text-xs text-[#14201A]">{locale === 'en' ? 'Fully available only' : 'متاحة لكل مواعيد البرنامج فقط'}</strong>
              <small className="mt-1 block leading-5 text-[#6B7566]">{locale === 'en' ? 'Hide spaces missing any session.' : 'إخفاء أي مساحة لا تتوفر في أحد المواعيد.'}</small>
            </span>
          </label>
        )}

        <button type="button" onClick={applyFilters} className="btn-primary w-full rounded-xl py-3 text-sm font-semibold">
          {t('applyFilters')}
        </button>
      </div>
    </div>
  )
}
