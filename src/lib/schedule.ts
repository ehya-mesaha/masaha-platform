/**
 * Client-side helpers for the "from date → to date, on these weekdays" controls behind
 * private occupancy and temporary closures.
 *
 * These mirror `generateProgramSessions` on the server so the count the owner is shown
 * before saving is the count that actually gets written. Everything works on `YYYY-MM-DD`
 * strings and never on the browser's own clock: a `Date` built from a bare date string is
 * parsed in local time, so deriving the weekday from it would shift by a day for anyone far
 * enough from Riyadh, and the preview would disagree with what the server produced.
 */

/** Today in Riyadh, as `YYYY-MM-DD` — the platform's working day, not the browser's. */
export function riyadhToday() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Riyadh' })
}

/** An instant that is unambiguously noon in Riyadh on the given day, safe to format. */
export function riyadhNoon(date: string) {
  return `${date}T12:00:00+03:00`
}

function parts(date: string) {
  const [year, month, day] = date.split('-').map(Number)
  return { year, month, day }
}

/** Day of week (0 = Sunday) for a calendar date, independent of the viewer's timezone. */
export function weekdayOf(date: string) {
  const { year, month, day } = parts(date)
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay()
}

export function shiftDate(date: string, { days = 0, months = 0 }: { days?: number; months?: number }) {
  const { year, month, day } = parts(date)
  const shifted = new Date(Date.UTC(year, month - 1 + months, day + days))
  return shifted.toISOString().slice(0, 10)
}

/**
 * Every date in the inclusive range that falls on one of the chosen weekdays.
 *
 * No weekday chosen means every day — someone blocking a straight week of exams should not
 * have to tick all seven boxes.
 */
export function datesInRange(startDate: string, endDate: string, weekdays: number[], limit = 500) {
  if (!startDate || !endDate || endDate < startDate) return []
  const days = weekdays.length ? weekdays : [0, 1, 2, 3, 4, 5, 6]
  const dates: string[] = []
  let cursor = startDate
  while (cursor <= endDate && dates.length <= limit) {
    if (days.includes(weekdayOf(cursor))) dates.push(cursor)
    cursor = shiftDate(cursor, { days: 1 })
  }
  return dates
}
