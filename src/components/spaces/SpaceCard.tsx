import Link from 'next/link'
import Image from 'next/image'

interface SpaceCardProps {
  id: string
  name: string
  city: string
  district?: string | null
  type: string
  price: number
  pricePeriod: string
  capacity?: number | null
  imageUrl?: string | null
}

export default function SpaceCard({
  id,
  name,
  city,
  district,
  type,
  price,
  pricePeriod,
  capacity,
  imageUrl,
}: SpaceCardProps) {
  const priceLabel = pricePeriod === 'day' ? 'يوم' : 'ساعة'

  return (
    <div className="bg-white rounded-xl border border-[#E8E3D8] shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 group">
      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1B3A2D]/10 to-[#C49A3C]/10">
            <svg className="w-16 h-16 text-[#1B3A2D]/20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
            </svg>
          </div>
        )}
        <div className="absolute top-3 start-3">
          <span className="bg-white/90 backdrop-blur-sm text-[#1B3A2D] text-xs font-medium px-2.5 py-1 rounded-full border border-white">
            {type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-1">{name}</h3>
        <p className="text-gray-500 text-xs mb-3 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {city}{district ? `، ${district}` : ''}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[#1B3A2D] font-bold text-lg">{price.toLocaleString('ar-SA')}</span>
            <span className="text-gray-400 text-xs me-1"> ر.س / {priceLabel}</span>
          </div>
          {capacity && (
            <span className="text-gray-400 text-xs flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {capacity} شخص
            </span>
          )}
        </div>

        <Link
          href={`/spaces/${id}`}
          className="mt-3 block w-full text-center bg-[#1B3A2D] text-white text-sm font-medium py-2 rounded-lg hover:bg-[#0F2219] transition-colors"
        >
          عرض التفاصيل
        </Link>
      </div>
    </div>
  )
}
