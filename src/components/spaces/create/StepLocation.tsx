'use client'

import { StepProps, SAUDI_CITIES } from './types'
import SearchableSelect from '@/components/ui/SearchableSelect'
import LocationPicker, { ResolvedAddress } from '@/components/maps/LocationPicker'
import { formatCoordinate, isValidLatLng } from '@/lib/geo'

export default function StepLocation({ form, update, cities = [] }: StepProps) {
  const point = { lat: Number(form.latitude), lng: Number(form.longitude) }
  const marker = isValidLatLng(point) ? point : null

  const cityOptions = cities.length
    ? cities
    : SAUDI_CITIES.map(name => ({ id: `fallback:${name}`, name }))
  const selectedCityId = cityOptions.find(city => city.name === form.city)?.id || ''

  // The picker reframes itself on the chosen city while no pin exists, and leaves an
  // existing pin alone — sellers routinely correct the city or district after placing it.
  function chooseCity(city: string) {
    update('city', city)
  }

  function setPoint(next: { lat: number; lng: number }) {
    update('latitude', formatCoordinate(next.lat))
    update('longitude', formatCoordinate(next.lng))
  }

  /** Fill whatever the reverse geocoder knows, without clobbering what's typed. */
  function applyAddress(address: ResolvedAddress) {
    if (address.city && !form.city) {
      const match = cityOptions.find(option => option.name === address.city)
      update('city', match ? match.name : address.city)
    }
    if (address.district && !form.district.trim()) update('district', address.district)
    if (address.street && !form.streetName.trim()) update('streetName', address.street)
    if (address.postalCode && !form.postalCode.trim()) update('postalCode', address.postalCode)
  }

  return (
    <div>
      <h2 className="font-display text-xl font-extrabold text-[#1B1B1B] mb-1">الموقع والعنوان التفصيلي</h2>
      <p className="text-[#5F6764] text-sm mb-6">حدد موقع المساحة بدقة وأدخل تفاصيل العنوان لتسهيل وصول العملاء إليها.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Address fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[#3F4B47] mb-1.5">المدينة <Required /></label>
              <SearchableSelect
                value={selectedCityId}
                onChange={id => chooseCity(cityOptions.find(city => city.id === id)?.name || '')}
                options={cityOptions}
                placeholder="اختر المدينة"
                searchPlaceholder="ابحث عن مدينة..."
                emptyText="لا توجد مدينة مطابقة"
                buttonClassName="w-full rounded-lg border border-[#D8D1C7] bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#0E3B34]"
                required
                ariaLabel="المدينة"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3F4B47] mb-1.5">الحي <Required /></label>
              <input
                value={form.district}
                onChange={e => update('district', e.target.value)}
                placeholder="الملقا"
                className="w-full px-4 py-2.5 rounded-lg border border-[#D8D1C7] text-sm focus:outline-none focus:border-[#0E3B34]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3F4B47] mb-1.5">اسم الشارع <Required /></label>
            <input
              value={form.streetName}
              onChange={e => update('streetName', e.target.value)}
              placeholder="طريق الأمير محمد بن سعد بن عبدالعزيز"
              className="w-full px-4 py-2.5 rounded-lg border border-[#D8D1C7] text-sm focus:outline-none focus:border-[#0E3B34]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[#3F4B47] mb-1.5">رقم المبنى <Required /></label>
              <input
                value={form.buildingNumber}
                onChange={e => update('buildingNumber', e.target.value)}
                placeholder="3492"
                className="w-full px-4 py-2.5 rounded-lg border border-[#D8D1C7] text-sm focus:outline-none focus:border-[#0E3B34]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3F4B47] mb-1.5">الرمز البريدي <Required /></label>
              <input
                value={form.postalCode}
                onChange={e => update('postalCode', e.target.value)}
                placeholder="13521"
                className="w-full px-4 py-2.5 rounded-lg border border-[#D8D1C7] text-sm focus:outline-none focus:border-[#0E3B34]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3F4B47] mb-1.5">معالم قريبة أو إرشادات إضافية (اختياري)</label>
            <input
              value={form.landmarks}
              onChange={e => update('landmarks', e.target.value)}
              placeholder="بجوار مجمع الأعمال..."
              className="w-full px-4 py-2.5 rounded-lg border border-[#D8D1C7] text-sm focus:outline-none focus:border-[#0E3B34]"
            />
          </div>
        </div>

        {/* Map picker */}
        <LocationPicker
          value={marker}
          onChange={setPoint}
          city={form.city}
          onUseAddress={applyAddress}
        />
      </div>
    </div>
  )
}

function Required() {
  return <span className="text-[#B44A3C]" aria-label="مطلوب">*</span>
}
