/**
 * ClientChangeRequests — Apple-grade rebuild
 * 4-surface dark system, ₹ currency, no light-theme classes
 */
import { useState, useEffect, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Clock, CheckCircle2, XCircle, ChevronRight, Send, MessageSquare } from 'lucide-react'
import { EditDrawer } from '@components/EditDrawer'
import { api, isDemo } from '@lib/api'
import { useClientChangeRequests, useCRMessages, useSendCRMessage, type CRMessage } from '../useClientData'
import { useAuthStore } from '@store/auth'

// ── Design tokens ─────────────────────────────────────────────────────────────

const CARD  = '#0d1117'
const RAISE = '#121d30'
const EDGE  = '#1e2b40'
const BLUE   = '#2564ea'
const GREEN  = '#00c875'
const AMBER  = '#fdab3d'
const RED    = '#e2445c'
const EASE   = 'cubic-bezier(0.16, 1, 0.3, 1)'

let _inj = false
function ensureKf() {
  if (_inj) return; _inj = true
  const s = document.createElement('style')
  s.textContent = `@keyframes _fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}`
  document.head.appendChild(s)
}
const anim = (d: number): React.CSSProperties => ({ animation: `_fadeUp 0.55s ${EASE} ${d}ms both` })

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_CRS = [
  {
    id: 'cr1', title: 'Add offline mode to Patient Portal mobile app',
    description: 'Clinicians in low-connectivity areas need to view patient records offline and sync when reconnected.',
    priority: 'HIGH', status: 'PENDING_APPROVAL',
    costImpact: 12000, timeImpact: '3 weeks',
    requestedBy: 'Dr. Sarah Mitchell', decisionType: 'Scope Change',
    project: { title: 'Patient Portal v2' },
    createdAt: '2026-06-01T10:00:00Z', updatedAt: '2026-06-01T10:00:00Z',
    approvingDecisions: [] as { id: string; title: string; status: string }[],
  },
  {
    id: 'cr2', title: 'Integrate with existing Salesforce CRM',
    description: 'We need bi-directional sync between the new Analytics Dashboard and our Salesforce instance for unified reporting.',
    priority: 'MEDIUM', status: 'UNDER_REVIEW',
    costImpact: 8500, timeImpact: '2 weeks',
    requestedBy: 'James Okello', decisionType: 'Integration',
    project: { title: 'Analytics Dashboard' },
    createdAt: '2026-05-25T09:00:00Z', updatedAt: '2026-05-28T11:00:00Z',
    approvingDecisions: [],
  },
  {
    id: 'cr3', title: 'Multi-language support (Arabic + French)',
    description: 'Regulatory requirement for our GCC expansion — patient-facing UI must support Arabic RTL and French.',
    priority: 'HIGH', status: 'APPROVED',
    costImpact: 18000, timeImpact: '5 weeks',
    requestedBy: 'Yasmin Al-Hassan', decisionType: 'Scope Change',
    project: { title: 'Patient Portal v2' },
    createdAt: '2026-05-10T08:00:00Z', updatedAt: '2026-05-20T14:00:00Z',
    approvingDecisions: [{ id: 'd1', title: 'GCC Localisation Approval', status: 'APPROVED' }],
  },
  {
    id: 'cr4', title: 'Remove patient photo upload feature from MVP',
    description: 'Scope reduction request — remove photo upload to reduce HIPAA surface area for MVP. Add back in Phase 2.',
    priority: 'LOW', status: 'APPROVED',
    costImpact: -5000, timeImpact: '-1 week',
    requestedBy: 'Sarah Mitchell', decisionType: 'Scope Reduction',
    project: { title: 'HIPAA Compliance Layer' },
    createdAt: '2026-05-05T10:00:00Z', updatedAt: '2026-05-12T09:00:00Z',
    approvingDecisions: [],
  },
  {
    id: 'cr5', title: 'Add real-time P&L feed from Bloomberg',
    description: 'Connect the financial dashboard to live Bloomberg data via their terminal API.',
    priority: 'HIGH', status: 'REJECTED',
    costImpact: 25000, timeImpact: '6 weeks',
    requestedBy: 'Tom Chen', decisionType: 'Integration',
    project: { title: 'Analytics Dashboard' },
    createdAt: '2026-04-28T14:00:00Z', updatedAt: '2026-05-03T10:00:00Z',
    approvingDecisions: [],
  },
]

type CR = typeof MOCK_CRS[0]

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const fmtCost = (n: number) => n < 0 ? `-₹${Math.abs(n).toLocaleString()}` : `+₹${n.toLocaleString()}`

