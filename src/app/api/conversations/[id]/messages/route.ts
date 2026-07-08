import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser, type TokenPayload } from '@/lib/auth'

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
} as const

function canAccessConversation(
  user: TokenPayload,
  conversation: { buyerId: string | null; sellerId: string | null; adminId: string | null }
) {
  return (
    user.role === 'ADMIN' ||
    conversation.buyerId === user.id ||
    conversation.sellerId === user.id ||
    conversation.adminId === user.id
  )
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getCurrentUser()
    if (!token) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

    const user = token as TokenPayload
    const { id } = await params
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      select: { id: true, buyerId: true, sellerId: true, adminId: true },
    })

    if (!conversation) return NextResponse.json({ error: 'المحادثة غير موجودة' }, { status: 404 })
    if (!canAccessConversation(user, conversation)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const messages = await prisma.conversationMessage.findMany({
      where: { conversationId: id },
      include: { sender: { select: userSelect } },
      orderBy: { createdAt: 'asc' },
    })

    await prisma.conversationMessage.updateMany({
      where: {
        conversationId: id,
        senderId: { not: user.id },
        isRead: false,
      },
      data: { isRead: true },
    })

    return NextResponse.json({ messages })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getCurrentUser()
    if (!token) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

    const user = token as TokenPayload
    const { id } = await params
    const body = await req.json()
    const content = typeof body.content === 'string' ? body.content.trim() : ''

    if (!content) return NextResponse.json({ error: 'اكتب الرسالة أولاً' }, { status: 400 })
    if (content.length > 2000) {
      return NextResponse.json({ error: 'الرسالة طويلة جداً' }, { status: 400 })
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      select: { id: true, buyerId: true, sellerId: true, adminId: true },
    })

    if (!conversation) return NextResponse.json({ error: 'المحادثة غير موجودة' }, { status: 404 })
    if (!canAccessConversation(user, conversation)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const message = await prisma.conversationMessage.create({
      data: {
        conversationId: id,
        senderId: user.id,
        content,
        isRead: false,
      },
      include: { sender: { select: userSelect } },
    })

    await prisma.conversation.update({
      where: { id },
      data: { lastMessageAt: message.createdAt },
    })

    return NextResponse.json({ message }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
