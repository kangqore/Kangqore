import { useState } from 'react'
import { Building2 } from 'lucide-react'

const ACCENT = '#10B981'

type VendorStatus = 'ACTIVE' | 'RENEWAL_DUE' | 'EXPIRED'

interface Vendor {
  name: string
  category: string
  annualSpend: number
  renewalDate: string
  status: VendorStatus
  owner: string
  notes: string
}

const VENDORS: Vendor[] = [
  { name: 'AWS',                category: 'Cloud Infrastructure', annualSpend: 180000, renewalDate: 'Jan 2027', status: 'ACTIVE',      owner: 'Infrastructure', notes: 'Primary cloud provider — compute, storage, RDS' },
  { name: 'GitHub Enterprise', category: 'Developer Tools',      annualSpend: 28000,  renewalDate: 'Sep 2025', status: 'RENEWAL_DUE', owner: 'Engineering',    notes: 'Source control — 95 seats; renewal negotiation in progress' },
  { name: 'Datadog',           category: 'Observability',        annualSpend: 42000,  renewalDate: 'Nov 2025', status: 'RENEWAL_DUE', owner: 'Platform',       notes: '2-year renewal proposed — pending CFO approval APR-0044' },
  { name: 'CleanPro Services', category: 'Facilities',           annualSpend: 18000,  renewalDate: 'Mar 2026', status: 'ACTIVE',      owner: 'Facilities',     notes: 'Office cleaning — weekly cadence, 3 locations' },
  { name: 'Salesforce',        category: 'CRM',                  annualSpend: 96000,  renewalDate: 'Jun 2026', status: 'RENEWAL_DUE', owner: 'Sales',          notes: 'Sales Cloud + Service Cloud — 40 seats; reviewing alternatives' },
  { name: 'Stripe',            category: 'Payments',             annualSpend: 12000,  renewalDate: 'Rolling',  status: 'ACTIVE',      owner: 'Finance',        notes: 'Transaction processing — volume-based, no fixed term' },
  { name: 'Twilio',            category: 'Communications',       annualSpend: 8000,   renewalDate: 'Rolling',  status: 'ACTIVE',      owner: 'Engineering',    notes: 'SMS and voice API — KIMMP notification layer' },
  { name: 'Figma',             category: 'Design',               annualSpend: 6000,   renewalDate: 'Aug 2025', status: 'RENEWAL_DUE', owner: 'Design',         notes: 'Organisation plan — 12 editors; auto-renew unless cancelled' },
]

const STATUS_COLOR: Record<VendorStatus, string> = {
  ACTIVE:      '#10B981',
  RENEWAL_DUE: '#F59E0B',
  EXPIRED:     '#EF4444',
}

const STATUS_LABEL: Record<VendorStatus, string> = {
  ACTIVE:      'Active',
  RENEWAL_DUE: 'Renewal Due',
  EXPIRED:     'Expired',
}

export function FinanceVendors() {
  const [filter, setFilter] = useState<'ALL' | VendorStatus>('ALL')

  const totalSpend   = VENDORS.reduce((a, v) => a + v.annualSpend, 0)
  const renewalDue   = VENDORS.filter(v => v.status === 'RENEWAL_DUE').length
  const expiring90   = VENDORS.filter(v => v.status === 'RENEWAL_DUE').length // same set in this dataset

  const visible = filter === 'ALL' ? VENDORS : VENDORS.filter(v => v.status === filter)

  const tabs: Array<{ key: typeof filter; label: string }> = [
    { key: 'ALL',         label: 'All' },
    { key: 'ACTIVE',      label: 'Active' },
    { key: 'RENEWAL_DUE', label: 'Renewal Due' },
    { key: 'EXPIRED',     label: 'Expired' },
  ]

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${ACCENT}22` }}>
          <Building2 size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Vendors</h1>
          <p className="text-sm text-[var(--os-text-2)]">Supplier contracts, annual spend, and renewal tracking</p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Vendors',    value: String(VENDORS.length), sub: 'active suppliers'     },
          { label: 'Annual Spend',     value: `£${(totalSpend / 1000).toFixed(0)}K`, sub: 'committed per year' },
          { label: 'Renewals Due',     value: String(renewalDue),      sub: 'action required'      },
          { label: 'Expiring <90d',    value: String(expiring90),      sub: 'need decision'        },
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

      {/* Vendor List */}
      <div className="space-y-2">
        {visible.map(v => {
          const sc = STATUS_COLOR[v.status]
          return (
            <div
              key={v.name}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{v.name}</p>
                <p className="text-xs text-[var(--os-text-2)] truncate">{v.notes}</p>
              </div>
              <div className="text-right w-32 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">Category</p>
                <p className="text-xs text-[var(--os-text-1)]">{v.category}</p>
              </div>
              <div className="text-right w-24 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">Owner</p>
                <p className="text-xs text-[var(--os-text-1)]">{v.owner}</p>
              </div>
              <div className="text-right w-24 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">Annual Spend</p>
                <p className="text-sm font-bold text-white">
                  £{(v.annualSpend / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="text-right w-24 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">Renewal</p>
                <p className="text-xs text-[var(--os-text-1)]">{v.renewalDate}</p>
              </div>
              <div className="w-28 text-right shrink-0">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: `${sc}22`, color: sc }}
                >
                  {STATUS_LABEL[v.status]}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
