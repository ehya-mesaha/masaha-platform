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
    ADMIN: 'مدير',
    SELLER: 'صاحب مساحة',
    BUYER: 'مستأجر',
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">المستخدمون</h1>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-[#E8E3D8]">
              <tr>
                <th className="text-right px-5 py-3 text-gray-600 font-medium">المستخدم</th>
                <th className="text-right px-5 py-3 text-gray-600 font-medium">الدور</th>
                <th className="text-right px-5 py-3 text-gray-600 font-medium">الحالة</th>
                <th className="text-right px-5 py-3 text-gray-600 font-medium">المساحات</th>
                <th className="text-right px-5 py-3 text-gray-600 font-medium">الحجوزات</th>
                <th className="text-right px-5 py-3 text-gray-600 font-medium">تاريخ التسجيل</th>
                <th className="text-right px-5 py-3 text-gray-600 font-medium">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3D8]">
              {users.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-gray-500 py-10">لا يوجد مستخدمون</td></tr>
              ) : users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">{u.name}</p>
                    <p className="text-gray-400 text-xs">{u.email}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-700">{roleLabel[u.role]}</td>
                  <td className="px-5 py-4">
                    <Badge variant={u.status === 'ACTIVE' ? 'success' : 'danger'}>
                      {u.status === 'ACTIVE' ? 'نشط' : 'موقوف'}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-gray-700">{u._count.spaces}</td>
                  <td className="px-5 py-4 text-gray-700">{u._count.bookings}</td>
                  <td className="px-5 py-4 text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/admin/users/${u.id}`} className="text-[#1B3A2D] font-medium hover:underline text-xs">
                      عرض
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
