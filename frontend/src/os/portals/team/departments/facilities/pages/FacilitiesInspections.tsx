import { ClipboardCheck } from 'lucide-react'

const ACCENT = '#F97316'

type InspectionStatus = 'OVERDUE' | 'DUE_SOON' | 'SCHEDULED' | 'COMPLETED'

interface Inspection {
  id: string
  title: string
  type: string
  frequency: string
  lastCompleted: string
  nextDue: string
  owner: string
  status: InspectionStatus
  notes: string
}

const INSPECTIONS: Inspection[] = [
  {
    id: 'INS-001',
    title: 'Fire Safety Inspection',
    type: 'Fire',
    frequency: 'Annual',
    lastCompleted: '08 Jun 2025',
    nextDue: '08 Jun 2026',
    owner: 'Facilities Manager',
    status: 'OVERDUE',
    notes: 'CRITICAL — 15 days overdue. FPA-approved inspector must be booked immediately.',
  },
  {
    id: 'INS-002',
    title: 'Fire Extinguisher Check',
    type: 'Fire',
    frequency: 'Monthly',
    lastCompleted: '08 Jun 2026',
    nextDue: '08 Jul 2026',
    owner: 'Facilities Team',
    status: 'SCHEDULED',
    notes: 'Monthly visual check. All extinguishers in date. Powder units replaced Jan 2026.',
  },
  {
    id: 'INS-003',
    title: 'Health & Safety Walkthrough',
    type: 'H&S',
    frequency: 'Quarterly',
    lastCompleted: '15 Mar 2026',
    nextDue: '15 Jun 2026',
    owner: 'H&S Officer',
    status: 'DUE_SOON',
    notes: 'Q2 walkthrough overdue by 1 week. Schedule for 25 Jun with department heads.',
  },
  {
    id: 'INS-004',
    title: 'Electrical PAT Testing',
    type: 'Electrical',
    frequency: 'Annual',
    lastCompleted: '10 Jan 2026',
    nextDue: '10 Jan 2027',
    owner: 'PrimeFix Maintenance',
    status: 'COMPLETED',
    notes: 'Annual PAT completed Jan 2026. 3 appliances failed — replaced. Certificate on file.',
  },
  {
    id: 'INS-005',
    title: 'Lift / Elevator (LOLER)',
    type: 'Lift',
    frequency: 'Annual',
    lastCompleted: '22 Aug 2025',
    nextDue: '22 Aug 2026',
    owner: 'IOEE Engineer',
    status: 'SCHEDULED',
    notes: 'LOLER statutory inspection. Book accredited engineer — currently unscheduled.',
  },
  {
    id: 'INS-006',
    title: 'Legionella Risk Assessment',
    type: 'Water',
    frequency: 'Quarterly',
    lastCompleted: '14 Apr 2026',
    nextDue: '14 Jul 2026',
    owner: 'AquaServe',
    status: 'DUE_SOON',
    notes: 'Quarterly water temperature checks and L8 assessment. Book AquaServe for 1 Jul.',
  },
  {
    id: 'INS-007',
    title: 'Building Insurance Survey',
    type: 'Insurance',
    frequency: 'Annual',
    lastCompleted: '03 Feb 2026',
    nextDue: '03 Feb 2027',
    owner: 'Legal / Finance',
    status: 'COMPLETED',
    notes: 'Insurer survey completed Feb 2026. Rebuild value confirmed at £4.2M. No issues raised.',
  },
  {
    id: 'INS-008',
    title: 'Air Quality Monitoring',
    type: 'Environmental',
    frequency: 'Annual',
    lastCompleted: '03 Jul 2025',
    nextDue: '03 Jul 2026',
    owner: 'Facilities Manager',
    status: 'DUE_SOON',
    notes: 'Annual CO2 and particulate monitoring required under EPC regulations. Book specialist.',
  },
]

const STATUS_COLOR: Record<InspectionStatus, string> = {
  OVERDUE:   '#EF4444',
  DUE_SOON:  '#F59E0B',
  SCHEDULED: '#2564ea',
  COMPLETED: '#10B981',
}

