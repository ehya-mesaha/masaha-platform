import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import SettingsClient from '@/components/settings/SettingsClientPro'

export const dynamic = 'force-dynamic'

export default async function BuyerSettingsPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const userData = await prisma.user.findUnique({
    where: { id: user.id as string },
    select: { name: true, email: true, phone: true, avatarUrl: true, role: true, createdAt: true },
  })

  if (!userData) return null

  return (
    <SettingsClient
      user={{
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        avatarUrl: userData.avatarUrl,
        role: userData.role,
        createdAt: userData.createdAt.toISOString(),
      }}
    />
  )
}
