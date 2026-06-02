import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, MessageSquare, Clock, CheckCircle2, AlertCircle, Send } from 'lucide-react'
import { Card } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { Input } from '@design-system/components/Input'
import { Textarea } from '@design-system/components/Textarea'
import { StatCard } from '@design-system/components/StatCard'
import { EditDrawer } from '@components/EditDrawer'
import { api, isDemo } from '@lib/api'
import { useClientTickets } from '../useClientData'

// ─── mock ─────────────────────────────────────────────────────────────────────

const MOCK_TICKETS = [
  {
    id: 'tk1', subject: 'Staging environment down — patient login 500 error',
    category: 'BUG', priority: 'HIGH', status: 'IN_PROGRESS',
    content: 'Since this morning the staging environment is returning 500 on the patient login endpoint. Our UAT team cannot proceed.',
    createdAt: '2026-06-01T08:30:00Z', updatedAt: '2026-06-01T11:00:00Z',
    _count: { messages: 3 },
    messages: [
      { id: 'msg1', content: 'Since this morning the staging environment is returning 500 on the patient login endpoint.', createdAt: '2026-06-01T08:30:00Z', sender: { name: 'You', role: 'CLIENT' } },
      { id: 'msg2', content: 'We have identified the issue — a Redis config change caused session validation to fail. Fix is being deployed now.', createdAt: '2026-06-01T10:00:00Z', sender: { name: 'Ravi Nair', role: 'ADMIN' } },
      { id: 'msg3', content: 'Fix deployed to staging. Can you confirm login is working on your end?', createdAt: '2026-06-01T11:00:00Z', sender: { name: 'Ravi Nair', role: 'ADMIN' } },
    ],
  },
  {
    id: 'tk2', subject: 'HIPAA audit report — page 14 has wrong organisation name',
    category: 'CORRECTION', priority: 'MEDIUM', status: 'OPEN',
    content: 'Page 14 of the HIPAA audit report (shared 27 May) has our old legal entity name. Please update and re-share.',
    createdAt: '2026-05-30T14:00:00Z', updatedAt: '2026-05-30T14:00:00Z',
    _count: { messages: 1 },
    messages: [
      { id: 'msg4', content: 'Page 14 of the HIPAA audit report (shared 27 May) has our old legal entity name. Please update and re-share.', createdAt: '2026-05-30T14:00:00Z', sender: { name: 'You', role: 'CLIENT' } },
    ],
  },
  {
    id: 'tk3', subject: 'Analytics dashboard — can we add a date range filter?',
    category: 'FEATURE_REQUEST', priority: 'LOW', status: 'OPEN',
    content: 'The current analytics view is fixed to the last 30 days. It would be very useful to have a custom date range picker.',
    createdAt: '2026-05-28T09:00:00Z', updatedAt: '2026-05-28T09:00:00Z',
    _count: { messages: 1 },
    messages: [
      { id: 'msg5', content: 'The current analytics view is fixed to the last 30 days. It would be very useful to have a custom date range picker.', createdAt: '2026-05-28T09:00:00Z', sender: { name: 'You', role: 'CLIENT' } },
    ],
  },
  {
    id: 'tk4', subject: 'Invoice INV-2026-038 — query on line item 3',
    category: 'BILLING', priority: 'MEDIUM', status: 'RESOLVED',
    content: 'Line item 3 on the invoice mentions "Extended discovery — 8h" but our SOW only covers 4h.',
    createdAt: '2026-05-15T10:00:00Z', updatedAt: '2026-05-20T14:00:00Z',
    _count: { messages: 4 },
    messages: [],
  },
]

// ─── helpers ──────────────────────────────────────────────────────────────────

const STATUS_VARIANT: Record<string, 'danger' | 'warning' | 'success' | 'info' | 'neutral'> = {
  OPEN: 'warning', IN_PROGRESS: 'info', RESOLVED: 'success', CLOSED: 'neutral',
}
const PRIORITY_VARIANT: Record<string, 'danger' | 'warning' | 'info' | 'neutral'> = {
  HIGH: 'danger', MEDIUM: 'warning', LOW: 'neutral', CRITICAL: 'danger',
}

const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
const fmtTime = (s: string) => new Date(s).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

type Ticket = typeof MOCK_TICKETS[0]

// ─── ticket detail ────────────────────────────────────────────────────────────

