'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'

type SpaceType = { id: string; name: string }
type Amenity = { id: string; name: string; icon: string | null }

export default function AdminCategoriesPage() {
  const [types, setTypes] = useState<SpaceType[]>([])
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [loading, setLoading] = useState(true)
  const [newType, setNewType] = useState('')
  const [newAmenity, setNewAmenity] = useState('')
  const [newAmenityIcon, setNewAmenityIcon] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/categories')
      .then(r => r.json())
      .then(data => {
        setTypes(data.types || [])
        setAmenities(data.amenities || [])
        setLoading(false)
      })
  }, [])

  async function addType() {
    if (!newType.trim()) return
    setSaving(true)
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'space-type', name: newType }),
    })
    if (res.ok) {
      const data = await res.json()
      setTypes(p => [...p, data.item])
      setNewType('')
    }
    setSaving(false)
  }

  async function addAmenity() {
    if (!newAmenity.trim()) return
    setSaving(true)
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'amenity', name: newAmenity, icon: newAmenityIcon }),
    })
    if (res.ok) {
      const data = await res.json()
      setAmenities(p => [...p, data.item])
      setNewAmenity('')
      setNewAmenityIcon('')
    }
    setSaving(false)
  }

  async function deleteType(id: string) {
    if (!confirm('هل أنت متأكد من الحذف؟')) return
    const res = await fetch('/api/admin/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'space-type', id }),
    })
    if (res.ok) setTypes(p => p.filter(t => t.id !== id))
  }

  async function deleteAmenity(id: string) {
    if (!confirm('هل أنت متأكد من الحذف؟')) return
    const res = await fetch('/api/admin/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'amenity', id }),
    })
    if (res.ok) setAmenities(p => p.filter(a => a.id !== id))
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">التصنيفات والمرافق</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Space Types */}
        <div>
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">أنواع المساحات</h3>

            <div className="flex gap-2 mb-4">
              <input
                value={newType}
                onChange={e => setNewType(e.target.value)}
                placeholder="اسم النوع..."
                className="flex-1 px-3 py-2 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
              />
              <button
                onClick={addType}
                disabled={saving || !newType.trim()}
                className="bg-[#1B3A2D] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0F2219] disabled:opacity-60"
              >
                إضافة
              </button>
            </div>

            <div className="space-y-2">
              {types.map(t => (
                <div key={t.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{t.name}</span>
                  <button
                    onClick={() => deleteType(t.id)}
                    className="text-red-500 hover:text-red-700 text-xs font-medium"
                  >
                    حذف
                  </button>
                </div>
              ))}
              {!loading && types.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">لا توجد أنواع</p>
              )}
            </div>
          </Card>
        </div>

        {/* Amenities */}
        <div>
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">المرافق والخدمات</h3>

            <div className="flex gap-2 mb-2">
              <input
                value={newAmenity}
                onChange={e => setNewAmenity(e.target.value)}
                placeholder="اسم المرفق..."
                className="flex-1 px-3 py-2 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
              />
              <input
                value={newAmenityIcon}
                onChange={e => setNewAmenityIcon(e.target.value)}
                placeholder="أيقونة"
                className="w-20 px-3 py-2 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
              />
              <button
                onClick={addAmenity}
                disabled={saving || !newAmenity.trim()}
                className="bg-[#1B3A2D] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0F2219] disabled:opacity-60"
              >
                إضافة
              </button>
            </div>

            <div className="space-y-2 mt-4">
              {amenities.map(a => (
                <div key={a.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {a.icon && <span className="text-sm">{a.icon}</span>}
                    <span className="text-sm text-gray-700">{a.name}</span>
                  </div>
                  <button
                    onClick={() => deleteAmenity(a.id)}
                    className="text-red-500 hover:text-red-700 text-xs font-medium"
                  >
                    حذف
                  </button>
                </div>
              ))}
              {!loading && amenities.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">لا توجد مرافق</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
