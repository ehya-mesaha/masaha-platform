import { notFound } from 'next/navigation'
import PublicNavbar from '@/components/layout/PublicNavbar'
import Footer from '@/components/layout/Footer'
import SpaceCard from '@/components/spaces/SpaceCard'
import { prisma } from '@/lib/prisma'

export default async function SellerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let seller: SellerProfile | null = null
  let reviews: SellerReview[] = []
  let summary = { average: 0, count: 0 }

  try {
    seller = await prisma.user.findFirst({
      where: { id, role: 'SELLER', status: 'ACTIVE' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatarUrl: true,
        createdAt: true,
        spaces: {
          where: { status: 'APPROVED' },
          include: {
            type: true,
            images: { take: 1, orderBy: { order: 'asc' } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    }) as SellerProfile | null

    if (seller) {
      const spaceIds = seller.spaces.map(space => space.id)
      if (spaceIds.length > 0) {
        const [reviewRows, aggregate] = await Promise.all([
          prisma.spaceReview.findMany({
            where: { spaceId: { in: spaceIds }, isVisible: true },
            include: {
              buyer: { select: { name: true, avatarUrl: true } },
              space: { select: { name: true } },
              booking: { select: { date: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 12,
          }),
          prisma.spaceReview.aggregate({
            where: { spaceId: { in: spaceIds }, isVisible: true },
            _avg: { rating: true },
            _count: { id: true },
          }),
        ])
        reviews = reviewRows as SellerReview[]
        summary = {
          average: aggregate._avg.rating ? Number(aggregate._avg.rating.toFixed(1)) : 0,
          count: aggregate._count.id,
        }
      }
    }
  } catch (err) {
    console.error('Failed to load seller profile', err)
  }

  if (!seller) notFound()

  return (
    <div className="min-h-screen bg-paper">
      <PublicNavbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="page-hero mb-8 p-7 animate-in">
          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="flex items-center gap-5">
              <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white/15 bg-[#092C27]">
                {seller.avatarUrl ? (
                  <img src={seller.avatarUrl} alt={seller.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-extrabold text-[#B99A63]">
                    {seller.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <p className="mb-2 text-xs font-bold text-[#B99A63]">ملف صاحب المساحة</p>
                <h1 className="text-3xl font-extrabold text-white">{seller.name}</h1>
                <p className="mt-2 text-sm text-white/65">
                  عضو منذ {new Date(seller.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <HeroMetric label="المساحات" value={seller.spaces.length.toLocaleString('en-US')} />
              <HeroMetric label="التقييم" value={summary.count > 0 ? summary.average.toLocaleString('en-US') : '-'} />
              <HeroMetric label="الآراء" value={summary.count.toLocaleString('en-US')} />
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <section className="premium-card p-5 animate-in">
              <h2 className="mb-4 text-sm font-extrabold text-[#1B1B1B]">معلومات التواصل</h2>
              <div className="space-y-3 text-sm text-[#3F4B47]">
                <p dir="ltr">{seller.email}</p>
                <p dir="ltr">{seller.phone || 'لا يوجد رقم ظاهر'}</p>
              </div>
            </section>

            <section className="premium-card p-5 animate-in">
              <h2 className="mb-3 text-sm font-extrabold text-[#1B1B1B]">ملخص التقييمات</h2>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-extrabold text-[#0E3B34]">
                  {summary.count > 0 ? summary.average.toLocaleString('en-US') : '-'}
                </span>
                <div>
                  <Stars rating={summary.average} />
                  <p className="mt-1 text-xs text-[#5F6764]">
                    {summary.count > 0 ? `${summary.count.toLocaleString('en-US')} تقييم موثق` : 'لا توجد تقييمات بعد'}
                  </p>
                </div>
              </div>
            </section>
          </aside>

          <div className="space-y-8">
            <section>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#B99A63]">المساحات المعتمدة</p>
                  <h2 className="text-xl font-extrabold text-[#1B1B1B]">مساحات {seller.name}</h2>
                </div>
              </div>

              {seller.spaces.length === 0 ? (
                <div className="premium-card p-8 text-center text-[#5F6764]">لا توجد مساحات معتمدة حاليا</div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 stagger-grid">
                  {seller.spaces.map(space => (
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
                      imageUrl={space.images[0]?.url}
                    />
                  ))}
                </div>
              )}
            </section>

            <section className="premium-card p-6 animate-in">
              <div className="mb-5">
                <p className="text-xs font-bold text-[#B99A63]">آراء المستأجرين</p>
                <h2 className="text-xl font-extrabold text-[#1B1B1B]">التقييمات والتجارب</h2>
              </div>
              {reviews.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#D8D1C7] bg-[#FAF8F3] p-8 text-center">
                  <p className="font-bold text-[#1B1B1B]">التقييمات غير متاحة حاليا</p>
                  <p className="mt-1 text-sm text-[#5F6764]">ستظهر آراء المستأجرين بعد اكتمال الحجوزات وإضافة تقييماتهم.</p>
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2 motion-list">
                  {reviews.map(review => (
                    <article key={review.id} className="rounded-2xl border border-[#D8D1C7] bg-[#FAF8F3] p-4">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="h-9 w-9 overflow-hidden rounded-full bg-[#0E3B34]">
                            {review.buyer.avatarUrl ? (
                              <img src={review.buyer.avatarUrl} alt={review.buyer.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-sm font-bold text-[#B99A63]">
                                {review.buyer.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#1B1B1B]">{review.buyer.name}</p>
                            <p className="text-[11px] text-[#5F6764]">{review.space.name}</p>
                          </div>
                        </div>
                        <Stars rating={review.rating} />
                      </div>
                      <p className="text-sm leading-7 text-[#3F4B47]">{review.comment || 'تقييم بدون تعليق'}</p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-center backdrop-blur">
      <p className="text-2xl font-extrabold text-white">{value}</p>
      <p className="text-xs font-semibold text-white/60">{label}</p>
    </div>
  )
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-sm">
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} className={star <= Math.round(rating) ? 'text-[#B99A63]' : 'text-[#D8D1C7]'}>★</span>
      ))}
    </div>
  )
}

type SellerProfile = {
  id: string
  name: string
  email: string
  phone: string | null
  avatarUrl: string | null
  createdAt: Date
  spaces: {
    id: string
    name: string
    city: string
    district: string | null
    price: number
    pricePeriod: string
    capacity: number | null
    type: { name: string }
    images: { url: string }[]
  }[]
}

type SellerReview = {
  id: string
  rating: number
  comment: string | null
  buyer: { name: string; avatarUrl: string | null }
  space: { name: string }
  booking: { date: Date }
}
