import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const { filter } = await searchParams
  let users: UserType[] = []
  let pendingCount = 0

  try {
    const where = filter === 'pending' ? { status: 'PENDING_APPROVAL' as const } : {}
    users = await prisma.user.findMany({
      where,
      select: {
        id: true, name: true, email: true, avatarUrl: true, role: true, status: true, createdAt: true,
        _count: { select: { spaces: true, bookings: true } },
      },
      orderBy: { createdAt: 'desc' },
    }) as UserType[]
    if (!filter) {
      pendingCount = users.filter(u => u.status === 'PENDING_APPROVAL').length
    } else {
      pendingCount = users.length
    }
  } catch {
    // DB not connected
  }

  const roleLabel: Record<string, string> = {
    ADMIN: 'مدير النظام',
    SELLER: 'صاحب مساحة',
    BUYER: 'مستأجر',
  }
  const roleClass: Record<string, string> = {
    ADMIN: 'bg-[#B99A63]/10 text-[#8a6b1f] border-[#B99A63]/30',
    SELLER: 'bg-[#0E3B34]/10 text-[#0E3B34] border-[#0E3B34]/20',
    BUYER: 'bg-blue-50 text-blue-700 border-blue-200',
  }
  const statusLabel: Record<string, string> = {
    ACTIVE: 'نشط',
    SUSPENDED: 'موقوف',
    PENDING_APPROVAL: 'بانتظار الاعتماد',
  }
  const statusVariant: Record<string, 'success' | 'danger' | 'warning'> = {
    ACTIVE: 'success',
    SUSPENDED: 'danger',
    PENDING_APPROVAL: 'warning',
  }

  const allUsers = users
  const stats = {
    total: allUsers.length,
    admins: allUsers.filter(u => u.role === 'ADMIN').length,
    sellers: allUsers.filter(u => u.role === 'SELLER').length,
    buyers: allUsers.filter(u => u.role === 'BUYER').length,
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#1B1B1B]">المستخدمون</h1>
          <p className="text-[#5F6764] text-sm mt-1">إدارة المستخدمين والصلاحيات في المنصة</p>
        </div>
        <Link href="/api/admin/exports/users?format=xlsx" prefetch={false} className="rounded-xl bg-[#0E3B34] px-5 py-2.5 text-center text-sm font-extrabold text-white">تصدير Excel</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'إجمالي المستخدمين', value: stats.total, tone: 'text-[#1B1B1B]' },
          { label: 'المديرون', value: stats.admins, tone: 'text-[#B99A63]' },
          { label: 'أصحاب المساحات', value: stats.sellers, tone: 'text-[#0E3B34]' },
          { label: 'المستأجرون', value: stats.buyers, tone: 'text-blue-700' },
          { label: 'بانتظار الاعتماد', value: pendingCount, tone: 'text-amber-600' },
        ].map(s => (
          <div key={s.label} className="card-elevated p-5">
            <div className="text-[11px] font-bold text-[#5F6764] tracking-wide mb-1">{s.label}</div>
            <div className={`font-display text-3xl font-extrabold ${s.tone}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        <Link
          href="/admin/users"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !filter ? 'bg-[#0E3B34] text-white' : 'bg-white text-[#3F4B47] border border-[#D8D1C7] hover:bg-[#F5F1E8]'
          }`}
        >
          الكل
        </Link>
        <Link
          href="/admin/users?filter=pending"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            filter === 'pending' ? 'bg-[#0E3B34] text-white' : 'bg-white text-[#3F4B47] border border-[#D8D1C7] hover:bg-[#F5F1E8]'
          }`}
        >
          بانتظار الاعتماد
          {pendingCount > 0 && (
            <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
              filter === 'pending' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'
            }`}>
              {pendingCount}
            </span>
          )}
        </Link>
      </div>

      <Card padding={false}>
        <div className="px-6 py-4 border-b border-[#D8D1C7]">
          <h3 className="font-semibold text-[#1B1B1B]">
            {filter === 'pending' ? 'البائعون بانتظار الاعتماد' : 'جميع المستخدمين'}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F1E8]/50 border-b border-[#D8D1C7]">
              <tr>
                <th className="text-right px-6 py-3 text-[11px] font-bold text-[#5F6764] tracking-wide uppercase">المستخدم</th>
                <th className="text-right px-6 py-3 text-[11px] font-bold text-[#5F6764] tracking-wide uppercase">الدور</th>
                <th className="text-right px-6 py-3 text-[11px] font-bold text-[#5F6764] tracking-wide uppercase">الحالة</th>
                <th className="text-right px-6 py-3 text-[11px] font-bold text-[#5F6764] tracking-wide uppercase">المساحات</th>
                <th className="text-right px-6 py-3 text-[11px] font-bold text-[#5F6764] tracking-wide uppercase">الحجوزات</th>
                <th className="text-right px-6 py-3 text-[11px] font-bold text-[#5F6764] tracking-wide uppercase">تاريخ التسجيل</th>
                <th className="text-right px-6 py-3 text-[11px] font-bold text-[#5F6764] tracking-wide uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D1C7]">
              {users.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-[#5F6764] py-12">لا يوجد مستخدمون</td></tr>
              ) : users.map((u) => (
                <tr key={u.id} className="hover:bg-[#F5F1E8]/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0E3B34] to-[#092C27] text-[#B99A63] flex items-center justify-center font-bold text-sm overflow-hidden">
                        {u.avatarUrl ? (
                          <img src={u.avatarUrl} alt={u.name} className="h-full w-full object-cover" />
                        ) : (
                          u.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1B1B1B]">{u.name}</p>
                        <p className="text-[#5F6764] text-xs" dir="ltr">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`chip border ${roleClass[u.role]}`}>
                      {u.role === 'ADMIN' && '★ '}{roleLabel[u.role]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={statusVariant[u.status] || 'gray'}>
                      {statusLabel[u.status] || u.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-[#3F4B47] font-medium">{u._count.spaces}</td>
                  <td className="px-6 py-4 text-[#3F4B47] font-medium">{u._count.bookings}</td>
                  <td className="px-6 py-4 text-[#5F6764] text-xs">
                    {new Date(u.createdAt).toLocaleDateString('en-US')}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="text-[#0E3B34] font-semibold hover:text-[#B99A63] text-xs transition-colors flex items-center gap-1"
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
  avatarUrl: string | null
  role: string
  status: string
  createdAt: Date
  _count: { spaces: number; bookings: number }
}
