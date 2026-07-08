import { prisma } from '@/lib/prisma'
import PublicNavbar from '@/components/layout/PublicNavbar'
import Footer from '@/components/layout/Footer'
import SpaceGrid from '@/components/spaces/SpaceGrid'
import Link from 'next/link'

interface SearchParams {
  city?: string
  typeId?: string
  type?: string
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
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-[#E8E3D8] p-5 sticky top-20">
              <h3 className="font-semibold text-gray-900 mb-4">فلترة النتائج</h3>

              <form method="get">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">المدينة</label>
                    <input
                      name="city"
                      defaultValue={params.city}
                      placeholder="الرياض، جدة..."
                      className="w-full px-3 py-2 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">نوع المساحة</label>
                    <select
                      name="typeId"
                      defaultValue={params.typeId}
                      className="w-full px-3 py-2 rounded-lg border border-[#E8E3D8] text-sm focus:outline-none focus:border-[#1B3A2D] bg-white"
                    >
                      <option value="">جميع الأنواع</option>
                      {types.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#1B3A2D] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#0F2219] transition-colors"
                  >
                    تطبيق الفلتر
                  </button>

                  {(params.city || params.typeId) && (
                    <Link
                      href="/spaces"
                      className="block w-full text-center text-sm text-gray-500 hover:text-gray-700"
                    >
                      مسح الفلتر
                    </Link>
                  )}
                </div>
              </form>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
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
  else if (params.type) {
    const matchedTypes = await prisma.spaceType.findMany({
      where: { name: { contains: params.type, mode: 'insensitive' } },
      select: { id: true },
    })
    where.typeId = { in: matchedTypes.map(type => type.id) }
  }

  return prisma.space.findMany({
    where,
    include: {
      type: true,
      images: { orderBy: { order: 'asc' }, take: 1 },
    },
    orderBy: { createdAt: 'desc' },
  })
}
