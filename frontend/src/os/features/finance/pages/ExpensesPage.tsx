import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { api } from '@lib/api'
import { Receipt, Plus, CheckCircle2, XCircle, Clock, RefreshCw, Search, TrendingDown } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

type ExpenseStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
type Category = 'Personnel' | 'Software' | 'Infrastructure' | 'Marketing' | 'Travel' | 'Legal' | 'Other'

interface Expense {
  id: string
  title: string
  category: Category
  amount: number
  currency: string
  expenseDate: string
  status: ExpenseStatus
  notes: string | null
  projectId: string | null
  submittedBy: string
  approvedBy: string | null
  approvedAt: string | null
  createdAt: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (n: number) => `₹${n >= 100000 ? (n / 100000).toFixed(1) + 'L' : n >= 1000 ? (n / 1000).toFixed(0) + 'K' : n.toLocaleString()}`
const fmtFull = (n: number) => `₹${n.toLocaleString('en-IN')}`
const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

const CATEGORIES: Category[] = ['Personnel', 'Software', 'Infrastructure', 'Marketing', 'Travel', 'Legal', 'Other']

const CAT_COLOR: Record<Category, string> = {
  Personnel:      '#579bfc',
  Software:       '#7c3aed',
  Infrastructure: '#00c875',
  Marketing:      '#fdab3d',
  Travel:         '#06b6d4',
  Legal:          '#e2445c',
  Other:          '#9898c0',
}

const STATUS_CFG: Record<ExpenseStatus, { label: string; color: string; bg: string; Icon: React.FC<any> }> = {
  PENDING:  { label: 'Pending',  color: '#fdab3d', bg: '#fdab3d20', Icon: Clock       },
  APPROVED: { label: 'Approved', color: '#00c875', bg: '#00c87520', Icon: CheckCircle2 },
  REJECTED: { label: 'Rejected', color: '#e2445c', bg: '#e2445c20', Icon: XCircle      },
}

// ── Submit form ───────────────────────────────────────────────────────────────

function SubmitModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ title: '', category: 'Other' as Category, amount: '', expenseDate: '', notes: '' })
  const [saving, setSaving] = useState(false)
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    if (!form.title || !form.amount || !form.expenseDate) { toast.error('Fill required fields'); return }
    setSaving(true)
    try {
      await api.post('/expenses', { ...form, amount: parseFloat(form.amount), currency: 'INR' })
      toast.success('Expense submitted'); onCreated(); onClose()
    } catch { toast.error('Failed to submit') }
    finally { setSaving(false) }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#00000080', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 16, padding: 28, width: 440, maxWidth: '95vw' }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--os-text-1)', marginBottom: 20 }}>Submit Expense</div>

        {[
          { k: 'title', label: 'Description *', placeholder: 'e.g. AWS November bill' },
          { k: 'amount', label: 'Amount (₹) *', placeholder: '5000' },
          { k: 'expenseDate', label: 'Date *', placeholder: '', type: 'date' },
          { k: 'notes', label: 'Notes', placeholder: 'Optional context' },
        ].map(f => (
          <div key={f.k} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-text-2)', display: 'block', marginBottom: 5 }}>{f.label}</label>
            <input type={f.type ?? 'text'} placeholder={f.placeholder} value={(form as any)[f.k]}
              onChange={e => set(f.k, e.target.value)}
              style={{ width: '100%', background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: 'var(--os-text-1)', outline: 'none', boxSizing: 'border-box' as const }}
            />
          </div>
        ))}

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-text-2)', display: 'block', marginBottom: 5 }}>Category</label>
          <select value={form.category} onChange={e => set('category', e.target.value)}
            style={{ width: '100%', background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: 'var(--os-text-1)', outline: 'none' }}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid var(--os-border)', background: 'transparent', color: 'var(--os-text-2)', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', background: '#fdab3d', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>
            {saving ? 'Submitting…' : 'Submit Expense'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Expense row ───────────────────────────────────────────────────────────────

function ExpenseRow({ exp, onApprove, onReject }: { exp: Expense; onApprove: (id: string) => void; onReject: (id: string) => void }) {
  const { label, color, bg, Icon } = STATUS_CFG[exp.status]
  const catColor = CAT_COLOR[exp.category] ?? '#9898c0'

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '3px 1fr 100px 110px 90px 90px 180px',
      alignItems: 'center', borderBottom: '1px solid var(--os-border)', minHeight: 50,
    }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--os-surface-0)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <div style={{ alignSelf: 'stretch', background: catColor, borderRadius: '2px 0 0 2px' }} />
      <div style={{ padding: '0 14px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--os-text-1)' }}>{exp.title}</div>
        <div style={{ fontSize: 11, color: 'var(--os-text-3)' }}>{exp.notes ?? '—'}</div>
      </div>
      <div>
        <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 7px', borderRadius: 6, background: catColor + '20', color: catColor }}>
          {exp.category}
        </span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-text-1)' }}>{fmtFull(exp.amount)}</div>
      <div style={{ fontSize: 11, color: 'var(--os-text-2)' }}>{fmtDate(exp.expenseDate)}</div>
      <div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.06em',
          padding: '3px 8px', borderRadius: 10, background: bg, color,
        }}>
          <Icon size={10} />{label}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 6, paddingRight: 14, justifyContent: 'flex-end' }}>
        {exp.status === 'PENDING' && (
          <>
            <button onClick={() => onApprove(exp.id)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700,
              textTransform: 'uppercase' as const, letterSpacing: '.06em', padding: '4px 9px', borderRadius: 6,
              background: '#00c87518', color: '#00c875', border: '1px solid #00c87530', cursor: 'pointer',
            }}><CheckCircle2 size={10} /> Approve</button>
            <button onClick={() => onReject(exp.id)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700,
              textTransform: 'uppercase' as const, letterSpacing: '.06em', padding: '4px 9px', borderRadius: 6,
              background: '#e2445c18', color: '#e2445c', border: '1px solid #e2445c30', cursor: 'pointer',
            }}><XCircle size={10} /> Reject</button>
          </>
        )}
        {exp.status !== 'PENDING' && (
          <span style={{ fontSize: 10, color: 'var(--os-text-3)' }}>
            {exp.status === 'APPROVED' ? (exp.approvedAt ? fmtDate(exp.approvedAt) : 'Approved') : 'Rejected'}
          </span>
        )}
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function ExpensesPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState<Category | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<ExpenseStatus | 'all'>('all')
  const [showSubmit, setShowSubmit] = useState(false)

  const { data, isLoading } = useQuery<{ expenses: any[] }>({
    queryKey: ['expenses'],
    queryFn: () => api.get('/expenses').then(r => r.data),
    staleTime: 60_000,
  })

  const statusMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ExpenseStatus }) => api.patch(`/expenses/${id}/status`, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['expenses'] }); toast.success('Expense updated') },
    onError: () => toast.error('Update failed'),
  })

  const expenses: Expense[] = (data?.expenses ?? []).map((e: any) => ({ ...e, amount: Number(e.amount) }))

  const filtered = expenses.filter(e => {
    if (statusFilter !== 'all' && e.status !== statusFilter) return false
    if (catFilter !== 'all' && e.category !== catFilter) return false
    if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const pending = expenses.filter(e => e.status === 'PENDING')
  const approved = expenses.filter(e => e.status === 'APPROVED')
  const totalApproved = approved.reduce((s, e) => s + e.amount, 0)
  const totalPending = pending.reduce((s, e) => s + e.amount, 0)

  const catRollup = CATEGORIES.map(c => ({
    cat: c, total: approved.filter(e => e.category === c).reduce((s, e) => s + e.amount, 0),
  })).filter(r => r.total > 0).sort((a, b) => b.total - a.total)

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--os-text-1)' }}>Expenses</div>
          <div style={{ fontSize: 11, color: 'var(--os-text-3)', marginTop: 2 }}>
            {fmt(totalApproved)} approved this period
            {totalPending > 0 && <span style={{ color: '#fdab3d', fontWeight: 700 }}> · {fmt(totalPending)} pending approval</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => qc.invalidateQueries({ queryKey: ['expenses'] })}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid var(--os-border)', background: 'transparent', color: 'var(--os-text-2)', cursor: 'pointer', fontSize: 12 }}>
            <RefreshCw size={13} /> Refresh
          </button>
          <button onClick={() => setShowSubmit(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', background: '#fdab3d', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>
            <Plus size={14} /> Submit Expense
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Total Approved', value: fmt(totalApproved), sub: `${approved.length} items`, color: '#00c875' },
          { label: 'Pending Approval', value: fmt(totalPending), sub: `${pending.length} items`, color: '#fdab3d' },
          { label: 'This Month', value: fmt(approved.filter(e => new Date(e.expenseDate).getMonth() === new Date().getMonth()).reduce((s, e) => s + e.amount, 0)), sub: 'approved spend', color: '#579bfc' },
          { label: 'Avg per Item', value: fmt(approved.length ? totalApproved / approved.length : 0), sub: 'per expense', color: '#7c3aed' },
        ].map(card => (
          <div key={card.label} style={{ flex: 1, background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, padding: '16px 18px', borderTop: `3px solid ${card.color}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: 'var(--os-text-2)', marginBottom: 8 }}>{card.label}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--os-text-1)', lineHeight: 1 }}>{card.value}</div>
            <div style={{ fontSize: 11, color: 'var(--os-text-3)', marginTop: 3 }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      {catRollup.length > 0 && (
        <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, padding: '16px 18px', marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: 'var(--os-text-2)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <TrendingDown size={13} /> Spend by Category
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
            {catRollup.map(r => (
              <div key={r.cat} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 8, background: 'var(--os-surface-0)', border: '1px solid var(--os-border)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: CAT_COLOR[r.cat as Category] }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-text-2)' }}>{r.cat}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--os-text-1)' }}>{fmt(r.total)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending queue spotlight */}
      {pending.length > 0 && (
        <div style={{ background: '#fdab3d10', border: '1px solid #fdab3d30', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Clock size={18} color="#fdab3d" />
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fdab3d' }}>{pending.length} expense{pending.length > 1 ? 's' : ''} awaiting approval</div>
            <div style={{ fontSize: 11, color: 'var(--os-text-3)' }}>Total: {fmtFull(totalPending)} — review and approve or reject below</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' as const, alignItems: 'center' }}>
        <div style={{ position: 'relative', minWidth: 200, flex: 1, maxWidth: 260 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--os-text-3)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search expenses…"
            style={{ width: '100%', padding: '8px 12px 8px 30px', borderRadius: 8, border: '1px solid var(--os-border)', background: 'var(--os-surface-0)', color: 'var(--os-text-1)', fontSize: 12, outline: 'none', boxSizing: 'border-box' as const }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['all', 'PENDING', 'APPROVED', 'REJECTED'] as (ExpenseStatus | 'all')[]).map(s => {
            const active = statusFilter === s
            const color = s === 'all' ? '#579bfc' : STATUS_CFG[s as ExpenseStatus].color
            return (
              <button key={s} onClick={() => setStatusFilter(s)} style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                border: `1px solid ${active ? color : 'var(--os-border)'}`,
                background: active ? color + '20' : 'transparent',
                color: active ? color : 'var(--os-text-2)',
              }}>
                {s === 'all' ? 'All' : STATUS_CFG[s as ExpenseStatus].label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '3px 1fr 100px 110px 90px 90px 180px',
          background: 'var(--os-surface-0)', padding: '10px 0', borderBottom: '1px solid var(--os-border)',
        }}>
          <div />
          {['Description', 'Category', 'Amount', 'Date', 'Status', 'Actions'].map((h, i) => (
            <div key={h} style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: 'var(--os-text-3)', padding: i === 5 ? '0 14px 0 0' : '0 14px 0 0', textAlign: i === 5 ? 'right' as const : 'left' as const }}>
              {i === 0 ? <span style={{ paddingLeft: 14 }}>{h}</span> : h}
            </div>
          ))}
        </div>

        {isLoading && <div style={{ padding: 40, textAlign: 'center' as const, color: 'var(--os-text-3)' }}>Loading…</div>}

        {!isLoading && filtered.length === 0 && (
          <div style={{ padding: 48, textAlign: 'center' as const }}>
            <Receipt size={32} color="var(--os-text-3)" style={{ margin: '0 auto 12px', display: 'block' }} />
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--os-text-2)' }}>No expenses yet</div>
            <div style={{ fontSize: 11, color: 'var(--os-text-3)', marginTop: 4 }}>Submit your first expense claim above</div>
          </div>
        )}

        {filtered.map(exp => (
          <ExpenseRow key={exp.id} exp={exp}
            onApprove={id => statusMut.mutate({ id, status: 'APPROVED' })}
            onReject={id => statusMut.mutate({ id, status: 'REJECTED' })}
          />
        ))}
      </div>

      {showSubmit && <SubmitModal onClose={() => setShowSubmit(false)} onCreated={() => qc.invalidateQueries({ queryKey: ['expenses'] })} />}
    </div>
  )
}
