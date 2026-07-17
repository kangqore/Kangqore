import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { useFinanceStore } from '../store'
import type { BudgetCategory } from '../types'
import { PieChart, Plus, CheckCircle2, XCircle, Clock, TrendingUp } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface FinancialKPIs {
  totalBudget: number
  totalSpend: number
  [k: string]: any
}

type ReqStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

interface BudgetRequest {
  id: string
  department: string
  category: BudgetCategory
  amount: number
  reason: string
  status: ReqStatus
  requestedAt: string
  decidedAt?: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (n: number) => `₹${n >= 100000 ? (n / 100000).toFixed(1) + 'L' : n >= 1000 ? (n / 1000).toFixed(0) + 'K' : n.toLocaleString()}`
const fmtFull = (n: number) => `₹${n.toLocaleString('en-IN')}`

const CATEGORIES: BudgetCategory[] = ['Personnel', 'Software', 'Infrastructure', 'Marketing', 'Travel', 'Legal', 'Other']

const CAT_COLOR: Record<BudgetCategory, string> = {
  Personnel:      '#579bfc',
  Software:       '#7c3aed',
  Infrastructure: '#00c875',
  Marketing:      '#fdab3d',
  Travel:         '#06b6d4',
  Legal:          '#e2445c',
  Other:          '#9898c0',
}

const STATUS_CFG: Record<ReqStatus, { label: string; color: string; bg: string; Icon: React.FC<any> }> = {
  PENDING:  { label: 'Pending',  color: '#fdab3d', bg: '#fdab3d20', Icon: Clock        },
  APPROVED: { label: 'Approved', color: '#00c875', bg: '#00c87520', Icon: CheckCircle2 },
  REJECTED: { label: 'Rejected', color: '#e2445c', bg: '#e2445c20', Icon: XCircle      },
}

let _reqId = 1
const newId = () => `req-${_reqId++}-${Date.now()}`

// ── Budget request modal ───────────────────────────────────────────────────────

function RequestModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (r: Omit<BudgetRequest, 'id' | 'status' | 'requestedAt'>) => void }) {
  const [form, setForm] = useState({ department: '', category: 'Software' as BudgetCategory, amount: '', reason: '' })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const submit = () => {
    if (!form.department || !form.amount || !form.reason) return
    onSubmit({ department: form.department, category: form.category, amount: parseFloat(form.amount), reason: form.reason })
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#00000080', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 16, padding: 28, width: 420, maxWidth: '95vw' }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--os-text-1)', marginBottom: 20 }}>Request Budget</div>
        {[
          { k: 'department', label: 'Department *', placeholder: 'e.g. Engineering' },
          { k: 'amount', label: 'Amount (₹) *', placeholder: '50000' },
          { k: 'reason', label: 'Reason / Justification *', placeholder: 'Describe why this budget is needed' },
        ].map(f => (
          <div key={f.k} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-text-2)', display: 'block', marginBottom: 5 }}>{f.label}</label>
            <input placeholder={f.placeholder} value={(form as any)[f.k]} onChange={e => set(f.k, e.target.value)}
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
          <button onClick={submit} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', background: '#579bfc', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>Submit Request</button>
        </div>
      </div>
    </div>
  )
}

// ── Request row ───────────────────────────────────────────────────────────────

function RequestRow({ req, onApprove, onReject }: { req: BudgetRequest; onApprove: (id: string) => void; onReject: (id: string) => void }) {
  const { label, color, bg, Icon } = STATUS_CFG[req.status]
  const catColor = CAT_COLOR[req.category]
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '3px 1fr 90px 90px 80px 170px',
      alignItems: 'center', borderBottom: '1px solid var(--os-border)', minHeight: 50,
    }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--os-surface-0)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <div style={{ alignSelf: 'stretch', background: catColor, borderRadius: '2px 0 0 2px' }} />
      <div style={{ padding: '0 14px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--os-text-1)' }}>{req.department}</div>
        <div style={{ fontSize: 11, color: 'var(--os-text-3)', marginTop: 1 }}>{req.reason}</div>
      </div>
      <div>
        <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 7px', borderRadius: 6, background: catColor + '20', color: catColor }}>{req.category}</span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-text-1)' }}>{fmt(req.amount)}</div>
      <div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.06em', padding: '3px 8px', borderRadius: 10, background: bg, color }}>
          <Icon size={10} />{label}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 6, paddingRight: 14, justifyContent: 'flex-end' }}>
        {req.status === 'PENDING' && (
          <>
            <button onClick={() => onApprove(req.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, padding: '4px 9px', borderRadius: 6, background: '#00c87518', color: '#00c875', border: '1px solid #00c87530', cursor: 'pointer' }}>
              <CheckCircle2 size={10} /> Approve
            </button>
            <button onClick={() => onReject(req.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, padding: '4px 9px', borderRadius: 6, background: '#e2445c18', color: '#e2445c', border: '1px solid #e2445c30', cursor: 'pointer' }}>
              <XCircle size={10} /> Reject
            </button>
          </>
        )}
        {req.status !== 'PENDING' && (
          <span style={{ fontSize: 10, color: 'var(--os-text-3)' }}>{req.decidedAt ? new Date(req.decidedAt).toLocaleDateString() : '—'}</span>
        )}
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function BudgetTracker() {
  const { budgetLines } = useFinanceStore()
  const [catFilter, setCat] = useState<BudgetCategory | 'all'>('all')
  const [showRequest, setShowRequest] = useState(false)
  const [requests, setRequests] = useState<BudgetRequest[]>([])

  const { data: kpis, isLoading } = useQuery<FinancialKPIs>({
    queryKey: ['financial-kpis'],
    queryFn: () => api.get('/admin/financial-kpis').then(r => r.data),
    staleTime: 120_000,
  })

  const visible = budgetLines.filter(b => catFilter === 'all' || b.category === catFilter)
  const localAllocated = visible.reduce((s, b) => s + b.allocated, 0)
  const localSpent     = visible.reduce((s, b) => s + b.spent, 0)
  const localCommitted = visible.reduce((s, b) => s + b.committed, 0)

  const totalAllocated = kpis?.totalBudget ?? localAllocated
  const totalSpent     = kpis?.totalSpend  ?? localSpent
  const totalCommitted = localCommitted
  const totalRemaining = totalAllocated - totalSpent - totalCommitted
  const usedPct = totalAllocated ? Math.round(((totalSpent + totalCommitted) / totalAllocated) * 100) : 0
  const healthColor = usedPct > 90 ? '#e2445c' : usedPct > 75 ? '#fdab3d' : '#00c875'
  const healthLabel = usedPct > 90 ? 'Over Budget Risk' : usedPct > 75 ? 'Watch' : 'Healthy'

  const catRollup = CATEGORIES.map(cat => {
    const lines = budgetLines.filter(b => b.category === cat)
    return { cat, allocated: lines.reduce((s, b) => s + b.allocated, 0), spent: lines.reduce((s, b) => s + b.spent, 0) }
  }).filter(c => c.allocated > 0)

  const pendingRequests = requests.filter(r => r.status === 'PENDING')
  const pendingAmount = pendingRequests.reduce((s, r) => s + r.amount, 0)

  const addRequest = (r: Omit<BudgetRequest, 'id' | 'status' | 'requestedAt'>) => {
    setRequests(prev => [...prev, { ...r, id: newId(), status: 'PENDING', requestedAt: new Date().toISOString() }])
  }
  const approveReq = (id: string) => setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED', decidedAt: new Date().toISOString() } : r))
  const rejectReq  = (id: string) => setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED', decidedAt: new Date().toISOString() } : r))

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--os-text-1)' }}>Budget Tracker</div>
          <div style={{ fontSize: 11, color: 'var(--os-text-3)', marginTop: 2 }}>FY 2026 · spend vs allocation</div>
        </div>
        <button onClick={() => setShowRequest(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', background: '#579bfc', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>
          <Plus size={14} /> Request Budget
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Total Budget',  value: isLoading ? '…' : fmt(totalAllocated), color: '#579bfc' },
          { label: 'Spent',         value: isLoading ? '…' : fmt(totalSpent),     color: '#e2445c' },
          { label: 'Committed',     value: isLoading ? '…' : fmt(totalCommitted), color: '#fdab3d' },
          { label: 'Remaining',     value: isLoading ? '…' : fmt(Math.max(0, totalRemaining)), color: '#00c875' },
        ].map(c => (
          <div key={c.label} style={{ flex: 1, background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, padding: '16px 18px', borderTop: `3px solid ${c.color}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: 'var(--os-text-2)', marginBottom: 8 }}>{c.label}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--os-text-1)', lineHeight: 1 }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Budget health bar */}
      <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, padding: '18px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PieChart size={14} color={healthColor} />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-text-1)' }}>Budget Consumption</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 10, background: healthColor + '20', color: healthColor }}>{healthLabel}</span>
        </div>

        {/* Big utilization bar */}
        <div style={{ height: 14, borderRadius: 7, background: 'var(--os-surface-0)', overflow: 'hidden', display: 'flex', marginBottom: 10 }}>
          <div style={{ height: '100%', width: `${Math.min(100, totalAllocated ? (totalSpent / totalAllocated) * 100 : 0)}%`, background: '#e2445c', transition: 'width .4s ease' }} />
          <div style={{ height: '100%', width: `${Math.min(100 - (totalAllocated ? (totalSpent / totalAllocated) * 100 : 0), totalAllocated ? (totalCommitted / totalAllocated) * 100 : 0)}%`, background: '#fdab3d', transition: 'width .4s ease' }} />
        </div>

        <div style={{ display: 'flex', gap: 20, fontSize: 11, flexWrap: 'wrap' as const }}>
          {[
            { color: '#e2445c', label: 'Spent',     val: fmt(totalSpent) },
            { color: '#fdab3d', label: 'Committed', val: fmt(totalCommitted) },
            { color: '#00c875', label: 'Remaining', val: fmt(Math.max(0, totalRemaining)) },
          ].map(s => (
            <span key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--os-text-3)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
              {s.label} <strong style={{ color: 'var(--os-text-1)' }}>{s.val}</strong>
            </span>
          ))}
          <span style={{ marginLeft: 'auto', fontWeight: 700, color: healthColor }}>{usedPct}% utilized</span>
        </div>

        {/* Per-category bars */}
        {catRollup.length > 0 && (
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: 'var(--os-text-3)', marginBottom: 4 }}>By Category</div>
            {catRollup.map(c => {
              const pct = Math.min(100, Math.round((c.spent / c.allocated) * 100))
              const accent = pct > 90 ? '#e2445c' : pct > 75 ? '#fdab3d' : '#00c875'
              return (
                <div key={c.cat} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: CAT_COLOR[c.cat], flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: 'var(--os-text-2)', width: 110, flexShrink: 0 }}>{c.cat}</span>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--os-surface-0)' }}>
                    <div style={{ height: '100%', borderRadius: 3, width: `${pct}%`, background: accent, transition: 'width .4s' }} />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--os-text-2)', width: 120, textAlign: 'right' as const, flexShrink: 0 }}>{fmt(c.spent)} / {fmt(c.allocated)}</span>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 8, background: accent + '20', color: accent, width: 44, textAlign: 'center' as const, flexShrink: 0 }}>{pct}%</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Pending budget requests banner */}
      {pendingRequests.length > 0 && (
        <div style={{ background: '#fdab3d10', border: '1px solid #fdab3d30', borderRadius: 10, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Clock size={16} color="#fdab3d" />
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fdab3d' }}>{pendingRequests.length} budget request{pendingRequests.length > 1 ? 's' : ''} awaiting approval</div>
            <div style={{ fontSize: 11, color: 'var(--os-text-3)' }}>Total requested: {fmtFull(pendingAmount)}</div>
          </div>
        </div>
      )}

      {/* Category filter tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, marginBottom: 16 }}>
        {(['all', ...CATEGORIES] as (BudgetCategory | 'all')[]).map(c => (
          <button key={c} onClick={() => setCat(c)} style={{
            padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer',
            background: catFilter === c ? (c === 'all' ? '#579bfc' : CAT_COLOR[c as BudgetCategory]) : 'transparent',
            color: catFilter === c ? '#fff' : 'var(--os-text-2)',
            border: `1px solid ${catFilter === c ? (c === 'all' ? '#579bfc' : CAT_COLOR[c as BudgetCategory]) : 'var(--os-border)'}`,
          }}>
            {c === 'all' ? 'All Categories' : c}
          </button>
        ))}
      </div>

      {/* Budget lines table */}
      <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--os-border)', background: 'var(--os-surface-0)' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--os-text-1)' }}>Budget Lines</span>
          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 8, background: 'var(--os-surface-0)', color: 'var(--os-text-3)', border: '1px solid var(--os-border)' }}>{visible.length} lines</span>
        </div>

        {visible.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center' as const, color: 'var(--os-text-3)', fontSize: 12 }}>No budget lines for this category.</div>
        ) : (
          <div style={{ overflowX: 'auto' as const }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--os-border)' }}>
                  {['Category', 'Department', 'Description', 'Allocated', 'Spent', 'Committed', 'Remaining', 'Used %'].map(h => (
                    <th key={h} style={{ textAlign: 'left' as const, padding: '10px 14px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: 'var(--os-text-3)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map(b => {
                  const remaining = b.allocated - b.spent - b.committed
                  const pct = Math.round((b.spent / b.allocated) * 100)
                  const accent = pct > 90 ? '#e2445c' : pct > 75 ? '#fdab3d' : '#00c875'
                  return (
                    <tr key={b.id} style={{ borderBottom: '1px solid var(--os-border)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--os-surface-0)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: CAT_COLOR[b.category] }} />
                          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-text-2)' }}>{b.category}</span>
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: 11, color: 'var(--os-text-2)' }}>{b.department}</td>
                      <td style={{ padding: '10px 14px', maxWidth: 200 }}>
                        <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--os-text-1)', fontSize: 12 }}>{b.description}</span>
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--os-text-1)' }}>{fmt(b.allocated)}</td>
                      <td style={{ padding: '10px 14px', color: 'var(--os-text-2)' }}>{fmt(b.spent)}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 600, color: '#fdab3d' }}>{fmt(b.committed)}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: remaining < 0 ? '#e2445c' : '#00c875' }}>{fmt(remaining)}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 60, height: 6, borderRadius: 3, background: 'var(--os-surface-0)', flexShrink: 0 }}>
                            <div style={{ height: '100%', borderRadius: 3, width: `${Math.min(100, pct)}%`, background: accent }} />
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 800, color: accent }}>{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Budget requests queue */}
      {requests.length > 0 && (
        <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--os-border)', background: 'var(--os-surface-0)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={14} color="var(--os-text-2)" />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--os-text-1)' }}>Budget Requests</span>
            {pendingRequests.length > 0 && (
              <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 8, background: '#fdab3d20', color: '#fdab3d', marginLeft: 4 }}>{pendingRequests.length} pending</span>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '3px 1fr 90px 90px 80px 170px', background: 'var(--os-surface-0)', padding: '8px 0', borderBottom: '1px solid var(--os-border)' }}>
            <div />
            {['Department / Reason', 'Category', 'Amount', 'Status', 'Actions'].map((h, i) => (
              <div key={h} style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: 'var(--os-text-3)', paddingLeft: i === 0 ? 14 : 0, textAlign: i === 4 ? 'right' as const : 'left' as const, paddingRight: i === 4 ? 14 : 0 }}>{h}</div>
            ))}
          </div>
          {requests.map(req => <RequestRow key={req.id} req={req} onApprove={approveReq} onReject={rejectReq} />)}
        </div>
      )}

      {showRequest && <RequestModal onClose={() => setShowRequest(false)} onSubmit={addRequest} />}
    </div>
  )
}
