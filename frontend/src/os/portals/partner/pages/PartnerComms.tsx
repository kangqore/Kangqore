import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Mail, Send, Paperclip, ChevronRight, ArrowLeft, X } from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { Button } from '@design-system/components/Button'
import { Textarea } from '@design-system/components/Textarea'
import { api, isDemo } from '@lib/api'
import { usePartnerEmails } from '../usePartnerData'

// ─── tokens ───────────────────────────────────────────────────────────────────

const CARD  = 'var(--os-card)'
const EDGE  = 'var(--os-border)'
const INNER = 'var(--os-card)'

// ─── types ────────────────────────────────────────────────────────────────────

interface Email {
  id: string
  subject: string
  from: string
  preview: string
  body: string
  direction: 'inbound' | 'outbound'
  isRead: boolean
  createdAt: string
  attachments?: string[]
}

// ─── mock data ────────────────────────────────────────────────────────────────

const MOCK_EMAILS: Email[] = [
  {
    id: 'pe1',
    subject: 'Project Phoenix — Sprint 14 milestone review',
    from: 'C.O.D.E.',
    preview: 'We wanted to flag that the Sprint 14 review is scheduled for June 24…',
    body: 'Hi,\n\nWe wanted to flag that the Sprint 14 milestone review is scheduled for June 24 at 3pm IST. Please confirm your availability and share the deliverable summary by June 23 EOD.\n\nBest,\nC.O.D.E.\nKangqore',
    direction: 'inbound',
    isRead: false,
    createdAt: '2026-06-21T09:30:00Z',
  },
  {
    id: 'pe2',
    subject: 'Invoice INV-P-041 processed — ₹4.2L',
    from: 'Kangqore Finance',
    preview: 'Your invoice INV-P-041 for ₹4.2L has been processed and will be credited…',
    body: 'Hi,\n\nYour invoice INV-P-041 for ₹4,20,000 has been processed and payment will be credited to your registered bank account within 3–5 business days.\n\nReference: KQ-PAY-20260620\nAmount: ₹4,20,000\nProject: Phoenix Phase 3\n\nRegards,\nKangqore Finance Team',
    direction: 'inbound',
    isRead: true,
    createdAt: '2026-06-20T14:00:00Z',
    attachments: ['INV-P-041-receipt.pdf'],
  },
  {
    id: 'pe3',
    subject: 'New project opportunity — TechCorp AI Implementation',
    from: 'Priya Mehta',
    preview: 'We have a new engagement that aligns well with your expertise in enterprise AI…',
    body: 'Hi,\n\nWe have a new engagement opportunity — TechCorp AI Implementation (12-week engagement, starting July 14). Based on your expertise in enterprise AI delivery, you are our top choice for the lead role.\n\nScope: LLM integration, RAG pipeline setup, enterprise security review\nBudget: ₹8.4L\nStart: July 14, 2026\n\nWould you be interested? Please respond by June 25.\n\nBest,\nPriya Mehta\nPartner Success, Kangqore',
    direction: 'inbound',
    isRead: false,
    createdAt: '2026-06-19T11:00:00Z',
  },
  {
    id: 'pe4',
    subject: 'Re: Q3 availability window',
    from: 'You',
    preview: 'Thanks for the heads up. My Q3 availability is confirmed from July 7…',
    body: 'Hi Priya,\n\nThanks for the heads up. My Q3 availability is confirmed from July 7 onwards. I can commit 4 days/week for the first 6 weeks.\n\nPlease add me to the TechCorp scope document when it\'s ready.\n\nBest,',
    direction: 'outbound',
    isRead: true,
    createdAt: '2026-06-18T16:30:00Z',
  },
  {
    id: 'pe5',
    subject: 'Partnership review — June 2026',
    from: 'Arjun Nair',
    preview: 'Your Q2 partnership score is 4.9/5 — highest on record…',
    body: 'Hi,\n\nYour Q2 partnership performance review is now complete. Summary:\n\n• Partnership Score: 4.9/5 (highest on record)\n• Delivery Quality: 98% milestone completion\n• Client Satisfaction: 4.8/5 (average across 3 clients)\n• Invoice Accuracy: 100%\n\nYou have been promoted to Kangqore Platinum Partner status effective July 1, 2026. This grants priority project allocation and a 5% rate increase on new engagements.\n\nCongratulations,\nArjun Nair\nPartner Relations, Kangqore',
    direction: 'inbound',
    isRead: true,
    createdAt: '2026-06-15T10:00:00Z',
  },
]

