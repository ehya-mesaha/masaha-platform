import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ user: null }, { headers: { 'Cache-Control': 'no-store' } })
  }

  try {
    const profile = await prisma.user.findUnique({
      where: { id: user.id as string },
      select: { avatarUrl: true },
    })

    return NextResponse.json(
      {
        user: {
          ...user,
          avatarUrl: profile?.avatarUrl ?? null,
        },
      },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch {
    return NextResponse.json({ user: { ...user, avatarUrl: null } }, { headers: { 'Cache-Control': 'no-store' } })
  }
}
