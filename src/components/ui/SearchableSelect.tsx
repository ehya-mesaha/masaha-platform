'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'

export type SearchableSelectOption = {
  id: string
  name: string
}

type Props = {
  value: string
  onChange: (value: string) => void
  options: SearchableSelectOption[]
  placeholder: string
  searchPlaceholder: string
  emptyText: string
  allLabel?: string
  className?: string
  buttonClassName?: string
  disabled?: boolean
  required?: boolean
  ariaLabel?: string
}

export default function SearchableSelect({
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder,
  emptyText,
  allLabel,
  className = '',
  buttonClassName = '',
  disabled = false,
  required = false,
  ariaLabel,
}: Props) {
  const listboxId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const selected = options.find(option => option.id === value)
  const filtered = useMemo(() => {
    const normalizedQuery = normalize(query)
    if (!normalizedQuery) return options
    return options.filter(option => normalize(option.name).includes(normalizedQuery))
  }, [options, query])

  const menuOptions = allLabel
    ? [{ id: '', name: allLabel }, ...filtered]
    : filtered

  useEffect(() => {
    if (!open) return

    function closeOnOutsideClick(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    window.requestAnimationFrame(() => searchRef.current?.focus())
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [open])

  function select(nextValue: string) {
    onChange(nextValue)
    setOpen(false)
    setQuery('')
    setActiveIndex(0)
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (!open && (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown')) {
      event.preventDefault()
      setOpen(true)
      return
    }
    if (!open) return
    if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex(index => Math.min(index + 1, Math.max(0, menuOptions.length - 1)))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex(index => Math.max(index - 1, 0))
    } else if (event.key === 'Enter' && menuOptions[activeIndex]) {
      event.preventDefault()
      select(menuOptions[activeIndex].id)
    }
  }

  return (
    <div ref={rootRef} className={`relative ${className}`} onKeyDown={handleKeyDown}>
      <button
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        onClick={() => setOpen(current => !current)}
        className={`flex w-full items-center justify-between gap-3 text-start disabled:cursor-not-allowed disabled:opacity-55 ${buttonClassName}`}
      >
        <span
          data-no-translate={selected ? 'true' : undefined}
          className={`min-w-0 flex-1 truncate ${selected ? '' : 'text-[#9B9D98]'}`}
        >
          {selected?.name || allLabel || placeholder}
        </span>
        <svg
          className={`h-4 w-4 flex-none text-[#6A756D] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-[calc(100%+8px)] z-[80] overflow-hidden rounded-xl border border-[#D8D1C7] bg-white shadow-[0_24px_55px_-24px_rgba(9,44,39,.5)]">
          <div className="border-b border-[#EEE8DC] p-2.5">
            <div className="flex items-center gap-2 rounded-lg border border-[#D8D1C7] bg-[#FAF8F3] px-3 focus-within:border-[#0E3B34] focus-within:ring-2 focus-within:ring-[#0E3B34]/10">
              <svg className="h-4 w-4 flex-none text-[#7A837C]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
              </svg>
              <input
                ref={searchRef}
                value={query}
                onChange={event => {
                  setQuery(event.target.value)
                  setActiveIndex(0)
                }}
                placeholder={searchPlaceholder}
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-[#1B1B1B] outline-none placeholder:text-[#9B9D98]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    searchRef.current?.focus()
                  }}
                  className="grid h-6 w-6 place-items-center rounded-full text-[#7A837C] hover:bg-[#EDE8DD] hover:text-[#0E3B34]"
                  aria-label="Clear search"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div id={listboxId} role="listbox" className="max-h-64 overflow-y-auto p-1.5">
            {menuOptions.length > 0 ? menuOptions.map((option, index) => {
              const isSelected = option.id === value
              const isActive = index === activeIndex
              return (
                <button
                  key={option.id || '__all__'}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => select(option.id)}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-start text-sm transition-colors ${
                    isSelected
                      ? 'bg-[#0E3B34] font-bold text-white'
                      : isActive
                        ? 'bg-[#F5F1E8] text-[#0E3B34]'
                        : 'text-[#33423F] hover:bg-[#F5F1E8]'
                  }`}
                >
                  <span className="truncate">{option.name}</span>
                  {isSelected && (
                    <svg className="h-4 w-4 flex-none text-[#D9B65C]" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
                    </svg>
                  )}
                </button>
              )
            }) : (
              <p className="px-3 py-8 text-center text-xs leading-6 text-[#7A837C]">{emptyText}</p>
            )}
          </div>
        </div>
      )}
      {required && <input type="hidden" value={value} required readOnly />}
    </div>
  )
}

function normalize(value: string) {
  return value
    .trim()
    .toLocaleLowerCase('ar')
    .normalize('NFD')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[إأآ]/g, 'ا')
    .replace(/ة/g, 'ه')
}
