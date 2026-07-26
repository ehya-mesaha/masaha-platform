import { prisma } from '@/lib/prisma'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/lib/format'

const typeLabel = { INQUIRY: 'استفسار', SUGGESTION: 'اقتراح', COMPLAINT: 'شكوى' }

export default async function ContactMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } }).catch(() => [])
  return <div className="dashboard-page">
    <header className="page-hero mb-6 p-6"><p className="mb-2 text-xs font-bold text-[#B99A63]">صوت المستخدم</p><h1 className="text-2xl font-extrabold text-white">الاستفسارات والاقتراحات والشكاوى</h1><p className="mt-2 text-sm text-white/65">كل الرسائل الواردة من صفحة التواصل في سجل مركزي.</p></header>
    <div className="space-y-4">{messages.length === 0 ? <div className="premium-card p-12 text-center text-[#5F6764]">لا توجد رسائل جديدة</div> : messages.map((message) => <article key={message.id} className="premium-card p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><div className="flex items-center gap-2"><Badge variant={message.type === 'COMPLAINT' ? 'danger' : message.type === 'SUGGESTION' ? 'blue' : 'gray'}>{typeLabel[message.type]}</Badge>{!message.isRead && <span className="rounded-full bg-[#FFF2C9] px-2 py-1 text-[10px] font-bold text-[#715412]">جديدة</span>}</div><h2 className="mt-3 font-extrabold text-[#1B1B1B]">{message.subject || typeLabel[message.type]}</h2><p className="mt-1 text-xs text-[#5F6764]">{message.name} · <span dir="ltr">{message.email}</span>{message.phone ? ` · ${message.phone}` : ''}</p></div><time className="text-xs font-bold text-[#7A847D]">{formatDate(message.createdAt)}</time></div>
      <p className="mt-4 whitespace-pre-wrap rounded-xl bg-[#FAF8F3] p-4 text-sm leading-7 text-[#33423F]">{message.message}</p>
    </article>)}</div>
  </div>
}
