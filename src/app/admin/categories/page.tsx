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
  defaultConfig?: PrintMatrixConfig | null
  isActive?: boolean
  sortOrder?: number
}

type PrintMatrixConfig = {
  bwSingle?: number
  bwDouble?: number
  colorSingle?: number
  colorDouble?: number
}

type CatalogKey = 'types' | 'cities' | 'amenities' | 'ownerServices' | 'partnerServices'
type ApiType = 'space-type' | 'city' | 'amenity' | 'owner-service' | 'partner-service'

type Draft = {
  name: string
  description: string
  category: string
  price: string
  pricingType: string
  config: PrintMatrixConfig
  isActive: boolean
  sortOrder: string
}

const PRICING_OPTIONS: Array<[string, string]> = [
  ['PER_BOOKING', 'لكل حجز'],
  ['PER_PERSON', 'لكل فرد'],
  ['PER_HOUR', 'بالساعة'],
  ['PER_ITEM', 'للقطعة'],
  ['PER_TEN_PAGES', 'لكل 10 صفحات'],
  ['PRINT_MATRIX', 'مصفوفة طباعة (أبيض/ملون × وجه/وجهين)'],
  ['CUSTOM', 'مخصص'],
]

const PRICING_LABELS = Object.fromEntries(PRICING_OPTIONS) as Record<string, string>

const MATRIX_FIELDS: Array<[keyof PrintMatrixConfig, string]> = [
  ['bwSingle', 'أبيض وأسود - وجه واحد (لكل 10 صفحات)'],
  ['bwDouble', 'أبيض وأسود - وجهين (لكل 10 صفحات)'],
  ['colorSingle', 'ملون - وجه واحد (لكل 10 صفحات)'],
  ['colorDouble', 'ملون - وجهين (لكل 10 صفحات)'],
]

const emptyDraft: Draft = {
  name: '',
  description: '',
  category: '',
  price: '',
  pricingType: 'PER_BOOKING',
  config: {},
  isActive: true,
  sortOrder: '',
}

const sections: Array<{ key: CatalogKey; apiType: ApiType; title: string; subtitle: string; detailed?: boolean; pricing?: boolean; cityManagement?: boolean }> = [
  { key: 'types', apiType: 'space-type', title: 'أنواع المساحات', subtitle: 'التصنيفات التي تظهر في البحث ونموذج إضافة المساحة.' },
  { key: 'cities', apiType: 'city', title: 'مدن المنصة', subtitle: 'المدن المتاحة للاختيار في البحث وإضافة المساحات. يمكنك إيقاف مدينة مؤقتًا دون حذف بياناتها.', cityManagement: true },
  { key: 'amenities', apiType: 'amenity', title: 'المرافق والتجهيزات', subtitle: 'قائمة موحدة يختار منها أصحاب المساحات فقط.' },
  { key: 'ownerServices', apiType: 'owner-service', title: 'خدمات صاحب المساحة', subtitle: 'دليل ثابت؛ يفعّل صاحب المساحة الخدمة ويحدد سعرها. حدد نوع التسعير هنا لضبط طريقة الحساب.', detailed: true, pricing: true },
  { key: 'partnerServices', apiType: 'partner-service', title: 'خدمات إضافية - شركاء إحياء مساحة', subtitle: 'أسعار تقديرية قابلة للتعديل عند تجهيز عرض السعر.', detailed: true, pricing: true },
]

