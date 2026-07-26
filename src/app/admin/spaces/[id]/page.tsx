'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Badge, { getSpaceStatusBadge } from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import Link from 'next/link'

const DAY_NAMES = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
const POLICY_LABEL: Record<string, { name: string; desc: string; color: string }> = {
  FLEXIBLE: { name: 'مرنة', desc: 'استحقاق كامل عند الإلغاء قبل 24 ساعة', color: 'bg-green-50 text-green-700 border-green-200' },
  MODERATE: { name: 'متوسطة', desc: 'استحقاق 50% عند الإلغاء قبل 5 أيام', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  STRICT: { name: 'صارمة', desc: 'غير قابلة للاسترداد', color: 'bg-red-50 text-red-700 border-red-200' },
}

type WorkingHour = { dayOfWeek: number; isOpen: boolean; openTime: string; closeTime: string }
type Service = { id: string; name: string; description: string | null; price: number; pricingType: string }
type Rule = { id: string; rule: string }
type Space = {
  id: string
  name: string
  description: string | null
  city: string
  district: string | null
  address: string | null
  streetName: string | null
  buildingNumber: string | null
  postalCode: string | null
  landmarks: string | null
  latitude: number | null
  longitude: number | null
  capacity: number | null
  price: number
  pricePeriod: string
  advertisingLicenseNumber: string | null
  status: string
  adminNotes: string | null
  createdAt: string
  minBookingHours: number | null
  maxAdvanceBookingDays: number | null
  cancellationPolicy: string
  type: { name: string }
  seller: { id: string; name: string; email: string; phone: string | null }
  images: { url: string; order: number }[]
  amenities: { amenity: { name: string } }[]
  workingHours: WorkingHour[]
  services: Service[]
  rules: Rule[]
}

export default function AdminSpaceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [space, setSpace] = useState<Space | null>(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [imageUrls, setImageUrls] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    fetch(`/api/spaces/${id}`)
      .then(r => r.json())
      .then(data => {
        setSpace(data.space)
        setNotes(data.space?.adminNotes || '')
        setLicenseNumber(data.space?.advertisingLicenseNumber || '')
        setImageUrls((data.space?.images || []).map((image: { url: string }) => image.url).join('\n'))
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
      setMessage(status === 'APPROVED' ? 'تم اعتماد المساحة بنجاح' : status === 'REJECTED' ? 'تم رفض المساحة' : 'تم تعطيل المساحة')
    }
    setActionLoading(false)
  }

  async function saveManagedData() {
    setActionLoading(true)
    setMessage('')
    const res = await fetch(`/api/admin/spaces/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        advertisingLicenseNumber: licenseNumber,
        imageUrls: imageUrls.split('\n').map((url) => url.trim()).filter(Boolean),
      }),
    })
    if (res.ok) {
      const data = await res.json()
      setSpace(data.space)
      setMessage('تم حفظ بيانات الإعلان والصور.')
    }
    setActionLoading(false)
  }

  if (loading) return <div className="p-8 flex justify-center"><Spinner size="lg" /></div>
  if (!space) return <div className="p-8 text-center text-gray-500">المساحة غير موجودة</div>

  const { variant, label } = getSpaceStatusBadge(space.status)
  const sortedImages = [...space.images].sort((a, b) => a.order - b.order)
  const openDays = (space.workingHours || []).filter(wh => wh.isOpen).sort((a, b) => a.dayOfWeek - b.dayOfWeek)
  const policy = POLICY_LABEL[space.cancellationPolicy] || POLICY_LABEL.FLEXIBLE
  const priceLabel = space.pricePeriod === 'day' ? 'يوم' : 'ساعة'

  return (
    <div className="p-8">
      <Link href="/admin/spaces" className="text-[#6B7566] hover:text-[#1B3A2D] text-sm font-medium mb-6 inline-flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        العودة للمساحات
      </Link>

      {message && (
        <div className="mb-5 rounded-xl px-4 py-3 text-sm bg-green-50 border border-green-200 text-green-700">
          {message}
        </div>
      )}

      {/* Header */}
      <div className="card-elevated p-6 mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#14201A]">{space.name}</h1>
          <p className="text-[#6B7566] text-sm mt-1">{space.type.name} · {space.city}{space.district ? ` · ${space.district}` : ''}</p>
          <p className="text-xs text-[#6B7566] mt-1">تاريخ الإنشاء: {new Date(space.createdAt).toLocaleDateString('en-US')}</p>
        </div>
        <Badge variant={variant}>{label}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Images */}
          {sortedImages.length > 0 && (
            <div>
              <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100">
                <img src={sortedImages[activeImage]?.url} alt={space.name} className="w-full h-full object-cover" />
              </div>
              {sortedImages.length > 1 && (
                <div className="flex gap-2 mt-3">
                  {sortedImages.map((img, i) => (
                    <button key={i} onClick={() => setActiveImage(i)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImage ? 'border-[#1B3A2D]' : 'border-transparent'}`}>
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Space Details */}
          <Card>
            <h3 className="font-display font-extrabold text-[#14201A] text-base mb-4">تفاصيل المساحة</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <InfoRow label="المدينة" value={space.city} />
              <InfoRow label="الحي" value={space.district || '—'} />
              <InfoRow label="السعر" value={`${space.price.toLocaleString('en-US')} ر.س / ${priceLabel}`} />
              <InfoRow label="الطاقة الاستيعابية" value={space.capacity ? `${space.capacity} شخص` : '—'} />
              {space.minBookingHours && <InfoRow label="الحد الأدنى للحجز" value={`${space.minBookingHours} ساعات`} />}
              {space.maxAdvanceBookingDays && <InfoRow label="الحجز المسبق" value={`حتى ${space.maxAdvanceBookingDays} يوم`} />}
            </div>

            {/* Full Address */}
            {(space.address || space.streetName || space.buildingNumber || space.postalCode) && (
              <div className="mt-4 pt-4 border-t border-[#E8E3D8]">
                <p className="text-[11px] font-bold text-[#6B7566] mb-2">العنوان التفصيلي</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {space.streetName && <InfoRow label="الشارع" value={space.streetName} />}
                  {space.buildingNumber && <InfoRow label="رقم المبنى" value={space.buildingNumber} />}
                  {space.postalCode && <InfoRow label="الرمز البريدي" value={space.postalCode} />}
                  {space.address && <InfoRow label="العنوان" value={space.address} />}
                </div>
                {space.landmarks && (
                  <p className="text-xs text-[#6B7566] mt-2">معالم قريبة: {space.landmarks}</p>
                )}
              </div>
            )}

            {/* Coordinates */}
            {space.latitude && space.longitude && (
              <div className="mt-3 pt-3 border-t border-[#E8E3D8]">
                <p className="text-[11px] font-bold text-[#6B7566] mb-1">الإحداثيات</p>
                <p className="text-xs text-[#4A554D]" dir="ltr">{space.latitude}, {space.longitude}</p>
              </div>
            )}

            {space.description && (
              <div className="mt-4 pt-4 border-t border-[#E8E3D8]">
                <p className="text-[11px] font-bold text-[#6B7566] mb-1">الوصف</p>
                <p className="text-sm text-[#4A554D] leading-relaxed">{space.description}</p>
              </div>
            )}
          </Card>

          {/* Working Hours */}
          {openDays.length > 0 && (
            <Card>
              <h3 className="font-display font-extrabold text-[#14201A] text-base mb-4">أيام وساعات العمل</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DAY_NAMES.map((name, i) => {
                  const wh = openDays.find(d => d.dayOfWeek === i)
                  return (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-xl text-sm ${wh ? 'bg-[#F7F3EB]' : 'bg-gray-50'}`}>
                      <span className={`font-medium ${wh ? 'text-[#14201A]' : 'text-[#6B7566]'}`}>{name}</span>
                      {wh ? (
                        <span className="text-[#1B3A2D] font-medium" dir="ltr">{wh.openTime} - {wh.closeTime}</span>
                      ) : (
                        <span className="text-[#6B7566] text-xs">مغلق</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </Card>
          )}

          {/* Amenities */}
          {space.amenities.length > 0 && (
            <Card>
              <h3 className="font-display font-extrabold text-[#14201A] text-base mb-3">المرافق والتجهيزات</h3>
              <div className="flex flex-wrap gap-2">
                {space.amenities.map(({ amenity }, i) => (
                  <span key={i} className="bg-[#F7F3EB] text-[#1B3A2D] text-xs px-3 py-1.5 rounded-full border border-[#E8E3D8]">{amenity.name}</span>
                ))}
              </div>
            </Card>
          )}

          {/* Services */}
          {space.services && space.services.length > 0 && (
            <Card>
              <h3 className="font-display font-extrabold text-[#14201A] text-base mb-4">خدمات إضافية</h3>
              <div className="space-y-2">
                {space.services.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-[#F7F3EB]">
                    <div>
                      <p className="text-sm font-medium text-[#14201A]">{s.name}</p>
                      {s.description && <p className="text-xs text-[#6B7566] mt-0.5">{s.description}</p>}
                    </div>
                    <div className="text-end">
                      <span className="text-sm font-bold text-[#1B3A2D]">{s.price.toLocaleString('en-US')} ر.س</span>
                      <p className="text-[10px] text-[#6B7566]">{s.pricingType === 'PER_PERSON' ? 'للشخص' : 'للحجز'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Rules */}
          {space.rules && space.rules.length > 0 && (
            <Card>
              <h3 className="font-display font-extrabold text-[#14201A] text-base mb-3">قواعد الاستخدام</h3>
              <ul className="space-y-2">
                {space.rules.map(r => (
                  <li key={r.id} className="flex items-center gap-2 text-sm text-[#4A554D]">
                    <svg className="w-3.5 h-3.5 text-[#C49A3C] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {r.rule}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Map */}
          {space.latitude && space.longitude && (
            <Card>
              <h3 className="font-display font-extrabold text-[#14201A] text-base mb-4">الموقع على الخريطة</h3>
              <div className="rounded-xl overflow-hidden border border-[#E8E3D8]">
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${space.longitude - 0.01},${space.latitude - 0.01},${space.longitude + 0.01},${space.latitude + 0.01}&layer=mapnik&marker=${space.latitude},${space.longitude}`}
                  className="w-full h-64"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Seller Info */}
          <Card>
            <h3 className="font-display font-extrabold text-[#14201A] text-base mb-3">صاحب المساحة</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1B3A2D] to-[#0F2219] flex items-center justify-center text-[#C49A3C] font-bold">
                {space.seller.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#14201A]">{space.seller.name}</p>
                <p className="text-xs text-[#6B7566]" dir="ltr">{space.seller.email}</p>
              </div>
            </div>
            {space.seller.phone && (
              <div className="text-sm text-[#4A554D]">
                <span className="text-[11px] font-bold text-[#6B7566]">الجوال</span>
                <p className="font-medium" dir="ltr">{space.seller.phone}</p>
              </div>
            )}
            <Link href={`/admin/users/${space.seller.id}`} className="block mt-3 text-xs text-[#1B3A2D] font-semibold hover:underline text-center">
              عرض ملف البائع
            </Link>
          </Card>

          {/* Cancellation Policy */}
          <Card>
            <h3 className="font-display font-extrabold text-[#14201A] text-base mb-3">سياسة الإلغاء</h3>
            <div className={`p-3 rounded-xl border text-center ${policy.color}`}>
              <p className="text-sm font-bold">{policy.name}</p>
              <p className="text-xs mt-0.5">{policy.desc}</p>
            </div>
          </Card>

          <Card>
            <h3 className="mb-3 font-display text-base font-extrabold text-[#14201A]">بيانات تديرها الإدارة</h3>
            <label className="mb-3 block text-xs font-bold text-[#4A554D]">
              رقم الترخيص الإعلاني
              <input dir="ltr" value={licenseNumber} onChange={(event) => setLicenseNumber(event.target.value)} className="mt-1.5 w-full rounded-xl border border-[#E8E3D8] px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="block text-xs font-bold text-[#4A554D]">
              روابط الصور (رابط في كل سطر)
              <textarea dir="ltr" value={imageUrls} onChange={(event) => setImageUrls(event.target.value)} rows={5} className="mt-1.5 w-full resize-y rounded-xl border border-[#E8E3D8] px-3 py-2.5 text-left text-xs font-normal" />
            </label>
            <button onClick={saveManagedData} disabled={actionLoading} className="mt-3 w-full rounded-xl bg-[#C49A3C] py-2.5 text-sm font-bold text-[#14201A] disabled:opacity-50">حفظ البيانات</button>
          </Card>

          {/* Admin Actions */}
          <Card>
            <h3 className="font-display font-extrabold text-[#14201A] text-base mb-3">قرار الإدارة</h3>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
              placeholder="ملاحظات للبائع (سبب الرفض أو أي ملاحظات)..."
              className="w-full px-3 py-2.5 rounded-xl border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D] resize-none mb-3"
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleAction('APPROVED')}
                disabled={actionLoading || space.status === 'APPROVED'}
                className="flex-1 bg-[#1B3A2D] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0F2219] disabled:opacity-50"
              >
                اعتماد
              </button>
              <button
                onClick={() => handleAction('REJECTED')}
                disabled={actionLoading || space.status === 'REJECTED'}
                className="flex-1 bg-red-50 text-red-700 border border-red-200 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-100 disabled:opacity-50"
              >
                رفض
              </button>
            </div>
            <button
              onClick={() => handleAction('INACTIVE')}
              disabled={actionLoading}
              className="w-full mt-2 bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
            >
              تعطيل
            </button>
          </Card>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value, dir }: { label: string; value: string; dir?: 'ltr' | 'rtl' }) {
  return (
    <div>
      <div className="text-[11px] font-bold text-[#6B7566] tracking-wide mb-1">{label}</div>
      <div className="text-sm text-[#14201A] font-medium" dir={dir}>{value}</div>
    </div>
  )
}
