'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  endpoint: string
  confirmTitle?: string
  confirmMessage: string
  typedConfirmationValue?: string
  redirectTo?: string
  label?: string
  className?: string
  disabled?: boolean
  disabledReason?: string
}

export default function AdminDeleteButton({
  endpoint,
  confirmTitle = 'تأكيد الحذف النهائي',
  confirmMessage,
  typedConfirmationValue,
  redirectTo,
  label = 'حذف',
  className,
  disabled = false,
  disabledReason,
}: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [typed, setTyped] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function confirmDelete() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(endpoint, { method: 'DELETE' })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(data.error || 'تعذر الحذف. حاول مرة أخرى.')
        return
      }
      setOpen(false)
      if (redirectTo) router.push(redirectTo)
      else router.refresh()
    } catch {
      setError('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  function openModal() {
    setTyped('')
    setError('')
    setOpen(true)
  }

  const canConfirm = !loading && (!typedConfirmationValue || typed.trim() === typedConfirmationValue)

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        disabled={disabled}
        title={disabled ? disabledReason : undefined}
        className={className || 'rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40'}
      >
        {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => !loading && setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-red-50 text-red-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </span>
              <h3 className="text-base font-extrabold text-[#1B1B1B]">{confirmTitle}</h3>
            </div>

            <p className="text-sm leading-6 text-[#3F4B47]">{confirmMessage}</p>

            {typedConfirmationValue && (
              <div className="mt-4">
                <label className="mb-1.5 block text-xs font-bold text-[#3F4B47]">
                  للتأكيد، اكتب <span dir="ltr" className="font-mono text-red-700">{typedConfirmationValue}</span>
                </label>
                <input
                  value={typed}
                  onChange={(event) => setTyped(event.target.value)}
                  dir="ltr"
                  autoFocus
                  className="w-full rounded-xl border border-[#D8D1C7] px-3 py-2.5 text-sm focus:outline-none focus:border-red-400"
                />
              </div>
            )}

            {error && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700">{error}</p>
            )}

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="flex-1 rounded-xl border border-[#D8D1C7] py-2.5 text-sm font-bold text-[#3F4B47] transition-colors hover:bg-[#F5F1E8] disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={!canConfirm}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? 'جاري الحذف...' : 'حذف نهائيًا'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
