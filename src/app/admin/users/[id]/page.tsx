'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Badge, { getSpaceStatusBadge } from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import Link from 'next/link'

type UserDoc = { id: string; type: string; fileUrl: string; uploadedAt: string }
type User = {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  status: string
  createdAt: string
  spaces: { id: string; name: string; status: string; city: string }[]
  documents: UserDoc[]
}

const roleLabel: Record<string, string> = { ADMIN: 'مدير النظام', SELLER: 'صاحب مساحة', BUYER: 'مستأجر' }
const roleColor: Record<string, string> = {
  ADMIN: 'bg-[#C49A3C]/10 text-[#8a6b1f] border-[#C49A3C]/30',
  SELLER: 'bg-[#1B3A2D]/10 text-[#1B3A2D] border-[#1B3A2D]/20',
  BUYER: 'bg-blue-50 text-blue-700 border-blue-200',
}
const statusLabel: Record<string, string> = {
  ACTIVE: 'نشط',
  SUSPENDED: 'موقوف',
  PENDING_APPROVAL: 'بانتظار الاعتماد',
}
const statusVariant: Record<string, 'success' | 'danger' | 'warning'> = {
  ACTIVE: 'success',
  SUSPENDED: 'danger',
  PENDING_APPROVAL: 'warning',
}
const docTypeLabel: Record<string, string> = {
  NATIONAL_ID: 'الهوية الوطنية',
  COMMERCIAL_REGISTER: 'السجل التجاري',
}

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetch(`/api/admin/users/${id}`)
      .then(r => r.json())
      .then(data => { setUser(data.user); setLoading(false) })
  }, [id])

  async function updateUser(patch: { status?: string; role?: string }) {
    setActionLoading(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'فشل التحديث' })
      } else {
        setUser(prev => prev ? { ...prev, ...patch } : null)
        setMessage({ type: 'success', text: 'تم التحديث بنجاح' })
      }
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return <div className="p-8 flex justify-center"><Spinner size="lg" /></div>
  if (!user) return <div className="p-8 text-center text-gray-500">المستخدم غير موجود</div>

  const isPending = user.status === 'PENDING_APPROVAL'

  return (
    <div className="p-8">
      <Link href="/admin/users" className="text-[#6B7566] hover:text-[#1B3A2D] text-sm font-medium mb-6 inline-flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        العودة للمستخدمين
      </Link>

      {message && (
        <div className={`mb-5 rounded-xl px-4 py-3 text-sm ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Pending approval banner */}
      {isPending && (
        <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="font-bold text-amber-800 text-sm mb-1">هذا البائع بانتظار الاعتماد</h3>
              <p className="text-xs text-amber-700">راجع المستندات المرفقة ثم اعتمد أو ارفض الحساب</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => updateUser({ status: 'ACTIVE' })}
                disabled={actionLoading}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#1B3A2D] text-white hover:bg-[#0F2219] disabled:opacity-50"
              >
                اعتماد البائع
              </button>
              <button
                onClick={() => updateUser({ status: 'SUSPENDED' })}
                disabled={actionLoading}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 disabled:opacity-50"
              >
                رفض
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="card-elevated p-6 mb-6 flex items-start justify-between gap-6 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1B3A2D] to-[#0F2219] text-[#C49A3C] flex items-center justify-center text-2xl font-extrabold">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-[#14201A]">{user.name}</h1>
            <p className="text-[#6B7566] text-sm mt-0.5" dir="ltr">{user.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className={`chip border ${roleColor[user.role]}`}>{roleLabel[user.role]}</span>
              <Badge variant={statusVariant[user.status] || 'gray'}>
                {statusLabel[user.status] || user.status}
              </Badge>
            </div>
          </div>
        </div>
        {!isPending && (
          <button
            onClick={() => updateUser({ status: user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' })}
            disabled={actionLoading}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              user.status === 'ACTIVE'
                ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
            } disabled:opacity-50`}
          >
            {user.status === 'ACTIVE' ? 'تعليق الحساب' : 'تفعيل الحساب'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info + Documents */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="font-display font-extrabold text-[#14201A] text-base mb-4">معلومات الحساب</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <InfoRow label="الاسم" value={user.name} />
              <InfoRow label="البريد الإلكتروني" value={user.email} dir="ltr" />
              <InfoRow label="الجوال" value={user.phone || '—'} dir="ltr" />
              <InfoRow label="تاريخ التسجيل" value={new Date(user.createdAt).toLocaleDateString('en-US')} />
            </div>
          </Card>

          {/* Documents */}
          {user.documents && user.documents.length > 0 && (
            <Card>
              <h3 className="font-display font-extrabold text-[#14201A] text-base mb-4">المستندات المرفقة</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user.documents.map(doc => (
                  <DocLink key={doc.id} doc={doc} />
                ))}
              </div>
            </Card>
          )}

          {user.spaces.length > 0 && (
            <Card padding={false}>
              <div className="px-6 py-4 border-b border-[#ECE6D8] flex items-center justify-between">
                <h3 className="font-display font-extrabold text-[#14201A]">مساحاته ({user.spaces.length})</h3>
              </div>
              <div className="divide-y divide-[#ECE6D8]">
                {user.spaces.map(s => {
                  const { variant, label } = getSpaceStatusBadge(s.status)
                  return (
                    <div key={s.id} className="px-6 py-4 flex items-center justify-between hover:bg-[#F7F3EB]/50">
                      <div>
                        <p className="font-semibold text-[#14201A] text-sm">{s.name}</p>
                        <p className="text-[#6B7566] text-xs mt-0.5">{s.city}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={variant}>{label}</Badge>
                        <Link href={`/admin/spaces/${s.id}`} className="text-xs text-[#1B3A2D] font-semibold hover:underline">
                          عرض
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}
        </div>

        {/* Role management */}
        <div>
          <Card>
            <h3 className="font-display font-extrabold text-[#14201A] text-base mb-1">إدارة الصلاحيات</h3>
            <p className="text-[#6B7566] text-xs mb-4">تغيير دور المستخدم في المنصة</p>

            <div className="space-y-2">
              {(['BUYER', 'SELLER', 'ADMIN'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => updateUser({ role: r })}
                  disabled={actionLoading || user.role === r}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all border ${
                    user.role === r
                      ? 'border-[#1B3A2D] bg-[#1B3A2D]/5 text-[#1B3A2D]'
                      : 'border-[#ECE6D8] hover:border-[#1B3A2D]/40 hover:bg-[#F7F3EB]/50 text-[#4A554D]'
                  } disabled:cursor-not-allowed`}
                >
                  <span className="flex items-center gap-2">
                    {r === 'ADMIN' && <span className="text-[#C49A3C]">★</span>}
                    {roleLabel[r]}
                  </span>
                  {user.role === r && (
                    <svg className="w-4 h-4 text-[#1B3A2D]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-xl bg-[#F7F3EB]/60 border border-[#ECE6D8] text-[11px] text-[#6B7566] leading-relaxed">
              <strong className="text-[#1B3A2D]">ملاحظة:</strong> ترقية مستخدم إلى دور مدير النظام تمنحه صلاحيات كاملة على المنصة.
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function DocLink({ doc }: { doc: UserDoc }) {
  const [loading, setLoading] = useState(false)

  async function openDoc() {
    setLoading(true)
    try {
      const res = await fetch(`/api/documents/${doc.id}`)
      const data = await res.json()
      if (res.ok && data.url) {
        window.open(data.url, '_blank')
      } else {
        window.open(doc.fileUrl, '_blank')
      }
    } catch {
      window.open(doc.fileUrl, '_blank')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={openDoc}
      disabled={loading}
      className="flex items-center gap-3 p-4 rounded-xl border border-[#ECE6D8] hover:border-[#1B3A2D]/40 hover:bg-[#F7F3EB]/50 transition-all group text-start w-full disabled:opacity-60"
    >
      <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
        {loading ? (
          <svg className="animate-spin w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#14201A] group-hover:text-[#1B3A2D]">
          {docTypeLabel[doc.type] || doc.type}
        </p>
        <p className="text-xs text-[#6B7566]">
          {new Date(doc.uploadedAt).toLocaleDateString('en-US')}
        </p>
      </div>
      <svg className="w-4 h-4 text-[#6B7566] group-hover:text-[#1B3A2D]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
      </svg>
    </button>
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
