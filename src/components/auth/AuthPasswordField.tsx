'use client'

import { useState } from 'react'
import { getPasswordStrength, STRENGTH_LEVELS } from '@/lib/passwordStrength'
import { EyeIcon, EyeOffIcon, LockIcon } from '@/components/auth/AuthField'

export default function AuthPasswordField({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  autoComplete,
  error,
  showStrength = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  autoComplete: string
  error?: string
  showStrength?: boolean
}) {
  const [visible, setVisible] = useState(false)
  const strength = showStrength ? getPasswordStrength(value) : null

  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-[#33423F]">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 start-0 grid w-11 place-items-center text-[#B5AE9C]">
          {LockIcon}
        </span>
        <input
          required
          type={visible ? 'text' : 'password'}
          dir="ltr"
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          className={`w-full rounded-xl border bg-white ps-11 pe-11 py-3 text-sm outline-none transition-colors ${
            error
              ? 'border-red-300 focus:border-red-500'
              : 'border-[#D8D1C7] focus:border-[#0E3B34] focus:ring-4 focus:ring-[#0E3B34]/8'
          }`}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
          className="absolute inset-y-0 end-0 grid w-11 place-items-center text-[#8B9389] transition-colors hover:text-[#0E3B34]"
        >
          {visible ? EyeOffIcon : EyeIcon}
        </button>
      </div>

      {showStrength && strength && value && (
        <div className="mt-2">
          <div className="flex gap-1">
            {STRENGTH_LEVELS.slice(1).map((level) => (
              <span
                key={level.score}
                className="h-1.5 flex-1 rounded-full transition-colors duration-300"
                style={{ backgroundColor: strength.score >= level.score ? strength.color : '#E4DED1' }}
              />
            ))}
          </div>
          <p className="mt-1.5 text-xs font-semibold transition-colors duration-300" style={{ color: strength.color }}>
            قوة كلمة المرور: {strength.label}
          </p>
        </div>
      )}
      {error && <p className="mt-1.5 text-xs font-semibold text-red-600">{error}</p>}
    </label>
  )
}
