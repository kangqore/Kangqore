import { useState } from 'react'
import { Receipt } from 'lucide-react'

const ACCENT = '#10B981'

type InvoiceStatus = 'OVERDUE' | 'PENDING' | 'PAID'

interface Invoice {
  id: string
  client: string
  amount: number
  status: InvoiceStatus
  dueLabel: string
  issued: string
}

const INVOICES: Invoice[] = [
  { id: 'INV-0291', client: 'Acme Corp',    amount: 42000, status: 'OVERDUE', dueLabel: '28 days overdue', issued: '14 May 2026' },
  { id: 'INV-0290', client: 'GlobalTech',   amount: 18000, status: 'PENDING', dueLabel: 'Due today',       issued: '23 Jun 2026' },
  { id: 'INV-0289', client: 'Vertex Ltd',   amount: 12000, status: 'PAID',    dueLabel: 'Paid 10 Jun',     issued: '27 May 2026' },
  { id: 'INV-0288', client: 'Acme Corp',    amount: 67000, status: 'PAID',    dueLabel: 'Paid 2 Jun',      issued: '19 May 2026' },
  { id: 'INV-0287', client: 'NovaCorp',     amount: 27000, status: 'OVERDUE', dueLabel: '14 days overdue', issued: '30 May 2026' },
  { id: 'INV-0286', client: 'Acme Corp',    amount: 15000, status: 'PENDING', dueLabel: 'Due 30 Jun',      issued: '16 Jun 2026' },
  { id: 'INV-0285', client: 'MegaSoft',     amount: 33000, status: 'OVERDUE', dueLabel: '7 days overdue',  issued: '9 Jun 2026'  },
  { id: 'INV-0284', client: 'TechBase',     amount: 8000,  status: 'PAID',    dueLabel: 'Paid 18 Jun',     issued: '4 Jun 2026'  },
]

const STATUS_COLOR: Record<InvoiceStatus, string> = {
  OVERDUE: '#EF4444',
  PENDING: '#F59E0B',
  PAID:    '#10B981',
}

const STATUS_LABEL: Record<InvoiceStatus, string> = {
  OVERDUE: 'Overdue',
  PENDING: 'Pending',
  PAID:    'Paid',
}

function fmt(n: number) {
  return `£${(n / 1000).toFixed(0)}K`
}

export function FinanceInvoices() {
  const [filter, setFilter] = useState<'ALL' | InvoiceStatus>('ALL')

  const totalAR    = INVOICES.filter(i => i.status !== 'PAID').reduce((a, i) => a + i.amount, 0)
  const overdue    = INVOICES.filter(i => i.status === 'OVERDUE')
  const overdueAmt = overdue.reduce((a, i) => a + i.amount, 0)
  const paidMTD    = INVOICES.filter(i => i.status === 'PAID').reduce((a, i) => a + i.amount, 0)

  const visible = filter === 'ALL' ? INVOICES : INVOICES.filter(i => i.status === filter)

  const tabs: Array<{ key: typeof filter; label: string }> = [
    { key: 'ALL',     label: 'All' },
    { key: 'OVERDUE', label: 'Overdue' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'PAID',    label: 'Paid' },
  ]

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${ACCENT}22` }}>
          <Receipt size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Invoices</h1>
          <p className="text-sm text-[var(--os-text-2)]">Accounts receivable — outstanding and settled invoices</p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total AR',         value: fmt(totalAR),       sub: 'outstanding'       },
          { label: 'Overdue',          value: `${overdue.length}`, sub: `${fmt(overdueAmt)} at risk` },
          { label: 'Paid MTD',         value: fmt(paidMTD),        sub: 'collected this month' },
          { label: 'Avg Days to Pay',  value: '28d',               sub: 'rolling 90-day avg'  },
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

      {/* Invoice List */}
      <div className="space-y-2">
        {visible.map(inv => {
          const color = STATUS_COLOR[inv.status]
          return (
            <div
              key={inv.id}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{inv.id}</p>
                <p className="text-xs text-[var(--os-text-2)]">{inv.client}</p>
              </div>
              <div className="text-right w-20 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">Issued</p>
                <p className="text-xs text-[var(--os-text-1)]">{inv.issued}</p>
              </div>
              <div className="text-right w-36 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">Due</p>
                <p className="text-xs font-medium" style={{ color }}>{inv.dueLabel}</p>
              </div>
              <div className="text-right w-20 shrink-0">
                <p className="text-sm font-bold text-white">{fmt(inv.amount)}</p>
              </div>
              <div className="w-24 text-right shrink-0">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: `${color}22`, color }}
                >
                  {STATUS_LABEL[inv.status]}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
