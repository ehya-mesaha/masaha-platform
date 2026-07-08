import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import DashboardSidebar from '@/components/layout/DashboardSidebarPro'

export default async function BuyerLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')
  if (user.role !== 'BUYER' && user.role !== 'ADMIN') redirect('/')
  let avatarUrl: string | null = null
  try {
    const profile = await prisma.user.findUnique({
      where: { id: user.id as string },
      select: { avatarUrl: true },
    })
    avatarUrl = profile?.avatarUrl || null
  } catch {
    avatarUrl = null
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role="BUYER" userName={user.name as string} avatarUrl={avatarUrl} />
      <main className="flex-1 bg-[#F5F0E6] overflow-auto">
        {children}
      </main>
    </div>
  )
}
