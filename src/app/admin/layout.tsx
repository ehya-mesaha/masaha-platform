import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import DashboardSidebar from '@/components/layout/DashboardSidebarPro'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')
  if (user.role !== 'ADMIN') redirect('/')
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
    <div className="dashboard-layout flex min-h-screen flex-col lg:flex-row">
      <DashboardSidebar role="ADMIN" userName={user.name as string} avatarUrl={avatarUrl} />
      <main className="dashboard-surface flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
