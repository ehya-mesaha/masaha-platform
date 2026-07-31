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
