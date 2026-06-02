import { useRef, useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Send, MessageSquare } from 'lucide-react'
import { Avatar } from '@design-system/components/Avatar'
import { Button } from '@design-system/components/Button'
import { api, isDemo } from '@lib/api'

// ─── types ────────────────────────────────────────────────────────────────────

interface Email {
  id:        string
  subject:   string
  from:      string
  to:        string
  body:      string
  direction: 'inbound' | 'outbound'
  isRead:    boolean
  createdAt: string
}

// ─── mock ─────────────────────────────────────────────────────────────────────

const MOCK_EMAILS: Email[] = [
  { id: 'e1', subject: 'Application received — Senior Backend Engineer', from: 'hr@kangqore.com', to: 'priya@email.com', body: 'Hi Priya, thank you for applying for the Senior Backend Engineer role at Kangqore. We have reviewed your CV and are impressed by your background. We\'d like to invite you to a 30-minute screening call. Are you available this week?', direction: 'outbound', isRead: true, createdAt: '2026-05-09T10:00:00Z' },
  { id: 'e2', subject: 'Re: Application received — Senior Backend Engineer', from: 'priya@email.com', to: 'hr@kangqore.com', body: 'Hi Anika, thank you so much! I\'m really excited about this opportunity. I\'m available Tuesday or Wednesday afternoon. Please let me know what works best.', direction: 'inbound', isRead: true, createdAt: '2026-05-09T14:30:00Z' },
  { id: 'e3', subject: 'Screening call confirmed — 14 May 10:00 BST', from: 'hr@kangqore.com', to: 'priya@email.com', body: 'Great, I\'ve booked you in for Tuesday 14 May at 10:00 BST. A Zoom link is in your calendar. Looking forward to speaking with you!', direction: 'outbound', isRead: true, createdAt: '2026-05-10T09:00:00Z' },
  { id: 'e4', subject: 'Technical interview scheduled — 28 May 10:00 BST', from: 'hr@kangqore.com', to: 'priya@email.com', body: 'Hi Priya, congratulations on passing the screening round! Dev Patel (Head of Engineering) will be conducting your technical interview on 28 May at 10:00 BST. It will cover system design and live coding. Please come prepared with examples of large-scale systems you have built.', direction: 'outbound', isRead: true, createdAt: '2026-05-16T11:00:00Z' },
  { id: 'e5', subject: 'Re: Technical interview scheduled', from: 'priya@email.com', to: 'hr@kangqore.com', body: 'Thank you Anika! Really looking forward to this. Quick question — should I prepare anything specific on the data layer side? PostgreSQL, Redis, or both?', direction: 'inbound', isRead: true, createdAt: '2026-05-16T14:00:00Z' },
  { id: 'e6', subject: 'Re: Technical interview scheduled', from: 'hr@kangqore.com', to: 'priya@email.com', body: 'Both would be great! We use PostgreSQL as the primary store and Redis for caching. Dev will walk through a scenario and ask you to reason through the trade-offs live. Good luck!', direction: 'outbound', isRead: true, createdAt: '2026-05-17T09:00:00Z' },
]

const fmtTime = (s: string) => new Date(s).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

// ─── page ─────────────────────────────────────────────────────────────────────

export function CareersMessages() {
  const queryClient = useQueryClient()
  const [draft, setDraft] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['careers', 'emails'],
    queryFn:  () => api.get('/careers/emails').then(r => (r.data.emails ?? []) as Email[]),
    staleTime: 1000 * 60,
    enabled:  !isDemo(),
  })

  const emails: Email[] = data?.length ? data : MOCK_EMAILS

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [emails.length])

  const { mutate: sendReply, isPending } = useMutation({
    mutationFn: (content: string) =>
      isDemo()
        ? Promise.resolve()
        : api.post('/careers/emails/reply', {
            subject:  `Re: ${emails[emails.length - 1]?.subject ?? 'Your application'}`,
            content,
          }),
    onSuccess: () => {
      setDraft('')
      queryClient.invalidateQueries({ queryKey: ['careers', 'emails'] })
    },
  })

  function send() {
    if (!draft.trim() || isPending) return
    sendReply(draft.trim())
  }

  return (
    <div className="flex flex-col max-w-2xl" style={{ height: 'calc(100vh - 200px)', minHeight: 460 }}>
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100 flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Kangqore Talent Team</p>
          <p className="text-xs text-slate-400">hr@kangqore.com · Anika Roy, Talent Lead</p>
        </div>
      </div>

      {/* Thread */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {isLoading && (
          <div className="space-y-3 animate-pulse">
            {[1,2,3].map(i => (
              <div key={i} className={`h-16 rounded-2xl bg-slate-100 ${i % 2 === 0 ? 'ml-auto w-4/5' : 'w-4/5'}`} />
            ))}
          </div>
        )}
        {!isLoading && emails.map(email => {
          const isOutbound = email.direction === 'outbound'
          return (
            <div key={email.id} className={`flex gap-2.5 max-w-[85%] ${isOutbound ? '' : 'ml-auto flex-row-reverse'}`}>
              <Avatar
                name={isOutbound ? 'Kangqore' : 'You'}
                size="xs"
                className="flex-shrink-0 mt-1"
              />
              <div>
                {email.subject && (
                  <p className={`text-[10px] font-semibold mb-1 ${isOutbound ? 'text-slate-400' : 'text-blue-300'}`}>
                    {email.subject}
                  </p>
                )}
                <div className={`rounded-2xl px-4 py-3 ${
                  isOutbound
                    ? 'bg-slate-100 text-slate-800 rounded-tl-sm'
                    : 'bg-[#d97706] text-white rounded-tr-sm'
                }`}>
                  <p className="text-sm leading-relaxed">{email.body}</p>
                </div>
                <p className={`text-[10px] text-slate-400 mt-1 ${isOutbound ? '' : 'text-right'}`}>
                  {isOutbound ? 'Kangqore' : 'You'} · {fmtTime(email.createdAt)}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Compose */}
      <div className="border-t border-slate-100 pt-3 flex-shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send() }}
            rows={2}
            placeholder="Message the talent team… (⌘↵ to send)"
            className="flex-1 resize-none border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400"
          />
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Send className="w-3.5 h-3.5" />}
            disabled={!draft.trim() || isPending}
            onClick={send}
          >
            Send
          </Button>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">⌘↵ to send · replies go to hr@kangqore.com</p>
      </div>
    </div>
  )
}
