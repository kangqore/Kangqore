import { useState } from 'react'
import { Calendar } from 'lucide-react'

const ACCENT = '#F59E0B'

type DeadlineStatus = 'UPCOMING' | 'DUE_SOON' | 'OVERDUE' | 'COMPLETED'

interface ComplianceDeadline {
  id: string
  date: string
  description: string
  framework: string
  owner: string
  status: DeadlineStatus
}

const DEADLINES: ComplianceDeadline[] = [
  { id: 'CAL-001', date: '30 Jun 2026', description: 'PAYE payroll year-end submission',            framework: 'HMRC / UK',              owner: 'Finance',     status: 'DUE_SOON'  },
  { id: 'CAL-002', date: '03 Jul 2026', description: 'Air quality inspection — London HQ',          framework: 'HSE / UK',               owner: 'Facilities',  status: 'DUE_SOON'  },
  { id: 'CAL-003', date: '31 Jul 2026', description: 'ICO annual data protection fee renewal',      framework: 'ICO / UK GDPR',          owner: 'Legal',       status: 'UPCOMING'  },
  { id: 'CAL-004', date: '31 Jul 2026', description: 'VAT return Q2 filing',                        framework: 'HMRC / UK',              owner: 'Finance',     status: 'UPCOMING'  },
  { id: 'CAL-005', date: '12 Aug 2026', description: 'Companies House confirmation statement',      framework: 'Companies House / UK',   owner: 'Legal',       status: 'UPCOMING'  },
  { id: 'CAL-006', date: '15 Aug 2026', description: 'Lift/elevator annual safety certification',   framework: 'HSE / LOLER / UK',       owner: 'Facilities',  status: 'UPCOMING'  },
  { id: 'CAL-007', date: '01 Sep 2026', description: 'GDPR Data Processing Agreement annual review',framework: 'ICO / UK GDPR',          owner: 'Legal',       status: 'UPCOMING'  },
  { id: 'CAL-008', date: '15 Sep 2026', description: 'Cyber Essentials Plus recertification',       framework: 'NCSC / UK',              owner: 'Security',    status: 'UPCOMING'  },
  { id: 'CAL-009', date: '30 Sep 2026', description: 'ISO 27001 internal audit — scope review',     framework: 'ISO 27001',              owner: 'Security',    status: 'UPCOMING'  },
  { id: 'CAL-010', date: '31 Oct 2026', description: 'Corporation Tax self-assessment payment',     framework: 'HMRC / UK',              owner: 'Finance',     status: 'UPCOMING'  },
  // Completed items
  { id: 'CAL-C01', date: '28 Feb 2026', description: 'Statutory accounts filing (FY 2025)',         framework: 'Companies House / UK',   owner: 'Finance',     status: 'COMPLETED' },
  { id: 'CAL-C02', date: '31 Mar 2026', description: 'VAT return Q4 2025 filing',                   framework: 'HMRC / UK',              owner: 'Finance',     status: 'COMPLETED' },
  { id: 'CAL-C03', date: '05 Apr 2026', description: 'P60s issued to all employees',                framework: 'HMRC / UK',              owner: 'HR',          status: 'COMPLETED' },
  { id: 'CAL-C04', date: '19 May 2026', description: 'Annual fire safety training sign-off',        framework: 'HSE / UK',               owner: 'Facilities',  status: 'COMPLETED' },
  { id: 'CAL-C05', date: '31 May 2026', description: 'VAT return Q1 2026 filing',                   framework: 'HMRC / UK',              owner: 'Finance',     status: 'COMPLETED' },
]

const STATUS_COLOR: Record<DeadlineStatus, string> = {
  UPCOMING:  '#2564ea',
  DUE_SOON:  '#F59E0B',
  OVERDUE:   '#EF4444',
  COMPLETED: '#10B981',
}

const STATUS_LABEL: Record<DeadlineStatus, string> = {
  UPCOMING:  'Upcoming',
  DUE_SOON:  'Due Soon',
  OVERDUE:   'Overdue',
  COMPLETED: 'Completed',
}

export function LegalCalendar() {
  const [filter, setFilter] = useState<'ALL' | DeadlineStatus>('ALL')

  const upcoming     = DEADLINES.filter(d => d.status === 'UPCOMING' || d.status === 'DUE_SOON').length
  const dueThisMonth = DEADLINES.filter(d => d.status === 'DUE_SOON').length
  const overdue      = DEADLINES.filter(d => d.status === 'OVERDUE').length
  const completedYTD = DEADLINES.filter(d => d.status === 'COMPLETED').length

  const tabs: Array<{ key: typeof filter; label: string }> = [
    { key: 'ALL',       label: 'All' },
    { key: 'DUE_SOON',  label: 'Due Soon' },
    { key: 'UPCOMING',  label: 'Upcoming' },
    { key: 'OVERDUE',   label: 'Overdue' },
    { key: 'COMPLETED', label: 'Completed' },
  ]

  const visible = filter === 'ALL'
    ? DEADLINES.filter(d => d.status !== 'COMPLETED')
    : DEADLINES.filter(d => d.status === filter)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Calendar size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Compliance Calendar</h1>
          <p className="text-sm text-[var(--os-text-2)]">Statutory filings, certifications & regulatory deadlines</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Upcoming',        value: String(upcoming),     color: '#2564ea' },
          { label: 'Due This Month',  value: String(dueThisMonth), color: '#F59E0B' },
          { label: 'Overdue',         value: String(overdue),      color: overdue > 0 ? '#EF4444' : '#10B981' },
          { label: 'Completed YTD',   value: String(completedYTD), color: '#10B981' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === t.key
                ? 'bg-amber-600 text-white'
                : 'bg-slate-800/60 text-[var(--os-text-2)] hover:text-[var(--os-text-1)] border border-white/10'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Timeline list */}
      <div className="space-y-2">
        {visible.map(d => {
          const sc = STATUS_COLOR[d.status]
          return (
            <div
              key={d.id}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
            >
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: sc }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{d.description}</p>
                <p className="text-xs text-[var(--os-text-2)] mt-0.5">{d.framework}</p>
              </div>
              <div className="text-right w-24 shrink-0 hidden sm:block">
                <p className="text-xs text-[var(--os-text-2)]">Owner</p>
                <p className="text-xs text-[var(--os-text-1)]">{d.owner}</p>
              </div>
              <div className="text-right w-28 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">Deadline</p>
                <p className="text-sm font-semibold text-white">{d.date}</p>
              </div>
              <div className="w-28 text-right shrink-0">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>
                  {STATUS_LABEL[d.status]}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
