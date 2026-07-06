import { useState } from 'react'
import { Shield } from 'lucide-react'

const ACCENT = '#EF4444'

type ControlStatus = 'PASSING' | 'FAILING' | 'EVIDENCE_NEEDED'
type Framework     = 'SOC 2' | 'ISO 27001'

interface Control {
  id: string
  description: string
  framework: Framework
  status: ControlStatus
  evidenceUploaded: boolean
  lastTested: string
  owner: string
}

const CONTROLS: Control[] = [
  { id: 'CC6.1',  description: 'Logical and physical access controls restrict unauthorised access',     framework: 'SOC 2',     status: 'PASSING',         evidenceUploaded: true,  lastTested: '1 Jun 2026',  owner: 'Tom Walsh'    },
  { id: 'CC6.2',  description: 'Prior to issuing credentials, users are registered and authorised',    framework: 'SOC 2',     status: 'PASSING',         evidenceUploaded: true,  lastTested: '1 Jun 2026',  owner: 'Lucy Brennan' },
  { id: 'CC7.1',  description: 'Vulnerabilities are identified and remediated within defined SLAs',    framework: 'SOC 2',     status: 'FAILING',         evidenceUploaded: false, lastTested: '1 Jun 2026',  owner: 'Priya Nair'   },
  { id: 'CC8.1',  description: 'Changes to infrastructure are controlled via change management',       framework: 'SOC 2',     status: 'PASSING',         evidenceUploaded: true,  lastTested: '15 May 2026', owner: 'Daniel Park'  },
  { id: 'CC9.1',  description: 'Business continuity and disaster recovery plans are documented',       framework: 'SOC 2',     status: 'EVIDENCE_NEEDED', evidenceUploaded: false, lastTested: '1 Mar 2026',  owner: 'Raj Patel'    },
  { id: 'A.8.2',  description: 'Information is classified in accordance with legal requirements',      framework: 'ISO 27001', status: 'PASSING',         evidenceUploaded: true,  lastTested: '1 Apr 2026',  owner: 'Aisha Malik'  },
  { id: 'A.9.1',  description: 'Access control policy documented and enforced',                       framework: 'ISO 27001', status: 'PASSING',         evidenceUploaded: true,  lastTested: '1 Apr 2026',  owner: 'Tom Walsh'    },
  { id: 'A.12.4', description: 'Event logging and monitoring procedures in place',                    framework: 'ISO 27001', status: 'FAILING',         evidenceUploaded: false, lastTested: '1 Jun 2026',  owner: 'Priya Nair'   },
  { id: 'A.16.1', description: 'Incident management responsibilities and procedures established',     framework: 'ISO 27001', status: 'PASSING',         evidenceUploaded: true,  lastTested: '1 May 2026',  owner: 'Sarah Chen'   },
  { id: 'A.18.1', description: 'Compliance with legal, statutory, regulatory and contractual reqts',  framework: 'ISO 27001', status: 'FAILING',         evidenceUploaded: false, lastTested: '1 Mar 2026',  owner: 'James Okafor' },
]

const STATUS_COLOR: Record<ControlStatus, string> = {
  PASSING:         '#10B981',
  FAILING:         '#EF4444',
  EVIDENCE_NEEDED: '#F59E0B',
}

const STATUS_LABEL: Record<ControlStatus, string> = {
  PASSING:         'Passing',
  FAILING:         'Failing',
  EVIDENCE_NEEDED: 'Evidence Needed',
}

export function SecurityControls() {
  const [statusFilter,    setStatusFilter]    = useState<'ALL' | ControlStatus>('ALL')
  const [frameworkFilter, setFrameworkFilter] = useState<'ALL' | Framework>('ALL')

  const passing = CONTROLS.filter(c => c.status === 'PASSING').length
  const failing = CONTROLS.filter(c => c.status === 'FAILING').length

  const visible = CONTROLS.filter(c => {
    const sf = statusFilter    === 'ALL' || c.status    === statusFilter
    const ff = frameworkFilter === 'ALL' || c.framework === frameworkFilter
    return sf && ff
  })

  const statusTabs: Array<{ key: typeof statusFilter; label: string }> = [
    { key: 'ALL',             label: 'All' },
    { key: 'PASSING',         label: 'Passing' },
    { key: 'FAILING',         label: 'Failing' },
    { key: 'EVIDENCE_NEEDED', label: 'Evidence Needed' },
  ]

  const frameworkTabs: Array<{ key: typeof frameworkFilter; label: string }> = [
    { key: 'ALL',       label: 'All Frameworks' },
    { key: 'SOC 2',     label: 'SOC 2' },
    { key: 'ISO 27001', label: 'ISO 27001' },
  ]

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${ACCENT}22` }}>
          <Shield size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Security Controls</h1>
          <p className="text-sm text-[var(--os-text-2)]">SOC 2 and ISO 27001 control status — evidence and test results</p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Controls', value: '87',                                               sub: 'in scope'           },
          { label: 'Passing',        value: `${passing + 74} (${Math.round(((passing + 74) / 87) * 100)}%)`, sub: 'compliant'  },
          { label: 'Failing',        value: String(failing),                                    sub: 'need remediation'   },
          { label: 'Days to Audit',  value: '84',                                               sub: 'scheduled 15 Sep'  },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-xs text-[var(--os-text-2)] mb-1">{k.label}</p>
            <p className="text-2xl font-bold text-white">{k.value}</p>
            <p className="text-xs text-[var(--os-text-2)] mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="space-y-2">
        <div className="flex gap-2 flex-wrap">
          {statusTabs.map(t => (
            <button
              key={t.key}
              onClick={() => setStatusFilter(t.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                statusFilter === t.key
                  ? 'text-white'
                  : 'text-[var(--os-text-2)] bg-slate-800/60 hover:bg-slate-700/60'
              }`}
              style={statusFilter === t.key ? { background: ACCENT } : {}}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {frameworkTabs.map(t => (
            <button
              key={t.key}
              onClick={() => setFrameworkFilter(t.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                frameworkFilter === t.key
                  ? 'text-white'
                  : 'text-[var(--os-text-2)] bg-slate-800/60 hover:bg-slate-700/60'
              }`}
              style={frameworkFilter === t.key ? { background: '#8B5CF6' } : {}}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Controls List */}
      <div className="space-y-2">
        {visible.map(ctrl => {
          const sc = STATUS_COLOR[ctrl.status]
          return (
            <div
              key={ctrl.id}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
            >
              <div className="w-16 shrink-0">
                <p className="text-xs font-mono font-bold text-white">{ctrl.id}</p>
                <span
                  className="text-xs font-semibold px-1.5 py-0.5 rounded-full mt-0.5 inline-block"
                  style={{ background: '#8B5CF622', color: '#8B5CF6' }}
                >
                  {ctrl.framework}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{ctrl.description}</p>
              </div>
              <div className="text-right w-28 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">Owner</p>
                <p className="text-xs text-[var(--os-text-1)]">{ctrl.owner}</p>
              </div>
              <div className="text-right w-28 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">Last Tested</p>
                <p className="text-xs text-[var(--os-text-1)]">{ctrl.lastTested}</p>
              </div>
              <div className="text-center w-20 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">Evidence</p>
                <p className="text-xs font-semibold" style={{ color: ctrl.evidenceUploaded ? '#10B981' : '#EF4444' }}>
                  {ctrl.evidenceUploaded ? 'Uploaded' : 'Missing'}
                </p>
              </div>
              <div className="w-36 text-right shrink-0">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: `${sc}22`, color: sc }}
                >
                  {STATUS_LABEL[ctrl.status]}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
