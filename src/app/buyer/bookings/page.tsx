import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import BuyerBookingsHub, { type BuyerBookingItem } from '@/components/bookings/BuyerBookingsHub'

export default async function BuyerBookingsPage() {
  const user = await getCurrentUser()
  if (!user) return null

  let bookings: BuyerBookingItem[] = []
  try {
    const rows = await prisma.booking.findMany({
      where: { buyerId: user.id as string },
      include: {
        review: { select: { id: true } },
        space: {
          include: {
            type: true,
            images: { take: 1, orderBy: { order: 'asc' } },
          },
        },
      },
      orderBy: { startTime: 'desc' },
    })
    bookings = rows.map(booking => ({
      id: booking.id,
      status: booking.status,
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
      grandTotal: booking.grandTotal,
      sellerNote: booking.sellerNote,
      hasReview: Boolean(booking.review),
      space: {
        name: booking.space.name,
        city: booking.space.city,
        district: booking.space.district,
        typeName: booking.space.type.name,
        imageUrl: booking.space.images[0]?.url || null,
      },
    }))
  } catch {
    // The empty state remains usable if the database is temporarily unavailable.
  }

  return <BuyerBookingsHub userName={user.name as string} bookings={bookings} />
}
