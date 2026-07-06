import { Store } from 'lucide-react'

const ACCENT = '#F97316'

interface Vendor {
  id: string
  name: string
  category: string
  annualSpend: number
  contractExpiry: string
  sla: string
  lastService: string
  status: 'ACTIVE' | 'RENEWAL_DUE' | 'UNDER_REVIEW'
}

const VENDORS: Vendor[] = [
  { id: 'VND-001', name: 'CleanPro Services',     category: 'Cleaning',          annualSpend: 18000, contractExpiry: '31 Mar 2027', sla: '24h response',  lastService: '20 Jun 2026', status: 'ACTIVE'      },
  { id: 'VND-002', name: 'PrimeFix Maintenance',  category: 'Electrical/Plumbing',annualSpend: 24000, contractExpiry: '30 Jun 2026', sla: '4h emergency',  lastService: '18 Jun 2026', status: 'RENEWAL_DUE' },
  { id: 'VND-003', name: 'SecureGuard Ltd',       category: 'Security',          annualSpend: 36000, contractExpiry: '31 Dec 2026', sla: '1h critical',   lastService: '22 Jun 2026', status: 'ACTIVE'      },
  { id: 'VND-004', name: 'GreenScapes Landscaping',category: 'Landscaping',      annualSpend: 8000,  contractExpiry: '28 Feb 2027', sla: '48h standard',  lastService: '01 Jun 2026', status: 'ACTIVE'      },
  { id: 'VND-005', name: 'VendingCo UK',          category: 'Vending',           annualSpend: 4000,  contractExpiry: '31 Mar 2026', sla: 'Next business day',lastService: '14 Jun 2026',status: 'RENEWAL_DUE' },
  { id: 'VND-006', name: 'AquaServe',             category: 'Water/Utilities',   annualSpend: 3000,  contractExpiry: '30 Sep 2026', sla: '8h response',   lastService: '10 Jun 2026', status: 'ACTIVE'      },
  { id: 'VND-007', name: 'AirTech HVAC Specialist',category: 'HVAC',             annualSpend: 15000, contractExpiry: '31 Jan 2027', sla: '4h emergency',  lastService: '29 Jun 2026', status: 'ACTIVE'      },
  { id: 'VND-008', name: 'PrintPro Solutions',    category: 'Print/Copy',        annualSpend: 6000,  contractExpiry: '30 Nov 2026', sla: 'Next business day',lastService: '04 Jun 2026',status: 'ACTIVE'      },
]

const STATUS_COLOR: Record<Vendor['status'], string> = {
  ACTIVE:       '#10B981',
  RENEWAL_DUE:  '#F59E0B',
  UNDER_REVIEW: '#EF4444',
}

const CAT_COLOR: Record<string, string> = {
  Cleaning:           '#06B6D4',
  'Electrical/Plumbing': '#F97316',
  Security:           '#EF4444',
  Landscaping:        '#10B981',
  Vending:            '#8B5CF6',
  'Water/Utilities':  '#3B82F6',
  HVAC:               '#14B8A6',
  'Print/Copy':       '#F59E0B',
}

function fmtSpend(n: number) {
  return `£${(n / 1000).toFixed(0)}K`
}

export function FacilitiesVendors() {
  const totalSpend   = VENDORS.reduce((a, v) => a + v.annualSpend, 0)
  const renewalDue   = VENDORS.filter(v => v.status === 'RENEWAL_DUE').length
  const avgSLALabel  = '4h'

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Store size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Vendor Directory</h1>
          <p className="text-sm text-[var(--os-text-2)]">All facilities service providers — contracts, spend & SLAs</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Vendors',   value: String(VENDORS.length), color: ACCENT    },
          { label: 'Annual Spend',     value: fmtSpend(totalSpend),   color: '#10B981' },
          { label: 'Renewals Due',     value: String(renewalDue),     color: '#F59E0B' },
          { label: 'Avg Response SLA', value: avgSLALabel,            color: '#06B6D4' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Vendor List */}
      <div className="space-y-2">
        {VENDORS.sort((a, b) => b.annualSpend - a.annualSpend).map(v => {
          const sc = STATUS_COLOR[v.status]
          const cc = CAT_COLOR[v.category] ?? '#94A3B8'
          return (
            <div
              key={v.id}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${cc}22`, color: cc }}>
                    {v.category}
                  </span>
                </div>
                <p className="text-sm font-semibold text-white">{v.name}</p>
                <p className="text-xs text-[var(--os-text-2)] mt-0.5">SLA: {v.sla} · Last service: {v.lastService}</p>
              </div>
              <div className="text-right w-20 shrink-0 hidden sm:block">
                <p className="text-xs text-[var(--os-text-2)]">Spend/yr</p>
                <p className="text-sm font-bold text-white">{fmtSpend(v.annualSpend)}</p>
              </div>
              <div className="text-right w-28 shrink-0 hidden md:block">
                <p className="text-xs text-[var(--os-text-2)]">Contract Expiry</p>
                <p className="text-xs font-semibold" style={{ color: v.status === 'RENEWAL_DUE' ? '#F59E0B' : '#94A3B8' }}>{v.contractExpiry}</p>
              </div>
              <div className="w-28 text-right shrink-0">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>
                  {v.status === 'RENEWAL_DUE' ? 'Renewal Due' : v.status.charAt(0) + v.status.slice(1).toLowerCase()}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Spend Summary */}
      <div className="p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
        <p className="text-sm font-semibold text-white mb-3">Annual Spend by Category</p>
        <div className="space-y-2">
          {VENDORS.sort((a, b) => b.annualSpend - a.annualSpend).map(v => {
            const pct = Math.round((v.annualSpend / totalSpend) * 100)
            const cc  = CAT_COLOR[v.category] ?? '#94A3B8'
            return (
              <div key={v.id} className="flex items-center gap-3">
                <p className="text-xs text-[var(--os-text-2)] w-36 shrink-0 truncate">{v.name}</p>
                <div className="flex-1 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: cc }} />
                </div>
                <p className="text-xs font-semibold text-[var(--os-text-1)] w-12 text-right shrink-0">{fmtSpend(v.annualSpend)}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
