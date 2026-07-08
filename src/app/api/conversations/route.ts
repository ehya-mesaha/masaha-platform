import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser, type TokenPayload } from '@/lib/auth'

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
} as const

const conversationInclude = {
  buyer: { select: userSelect },
  seller: { select: userSelect },
  admin: { select: userSelect },
  space: {
    select: {
      id: true,
      name: true,
      city: true,
      district: true,
      price: true,
      pricePeriod: true,
      images: { orderBy: { order: 'asc' as const }, take: 1 },
    },
  },
  messages: {
    orderBy: { createdAt: 'desc' as const },
    take: 1,
    include: { sender: { select: userSelect } },
  },
} as const

export async function GET(req: NextRequest) {
  try {
    const token = await getCurrentUser()
    if (!token) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

    const user = token as TokenPayload
    const { searchParams } = new URL(req.url)
    const scope = searchParams.get('scope')
    const where =
      user.role === 'ADMIN'
        ? scope === 'all'
          ? {}
          : { type: 'ADMIN_SUPPORT' as const }
        : user.role === 'SELLER'
          ? { sellerId: user.id }
          : { buyerId: user.id }

    const conversations = await prisma.conversation.findMany({
      where,
      include: conversationInclude,
      orderBy: [{ lastMessageAt: 'desc' }, { updatedAt: 'desc' }],
    })

    const withUnread = await Promise.all(
      conversations.map(async (conversation) => {
        const unreadCount = await prisma.conversationMessage.count({
          where: {
            conversationId: conversation.id,
            senderId: { not: user.id },
            isRead: false,
          },
        })
        return {
          ...conversation,
          lastMessage: conversation.messages[0] ?? null,
          unreadCount,
        }
      })
    )

    return NextResponse.json({ conversations: withUnread })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getCurrentUser()
    if (!token) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

    const user = token as TokenPayload
    const body = await req.json()
    const { admin, sellerId, spaceId } = body as {
      admin?: boolean
      sellerId?: string
      spaceId?: string
    }

    if (admin) {
      if (user.role === 'ADMIN') {
        return NextResponse.json({ error: 'لا يمكن للإدارة فتح محادثة دعم مع نفسها' }, { status: 400 })
      }

      const adminUser = await prisma.user.findFirst({
        where: { role: 'ADMIN', status: 'ACTIVE' },
        select: { id: true },
        orderBy: { createdAt: 'asc' },
      })

      const participantWhere =
        user.role === 'BUYER'
          ? { buyerId: user.id, sellerId: null }
          : { sellerId: user.id, buyerId: null }

      let conversation = await prisma.conversation.findFirst({
        where: { type: 'ADMIN_SUPPORT', ...participantWhere },
        include: conversationInclude,
      })

      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            type: 'ADMIN_SUPPORT',
            subject: 'محادثة مع الإدارة',
            adminId: adminUser?.id ?? null,
            buyerId: user.role === 'BUYER' ? user.id : null,
            sellerId: user.role === 'SELLER' ? user.id : null,
          },
          include: conversationInclude,
        })
      }

      return NextResponse.json({ conversation })
    }

    if (user.role !== 'BUYER') {
      return NextResponse.json({ error: 'المحادثة مع صاحب المساحة متاحة للمستأجر فقط' }, { status: 403 })
    }

    if (!sellerId) {
      return NextResponse.json({ error: 'يرجى اختيار صاحب المساحة' }, { status: 400 })
    }

    const seller = await prisma.user.findFirst({
      where: { id: sellerId, role: 'SELLER' },
      select: { id: true },
    })
    if (!seller) return NextResponse.json({ error: 'صاحب المساحة غير موجود' }, { status: 404 })

    if (spaceId) {
      const space = await prisma.space.findFirst({
        where: { id: spaceId, sellerId },
        select: { id: true },
      })
      if (!space) {
        return NextResponse.json({ error: 'لا يمكن فتح محادثة لهذه المساحة' }, { status: 403 })
      }
    }

    let conversation = await prisma.conversation.findFirst({
      where: {
        type: 'SPACE',
        buyerId: user.id,
        sellerId,
        spaceId: spaceId ?? null,
      },
      include: conversationInclude,
    })

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          type: 'SPACE',
          subject: 'استفسار عن مساحة',
          buyerId: user.id,
          sellerId,
          spaceId: spaceId ?? null,
        },
        include: conversationInclude,
      })
    }

    return NextResponse.json({ conversation })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
