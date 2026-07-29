import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Badge, { getSpaceStatusBadge } from '@/components/ui/Badge'
import { formatNumber, formatSpaceNumber } from '@/lib/format'

export default async function SellerSpacesPage() {
  const user = await getCurrentUser()
  if (!user) return null
  const spaces = await prisma.space.findMany({
    where: { sellerId: String(user.id) },
    include: {
      type: true,
      images: { take: 1, orderBy: { order: 'asc' } },
      units: { where: { isActive: true }, select: { id: true } },
      _count: { select: { bookings: true, privateOccupancies: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="dashboard-page">
      <header className="page-hero mb-6 p-6">
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="mb-2 text-xs font-bold text-[#B99A63]">إدارة العرض والجدول</p><h1 className="text-2xl font-extrabold text-white">مساحاتي</h1><p className="mt-2 text-sm text-white/65">أدر الوحدات والحجوزات والإشغال الخاص والإغلاقات المؤقتة لكل مساحة.</p></div>
          <Link href="/seller/spaces/new" className="rounded-xl bg-[#B99A63] px-5 py-2.5 text-sm font-bold text-[#1B1B1B]">إضافة مساحة</Link>
        </div>
      </header>

      {spaces.length === 0 ? <section className="premium-card p-12 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#EEF3EE] text-[#0E3B34]"><BuildingIcon /></span>
        <h2 className="mt-4 text-lg font-extrabold text-[#1B1B1B]">لم تضف أي مساحة بعد</h2>
        <p className="mt-2 text-sm text-[#5F6764]">ابدأ بإضافة أول مساحة ووحداتها وجدولها الأسبوعي.</p>
        <Link href="/seller/spaces/new" className="mt-5 inline-flex rounded-xl bg-[#0E3B34] px-6 py-3 text-sm font-bold text-white">إضافة مساحة</Link>
      </section> : <div className="grid gap-5 xl:grid-cols-2">
        {spaces.map((space) => {
          const badge = getSpaceStatusBadge(space.status)
          return <article key={space.id} className="premium-card overflow-hidden">
            <div className="flex gap-4 p-5">
              <div className="h-28 w-32 shrink-0 overflow-hidden rounded-2xl bg-[#EEF1ED]">
                {space.images[0]?.url ? <img src={space.images[0].url} alt={space.name} className="h-full w-full object-cover" /> : <span className="grid h-full place-items-center text-[#8B958E]"><BuildingIcon /></span>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3"><div><p dir="ltr" className="text-right font-mono text-xs font-bold text-[#B99A63]">{formatSpaceNumber(space.refSeq)}</p><h2 className="mt-1 truncate text-lg font-extrabold text-[#1B1B1B]">{space.name}</h2></div><Badge variant={badge.variant}>{badge.label}</Badge></div>
                <p className="mt-2 text-xs text-[#5F6764]">{space.type.name} · {space.city}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-[#33423F]">
                  <span className="rounded-full bg-[#F5F1E8] px-3 py-1">{formatNumber(space.units.length)} وحدة</span>
                  <span className="rounded-full bg-[#F5F1E8] px-3 py-1">{formatNumber(space._count.bookings)} حجز</span>
                  <span className="rounded-full bg-[#F5F1E8] px-3 py-1">{formatNumber(space.price)} ر.س / ساعة</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-px border-t border-[#D8D1C7] bg-[#D8D1C7] sm:grid-cols-4">
              <Action href={`/seller/spaces/${space.id}/edit`} label="تعديل البيانات" icon={<EditIcon />} />
              <Action href={`/seller/bookings?space=${space.id}`} label="الحجوزات" icon={<CalendarIcon />} />
              <Action href={`/seller/spaces/${space.id}/occupancy`} label="إشغال خاص" icon={<LockIcon />} />
              <Action href={`/seller/spaces/${space.id}/closures`} label="إغلاق مؤقت" icon={<PauseIcon />} />
            </div>
          </article>
        })}
      </div>}
    </div>
  )
}

function Action({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) { return <Link href={href} className="flex items-center justify-center gap-2 bg-white px-3 py-3 text-xs font-bold text-[#33423F] hover:bg-[#FAF8F3]">{icon}{label}</Link> }
const Svg = ({ children }: { children: React.ReactNode }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
const BuildingIcon = () => <Svg><path d="M4 21V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16M8 7h5M8 11h5M8 15h5M2 21h20" /></Svg>
const EditIcon = () => <Svg><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" /></Svg>
const CalendarIcon = () => <Svg><path d="M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" /></Svg>
const LockIcon = () => <Svg><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></Svg>
const PauseIcon = () => <Svg><path d="M8 5v14M16 5v14" /></Svg>
