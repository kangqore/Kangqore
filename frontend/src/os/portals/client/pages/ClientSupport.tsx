import { useState, useRef, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus, MessageSquare, Clock, CheckCircle2, AlertCircle, Send,
  Paperclip, X, AlertOctagon, UserCircle, Timer,
} from 'lucide-react'
import { Card } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { Input } from '@design-system/components/Input'
import { Textarea } from '@design-system/components/Textarea'
import { StatCard } from '@design-system/components/StatCard'
import { EditDrawer } from '@components/EditDrawer'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { api, isDemo } from '@lib/api'
import { useClientTickets } from '../useClientData'

// ─── SLA config ───────────────────────────────────────────────────────────────

const SLA_RESPONSE_MINUTES: Record<string, number> = {
  CRITICAL: 60,   // 1 hr
  HIGH:     240,  // 4 hr
  MEDIUM:   1440, // 1 day
  LOW:      4320, // 3 days
}

function getDeadline(createdAt: string, priority: string): number | null {
  const mins = SLA_RESPONSE_MINUTES[priority.toUpperCase()]
  if (!mins) return null
  return new Date(createdAt).getTime() + mins * 60_000
}

// ─── helpers ──────────────────────────────────────────────────────────────────

const STATUS_VARIANT: Record<string, 'danger' | 'warning' | 'success' | 'info' | 'neutral'> = {
  OPEN: 'warning', IN_PROGRESS: 'info', RESOLVED: 'success', CLOSED: 'neutral',
}
const PRIORITY_VARIANT: Record<string, 'danger' | 'warning' | 'info' | 'neutral'> = {
  HIGH: 'danger', MEDIUM: 'warning', LOW: 'neutral', CRITICAL: 'danger',
}

const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
const fmtTime = (s: string) => new Date(s).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

interface AgentMeta { name: string; initials: string; color: string }

interface Ticket {
  id: string
  subject: string
  category: string
  priority: string
  status: string
  content?: string
  createdAt: string
  updatedAt: string
  assignedTo?: string | null
  assignedAgent?: AgentMeta | null
  _count: { messages: number }
  messages: Array<{
    id: string; content: string; createdAt: string
    sender: { name: string; role: string }
    attachments: string[]
  }>
}

const AGENT_PALETTE = ['#2564ea', '#7f53f9', '#00c875', '#fdab3d', '#e2445c']
function agentMeta(ticket: Ticket): AgentMeta | null {
  if (ticket.assignedAgent) return ticket.assignedAgent
  if (!ticket.assignedTo) return null
  const name = ticket.assignedTo
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % AGENT_PALETTE.length
  return {
    name,
    initials: name.split(' ').map((n: string) => n[0] ?? '').join('').slice(0, 2).toUpperCase(),
    color: AGENT_PALETTE[Math.abs(hash)],
  }
}

// ─── SLA countdown ────────────────────────────────────────────────────────────

function useSLACountdown(deadlineMs: number | null) {
  const [remaining, setRemaining] = useState<number | null>(
    deadlineMs != null ? Math.max(0, deadlineMs - Date.now()) : null
  )
  useEffect(() => {
    if (deadlineMs == null) return
    const id = setInterval(() => setRemaining(Math.max(0, deadlineMs - Date.now())), 1000)
    return () => clearInterval(id)
  }, [deadlineMs])
  return remaining
}

