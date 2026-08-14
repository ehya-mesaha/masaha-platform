import type { Prisma, PrismaClient } from '@/generated/prisma'

export type RequestedSession = {
  date: string
  startTime: string
  endTime: string
  startAt: Date
  endAt: Date
}

type Database = PrismaClient | Prisma.TransactionClient

type AvailabilitySpace = {
  id: string
  status: string
  workingHours: Array<{ dayOfWeek: number; isOpen: boolean; openTime: string; closeTime: string }>
  units: Array<{ id: string }>
  bookings: Array<{ unitId: string; startTime: Date; endTime: Date }>
  privateOccupancies: Array<{ unitId: string | null; startTime: Date; endTime: Date }>
  temporaryClosures: Array<{ unitId: string | null; startTime: Date; endTime: Date }>
}

const RIYADH_OFFSET = '+03:00'

export function toSession(date: string, startTime: string, endTime: string): RequestedSession {
  const startAt = new Date(`${date}T${startTime}:00${RIYADH_OFFSET}`)
  const endAt = new Date(`${date}T${endTime}:00${RIYADH_OFFSET}`)
  if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime()) || endAt <= startAt) {
    throw new Error('INVALID_SESSION')
  }
  return { date, startTime, endTime, startAt, endAt }
}

export function sessionsFromDates(dates: string[], startTime: string, endTime: string): RequestedSession[] {
  const unique = Array.from(new Set(dates)).sort()
  if (unique.length === 0) throw new Error('NO_DATES')
  if (unique.length > 60) throw new Error('TOO_MANY_SESSIONS')
  return unique.map(date => toSession(date, startTime, endTime))
}

export function generateProgramSessions(input: {
  startDate: string
  endDate: string
  weekdays: number[]
  startTime: string
  endTime: string
}) {
  const { startDate, endDate, weekdays, startTime, endTime } = input
  const start = new Date(`${startDate}T12:00:00${RIYADH_OFFSET}`)
  const end = new Date(`${endDate}T12:00:00${RIYADH_OFFSET}`)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    throw new Error('INVALID_DATE_RANGE')
  }

  const selectedDays = new Set(weekdays.filter(day => Number.isInteger(day) && day >= 0 && day <= 6))
  if (selectedDays.size === 0) throw new Error('NO_WEEKDAYS')

  const sessions: RequestedSession[] = []
  const cursor = new Date(start)
  while (cursor <= end) {
    const localDate = cursor.toLocaleDateString('en-CA', { timeZone: 'Asia/Riyadh' })
    const localDay = new Date(`${localDate}T12:00:00${RIYADH_OFFSET}`).getUTCDay()
    if (selectedDays.has(localDay)) sessions.push(toSession(localDate, startTime, endTime))
    if (sessions.length > 400) throw new Error('TOO_MANY_SESSIONS')
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  return sessions
}

export function durationHours(startAt: Date, endAt: Date) {
  return Math.round(((endAt.getTime() - startAt.getTime()) / 3_600_000) * 100) / 100
}

export async function getSpaceAvailability(db: Database, spaceId: string, sessions: RequestedSession[]) {
  if (sessions.length === 0) {
    return { totalSessions: 0, availableSessions: 0, fullyAvailable: false, allocations: [] as Array<{ session: RequestedSession; unitId: string }> }
  }

  const rangeStart = new Date(Math.min(...sessions.map(session => session.startAt.getTime())))
  const rangeEnd = new Date(Math.max(...sessions.map(session => session.endAt.getTime())))
  const space = await db.space.findUnique({
    where: { id: spaceId },
    select: {
      id: true,
      status: true,
      workingHours: true,
      units: { where: { isActive: true }, orderBy: { label: 'asc' } },
      bookings: {
        where: {
          OR: [
            { status: 'CONFIRMED' },
            { status: 'PENDING_PAYMENT', paymentOrder: { expiresAt: { gt: new Date() } } },
          ],
          startTime: { lt: rangeEnd },
          endTime: { gt: rangeStart },
        },
        select: { unitId: true, startTime: true, endTime: true },
      },
      privateOccupancies: {
        where: {
          status: { in: ['PLANNED', 'CONFIRMED'] },
          startTime: { lt: rangeEnd },
          endTime: { gt: rangeStart },
        },
        select: { unitId: true, startTime: true, endTime: true },
      },
      temporaryClosures: {
        where: {
          status: 'ACTIVE',
          startTime: { lt: rangeEnd },
          endTime: { gt: rangeStart },
        },
        select: { unitId: true, startTime: true, endTime: true },
      },
    },
  })

  if (!space) {
    return { totalSessions: sessions.length, availableSessions: 0, fullyAvailable: false, allocations: [] as Array<{ session: RequestedSession; unitId: string }> }
  }

  return evaluateSpaceAvailability(space, sessions)
}

