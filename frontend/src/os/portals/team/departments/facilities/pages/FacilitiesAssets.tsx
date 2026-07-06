import { ClipboardList } from 'lucide-react'

const ACCENT = '#F97316'

type AssetStatus = 'ACTIVE' | 'SERVICE_OVERDUE' | 'CERT_DUE' | 'RETIRED'

interface FacilityAsset {
  id: string
  name: string
  category: string
  location: string
  lastServiced: string
  nextDue: string
  status: AssetStatus
  notes: string
}

const ASSETS: FacilityAsset[] = [
  { id: 'AST-001', name: 'HVAC Unit A',           category: 'HVAC',      location: 'Floor 1, LHQ',    lastServiced: 'Mar 2026',  nextDue: 'Jun 2026', status: 'SERVICE_OVERDUE', notes: '3 months overdue — filter replacement & annual service outstanding' },
  { id: 'AST-002', name: 'HVAC Unit B',           category: 'HVAC',      location: 'Floor 2, LHQ',    lastServiced: 'Nov 2025',  nextDue: 'May 2026', status: 'SERVICE_OVERDUE', notes: '6 months overdue — AirTech booked for 28 Jun' },
  { id: 'AST-003', name: 'Fire Alarm Panel',      category: 'Fire',      location: 'Reception, LHQ',  lastServiced: '08 Jun 2026',nextDue: 'Jul 2026', status: 'CERT_DUE',       notes: 'Monthly test due — last test was 15 days ago (overdue)' },
  { id: 'AST-004', name: 'Passenger Lift',        category: 'Lift',      location: 'Central, LHQ',   lastServiced: 'Aug 2025',  nextDue: 'Aug 2026', status: 'CERT_DUE',       notes: 'LOLER annual certification due August — book IOEE engineer' },
  { id: 'AST-005', name: 'Backup Generator',      category: 'Power',     location: 'Basement, LHQ',  lastServiced: 'Jan 2026',  nextDue: 'Jul 2026', status: 'ACTIVE',         notes: '6-monthly service — next test due July 2026' },
  { id: 'AST-006', name: 'CCTV System (×12 cams)',category: 'Security',  location: 'All sites',       lastServiced: 'May 2026',  nextDue: 'Nov 2026', status: 'ACTIVE',         notes: 'All cameras active. 1 camera offline at entrance — WO raised' },
  { id: 'AST-007', name: 'Access Control System', category: 'Security',  location: 'All doors, LHQ', lastServiced: 'Apr 2026',  nextDue: 'Oct 2026', status: 'ACTIVE',         notes: 'Firmware update applied Apr 2026. All readers healthy' },
  { id: 'AST-008', name: 'Kitchen Appliances',    category: 'Kitchen',   location: 'Floors 2–3, LHQ',lastServiced: 'Feb 2026',  nextDue: 'Aug 2026', status: 'ACTIVE',         notes: 'Annual PAT completed. All appliances compliant' },
]

const STATUS_COLOR: Record<AssetStatus, string> = {
  ACTIVE:          '#10B981',
  SERVICE_OVERDUE: '#EF4444',
  CERT_DUE:        '#F59E0B',
  RETIRED:         'var(--os-text-2)',
}

const STATUS_LABEL: Record<AssetStatus, string> = {
  ACTIVE:          'Active',
  SERVICE_OVERDUE: 'Service Overdue',
  CERT_DUE:        'Cert Due',
  RETIRED:         'Retired',
}

const CAT_COLOR: Record<string, string> = {
  HVAC:     '#06B6D4',
  Fire:     '#EF4444',
  Lift:     '#8B5CF6',
  Power:    '#F59E0B',
  Security: '#3B82F6',
  Kitchen:  '#10B981',
}

export function FacilitiesAssets() {
  const totalAssets   = 204
  const serviceOverdue = ASSETS.filter(a => a.status === 'SERVICE_OVERDUE').length
  const certDue       = ASSETS.filter(a => a.status === 'CERT_DUE').length
  const active        = totalAssets - serviceOverdue - certDue

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <ClipboardList size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Asset Register</h1>
          <p className="text-sm text-[var(--os-text-2)]">Critical facilities assets — service schedules, certifications & health</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Assets',    value: String(totalAssets),   color: ACCENT    },
          { label: 'Service Overdue', value: String(serviceOverdue),color: '#EF4444' },
          { label: 'Annual Cert Due', value: String(certDue),       color: '#F59E0B' },
          { label: 'Active',          value: String(active),        color: '#10B981' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Alert Banner */}
      <div className="p-4 rounded-2xl border border-red-500/30 bg-red-500/10 flex items-start gap-3">
        <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0 animate-pulse" />
        <div>
          <p className="text-sm font-semibold text-red-400">2 assets require immediate action</p>
          <p className="text-xs text-[var(--os-text-2)] mt-0.5">HVAC Unit A and B are overdue for service. Fire Alarm Panel monthly test is overdue.</p>
        </div>
      </div>

      {/* Asset List */}
      <div className="space-y-2">
        {ASSETS.map(a => {
          const sc = STATUS_COLOR[a.status]
          const cc = CAT_COLOR[a.category] ?? '#94A3B8'
          return (
            <div
              key={a.id}
              className="p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex items-start gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-xs font-mono text-[var(--os-text-2)]">{a.id}</p>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${cc}22`, color: cc }}>
                      {a.category}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white">{a.name}</p>
                  <p className="text-xs text-[var(--os-text-2)] mt-0.5">{a.location}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-[var(--os-text-2)]">Last Serviced</p>
                    <p className="text-xs text-[var(--os-text-1)]">{a.lastServiced}</p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-xs text-[var(--os-text-2)]">Next Due</p>
                    <p className="text-xs font-semibold" style={{ color: a.status !== 'ACTIVE' ? sc : '#94A3B8' }}>{a.nextDue}</p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap" style={{ background: `${sc}22`, color: sc }}>
                    {STATUS_LABEL[a.status]}
                  </span>
                </div>
              </div>
              <p className="text-xs text-[var(--os-text-2)] mt-2">{a.notes}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