function fmtCountdown(ms: number): string {
  const s = Math.floor(ms / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${sec}s`
  return `${sec}s`
}

function SLABadge({ createdAt, priority, status }: { createdAt: string; priority: string; status: string }) {
  const deadline = getDeadline(createdAt, priority)
  const remaining = useSLACountdown(deadline)
  if (remaining == null || status === 'RESOLVED' || status === 'CLOSED') return null

  const isBreached = remaining === 0
  const isWarning  = remaining < 30 * 60_000 // < 30 min
  const color      = isBreached ? '#f87171' : isWarning ? '#fbbf24' : '#34d399'
  const bg         = isBreached ? 'rgba(248,113,113,0.1)' : isWarning ? 'rgba(251,191,36,0.1)' : 'rgba(52,211,153,0.08)'
  const border     = isBreached ? 'rgba(248,113,113,0.3)' : isWarning ? 'rgba(251,191,36,0.3)' : 'rgba(52,211,153,0.2)'

  return (
    <span
      className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
      style={{ background: bg, color, border: `1px solid ${border}` }}
    >
      <Timer className="w-2.5 h-2.5" />
      {isBreached ? 'SLA breached' : `SLA ${fmtCountdown(remaining)}`}
    </span>
  )
}

// ─── ticket detail ────────────────────────────────────────────────────────────

function TicketDetail({
  ticket,
  onClose,
  onEscalate,
}: {
  ticket: Ticket
  onClose: () => void
  onEscalate: (id: string) => void
}) {
  const [reply, setReply] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [escalated, setEscalated] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const effectivePriority = escalated ? 'CRITICAL' : ticket.priority
  const deadline   = getDeadline(ticket.createdAt, effectivePriority)
  const remaining  = useSLACountdown(deadline)
  const isActive   = ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED'
  const canEscalate = isActive && ticket.priority !== 'CRITICAL' && !escalated

  const { mutate: sendReply, isPending } = useMutation({
    mutationFn: async (content: string) => {
      if (!isDemo()) {
        await api.post(`/tickets/${ticket.id}/reply`, {
          content,
          attachments: files.map(f => f.name),
        })
      }
    },
    onSuccess: () => {
      setReply('')
      setFiles([])
      queryClient.invalidateQueries({ queryKey: ['client', 'tickets'] })
    },
  })

  const { mutate: escalateTicket, isPending: isEscalating } = useMutation({
    mutationFn: async () => {
      if (!isDemo()) await api.patch(`/tickets/${ticket.id}/escalate`, {})
    },
    onSuccess: () => {
      setEscalated(true)
      onEscalate(ticket.id)
    },
  })

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files!)])
  }
  const removeFile = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i))

  return (
    <EditDrawer
      open
      onClose={onClose}
      title={ticket.subject}
      description={`#${ticket.id.toUpperCase()} · ${ticket.category.replace('_', ' ')}`}
      width="lg"
      footer={
        isActive ? (
          <div className="flex flex-col gap-2 w-full">
            {/* Attached files */}
            {files.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {files.map((f, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-lg text-slate-700"
                    style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)' }}
                  >
                    <Paperclip className="w-3 h-3 text-slate-600" />
                    <span className="truncate max-w-[120px]">{f.name}</span>
                    <button onClick={() => removeFile(i)} className="text-[color:var(--os-text-2)] hover:text-red-400 transition-colors ml-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-end gap-2 w-full">
              <Textarea
                className="flex-1 text-sm"
                rows={2}
                placeholder="Type a reply…"
                value={reply}
                onChange={e => setReply(e.target.value)}
              />
              {/* File attach */}
              <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFiles} />
              <button
                onClick={() => fileRef.current?.click()}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-200 transition-colors flex-shrink-0"
                style={{ background: 'var(--os-surface)', border: '1px solid var(--os-border)' }}
                title="Attach files"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <Button
                variant="primary" size="sm"
                leftIcon={<Send className="w-3.5 h-3.5" />}
                disabled={(!reply.trim() && files.length === 0) || isPending}
                onClick={() => (reply.trim() || files.length > 0) && sendReply(reply)}
              >
                Send
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-600">This ticket is resolved. Raise a new ticket if the issue recurs.</p>
        )
      }
    >
      <div className="space-y-4">
        {/* Meta row */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Badge variant={STATUS_VARIANT[ticket.status]} dot size="sm">
            {ticket.status.replace('_', ' ')}
          </Badge>
          <Badge variant={PRIORITY_VARIANT[effectivePriority]} size="sm">
            {escalated ? 'CRITICAL ↑' : effectivePriority}
          </Badge>
          <span className="text-xs text-slate-600">Opened {fmtDate(ticket.createdAt)}</span>
          {remaining != null && isActive && (
            <SLABadge createdAt={ticket.createdAt} priority={effectivePriority} status={ticket.status} />
          )}
        </div>

        {/* Agent + SLA info row */}
        <div className="flex items-center gap-4 flex-wrap py-3 px-3.5 rounded-xl" style={{ background: 'var(--os-surface)', border: '1px solid var(--os-border)' }}>
          {/* Assigned agent */}
          <div className="flex items-center gap-2">
            {(() => {
              const agent = agentMeta(ticket)
              return agent ? (
                <>
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black text-white flex-shrink-0"
                    style={{ background: agent.color }}
                  >
                    {agent.initials}
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-[color:var(--os-text-2)] uppercase tracking-wider">Assigned to</p>
                    <p className="text-xs font-semibold text-slate-700">{agent.name}</p>
                  </div>
                </>
              ) : (
                <>
                  <UserCircle className="w-5 h-5 text-[color:var(--os-text-2)]" />
                  <div>
                    <p className="text-[9px] font-bold text-[color:var(--os-text-2)] uppercase tracking-wider">Assigned to</p>
                    <p className="text-xs text-slate-600">Unassigned</p>
                  </div>
                </>
              )
            })()}
          </div>

          <div className="w-px h-6 flex-shrink-0" style={{ background: 'var(--os-surface-0)' }} />

          {/* SLA commitment */}
          <div>
            <p className="text-[9px] font-bold text-[color:var(--os-text-2)] uppercase tracking-wider">Response SLA</p>
            <p className="text-xs font-semibold text-slate-700">
              {effectivePriority === 'CRITICAL' ? '< 1 hour' :
               effectivePriority === 'HIGH'     ? '< 4 hours' :
               effectivePriority === 'MEDIUM'   ? '< 1 business day' :
               '< 3 business days'}
            </p>
          </div>

          {/* Escalate */}
          {canEscalate && (
            <>
              <div className="w-px h-6 flex-shrink-0" style={{ background: 'var(--os-surface-0)' }} />
              <button
                onClick={() => escalateTicket()}
                disabled={isEscalating}
                className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                {isEscalating ? 'Escalating…' : 'Escalate to Critical'}
              </button>
            </>
          )}
          {escalated && (
            <>
              <div className="w-px h-6 flex-shrink-0" style={{ background: 'var(--os-surface-0)' }} />
              <span className="flex items-center gap-1.5 text-xs font-semibold text-red-400">
                <AlertOctagon className="w-3.5 h-3.5" />
                Escalated — your account manager has been notified
              </span>
            </>
          )}
        </div>

        {/* Conversation */}
        <div className="space-y-3">
          {ticket.messages.map(msg => {
            const isClient = msg.sender.role === 'CLIENT'
            return (
              <div key={msg.id} className={`flex ${isClient ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${isClient ? 'bg-os-blue text-white rounded-br-sm' : 'rounded-bl-sm'}`}
                  style={!isClient ? { background: 'var(--os-surface)', border: '1px solid var(--os-border)', color: 'var(--os-text-1)' } : {}}
                >
                  {!isClient && (
                    <p className="text-[10px] font-semibold mb-1 opacity-70">{msg.sender.name}</p>
                  )}
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  {msg.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.attachments.map(att => (
                        <span
                          key={att}
                          className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg"
                          style={{
                            background: isClient ? 'rgba(255,255,255,0.15)' : 'var(--os-surface-0)',
                            color: isClient ? 'rgba(255,255,255,0.9)' : 'var(--os-text-2)',
                          }}
                        >
                          <Paperclip className="w-2.5 h-2.5" />{att}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className={`text-[10px] mt-1.5 ${isClient ? 'text-blue-200' : 'text-slate-600'}`}>
                    {fmtTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            )
          })}
          {ticket.messages.length === 0 && (
            <p className="text-sm text-slate-600 text-center py-6">No messages yet.</p>
          )}
        </div>
      </div>
    </EditDrawer>
  )
}

// ─── raise ticket ─────────────────────────────────────────────────────────────

function RaiseTicketDrawer({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ subject: '', category: 'BUG', priority: 'MEDIUM', content: '' })
  const queryClient = useQueryClient()
  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!isDemo()) await api.post('/tickets', form)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client', 'tickets'] })
      onClose()
    },
  })

  return (
    <EditDrawer
      open onClose={onClose}
      title="Raise a support ticket" width="md"
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
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Subject *</label>
          <Input value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="Brief description of the issue" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Category</label>
            <select value={form.category} onChange={e => set('category', e.target.value)}
              className="w-full rounded-xl px-3 py-2 text-sm text-[var(--os-text-1)] focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" style={{ border: '1px solid var(--os-border)', background: 'var(--os-card)' }}>
              <option value="BUG">Bug / Issue</option>
              <option value="FEATURE_REQUEST">Feature Request</option>
              <option value="CORRECTION">Correction</option>
              <option value="BILLING">Billing Query</option>
              <option value="GENERAL">General</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Priority</label>
            <select value={form.priority} onChange={e => set('priority', e.target.value)}
              className="w-full rounded-xl px-3 py-2 text-sm text-[var(--os-text-1)] focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" style={{ border: '1px solid var(--os-border)', background: 'var(--os-card)' }}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description *</label>
          <Textarea value={form.content} onChange={e => set('content', e.target.value)} rows={5} placeholder="Describe the issue in detail…" />
        </div>
      </div>
    </EditDrawer>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export function ClientSupport() {
  const { data } = useClientTickets()
  const [tickets, setTickets] = useState<Ticket[]>([])
  useEffect(() => { setTickets((data as Ticket[] | undefined) ?? []) }, [data])

  const [openId,      setOpenId]    = useState<string | null>(null)
  const [showRaise,   setShowRaise] = useState(false)
  const [statusFilter, setFilter]   = useState<string>('ALL')

  const handleEscalate = (id: string) =>
    setTickets(ts => ts.map(t => t.id === id ? { ...t, priority: 'CRITICAL' } : t))

  const openTicket = tickets.find(t => t.id === openId)
  const visible    = statusFilter === 'ALL' ? tickets : tickets.filter(t => t.status === statusFilter)
  const open       = tickets.filter(t => t.status === 'OPEN').length
  const inProgress = tickets.filter(t => t.status === 'IN_PROGRESS').length
  const resolved   = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length

  return (
    <div className="space-y-5">
      <KIMMPSignalBar module="Support" />
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Support</h2>
          <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: 'var(--os-text-2)' }}>{tickets.length} tickets</p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowRaise(true)}>
          Raise ticket
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Open"        value={open}       icon={<AlertCircle  className="w-5 h-5" />} iconColor={open > 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-white/5 text-slate-600'} />
        <StatCard label="In Progress" value={inProgress} icon={<Clock        className="w-5 h-5" />} iconColor="bg-blue-500/10 text-blue-400" />
        <StatCard label="Resolved"    value={resolved}   icon={<CheckCircle2 className="w-5 h-5" />} iconColor="bg-emerald-500/10 text-emerald-400" />
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
            style={statusFilter === s
              ? { background: '#579bfc', color: '#fff', boxShadow: '0 2px 8px rgba(87,155,252,0.35)' }
              : { background: 'var(--os-surface)', color: 'var(--os-text-2)', border: '1px solid var(--os-border)' }
            }
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
              <MessageSquare className="w-4 h-4 text-slate-700 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--os-text-1)' }}>{t.subject}</p>
                  {/* Agent avatar */}
                  {(() => {
                    const agent = agentMeta(t)
                    return agent ? (
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black text-white flex-shrink-0"
                        style={{ background: agent.color }}
                        title={`Assigned: ${agent.name}`}
                      >
                        {agent.initials}
                      </div>
                    ) : null
                  })()}
                </div>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{t.content}</p>
                <div className="flex items-center gap-2.5 mt-2 flex-wrap">
                  <Badge variant={STATUS_VARIANT[t.status]} dot size="sm">{t.status.replace('_', ' ')}</Badge>
                  <Badge variant={PRIORITY_VARIANT[t.priority]} size="sm">{t.priority}</Badge>
                  <span className="text-[11px] text-slate-600">{t.category.replace('_', ' ')}</span>
                  <span className="text-[11px] text-slate-600">{fmtDate(t.updatedAt)}</span>
                  {t._count.messages > 0 && (
                    <span className="text-[11px] text-slate-600 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />{t._count.messages}
                    </span>
                  )}
                  <SLABadge createdAt={t.createdAt} priority={t.priority} status={t.status} />
                </div>
              </div>
            </div>
          </Card>
        ))}
        {visible.length === 0 && (
          <div className="py-12 text-center text-sm text-slate-600">
            {tickets.length === 0 ? "You haven't raised any tickets yet." : 'No tickets match this filter.'}
          </div>
        )}
      </div>

      {openTicket && (
        <TicketDetail
          ticket={openTicket}
          onClose={() => setOpenId(null)}
          onEscalate={handleEscalate}
        />
      )}
      {showRaise && <RaiseTicketDrawer onClose={() => setShowRaise(false)} />}
    </div>
  )
}
