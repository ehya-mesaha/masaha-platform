import { prisma } from '@/lib/prisma'
import { SpaceStatus } from '@/generated/prisma'
import Link from 'next/link'
import Badge, { getSpaceStatusBadge } from '@/components/ui/Badge'
import Card from '@/components/ui/Card'

export default async function AdminSpacesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  const status = params.status

  let spaces: SpaceType[] = []

  try {
    const raw = await prisma.space.findMany({
      where: status ? { status: status as SpaceStatus } : undefined,
      include: {
        type: true,
        seller: { select: { name: true } },
        images: { take: 1, orderBy: { order: 'asc' } },
        _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    spaces = raw as unknown as SpaceType[]
  } catch {
    // DB not connected
  }

  const tabs = [
    { label: 'الكل', value: '' },
    { label: 'بانتظار المراجعة', value: 'PENDING_REVIEW' },
    { label: 'معتمدة', value: 'APPROVED' },
    { label: 'مرفوضة', value: 'REJECTED' },
    { label: 'مسودة', value: 'DRAFT' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">المساحات</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(tab => (
          <Link
            key={tab.value}
            href={tab.value ? `/admin/spaces?status=${tab.value}` : '/admin/spaces'}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              status === tab.value || (!status && tab.value === '')
                ? 'bg-[#1B3A2D] text-white'
                : 'bg-white text-gray-600 border border-[#E8E3D8] hover:border-[#1B3A2D]'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-[#E8E3D8]">
              <tr>
                <th className="text-right px-5 py-3 text-gray-600 font-medium">المساحة</th>
                <th className="text-right px-5 py-3 text-gray-600 font-medium">المالك</th>
                <th className="text-right px-5 py-3 text-gray-600 font-medium">النوع</th>
                <th className="text-right px-5 py-3 text-gray-600 font-medium">المدينة</th>
                <th className="text-right px-5 py-3 text-gray-600 font-medium">الحالة</th>
                <th className="text-right px-5 py-3 text-gray-600 font-medium">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3D8]">
              {spaces.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-gray-500 py-10">لا توجد مساحات</td></tr>
              ) : spaces.map((s) => {
                const { variant, label } = getSpaceStatusBadge(s.status)
                return (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {s.images[0]?.url
                            ? <img src={s.images[0].url} alt={s.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-gray-300">🏢</div>
                          }
                        </div>
                        <p className="font-medium text-gray-900">{s.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-700">{s.seller.name}</td>
                    <td className="px-5 py-4 text-gray-700">{s.type.name}</td>
                    <td className="px-5 py-4 text-gray-700">{s.city}</td>
                    <td className="px-5 py-4"><Badge variant={variant}>{label}</Badge></td>
                    <td className="px-5 py-4">
                      <Link href={`/admin/spaces/${s.id}`} className="text-[#1B3A2D] font-medium hover:underline text-xs">
                        مراجعة
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

type SpaceType = {
  id: string
  name: string
  city: string
  status: string
  type: { name: string }
  seller: { name: string }
  images: { url: string }[]
  _count: { bookings: number }
}
