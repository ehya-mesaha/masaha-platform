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
    <Link href={`/spaces/${id}`} className="group block overflow-hidden rounded-[14px] border border-[#E4DED1] bg-white shadow-[0_22px_60px_-45px_rgba(15,34,25,.68)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C49A3C]/55 hover:shadow-[0_32px_80px_-48px_rgba(15,34,25,.76)]">
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-[#F7F3EB] to-[#ECE6D8]">
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F2219]/60 via-transparent to-[#0F2219]/10 opacity-75 transition-opacity duration-500 group-hover:opacity-95" />

        {/* Type badge */}
        <div className="absolute top-3 end-3">
          <span className="chip border border-white/70 bg-white/92 text-[#1B3A2D] shadow-sm backdrop-blur">
            {type}
          </span>
        </div>

        <div className="absolute start-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#0F2219]/60 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
          <svg className="h-3 w-3 text-[#E4C878]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" /></svg>
          مساحة معتمدة
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
      <div className="bg-[linear-gradient(180deg,#fff_0%,#fffdf9_100%)] p-5">
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

        <div className="flex items-end justify-between border-t border-[#ECE6D8] pt-4">
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
          <div className="grid h-9 w-9 place-items-center rounded-lg border border-[#DED6C7] text-[#1B3A2D] transition-all duration-300 group-hover:border-[#1B3A2D] group-hover:bg-[#1B3A2D] group-hover:text-white">
            <svg className="h-4 w-4 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}