const STATUS_LABEL: Record<InspectionStatus, string> = {
  OVERDUE:   'OVERDUE',
  DUE_SOON:  'Due Soon',
  SCHEDULED: 'Scheduled',
  COMPLETED: 'Completed',
}

const TYPE_COLOR: Record<string, string> = {
  Fire:        '#EF4444',
  'H&S':       '#F97316',
  Electrical:  '#F59E0B',
  Lift:        '#8B5CF6',
  Water:       '#3B82F6',
  Insurance:   '#10B981',
  Environmental:'#06B6D4',
}

export function FacilitiesInspections() {
  const dueThisMonth = INSPECTIONS.filter(i => i.status === 'DUE_SOON').length
  const overdue      = INSPECTIONS.filter(i => i.status === 'OVERDUE').length
  const completedYTD = INSPECTIONS.filter(i => i.status === 'COMPLETED').length

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <ClipboardCheck size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Inspections</h1>
          <p className="text-sm text-[var(--os-text-2)]">Statutory, regulatory & internal inspections — all sites</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Due This Month', value: String(dueThisMonth), color: '#F59E0B' },
          { label: 'Overdue',        value: String(overdue),      color: '#EF4444', sub: 'CRITICAL' },
          { label: 'Completed YTD',  value: String(completedYTD), color: '#10B981' },
          { label: 'Next Due',       value: '3 Jul',              color: '#2564ea' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
            {'sub' in k && <p className="text-xs font-bold mt-0.5" style={{ color: '#EF4444' }}>{(k as any).sub}</p>}
          </div>
        ))}
      </div>

      {/* OVERDUE Banner */}
      {overdue > 0 && (
        <div className="p-4 rounded-2xl border border-red-500/40 bg-red-500/10 flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0 animate-pulse" />
          <div>
            <p className="text-sm font-bold text-red-400">CRITICAL — Fire Safety Inspection is 15 days overdue</p>
            <p className="text-xs text-[var(--os-text-2)] mt-0.5">Failure to conduct this inspection is a legal and insurance liability. Book immediately via FPA-approved contractor.</p>
          </div>
        </div>
      )}

      {/* Inspections List — sorted: OVERDUE → DUE_SOON → SCHEDULED → COMPLETED */}
      <div className="space-y-2">
        {[...INSPECTIONS]
          .sort((a, b) => {
            const order: Record<InspectionStatus, number> = { OVERDUE: 0, DUE_SOON: 1, SCHEDULED: 2, COMPLETED: 3 }
            return order[a.status] - order[b.status]
          })
          .map(i => {
            const sc = STATUS_COLOR[i.status]
            const tc = TYPE_COLOR[i.type] ?? '#94A3B8'
            return (
              <div
                key={i.id}
                className="p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
                style={i.status === 'OVERDUE' ? { borderColor: '#EF444430' } : {}}
              >
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${tc}22`, color: tc }}>
                        {i.type}
                      </span>
                      <span className="text-xs text-[var(--os-text-2)]">{i.frequency}</span>
                    </div>
                    <p className="text-sm font-semibold text-white">{i.title}</p>
                    <p className="text-xs text-[var(--os-text-2)] mt-0.5">Owner: {i.owner}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-[var(--os-text-2)]">Last Done</p>
                      <p className="text-xs text-[var(--os-text-1)]">{i.lastCompleted}</p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-xs text-[var(--os-text-2)]">Next Due</p>
                      <p className="text-xs font-semibold" style={{ color: i.status === 'OVERDUE' ? '#EF4444' : i.status === 'DUE_SOON' ? '#F59E0B' : '#94A3B8' }}>
                        {i.nextDue}
                      </p>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap" style={{ background: `${sc}22`, color: sc }}>
                      {STATUS_LABEL[i.status]}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[var(--os-text-2)] mt-2">{i.notes}</p>
              </div>
            )
          })}
      </div>
    </div>
  )
}
