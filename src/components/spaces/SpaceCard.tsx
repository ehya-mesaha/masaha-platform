import Link from 'next/link'

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
    <Link href={`/spaces/${id}`} className="card-elevated hover-lift overflow-hidden group block">
      {/* Image */}
      <div className="relative h-52 bg-gradient-to-br from-[#F7F3EB] to-[#ECE6D8] overflow-hidden">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-20 h-20 text-[#C49A3C]/30" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F2219]/55 via-[#0F2219]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Type badge */}
        <div className="absolute top-3 end-3">
          <span className="chip bg-white/95 backdrop-blur text-[#1B3A2D] shadow-sm border border-white">
            {type}
          </span>
        </div>

        {/* Capacity badge */}
        {capacity && (
          <div className="absolute bottom-3 start-3">
            <span className="chip bg-[#1B3A2D]/90 backdrop-blur text-white">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {capacity}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 bg-[linear-gradient(180deg,#fff_0%,#fffdf9_100%)]">
        <h3 className="font-display font-extrabold text-[#14201A] text-lg mb-1.5 line-clamp-1 group-hover:text-[#1B3A2D]">
          {name}
        </h3>
        <div className="text-[#6B7566] text-xs mb-4 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-[#C49A3C]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{city}{district ? ` · ${district}` : ''}</span>
        </div>

        <div className="pt-4 border-t border-dashed border-[#ECE6D8] flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-2xl font-extrabold text-[#14201A]">
                {price.toLocaleString('ar-SA')}
              </span>
              <span className="text-[#6B7566] text-xs font-medium">ر.س</span>
            </div>
            <div className="text-[10px] text-[#B5B0A2] mt-0.5">
              لكل {priceLabel}
            </div>
          </div>
          <div className="flex items-center gap-1 text-[#1B3A2D] text-xs font-semibold group-hover:gap-2 transition-all duration-300">
            <span>عرض التفاصيل</span>
            <svg className="w-3.5 h-3.5 rotate-180" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}
