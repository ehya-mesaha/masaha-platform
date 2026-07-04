import SpaceCard from './SpaceCard'

interface Space {
  id: string
  name: string
  city: string
  district?: string | null
  price: number
  pricePeriod: string
  capacity?: number | null
  type: { name: string }
  images: { url: string; order: number }[]
}

interface SpaceGridProps {
  spaces: Space[]
  emptyMessage?: string
}

export default function SpaceGrid({ spaces, emptyMessage = 'لا توجد مساحات متاحة' }: SpaceGridProps) {
  if (spaces.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <div className="text-6xl mb-4">🏢</div>
        <p className="text-lg">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        />
      ))}
    </div>
  )
}
