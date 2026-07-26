'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'

type UserData = {
  name: string
  email: string
  phone: string | null
  avatarUrl: string | null
  role: string
  createdAt: string
}

const roleLabel: Record<string, string> = {
  SELLER: 'صاحب مساحة',
  BUYER: 'مستأجر',
  ADMIN: 'مدير النظام',
}

export default function SettingsClientPro({ user }: { user: UserData }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone || '')
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '')
  const [saving, setSaving] = useState(false)
  const [avatarSaving, setAvatarSaving] = useState(false)
  const [profileMsg, setProfileMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwSaving, setPwSaving] = useState(false)
  const [pwMsg, setPwMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  async function updateProfile(payload: Record<string, unknown>) {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'تعذر تحديث الحساب')
    return data.user
  }

  async function saveProfile() {
    setProfileMsg(null)
    setSaving(true)
    try {
      await updateProfile({ name, phone })
      setProfileMsg({ type: 'ok', text: 'تم تحديث البيانات بنجاح' })
    } catch (err) {
      setProfileMsg({ type: 'err', text: err instanceof Error ? err.message : 'حدث خطأ في الاتصال' })
    } finally {
      setSaving(false)
    }
  }

  async function uploadAvatar(file: File) {
    setProfileMsg(null)
    setAvatarSaving(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok || !uploadData.url) throw new Error(uploadData.error || 'تعذر رفع الصورة')
      await updateProfile({ avatarUrl: uploadData.url })
      setAvatarUrl(uploadData.url)
      setProfileMsg({ type: 'ok', text: 'تم تحديث صورة الملف الشخصي' })
    } catch (err) {
      setProfileMsg({ type: 'err', text: err instanceof Error ? err.message : 'حدث خطأ أثناء رفع الصورة' })
    } finally {
      setAvatarSaving(false)
    }
  }

  async function deleteAvatar() {
    setProfileMsg(null)
    setAvatarSaving(true)
    try {
      await updateProfile({ avatarUrl: null })
      setAvatarUrl('')
      setProfileMsg({ type: 'ok', text: 'تم حذف صورة الملف الشخصي' })
    } catch (err) {
      setProfileMsg({ type: 'err', text: err instanceof Error ? err.message : 'تعذر حذف الصورة' })
    } finally {
      setAvatarSaving(false)
    }
  }

  async function changePassword() {
    setPwMsg(null)
    if (!currentPassword) { setPwMsg({ type: 'err', text: 'أدخل كلمة المرور الحالية' }); return }
    if (newPassword.length < 6) { setPwMsg({ type: 'err', text: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' }); return }
    if (newPassword !== confirmPassword) { setPwMsg({ type: 'err', text: 'كلمة المرور الجديدة غير متطابقة' }); return }

    setPwSaving(true)
    try {
      await updateProfile({ currentPassword, newPassword })
      setPwMsg({ type: 'ok', text: 'تم تغيير كلمة المرور بنجاح' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPwMsg({ type: 'err', text: err instanceof Error ? err.message : 'حدث خطأ في الاتصال' })
    } finally {
      setPwSaving(false)
    }
  }

  return (
    <div className="dashboard-page">
      <div className="page-hero mb-6 p-6 animate-in">
        <div className="relative">
          <p className="mb-2 text-xs font-bold text-[#C49A3C]">الملف الشخصي</p>
          <h1 className="text-2xl font-extrabold text-white">الإعدادات</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">إدارة معلومات الحساب والصورة الشخصية وبيانات التواصل.</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="premium-card h-fit p-6 animate-in">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-[#1B3A2D] shadow-xl">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-5xl font-extrabold text-[#C49A3C]">
                    {name.charAt(0) || '?'}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={avatarSaving}
                className="absolute bottom-1 left-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#C49A3C] text-[#14201A] shadow-lg transition-transform hover:scale-105 disabled:opacity-70"
                aria-label="تغيير الصورة"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h4l2-3h6l2 3h4v13H3V7zm9 3a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              </button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) uploadAvatar(file)
                e.target.value = ''
              }}
            />
            <h2 className="mt-4 text-xl font-extrabold text-[#14201A]">{name}</h2>
            <p className="text-sm text-[#6B7566]" dir="ltr">{user.email}</p>
            <span className="mt-3 rounded-full bg-[#F7F3EB] px-3 py-1 text-xs font-bold text-[#1B3A2D]">
              {roleLabel[user.role] || user.role}
            </span>
            <div className="mt-5 flex w-full gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={avatarSaving}
                className="btn-primary flex-1 rounded-xl py-2.5 text-sm font-bold disabled:opacity-70"
              >
                {avatarSaving ? 'جاري الرفع...' : 'تغيير الصورة'}
              </button>
              <button
                type="button"
                onClick={deleteAvatar}
                disabled={avatarSaving || !avatarUrl}
                className="rounded-xl border border-[#E8E3D8] bg-white px-4 py-2.5 text-sm font-bold text-[#4A554D] transition-colors hover:border-red-200 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                حذف
              </button>
            </div>
          </div>
        </aside>

        <main className="space-y-6">
          {profileMsg && (
            <div className={`rounded-xl px-4 py-3 text-sm font-semibold ${
              profileMsg.type === 'ok' ? 'border border-green-200 bg-green-50 text-green-700' : 'border border-red-200 bg-red-50 text-red-700'
            }`}>
              {profileMsg.text}
            </div>
          )}

          <section className="premium-card p-6 animate-in">
            <h2 className="mb-4 text-sm font-extrabold text-[#14201A]">معلومات الحساب</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-[#F7F3EB] p-3">
                <p className="mb-0.5 text-[10px] font-bold text-[#6B7566]">البريد الإلكتروني</p>
                <p className="text-sm font-medium text-[#14201A]" dir="ltr">{user.email}</p>
              </div>
              <div className="rounded-xl bg-[#F7F3EB] p-3">
                <p className="mb-0.5 text-[10px] font-bold text-[#6B7566]">نوع الحساب</p>
                <p className="text-sm font-medium text-[#14201A]">{roleLabel[user.role] || user.role}</p>
              </div>
              <div className="rounded-xl bg-[#F7F3EB] p-3">
                <p className="mb-0.5 text-[10px] font-bold text-[#6B7566]">تاريخ التسجيل</p>
                <p className="text-sm font-medium text-[#14201A]">
                  {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </section>

          <section className="premium-card p-6 animate-in">
            <h2 className="mb-4 text-sm font-extrabold text-[#14201A]">تعديل البيانات الشخصية</h2>
            <div className="mb-4 grid gap-4 md:grid-cols-2">
              <label>
                <span className="mb-1.5 block text-xs font-bold text-[#4A554D]">الاسم الكامل</span>
                <input value={name} onChange={e => setName(e.target.value)} className="field" />
              </label>
              <label>
                <span className="mb-1.5 block text-xs font-bold text-[#4A554D]">رقم الجوال</span>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="05X XXX XXXX" dir="ltr" className="field" />
              </label>
            </div>
            <button onClick={saveProfile} disabled={saving} className="btn-primary rounded-xl px-6 py-2.5 text-sm font-bold disabled:opacity-60">
              {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </button>
          </section>

          <section className="premium-card p-6 animate-in">
            <h2 className="mb-4 text-sm font-extrabold text-[#14201A]">تغيير كلمة المرور</h2>
            {pwMsg && (
              <div className={`mb-4 rounded-xl px-4 py-2.5 text-sm font-semibold ${
                pwMsg.type === 'ok' ? 'border border-green-200 bg-green-50 text-green-700' : 'border border-red-200 bg-red-50 text-red-700'
              }`}>
                {pwMsg.text}
              </div>
            )}
            <div className="mb-4 space-y-3">
              <label>
                <span className="mb-1.5 block text-xs font-bold text-[#4A554D]">كلمة المرور الحالية</span>
                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="field" />
              </label>
              <div className="grid gap-3 md:grid-cols-2">
                <label>
                  <span className="mb-1.5 block text-xs font-bold text-[#4A554D]">كلمة المرور الجديدة</span>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="field" />
                </label>
                <label>
                  <span className="mb-1.5 block text-xs font-bold text-[#4A554D]">تأكيد كلمة المرور</span>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="field" />
                </label>
              </div>
            </div>
            <button onClick={changePassword} disabled={pwSaving} className="btn-primary rounded-xl px-6 py-2.5 text-sm font-bold disabled:opacity-60">
              {pwSaving ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
            </button>
          </section>

          <section className="premium-card p-6 animate-in">
            <h2 className="mb-3 text-sm font-extrabold text-[#14201A]">السياسات والشروط</h2>
            <div className="grid gap-2 md:grid-cols-3">
              <PolicyLink href="/policies#terms" label="شروط الاستخدام" />
              <PolicyLink href="/policies#privacy" label="سياسة الخصوصية" />
              <PolicyLink href="/policies#cancellation" label="الإلغاء والاسترداد" />
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

function PolicyLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="flex items-center justify-between rounded-xl border border-[#E8E3D8] bg-white p-3 text-sm font-bold text-[#14201A] transition-colors hover:border-[#C49A3C] hover:bg-[#FBFAF7]">
      {label}
      <svg className="h-4 w-4 rotate-180 text-[#C49A3C]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  )
}
