import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import ConversationsClient from '@/components/chat/ConversationsClient'
import { getCurrentUser, type TokenPayload } from '@/lib/auth'

export default async function BuyerConversationsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')
  if (user.role !== 'BUYER' && user.role !== 'ADMIN') redirect('/')

  const currentUser = user as TokenPayload
  return (
    <Suspense fallback={<div className="p-6 text-sm text-[#6B7566]">جاري تحميل المحادثات...</div>}>
      <ConversationsClient
        currentUser={{
          id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
          role: currentUser.role,
        }}
      />
    </Suspense>
  )
}