export async function getSpacesAvailability(db: Database, spaceIds: string[], sessions: RequestedSession[]) {
  if (spaceIds.length === 0 || sessions.length === 0) return new Map<string, ReturnType<typeof evaluateSpaceAvailability>>()

  const rangeStart = new Date(Math.min(...sessions.map(session => session.startAt.getTime())))
  const rangeEnd = new Date(Math.max(...sessions.map(session => session.endAt.getTime())))
  const spaces = await db.space.findMany({
    where: { id: { in: spaceIds }, status: 'APPROVED' },
    select: {
      id: true,
      status: true,
      workingHours: true,
      units: { where: { isActive: true }, orderBy: { label: 'asc' } },
      bookings: {
        where: {
          OR: [
            { status: 'CONFIRMED' },
            { status: 'PENDING_PAYMENT', paymentOrder: { expiresAt: { gt: new Date() } } },
          ],
          startTime: { lt: rangeEnd },
          endTime: { gt: rangeStart },
        },
        select: { unitId: true, startTime: true, endTime: true },
      },
      privateOccupancies: {
        where: { status: { in: ['PLANNED', 'CONFIRMED'] }, startTime: { lt: rangeEnd }, endTime: { gt: rangeStart } },
        select: { unitId: true, startTime: true, endTime: true },
      },
      temporaryClosures: {
        where: { status: 'ACTIVE', startTime: { lt: rangeEnd }, endTime: { gt: rangeStart } },
        select: { unitId: true, startTime: true, endTime: true },
      },
    },
  })

  return new Map(spaces.map(space => [space.id, evaluateSpaceAvailability(space, sessions)]))
}

function evaluateSpaceAvailability(space: AvailabilitySpace, sessions: RequestedSession[]) {
  if (space.status !== 'APPROVED' || space.units.length === 0) {
    return { totalSessions: sessions.length, availableSessions: 0, fullyAvailable: false, allocations: [] as Array<{ session: RequestedSession; unitId: string }> }
  }

  const overlaps = (start: Date, end: Date, session: RequestedSession) => start < session.endAt && end > session.startAt
  const allocations: Array<{ session: RequestedSession; unitId: string }> = []
  // Legacy listings may have seven generated rows with every day disabled. They mean
  // "schedule not configured", just like having no rows at all. Only enforce a weekly
  // schedule once the seller has opened at least one day.
  const hasWorkingHourRules = space.workingHours.some(item => item.isOpen)

  for (const session of sessions) {
    const day = new Date(`${session.date}T12:00:00${RIYADH_OFFSET}`).getUTCDay()
    const hours = space.workingHours.find(item => item.dayOfWeek === day && item.isOpen)
    if (hasWorkingHourRules && (!hours || session.startTime < hours.openTime || session.endTime > hours.closeTime)) continue

    const availableUnit = space.units.find(unit => {
      const bookingConflict = space.bookings.some(item => item.unitId === unit.id && overlaps(item.startTime, item.endTime, session))
      const occupancyConflict = space.privateOccupancies.some(item => (!item.unitId || item.unitId === unit.id) && overlaps(item.startTime, item.endTime, session))
      const closureConflict = space.temporaryClosures.some(item => (!item.unitId || item.unitId === unit.id) && overlaps(item.startTime, item.endTime, session))
      return !bookingConflict && !occupancyConflict && !closureConflict
    })

    if (availableUnit) allocations.push({ session, unitId: availableUnit.id })
  }

  return {
    totalSessions: sessions.length,
    availableSessions: allocations.length,
    fullyAvailable: allocations.length === sessions.length,
    allocations,
  }
}

export function calculateCancellation(input: {
  policy: 'FLEXIBLE' | 'MODERATE' | 'STRICT'
  bookingStart: Date
  grandTotal: number
  now?: Date
}) {
  const hoursBeforeBooking = (input.bookingStart.getTime() - (input.now ?? new Date()).getTime()) / 3_600_000
  if (input.policy === 'FLEXIBLE' && hoursBeforeBooking >= 24) {
    return { refundPercent: 100, refundAmount: input.grandTotal }
  }
  if (input.policy === 'MODERATE' && hoursBeforeBooking >= 5 * 24) {
    return { refundPercent: 50, refundAmount: input.grandTotal * 0.5 }
  }
  return { refundPercent: 0, refundAmount: 0 }
}
