'use client'

import { useEffect, useState } from 'react'

type Item = {
  id: string
  name: string
  description?: string
  category?: string | null
  pricingType?: string
  defaultPrice?: number | null
  indicativePrice?: number | null
}

type CatalogKey = 'types' | 'amenities' | 'ownerServices' | 'partnerServices'
type ApiType = 'space-type' | 'amenity' | 'owner-service' | 'partner-service'

const sections: Array<{ key: CatalogKey; apiType: ApiType; title: string; subtitle: string; detailed?: boolean }> = [
  { key: 'types', apiType: 'space-type', title: 'أنواع المساحات', subtitle: 'التصنيفات التي تظهر في البحث ونموذج إضافة المساحة.' },
  { key: 'amenities', apiType: 'amenity', title: 'المرافق والتجهيزات', subtitle: 'قائمة موحدة يختار منها أصحاب المساحات فقط.' },
  { key: 'ownerServices', apiType: 'owner-service', title: 'خدمات صاحب المساحة', subtitle: 'دليل ثابت؛ يفعّل صاحب المساحة الخدمة ويحدد سعرها.', detailed: true },
  { key: 'partnerServices', apiType: 'partner-service', title: 'خدمات إضافية - شركاء إحياء مساحة', subtitle: 'أسعار تقديرية قابلة للتعديل عند تجهيز عرض السعر.', detailed: true },
]

export default function AdminCategoriesPage() {
  const [data, setData] = useState<Record<CatalogKey, Item[]>>({ types: [], amenities: [], ownerServices: [], partnerServices: [] })
  const [drafts, setDrafts] = useState<Record<ApiType, { name: string; description: string; category: string; price: string }>>({
    'space-type': { name: '', description: '', category: '', price: '' },
    amenity: { name: '', description: '', category: '', price: '' },
    'owner-service': { name: '', description: '', category: 'other', price: '' },
    'partner-service': { name: '', description: '', category: '', price: '' },
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/admin/categories').then(response => response.json()).then(result => {
      setData({
        types: result.types || [],
        amenities: result.amenities || [],
        ownerServices: result.ownerServices || [],
        partnerServices: result.partnerServices || [],
      })
    })
  }, [])

  async function add(section: typeof sections[number]) {
    const draft = drafts[section.apiType]
    if (!draft.name.trim()) return
    const response = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: section.apiType, ...draft }),
    })
    const result = await response.json()
    if (!response.ok) return setMessage(result.error || 'تعذر الحفظ')
    setData(current => ({ ...current, [section.key]: [...current[section.key], result.item] }))
    setDrafts(current => ({ ...current, [section.apiType]: { ...current[section.apiType], name: '', description: '', price: '' } }))
    setMessage('تمت الإضافة بنجاح')
  }

  async function rename(section: typeof sections[number], item: Item) {
    const name = prompt('الاسم الجديد', item.name)?.trim()
    if (!name || name === item.name) return
    const response = await fetch('/api/admin/categories', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: section.apiType,
        ...item,
        name,
        price: item.defaultPrice ?? item.indicativePrice ?? '',
      }),
    })
    const result = await response.json()
    if (response.ok) setData(current => ({ ...current, [section.key]: current[section.key].map(row => row.id === item.id ? result.item : row) }))
  }

  async function remove(section: typeof sections[number], id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return
    const response = await fetch('/api/admin/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: section.apiType, id }),
    })
    const result = await response.json()
    if (!response.ok) return setMessage(result.error || 'تعذر الحذف')
    setData(current => ({ ...current, [section.key]: current[section.key].filter(item => item.id !== id) }))
  }

  return (
    <div className="dashboard-page">
      <div className="page-hero mb-7 p-7">
        <p className="text-xs font-bold text-[#C49A3C]">تحكم الإدارة</p>
        <h1 className="mt-2 text-3xl font-extrabold text-white">التصنيفات والأدلة</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-white/65">إدارة الأنواع والمرافق وخدمات أصحاب المساحات وخدمات شركاء إحياء مساحة من مكان واحد.</p>
      </div>
      {message && <p className="mb-4 rounded-xl border border-[#E8E1D3] bg-white px-4 py-3 text-sm text-[#1B3A2D]">{message}</p>}
      <div className="grid gap-6 xl:grid-cols-2">
        {sections.map(section => {
          const draft = drafts[section.apiType]
          return (
            <section key={section.key} className="rounded-2xl border border-[#E1D9CA] bg-white p-5 shadow-[0_20px_55px_-45px_rgba(15,34,25,.55)]">
              <div className="mb-5">
                <h2 className="font-display text-xl font-extrabold text-[#1B3A2D]">{section.title}</h2>
                <p className="mt-1 text-xs leading-6 text-[#6B7566]">{section.subtitle}</p>
              </div>
              <div className="grid gap-2">
                <input value={draft.name} onChange={event => setDrafts(current => ({ ...current, [section.apiType]: { ...draft, name: event.target.value } }))} placeholder="اسم العنصر" className="field py-2.5" />
                {section.detailed && (
                  <>
                    <input value={draft.description} onChange={event => setDrafts(current => ({ ...current, [section.apiType]: { ...draft, description: event.target.value } }))} placeholder="وصف مختصر" className="field py-2.5" />
                    <div className="grid grid-cols-2 gap-2">
                      <input value={draft.category} onChange={event => setDrafts(current => ({ ...current, [section.apiType]: { ...draft, category: event.target.value } }))} placeholder="التصنيف" className="field py-2.5" />
                      <input type="number" min="0" value={draft.price} onChange={event => setDrafts(current => ({ ...current, [section.apiType]: { ...draft, price: event.target.value } }))} placeholder="السعر الافتراضي" className="field py-2.5" dir="ltr" />
                    </div>
                  </>
                )}
                <button onClick={() => add(section)} className="btn-primary rounded-xl py-2.5 text-sm font-bold">إضافة</button>
              </div>
              <div className="mt-5 space-y-2">
                {data[section.key].map(item => (
                  <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-[#F7F3EB] px-4 py-3">
                    <div className="min-w-0">
                      <strong className="block truncate text-sm text-[#1B3A2D]">{item.name}</strong>
                      {item.description && <span className="mt-1 block truncate text-[11px] text-[#6B7566]">{item.description}</span>}
                    </div>
                    <div className="flex gap-3 text-xs font-bold">
                      <button onClick={() => rename(section, item)} className="text-[#1B3A2D]">تعديل</button>
                      <button onClick={() => remove(section, item.id)} className="text-red-600">حذف</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
