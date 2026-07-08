import { prisma } from '@/lib/prisma'
import PublicNavbar from '@/components/layout/PublicNavbar'
import Footer from '@/components/layout/Footer'
import SpaceGrid from '@/components/spaces/SpaceGrid'
import SpacesFilters from '@/components/spaces/SpacesFiltersPro'

interface SearchParams {
  city?: string
  typeId?: string
  type?: string
  minPrice?: string
  maxPrice?: string
  capacity?: string
  date?: string
  startTime?: string
  endTime?: string
  days?: string
  pricePeriod?: string
  sort?: string
}

export default async function SpacesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  let spaces: Awaited<ReturnType<typeof getSpaces>> = []
  let types: { id: string; name: string }[] = []

  try {
    spaces = await getSpaces(params)
    types = await prisma.spaceType.findMany({ orderBy: { name: 'asc' } })
  } catch {
    // DB not connected
  }

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <PublicNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <div className="page-hero mb-8 p-7 animate-in">
          <div className="relative">
            <p className="text-xs font-bold text-[#C49A3C] mb-2">اكتشف المساحة المناسبة</p>
            <h1 className="text-3xl font-extrabold text-white">المساحات المتاحة</h1>
            <p className="mt-2 text-sm text-white/65">فلتر حسب المدينة والنوع، ثم افتح التفاصيل للحجز والتواصل مع صاحب المساحة.</p>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-80 flex-shrink-0">
            <SpacesFilters types={types} params={params} />
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6 animate-in">
              <h1 className="text-xl font-bold text-gray-900">
                المساحات المتاحة
                <span className="text-gray-400 font-normal text-base me-2">({spaces.length})</span>
              </h1>
            </div>

            <SpaceGrid spaces={spaces} />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}

async function getSpaces(params: SearchParams) {
  const where: Record<string, unknown> = { status: 'APPROVED' }
  if (params.city) where.city = { contains: params.city, mode: 'insensitive' }
  if (params.typeId) where.typeId = params.typeId
  if (params.pricePeriod) where.pricePeriod = params.pricePeriod
  if (params.minPrice || params.maxPrice) {
    where.price = {
      ...(params.minPrice ? { gte: Number(params.minPrice) } : {}),
      ...(params.maxPrice ? { lte: Number(params.maxPrice) } : {}),
    }
  }
  if (params.capacity) where.capacity = { gte: Number(params.capacity) }
  if (!params.typeId && params.type) {
    const matchedTypes = await prisma.spaceType.findMany({
      where: { name: { contains: params.type, mode: 'insensitive' } },
      select: { id: true },
    })
    where.typeId = { in: matchedTypes.map(type => type.id) }
  }

  const workingHourFilter: Record<string, unknown> = { isOpen: true }
  const selectedDays = (params.days || '').split(',').filter(Boolean).map(Number)
  if (params.date) selectedDays.push(new Date(`${params.date}T00:00:00`).getDay())
  const uniqueDays = Array.from(new Set(selectedDays.filter(day => Number.isInteger(day) && day >= 0 && day <= 6)))
  if (uniqueDays.length > 0) workingHourFilter.dayOfWeek = { in: uniqueDays }
  if (params.startTime) workingHourFilter.closeTime = { gte: params.startTime }
  if (params.endTime) workingHourFilter.openTime = { lte: params.endTime }
  if (uniqueDays.length > 0 || params.startTime || params.endTime) {
    where.workingHours = { some: workingHourFilter }
  }

  if (params.date && params.startTime && params.endTime) {
    where.bookings = {
      none: {
        date: params.date,
        status: { in: ['PENDING', 'ACCEPTED'] },
        startTime: { lt: params.endTime },
        endTime: { gt: params.startTime },
      },
    }
  }

  const orderBy =
    params.sort === 'priceAsc'
      ? { price: 'asc' as const }
      : params.sort === 'priceDesc'
        ? { price: 'desc' as const }
        : params.sort === 'capacityDesc'
          ? { capacity: 'desc' as const }
          : { createdAt: 'desc' as const }

  return prisma.space.findMany({
    where,
    include: {
      type: true,
      images: { orderBy: { order: 'asc' }, take: 1 },
    },
    orderBy,
  })
}
