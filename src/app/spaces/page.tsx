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
    <div className="public-shell min-h-screen flex flex-col">
      <PublicNavbar />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-10 flex-1">
        <div className="page-hero mb-8 px-6 py-8 sm:px-8 lg:px-10 lg:py-10 animate-in">
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold text-[#D9B65C] mb-3">اكتشف المساحة المناسبة</p>
              <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">مكانك القادم يبدأ من هنا.</h1>
              <p className="mt-3 text-sm leading-7 text-white/65">استخدم الفلاتر للوصول إلى مساحة تناسب ميزانيتك وموعدك وسعة فريقك، ثم راجع كل التفاصيل قبل إرسال الطلب.</p>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-sm">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#C49A3C] text-[#14201A]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 20h16M6 20V7l6-3 6 3v13M9 10h2m2 0h2m-6 4h2m2 0h2" /></svg>
              </span>
              <span><strong className="block text-xl text-white">{spaces.length.toLocaleString('ar-SA')}</strong><span className="text-[11px] text-white/55">مساحة مطابقة حالياً</span></span>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-80 flex-shrink-0">
            <SpacesFilters types={types} params={params} />
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <div className="flex items-center justify-between border-b border-[#DDD5C5] pb-5 mb-6 animate-in">
              <div>
                <p className="text-[11px] font-bold text-[#A3802F]">نتائج البحث</p>
                <h2 className="mt-1 text-xl font-extrabold text-[#14201A]">المساحات المتاحة</h2>
              </div>
              <span className="rounded-full border border-[#DDD5C5] bg-white px-3 py-1.5 text-xs font-bold text-[#4A554D]">{spaces.length.toLocaleString('ar-SA')} نتيجة</span>
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
