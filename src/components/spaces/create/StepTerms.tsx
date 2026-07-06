'use client'

import { useState } from 'react'
import { StepProps, RuleItem } from './types'

const POLICIES = [
  {
    value: 'FLEXIBLE',
    label: 'مرنة',
    desc: 'استرداد كامل للمبلغ عند الإلغاء قبل 24 ساعة من موعد الحجز.',
  },
  {
    value: 'MODERATE',
    label: 'متوسطة',
    desc: 'استرداد كامل للمبلغ عند الإلغاء قبل 5 أيام من موعد الحجز.',
  },
  {
    value: 'STRICT',
    label: 'صارمة',
    desc: 'استرداد 50% من المبلغ عند الإلغاء قبل 7 أيام من موعد الحجز.',
  },
]

export default function StepTerms({ form, update }: StepProps) {
  const [newRule, setNewRule] = useState('')

  function toggleRule(index: number) {
    const updated = form.rules.map((r, i) =>
      i === index ? { ...r, isDefault: !r.isDefault } : r,
    )
    update('rules', updated)
  }

  function addCustomRule() {
    if (!newRule.trim()) return
    update('rules', [...form.rules, { rule: newRule.trim(), isDefault: false } as RuleItem])
    setNewRule('')
  }

  function removeRule(index: number) {
    update('rules', form.rules.filter((_, i) => i !== index))
  }

  return (
    <div>
      <h2 className="font-display text-xl font-extrabold text-[#14201A] mb-1">الشروط والأحكام</h2>
      <p className="text-[#6B7566] text-sm mb-6">حدد سياسة الإلغاء والقواعد الخاصة باستخدام مساحتك لضمان تجربة واضحة للعملاء وحماية حقوقك.</p>

      {/* Cancellation Policy */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-[#14201A] mb-3">سياسة الإلغاء</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {POLICIES.map(p => (
            <button
              key={p.value}
              type="button"
              onClick={() => update('cancellationPolicy', p.value)}
              className={`p-4 rounded-xl border-2 text-start transition-all ${
                form.cancellationPolicy === p.value
                  ? 'border-[#1B3A2D] bg-[#1B3A2D]/5'
                  : 'border-[#ECE6D8] hover:border-[#1B3A2D]/40'
              }`}
            >
              <div className={`text-sm font-bold mb-1 ${
                form.cancellationPolicy === p.value ? 'text-[#1B3A2D]' : 'text-[#14201A]'
              }`}>
                {p.label}
              </div>
              <p className="text-xs text-[#6B7566] leading-relaxed">{p.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Space Rules */}
      <div>
        <h3 className="text-sm font-bold text-[#14201A] mb-3">قواعد المساحة</h3>
        <div className="space-y-2 mb-4">
          {form.rules.map((r, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-[#ECE6D8] bg-white">
              <button
                type="button"
                onClick={() => toggleRule(i)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  r.isDefault
                    ? 'border-[#1B3A2D] bg-[#1B3A2D]'
                    : 'border-[#E8E3D8]'
                }`}
              >
                {r.isDefault && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span className={`text-sm flex-1 ${r.isDefault ? 'text-[#14201A]' : 'text-[#6B7566]'}`}>{r.rule}</span>
              {!form.rules.slice(0, 4).includes(r) && (
                <button type="button" onClick={() => removeRule(i)} className="text-red-400 hover:text-red-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={newRule}
            onChange={e => setNewRule(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomRule())}
            placeholder="إضافة شرط أو قاعدة خاصة بمساحتك..."
            className="flex-1 px-4 py-2.5 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
          />
          <button
            type="button"
            onClick={addCustomRule}
            className="px-4 py-2.5 rounded-lg bg-[#1B3A2D] text-white text-sm font-medium hover:bg-[#0F2219]"
          >
            + إضافة
          </button>
        </div>
      </div>
    </div>
  )
}
