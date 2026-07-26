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

const BUDGET_PRESETS = [1000, 5000, 10000, 25000, 50000, 100000]

export default function SpacesFiltersPro({ types, params }: Props) {
  const router = useRouter()
  const { locale, t } = useLanguage()
  const initialDays = useMemo(() => new Set((params.weekdays || params.days || '').split(',').filter(Boolean)), [params.days, params.weekdays])
  const [city, setCity] = useState(params.city || '')
  const [typeId, setTypeId] = useState(params.typeId || '')
  const [minPrice, setMinPrice] = useState(params.minPrice || '')
  const [maxPrice, setMaxPrice] = useState(params.maxPrice || '')
  const [capacity, setCapacity] = useState(params.capacity || '')
  const [date, setDate] = useState(params.date || '')
  const [startTime, setStartTime] = useState(params.startTime || '')
  const [endTime, setEndTime] = useState(params.endTime || '')
  const [sort, setSort] = useState(params.sort || 'newest')
  const [fullyAvailable, setFullyAvailable] = useState(params.fullyAvailable !== '0')
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
    const normalizedMinPrice = Math.max(0, Number(minPrice) || 0)
    const normalizedMaxPrice = Math.max(0, Number(maxPrice) || 0)
    if (normalizedMinPrice > 0) query.set('minPrice', String(normalizedMinPrice))
    if (normalizedMaxPrice > 0) {
      query.set('maxPrice', String(Math.max(normalizedMaxPrice, normalizedMinPrice)))
    }
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

  return (
    <div className="spaces-filter-panel premium-card sticky top-20 animate-in">
      <div className="spaces-filter-header flex items-center justify-between gap-4 px-5 pb-4 pt-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#0E3B34] text-[#B99A63]">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M7 12h10m-7 6h4M8 4v4m8 2v4m-4 2v4" />
            </svg>
          </span>
          <div>
            <h3 className="font-extrabold text-[#1B1B1B]">
              {locale === 'en' ? 'Tailor your search' : 'خصص بحثك'}
            </h3>
            <p className="mt-0.5 text-xs text-[#5F6764]">{t('filterHint')}</p>
          </div>
        </div>
        <Link href="/spaces" className="text-xs font-semibold text-[#B99A63] hover:text-[#0E3B34]">
          {t('clear')}
        </Link>
      </div>

      <div className="spaces-filter-body space-y-5 px-5 pb-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-[#3F4B47]">{t('cityDistrict')}</label>
          <input
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder={t('cityPlaceholder')}
            className="field"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-[#3F4B47]">{t('spaceType')}</label>
          <select value={typeId} onChange={e => setTypeId(e.target.value)} className="field bg-white">
            <option value="">{t('allTypes')}</option>
            {types.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-bold text-[#3F4B47]">{t('hourlyPriceRange')}</label>
            <span className="text-[11px] font-semibold text-[#0E3B34]">
              {Number(minPrice || 0).toLocaleString('en-US')} — {maxPrice ? Number(maxPrice).toLocaleString('en-US') : (locale === 'en' ? 'No maximum' : 'بدون حد أعلى')} {maxPrice ? (locale === 'ar' ? 'ر.س' : 'SAR') : ''}
            </span>
          </div>
          <div className="rounded-2xl border border-[#D8D1C7] bg-[#FAF8F3] p-3">
            <div className="grid grid-cols-2 gap-2">
              <label>
                <span className="mb-1 block text-[10px] font-bold text-[#7A837B]">{t('minPrice')}</span>
                <input
                  type="number"
                  min={0}
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  placeholder="0"
                  className="field py-2 text-xs"
                  aria-label={t('minPrice')}
                />
              </label>
              <label>
                <span className="mb-1 block text-[10px] font-bold text-[#7A837B]">{t('maxPrice')}</span>
                <input
                  type="number"
                  min={0}
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  placeholder={locale === 'en' ? 'No maximum' : 'بدون حد'}
                  className="field py-2 text-xs"
                  aria-label={t('maxPrice')}
                />
              </label>
            </div>
            <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1" aria-label={locale === 'en' ? 'Quick maximum budgets' : 'ميزانيات سريعة'}>
              {BUDGET_PRESETS.map(value => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMaxPrice(String(value))}
                  className={`whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[10px] font-bold transition ${
                    Number(maxPrice) === value
                      ? 'border-[#0E3B34] bg-[#0E3B34] text-white'
                      : 'border-[#D8D1C7] bg-white text-[#59635B] hover:border-[#B99A63]'
                  }`}
                >
                  {value.toLocaleString('en-US')}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setMaxPrice('')}
              className="mt-2 text-[10px] font-bold text-[#A27B25] hover:text-[#0E3B34]"
            >
              {locale === 'en' ? 'Remove maximum price' : 'إلغاء الحد الأعلى للسعر'}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-[#3F4B47]">{t('capacity')}</label>
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
          <label className="mb-2 block text-xs font-bold text-[#3F4B47]">{t('availableDays')}</label>
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
                  {t(day.labelKey)}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-[#3F4B47]">{t('specificDate')}</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="field" dir="ltr" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-[#3F4B47]">{t('from')}</label>
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="field" dir="ltr" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-[#3F4B47]">{t('to')}</label>
            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="field" dir="ltr" />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-[#3F4B47]">{t('sort')}</label>
          <select value={sort} onChange={e => setSort(e.target.value)} className="field bg-white">
            <option value="newest">{t('newest')}</option>
            <option value="priceAsc">{t('priceAsc')}</option>
            <option value="priceDesc">{t('priceDesc')}</option>
            <option value="capacityDesc">{t('capacityDesc')}</option>
          </select>
        </div>

        {params.mode === 'program' && (
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#D8D1C7] bg-[#FAF8F3] p-3">
            <input type="checkbox" checked={fullyAvailable} onChange={(event) => setFullyAvailable(event.target.checked)} className="mt-1" />
            <span>
              <strong className="block text-xs text-[#1B1B1B]">{locale === 'en' ? 'Fully available only' : 'متاحة لكل مواعيد البرنامج فقط'}</strong>
              <small className="mt-1 block leading-5 text-[#5F6764]">{locale === 'en' ? 'Hide spaces missing any session.' : 'إخفاء أي مساحة لا تتوفر في أحد المواعيد.'}</small>
            </span>
          </label>
        )}

      </div>
      <div className="filter-apply-bar sticky bottom-0 mt-3 border-t border-[#D8D1C7] bg-white/95 p-4 backdrop-blur">
        <button type="button" onClick={applyFilters} className="btn-primary w-full rounded-xl py-3 text-sm font-semibold">
          {t('applyFilters')}
        </button>
      </div>
    </div>
  )
}
