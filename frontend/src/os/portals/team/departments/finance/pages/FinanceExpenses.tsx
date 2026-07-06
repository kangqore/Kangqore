import { useState } from 'react'
import { CreditCard } from 'lucide-react'

const ACCENT = '#10B981'

type ExpenseStatus = 'SUBMITTED' | 'APPROVED' | 'FLAGGED' | 'REJECTED'

interface Expense {
  id: string
  person: string
  amount: number
  category: string
  status: ExpenseStatus
  submitted: string
  description: string
}

const EXPENSES: Expense[] = [
  { id: 'EXP-0118', person: 'Sarah Chen',    amount: 1840,  category: 'Travel',    status: 'SUBMITTED', submitted: '20 Jun 2026', description: 'Client visit — New York flights + hotel' },
  { id: 'EXP-0117', person: 'James Okafor',  amount: 3200,  category: 'Software',  status: 'APPROVED',  submitted: '18 Jun 2026', description: 'Annual Notion licence (team plan)' },
  { id: 'EXP-0116', person: 'Priya Nair',    amount: 7800,  category: 'Equipment', status: 'FLAGGED',   submitted: '17 Jun 2026', description: 'MacBook Pro M4 — exceeds £5K policy limit' },
  { id: 'EXP-0115', person: 'Tom Walsh',     amount: 420,   category: 'Meals',     status: 'APPROVED',  submitted: '16 Jun 2026', description: 'Team dinner — Q2 close celebration' },
  { id: 'EXP-0114', person: 'Aisha Malik',   amount: 2600,  category: 'Travel',    status: 'SUBMITTED', submitted: '14 Jun 2026', description: 'Conference registration + travel — FinTech Summit' },
  { id: 'EXP-0113', person: 'Daniel Park',   amount: 940,   category: 'Software',  status: 'SUBMITTED', submitted: '11 Jun 2026', description: 'Figma team seats — 6-month renewal' },
  { id: 'EXP-0112', person: 'Lucy Brennan',  amount: 520,   category: 'Equipment', status: 'FLAGGED',   submitted: '9 Jun 2026',  description: 'Dual monitor stand — personal use flag raised' },
  { id: 'EXP-0111', person: 'Raj Patel',     amount: 1280,  category: 'Travel',    status: 'REJECTED',  submitted: '5 Jun 2026',  description: 'Personal travel incorrectly submitted' },
]

const STATUS_COLOR: Record<ExpenseStatus, string> = {
  SUBMITTED: '#60A5FA',
  APPROVED:  '#10B981',
  FLAGGED:   '#EF4444',
  REJECTED:  '#6B7280',
}

const STATUS_LABEL: Record<ExpenseStatus, string> = {
  SUBMITTED: 'Submitted',
  APPROVED:  'Approved',
  FLAGGED:   'Flagged',
  REJECTED:  'Rejected',
}

const CATEGORY_COLOR: Record<string, string> = {
  Travel:    '#8B5CF6',
  Software:  '#3B82F6',
  Equipment: '#F59E0B',
  Meals:     '#10B981',
}

export function FinanceExpenses() {
  const [filter, setFilter] = useState<'ALL' | ExpenseStatus>('ALL')

  const pending    = EXPENSES.filter(e => e.status === 'SUBMITTED')
  const pendingAmt = pending.reduce((a, e) => a + e.amount, 0)
  const approvedAmt = EXPENSES.filter(e => e.status === 'APPROVED').reduce((a, e) => a + e.amount, 0)
  const flagged    = EXPENSES.filter(e => e.status === 'FLAGGED').length
  const total      = EXPENSES.reduce((a, e) => a + e.amount, 0)

  const visible = filter === 'ALL' ? EXPENSES : EXPENSES.filter(e => e.status === filter)

  const tabs: Array<{ key: typeof filter; label: string }> = [
    { key: 'ALL',       label: 'All' },
    { key: 'SUBMITTED', label: 'Pending' },
    { key: 'APPROVED',  label: 'Approved' },
    { key: 'FLAGGED',   label: 'Flagged' },
    { key: 'REJECTED',  label: 'Rejected' },
  ]

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${ACCENT}22` }}>
          <CreditCard size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Expenses</h1>
          <p className="text-sm text-[var(--os-text-2)]">Employee expense reports — review, approve, and flag submissions</p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Submitted', value: `£${(total / 1000).toFixed(1)}K`,       sub: 'this month'       },
          { label: 'Pending',         value: `${pending.length}`,                     sub: `£${(pendingAmt / 1000).toFixed(1)}K awaiting` },
          { label: 'Approved',        value: `£${(approvedAmt / 1000).toFixed(1)}K`, sub: 'processed'        },
          { label: 'Flagged',         value: String(flagged),                          sub: 'need review'      },
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
        {visible.map(exp => {
          const sc = STATUS_COLOR[exp.status]
          const cc = CATEGORY_COLOR[exp.category] ?? '#94A3B8'
          return (
            <div
              key={exp.id}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white">{exp.id}</p>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: `${cc}22`, color: cc }}
                  >
                    {exp.category}
                  </span>
                </div>
                <p className="text-xs text-[var(--os-text-2)] mt-0.5 truncate">{exp.description}</p>
              </div>
              <div className="text-right w-28 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">Submitted by</p>
                <p className="text-xs text-[var(--os-text-1)]">{exp.person}</p>
              </div>
              <div className="text-right w-28 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">Date</p>
                <p className="text-xs text-[var(--os-text-1)]">{exp.submitted}</p>
              </div>
              <div className="text-right w-20 shrink-0">
                <p className="text-sm font-bold text-white">£{exp.amount.toLocaleString()}</p>
              </div>
              <div className="w-24 text-right shrink-0">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: `${sc}22`, color: sc }}
                >
                  {STATUS_LABEL[exp.status]}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
