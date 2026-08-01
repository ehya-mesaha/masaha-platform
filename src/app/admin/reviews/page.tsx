import { prisma } from '@/lib/prisma'
import { formatDate, formatNumber } from '@/lib/format'
import ReviewVisibilityButton from './ReviewVisibilityButton'
import Link from 'next/link'
import AdminDeleteButton from '@/components/admin/AdminDeleteButton'

export default async function ReviewsAdminPage() {
  const reviews = await prisma.spaceReview.findMany({ include: { buyer: { select: { name: true } }, space: { select: { name: true } } }, orderBy: { createdAt: 'desc' } }).catch(() => [])
  return <div className="dashboard-page">
    <header className="page-hero mb-6 p-6"><p className="mb-2 text-xs font-bold text-[#B99A63]">جودة المحتوى</p><h1 className="text-2xl font-extrabold text-white">مراجعة التقييمات</h1><p className="mt-2 text-sm text-white/65">إخفاء أو إعادة إظهار أي تقييم مع حفظ الإجراء في سجل الإدارة.</p></header>
    <div className="mb-4 flex justify-end"><Link href="/api/admin/exports/reviews?format=xlsx" prefetch={false} className="rounded-xl bg-[#0E3B34] px-5 py-2.5 text-sm font-extrabold text-white">تصدير Excel</Link></div>
    <div className="space-y-4">{reviews.length === 0 ? <div className="premium-card p-12 text-center text-[#5F6764]">لا توجد تقييمات</div> : reviews.map((review) => <article key={review.id} className="premium-card flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"><div><p className="font-extrabold text-[#1B1B1B]">{review.space.name} · {formatNumber(review.rating)} / 5</p><p className="mt-1 text-xs text-[#5F6764]">{review.buyer.name} · {formatDate(review.createdAt)} · {review.isVisible ? 'ظاهر' : 'مخفي'}</p><p className="mt-3 text-sm leading-7 text-[#33423F]">{review.comment || 'تقييم دون تعليق'}</p></div><div className="flex items-center gap-2"><ReviewVisibilityButton id={review.id} visible={review.isVisible} /><AdminDeleteButton endpoint={`/api/admin/reviews/${review.id}`} confirmMessage={`سيتم حذف تقييم "${review.buyer.name}" على "${review.space.name}" نهائيًا.`} /></div></article>)}</div>
  </div>
}