const STATUS_COLOR: Record<string, string> = {
  PENDING_APPROVAL: AMBER,
  UNDER_REVIEW:     BLUE,
  APPROVED:         GREEN,
  REJECTED:         RED,
}
const STATUS_LABEL: Record<string, string> = {
  PENDING_APPROVAL: 'Pending',
  UNDER_REVIEW:     'Under Review',
  APPROVED:         'Approved',
  REJECTED:         'Rejected',
}
const PRIORITY_COLOR: Record<string, string> = {
  HIGH: RED, MEDIUM: AMBER, LOW: '#64748b',
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const color = STATUS_COLOR[status] ?? '#64748b'
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999,
      color, background: `${color}14`, border: `1px solid ${color}25`,
      display: 'inline-flex', alignItems: 'center', gap: 4,
    }}>
      {status === 'APPROVED'  && <CheckCircle2 style={{ width: 9, height: 9 }} />}
      {status === 'REJECTED'  && <XCircle       style={{ width: 9, height: 9 }} />}
      {(status === 'PENDING_APPROVAL' || status === 'UNDER_REVIEW') && <Clock style={{ width: 9, height: 9 }} />}
      {STATUS_LABEL[status] ?? status}
    </span>
  )
}

// ── Status timeline ───────────────────────────────────────────────────────────

const TIMELINE_STEPS = ['PENDING_APPROVAL', 'UNDER_REVIEW', 'APPROVED']

function StatusTimeline({ status }: { status: string }) {
  const rejected   = status === 'REJECTED'
  const currentIdx = TIMELINE_STEPS.indexOf(status)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      {TIMELINE_STEPS.map((step, i) => {
        const isActive  = !rejected && i <= currentIdx
        const isCurrent = !rejected && i === currentIdx
        const color     = isActive ? (isCurrent ? STATUS_COLOR[step] : GREEN) : '#334155'
        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              padding: '4px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700,
              color: isActive ? color : '#334155',
              background: isActive ? `${color}14` : RAISE,
              border: `1px solid ${isActive ? `${color}30` : EDGE}`,
            }}>
              {STATUS_LABEL[step]}
            </div>
            {i < TIMELINE_STEPS.length - 1 && (
              <div style={{ width: 20, height: 1, background: isActive ? `${GREEN}50` : EDGE }} />
            )}
          </div>
        )
      })}
      {rejected && (
        <div style={{
          padding: '4px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700,
          color: RED, background: `${RED}14`, border: `1px solid ${RED}30`,
        }}>
          Rejected
        </div>
      )}
    </div>
  )
}

// ── Message thread ────────────────────────────────────────────────────────────

