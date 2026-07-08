import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import SettingsClient from '@/components/settings/ProfileSettingsClient'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const user = await getCurrentUser()
  if (!user) return null

  let userData = null
  try {
    userData = await prisma.user.findUnique({
      where: { id: user.id as string },
      select: { name: true, email: true, phone: true, avatarUrl: true, role: true, createdAt: true },
    })
  } catch {
    userData = await prisma.user.findUnique({
      where: { id: user.id as string },
      select: { name: true, email: true, phone: true, role: true, createdAt: true },
    })
  }

  if (!userData) return null

  return (
    <SettingsClient
      user={{
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        avatarUrl: (userData as { avatarUrl?: string | null }).avatarUrl ?? null,
        role: userData.role,
        createdAt: userData.createdAt.toISOString(),
      }}
    />
  )
}
