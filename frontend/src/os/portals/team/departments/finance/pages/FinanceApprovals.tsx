import { useState } from 'react'
import { CheckSquare } from 'lucide-react'

const ACCENT = '#10B981'

type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

interface Approval {
  id: string
  type: string
  description: string
  amount: number
  requestor: string
  approver: string
  status: ApprovalStatus
  submitted: string
}

const APPROVALS: Approval[] = [
  { id: 'APR-0044', type: 'Invoice',         description: 'INV-0291 Acme Corp — Q2 services',          amount: 42000, requestor: 'Sarah Chen',   approver: 'CFO',           status: 'PENDING',  submitted: '20 Jun 2026' },
  { id: 'APR-0043', type: 'Purchase Order',  description: 'PO-0112 Server hardware refresh',            amount: 28000, requestor: 'James Okafor', approver: 'COO',           status: 'PENDING',  submitted: '19 Jun 2026' },
  { id: 'APR-0042', type: 'Budget Change',   description: 'Marketing Q3 budget uplift request',         amount: 30000, requestor: 'Priya Nair',   approver: 'CFO',           status: 'PENDING',  submitted: '18 Jun 2026' },
  { id: 'APR-0041', type: 'Vendor Contract', description: 'Datadog renewal — extended 2yr term',        amount: 84000, requestor: 'Tom Walsh',    approver: 'CFO + Legal',   status: 'PENDING',  submitted: '17 Jun 2026' },
  { id: 'APR-0040', type: 'Expense',         description: 'EXP-0116 MacBook Pro M4 — policy exception', amount: 7800,  requestor: 'Aisha Malik',  approver: 'Finance Lead',  status: 'PENDING',  submitted: '17 Jun 2026' },
  { id: 'APR-0039', type: 'Invoice',         description: 'INV-0288 Acme Corp — Q1 final settlement',  amount: 67000, requestor: 'Daniel Park',  approver: 'CFO',           status: 'APPROVED', submitted: '10 Jun 2026' },
  { id: 'APR-0038', type: 'Purchase Order',  description: 'PO-0109 Office furniture — 3 new hires',    amount: 6400,  requestor: 'Lucy Brennan', approver: 'Finance Lead',  status: 'APPROVED', submitted: '6 Jun 2026'  },
  { id: 'APR-0037', type: 'Expense',         description: 'EXP-0111 Personal travel — no business case', amount: 1280, requestor: 'Raj Patel',   approver: 'Finance Lead',  status: 'REJECTED', submitted: '5 Jun 2026'  },
]

const STATUS_COLOR: Record<ApprovalStatus, string> = {
  PENDING:  '#F59E0B',
  APPROVED: '#10B981',
  REJECTED: '#EF4444',
}

const TYPE_COLOR: Record<string, string> = {
  Invoice:         '#8B5CF6',
  'Purchase Order': '#3B82F6',
  'Budget Change':  '#F97316',
  'Vendor Contract': '#EC4899',
  Expense:         '#14B8A6',
}

export function FinanceApprovals() {
  const [filter, setFilter] = useState<'ALL' | ApprovalStatus>('ALL')

  const pending     = APPROVALS.filter(a => a.status === 'PENDING').length
  const approvedMTD = APPROVALS.filter(a => a.status === 'APPROVED').length
  const escalated   = 1

  const visible = filter === 'ALL' ? APPROVALS : APPROVALS.filter(a => a.status === filter)

  const tabs: Array<{ key: typeof filter; label: string }> = [
    { key: 'ALL',      label: 'All' },
    { key: 'PENDING',  label: 'Pending' },
    { key: 'APPROVED', label: 'Approved' },
    { key: 'REJECTED', label: 'Rejected' },
  ]

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${ACCENT}22` }}>
          <CheckSquare size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Approvals</h1>
          <p className="text-sm text-[var(--os-text-2)]">Financial approval workflows — invoices, POs, budgets, and contracts</p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending',          value: String(pending),     sub: 'awaiting action'     },
          { label: 'Avg Approval Time', value: '1.8d',             sub: 'rolling 30-day avg'  },
          { label: 'Approved MTD',     value: String(approvedMTD + 22), sub: 'this month'     },
          { label: 'Escalated',        value: String(escalated),   sub: 'past SLA threshold'  },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-xs text-[var(--os-text-2)] mb-1">{k.label}</p>
            <p className="text-2xl font-bold text-white">{k.value}</p>
            <p className="text-xs text-[var(--os-text-2)] mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              filter === t.key
                ? 'text-white'
                : 'text-[var(--os-text-2)] bg-slate-800/60 hover:bg-slate-700/60'
            }`}
            style={filter === t.key ? { background: ACCENT } : {}}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        {visible.map(appr => {
          const sc = STATUS_COLOR[appr.status]
          const tc = TYPE_COLOR[appr.type] ?? '#94A3B8'
          return (
            <div
              key={appr.id}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-white">{appr.id}</p>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: `${tc}22`, color: tc }}
                  >
                    {appr.type}
                  </span>
                </div>
                <p className="text-xs text-[var(--os-text-2)] truncate">{appr.description}</p>
              </div>
              <div className="text-right w-28 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">Requestor</p>
                <p className="text-xs text-[var(--os-text-1)]">{appr.requestor}</p>
              </div>
              <div className="text-right w-28 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">Approver</p>
                <p className="text-xs text-[var(--os-text-1)]">{appr.approver}</p>
              </div>
              <div className="text-right w-20 shrink-0">
                <p className="text-sm font-bold text-white">
                  £{appr.amount >= 1000 ? `${(appr.amount / 1000).toFixed(0)}K` : appr.amount}
                </p>
              </div>
              <div className="w-24 text-right shrink-0">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: `${sc}22`, color: sc }}
                >
                  {appr.status.charAt(0) + appr.status.slice(1).toLowerCase()}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
