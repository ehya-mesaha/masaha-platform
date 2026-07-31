import SpaceCard from './SpaceCard'
import { formatSpaceNumber } from '@/lib/format'

interface Space {
  id: string
  name: string
  city: string
  district?: string | null
  price: number
  pricePeriod: string
  capacity?: number | null
  refSeq: number
  type: { name: string }
  images: { url: string; order: number }[]
  availableSessions?: number
  totalSessions?: number
  totalHours?: number
  baseTotal?: number
  discountAmount?: number
  finalTotal?: number
}

interface SpaceGridProps {
  spaces: Space[]
  emptyMessage?: string
  bookingQuery?: string
}

export default function SpaceGrid({ spaces, emptyMessage = 'لا توجد مساحات متاحة', bookingQuery }: SpaceGridProps) {
  if (spaces.length === 0) {
    return (
      <div className="premium-card animate-in text-center py-16 text-gray-500">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-[#F5F1E8] text-[#0E3B34] floating"><svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M4 20h16M6 20V5h12v15M9 9h2m2 0h2m-6 4h2m2 0h2" /></svg></div>
        <p className="text-lg font-bold text-[#1B1B1B]">{emptyMessage}</p>
        <p className="mt-1 text-sm text-[#5F6764]">جرّب تعديل السعر أو الأيام أو وقت الحجز.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-grid">
      {spaces.map((space) => (
        <SpaceCard
          key={space.id}
          id={space.id}
          name={space.name}
          city={space.city}
          district={space.district}
          type={space.type.name}
          price={space.price}
          pricePeriod={space.pricePeriod}
          capacity={space.capacity}
          imageUrl={space.images.sort((a, b) => a.order - b.order)[0]?.url}
          spaceNumber={formatSpaceNumber(space.refSeq)}
          availableSessions={space.availableSessions}
          totalSessions={space.totalSessions}
          totalHours={space.totalHours}
          baseTotal={space.baseTotal}
          discountAmount={space.discountAmount}
          finalTotal={space.finalTotal}
          bookingQuery={bookingQuery}
        />
      ))}
    </div>
  )
}
