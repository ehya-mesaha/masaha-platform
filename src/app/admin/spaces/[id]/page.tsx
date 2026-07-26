'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Badge, { getSpaceStatusBadge } from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import Link from 'next/link'

const DAY_NAMES = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
const POLICY_LABEL: Record<string, { name: string; desc: string; color: string }> = {
  FLEXIBLE: { name: 'مرنة', desc: 'استرداد كامل للمبلغ عند إلغاء الحجز', color: 'bg-green-50 text-green-700 border-green-200' },
  MODERATE: { name: 'متوسطة', desc: 'استرداد 50% من مبلغ الحجز', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  STRICT: { name: 'صارمة', desc: 'لا يُسترد أي مبلغ عند إلغاء الحجز', color: 'bg-red-50 text-red-700 border-red-200' },
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
      setImageUrls((data.space?.images || []).map((image: { url: string }) => image.url).join('\n'))
      setMessage('تم حفظ بيانات الإعلان والصور.')
    }
    setActionLoading(false)
  }

  function removeManagedImage(index: number) {
    const currentUrls = imageUrls.split('\n').map(url => url.trim()).filter(Boolean)
    const nextUrls = currentUrls.filter((_, currentIndex) => currentIndex !== index)
    setImageUrls(nextUrls.join('\n'))
    setActiveImage(current => Math.min(current, Math.max(0, nextUrls.length - 1)))
    setMessage('تم حذف الصورة من المعاينة. اضغط «حفظ البيانات» لتأكيد التغيير.')
  }

  if (loading) return <div className="p-8 flex justify-center"><Spinner size="lg" /></div>
  if (!space) return <div className="p-8 text-center text-gray-500">المساحة غير موجودة</div>

  const { variant, label } = getSpaceStatusBadge(space.status)
  const sortedImages = imageUrls
    .split('\n')
    .map(url => url.trim())
    .filter(Boolean)
    .map((url, order) => ({ url, order }))
  const safeActiveImage = Math.min(activeImage, Math.max(0, sortedImages.length - 1))
  const openDays = (space.workingHours || []).filter(wh => wh.isOpen).sort((a, b) => a.dayOfWeek - b.dayOfWeek)
  const policy = POLICY_LABEL[space.cancellationPolicy] || POLICY_LABEL.FLEXIBLE
  const priceLabel = space.pricePeriod === 'day' ? 'يوم' : 'ساعة'

  return (
    <div className="dashboard-page">
      <Link href="/admin/spaces" className="text-[#5F6764] hover:text-[#0E3B34] text-sm font-medium mb-6 inline-flex items-center gap-1">
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
          <h1 className="font-display text-2xl font-extrabold text-[#1B1B1B]">{space.name}</h1>
          <p className="text-[#5F6764] text-sm mt-1">{space.type.name} · {space.city}{space.district ? ` · ${space.district}` : ''}</p>
          <p className="text-xs text-[#5F6764] mt-1">تاريخ الإنشاء: {new Date(space.createdAt).toLocaleDateString('en-US')}</p>
        </div>
        <Badge variant={variant}>{label}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Images */}
          <div className="rounded-2xl border border-[#D8D1C7] bg-white p-3">
            <div className="mb-3 flex items-center justify-between gap-3 px-1">
              <div>
                <h2 className="text-sm font-extrabold text-[#1B1B1B]">صور المساحة</h2>
                <p className="mt-0.5 text-[11px] text-[#5F6764]">يمكنك معاينة أي صورة أو حذفها، ثم حفظ التغيير من لوحة الإدارة.</p>
              </div>
              <span className="rounded-full bg-[#F5F1E8] px-3 py-1 text-[10px] font-bold text-[#0E3B34]">{sortedImages.length} صور</span>
            </div>
            {sortedImages.length > 0 ? (
              <>
              <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100">
                <img src={sortedImages[safeActiveImage]?.url} alt={space.name} className="w-full h-full object-cover" />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {sortedImages.map((img, i) => (
                    <div key={`${img.url}-${i}`} className={`group relative aspect-square overflow-hidden rounded-xl border-2 transition-colors ${i === safeActiveImage ? 'border-[#0E3B34]' : 'border-transparent'}`}>
                      <button type="button" onClick={() => setActiveImage(i)} className="h-full w-full">
                        <img src={img.url} alt="" className="h-full w-full object-cover" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeManagedImage(i)}
                        className="absolute end-1 top-1 grid h-7 w-7 place-items-center rounded-lg bg-red-600 text-white shadow-lg transition hover:bg-red-700"
                        aria-label={`حذف الصورة ${i + 1}`}
                        title="حذف الصورة"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
              </div>
              </>
            ) : (
              <div className="grid aspect-video place-items-center rounded-2xl border border-dashed border-[#D8D1C7] bg-[#FAF8F3] text-center">
                <div>
                  <p className="text-sm font-bold text-[#1B1B1B]">لا توجد صور حالياً</p>
                  <p className="mt-1 text-xs text-[#5F6764]">يمكن إضافة رابط جديد من لوحة البيانات.</p>
                </div>
              </div>
            )}
          </div>

          {/* Space Details */}
          <Card>
            <h3 className="font-display font-extrabold text-[#1B1B1B] text-base mb-4">تفاصيل المساحة</h3>
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
              <div className="mt-4 pt-4 border-t border-[#D8D1C7]">
                <p className="text-[11px] font-bold text-[#5F6764] mb-2">العنوان التفصيلي</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {space.streetName && <InfoRow label="الشارع" value={space.streetName} />}
                  {space.buildingNumber && <InfoRow label="رقم المبنى" value={space.buildingNumber} />}
                  {space.postalCode && <InfoRow label="الرمز البريدي" value={space.postalCode} />}
                  {space.address && <InfoRow label="العنوان" value={space.address} />}
                </div>
                {space.landmarks && (
                  <p className="text-xs text-[#5F6764] mt-2">معالم قريبة: {space.landmarks}</p>
                )}
              </div>
            )}

            {/* Coordinates */}
            {space.latitude && space.longitude && (
              <div className="mt-3 pt-3 border-t border-[#D8D1C7]">
                <p className="text-[11px] font-bold text-[#5F6764] mb-1">الإحداثيات</p>
                <p className="text-xs text-[#3F4B47]" dir="ltr">{space.latitude}, {space.longitude}</p>
              </div>
            )}

            {space.description && (
              <div className="mt-4 pt-4 border-t border-[#D8D1C7]">
                <p className="text-[11px] font-bold text-[#5F6764] mb-1">الوصف</p>
                <p className="text-sm text-[#3F4B47] leading-relaxed">{space.description}</p>
              </div>
            )}
          </Card>

          {/* Working Hours */}
          {openDays.length > 0 && (
            <Card>
              <h3 className="font-display font-extrabold text-[#1B1B1B] text-base mb-4">أيام وساعات العمل</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DAY_NAMES.map((name, i) => {
                  const wh = openDays.find(d => d.dayOfWeek === i)
                  return (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-xl text-sm ${wh ? 'bg-[#F5F1E8]' : 'bg-gray-50'}`}>
                      <span className={`font-medium ${wh ? 'text-[#1B1B1B]' : 'text-[#5F6764]'}`}>{name}</span>
                      {wh ? (
                        <span className="text-[#0E3B34] font-medium" dir="ltr">{wh.openTime} - {wh.closeTime}</span>
                      ) : (
                        <span className="text-[#5F6764] text-xs">مغلق</span>
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
              <h3 className="font-display font-extrabold text-[#1B1B1B] text-base mb-3">المرافق والتجهيزات</h3>
              <div className="flex flex-wrap gap-2">
                {space.amenities.map(({ amenity }, i) => (
                  <span key={i} className="bg-[#F5F1E8] text-[#0E3B34] text-xs px-3 py-1.5 rounded-full border border-[#D8D1C7]">{amenity.name}</span>
                ))}
              </div>
            </Card>
          )}

          {/* Services */}
          <Card>
              <h3 className="font-display font-extrabold text-[#1B1B1B] text-base mb-4">خدمات إضافية</h3>
              {space.services && space.services.length > 0 ? (
                <div className="space-y-2">
                  {space.services.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-[#F5F1E8]">
                    <div>
                      <p className="text-sm font-medium text-[#1B1B1B]">{s.name}</p>
                      {s.description && <p className="text-xs text-[#5F6764] mt-0.5">{s.description}</p>}
                    </div>
                    <div className="text-end">
                      <span className="text-sm font-bold text-[#0E3B34]">{s.price.toLocaleString('en-US')} ر.س</span>
                      <p className="text-[10px] text-[#5F6764]">{s.pricingType === 'PER_PERSON' ? 'للشخص' : 'للحجز'}</p>
                    </div>
                  </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl border border-dashed border-[#D8D1C7] bg-[#FAF8F3] p-4 text-sm text-[#5F6764]">لا توجد خدمات مفعلة لهذه المساحة.</p>
              )}
            </Card>

          {/* Rules */}
          <Card>
              <h3 className="font-display font-extrabold text-[#1B1B1B] text-base mb-3">قواعد الاستخدام</h3>
              {space.rules && space.rules.length > 0 ? (
                <ul className="space-y-2">
                  {space.rules.map(r => (
                  <li key={r.id} className="flex items-center gap-2 text-sm text-[#3F4B47]">
                    <svg className="w-3.5 h-3.5 text-[#B99A63] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {r.rule}
                  </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-xl border border-dashed border-[#D8D1C7] bg-[#FAF8F3] p-4 text-sm text-[#5F6764]">لم تُسجل قواعد استخدام لهذه المساحة.</p>
              )}
            </Card>

          {/* Map */}
          {space.latitude && space.longitude && (
            <Card>
              <h3 className="font-display font-extrabold text-[#1B1B1B] text-base mb-4">الموقع على الخريطة</h3>
              <div className="rounded-xl overflow-hidden border border-[#D8D1C7]">
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
            <h3 className="font-display font-extrabold text-[#1B1B1B] text-base mb-3">صاحب المساحة</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0E3B34] to-[#092C27] flex items-center justify-center text-[#B99A63] font-bold">
                {space.seller.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1B1B1B]">{space.seller.name}</p>
                <p className="text-xs text-[#5F6764]" dir="ltr">{space.seller.email}</p>
              </div>
            </div>
            {space.seller.phone && (
              <div className="text-sm text-[#3F4B47]">
                <span className="text-[11px] font-bold text-[#5F6764]">الجوال</span>
                <p className="font-medium" dir="ltr">{space.seller.phone}</p>
              </div>
            )}
            <Link href={`/admin/users/${space.seller.id}`} className="block mt-3 text-xs text-[#0E3B34] font-semibold hover:underline text-center">
              عرض ملف البائع
            </Link>
          </Card>

          {/* Cancellation Policy */}
          <Card>
            <h3 className="font-display font-extrabold text-[#1B1B1B] text-base mb-3">سياسة الإلغاء</h3>
            <div className={`p-3 rounded-xl border text-center ${policy.color}`}>
              <p className="text-sm font-bold">{policy.name}</p>
              <p className="text-xs mt-0.5">{policy.desc}</p>
            </div>
          </Card>

          <Card>
            <h3 className="mb-3 font-display text-base font-extrabold text-[#1B1B1B]">بيانات تديرها الإدارة</h3>
            <label className="mb-3 block text-xs font-bold text-[#3F4B47]">
              رقم الترخيص الإعلاني
              <input dir="ltr" value={licenseNumber} onChange={(event) => setLicenseNumber(event.target.value)} className="mt-1.5 w-full rounded-xl border border-[#D8D1C7] px-3 py-2.5 text-sm font-normal" />
            </label>
            <label className="block text-xs font-bold text-[#3F4B47]">
              روابط الصور (رابط في كل سطر)
              <textarea dir="ltr" value={imageUrls} onChange={(event) => setImageUrls(event.target.value)} rows={5} className="mt-1.5 w-full resize-y rounded-xl border border-[#D8D1C7] px-3 py-2.5 text-left text-xs font-normal" />
            </label>
            <p className="mt-2 text-[10px] leading-5 text-[#5F6764]">يمكنك حذف الصور مباشرة من المعرض أو تعديل الروابط هنا. لن يُطبق التغيير حتى تضغط حفظ.</p>
            <button onClick={saveManagedData} disabled={actionLoading} className="mt-3 w-full rounded-xl bg-[#B99A63] py-2.5 text-sm font-bold text-[#1B1B1B] disabled:opacity-50">حفظ البيانات</button>
          </Card>

          {/* Admin Actions */}
          <Card>
            <h3 className="font-display font-extrabold text-[#1B1B1B] text-base mb-3">قرار الإدارة</h3>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
              placeholder="ملاحظات للبائع (سبب الرفض أو أي ملاحظات)..."
              className="w-full px-3 py-2.5 rounded-xl border border-[#D8D1C7] text-sm focus:outline-none focus:border-[#0E3B34] resize-none mb-3"
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleAction('APPROVED')}
                disabled={actionLoading || space.status === 'APPROVED'}
                className="flex-1 bg-[#0E3B34] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#092C27] disabled:opacity-50"
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
      <div className="text-[11px] font-bold text-[#5F6764] tracking-wide mb-1">{label}</div>
      <div className="text-sm text-[#1B1B1B] font-medium" dir={dir}>{value}</div>
    </div>
  )
}
