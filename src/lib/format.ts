export function formatNumber(value: number) {
  return value.toLocaleString('en-US')
}

export function formatSpaceNumber(refSeq: number) {
  return `M-${String(refSeq).padStart(6, '0')}`
}

export function formatDate(value: string | Date, locale: 'ar' | 'en' = 'ar') {
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA-u-nu-latn' : 'en-US', {
    timeZone: 'Asia/Riyadh',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

export function formatShortDate(value: string | Date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Riyadh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value))
}

export function formatTime(value: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Riyadh',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(value))
}

export function formatTimeRange(start: string | Date, end: string | Date) {
  return `${formatTime(start)} - ${formatTime(end)}`
}
