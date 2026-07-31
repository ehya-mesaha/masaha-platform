// Client-safe (no Prisma) date generation shared by the search form and booking flow.

export function generateWeekdayDates(startDate: string, endDate: string, weekdays: number[]): string[] {
  if (!startDate || !endDate || weekdays.length === 0) return []
  const start = new Date(`${startDate}T12:00:00`)
  const end = new Date(`${endDate}T12:00:00`)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return []

  const days = new Set(weekdays)
  const dates: string[] = []
  const cursor = new Date(start)
  while (cursor <= end) {
    if (days.has(cursor.getDay())) dates.push(toDateValue(cursor))
    if (dates.length > 400) break
    cursor.setDate(cursor.getDate() + 1)
  }
  return dates
}

export function toDateValue(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseDateValue(value: string): Date {
  return new Date(`${value}T12:00:00`)
}

const ALL_WEEKDAYS = new Set([0, 1, 2, 3, 4, 5, 6])

// Which weekdays (0=Sun..6=Sat) actually occur within [startDate, endDate].
// A range of 7+ days always covers every weekday; shorter ranges only cover
// whichever specific weekdays fall inside them.
export function weekdaysInRange(startDate: string, endDate: string): Set<number> {
  if (!startDate || !endDate) return new Set(ALL_WEEKDAYS)
  const start = parseDateValue(startDate)
  const end = parseDateValue(endDate)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return new Set()

  const spanDays = Math.round((end.getTime() - start.getTime()) / 86_400_000)
  if (spanDays >= 6) return new Set(ALL_WEEKDAYS)

  const days = new Set<number>()
  const cursor = new Date(start)
  while (cursor <= end) {
    days.add(cursor.getDay())
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}