const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
const fmtTime = (s: string) => new Date(s).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

// ─── email row ────────────────────────────────────────────────────────────────

function EmailRow({ email, selected, onSelect }: { email: Email; selected: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className="w-full text-left px-4 py-3.5 transition-all"
      style={{
        background: selected ? 'rgba(37,100,234,0.08)' : 'transparent',
        borderBottom: `1px solid ${EDGE}`,
        borderLeft: selected ? '2px solid #2564ea' : '2px solid transparent',
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {!email.isRead
            ? <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
            : <Mail className="w-4 h-4 text-[var(--os-text-2)]" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <p className={`text-[13px] truncate ${email.isRead ? 'text-[var(--os-text-2)] font-medium' : 'font-semibold'}`} style={!email.isRead ? { color: 'var(--os-text-1)' } : undefined}>
              {email.direction === 'outbound' ? 'To: Kangqore' : email.from}
            </p>
            <span className="text-[10px] text-[var(--os-text-2)] flex-shrink-0">{fmtDate(email.createdAt)}</span>
          </div>
          <p className={`text-xs truncate mb-0.5 ${email.isRead ? 'text-[var(--os-text-2)]' : 'text-[var(--os-text-2)] font-medium'}`}>
            {email.subject}
          </p>
          <p className="text-[11px] text-[var(--os-text-2)] truncate">{email.preview}</p>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-[var(--os-text-2)] flex-shrink-0 mt-1" />
      </div>
    </button>
  )
}

// ─── thread view ──────────────────────────────────────────────────────────────

function EmailThread({ email, onBack, onReply }: {
  email: Email
  onBack: () => void
  onReply: (content: string, emailId: string) => void
}) {
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSend = async () => {
    if (!reply.trim()) return
    setSending(true)
    await onReply(reply, email.id)
    setSending(false)
    setSent(true)
    setReply('')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Thread header */}
      <div className="flex items-center gap-3 px-5 py-4 flex-shrink-0" style={{ borderBottom: `1px solid ${EDGE}` }}>
        <button onClick={onBack} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors lg:hidden">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: 'var(--os-text-1)' }}>{email.subject}</p>
          <p className="text-[11px] text-[var(--os-text-2)] mt-0.5">
            {email.direction === 'outbound' ? 'Sent by you' : `From ${email.from}`} · {fmtDate(email.createdAt)} at {fmtTime(email.createdAt)}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 min-h-0">
        {/* From / to row */}
        <div className="flex items-center gap-3 mb-5 p-3 rounded-xl" style={{ background: INNER, border: `1px solid ${EDGE}` }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black text-white flex-shrink-0"
            style={{ background: email.direction === 'outbound' ? '#2564ea' : '#7f53f9' }}>
            {email.direction === 'outbound' ? 'YO' : email.from.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[var(--os-text-1)]">
              {email.direction === 'outbound' ? 'You' : email.from}
            </p>
            <p className="text-[10px] text-[var(--os-text-2)]">
              {email.direction === 'outbound' ? 'To: admin@kangqore.com' : 'To: You'}
            </p>
          </div>
        </div>

        {/* Body text */}
        <div className="text-sm text-[var(--os-text-1)] leading-relaxed whitespace-pre-wrap mb-5">{email.body}</div>

        {/* Attachments */}
        {email.attachments && email.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {email.attachments.map(att => (
              <div key={att} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] text-[var(--os-text-2)]"
                style={{ background: INNER, border: `1px solid ${EDGE}` }}>
                <Paperclip className="w-3 h-3 text-[var(--os-text-2)]" />
                {att}
              </div>
            ))}
          </div>
        )}

        {/* Reply box */}
        {!sent ? (
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${EDGE}` }}>
            <div className="px-4 py-2.5 flex items-center gap-2" style={{ background: INNER, borderBottom: `1px solid ${EDGE}` }}>
              <span className="text-[10px] font-bold text-[var(--os-text-2)] uppercase tracking-wider">Reply</span>
            </div>
            <div className="p-3" style={{ background: CARD }}>
              <Textarea
                rows={3}
                className="text-sm w-full"
                placeholder="Write a reply…"
                value={reply}
                onChange={e => setReply(e.target.value)}
              />
              <div className="flex justify-end mt-2">
                <Button
                  variant="primary" size="sm"
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                  disabled={!reply.trim() || sending}
                  onClick={handleSend}
                >
                  {sending ? 'Sending…' : 'Send'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl px-4 py-3 text-sm text-emerald-400 flex items-center gap-2"
            style={{ background: 'rgba(0,200,117,0.08)', border: '1px solid rgba(0,200,117,0.2)' }}>
            <span className="w-4 h-4 text-emerald-400">✓</span> Reply sent successfully.
          </div>
        )}
      </div>
    </div>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export function PartnerComms() {
  const queryClient = useQueryClient()
  const { data: liveEmails } = usePartnerEmails()
  const [selectedId, setSelectedId] = useState<string | null>('pe1')

  const emails: Email[] = (liveEmails as Email[] | undefined)?.length
    ? (liveEmails as Email[])
    : MOCK_EMAILS

  const selected = emails.find(e => e.id === selectedId) ?? null
  const unread = emails.filter(e => !e.isRead).length

  const { mutate: sendReply } = useMutation({
    mutationFn: async ({ content, emailId }: { content: string; emailId: string }) => {
      if (!isDemo()) {
        await api.post('/partner/emails/reply', { emailId, content })
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['partner', 'emails'] }),
  })

  return (
    <div className="space-y-4">
      <KIMMPSignalBar module="Messages" />
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Messages</h2>
          <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: 'var(--os-text-2)' }}>
            {unread > 0 ? `${unread} unread` : 'All messages read'} · {emails.length} total
          </p>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid ${EDGE}`, minHeight: 520 }}>
        <div className="grid lg:grid-cols-5 h-full" style={{ minHeight: 520 }}>
          {/* Email list */}
          <div className="lg:col-span-2 overflow-y-auto" style={{ borderRight: `1px solid ${EDGE}`, maxHeight: 580 }}>
            <div className="px-4 py-3 flex-shrink-0" style={{ borderBottom: `1px solid ${EDGE}`, background: INNER }}>
              <p className="text-[10px] font-bold text-[var(--os-text-2)] uppercase tracking-wider">Inbox</p>
            </div>
            {emails.map(email => (
              <EmailRow
                key={email.id}
                email={email}
                selected={selectedId === email.id}
                onSelect={() => setSelectedId(email.id)}
              />
            ))}
            {emails.length === 0 && (
              <div className="py-16 text-center">
                <Mail className="w-8 h-8 text-[var(--os-text-2)] mx-auto mb-3" />
                <p className="text-sm text-[var(--os-text-2)]">No messages yet.</p>
              </div>
            )}
          </div>

          {/* Thread view */}
          <div className="lg:col-span-3 hidden lg:flex flex-col" style={{ maxHeight: 580 }}>
            {selected ? (
              <EmailThread
                email={selected}
                onBack={() => setSelectedId(null)}
                onReply={(content, emailId) =>
                  new Promise<void>(resolve => {
                    sendReply({ content, emailId }, { onSettled: () => resolve() })
                  })
                }
              />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Mail className="w-10 h-10 text-[var(--os-text-2)] mx-auto mb-3" />
                  <p className="text-sm font-semibold text-[var(--os-text-2)]">Select a message to read</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