function MessageThread({ crId }: { crId: string }) {
  const { user }                      = useAuthStore()
  const { data: messages = [] }       = useCRMessages(crId)
  const { mutate: send, isPending }   = useSendCRMessage()
  const [draft, setDraft]             = useState('')
  const bottomRef                     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  function handleSend() {
    const content = draft.trim()
    if (!content || isPending) return
    send({ crId, content })
    setDraft('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <MessageSquare style={{ width: 13, height: 13, color: BLUE }} />
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#334155', margin: 0 }}>
          Discussion
        </p>
        {messages.length > 0 && (
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 999,
            color: BLUE, background: `${BLUE}14`, border: `1px solid ${BLUE}25`,
          }}>{messages.length}</span>
        )}
      </div>

      {/* Thread */}
      <div style={{
        maxHeight: 280, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10,
        padding: messages.length ? '4px 0 8px' : 0,
      }}>
        {messages.length === 0 && (
          <p style={{ fontSize: 12, color: '#334155', margin: '0 0 8px' }}>No messages yet. Start the conversation below.</p>
        )}
        {messages.map((m: CRMessage) => {
          const isMe = m.sender.id === user?.id
          return (
            <div key={m.id} style={{
              display: 'flex', flexDirection: 'column',
              alignItems: isMe ? 'flex-end' : 'flex-start',
            }}>
              <div style={{
                maxWidth: '80%', padding: '10px 14px', borderRadius: isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                background: isMe ? `${BLUE}18` : RAISE,
                border: `1px solid ${isMe ? `${BLUE}30` : EDGE}`,
              }}>
                <p style={{ fontSize: 13, color: '#e2e8f0', margin: 0, lineHeight: 1.5 }}>{m.content}</p>
              </div>
              <p style={{ fontSize: 10, color: '#334155', margin: '3px 4px 0' }}>
                {isMe ? 'You' : m.sender.name} · {new Date(m.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        display: 'flex', gap: 8, alignItems: 'flex-end', marginTop: 8,
        padding: '12px', borderRadius: 12,
        background: RAISE, border: `1px solid ${EDGE}`,
      }}>
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
          placeholder="Write a message… (Enter to send)"
          rows={2}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            fontSize: 13, color: '#e2e8f0', resize: 'none', fontFamily: 'inherit',
            lineHeight: 1.5,
          }}
        />
        <button
          onClick={handleSend}
          disabled={!draft.trim() || isPending}
          style={{
            width: 34, height: 34, borderRadius: 10, flexShrink: 0, cursor: draft.trim() ? 'pointer' : 'default',
            background: draft.trim() ? BLUE : '#1a2340',
            border: `1px solid ${draft.trim() ? BLUE : EDGE}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}
        >
          <Send style={{ width: 14, height: 14, color: draft.trim() ? '#fff' : '#334155' }} />
        </button>
      </div>
    </div>
  )
}

// ── CR detail drawer ──────────────────────────────────────────────────────────

function CRDetail({ cr, onClose }: { cr: CR; onClose: () => void }) {
  const sColor = STATUS_COLOR[cr.status] ?? '#64748b'
  const pColor = PRIORITY_COLOR[cr.priority] ?? '#64748b'

  return (
    <EditDrawer
      open
      onClose={onClose}
      title={cr.title}
      description={cr.project?.title}
      width="lg"
      footer={
        <button onClick={onClose} style={{
          padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
          background: RAISE, border: `1px solid ${EDGE}`, color: '#94a3b8', cursor: 'pointer',
        }}>
          Close
        </button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Timeline */}
        <StatusTimeline status={cr.status} />

        {/* Meta badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999,
            color: pColor, background: `${pColor}14`, border: `1px solid ${pColor}25`,
          }}>
            {cr.priority}
          </span>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999,
            color: '#64748b', background: RAISE, border: `1px solid ${EDGE}`,
          }}>
            {cr.decisionType}
          </span>
          <span style={{ fontSize: 11, color: '#334155' }}>Submitted {fmtDate(cr.createdAt)}</span>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: EDGE }} />

        {/* Description */}
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#334155', margin: '0 0 8px' }}>Description</p>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>{cr.description}</p>
        </div>

        {/* Impact grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ padding: '14px 16px', borderRadius: 12, background: RAISE, border: `1px solid ${EDGE}` }}>
            <p style={{ fontSize: 10, color: '#334155', margin: '0 0 6px' }}>Cost impact</p>
            <p style={{
              fontSize: 15, fontWeight: 700, margin: 0,
              color: cr.costImpact < 0 ? GREEN : AMBER,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {fmtCost(cr.costImpact)}
            </p>
          </div>
          <div style={{ padding: '14px 16px', borderRadius: 12, background: RAISE, border: `1px solid ${EDGE}` }}>
            <p style={{ fontSize: 10, color: '#334155', margin: '0 0 6px' }}>Time impact</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', margin: 0 }}>{cr.timeImpact}</p>
          </div>
        </div>

        {/* Requested by */}
        <p style={{ fontSize: 12, color: '#334155', margin: 0 }}>
          Requested by: <span style={{ color: '#94a3b8', fontWeight: 600 }}>{cr.requestedBy}</span>
        </p>

        {/* Linked decisions */}
        {cr.approvingDecisions?.length > 0 && (
          <>
            <div style={{ height: 1, background: EDGE }} />
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#334155', margin: '0 0 8px' }}>
                Linked decisions
              </p>
              {cr.approvingDecisions.map(d => (
                <div key={d.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px', borderRadius: 12,
                  background: `${GREEN}0a`, border: `1px solid ${GREEN}20`,
                }}>
                  <span style={{ fontSize: 13, color: '#94a3b8' }}>{d.title}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999,
                    color: GREEN, background: `${GREEN}14`, border: `1px solid ${GREEN}25`,
                  }}>
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Message thread */}
        <div style={{ height: 1, background: EDGE }} />
        <MessageThread crId={cr.id} />

      </div>
    </EditDrawer>
  )
}

// ── Submit CR drawer ──────────────────────────────────────────────────────────

function SubmitCRDrawer({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ title: '', description: '', priority: 'MEDIUM', costImpact: '', timeImpact: '' })
  const [focused, setFocused] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!isDemo()) await api.post('/change-requests', {
        ...form, costImpact: form.costImpact ? Number(form.costImpact) : null,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client', 'change-requests'] })
      onClose()
    },
  })

  const labelCss: React.CSSProperties = {
    display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
    textTransform: 'uppercase', color: '#334155', marginBottom: 8,
  }
  const inputCss = (k: string): React.CSSProperties => ({
    width: '100%', background: RAISE, border: `1px solid ${focused === k ? `${BLUE}60` : EDGE}`,
    borderRadius: 10, padding: '9px 12px', fontSize: 13, color: '#e2e8f0',
    outline: 'none', transition: 'border-color 0.15s', fontFamily: 'inherit', boxSizing: 'border-box',
  })

  return (
    <EditDrawer
      open
      onClose={onClose}
      title="Submit change request"
      width="md"
      footer={
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{
            padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
            background: RAISE, border: `1px solid ${EDGE}`, color: '#94a3b8', cursor: 'pointer',
          }}>
            Cancel
          </button>
          <button
            disabled={!form.title.trim() || isPending}
            onClick={() => mutate()}
            style={{
              padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
              background: form.title.trim() ? BLUE : RAISE,
              border: `1px solid ${form.title.trim() ? BLUE : EDGE}`,
              color: form.title.trim() ? '#fff' : '#334155',
              cursor: form.title.trim() ? 'pointer' : 'not-allowed',
              boxShadow: form.title.trim() ? `0 4px 14px ${BLUE}40` : 'none',
              transition: `all 0.2s ${EASE}`,
            }}>
            {isPending ? 'Submitting…' : 'Submit'}
          </button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={labelCss}>Change title *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)}
            onFocus={() => setFocused('title')} onBlur={() => setFocused(null)}
            placeholder="Brief title for the change"
            style={inputCss('title')} />
        </div>
        <div>
          <label style={labelCss}>Description *</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)}
            onFocus={() => setFocused('description')} onBlur={() => setFocused(null)}
            rows={4} placeholder="What change is needed and why?"
            style={{ ...inputCss('description'), resize: 'vertical' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelCss}>Priority</label>
            <select value={form.priority} onChange={e => set('priority', e.target.value)}
              onFocus={() => setFocused('priority')} onBlur={() => setFocused(null)}
              style={{ ...inputCss('priority'), appearance: 'none', cursor: 'pointer' }}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div>
            <label style={labelCss}>Cost impact (₹)</label>
            <input type="number" value={form.costImpact} onChange={e => set('costImpact', e.target.value)}
              onFocus={() => setFocused('cost')} onBlur={() => setFocused(null)}
              placeholder="e.g. 5000"
              style={inputCss('cost')} />
          </div>
        </div>
        <div>
          <label style={labelCss}>Time impact</label>
          <input value={form.timeImpact} onChange={e => set('timeImpact', e.target.value)}
            onFocus={() => setFocused('time')} onBlur={() => setFocused(null)}
            placeholder="e.g. 2 weeks"
            style={inputCss('time')} />
        </div>
      </div>
    </EditDrawer>
  )
}

// ── KPI Tile ──────────────────────────────────────────────────────────────────

function KpiTile({ label, value, Icon, color }: { label: string; value: number; Icon: React.ElementType; color: string }) {
  return (
    <div style={{
      borderRadius: 16, padding: '20px 20px',
      background: CARD, border: `1px solid ${EDGE}`,
      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.03)`,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, marginBottom: 14,
        background: `${color}14`, border: `1px solid ${color}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon style={{ width: 16, height: 16, color }} />
      </div>
      <p style={{ fontSize: 28, fontWeight: 900, color: value > 0 ? color : '#334155', margin: '0 0 4px', fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </p>
      <p style={{ fontSize: 11, color: '#475569', margin: 0 }}>{label}</p>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function ClientChangeRequests() {
  const { data } = useClientChangeRequests()
  const crs: CR[] = (data as CR[] | undefined)?.length ? data as CR[] : MOCK_CRS

  useEffect(() => { ensureKf() }, [])

  const [openId,   setOpenId]   = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [filter,   setFilter]   = useState('ALL')

  const openCR  = crs.find(c => c.id === openId)
  const visible = filter === 'ALL' ? crs : crs.filter(c => c.status === filter)

  const pending  = crs.filter(c => c.status === 'PENDING_APPROVAL' || c.status === 'UNDER_REVIEW').length
  const approved = crs.filter(c => c.status === 'APPROVED').length
  const rejected = crs.filter(c => c.status === 'REJECTED').length

  const FILTERS = [
    { key: 'ALL',              label: 'All' },
    { key: 'PENDING_APPROVAL', label: 'Pending' },
    { key: 'UNDER_REVIEW',     label: 'Under Review' },
    { key: 'APPROVED',         label: 'Approved' },
    { key: 'REJECTED',         label: 'Rejected' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ ...anim(0), display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Change Requests</h2>
          <p style={{ fontSize: 13, color: '#475569', margin: '6px 0 0' }}>{crs.length} total · {pending} in review</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '9px 16px', borderRadius: 10, border: 'none',
            background: BLUE, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            boxShadow: `0 4px 14px ${BLUE}40`,
          }}>
          <Plus style={{ width: 14, height: 14 }} />
          Submit change
        </button>
      </div>

      {/* KPI tiles */}
      <div style={{ ...anim(60), display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <KpiTile label="In Review" value={pending}  Icon={Clock}         color={AMBER} />
        <KpiTile label="Approved"  value={approved} Icon={CheckCircle2}  color={GREEN} />
        <KpiTile label="Rejected"  value={rejected} Icon={XCircle}       color={RED}   />
      </div>

      {/* Filter chips */}
      <div style={{ ...anim(100), display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {FILTERS.map(f => {
          const active = filter === f.key
          const color  = active ? BLUE : '#334155'
          return (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: '6px 14px', borderRadius: 10, border: `1px solid ${active ? BLUE : EDGE}`,
              background: active ? `${BLUE}14` : RAISE,
              color: active ? BLUE : '#64748b',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              transition: `all 0.15s ${EASE}`,
            }}>
              {f.label}
            </button>
          )
        })}
      </div>

      {/* CR rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {visible.length === 0 && (
          <div style={{ padding: '48px 0', textAlign: 'center', fontSize: 13, color: '#334155' }}>
            No change requests match this filter.
          </div>
        )}
        {visible.map((cr, i) => {
          const sColor = STATUS_COLOR[cr.status] ?? '#64748b'
          const pColor = PRIORITY_COLOR[cr.priority] ?? '#64748b'
          return (
            <div
              key={cr.id}
              onClick={() => setOpenId(cr.id)}
              style={{
                animation: `_fadeUp 0.55s ${EASE} ${120 + i * 40}ms both`,
                borderRadius: 16, padding: '16px 20px',
                background: CARD, border: `1px solid ${EDGE}`,
                borderLeft: `3px solid ${sColor}`,
                display: 'flex', alignItems: 'flex-start', gap: 14, cursor: 'pointer',
                transition: `box-shadow 0.15s, border-color 0.15s`,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px rgba(0,0,0,0.3)`
                ;(e.currentTarget as HTMLElement).style.borderColor = `${sColor}60`
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none'
                ;(e.currentTarget as HTMLElement).style.borderColor = EDGE
              }}>

              {/* Status icon */}
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0, marginTop: 1,
                background: `${sColor}12`, border: `1px solid ${sColor}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {(cr.status === 'PENDING_APPROVAL' || cr.status === 'UNDER_REVIEW') && <Clock       style={{ width: 15, height: 15, color: sColor }} />}
                {cr.status === 'APPROVED'                                             && <CheckCircle2 style={{ width: 15, height: 15, color: sColor }} />}
                {cr.status === 'REJECTED'                                             && <XCircle     style={{ width: 15, height: 15, color: sColor }} />}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {cr.title}
                </p>
                <p style={{ fontSize: 12, color: '#475569', margin: '0 0 10px', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {cr.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <StatusBadge status={cr.status} />
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999,
                    color: pColor, background: `${pColor}14`, border: `1px solid ${pColor}25`,
                  }}>
                    {cr.priority}
                  </span>
                  {cr.project && (
                    <span style={{ fontSize: 11, color: '#334155' }}>{cr.project.title}</span>
                  )}
                  {cr.costImpact !== 0 && (
                    <span style={{ fontSize: 11, color: cr.costImpact < 0 ? GREEN : AMBER, fontVariantNumeric: 'tabular-nums' }}>
                      {fmtCost(cr.costImpact)}
                    </span>
                  )}
                  <span style={{ fontSize: 11, color: '#334155' }}>{cr.timeImpact}</span>
                </div>
              </div>

              {/* Date + chevron */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 10, color: '#334155', whiteSpace: 'nowrap' }}>{fmtDate(cr.createdAt)}</span>
                <ChevronRight style={{ width: 14, height: 14, color: '#334155' }} />
              </div>
            </div>
          )
        })}
      </div>

      {openCR   && <CRDetail cr={openCR} onClose={() => setOpenId(null)} />}
      {showForm && <SubmitCRDrawer onClose={() => setShowForm(false)} />}
    </div>
  )
}
