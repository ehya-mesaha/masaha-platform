'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Badge, { getSpaceStatusBadge } from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import Link from 'next/link'

type Space = {
  id: string
  name: string
  description: string | null
  city: string
  district: string | null
  address: string | null
  capacity: number | null
  price: number
  pricePeriod: string
  status: string
  adminNotes: string | null
  createdAt: string
  type: { name: string }
  seller: { name: string; email: string; phone: string | null }
  images: { url: string; order: number }[]
  amenities: { amenity: { name: string } }[]
}

export default function AdminSpaceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [space, setSpace] = useState<Space | null>(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch(`/api/spaces/${id}`)
      .then(r => r.json())
      .then(data => {
        setSpace(data.space)
        setNotes(data.space?.adminNotes || '')
        setLoading(false)
      })
  }, [id])

  async function handleAction(status: string) {
    setActionLoading(true)
    setMessage('')
    const res = await fetch(`/api/admin/spaces/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminNotes: notes }),
    })
    if (res.ok) {
      const data = await res.json()
      setSpace(prev => prev ? { ...prev, status: data.space.status, adminNotes: data.space.adminNotes } : null)
      setMessage(status === 'APPROVED' ? 'تم اعتماد المساحة بنجاح ✓' : 'تم رفض المساحة')
    }
    setActionLoading(false)
  }

  if (loading) return <div className="p-8 flex justify-center"><Spinner size="lg" /></div>
  if (!space) return <div className="p-8 text-center text-gray-500">المساحة غير موجودة</div>

  const { variant, label } = getSpaceStatusBadge(space.status)

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/spaces" className="text-gray-400 hover:text-gray-600 text-sm">← المساحات</Link>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{space.name}</h1>
          <p className="text-gray-500 text-sm mt-1">{space.type.name} · {space.city}</p>
        </div>
        <Badge variant={variant}>{label}</Badge>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg mb-6">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {space.images.length > 0 && (
            <div className="h-56 rounded-2xl overflow-hidden">
              <img src={space.images[0].url} alt={space.name} className="w-full h-full object-cover" />
            </div>
          )}

          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">تفاصيل المساحة</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">المدينة</span><p className="font-medium mt-0.5">{space.city}</p></div>
              <div><span className="text-gray-500">الحي</span><p className="font-medium mt-0.5">{space.district || '-'}</p></div>
              <div><span className="text-gray-500">السعر</span><p className="font-medium mt-0.5">{space.price} ر.س / {space.pricePeriod === 'day' ? 'يوم' : 'ساعة'}</p></div>
              <div><span className="text-gray-500">الطاقة</span><p className="font-medium mt-0.5">{space.capacity || '-'} شخص</p></div>
              {space.address && <div className="col-span-2"><span className="text-gray-500">العنوان</span><p className="font-medium mt-0.5">{space.address}</p></div>}
            </div>
            {space.description && (
              <div className="mt-4 pt-4 border-t border-[#E8E3D8]">
                <p className="text-gray-500 text-xs mb-1">الوصف</p>
                <p className="text-gray-700 text-sm">{space.description}</p>
              </div>
            )}
          </Card>

          {space.amenities.length > 0 && (
            <Card>
              <h3 className="font-semibold text-gray-900 mb-3">المرافق</h3>
              <div className="flex flex-wrap gap-2">
                {space.amenities.map(({ amenity }, i) => (
                  <span key={i} className="bg-[#F5F0E6] text-[#1B3A2D] text-xs px-3 py-1.5 rounded-full">{amenity.name}</span>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-3">صاحب المساحة</h3>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-500">الاسم</span><p className="font-medium mt-0.5">{space.seller.name}</p></div>
              <div><span className="text-gray-500">البريد</span><p className="font-medium mt-0.5">{space.seller.email}</p></div>
              {space.seller.phone && <div><span className="text-gray-500">الجوال</span><p className="font-medium mt-0.5">{space.seller.phone}</p></div>}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-gray-900 mb-3">قرار الإدارة</h3>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
              placeholder="ملاحظات للبائع (سبب الرفض أو أي ملاحظات)..."
              className="w-full px-3 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D] resize-none mb-3"
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleAction('APPROVED')}
                disabled={actionLoading || space.status === 'APPROVED'}
                className="flex-1 bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                اعتماد
              </button>
              <button
                onClick={() => handleAction('REJECTED')}
                disabled={actionLoading || space.status === 'REJECTED'}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                رفض
              </button>
            </div>
            <button
              onClick={() => handleAction('INACTIVE')}
              disabled={actionLoading}
              className="w-full mt-2 bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-300 disabled:opacity-50"
            >
              تعطيل
            </button>
          </Card>
        </div>
      </div>
    </div>
  )
}
