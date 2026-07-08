'use client'

import { useState } from 'react'
import Link from 'next/link'

type UserData = {
  name: string
  email: string
  phone: string | null
  role: string
  createdAt: string
}

export default function SettingsClient({ user }: { user: UserData }) {
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone || '')
  const [saving, setSaving] = useState(false)
  const [profileMsg, setProfileMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwSaving, setPwSaving] = useState(false)
  const [pwMsg, setPwMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  async function saveProfile() {
    setProfileMsg(null)
    setSaving(true)
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      })
      const data = await res.json()
      if (!res.ok) {
        setProfileMsg({ type: 'err', text: data.error })
      } else {
        setProfileMsg({ type: 'ok', text: 'تم تحديث البيانات بنجاح' })
      }
    } catch {
      setProfileMsg({ type: 'err', text: 'حدث خطأ في الاتصال' })
    } finally {
      setSaving(false)
    }
  }

  async function changePassword() {
    setPwMsg(null)
    if (!currentPassword) { setPwMsg({ type: 'err', text: 'أدخل كلمة المرور الحالية' }); return }
    if (newPassword.length < 6) { setPwMsg({ type: 'err', text: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' }); return }
    if (newPassword !== confirmPassword) { setPwMsg({ type: 'err', text: 'كلمة المرور الجديدة غير متطابقة' }); return }

    setPwSaving(true)
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setPwMsg({ type: 'err', text: data.error })
      } else {
        setPwMsg({ type: 'ok', text: 'تم تغيير كلمة المرور بنجاح' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch {
      setPwMsg({ type: 'err', text: 'حدث خطأ في الاتصال' })
    } finally {
      setPwSaving(false)
    }
  }

  const roleLabel: Record<string, string> = {
    SELLER: 'صاحب مساحة',
    BUYER: 'مستأجر',
    ADMIN: 'مدير النظام',
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-2xl font-extrabold text-[#14201A] mb-1">الإعدادات</h1>
        <p className="text-[#6B7566] text-sm mb-8">إدارة حسابك ومعلوماتك الشخصية</p>

        <div className="space-y-6">
          {/* Account Info (read-only) */}
          <div className="bg-white rounded-2xl border border-[#ECE6D8] p-6">
            <h2 className="text-sm font-bold text-[#14201A] mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#C49A3C]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              معلومات الحساب
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-[#F7F3EB]">
                <p className="text-[10px] font-bold text-[#6B7566] mb-0.5">البريد الإلكتروني</p>
                <p className="text-sm font-medium text-[#14201A]" dir="ltr">{user.email}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F3EB]">
                <p className="text-[10px] font-bold text-[#6B7566] mb-0.5">نوع الحساب</p>
                <p className="text-sm font-medium text-[#14201A]">{roleLabel[user.role] || user.role}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F3EB]">
                <p className="text-[10px] font-bold text-[#6B7566] mb-0.5">تاريخ التسجيل</p>
                <p className="text-sm font-medium text-[#14201A]">
                  {new Date(user.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Profile */}
          <div className="bg-white rounded-2xl border border-[#ECE6D8] p-6">
            <h2 className="text-sm font-bold text-[#14201A] mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#C49A3C]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              تعديل البيانات الشخصية
            </h2>

            {profileMsg && (
              <div className={`text-sm px-4 py-2.5 rounded-xl mb-4 ${
                profileMsg.type === 'ok' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {profileMsg.text}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-[#4A554D] mb-1.5">الاسم الكامل</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#4A554D] mb-1.5">رقم الجوال</label>
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="05X XXX XXXX"
                  dir="ltr"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
                />
              </div>
            </div>
            <button
              onClick={saveProfile}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#1B3A2D] text-white hover:bg-[#0F2219] disabled:opacity-60 transition-colors"
            >
              {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </button>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-2xl border border-[#ECE6D8] p-6">
            <h2 className="text-sm font-bold text-[#14201A] mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#C49A3C]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              تغيير كلمة المرور
            </h2>

            {pwMsg && (
              <div className={`text-sm px-4 py-2.5 rounded-xl mb-4 ${
                pwMsg.type === 'ok' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {pwMsg.text}
              </div>
            )}

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-bold text-[#4A554D] mb-1.5">كلمة المرور الحالية</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4A554D] mb-1.5">كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A554D] mb-1.5">تأكيد كلمة المرور</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={changePassword}
              disabled={pwSaving}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#1B3A2D] text-white hover:bg-[#0F2219] disabled:opacity-60 transition-colors"
            >
              {pwSaving ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
            </button>
          </div>

          {/* Policies & Legal */}
          <div className="bg-white rounded-2xl border border-[#ECE6D8] p-6">
            <h2 className="text-sm font-bold text-[#14201A] mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#C49A3C]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              السياسات والشروط
            </h2>
            <div className="space-y-2">
              <Link href="/policies#terms" className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F7F3EB] transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#1B3A2D]/5 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#1B3A2D]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#14201A]">شروط الاستخدام</p>
                    <p className="text-[11px] text-[#6B7566]">الأحكام والشروط العامة لاستخدام المنصة</p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-[#6B7566] group-hover:text-[#1B3A2D] rotate-180" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link href="/policies#privacy" className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F7F3EB] transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#1B3A2D]/5 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#1B3A2D]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#14201A]">سياسة الخصوصية</p>
                    <p className="text-[11px] text-[#6B7566]">كيفية جمع واستخدام وحماية بياناتك</p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-[#6B7566] group-hover:text-[#1B3A2D] rotate-180" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link href="/policies#cancellation" className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F7F3EB] transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#1B3A2D]/5 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#1B3A2D]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#14201A]">سياسة الإلغاء والاسترداد</p>
                    <p className="text-[11px] text-[#6B7566]">قواعد إلغاء الحجوزات واسترداد المبالغ</p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-[#6B7566] group-hover:text-[#1B3A2D] rotate-180" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
