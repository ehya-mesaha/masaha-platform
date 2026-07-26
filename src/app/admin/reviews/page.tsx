import { prisma } from '@/lib/prisma'
import { formatDate, formatNumber } from '@/lib/format'
import ReviewVisibilityButton from './ReviewVisibilityButton'

export default async function ReviewsAdminPage() {
  const reviews = await prisma.spaceReview.findMany({ include: { buyer: { select: { name: true } }, space: { select: { name: true } } }, orderBy: { createdAt: 'desc' } }).catch(() => [])
  return <div className="dashboard-page">
    <header className="page-hero mb-6 p-6"><p className="mb-2 text-xs font-bold text-[#D8B455]">جودة المحتوى</p><h1 className="text-2xl font-extrabold text-white">مراجعة التقييمات</h1><p className="mt-2 text-sm text-white/65">إخفاء أو إعادة إظهار أي تقييم مع حفظ الإجراء في سجل الإدارة.</p></header>
    <div className="space-y-4">{reviews.length === 0 ? <div className="premium-card p-12 text-center text-[#6B7566]">لا توجد تقييمات</div> : reviews.map((review) => <article key={review.id} className="premium-card flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"><div><p className="font-extrabold text-[#14201A]">{review.space.name} · {formatNumber(review.rating)} / 5</p><p className="mt-1 text-xs text-[#6B7566]">{review.buyer.name} · {formatDate(review.createdAt)} · {review.isVisible ? 'ظاهر' : 'مخفي'}</p><p className="mt-3 text-sm leading-7 text-[#344139]">{review.comment || 'تقييم دون تعليق'}</p></div><ReviewVisibilityButton id={review.id} visible={review.isVisible} /></article>)}</div>
  </div>
}
