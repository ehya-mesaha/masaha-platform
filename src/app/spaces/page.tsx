import { prisma } from '@/lib/prisma'
import PublicNavbar from '@/components/layout/PublicNavbar'
import Footer from '@/components/layout/Footer'
import SpaceGrid from '@/components/spaces/SpaceGrid'
import SpacesFilters from '@/components/spaces/SpacesFiltersPro'
import SaveSearchButton from '@/components/spaces/SaveSearchButton'
import { durationHours, generateProgramSessions, getSpaceAvailability, toSession } from '@/lib/availability'

interface SearchParams {
  city?: string
  typeId?: string
  type?: string
  minPrice?: string
  maxPrice?: string
  capacity?: string
  date?: string
  startDate?: string
  endDate?: string
  weekdays?: string
  mode?: string
  fullyAvailable?: string
  startTime?: string
  endTime?: string
  days?: string
  sort?: string
}

export default async function SpacesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const isProgram = params.mode === 'program'
  const programSessions = safeProgramSessions(params)
  const programTotalHours = programSessions.reduce((total, session) => total + durationHours(session.startAt, session.endAt), 0)
  const sessionHours = programSessions[0] ? durationHours(programSessions[0].startAt, programSessions[0].endAt) : 0

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
              <p className="text-xs font-bold text-[#D9B65C] mb-3">{isProgram ? 'نتائج البحث عن برنامج' : 'اكتشف المساحة المناسبة'}</p>
              <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
                {isProgram ? `${sessionHours.toLocaleString('en-US')} ساعة لكل جلسة لمدة ${programSessions.length.toLocaleString('en-US')} جلسة` : 'مكانك القادم يبدأ من هنا.'}
              </h1>
              <p className="mt-3 text-sm leading-7 text-white/65">
                {isProgram ? `تم العثور على ${spaces.length.toLocaleString('en-US')} مساحة مناسبة لبرنامجك.` : 'استخدم الفلاتر للوصول إلى مساحة تناسب موعدك وسعة فريقك، ثم راجع كل التفاصيل قبل الحجز المباشر.'}
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-sm">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#B99A63] text-[#1B1B1B]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 20h16M6 20V7l6-3 6 3v13M9 10h2m2 0h2m-6 4h2m2 0h2" /></svg>
              </span>
              <span><strong className="block text-xl text-white">{spaces.length.toLocaleString('en-US')}</strong><span className="text-[11px] text-white/55">مساحة مطابقة حالياً</span></span>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-80 flex-shrink-0">
            {isProgram && programSessions.length > 0 && (
              <div className="premium-card mb-5 p-5">
                <p className="text-xs font-extrabold text-[#B1872E]">ملخص البرنامج</p>
                <div className="mt-4 space-y-3 text-sm">
                  <SummaryRow label="عدد الجلسات" value={`${programSessions.length.toLocaleString('en-US')} جلسة`} />
                  <SummaryRow label="مدة الجلسة" value={`${sessionHours.toLocaleString('en-US')} ساعة`} />
                  <SummaryRow label="إجمالي الساعات" value={`${programTotalHours.toLocaleString('en-US')} ساعة`} />
                </div>
                <p className="mt-4 rounded-xl bg-[#F5F1E8] p-3 text-xs leading-6 text-[#5D685F]">يُطبق أعلى خصم مؤهل تلقائيًا، دون جمع الخصومات.</p>
              </div>
            )}
            <SpacesFilters types={types} params={params} />
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <div className="flex items-center justify-between border-b border-[#D8D1C7] pb-5 mb-6 animate-in">
              <div>
                <p className="text-[11px] font-bold text-[#A3802F]">{isProgram ? 'برنامجك المتكرر' : 'نتائج البحث'}</p>
                <h2 className="mt-1 text-xl font-extrabold text-[#1B1B1B]">{isProgram ? 'المساحات المناسبة للبرنامج' : 'المساحات المتاحة'}</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <SaveSearchButton criteria={params} />
                <span className="rounded-full border border-[#D8D1C7] bg-white px-3 py-1.5 text-xs font-bold text-[#3F4B47]">{spaces.length.toLocaleString('en-US')} نتيجة</span>
              </div>
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

  const orderBy =
    params.sort === 'priceAsc'
      ? { price: 'asc' as const }
      : params.sort === 'priceDesc'
        ? { price: 'desc' as const }
        : params.sort === 'capacityDesc'
          ? { capacity: 'desc' as const }
          : { createdAt: 'desc' as const }

  const candidates = await prisma.space.findMany({
    where,
    include: {
      type: true,
      images: { orderBy: { order: 'asc' }, take: 1 },
      pricingTiers: { orderBy: { minHours: 'desc' } },
    },
    orderBy,
  })

  let sessions: ReturnType<typeof generateProgramSessions> = []
  try {
    if (params.mode === 'program' && params.startDate && params.endDate && params.weekdays && params.startTime && params.endTime) {
      sessions = generateProgramSessions({
        startDate: params.startDate,
        endDate: params.endDate,
        weekdays: params.weekdays.split(',').map(Number),
        startTime: params.startTime,
        endTime: params.endTime,
      })
    } else if (params.date && params.startTime && params.endTime) {
      sessions = [toSession(params.date, params.startTime, params.endTime)]
    }
  } catch {
    return []
  }

  if (sessions.length === 0) return candidates
  const totalHours = sessions.reduce((total, session) => total + durationHours(session.startAt, session.endAt), 0)
  const evaluated = await mapWithConcurrency(candidates, 8, async space => {
    const availability = await getSpaceAvailability(prisma, space.id, sessions)
    const tierDiscount = space.pricingTiers.find(tier => totalHours >= tier.minHours)?.discountPercent ?? 0
    const discountPercent = Math.max(sessions.length > 1 ? 5 : 0, tierDiscount)
    const baseTotal = Math.round(space.price * totalHours * 100) / 100
    const discountAmount = Math.round(baseTotal * discountPercent) / 100
    return {
      ...space,
      availableSessions: availability.availableSessions,
      totalSessions: availability.totalSessions,
      totalHours,
      baseTotal,
      discountAmount,
      finalTotal: baseTotal - discountAmount,
    }
  })

  return evaluated.filter(space => params.fullyAvailable === '1'
    ? space.availableSessions === space.totalSessions
    : space.availableSessions > 0)
}

async function mapWithConcurrency<T, R>(items: T[], limit: number, mapper: (item: T) => Promise<R>) {
  const results: R[] = new Array(items.length)
  let cursor = 0
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++
      results[index] = await mapper(items[index])
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-3"><span className="text-[#5F6764]">{label}</span><strong className="text-[#0E3B34]">{value}</strong></div>
}

function safeProgramSessions(params: SearchParams) {
  if (params.mode !== 'program' || !params.startDate || !params.endDate || !params.weekdays || !params.startTime || !params.endTime) return []
  try {
    return generateProgramSessions({
      startDate: params.startDate,
      endDate: params.endDate,
      weekdays: params.weekdays.split(',').map(Number),
      startTime: params.startTime,
      endTime: params.endTime,
    })
  } catch {
    return []
  }
}
