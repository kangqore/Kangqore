import { useState } from 'react'
import { ShieldAlert } from 'lucide-react'

const ACCENT = '#EF4444'

type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
type IncidentStatus   = 'OPEN' | 'INVESTIGATING' | 'CONTAINED' | 'CLOSED'
type IncidentType     = 'Phishing' | 'Unauthorized Access' | 'Data Anomaly' | 'Social Engineering' | 'Malware'

interface Incident {
  id: string
  title: string
  type: IncidentType
  severity: IncidentSeverity
  status: IncidentStatus
  date: string
  assignee: string
  summary: string
}

const INCIDENTS: Incident[] = [
  {
    id:       'INC-0031',
    title:    'Targeted phishing campaign — finance team',
    type:     'Phishing',
    severity: 'HIGH',
    status:   'CONTAINED',
    date:     '18 Jun 2026',
    assignee: 'Tom Walsh',
    summary:  '6 emails received impersonating CFO; 1 link clicked (no credentials entered). Contained via O365 ATP. User notified and session revoked.',
  },
  {
    id:       'INC-0030',
    title:    'Suspicious login from unrecognised geolocation — engineering',
    type:     'Unauthorized Access',
    severity: 'HIGH',
    status:   'INVESTIGATING',
    date:     '20 Jun 2026',
    assignee: 'Priya Nair',
    summary:  'Login detected from Romania for user @daniel.park. MFA was passed — possible MFA fatigue attack. Session revoked; user credentials rotated.',
  },
  {
    id:       'INC-0029',
    title:    'Bulk data export anomaly — customer records',
    type:     'Data Anomaly',
    severity: 'MEDIUM',
    status:   'INVESTIGATING',
    date:     '19 Jun 2026',
    assignee: 'Lucy Brennan',
    summary:  'DLP alert triggered: 14K customer records exported by service account at 02:14 UTC. No authorised pipeline scheduled. Investigation ongoing.',
  },
  {
    id:       'INC-0028',
    title:    'Social engineering attempt — IT helpdesk impersonation',
    type:     'Social Engineering',
    severity: 'MEDIUM',
    status:   'CLOSED',
    date:     '12 Jun 2026',
    assignee: 'Raj Patel',
    summary:  'Caller impersonated IT helpdesk requesting admin credentials. Staff member refused and reported. No data compromised.',
  },
  {
    id:       'INC-0027',
    title:    'Malware detected on contractor endpoint',
    type:     'Malware',
    severity: 'HIGH',
    status:   'CLOSED',
    date:     '7 Jun 2026',
    assignee: 'Tom Walsh',
    summary:  'Infostealter trojan detected on contractor MacBook. Device quarantined immediately. No lateral movement detected. Contractor onboarding policy updated.',
  },
  {
    id:       'INC-0026',
    title:    'Failed brute-force attempt on admin portal',
    type:     'Unauthorized Access',
    severity: 'LOW',
    status:   'CLOSED',
    date:     '2 Jun 2026',
    assignee: 'Aisha Malik',
    summary:  '847 failed login attempts over 4 minutes from single IP. IP blocked at WAF. No accounts compromised. Rate limiting rules tightened.',
  },
]

const SEV_COLOR: Record<IncidentSeverity, string> = {
  CRITICAL: '#EF4444',
  HIGH:     '#F97316',
  MEDIUM:   '#F59E0B',
  LOW:      '#60A5FA',
}

const STATUS_COLOR: Record<IncidentStatus, string> = {
  OPEN:          '#EF4444',
  INVESTIGATING: '#F59E0B',
  CONTAINED:     '#8B5CF6',
  CLOSED:        '#10B981',
}

const TYPE_COLOR: Record<IncidentType, string> = {
  Phishing:             '#EC4899',
  'Unauthorized Access': '#EF4444',
  'Data Anomaly':        '#F97316',
  'Social Engineering':  '#8B5CF6',
  Malware:              '#EF4444',
}

export function SecurityIncidents() {
  const [filter, setFilter] = useState<'ALL' | IncidentStatus>('ALL')

  const openCount = INCIDENTS.filter(i => i.status === 'OPEN' || i.status === 'INVESTIGATING').length
  const mtd       = INCIDENTS.filter(i => i.date.includes('Jun 2026')).length

  const visible = filter === 'ALL' ? INCIDENTS : INCIDENTS.filter(i => i.status === filter)

  const tabs: Array<{ key: typeof filter; label: string }> = [
    { key: 'ALL',          label: 'All' },
    { key: 'OPEN',         label: 'Open' },
    { key: 'INVESTIGATING', label: 'Investigating' },
    { key: 'CONTAINED',    label: 'Contained' },
    { key: 'CLOSED',       label: 'Closed' },
  ]

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${ACCENT}22` }}>
          <ShieldAlert size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Security Incidents</h1>
          <p className="text-sm text-[var(--os-text-2)]">Active and historical security incidents — detection, response, and closure</p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Incidents', value: String(INCIDENTS.length), sub: 'on record'           },
          { label: 'Open / Active',   value: String(openCount),         sub: 'need attention'      },
          { label: 'MTD',             value: String(mtd),               sub: 'incidents this month' },
          { label: 'MTTI',            value: '2.4h',                    sub: 'mean time to investigate' },
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

      {/* Incident Cards */}
      <div className="space-y-3">
        {visible.map(inc => {
          const sc  = SEV_COLOR[inc.severity]
          const stc = STATUS_COLOR[inc.status]
          const tc  = TYPE_COLOR[inc.type]
          return (
            <div
              key={inc.id}
              className="p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-xs text-[var(--os-text-2)] font-mono">{inc.id}</p>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: `${tc}22`, color: tc }}
                    >
                      {inc.type}
                    </span>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: `${sc}22`, color: sc }}
                    >
                      {inc.severity}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white mb-1">{inc.title}</p>
                  <p className="text-xs text-[var(--os-text-2)] leading-relaxed">{inc.summary}</p>
                </div>
                <div className="text-right shrink-0 space-y-1.5">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full block"
                    style={{ background: `${stc}22`, color: stc }}
                  >
                    {inc.status.charAt(0) + inc.status.slice(1).toLowerCase()}
                  </span>
                  <p className="text-xs text-[var(--os-text-2)]">{inc.date}</p>
                  <p className="text-xs text-[var(--os-text-2)]">{inc.assignee}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