export default function AdminCategoriesPage() {
  const [data, setData] = useState<Record<CatalogKey, Item[]>>({ types: [], cities: [], amenities: [], ownerServices: [], partnerServices: [] })
  const [drafts, setDrafts] = useState<Record<ApiType, Draft>>({
    'space-type': { ...emptyDraft },
    city: { ...emptyDraft },
    amenity: { ...emptyDraft },
    'owner-service': { ...emptyDraft, category: 'other' },
    'partner-service': { ...emptyDraft },
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<Draft>(emptyDraft)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/admin/categories').then(response => response.json()).then(result => {
      setData({
        types: result.types || [],
        cities: result.cities || [],
        amenities: result.amenities || [],
        ownerServices: result.ownerServices || [],
        partnerServices: result.partnerServices || [],
      })
    })
  }, [])

  function updateDraft(apiType: ApiType, patch: Partial<Draft>) {
    setDrafts(current => ({ ...current, [apiType]: { ...current[apiType], ...patch } }))
  }

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
    setDrafts(current => ({ ...current, [section.apiType]: section.pricing ? { ...emptyDraft, category: current[section.apiType].category } : { ...emptyDraft } }))
    setMessage('تمت الإضافة بنجاح')
  }

  function startEdit(item: Item) {
    setEditingId(item.id)
    setEditDraft({
      name: item.name,
      description: item.description || '',
      category: item.category || '',
      price: item.defaultPrice != null ? String(item.defaultPrice) : item.indicativePrice != null ? String(item.indicativePrice) : '',
      pricingType: item.pricingType || 'PER_BOOKING',
      config: item.defaultConfig || {},
      isActive: item.isActive !== false,
      sortOrder: item.sortOrder != null ? String(item.sortOrder) : '',
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setEditDraft(emptyDraft)
  }

  async function saveEdit(section: typeof sections[number], id: string) {
    if (!editDraft.name.trim()) return
    const response = await fetch('/api/admin/categories', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: section.apiType, id, ...editDraft }),
    })
    const result = await response.json()
    if (!response.ok) return setMessage(result.error || 'تعذر التحديث')
    setData(current => ({ ...current, [section.key]: current[section.key].map(row => row.id === id ? result.item : row) }))
    setMessage('تم التحديث بنجاح')
    cancelEdit()
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
    if (editingId === id) cancelEdit()
  }

  async function toggleCity(item: Item) {
    const response = await fetch('/api/admin/categories', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'city',
        id: item.id,
        name: item.name,
        sortOrder: item.sortOrder || 0,
        isActive: item.isActive === false,
      }),
    })
    const result = await response.json()
    if (!response.ok) return setMessage(result.error || 'تعذر تحديث حالة المدينة')
    setData(current => ({
      ...current,
      cities: current.cities.map(city => city.id === item.id ? result.item : city),
    }))
    setMessage(result.item.isActive ? 'أصبحت المدينة متاحة في البحث وإضافة المساحات' : 'تم إيقاف المدينة من خيارات البحث وإضافة المساحات')
  }

  return (
    <div className="dashboard-page">
      <div className="page-hero mb-7 p-7">
        <p className="text-xs font-bold text-[#B99A63]">تحكم الإدارة</p>
        <h1 className="mt-2 text-3xl font-extrabold text-white">التصنيفات والأدلة</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-white/65">إدارة الأنواع والمرافق وخدمات أصحاب المساحات وخدمات شركاء إحياء مساحة من مكان واحد.</p>
      </div>
      {message && <p className="mb-4 rounded-xl border border-[#D8D1C7] bg-white px-4 py-3 text-sm text-[#0E3B34]">{message}</p>}
      <div className="grid gap-6 xl:grid-cols-2">
        {sections.map(section => {
          const draft = drafts[section.apiType]
          return (
            <section key={section.key} className="rounded-2xl border border-[#D8D1C7] bg-white p-5 shadow-[0_20px_55px_-45px_rgba(9, 44, 39,.55)]">
              <div className="mb-5">
                <h2 className="font-display text-xl font-extrabold text-[#0E3B34]">{section.title}</h2>
                <p className="mt-1 text-xs leading-6 text-[#5F6764]">{section.subtitle}</p>
              </div>
              <div className="grid gap-2">
                <input value={draft.name} onChange={event => updateDraft(section.apiType, { name: event.target.value })} placeholder="اسم العنصر" className="field py-2.5" />
                {section.cityManagement && (
                  <input
                    type="number"
                    min="0"
                    value={draft.sortOrder}
                    onChange={event => updateDraft(section.apiType, { sortOrder: event.target.value })}
                    placeholder="ترتيب الظهور (مثال: 10)"
                    className="field py-2.5"
                    dir="ltr"
                  />
                )}
                {section.detailed && (
                  <>
                    <input value={draft.description} onChange={event => updateDraft(section.apiType, { description: event.target.value })} placeholder="وصف مختصر" className="field py-2.5" />
                    <div className="grid grid-cols-2 gap-2">
                      <input value={draft.category} onChange={event => updateDraft(section.apiType, { category: event.target.value })} placeholder="التصنيف" className="field py-2.5" />
                      {section.pricing ? (
                        <select value={draft.pricingType} onChange={event => updateDraft(section.apiType, { pricingType: event.target.value })} className="field py-2.5 bg-white">
                          {PRICING_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                      ) : (
                        <input type="number" min="0" value={draft.price} onChange={event => updateDraft(section.apiType, { price: event.target.value })} placeholder="السعر الافتراضي" className="field py-2.5" dir="ltr" />
                      )}
                    </div>
                    {section.pricing && draft.pricingType === 'PRINT_MATRIX' ? (
                      <PrintMatrixFields config={draft.config} onChange={config => updateDraft(section.apiType, { config })} />
                    ) : section.pricing && (
                      <input type="number" min="0" value={draft.price} onChange={event => updateDraft(section.apiType, { price: event.target.value })} placeholder="السعر الافتراضي" className="field py-2.5" dir="ltr" />
                    )}
                  </>
                )}
                <button onClick={() => add(section)} className="btn-primary rounded-xl py-2.5 text-sm font-bold">إضافة</button>
              </div>
              <div className="mt-5 space-y-2">
                {data[section.key].map(item => (
                  editingId === item.id ? (
                    <div key={item.id} className="space-y-2 rounded-xl border border-[#0E3B34]/30 bg-[#F5F1E8] p-3">
                      <input value={editDraft.name} onChange={event => setEditDraft(current => ({ ...current, name: event.target.value }))} placeholder="الاسم" className="field py-2 text-sm" />
                      {section.cityManagement && (
                        <div className="grid grid-cols-[1fr_auto] gap-2">
                          <input
                            type="number"
                            min="0"
                            value={editDraft.sortOrder}
                            onChange={event => setEditDraft(current => ({ ...current, sortOrder: event.target.value }))}
                            placeholder="ترتيب الظهور"
                            className="field py-2 text-sm"
                            dir="ltr"
                          />
                          <label className="flex items-center gap-2 rounded-lg border border-[#D8D1C7] bg-white px-3 text-xs font-bold text-[#33423F]">
                            <input
                              type="checkbox"
                              checked={editDraft.isActive}
                              onChange={event => setEditDraft(current => ({ ...current, isActive: event.target.checked }))}
                            />
                            متاحة
                          </label>
                        </div>
                      )}
                      {section.detailed && (
                        <>
                          <input value={editDraft.description} onChange={event => setEditDraft(current => ({ ...current, description: event.target.value }))} placeholder="وصف مختصر" className="field py-2 text-sm" />
                          <div className="grid grid-cols-2 gap-2">
                            <input value={editDraft.category} onChange={event => setEditDraft(current => ({ ...current, category: event.target.value }))} placeholder="التصنيف" className="field py-2 text-sm" />
                            {section.pricing ? (
                              <select value={editDraft.pricingType} onChange={event => setEditDraft(current => ({ ...current, pricingType: event.target.value }))} className="field py-2 text-sm bg-white">
                                {PRICING_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                              </select>
                            ) : (
                              <input type="number" min="0" value={editDraft.price} onChange={event => setEditDraft(current => ({ ...current, price: event.target.value }))} placeholder="السعر" className="field py-2 text-sm" dir="ltr" />
                            )}
                          </div>
                          {section.pricing && editDraft.pricingType === 'PRINT_MATRIX' ? (
                            <PrintMatrixFields config={editDraft.config} onChange={config => setEditDraft(current => ({ ...current, config }))} />
                          ) : section.pricing && (
                            <input type="number" min="0" value={editDraft.price} onChange={event => setEditDraft(current => ({ ...current, price: event.target.value }))} placeholder="السعر" className="field py-2 text-sm" dir="ltr" />
                          )}
                        </>
                      )}
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(section, item.id)} className="btn-primary flex-1 rounded-lg py-2 text-xs font-bold">حفظ</button>
                        <button onClick={cancelEdit} className="flex-1 rounded-lg border border-[#D8D1C7] py-2 text-xs font-bold text-[#5F6764]">إلغاء</button>
                      </div>
                    </div>
                  ) : (
                    <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-[#F5F1E8] px-4 py-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <strong className="block truncate text-sm text-[#0E3B34]">{item.name}</strong>
                          {section.cityManagement && (
                            <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold ${
                              item.isActive === false
                                ? 'bg-[#E8E5DF] text-[#6C716E]'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {item.isActive === false ? 'متوقفة' : 'متاحة'}
                            </span>
                          )}
                        </div>
                        {item.description && <span className="mt-1 block truncate text-[11px] text-[#5F6764]">{item.description}</span>}
                        {section.cityManagement && (
                          <span className="mt-1 block text-[10px] text-[#7A837C]">ترتيب الظهور: {item.sortOrder || 0}</span>
                        )}
                        {section.pricing && item.pricingType && (
                          <span className="mt-1 inline-block rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#0E3B34]">
                            {PRICING_LABELS[item.pricingType] || item.pricingType}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-none gap-3 text-xs font-bold">
                        {section.cityManagement && (
                          <button onClick={() => toggleCity(item)} className={item.isActive === false ? 'text-emerald-700' : 'text-[#A56B20]'}>
                            {item.isActive === false ? 'تفعيل' : 'إيقاف'}
                          </button>
                        )}
                        <button onClick={() => startEdit(item)} className="text-[#0E3B34]">تعديل</button>
                        <button onClick={() => remove(section, item.id)} className="text-red-600">حذف</button>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

function PrintMatrixFields({ config, onChange }: { config: PrintMatrixConfig; onChange: (config: PrintMatrixConfig) => void }) {
  return (
    <div className="rounded-xl border border-dashed border-[#D8D1C7] bg-[#FAF8F3] p-3">
      <p className="mb-2 text-[11px] font-bold text-[#5F6764]">أسعار المصفوفة (ريال لكل 10 صفحات)</p>
      <div className="grid grid-cols-2 gap-2">
        {MATRIX_FIELDS.map(([key, label]) => (
          <label key={key} className="block">
            <span className="mb-1 block text-[10px] text-[#5F6764]">{label}</span>
            <input
              type="number"
              min="0"
              value={config[key] ?? ''}
              onChange={event => onChange({ ...config, [key]: Number(event.target.value) || 0 })}
              className="field py-2 text-sm"
              dir="ltr"
            />
          </label>
        ))}
      </div>
    </div>
  )
}
