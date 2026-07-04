import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DashboardSidebar from '@/components/layout/DashboardSidebar'

export default async function BuyerLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')
  if (user.role !== 'BUYER' && user.role !== 'ADMIN') redirect('/')

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role="BUYER" userName={user.name as string} />
      <main className="flex-1 bg-[#F5F0E6] overflow-auto">
        {children}
      </main>
    </div>
  )
}
