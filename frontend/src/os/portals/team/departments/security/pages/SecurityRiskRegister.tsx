import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'

const ACCENT = '#EF4444'

type RiskStatus = 'OPEN' | 'MITIGATING' | 'CLOSED'

interface Risk {
  id: string
  title: string
  likelihood: number
  impact: number
  status: RiskStatus
  owner: string
  category: string
}

const RISKS: Risk[] = [
  { id: 'RSK-001', title: 'VPN gateway firmware vulnerability — unpatched CVE-2025-4471',        likelihood: 4, impact: 5, status: 'OPEN',      owner: 'Tom Walsh',    category: 'Cyber'        },
  { id: 'RSK-002', title: 'SQL injection findings from Q1 pen test — 3 endpoints unresolved',    likelihood: 3, impact: 4, status: 'MITIGATING', owner: 'Priya Nair',   category: 'Cyber'        },
  { id: 'RSK-003', title: 'GDPR Article 30 processing records incomplete — 4 systems missing',   likelihood: 3, impact: 3, status: 'OPEN',       owner: 'Aisha Malik',  category: 'Compliance'   },
  { id: 'RSK-004', title: 'Single cloud region dependency — no DR failover configured',           likelihood: 2, impact: 5, status: 'OPEN',       owner: 'Daniel Park',  category: 'Operational'  },
  { id: 'RSK-005', title: 'Stale admin accounts — 6 ex-employees with residual access',           likelihood: 3, impact: 4, status: 'MITIGATING', owner: 'Lucy Brennan', category: 'Cyber'        },
  { id: 'RSK-006', title: 'Unencrypted data at rest in legacy reporting database',                likelihood: 2, impact: 4, status: 'MITIGATING', owner: 'Raj Patel',    category: 'Cyber'        },
  { id: 'RSK-007', title: 'Physical server room access — no CCTV coverage on secondary site',    likelihood: 2, impact: 3, status: 'OPEN',       owner: 'Sarah Chen',   category: 'Physical'     },
  { id: 'RSK-008', title: 'Third-party SaaS vendor without DPA in place — Vendor X',             likelihood: 2, impact: 3, status: 'CLOSED',     owner: 'James Okafor', category: 'Compliance'   },
]

const STATUS_COLOR: Record<RiskStatus, string> = {
  OPEN:       '#EF4444',
  MITIGATING: '#F59E0B',
  CLOSED:     '#10B981',
}

function scoreColor(score: number) {
  if (score >= 15) return '#EF4444'
  if (score >= 9)  return '#F59E0B'
  return '#10B981'
}

export function SecurityRiskRegister() {
  const [filter, setFilter] = useState<'ALL' | RiskStatus>('ALL')

  const critical   = RISKS.filter(r => r.likelihood * r.impact >= 15).length
  const mitigating = RISKS.filter(r => r.status === 'MITIGATING').length
  const avgScore   = +(RISKS.reduce((a, r) => a + r.likelihood * r.impact, 0) / RISKS.length).toFixed(1)

  const visible = filter === 'ALL' ? RISKS : RISKS.filter(r => r.status === filter)

  const tabs: Array<{ key: typeof filter; label: string }> = [
    { key: 'ALL',       label: 'All' },
    { key: 'OPEN',      label: 'Open' },
    { key: 'MITIGATING', label: 'Mitigating' },
    { key: 'CLOSED',    label: 'Closed' },
  ]

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${ACCENT}22` }}>
          <AlertTriangle size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Risk Register</h1>
          <p className="text-sm text-[var(--os-text-2)]">Live security risk register — likelihood, impact, and mitigation tracking</p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Risks',    value: String(RISKS.length), sub: 'on register'        },
          { label: 'Critical (≥15)', value: String(critical),     sub: 'immediate action'   },
          { label: 'Mitigating',     value: String(mitigating),   sub: 'in active remediation' },
          { label: 'Avg Risk Score', value: String(avgScore),     sub: 'across all risks'   },
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

      {/* Risk List */}
      <div className="space-y-2">
        {visible.map(risk => {
          const score = risk.likelihood * risk.impact
          const sc    = STATUS_COLOR[risk.status]
          const scc   = scoreColor(score)
          return (
            <div
              key={risk.id}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xs text-[var(--os-text-2)] font-mono">{risk.id}</p>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: '#94A3B822', color: '#94A3B8' }}
                  >
                    {risk.category}
                  </span>
                </div>
                <p className="text-sm font-semibold text-white">{risk.title}</p>
              </div>
              <div className="text-center w-16 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">L × I</p>
                <p className="text-xs text-[var(--os-text-1)]">{risk.likelihood} × {risk.impact}</p>
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${scc}22` }}
              >
                <span className="text-lg font-bold" style={{ color: scc }}>{score}</span>
              </div>
              <div className="text-right w-28 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">Owner</p>
                <p className="text-xs text-[var(--os-text-1)]">{risk.owner}</p>
              </div>
              <div className="w-28 text-right shrink-0">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: `${sc}22`, color: sc }}
                >
                  {risk.status.charAt(0) + risk.status.slice(1).toLowerCase()}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
