import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MessageSquare, Send } from 'lucide-react'
import { Avatar } from '@design-system/components/Avatar'
import { Button } from '@design-system/components/Button'
import { ConversationList } from '../components/ConversationList'
import { api, isDemo } from '@lib/api'
import { useCommsStore } from '../store'
import { MOCK_MESSAGE_THREAD } from '../data'
import type { InternalMessage, InternalConversation } from '../types'

// ─── mappers ──────────────────────────────────────────────────────────────────

function toConversation(r: Record<string, unknown>): InternalConversation {
  const user = (r.user as Record<string, unknown>) ?? {}
  const last = r.lastMessage as Record<string, unknown>
  return {
    user: {
      id:   String(user.id ?? ''),
      name: String(user.name ?? ''),
      role: String(user.role ?? 'USER'),
    },
    lastMessage: {
      id:        String(last?.id ?? ''),
      content:   String(last?.content ?? ''),
      senderId:  String(last?.senderId ?? ''),
      sender:    { id: String(user.id ?? ''), name: String(user.name ?? ''), role: String(user.role ?? '') },
      isRead:    Boolean(last?.isRead),
      createdAt: String(last?.createdAt ?? new Date().toISOString()),
    },
    unreadCount: Number(r.unreadCount ?? 0),
  }
}

function toMessage(r: Record<string, unknown>): InternalMessage {
  const sender   = (r.sender   as Record<string, unknown>) ?? {}
  const receiver = (r.receiver as Record<string, unknown> | undefined)
  return {
    id:         String(r.id ?? ''),
    content:    String(r.content ?? ''),
    senderId:   String(r.senderId ?? ''),
    receiverId: r.receiverId ? String(r.receiverId) : undefined,
    sender: { id: String(sender.id ?? ''), name: String(sender.name ?? ''), role: String(sender.role ?? '') },
    receiver: receiver ? { id: String(receiver.id ?? ''), name: String(receiver.name ?? ''), role: String(receiver.role ?? '') } : undefined,
    isRead:    Boolean(r.isRead),
    createdAt: String(r.createdAt ?? new Date().toISOString()),
  }
}

const fmtTime = (s: string) =>
  new Date(s).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

// ─── page ─────────────────────────────────────────────────────────────────────

export function InternalMessages() {
  const { internalConversations, hydrateInternal } = useCommsStore()
  const queryClient = useQueryClient()

  const [selectedId,  setSelectedId]  = useState<string | null>(null)
  const [search,      setSearch]      = useState('')
  const [thread,      setThread]      = useState<InternalMessage[]>([])
  const [draft,       setDraft]       = useState('')
  const [loading,     setLoading]     = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const selectedConv = internalConversations.find(c => c.user.id === selectedId)

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread.length])

  // Load conversations
  useQuery({
    queryKey: ['comms', 'messages', 'list'],
    queryFn:  () => api.get('/messages/admin/conversations').then(r => {
      const convs = (r.data.conversations ?? []) as Record<string, unknown>[]
      hydrateInternal(convs.map(toConversation))
      return convs
    }),
    staleTime: 1000 * 60,
    enabled: !isDemo(),
  })

  // Load thread
  async function selectConv(id: string) {
    setSelectedId(id)
    if (isDemo()) {
      setThread(MOCK_MESSAGE_THREAD[id] ?? [])
      return
    }
    setLoading(true)
    try {
      const res = await api.get(`/messages/admin/${id}`)
      setThread((res.data.messages ?? []).map(toMessage))
    } finally {
      setLoading(false)
    }
  }

  // Send message
  const { mutate: sendMsg, isPending } = useMutation({
    mutationFn: async (content: string) => {
      if (!isDemo()) await api.post('/messages', { content, receiverId: selectedId })
    },
    onSuccess: (_, content) => {
      const msg: InternalMessage = {
        id:        `local-${Date.now()}`,
        content,
        senderId:  'me',
        receiverId: selectedId ?? undefined,
        sender:    { id: 'me', name: 'You', role: 'ADMIN' },
        isRead:    true,
        createdAt: new Date().toISOString(),
      }
      setThread(prev => [...prev, msg])
      queryClient.invalidateQueries({ queryKey: ['comms', 'messages'] })
    },
  })

  function send() {
    if (!draft.trim() || isPending) return
    sendMsg(draft.trim())
    setDraft('')
  }

  return (
    <div className="flex h-[calc(100vh-200px)] min-h-[500px]">
      {/* Left: conversations */}
      <div className="w-72 xl:w-80 flex-shrink-0">
        <ConversationList
          conversations={internalConversations}
          selectedId={selectedId}
          onSelect={selectConv}
          audienceLabel="Team"
          search={search}
          onSearch={setSearch}
        />
      </div>

      {/* Right: thread */}
      <div className="flex-1 min-w-0 flex flex-col">
        {selectedConv ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-os-border flex-shrink-0">
              <Avatar name={selectedConv.user.name} size="sm" />
              <div>
                <p className="text-sm font-semibold text-white">{selectedConv.user.name}</p>
                <p className="text-xs text-slate-500 capitalize">{selectedConv.user.role?.toLowerCase()}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {loading && (
                <div className="space-y-3 animate-pulse">
                  {[1,2,3].map(i => <div key={i} className={`h-12 rounded-2xl bg-os-s1 ${i % 2 === 0 ? 'ml-auto w-3/5' : 'w-3/5'}`} />)}
                </div>
              )}
              {!loading && thread.map(msg => {
                const isMe = msg.senderId === 'me' || msg.sender?.name === 'You'
                return (
                  <div key={msg.id} className={`flex gap-2.5 max-w-[80%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                    <Avatar name={msg.sender.name} size="xs" className="flex-shrink-0 mt-1" />
                    <div>
                      <div className={`rounded-2xl px-4 py-2.5 ${isMe ? 'bg-os-blue text-white rounded-tr-sm' : 'bg-os-s1 text-slate-200 rounded-tl-sm'}`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                      <p className={`text-[10px] text-slate-500 mt-1 ${isMe ? 'text-right' : ''}`}>
                        {fmtTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                )
              })}
              {!loading && thread.length === 0 && (
                <p className="text-center text-xs text-slate-500 py-10">Start the conversation.</p>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Compose */}
            <div className="border-t border-os-border px-4 py-3 flex-shrink-0">
              <div className="flex items-end gap-2">
                <textarea
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send() }}
                  rows={2}
                  placeholder="Type a message… (⌘↵ to send)"
                  className="flex-1 resize-none border border-os-border rounded-xl px-3 py-2.5 text-sm text-slate-300 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                />
                <Button variant="primary" size="sm" leftIcon={<Send className="w-3.5 h-3.5" />}
                  disabled={!draft.trim() || isPending} onClick={send}>
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="w-12 h-12 rounded-2xl bg-os-s1 flex items-center justify-center mb-3">
              <MessageSquare className="w-5 h-5 text-slate-500" />
            </div>
            <p className="text-sm font-semibold text-slate-300">Select a conversation</p>
            <p className="text-xs text-slate-500 mt-1">Internal team messages</p>
          </div>
        )}
      </div>
    </div>
  )
}
