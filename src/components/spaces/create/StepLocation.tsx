'use client'

import { useState } from 'react'
import { StepProps, SAUDI_CITIES } from './types'

function extractCoordinates(value: string) {
  let decoded = value.trim()
  try { decoded = decodeURIComponent(decoded) } catch {}
  const patterns = [
    /@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
    /[?&](?:q|query|ll)=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
    /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/,
    /(-?\d{1,2}\.\d+),\s*(-?\d{1,3}\.\d+)/,
  ]

  for (const pattern of patterns) {
    const match = decoded.match(pattern)
    if (!match) continue
    const lat = Number(match[1])
    const lng = Number(match[2])
    if (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
      return { lat, lng }
    }
  }

  return null
}

export default function StepLocation({ form, update }: StepProps) {
  const [locationUrl, setLocationUrl] = useState('')
  const [urlError, setUrlError] = useState('')
  const cityCenter = CITY_CENTERS[form.city] || CITY_CENTERS['الخبر']
  const lat = parseFloat(form.latitude) || cityCenter.lat
  const lng = parseFloat(form.longitude) || cityCenter.lng
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

  function setCoordinates(nextLat: number, nextLng: number) {
    update('latitude', nextLat.toFixed(6))
    update('longitude', nextLng.toFixed(6))
  }

  async function applyLocationUrl() {
    let resolvedUrl = locationUrl
    if (/^https?:\/\/(maps\.app\.goo\.gl|goo\.gl)\//i.test(locationUrl.trim())) {
      try {
        const response = await fetch('/api/maps/resolve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: locationUrl.trim() }),
        })
        const data = await response.json()
        if (response.ok && data.url) resolvedUrl = data.url
      } catch {}
    }
    const coordinates = extractCoordinates(resolvedUrl)
    if (!coordinates) {
      setUrlError('لم نتمكن من قراءة الرابط. افتح خرائط Google واختر مشاركة ثم انسخ الرابط الكامل.')
      return
    }
    setCoordinates(coordinates.lat, coordinates.lng)
    setUrlError('')
  }

  function chooseCity(city: string) {
    update('city', city)
    const center = CITY_CENTERS[city]
    if (center) setCoordinates(center.lat, center.lng)
  }

  function handleMapClick(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    const span = 0.04
    setCoordinates(lat + (0.5 - y) * span, lng + (x - 0.5) * span)
    setUrlError('')
  }

  return (
    <div>
      <h2 className="font-display text-xl font-extrabold text-[#14201A] mb-1">الموقع والعنوان التفصيلي</h2>
      <p className="text-[#6B7566] text-sm mb-6">حدد موقع المساحة بدقة وأدخل تفاصيل العنوان لتسهيل وصول العملاء إليها.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4A554D] mb-1.5">المدينة</label>
              <select
                value={form.city}
                onChange={e => chooseCity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D] bg-white"
              >
                <option value="">اختر المدينة</option>
                {SAUDI_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A554D] mb-1.5">الحي</label>
              <input
                value={form.district}
                onChange={e => update('district', e.target.value)}
                placeholder="الملقا"
                className="w-full px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4A554D] mb-1.5">اسم الشارع</label>
            <input
              value={form.streetName}
              onChange={e => update('streetName', e.target.value)}
              placeholder="طريق الأمير محمد بن سعد بن عبدالعزيز"
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4A554D] mb-1.5">رقم المبنى</label>
              <input
                value={form.buildingNumber}
                onChange={e => update('buildingNumber', e.target.value)}
                placeholder="3492"
                className="w-full px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A554D] mb-1.5">الرمز البريدي</label>
              <input
                value={form.postalCode}
                onChange={e => update('postalCode', e.target.value)}
                placeholder="13521"
                className="w-full px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4A554D] mb-1.5">معالم قريبة أو إرشادات إضافية (اختياري)</label>
            <input
              value={form.landmarks}
              onChange={e => update('landmarks', e.target.value)}
              placeholder="بجوار مجمع الأعمال..."
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
            />
          </div>
        </div>

        {/* Map */}
        <div className="space-y-3">
          <div className="rounded-2xl border border-[#E8E3D8] bg-white p-4">
            <label className="block text-sm font-bold text-[#14201A] mb-2">رابط الموقع</label>
            <div className="flex gap-2">
              <input
                value={locationUrl}
                onChange={e => setLocationUrl(e.target.value)}
                placeholder="الصق رابط Google Maps أو OpenStreetMap"
                dir="ltr"
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
              />
              <button
                type="button"
                onClick={applyLocationUrl}
                className="px-4 py-2.5 rounded-xl bg-[#1B3A2D] text-white text-sm font-semibold hover:bg-[#0F2219] transition-colors"
              >
                استخدام
              </button>
            </div>
            {urlError && <p className="mt-2 text-xs text-red-600">{urlError}</p>}
          </div>

          <div
            onClick={handleMapClick}
            className="relative rounded-2xl overflow-hidden border border-[#E8E3D8] bg-gray-100 cursor-crosshair"
            style={{ height: 340 }}
            role="button"
            tabIndex={0}
            aria-label="اختر الموقع على الخريطة"
          >
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.02},${lat - 0.02},${lng + 0.02},${lat + 0.02}&layer=mapnik&marker=${lat},${lng}`}
              className="w-full h-full border-0 pointer-events-none"
              loading="lazy"
            />
            <div className="absolute inset-x-4 top-4 rounded-xl bg-white/95 border border-[#E8E3D8] px-4 py-2 text-xs font-semibold text-[#1B3A2D] shadow-sm">
              اضغط على الخريطة لتحديد موقع المساحة
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
              <div className="w-10 h-10 rounded-full bg-[#C49A3C] border-4 border-white shadow-lg flex items-center justify-center text-[#1B3A2D]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.69 18.933l.003.002.002.001a.596.596 0 00.61 0l.002-.001.003-.002.008-.005.026-.016a16.88 16.88 0 001.18-.809 21.395 21.395 0 002.66-2.257C15.787 14.24 17.5 11.963 17.5 9A7.5 7.5 0 002.5 9c0 2.963 1.713 5.24 3.316 6.846a21.397 21.397 0 002.66 2.257 16.903 16.903 0 001.18.809l.026.016.008.005zM10 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E8E3D8] bg-[#F7F3EB] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[#6B7566] mb-1">الموقع المحدد</p>
                <p className="text-sm font-semibold text-[#14201A]" dir="ltr">{lat.toFixed(6)}, {lng.toFixed(6)}</p>
              </div>
              <a
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl border border-[#1B3A2D]/15 bg-white text-[#1B3A2D] text-sm font-semibold hover:bg-[#1B3A2D]/5 transition-colors"
              >
                فتح الخريطة
              </a>
            </div>
          </div>

          <details className="rounded-xl border border-[#E8E3D8] bg-white p-3">
            <summary className="cursor-pointer text-xs font-bold text-[#6B7566]">إدخال الإحداثيات يدوياً</summary>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#6B7566] mb-1">خط العرض</label>
                <input
                  value={form.latitude}
                  onChange={e => update('latitude', e.target.value)}
                  placeholder="24.7954"
                  dir="ltr"
                  className="w-full px-3 py-2 rounded-lg border border-[#E8E3D8] text-xs focus:outline-none focus:border-[#1B3A2D]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#6B7566] mb-1">خط الطول</label>
                <input
                  value={form.longitude}
                  onChange={e => update('longitude', e.target.value)}
                  placeholder="46.6012"
                  dir="ltr"
                  className="w-full px-3 py-2 rounded-lg border border-[#E8E3D8] text-xs focus:outline-none focus:border-[#1B3A2D]"
                />
              </div>
            </div>
          </details>
        </div>

        <div className="hidden">
          <div className="rounded-xl overflow-hidden border border-[#E8E3D8] bg-gray-100" style={{ height: 320 }}>
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`}
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#6B7566] mb-1">خط العرض</label>
              <input
                value={form.latitude}
                onChange={e => update('latitude', e.target.value)}
                placeholder="24.7954"
                dir="ltr"
                className="w-full px-3 py-2 rounded-lg border border-[#E8E3D8] text-xs focus:outline-none focus:border-[#1B3A2D]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#6B7566] mb-1">خط الطول</label>
              <input
                value={form.longitude}
                onChange={e => update('longitude', e.target.value)}
                placeholder="46.6012"
                dir="ltr"
                className="w-full px-3 py-2 rounded-lg border border-[#E8E3D8] text-xs focus:outline-none focus:border-[#1B3A2D]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const CITY_CENTERS: Record<string, { lat: number; lng: number }> = {
  'الخبر': { lat: 26.2172, lng: 50.1971 },
  'الدمام': { lat: 26.4207, lng: 50.0888 },
  'الظهران': { lat: 26.2361, lng: 50.0393 },
  'الرياض': { lat: 24.7136, lng: 46.6753 },
  'جدة': { lat: 21.5433, lng: 39.1728 },
  'مكة المكرمة': { lat: 21.3891, lng: 39.8579 },
  'المدينة المنورة': { lat: 24.5247, lng: 39.5692 },
}