function TicketDetail({ ticket, onClose }: { ticket: Ticket; onClose: () => void }) {
  const [reply, setReply] = useState('')
  const queryClient = useQueryClient()

  const { mutate: sendReply, isPending } = useMutation({
    mutationFn: (content: string) =>
      isDemo() ? Promise.resolve() : api.post(`/tickets/${ticket.id}/reply`, { content }),
    onSuccess: () => {
      setReply('')
      queryClient.invalidateQueries({ queryKey: ['client', 'tickets'] })
    },
  })

  return (
    <EditDrawer
      open
      onClose={onClose}
      title={ticket.subject}
      description={`#${ticket.id.toUpperCase()} · ${ticket.category.replace('_', ' ')}`}
      width="lg"
      footer={
        <div className="flex items-end gap-2 w-full">
          <Textarea
            className="flex-1 text-sm"
            rows={2}
            placeholder="Type a reply…"
            value={reply}
            onChange={e => setReply(e.target.value)}
          />
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Send className="w-3.5 h-3.5" />}
            disabled={!reply.trim() || isPending}
            onClick={() => reply.trim() && sendReply(reply)}
          >
            Send
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Meta */}
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant={STATUS_VARIANT[ticket.status]} dot size="sm">{ticket.status.replace('_', ' ')}</Badge>
          <Badge variant={PRIORITY_VARIANT[ticket.priority]} size="sm">{ticket.priority}</Badge>
          <span className="text-xs text-slate-400">Opened {fmtDate(ticket.createdAt)}</span>
        </div>

        {/* Conversation */}
        <div className="space-y-3">
          {ticket.messages.map(msg => {
            const isClient = msg.sender.role === 'CLIENT'
            return (
              <div key={msg.id} className={`flex ${isClient ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  isClient
                    ? 'bg-[#2564ea] text-white rounded-br-sm'
                    : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                }`}>
                  {!isClient && (
                    <p className="text-[10px] font-semibold mb-1 opacity-70">{msg.sender.name}</p>
                  )}
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <p className={`text-[10px] mt-1.5 ${isClient ? 'text-blue-200' : 'text-slate-400'}`}>
                    {fmtTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            )
          })}
          {ticket.messages.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-6">No messages yet.</p>
          )}
        </div>
      </div>
    </EditDrawer>
  )
}

// ─── raise ticket ────────────────────────────────────────────────────────────

function RaiseTicketDrawer({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ subject: '', category: 'BUG', priority: 'MEDIUM', content: '' })
  const queryClient = useQueryClient()
  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const { mutate, isPending } = useMutation({
    mutationFn: () => isDemo() ? Promise.resolve() : api.post('/tickets', form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client', 'tickets'] })
      onClose()
    },
  })

  return (
    <EditDrawer
      open
      onClose={onClose}
      title="Raise a support ticket"
      width="md"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" disabled={!form.subject.trim() || !form.content.trim() || isPending} onClick={() => mutate()}>
            Submit ticket
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Subject *</label>
          <Input value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="Brief description of the issue" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Category</label>
            <select value={form.category} onChange={e => set('category', e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400">
              <option value="BUG">Bug / Issue</option>
              <option value="FEATURE_REQUEST">Feature Request</option>
              <option value="CORRECTION">Correction</option>
              <option value="BILLING">Billing Query</option>
              <option value="GENERAL">General</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Priority</label>
            <select value={form.priority} onChange={e => set('priority', e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Description *</label>
          <Textarea value={form.content} onChange={e => set('content', e.target.value)} rows={5} placeholder="Describe the issue in detail…" />
        </div>
      </div>
    </EditDrawer>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export function ClientSupport() {
  const { data } = useClientTickets()
  const tickets: Ticket[] = (data as Ticket[] | undefined)?.length ? data as Ticket[] : MOCK_TICKETS

  const [openId,      setOpenId]      = useState<string | null>(null)
  const [showRaise,   setShowRaise]   = useState(false)
  const [statusFilter, setFilter]     = useState<string>('ALL')

  const openTicket = tickets.find(t => t.id === openId)

  const visible = statusFilter === 'ALL' ? tickets : tickets.filter(t => t.status === statusFilter)

  const open       = tickets.filter(t => t.status === 'OPEN').length
  const inProgress = tickets.filter(t => t.status === 'IN_PROGRESS').length
  const resolved   = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Support</h2>
          <p className="text-sm text-slate-500 mt-0.5">{tickets.length} tickets</p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowRaise(true)}>
          Raise ticket
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Open"       value={open}       icon={<AlertCircle  className="w-5 h-5" />} iconColor={open > 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'} />
        <StatCard label="In Progress" value={inProgress} icon={<Clock       className="w-5 h-5" />} iconColor="bg-blue-100 text-blue-600" />
        <StatCard label="Resolved"   value={resolved}   icon={<CheckCircle2 className="w-5 h-5" />} iconColor="bg-green-100 text-green-600" />
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
              statusFilter === s ? 'bg-[#2564ea] text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300'
            }`}
          >
            {s === 'ALL' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Ticket list */}
      <div className="space-y-3">
        {visible.map(t => (
          <Card
            key={t.id}
            className="cursor-pointer hover:shadow-md transition-all duration-200"
            onClick={() => setOpenId(t.id)}
          >
            <div className="flex items-start gap-4">
              <MessageSquare className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{t.subject}</p>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{t.content}</p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <Badge variant={STATUS_VARIANT[t.status]} dot size="sm">{t.status.replace('_', ' ')}</Badge>
                  <Badge variant={PRIORITY_VARIANT[t.priority]} size="sm">{t.priority}</Badge>
                  <span className="text-[11px] text-slate-400">{t.category.replace('_', ' ')}</span>
                  <span className="text-[11px] text-slate-400">{fmtDate(t.updatedAt)}</span>
                  {t._count.messages > 0 && (
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />{t._count.messages}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
        {visible.length === 0 && (
          <div className="py-12 text-center text-sm text-slate-400">No tickets match this filter.</div>
        )}
      </div>

      {openTicket && <TicketDetail ticket={openTicket} onClose={() => setOpenId(null)} />}
      {showRaise  && <RaiseTicketDrawer onClose={() => setShowRaise(false)} />}
    </div>
  )
}
