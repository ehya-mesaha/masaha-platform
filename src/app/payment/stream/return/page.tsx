'use client'

import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import BrandLogo from '@/components/brand/BrandLogo'
import Spinner from '@/components/ui/Spinner'

type PaymentState = {
  status: string
  bookingId: string | null
  retryCheckoutUrl: string | null
}

function StreamPaymentReturnContent() {
  const searchParams = useSearchParams()
  const [state, setState] = useState<PaymentState | null>(null)
  const [error, setError] = useState('')
  const outcome = searchParams.get('outcome')

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    let attempts = 0

    async function checkStatus() {
      attempts += 1
      try {
        const response = await fetch('/api/payments/stream/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            checkoutToken: searchParams.get('token'),
            paymentLinkId: searchParams.get('payment_link_id'),
            invoiceId: searchParams.get('invoice_id'),
            paymentId: searchParams.get('payment_id'),
          }),
        })
        const data = await response.json().catch(() => null)
        if (cancelled) return
        if (!response.ok || !data) {
          // A passing hiccup (a 5xx or a timeout page) should not end verification of a
          // payment that has already been made; only a definite answer does.
          if ((response.status >= 500 || !data) && attempts < 20) {
            timer = setTimeout(checkStatus, 3000)
            return
          }
          setError(data?.error || 'تعذر التحقق من عملية الدفع.')
          return
        }
        setState(data)
        if (['PENDING', 'CHECKOUT_CREATED'].includes(data.status) && outcome === 'success' && attempts < 20) {
          timer = setTimeout(checkStatus, 3000)
        }
      } catch {
        if (cancelled) return
        if (attempts < 20) {
          timer = setTimeout(checkStatus, 3000)
          return
        }
        setError('تعذر الاتصال للتحقق من عملية الدفع. يمكنك مراجعة حجوزاتك بعد قليل.')
      }
    }

    void checkStatus()
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [outcome, searchParams])

  const paid = state?.status === 'PAID'
  const refundPending = state?.status === 'REFUND_PENDING'
  const expired = state?.status === 'EXPIRED'
  const failed = ['FAILED', 'PAYMENT_FAILED'].includes(state?.status || '') || outcome === 'failure'
  const checking = !error && !state
  const pending = state && ['PENDING', 'CHECKOUT_CREATED'].includes(state.status) && !failed

  return (
    <main dir="rtl" className="flex min-h-screen items-center justify-center bg-[#F6F3EC] px-4 py-12">
      <section className="w-full max-w-xl rounded-3xl border border-[#D8D1C7] bg-white p-7 text-center shadow-sm sm:p-10">
        <div className="mb-7 flex justify-center"><BrandLogo /></div>

        {checking && (
          <>
            <Spinner size="lg" />
            <h1 className="mt-5 text-2xl font-extrabold text-[#0E3B34]">جاري التحقق من الدفع</h1>
            <p className="mt-3 text-sm leading-7 text-[#5F6764]">لا تغلق الصفحة. نتأكد من StreamPay قبل تأكيد الحجز.</p>
          </>
        )}

        {paid && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700">✓</div>
            <h1 className="mt-5 text-2xl font-extrabold text-[#0E3B34]">تم الدفع وتأكيد الحجز</h1>
            <p className="mt-3 text-sm leading-7 text-[#5F6764]">تحققنا من المبلغ مباشرةً من StreamPay، وأصبح حجزك مؤكدًا.</p>
          </>
        )}

        {refundPending && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl text-amber-700">!</div>
            <h1 className="mt-5 text-2xl font-extrabold text-[#5A4218]">تم الدفع ويجري التعامل مع الاسترداد</h1>
            <p className="mt-3 text-sm leading-7 text-[#5F6764]">وصل المبلغ، لكن الموعد لم يعد متاحًا بسبب تعارض نادر. تم تسجيل استرداد كامل لمراجعته فورًا.</p>
          </>
        )}

        {(failed || expired) && !refundPending && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-700">×</div>
            <h1 className="mt-5 text-2xl font-extrabold text-[#7F1D1D]">{expired ? 'انتهت مهلة الدفع' : 'لم تكتمل عملية الدفع'}</h1>
            <p className="mt-3 text-sm leading-7 text-[#5F6764]">لم يتم تأكيد الحجز. يمكنك المحاولة مجددًا ما دامت المهلة متاحة، أو إنشاء حجز جديد.</p>
          </>
        )}

        {pending && (
          <>
            <Spinner size="lg" />
            <h1 className="mt-5 text-2xl font-extrabold text-[#0E3B34]">الدفع قيد التحقق</h1>
            <p className="mt-3 text-sm leading-7 text-[#5F6764]">قد يستغرق وصول التأكيد عدة ثوانٍ. لا يُعتبر الحجز مؤكدًا حتى تظهر رسالة النجاح.</p>
          </>
        )}

        {error && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl text-amber-700">!</div>
            <h1 className="mt-5 text-2xl font-extrabold text-[#5A4218]">تعذر التحقق الآن</h1>
            <p className="mt-3 text-sm leading-7 text-[#5F6764]">{error}</p>
          </>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {failed && state?.retryCheckoutUrl && (
            <a href={state.retryCheckoutUrl} className="rounded-xl bg-[#0E3B34] px-5 py-3 text-sm font-bold text-white hover:bg-[#092C27]">
              إعادة محاولة الدفع
            </a>
          )}
          {state?.bookingId && (
            <Link href={`/buyer/bookings/${state.bookingId}`} className="rounded-xl bg-[#0E3B34] px-5 py-3 text-sm font-bold text-white hover:bg-[#092C27]">
              عرض الحجز
            </Link>
          )}
          <Link href="/buyer/bookings" className="rounded-xl border border-[#D8D1C7] px-5 py-3 text-sm font-bold text-[#0E3B34] hover:bg-[#F5F1E8]">
            جميع حجوزاتي
          </Link>
        </div>
      </section>
    </main>
  )
}

export default function StreamPaymentReturnPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#F6F3EC]"><Spinner size="lg" /></div>}>
      <StreamPaymentReturnContent />
    </Suspense>
  )
}
