'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'

type UserSummary = {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'SELLER' | 'BUYER'
}

type SpaceSummary = {
  id: string
  name: string
  city: string
  district: string | null
  price: number
  pricePeriod: string
  images: { url: string }[]
}

type Message = {
  id: string
  content: string
  isRead: boolean
  createdAt: string
  senderId: string
  sender: UserSummary
}

type Conversation = {
  id: string
  type: 'SPACE' | 'ADMIN_SUPPORT'
  subject: string | null
  createdAt: string
  updatedAt: string
  lastMessageAt: string | null
  buyerId: string | null
  sellerId: string | null
  adminId: string | null
  buyer: UserSummary | null
  seller: UserSummary | null
  admin: UserSummary | null
  space: SpaceSummary | null
  lastMessage?: Message | null
  unreadCount?: number
}

type Props = {
  currentUser: UserSummary
}

function formatTime(value?: string | null) {
  if (!value) return ''
  return new Intl.DateTimeFormat('ar-SA', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function initials(name?: string | null) {
  return name?.trim().charAt(0) || 'م'
}

function getConversationTitle(conversation: Conversation, currentUser: UserSummary) {
  if (conversation.type === 'ADMIN_SUPPORT') {
    if (currentUser.role === 'ADMIN') {
      return conversation.buyer?.name || conversation.seller?.name || 'مستخدم'
    }
    return conversation.admin?.name || 'إدارة مساحة'
  }

  if (currentUser.role === 'BUYER') return conversation.seller?.name || 'صاحب المساحة'
  if (currentUser.role === 'SELLER') return conversation.buyer?.name || 'مستأجر'
  return `${conversation.buyer?.name || 'مستأجر'} · ${conversation.seller?.name || 'صاحب مساحة'}`
}

function getConversationSubtitle(conversation: Conversation, currentUser: UserSummary) {
  if (conversation.type === 'ADMIN_SUPPORT') {
    if (currentUser.role === 'ADMIN') return conversation.buyer ? 'محادثة مستأجر مع الإدارة' : 'محادثة صاحب مساحة مع الإدارة'
    return 'محادثة مباشرة مع الإدارة'
  }
  return conversation.space?.name || conversation.subject || 'استفسار عن مساحة'
}

export default function ConversationsClient({ currentUser }: Props) {
  const searchParams = useSearchParams()
  const initialChat = searchParams.get('chat')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<string | null>(initialChat)
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const activeConversation = useMemo(
    () => conversations.find(conversation => conversation.id === activeId) || null,
    [activeId, conversations]
  )

  const loadConversations = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const res = await fetch('/api/conversations')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'تعذر تحميل المحادثات')
      setConversations(data.conversations || [])
      if (!activeId && data.conversations?.length) setActiveId(data.conversations[0].id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر تحميل المحادثات')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [activeId])

  const loadMessages = useCallback(async (conversationId: string, silent = false) => {
    if (!silent) setMessagesLoading(true)
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'تعذر تحميل الرسائل')
      setMessages(data.messages || [])
      setConversations(prev => prev.map(conversation =>
        conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر تحميل الرسائل')
    } finally {
      if (!silent) setMessagesLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadConversations()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [loadConversations])

  useEffect(() => {
    const timer = window.setInterval(() => loadConversations(true), 8000)
    return () => window.clearInterval(timer)
  }, [loadConversations])

  useEffect(() => {
    if (!activeId) return

    const initialLoad = window.setTimeout(() => {
      loadMessages(activeId)
    }, 0)
    const timer = window.setInterval(() => loadMessages(activeId, true), 5000)

    return () => {
      window.clearTimeout(initialLoad)
      window.clearInterval(timer)
    }
  }, [activeId, loadMessages])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  async function startAdminConversation() {
    setError('')
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin: true }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'تعذر فتح المحادثة')
      await loadConversations(true)
      setActiveId(data.conversation.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر فتح المحادثة')
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!activeId || !draft.trim() || sending) return
    const content = draft.trim()
    setDraft('')
    setSending(true)
    setError('')

    try {
      const res = await fetch(`/api/conversations/${activeId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'تعذر إرسال الرسالة')
      setMessages(prev => [...prev, data.message])
      await loadConversations(true)
    } catch (err) {
      setDraft(content)
      setError(err instanceof Error ? err.message : 'تعذر إرسال الرسالة')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="p-4 sm:p-6" dir="rtl">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#14201A]">المحادثات</h1>
        </div>
        {currentUser.role !== 'ADMIN' && (
          <button
            type="button"
            onClick={startAdminConversation}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1B3A2D] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0F2219]"
          >
            <span aria-hidden>✉</span>
            محادثة الإدارة
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid min-h-[calc(100dvh-11rem)] overflow-hidden rounded-2xl border border-[#E8E3D8] bg-white shadow-sm lg:grid-cols-[22rem_1fr]">
        <aside className={`${activeConversation ? 'hidden lg:block' : 'block'} border-[#E8E3D8] lg:border-l`}>
          <div className="border-b border-[#E8E3D8] px-4 py-3">
            <p className="text-xs font-bold text-[#6B7566]">قائمة المحادثات</p>
          </div>
          <div className="max-h-[calc(100dvh-15rem)] overflow-y-auto p-2">
            {loading ? (
              <div className="p-6 text-center text-sm text-[#6B7566]">جاري تحميل المحادثات...</div>
            ) : conversations.length === 0 ? (
              <div className="m-3 rounded-xl border border-dashed border-[#D8CFBE] bg-[#F7F3EB] p-5 text-center text-sm text-[#6B7566]">
                لا توجد محادثات بعد
              </div>
            ) : conversations.map(conversation => {
              const isActive = conversation.id === activeId
              const title = getConversationTitle(conversation, currentUser)
              const subtitle = getConversationSubtitle(conversation, currentUser)
              return (
                <button
                  type="button"
                  key={conversation.id}
                  onClick={() => setActiveId(conversation.id)}
                  className={`mb-1.5 flex w-full items-center gap-3 rounded-xl border p-3 text-right transition-colors ${
                    isActive
                      ? 'border-[#C49A3C] bg-[#F7F3EB]'
                      : 'border-transparent hover:border-[#E8E3D8] hover:bg-[#FAF8F2]'
                  }`}
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#1B3A2D] text-base font-extrabold text-[#C49A3C]">
                    {initials(title)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-bold text-[#14201A]">{title}</p>
                      <span className="flex-shrink-0 text-[10px] text-[#8B9389]">
                        {formatTime(conversation.lastMessageAt || conversation.updatedAt)}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-[#6B7566]">{subtitle}</p>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p className="truncate text-[11px] text-[#8B9389]">
                        {conversation.lastMessage?.content || 'ابدأ المحادثة الآن'}
                      </p>
                      {!!conversation.unreadCount && (
                        <span className="rounded-full bg-[#C49A3C] px-2 py-0.5 text-[10px] font-bold text-[#14201A]">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </aside>

        <section className={`${activeConversation ? 'flex' : 'hidden lg:flex'} min-w-0 flex-col bg-[#FBFAF7]`}>
          {activeConversation ? (
            <>
              <div className="border-b border-[#E8E3D8] bg-white px-4 py-3">
                <button
                  type="button"
                  onClick={() => setActiveId(null)}
                  className="mb-3 text-xs font-semibold text-[#1B3A2D] lg:hidden"
                >
                  العودة للمحادثات
                </button>
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#1B3A2D] text-lg font-extrabold text-[#C49A3C]">
                    {initials(getConversationTitle(activeConversation, currentUser))}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-base font-extrabold text-[#14201A]">
                      {getConversationTitle(activeConversation, currentUser)}
                    </h2>
                    <p className="mt-0.5 truncate text-xs text-[#6B7566]">
                      {getConversationSubtitle(activeConversation, currentUser)}
                    </p>
                  </div>
                </div>
                {activeConversation.space && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#E8E3D8] bg-[#F7F3EB] p-3">
                    {activeConversation.space.images[0]?.url ? (
                      <img src={activeConversation.space.images[0].url} alt="" className="h-12 w-12 rounded-lg object-cover" />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-[#1B3A2D]/10" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[#14201A]">{activeConversation.space.name}</p>
                      <p className="text-xs text-[#6B7566]">
                        {activeConversation.space.city}
                        {activeConversation.space.district ? `، ${activeConversation.space.district}` : ''}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#1B3A2D]">
                      {activeConversation.space.price.toLocaleString('ar-SA')} ر.س
                    </span>
                  </div>
                )}
              </div>

              <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
                {messagesLoading ? (
                  <div className="mt-8 text-center text-sm text-[#6B7566]">جاري تحميل الرسائل...</div>
                ) : messages.length === 0 ? (
                  <div className="mx-auto mt-10 max-w-sm rounded-2xl border border-dashed border-[#D8CFBE] bg-white p-6 text-center text-sm text-[#6B7566]">
                    لا توجد رسائل بعد
                  </div>
                ) : messages.map(message => {
                  const isMine = message.senderId === currentUser.id
                  return (
                    <div key={message.id} className={`flex ${isMine ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[68%] ${
                        isMine
                          ? 'rounded-br-md bg-[#1B3A2D] text-white'
                          : 'rounded-bl-md border border-[#E8E3D8] bg-white text-[#14201A]'
                      }`}>
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                        <p className={`mt-1 text-[10px] ${isMine ? 'text-white/60' : 'text-[#8B9389]'}`}>
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <form onSubmit={sendMessage} className="border-t border-[#E8E3D8] bg-white p-3">
                <div className="flex items-end gap-2 rounded-2xl border border-[#D8CFBE] bg-[#F7F3EB] p-1.5">
                  <textarea
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    placeholder="اكتب رسالتك..."
                    rows={1}
                    className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-[#14201A] outline-none placeholder:text-[#8B9389]"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        e.currentTarget.form?.requestSubmit()
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim() || sending}
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#1B3A2D] text-white transition-colors hover:bg-[#0F2219] disabled:opacity-50"
                    aria-label="إرسال"
                  >
                    ↵
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-[#6B7566]">
              لا توجد محادثة محددة
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
