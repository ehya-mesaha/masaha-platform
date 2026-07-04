'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Badge, { getSpaceStatusBadge } from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import Link from 'next/link'

type User = {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  status: string
  createdAt: string
  spaces: { id: string; name: string; status: string; city: string }[]
}

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/users/${id}`)
      .then(r => r.json())
      .then(data => { setUser(data.user); setLoading(false) })
  }, [id])

  async function toggleStatus() {
    if (!user) return
    setActionLoading(true)
    const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      setUser(prev => prev ? { ...prev, status: newStatus } : null)
    }
    setActionLoading(false)
  }

  const roleLabel: Record<string, string> = { ADMIN: 'مدير', SELLER: 'صاحب مساحة', BUYER: 'مستأجر' }

  if (loading) return <div className="p-8 flex justify-center"><Spinner size="lg" /></div>
  if (!user) return <div className="p-8 text-center text-gray-500">المستخدم غير موجود</div>

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/users" className="text-gray-400 hover:text-gray-600 text-sm">← المستخدمون</Link>
      </div>

      <div className="max-w-2xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500 text-sm mt-1">{roleLabel[user.role]}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={user.status === 'ACTIVE' ? 'success' : 'danger'}>
              {user.status === 'ACTIVE' ? 'نشط' : 'موقوف'}
            </Badge>
            <button
              onClick={toggleStatus}
              disabled={actionLoading || user.role === 'ADMIN'}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                user.status === 'ACTIVE'
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              } disabled:opacity-50`}
            >
              {user.status === 'ACTIVE' ? 'تعليق الحساب' : 'تفعيل الحساب'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">معلومات المستخدم</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">البريد الإلكتروني</span><span className="font-medium">{user.email}</span></div>
              {user.phone && <div className="flex justify-between"><span className="text-gray-500">الجوال</span><span className="font-medium">{user.phone}</span></div>}
              <div className="flex justify-between"><span className="text-gray-500">الدور</span><span className="font-medium">{roleLabel[user.role]}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">تاريخ التسجيل</span><span className="font-medium">{new Date(user.createdAt).toLocaleDateString('ar-SA')}</span></div>
            </div>
          </Card>

          {user.spaces.length > 0 && (
            <Card padding={false}>
              <div className="px-5 py-4 border-b border-[#E8E3D8]">
                <h3 className="font-semibold text-gray-900">المساحات ({user.spaces.length})</h3>
              </div>
              <div className="divide-y divide-[#E8E3D8]">
                {user.spaces.map(s => {
                  const { variant, label } = getSpaceStatusBadge(s.status)
                  return (
                    <div key={s.id} className="px-5 py-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{s.name}</p>
                        <p className="text-gray-500 text-xs">{s.city}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={variant}>{label}</Badge>
                        <Link href={`/admin/spaces/${s.id}`} className="text-xs text-[#1B3A2D] hover:underline">عرض</Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
