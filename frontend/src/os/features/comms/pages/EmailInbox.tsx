import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MessageSquare } from 'lucide-react'
import { ConversationList } from '../components/ConversationList'
import { EmailThread }      from '../components/EmailThread'
import { api, isDemo }      from '@lib/api'
import { useCommsStore }    from '../store'
import type { TabConfig, EmailConversation, EmailLog, ContactInfo } from '../types'

// ─── mappers ──────────────────────────────────────────────────────────────────

function toEmailLog(r: Record<string, unknown>): EmailLog {
  return {
    id:            String(r.id ?? ''),
    subject:       String(r.subject ?? ''),
    from:          String(r.from ?? ''),
    to:            String(r.to ?? ''),
    body:          String(r.body ?? r.content ?? ''),
    preview:       String(r.preview ?? String(r.body ?? '').slice(0, 80)),
    direction:     (r.direction as EmailLog['direction']) ?? 'inbound',
    isRead:        Boolean(r.isRead),
    hasAttachment: Boolean(r.hasAttachment),
    threadId:      r.threadId ? String(r.threadId) : undefined,
    replyToId:     r.replyToId ? String(r.replyToId) : undefined,
    createdAt:     String(r.createdAt ?? new Date().toISOString()),
  }
}

function toConversation(r: Record<string, unknown>): EmailConversation {
  // Backend returns either `user` or `partner` key for the contact
  const contact = (r.user ?? r.partner ?? {}) as Record<string, unknown>
  const emails  = (r.emails as Record<string, unknown>[] | undefined) ?? []
  const last    = (r.lastMessage as Record<string, unknown> | undefined)
  const mappedEmails = emails.map(toEmailLog)
  const lastEmail  = last ? toEmailLog(last) : mappedEmails[mappedEmails.length - 1]

  return {
    id:           String(contact.id ?? ''),
    user: {
      id:       String(contact.id ?? ''),
      name:     String(contact.name ?? ''),
      email:    contact.email ? String(contact.email) : undefined,
      company:  contact.company ? String(contact.company) : undefined,
    },
    emails:      mappedEmails,
    lastMessage: lastEmail,
    unreadCount: Number(r.unreadCount ?? 0),
  }
}

// ─── page ─────────────────────────────────────────────────────────────────────

interface Props { tab: TabConfig }

export function EmailInbox({ tab }: Props) {
  const { emailConversations, hydrateEmails, appendEmail } = useCommsStore()
  const queryClient = useQueryClient()

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search,     setSearch]     = useState('')
  const [threadEmails, setThreadEmails] = useState<EmailLog[]>([])
  const [threadContact, setThreadContact] = useState<ContactInfo | null>(null)
  const [threadLoading, setThreadLoading] = useState(false)

  const conversations = emailConversations[tab.audience] ?? []

  // Load conversation list
  useQuery({
    queryKey: ['comms', tab.audience, 'list'],
    queryFn: () => api.get(tab.listApi).then(r => {
      const convs = (r.data.conversations ?? []) as Record<string, unknown>[]
      hydrateEmails(tab.audience, convs.map(toConversation))
      return convs
    }),
    staleTime: 1000 * 60 * 2,
    enabled: !isDemo(),
  })

  // Load thread on selection
  async function selectConversation(id: string) {
    setSelectedId(id)
    const conv = conversations.find(c => c.id === id)
    if (conv) {
      setThreadContact(conv.user)
      // Use local emails from store (already loaded in list)
      if (conv.emails.length > 0) {
        setThreadEmails(conv.emails)
        return
      }
    }
    if (isDemo()) return

    setThreadLoading(true)
    try {
      const res = await api.get(`${tab.threadApi}/${id}`)
      const data = res.data
      const contact = (data.user ?? data.partner ?? {}) as Record<string, unknown>
      const emails  = (data.emails ?? []) as Record<string, unknown>[]
      setThreadContact({
        id:      String(contact.id ?? id),
        name:    String(contact.name ?? ''),
        email:   contact.email ? String(contact.email) : undefined,
        company: contact.company ? String(contact.company) : undefined,
      })
      setThreadEmails(emails.map(toEmailLog))
    } finally {
      setThreadLoading(false)
    }
  }

  // Reply mutation
  const { mutate: sendReply, isPending } = useMutation({
    mutationFn: async (content: string) => {
      if (!isDemo()) await api.post(tab.replyApi, {
        [tab.idField]: selectedId,
        content,
        subject: `Re: ${threadEmails[threadEmails.length - 1]?.subject ?? ''}`,
        replyToId: threadEmails[threadEmails.length - 1]?.id,
      })
    },
    onSuccess: (_, content) => {
      if (!selectedId) return
      const outbound: EmailLog = {
        id:            `local-${Date.now()}`,
        subject:       `Re: ${threadEmails[threadEmails.length - 1]?.subject ?? ''}`,
        from:          'admin@kangqore.com',
        to:            threadContact?.email ?? '',
        body:          content,
        preview:       content.slice(0, 80),
        direction:     'outbound',
        isRead:        true,
        hasAttachment: false,
        createdAt:     new Date().toISOString(),
      }
      setThreadEmails(prev => [...prev, outbound])
      appendEmail(tab.audience, selectedId, outbound)
      queryClient.invalidateQueries({ queryKey: ['comms', tab.audience] })
    },
  })

  const totalUnread = conversations.reduce((s, c) => s + c.unreadCount, 0)

  return (
    <div className="flex h-[calc(100vh-200px)] min-h-[500px]">
      {/* Left: conversation list */}
      <div className="w-72 xl:w-80 flex-shrink-0">
        <ConversationList
          conversations={conversations}
          selectedId={selectedId}
          onSelect={selectConversation}
          audienceLabel={tab.label}
          search={search}
          onSearch={setSearch}
        />
      </div>

      {/* Right: thread or empty state */}
      <div className="flex-1 min-w-0">
        {selectedId && threadContact ? (
          <EmailThread
            contact={threadContact}
            emails={threadEmails}
            onReply={sendReply}
            isPending={isPending}
            loading={threadLoading}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="w-12 h-12 rounded-2xl bg-[#151C2F] flex items-center justify-center mb-3">
              <MessageSquare className="w-5 h-5 text-slate-500" />
            </div>
            <p className="text-sm font-semibold text-slate-300">
              {conversations.length === 0 ? `No ${tab.label.toLowerCase()} conversations yet` : 'Select a conversation'}
            </p>
            {totalUnread > 0 && (
              <p className="text-xs text-blue-600 font-medium mt-1">{totalUnread} unread</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
