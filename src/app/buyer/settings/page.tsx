import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Card from '@/components/ui/Card'

export default async function BuyerSettingsPage() {
  const user = await getCurrentUser()
  if (!user) return null

  let userData = null
  try {
    userData = await prisma.user.findUnique({
      where: { id: user.id as string },
      select: { id: true, name: true, email: true, phone: true, createdAt: true },
    })
  } catch {
    // DB not connected
  }

  return (
    <div className="p-8">
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">الإعدادات</h1>

        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">معلومات الحساب</h3>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-gray-500 mb-0.5">الاسم الكامل</p>
              <p className="font-medium text-gray-900">{userData?.name || user.name as string}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-0.5">البريد الإلكتروني</p>
              <p className="font-medium text-gray-900">{userData?.email || user.email as string}</p>
            </div>
            {userData?.phone && (
              <div>
                <p className="text-gray-500 mb-0.5">رقم الجوال</p>
                <p className="font-medium text-gray-900">{userData.phone}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
