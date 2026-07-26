import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import Badge from '@/components/ui/Badge'
import { formatDate, formatNumber } from '@/lib/format'

const labels = {
  DATA_REVIEW: ['مراجعة البيانات', 'warning'],
  CONTRACT_SENT: ['أُرسل العقد', 'blue'],
  APPROVED: ['معتمد', 'success'],
  EXPIRED: ['منتهي', 'gray'],
  REJECTED: ['مرفوض', 'danger'],
  CHANGES_REQUESTED: ['بانتظار التعديل', 'warning'],
} as const

export default async function SellerApplicationsPage() {
  const applications = await prisma.sellerApplication.findMany({
    include: { user: { select: { name: true, email: true, phone: true } } },
    orderBy: { createdAt: 'desc' },
  }).catch(() => [])
  return <div className="dashboard-page">
    <header className="page-hero mb-6 p-6"><p className="mb-2 text-xs font-bold text-[#D8B455]">اعتماد الشركاء</p><h1 className="text-2xl font-extrabold text-white">طلبات انضمام أصحاب المساحات</h1><p className="mt-2 text-sm text-white/65">مراجعة البيانات والمستندات والعقد وتفعيل الحساب من مسار واحد.</p></header>
    <section className="premium-card overflow-hidden">
      <div className="overflow-x-auto"><table className="w-full text-sm">
        <thead className="bg-[#FBFAF7]"><tr>{['الرقم', 'الجهة', 'المسؤول', 'تاريخ التقديم', 'الحالة', ''].map((item) => <th key={item} className="px-5 py-3 text-right font-bold text-[#6B7566]">{item}</th>)}</tr></thead>
        <tbody className="divide-y divide-[#E8E3D8]">{applications.length === 0 ? <tr><td colSpan={6} className="py-12 text-center text-[#6B7566]">لا توجد طلبات انضمام</td></tr> : applications.map((application, index) => {
          const [label, variant] = labels[application.status]
          return <tr key={application.id}><td className="px-5 py-4 font-bold text-[#C49A3C]">#{formatNumber(applications.length - index)}</td><td className="px-5 py-4"><p className="font-bold text-[#14201A]">{application.schoolName}</p><p className="text-xs text-[#6B7566]">{application.branchName || 'الفرع الرئيسي'}</p></td><td className="px-5 py-4"><p>{application.user.name}</p><p dir="ltr" className="text-right text-xs text-[#6B7566]">{application.user.email}</p></td><td className="px-5 py-4">{formatDate(application.createdAt)}</td><td className="px-5 py-4"><Badge variant={variant}>{label}</Badge></td><td className="px-5 py-4"><Link href={`/admin/seller-applications/${application.id}`} className="font-bold text-[#1B3A2D]">مراجعة</Link></td></tr>
        })}</tbody>
      </table></div>
    </section>
  </div>
}
