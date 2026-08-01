import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/format'
import ApplicationActions from './ApplicationActions'

const documentLabel = { NATIONAL_ID: 'الهوية الوطنية', COMMERCIAL_REGISTER: 'السجل التجاري', TITLE_DEED: 'مستند الملكية', POWER_OF_ATTORNEY: 'الوكالة الشرعية' }

export default async function SellerApplicationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const application = await prisma.sellerApplication.findUnique({ where: { id }, include: { user: { include: { documents: true } } } })
  if (!application) notFound()
  return <div className="dashboard-page">
    <Link href="/admin/seller-applications" className="mb-4 inline-flex text-sm font-bold text-[#0E3B34]">العودة إلى الطلبات</Link>
    <header className="page-hero mb-6 p-6"><p className="mb-2 text-xs font-bold text-[#B99A63]">طلب انضمام</p><h1 className="text-2xl font-extrabold text-white">{application.schoolName}</h1><p className="mt-2 text-sm text-white/65">قُدم في {formatDate(application.createdAt)}</p></header>
    <div className="grid gap-6 xl:grid-cols-[1fr_390px]">
      <div className="space-y-6">
        <section className="premium-card p-6"><h2 className="mb-4 font-extrabold text-[#1B1B1B]">بيانات الجهة والمسؤول</h2><div className="grid gap-4 text-sm sm:grid-cols-2"><Data label="اسم المسؤول" value={application.user.name} /><Data label="البريد" value={application.user.email} ltr /><Data label="الجوال" value={application.user.phone || '—'} ltr /><Data label="اسم الفرع" value={application.branchName || 'الفرع الرئيسي'} /><Data label="رقم السجل التجاري" value={application.commercialRegisterNo} ltr /><Data label="تعدد الملاك" value={application.multipleOwners ? 'نعم' : 'لا'} /><Data label="رقم الوكالة" value={application.powerOfAttorneyNumber || '—'} ltr /><Data label="رقم عقد الوساطة" value={application.brokerageContractNo || 'لم يُسجل بعد'} ltr /></div></section>
        <section className="premium-card p-6"><h2 className="mb-4 font-extrabold text-[#1B1B1B]">المستندات</h2><div className="grid gap-3 sm:grid-cols-2">{application.user.documents.map((document) => <a key={document.id} href={document.fileUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl border border-[#D8D1C7] p-4 text-sm font-bold text-[#0E3B34]"><span>{documentLabel[document.type]}</span><span>فتح الملف</span></a>)}</div></section>
      </div>
      <ApplicationActions id={id} initialNotes={application.adminNotes} schoolName={application.schoolName} />
    </div>
  </div>
}
function Data({ label, value, ltr }: { label: string; value: string; ltr?: boolean }) { return <div className="rounded-xl bg-[#FAF8F3] p-4"><p className="text-xs font-bold text-[#7A847D]">{label}</p><p dir={ltr ? 'ltr' : undefined} className={`mt-1 font-bold text-[#1B1B1B] ${ltr ? 'text-right' : ''}`}>{value}</p></div> }
