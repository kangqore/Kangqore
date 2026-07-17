import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { api } from '@lib/api'
import {
  AlertTriangle, CheckCircle2, Phone, Mail, Zap,
  Clock, TrendingUp, Search, MessageSquare,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Invoice {
  id: string
  invoiceNumber: string
  amount: number
  currency: string
  status: string
  dueDate: string
  paidAt: string | null
  notes: string | null
  clientId: string
  project: { title: string } | null
}

interface FollowUp {
  invoiceId: string
  type: 'email' | 'call' | 'escalate' | 'note'
  text: string
  at: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtFull = (n: number) => `₹${n.toLocaleString('en-IN')}`
const fmt = (n: number) => `₹${n >= 100000 ? (n / 100000).toFixed(1) + 'L' : n >= 1000 ? (n / 1000).toFixed(0) + 'K' : n.toLocaleString()}`
const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const daysOver = (due: string) => Math.max(0, Math.floor((Date.now() - new Date(due).getTime()) / 86400000))

const urgencyColor = (days: number) => days > 60 ? '#e2445c' : days > 30 ? '#fdab3d' : '#579bfc'
const urgencyLabel = (days: number) => days > 60 ? 'CRITICAL' : days > 30 ? 'HIGH' : 'MODERATE'

// ── Action log (local state — persists per page mount) ────────────────────────

const ACTION_ICONS = { email: Mail, call: Phone, escalate: Zap, note: MessageSquare }
const ACTION_COLORS = { email: '#579bfc', call: '#00c875', escalate: '#e2445c', note: '#9898c0' }

// ── Collections card ──────────────────────────────────────────────────────────

function CollectionCard({
  inv, days, followUps, onMarkPaid, onFollowUp,
}: {
  inv: Invoice
  days: number
  followUps: FollowUp[]
  onMarkPaid: (id: string) => void
  onFollowUp: (invoiceId: string, type: FollowUp['type'], text: string) => void
}) {
  const [showNote, setShowNote] = useState(false)
  const [noteText, setNoteText] = useState('')
  const color = urgencyColor(days)
  const label = urgencyLabel(days)
  const myLogs = followUps.filter(f => f.invoiceId === inv.id)

  const logAction = (type: FollowUp['type'], text: string) => {
    onFollowUp(inv.id, type, text)
    toast.success(`${type === 'email' ? 'Email reminder' : type === 'call' ? 'Call logged' : type === 'escalate' ? 'Escalated' : 'Note saved'}`)
  }

  return (
    <div style={{
      background: 'var(--os-card)', border: `1px solid var(--os-border)`,
      borderRadius: 12, overflow: 'hidden', borderTop: `3px solid ${color}`,
    }}>
      {/* Top bar */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--os-border)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--os-text-1)' }}>{inv.invoiceNumber}</span>
              <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '.1em', padding: '2px 7px', borderRadius: 8, background: color + '20', color }}>{label}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--os-text-3)' }}>{inv.project?.title ?? '—'}</div>
          </div>
          <div style={{ textAlign: 'right' as const }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--os-text-1)' }}>{fmtFull(inv.amount)}</div>
            <div style={{ fontSize: 11, color, fontWeight: 700 }}>{days} days overdue</div>
            <div style={{ fontSize: 10, color: 'var(--os-text-3)' }}>Due: {fmtDate(inv.dueDate)}</div>
          </div>
        </div>
      </div>

      {/* Action log */}
      {myLogs.length > 0 && (
        <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--os-border)', background: 'var(--os-surface-0)' }}>
          {myLogs.slice(-3).map((log, i) => {
            const Icon = ACTION_ICONS[log.type]
            const c = ACTION_COLORS[log.type]
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: i < myLogs.length - 1 ? 6 : 0 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: c + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={11} color={c} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 11, color: 'var(--os-text-2)' }}>{log.text}</span>
                </div>
                <span style={{ fontSize: 10, color: 'var(--os-text-3)', flexShrink: 0 }}>{new Date(log.at).toLocaleDateString()}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Actions */}
      <div style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, marginBottom: showNote ? 10 : 0 }}>
          <button onClick={() => logAction('email', 'Sent payment reminder email')}
            style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, padding: '6px 12px', borderRadius: 7, background: '#579bfc18', color: '#579bfc', border: '1px solid #579bfc30', cursor: 'pointer' }}>
            <Mail size={12} /> Send Reminder
          </button>
          <button onClick={() => logAction('call', 'Called client regarding payment')}
            style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, padding: '6px 12px', borderRadius: 7, background: '#00c87518', color: '#00c875', border: '1px solid #00c87530', cursor: 'pointer' }}>
            <Phone size={12} /> Log Call
          </button>
          <button onClick={() => logAction('escalate', 'Escalated to management for follow-up')}
            style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, padding: '6px 12px', borderRadius: 7, background: '#e2445c18', color: '#e2445c', border: '1px solid #e2445c30', cursor: 'pointer' }}>
            <Zap size={12} /> Escalate
          </button>
          <button onClick={() => setShowNote(n => !n)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, padding: '6px 12px', borderRadius: 7, background: 'var(--os-surface-0)', color: 'var(--os-text-2)', border: '1px solid var(--os-border)', cursor: 'pointer' }}>
            <MessageSquare size={12} /> Note
          </button>
          <button onClick={() => onMarkPaid(inv.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, padding: '6px 12px', borderRadius: 7, background: '#00c875', color: '#fff', border: 'none', cursor: 'pointer', marginLeft: 'auto' }}>
            <CheckCircle2 size={12} /> Mark Paid ✓
          </button>
        </div>

        {showNote && (
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <input value={noteText} onChange={e => setNoteText(e.target.value)}
              placeholder="Add a note about this collection…"
              onKeyDown={e => { if (e.key === 'Enter' && noteText.trim()) { logAction('note', noteText); setNoteText(''); setShowNote(false) } }}
              style={{ flex: 1, padding: '7px 12px', borderRadius: 7, border: '1px solid var(--os-border)', background: 'var(--os-surface-0)', color: 'var(--os-text-1)', fontSize: 12, outline: 'none' }}
            />
            <button onClick={() => { if (noteText.trim()) { logAction('note', noteText); setNoteText(''); setShowNote(false) } }}
              style={{ padding: '7px 14px', borderRadius: 7, background: '#9898c0', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>Save</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function CollectionsPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'days' | 'amount'>('days')
  const [followUps, setFollowUps] = useState<FollowUp[]>([])

  const { data, isLoading } = useQuery<{ invoices: any[] }>({
    queryKey: ['invoices'],
    queryFn: () => api.get('/invoices').then(r => r.data),
    staleTime: 60_000,
  })

  const paidMut = useMutation({
    mutationFn: (id: string) => api.patch(`/invoices/${id}/status`, { status: 'PAID' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['invoices'] }); toast.success('Marked as paid — removed from collections') },
    onError: () => toast.error('Update failed'),
  })

  const allInvoices = (data?.invoices ?? []).map((i: any) => ({ ...i, amount: Number(i.amount) }))
  const overdue: Invoice[] = allInvoices.filter((i: any) => (i.status as string).toUpperCase() === 'OVERDUE')

  const addFollowUp = (invoiceId: string, type: FollowUp['type'], text: string) => {
    setFollowUps(prev => [...prev, { invoiceId, type, text, at: new Date().toISOString() }])
  }

  const enriched = overdue.map(inv => ({ inv, days: daysOver(inv.dueDate) }))
  const sorted = [...enriched].sort((a, b) => sort === 'days' ? b.days - a.days : b.inv.amount - a.inv.amount)
  const filtered = sorted.filter(({ inv }) => {
    if (!search) return true
    return inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      (inv.project?.title ?? '').toLowerCase().includes(search.toLowerCase())
  })

  const totalOverdue = overdue.reduce((s, i) => s + i.amount, 0)
  const critical = enriched.filter(e => e.days > 60).length
  const high = enriched.filter(e => e.days > 30 && e.days <= 60).length

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--os-text-1)' }}>Collections</div>
          <div style={{ fontSize: 11, color: 'var(--os-text-3)', marginTop: 2 }}>
            {overdue.length} overdue invoices · <span style={{ color: '#e2445c', fontWeight: 700 }}>{fmt(totalOverdue)} outstanding</span>
          </div>
        </div>
        <button onClick={() => qc.invalidateQueries({ queryKey: ['invoices'] })}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid var(--os-border)', background: 'transparent', color: 'var(--os-text-2)', cursor: 'pointer', fontSize: 12 }}>
          <Search size={13} /> Refresh
        </button>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Outstanding', value: fmt(totalOverdue), sub: `${overdue.length} invoices`, color: '#e2445c', Icon: AlertTriangle },
          { label: 'Critical (>60d)', value: critical, sub: 'need escalation', color: '#e2445c', Icon: Zap },
          { label: 'High (30-60d)', value: high, sub: 'send reminders', color: '#fdab3d', Icon: Clock },
          { label: 'Moderate (<30d)', value: enriched.filter(e => e.days <= 30).length, sub: 'follow up', color: '#579bfc', Icon: TrendingUp },
        ].map(card => {
          const Icon = card.Icon
          return (
            <div key={card.label} style={{ flex: 1, background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, padding: '16px 18px', borderTop: `3px solid ${card.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                <Icon size={13} color={card.color} />
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: 'var(--os-text-2)' }}>{card.label}</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: card.color, lineHeight: 1 }}>{card.value}</div>
              <div style={{ fontSize: 11, color: 'var(--os-text-3)', marginTop: 3 }}>{card.sub}</div>
            </div>
          )
        })}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 260 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--os-text-3)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search overdue invoices…"
            style={{ width: '100%', padding: '8px 12px 8px 30px', borderRadius: 8, border: '1px solid var(--os-border)', background: 'var(--os-surface-0)', color: 'var(--os-text-1)', fontSize: 12, outline: 'none', boxSizing: 'border-box' as const }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[{ k: 'days', label: 'By Days Overdue' }, { k: 'amount', label: 'By Amount' }].map(opt => (
            <button key={opt.k} onClick={() => setSort(opt.k as any)} style={{
              padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer',
              border: `1px solid ${sort === opt.k ? '#579bfc' : 'var(--os-border)'}`,
              background: sort === opt.k ? '#579bfc20' : 'transparent',
              color: sort === opt.k ? '#579bfc' : 'var(--os-text-2)',
            }}>{opt.label}</button>
          ))}
        </div>
      </div>

      {/* Cards */}
      {isLoading && <div style={{ padding: 40, textAlign: 'center' as const, color: 'var(--os-text-3)' }}>Loading…</div>}

      {!isLoading && filtered.length === 0 && (
        <div style={{ padding: 60, textAlign: 'center' as const, background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12 }}>
          <CheckCircle2 size={40} color="#00c875" style={{ margin: '0 auto 14px', display: 'block' }} />
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--os-text-1)', marginBottom: 6 }}>Collections clear!</div>
          <div style={{ fontSize: 12, color: 'var(--os-text-3)' }}>No overdue invoices — great work.</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
        {filtered.map(({ inv, days }) => (
          <CollectionCard
            key={inv.id} inv={inv} days={days} followUps={followUps}
            onMarkPaid={id => paidMut.mutate(id)}
            onFollowUp={addFollowUp}
          />
        ))}
      </div>
    </div>
  )
}
