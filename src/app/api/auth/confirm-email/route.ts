import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyEmailVerificationToken } from '@/lib/auth'
import { getSiteUrl } from '@/lib/site'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') || ''
  const confirmedUrl = (status: string) => NextResponse.redirect(`${getSiteUrl()}/auth/confirmed?status=${status}`)

  let userId: string
  try {
    userId = await verifyEmailVerificationToken(token)
  } catch {
    return confirmedUrl('invalid')
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return confirmedUrl('invalid')
  if (user.emailVerifiedAt) return confirmedUrl('already')

  await prisma.user.update({ where: { id: userId }, data: { emailVerifiedAt: new Date() } })
  return confirmedUrl('success')
}
