'use client'

import { useEffect, useRef, useState } from 'react'

export type AppliedCoupon = {
  code: string
  description: string | null
  summary: string
  discount: number
}

type Props = {
  /** Booking total before any coupon, in SAR. */
  amount: number
  applied: AppliedCoupon | null
  onChange: (coupon: AppliedCoupon | null) => void
}

export default function CouponField({ amount, applied, onChange }: Props) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const appliedCode = applied?.code ?? null
  const latestRequest = useRef(0)

  // The discount depends on the booking total, so whenever the buyer edits dates, hours or
  // services we re-check the applied coupon against the new total. That keeps the discount
  // shown here identical to the one /api/bookings recomputes at checkout - including the
  // case where the edit drops the booking below the coupon's minimum and it stops applying.
  useEffect(() => {
    if (!appliedCode || amount <= 0) return
    const requestId = latestRequest.current + 1
    latestRequest.current = requestId
    let cancelled = false

    const timer = setTimeout(async () => {
      try {
        const response = await fetch('/api/coupons/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: appliedCode, amount }),
        })
        const result = await response.json()
        if (cancelled || latestRequest.current !== requestId) return
        if (!response.ok) {
          onChange(null)
          setNotice('')
          setError(result.error || 'لم يعد الكوبون صالحًا بعد تعديل الحجز.')
          return
        }
        setError('')
        onChange({
          code: result.coupon.code,
          description: result.coupon.description,
          summary: result.coupon.summary,
          discount: result.discount,
        })
      } catch {
        // A transient network failure must not silently drop the coupon; the booking request
        // re-validates it server-side anyway, so the applied value is left as it is.
      }
    }, 350)

    return () => { cancelled = true; clearTimeout(timer) }
  }, [amount, appliedCode, onChange])

  async function apply() {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) {
      setError('أدخل رمز الكوبون')
      return
    }
    if (amount <= 0) {
      setError('أكمل بيانات الحجز أولًا حتى نحسب قيمة الخصم')
      return
    }
    setLoading(true)
    setError('')
    setNotice('')
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed, amount }),
      })
      const result = await response.json()
      if (!response.ok) {
        setError(result.error || 'تعذر تطبيق الكوبون')
        onChange(null)
        return
      }
      onChange({
        code: result.coupon.code,
        description: result.coupon.description,
        summary: result.coupon.summary,
        discount: result.discount,
      })
      setCode('')
      setNotice(`تم تطبيق الكوبون ${result.coupon.code} ووفرت ${result.discount.toLocaleString('en-US')} ر.س`)
    } catch {
      setError('تعذر الاتصال بالخادم للتحقق من الكوبون')
    } finally {
      setLoading(false)
    }
  }

  function clear() {
    onChange(null)
    setCode('')
    setError('')
    setNotice('')
  }

  if (applied) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="flex items-center gap-2 text-sm font-extrabold text-green-700">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span dir="ltr">{applied.code}</span>
            </p>
            <p className="mt-1 text-xs font-bold text-green-700">
              خصم {applied.summary} · وفرت {applied.discount.toLocaleString('en-US')} ر.س
            </p>
          </div>
          <button type="button" onClick={clear} className="rounded-lg border border-green-200 bg-white px-3 py-1.5 text-xs font-bold text-[#5F6764] hover:bg-gray-50">
            إزالة الكوبون
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-dashed border-[#D8D1C7] bg-[#FAF8F3] p-4">
      <p className="mb-2 text-xs font-bold text-[#3F4B47]">هل لديك كوبون خصم؟</p>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={event => { setCode(event.target.value.toUpperCase()); setError('') }}
          onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); void apply() } }}
          placeholder="أدخل رمز الكوبون"
          className="field flex-1 py-2.5 tracking-widest"
          dir="ltr"
          disabled={loading}
        />
        <button
          type="button"
          onClick={() => void apply()}
          disabled={loading}
          className="rounded-xl bg-[#0E3B34] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#092C27] disabled:opacity-60"
        >
          {loading ? 'جاري التحقق...' : 'تطبيق'}
        </button>
      </div>
      {error && <p className="mt-2 text-xs font-bold text-red-700">{error}</p>}
      {notice && <p className="mt-2 text-xs font-bold text-green-700">{notice}</p>}
    </div>
  )
}
