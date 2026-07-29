'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import ImageUploader from '@/components/ui/ImageUploader'
import SearchableSelect from '@/components/ui/SearchableSelect'

type SpaceType = { id: string; name: string }
type City = { id: string; name: string }
type Amenity = { id: string; name: string }

export default function EditSpacePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [types, setTypes] = useState<SpaceType[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    typeId: '',
    description: '',
    city: '',
    district: '',
    address: '',
    capacity: '',
    identicalUnitsCount: '1',
    price: '',
    pricePeriod: 'hour',
    images: [] as string[],
    amenityIds: [] as string[],
  })

  useEffect(() => {
    Promise.all([
      fetch(`/api/spaces/${id}`).then(r => r.json()),
      fetch('/api/catalog').then(r => r.json()),
    ]).then(([spaceData, catData]) => {
      const s = spaceData.space
      if (s) {
        setForm({
          name: s.name,
          typeId: s.typeId,
          description: s.description || '',
          city: s.city,
          district: s.district || '',
          address: s.address || '',
          capacity: s.capacity?.toString() || '',
          identicalUnitsCount: String(s.identicalUnitsCount || Math.max(1, s.units?.length || 1)),
          price: s.price.toString(),
          pricePeriod: s.pricePeriod,
          images: s.images.length ? s.images.map((img: { url: string }) => img.url) : [],
          amenityIds: s.amenities.map((a: { amenity: { id: string } }) => a.amenity.id),
        })
      }
      setTypes(catData.types || [])
      setCities(catData.cities || [])
      setAmenities(catData.amenities || [])
      setLoading(false)
    })
  }, [id])

  function update(field: string, value: unknown) {
    setForm(p => ({ ...p, [field]: value }))
  }

  function toggleAmenity(aid: string) {
    setForm(p => ({
      ...p,
      amenityIds: p.amenityIds.includes(aid)
        ? p.amenityIds.filter(a => a !== aid)
        : [...p.amenityIds, aid],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const images = form.images
      const res = await fetch(`/api/spaces/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, images }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'حدث خطأ')
        return
      }

      router.push(`/seller/spaces/${id}?submittedForReview=1`)
    } catch {
      setError('حدث خطأ في الاتصال')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-8 flex justify-center"><Spinner size="lg" /></div>
  }

  const cityOptions = form.city && !cities.some(city => city.name === form.city)
    ? [{ id: `legacy:${form.city}`, name: form.city }, ...cities]
    : cities
  const selectedCityId = cityOptions.find(city => city.name === form.city)?.id || ''

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">تعديل المساحة</h1>

        <Card>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">اسم المساحة *</label>
              <input value={form.name} onChange={e => update('name', e.target.value)} required
                className="w-full px-4 py-2.5 rounded-lg border border-[#D8D1C7] text-sm focus:outline-none focus:border-[#0E3B34]" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">نوع المساحة *</label>
              <select value={form.typeId} onChange={e => update('typeId', e.target.value)} required
                className="w-full px-4 py-2.5 rounded-lg border border-[#D8D1C7] text-sm focus:outline-none focus:border-[#0E3B34] bg-white">
                <option value="">اختر النوع</option>
                {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">الوصف</label>
              <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-[#D8D1C7] text-sm focus:outline-none focus:border-[#0E3B34] resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">المدينة *</label>
                <SearchableSelect
                  value={selectedCityId}
                  onChange={cityId => update('city', cityOptions.find(city => city.id === cityId)?.name || '')}
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">الحي</label>
                <input value={form.district} onChange={e => update('district', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#D8D1C7] text-sm focus:outline-none focus:border-[#0E3B34]" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">الطاقة الاستيعابية</label>
              <input type="number" value={form.capacity} onChange={e => update('capacity', e.target.value)} min={1}
                className="w-full px-4 py-2.5 rounded-lg border border-[#D8D1C7] text-sm focus:outline-none focus:border-[#0E3B34]" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">عدد القاعات أو الوحدات المماثلة *</label>
              <input type="number" value={form.identicalUnitsCount} onChange={e => update('identicalUnitsCount', e.target.value)} required min={1} max={100}
                className="w-full px-4 py-2.5 rounded-lg border border-[#D8D1C7] text-sm focus:outline-none focus:border-[#0E3B34]" />
              <p className="mt-1.5 text-xs text-[#5F6764]">يمكن تعديل مساحة تحتوي على أكثر من قاعة. ستبقى التغييرات بانتظار اعتماد مدير المنصة قبل إعادة نشرها.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">السعر (ر.س) *</label>
                <input type="number" value={form.price} onChange={e => update('price', e.target.value)} required min={0}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#D8D1C7] text-sm focus:outline-none focus:border-[#0E3B34]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">الفترة</label>
                <input value="بالساعة" readOnly
                  className="w-full px-4 py-2.5 rounded-lg border border-[#D8D1C7] bg-[#F5F1E8] text-sm text-[#5F6764]" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الصور</label>
              <ImageUploader
                images={form.images}
                onChange={urls => update('images', urls)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">المرافق</label>
              <div className="grid grid-cols-3 gap-2">
                {amenities.map(a => (
                  <button key={a.id} type="button" onClick={() => toggleAmenity(a.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      form.amenityIds.includes(a.id)
                        ? 'bg-[#0E3B34] text-white border-[#0E3B34]'
                        : 'bg-white text-gray-600 border-[#D8D1C7] hover:border-[#0E3B34]'
                    }`}>
                    {a.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-[#D8D1C7]">
              <button type="submit" disabled={saving}
                className="bg-[#0E3B34] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#092C27] disabled:opacity-60 flex items-center gap-2">
                {saving && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
              <button type="button" onClick={() => router.back()}
                className="px-6 py-2.5 rounded-lg text-sm font-medium border border-[#D8D1C7] text-gray-600 hover:bg-gray-50">
                إلغاء
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
