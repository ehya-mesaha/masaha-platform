import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'

export default async function AdminUsersPage() {
  let users: UserType[] = []

  try {
    users = await prisma.user.findMany({
      select: {
        id: true, name: true, email: true, role: true, status: true, createdAt: true,
        _count: { select: { spaces: true, bookings: true } },
      },
      orderBy: { createdAt: 'desc' },
    }) as UserType[]
  } catch {
    // DB not connected
  }

  const roleLabel: Record<string, string> = {
    ADMIN: 'مدير النظام',
    SELLER: 'صاحب مساحة',
    BUYER: 'مستأجر',
  }
  const roleClass: Record<string, string> = {
    ADMIN: 'bg-[#C49A3C]/10 text-[#8a6b1f] border-[#C49A3C]/30',
    SELLER: 'bg-[#1B3A2D]/10 text-[#1B3A2D] border-[#1B3A2D]/20',
    BUYER: 'bg-blue-50 text-blue-700 border-blue-200',
  }

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    sellers: users.filter(u => u.role === 'SELLER').length,
    buyers: users.filter(u => u.role === 'BUYER').length,
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-extrabold text-[#14201A]">المستخدمون</h1>
        <p className="text-[#6B7566] text-sm mt-1">إدارة المستخدمين والصلاحيات في المنصة</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'إجمالي المستخدمين', value: stats.total, tone: 'text-[#14201A]' },
          { label: 'المديرون', value: stats.admins, tone: 'text-[#C49A3C]' },
          { label: 'أصحاب المساحات', value: stats.sellers, tone: 'text-[#1B3A2D]' },
          { label: 'المستأجرون', value: stats.buyers, tone: 'text-blue-700' },
        ].map(s => (
          <div key={s.label} className="card-elevated p-5">
            <div className="text-[11px] font-bold text-[#6B7566] tracking-wide mb-1">{s.label}</div>
            <div className={`font-display text-3xl font-extrabold ${s.tone}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <Card padding={false}>
        <div className="px-6 py-4 border-b border-[#ECE6D8] flex items-center justify-between">
          <h3 className="font-semibold text-[#14201A]">جميع المستخدمين</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F7F3EB]/50 border-b border-[#ECE6D8]">
              <tr>
                <th className="text-right px-6 py-3 text-[11px] font-bold text-[#6B7566] tracking-wide uppercase">المستخدم</th>
                <th className="text-right px-6 py-3 text-[11px] font-bold text-[#6B7566] tracking-wide uppercase">الدور</th>
                <th className="text-right px-6 py-3 text-[11px] font-bold text-[#6B7566] tracking-wide uppercase">الحالة</th>
                <th className="text-right px-6 py-3 text-[11px] font-bold text-[#6B7566] tracking-wide uppercase">المساحات</th>
                <th className="text-right px-6 py-3 text-[11px] font-bold text-[#6B7566] tracking-wide uppercase">الحجوزات</th>
                <th className="text-right px-6 py-3 text-[11px] font-bold text-[#6B7566] tracking-wide uppercase">تاريخ التسجيل</th>
                <th className="text-right px-6 py-3 text-[11px] font-bold text-[#6B7566] tracking-wide uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE6D8]">
              {users.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-[#6B7566] py-12">لا يوجد مستخدمون</td></tr>
              ) : users.map((u) => (
                <tr key={u.id} className="hover:bg-[#F7F3EB]/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1B3A2D] to-[#0F2219] text-[#C49A3C] flex items-center justify-center font-bold text-sm">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-[#14201A]">{u.name}</p>
                        <p className="text-[#6B7566] text-xs" dir="ltr">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`chip border ${roleClass[u.role]}`}>
                      {u.role === 'ADMIN' && '★ '}{roleLabel[u.role]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={u.status === 'ACTIVE' ? 'success' : 'danger'}>
                      {u.status === 'ACTIVE' ? 'نشط' : 'موقوف'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-[#4A554D] font-medium">{u._count.spaces}</td>
                  <td className="px-6 py-4 text-[#4A554D] font-medium">{u._count.bookings}</td>
                  <td className="px-6 py-4 text-[#6B7566] text-xs">
                    {new Date(u.createdAt).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="text-[#1B3A2D] font-semibold hover:text-[#C49A3C] text-xs transition-colors flex items-center gap-1"
                    >
                      عرض
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

type UserType = {
  id: string
  name: string
  email: string
  role: string
  status: string
  createdAt: Date
  _count: { spaces: number; bookings: number }
}
