import { Key } from 'lucide-react'

const ACCENT = '#F97316'

type LeaseStatus = 'ACTIVE' | 'RENEWAL_ACTION_NEEDED' | 'EXPIRING' | 'ROLLING'

interface Lease {
  id: string
  property: string
  address: string
  category: string
  expires: string
  annualRent: number
  sqft: number | null
  status: LeaseStatus
  notes: string
}

const LEASES: Lease[] = [
  {
    id: 'LSE-001',
    property: 'London HQ',
    address: '1 Canada Square, Canary Wharf, London, E14 5AB',
    category: 'Office',
    expires: '30 Sep 2026',
    annualRent: 480000,
    sqft: 5200,
    status: 'RENEWAL_ACTION_NEEDED',
    notes: 'Lease expires in 3 months. Landlord negotiations must begin immediately. Legal to issue notice to renew under LTA 1954 by 1 Jul.',
  },
  {
    id: 'LSE-002',
    property: 'Manchester Office',
    address: 'Federation House, 2 Federation St, Manchester, M4 2AH',
    category: 'Office',
    expires: '31 Mar 2027',
    annualRent: 96000,
    sqft: 1100,
    status: 'ACTIVE',
    notes: '9 months remaining. Inside LTA 1954. Renewal expected on similar terms — no action required until Sep 2026.',
  },
  {
    id: 'LSE-003',
    property: 'Storage Unit A',
    address: 'Silvertown Self Storage, Unit 12, London, E16 3EZ',
    category: 'Storage',
    expires: 'Rolling monthly',
    annualRent: 4800,
    sqft: null,
    status: 'ROLLING',
    notes: 'Month-to-month basis. Under review — may vacate if remote kit scheme extends. 30 days notice to terminate.',
  },
  {
    id: 'LSE-004',
    property: 'Car Parking Contract',
    address: 'NCP Canary Wharf — 20 Churchill Place, London, E14',
    category: 'Parking',
    expires: '31 Jan 2027',
    annualRent: 14000,
    sqft: null,
    status: 'ACTIVE',
    notes: '24 reserved spaces for London HQ staff. Rate: £583/space/month. Next renewal at standard market rate.',
  },
  {
    id: 'LSE-005',
    property: 'Server Room Colocation',
    address: 'Equinix LD8, Powergate Business Park, London, W3 8UE',
    category: 'Data Centre',
    expires: '31 Dec 2026',
    annualRent: 36000,
    sqft: null,
    status: 'EXPIRING',
    notes: 'Half-rack colocation. Cloud migration project (IT) may eliminate need for renewal. Decision required by Aug 2026.',
  },
]

const STATUS_COLOR: Record<LeaseStatus, string> = {
  ACTIVE:                 '#10B981',
  RENEWAL_ACTION_NEEDED:  '#EF4444',
  EXPIRING:               '#F59E0B',
  ROLLING:                '#6B7280',
}

const STATUS_LABEL: Record<LeaseStatus, string> = {
  ACTIVE:                 'Active',
  RENEWAL_ACTION_NEEDED:  'Action Required',
  EXPIRING:               'Expiring',
  ROLLING:                'Rolling',
}

const CAT_COLOR: Record<string, string> = {
  Office:       '#2564ea',
  Storage:      '#8B5CF6',
  Parking:      '#F97316',
  'Data Centre':'#06B6D4',
}

function fmtRent(n: number) {
  if (n >= 1000) return `£${(n / 1000).toFixed(0)}K/yr`
  return `£${n}/yr`
}

export function FacilitiesLeases() {
  const totalRent     = LEASES.reduce((a, l) => a + l.annualRent, 0)
  const expiring12mo  = LEASES.filter(l => l.status === 'EXPIRING' || l.status === 'RENEWAL_ACTION_NEEDED').length
  const actionReq     = LEASES.filter(l => l.status === 'RENEWAL_ACTION_NEEDED').length

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Key size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Lease Register</h1>
          <p className="text-sm text-[var(--os-text-2)]">Property leases, parking contracts & data centre agreements</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Properties',      value: String(LEASES.length), color: ACCENT    },
          { label: 'Annual Rent',     value: `£${(totalRent / 1000).toFixed(0)}K`,  color: '#10B981' },
          { label: 'Expiring 12mo',   value: String(expiring12mo),  color: '#F59E0B' },
          { label: 'Action Required', value: String(actionReq),     color: '#EF4444' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Action Alert */}
      <div className="p-4 rounded-2xl border border-red-500/30 bg-red-500/10 flex items-start gap-3">
        <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0 animate-pulse" />
        <div>
          <p className="text-sm font-bold text-red-400">ACTION REQUIRED — London HQ lease expires 30 Sep 2026</p>
          <p className="text-xs text-[var(--os-text-2)] mt-0.5">Legal must issue a notice to renew under the Landlord and Tenant Act 1954 by 1 Jul 2026 to preserve statutory protection. Landlord negotiations should start immediately.</p>
        </div>
      </div>

      {/* Lease Cards */}
      <div className="space-y-3">
        {LEASES.map(l => {
          const sc = STATUS_COLOR[l.status]
          const cc = CAT_COLOR[l.category] ?? '#94A3B8'
          return (
            <div
              key={l.id}
              className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
              style={l.status === 'RENEWAL_ACTION_NEEDED' ? { borderColor: '#EF444430' } : {}}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${cc}22`, color: cc }}>
                      {l.category}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>
                      {STATUS_LABEL[l.status]}
                    </span>
                  </div>
                  <p className="text-base font-bold text-white">{l.property}</p>
                  <p className="text-xs text-[var(--os-text-2)] mt-0.5">{l.address}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-bold text-white">{fmtRent(l.annualRent)}</p>
                  {l.sqft && <p className="text-xs text-[var(--os-text-2)] mt-0.5">{l.sqft.toLocaleString()} sq ft</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs text-[var(--os-text-2)] mb-0.5">Lease Expires</p>
                  <p className="text-sm font-semibold" style={{ color: l.status === 'RENEWAL_ACTION_NEEDED' ? '#EF4444' : l.status === 'EXPIRING' ? '#F59E0B' : '#94A3B8' }}>
                    {l.expires}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--os-text-2)] mb-0.5">Annual Rent</p>
                  <p className="text-sm text-[var(--os-text-1)]">{fmtRent(l.annualRent)}</p>
                </div>
              </div>
              <div className="mt-3 p-2.5 rounded-xl bg-slate-800/50 border border-white/5">
                <p className="text-xs text-[var(--os-text-2)]">{l.notes}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
