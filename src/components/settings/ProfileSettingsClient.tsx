'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/components/i18n/LanguageProvider'
import type { TranslationKey } from '@/lib/i18n'
import AuthPasswordField from '@/components/auth/AuthPasswordField'
import { getPasswordStrength } from '@/lib/passwordStrength'

type UserData = {
  name: string
  email: string
  phone: string | null
  avatarUrl: string | null
  role: string
  createdAt: string
}

const roleLabelKey: Record<string, TranslationKey> = {
  SELLER: 'roleSeller',
  BUYER: 'roleBuyer',
  ADMIN: 'roleAdmin',
}

export default function ProfileSettingsClient({ user }: { user: UserData }) {
  const { locale, t } = useLanguage()
  const fileRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone || '')
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '')
  const [saving, setSaving] = useState(false)
  const [avatarSaving, setAvatarSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  async function updateProfile(payload: Record<string, unknown>) {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || t('updateFailed'))
    return data.user
  }

  async function saveProfile() {
    setMessage(null)
    setSaving(true)
    try {
      await updateProfile({ name, phone })
      setMessage({ type: 'ok', text: t('updated') })
    } catch (err) {
      setMessage({ type: 'err', text: err instanceof Error ? err.message : t('connectionError') })
    } finally {
      setSaving(false)
    }
  }

  async function uploadAvatar(file: File) {
    setMessage(null)
    setAvatarSaving(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok || !uploadData.url) throw new Error(uploadData.error || t('uploadFailed'))
      await updateProfile({ avatarUrl: uploadData.url })
      setAvatarUrl(uploadData.url)
      setMessage({ type: 'ok', text: t('photoUpdated') })
    } catch (err) {
      setMessage({ type: 'err', text: err instanceof Error ? err.message : t('uploadFailed') })
    } finally {
      setAvatarSaving(false)
    }
  }

  async function deleteAvatar() {
    setMessage(null)
    setAvatarSaving(true)
    try {
      await updateProfile({ avatarUrl: null })
      setAvatarUrl('')
      setMessage({ type: 'ok', text: t('photoDeleted') })
    } catch (err) {
      setMessage({ type: 'err', text: err instanceof Error ? err.message : t('deleteFailed') })
    } finally {
      setAvatarSaving(false)
    }
  }

  async function changePassword() {
    setPasswordMessage(null)
    if (!currentPassword) {
      setPasswordMessage({ type: 'err', text: t('currentPassword') })
      return
    }
    if (getPasswordStrength(newPassword).score === 0) {
      setPasswordMessage({ type: 'err', text: t('passwordMustBeStrong') })
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'err', text: t('passwordDoesNotMatch') })
      return
    }

    setPasswordSaving(true)
    try {
      await updateProfile({ currentPassword, newPassword })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordMessage({ type: 'ok', text: t('passwordChanged') })
    } catch (err) {
      setPasswordMessage({ type: 'err', text: err instanceof Error ? err.message : t('connectionError') })
    } finally {
      setPasswordSaving(false)
    }
  }

  return (
    <div className="dashboard-page">
      <div className="page-hero mb-6 p-6 animate-in">
        <div className="relative">
          <p className="mb-2 text-xs font-bold text-[#B99A63]">{t('profile')}</p>
          <h1 className="text-2xl font-extrabold text-white">{t('settingsTitle')}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">{t('settingsDesc')}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="premium-card h-fit p-6 animate-in">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-[#0E3B34] shadow-xl">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-5xl font-extrabold text-[#B99A63]">
                    {name.charAt(0) || '?'}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={avatarSaving}
                className="absolute bottom-1 left-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#B99A63] text-[#1B1B1B] shadow-lg transition-transform hover:scale-105 disabled:opacity-70"
                aria-label={t('changePhoto')}
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
            <h2 className="mt-4 text-xl font-extrabold text-[#1B1B1B]">{name}</h2>
            <p className="text-sm text-[#5F6764]" dir="ltr">{user.email}</p>
            <span className="mt-3 rounded-full bg-[#F5F1E8] px-3 py-1 text-xs font-bold text-[#0E3B34]">
              {roleLabelKey[user.role] ? t(roleLabelKey[user.role]) : user.role}
            </span>
            <div className="mt-5 flex w-full gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={avatarSaving}
                className="btn-primary flex-1 rounded-xl py-2.5 text-sm font-bold disabled:opacity-70"
              >
                {avatarSaving ? t('uploadInProgress') : t('changePhoto')}
              </button>
              <button
                type="button"
                onClick={deleteAvatar}
                disabled={avatarSaving || !avatarUrl}
                className="rounded-xl border border-[#D8D1C7] bg-white px-4 py-2.5 text-sm font-bold text-[#3F4B47] transition-colors hover:border-red-200 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t('delete')}
              </button>
            </div>
          </div>
        </aside>

        <main className="space-y-6">
          {message && (
            <div className={`rounded-xl px-4 py-3 text-sm font-semibold ${
              message.type === 'ok' ? 'border border-green-200 bg-green-50 text-green-700' : 'border border-red-200 bg-red-50 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <section className="premium-card p-6 animate-in">
            <h2 className="mb-4 text-sm font-extrabold text-[#1B1B1B]">{t('accountInfo')}</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-[#F5F1E8] p-3">
                <p className="mb-0.5 text-[10px] font-bold text-[#5F6764]">{t('email')}</p>
                <p className="text-sm font-medium text-[#1B1B1B]" dir="ltr">{user.email}</p>
              </div>
              <div className="rounded-xl bg-[#F5F1E8] p-3">
                <p className="mb-0.5 text-[10px] font-bold text-[#5F6764]">{t('accountType')}</p>
                <p className="text-sm font-medium text-[#1B1B1B]">{roleLabelKey[user.role] ? t(roleLabelKey[user.role]) : user.role}</p>
              </div>
              <div className="rounded-xl bg-[#F5F1E8] p-3">
                <p className="mb-0.5 text-[10px] font-bold text-[#5F6764]">{t('joinedAt')}</p>
                <p className="text-sm font-medium text-[#1B1B1B]">
                  {new Date(user.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </section>

          <section className="premium-card p-6 animate-in">
            <h2 className="text-sm font-extrabold text-[#1B1B1B]">{t('changePassword')}</h2>
            <p className="mt-2 text-xs leading-6 text-[#5F6764]">{t('passwordChangeHint')}</p>
            {passwordMessage && (
              <div className={`mt-4 rounded-xl px-4 py-3 text-sm font-semibold ${
                passwordMessage.type === 'ok' ? 'border border-green-200 bg-green-50 text-green-700' : 'border border-red-200 bg-red-50 text-red-700'
              }`}>
                {passwordMessage.text}
              </div>
            )}
            <div className="mt-4 space-y-4">
              <AuthPasswordField label={t('currentPassword')} value={currentPassword} onChange={setCurrentPassword} autoComplete="current-password" />
              <div className="grid gap-4 md:grid-cols-2">
                <AuthPasswordField label={t('newPassword')} value={newPassword} onChange={setNewPassword} placeholder="8 أحرف على الأقل" autoComplete="new-password" showStrength />
                <AuthPasswordField label={t('confirmNewPassword')} value={confirmPassword} onChange={setConfirmPassword} placeholder="أعد إدخال كلمة المرور" autoComplete="new-password" error={confirmPassword && confirmPassword !== newPassword ? t('passwordDoesNotMatch') : undefined} />
              </div>
            </div>
            <button type="button" onClick={changePassword} disabled={passwordSaving} className="btn-primary mt-5 rounded-xl px-6 py-2.5 text-sm font-bold disabled:opacity-60">
              {passwordSaving ? t('saving') : t('changePassword')}
            </button>
          </section>

          <section className="premium-card p-6 animate-in">
            <h2 className="mb-4 text-sm font-extrabold text-[#1B1B1B]">{t('editPersonalInfo')}</h2>
            <div className="mb-4 grid gap-4 md:grid-cols-2">
              <label>
                <span className="mb-1.5 block text-xs font-bold text-[#3F4B47]">{t('fullName')}</span>
                <input value={name} onChange={e => setName(e.target.value)} className="field" />
              </label>
              <label>
                <span className="mb-1.5 block text-xs font-bold text-[#3F4B47]">{t('phone')}</span>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="05X XXX XXXX" dir="ltr" className="field" />
              </label>
            </div>
            <button onClick={saveProfile} disabled={saving} className="btn-primary rounded-xl px-6 py-2.5 text-sm font-bold disabled:opacity-60">
              {saving ? t('saving') : t('saveChanges')}
            </button>
          </section>

          <section className="premium-card p-6 animate-in">
            <h2 className="mb-3 text-sm font-extrabold text-[#1B1B1B]">{t('policiesTerms')}</h2>
            <div className="grid gap-2 md:grid-cols-3">
              <PolicyLink href="/policies#terms" label={t('terms')} />
              <PolicyLink href="/policies#privacy" label={t('privacy')} />
              <PolicyLink href="/policies#cancellation" label={t('cancellation')} />
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

function PolicyLink({ href, label }: { href: string; label: string }) {
  const { dir } = useLanguage()

  return (
    <Link href={href} className="flex items-center justify-between rounded-xl border border-[#D8D1C7] bg-white p-3 text-sm font-bold text-[#1B1B1B] transition-colors hover:border-[#B99A63] hover:bg-[#FAF8F3]">
      {label}
      <svg className={`h-4 w-4 text-[#B99A63] ${dir === 'rtl' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  )
}
