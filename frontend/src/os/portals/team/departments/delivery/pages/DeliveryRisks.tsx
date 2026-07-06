import { useState } from 'react'
import { ShieldAlert, Sparkles } from 'lucide-react'

const ACCENT = '#F43F5E'

type Impact   = 'High' | 'Medium' | 'Low'
type Likelihood = 'High' | 'Medium' | 'Low'

interface Risk {
  id:          string
  project:     string
  client:      string
  title:       string
  impact:      Impact
  likelihood:  Likelihood
  owner:       string
  mitigation:  string
}

const RISKS: Risk[] = [
  { id: 'RSK-001', project: 'Shield Security',   client: 'FinServ',       title: 'Vendor pen test delayed — milestone slippage', impact: 'High',   likelihood: 'High',   owner: 'Sanjay Verma', mitigation: 'Propose partial acceptance with documented residual risk' },
  { id: 'RSK-002', project: 'BIDS™ Rollout',     client: 'GlobalMed',     title: 'Data migration volume underestimated by 40%',  impact: 'High',   likelihood: 'High',   owner: 'Riya Desai',   mitigation: 'Re-scope Phase 2 timeline; raise change request' },
  { id: 'RSK-003', project: 'Compliance Auto',   client: 'LegalFirst',    title: 'Legal team scope approval taking > 2 weeks',   impact: 'High',   likelihood: 'Medium', owner: 'Sanjay Verma', mitigation: 'Escalate to client sponsor; book decision meeting' },
  { id: 'RSK-004', project: 'Kangqore OS',       client: 'Acme Corp',     title: 'UAT resource availability — client side',      impact: 'Medium', likelihood: 'Medium', owner: 'Riya Desai',   mitigation: 'Agree UAT plan and dedicate client testing window' },
  { id: 'RSK-005', project: 'Data Migration',    client: 'HealthGroup',   title: 'Legacy data quality — duplicate records',      impact: 'High',   likelihood: 'Medium', owner: 'Sanjay Verma', mitigation: 'Run deduplication scripts during discovery phase' },
  { id: 'RSK-006', project: 'Cloud Infra Lift',  client: 'ManufactureCo', title: 'Environment access provisioning delay',        impact: 'Medium', likelihood: 'High',   owner: 'Riya Desai',   mitigation: 'Chase procurement owner — 5-day lead time documented' },
]

const COLOR: Record<Impact, string> = { High: '#EF4444', Medium: '#F59E0B', Low: '#10B981' }

export function DeliveryRisks() {
  const [filter, setFilter] = useState<'ALL' | Impact>('ALL')

  const high   = RISKS.filter(r => r.impact === 'High').length
  const medium = RISKS.filter(r => r.impact === 'Medium').length
  const low    = RISKS.filter(r => r.impact === 'Low').length

  const visible = filter === 'ALL' ? RISKS : RISKS.filter(r => r.impact === filter)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <ShieldAlert size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Risk Register</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">24 open risks across active engagements · High: 6 · Medium: 11 · Low: 7</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Open',   value: '24',         color: ACCENT },
          { label: 'High Impact',  value: String(high), color: '#EF4444' },
          { label: 'Med Impact',   value: String(medium + (24 - RISKS.length)), color: '#F59E0B' },
          { label: 'Low Impact',   value: String(low + 7 - (24 - RISKS.length - medium)), color: '#10B981' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5 flex gap-4">
        <Sparkles size={18} className="text-rose-400 mt-0.5 shrink-0" />
        <p className="text-sm text-[var(--os-text-1)]">
          <span className="font-semibold text-rose-400">KIMMP: </span>
          RSK-001 and RSK-002 are co-occurring with milestone slippage — combined exposure is £365K ARR.
          Recommend a governance review this week covering both. Both risks share a common mitigation path: proactive client escalation with written remediation plans.
        </p>
      </div>

      <div className="flex gap-2">
        {(['ALL', 'High', 'Medium', 'Low'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === f ? 'text-white' : 'bg-slate-800/60 text-[var(--os-text-2)] hover:text-[var(--os-text-1)] border border-white/10'
            }`}
            style={filter === f ? { background: f === 'ALL' ? ACCENT : COLOR[f as Impact] } : {}}
          >
            {f === 'ALL' ? 'All Risks' : `${f} Impact`}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['ID', 'Project', 'Client', 'Risk', 'Impact', 'Likelihood', 'Owner', 'Mitigation'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {visible.map(r => {
                const ic = COLOR[r.impact]
                const lc = COLOR[r.likelihood]
                return (
                  <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3"><span className="text-xs font-mono text-[var(--os-text-2)]">{r.id}</span></td>
                    <td className="px-4 py-3 text-[var(--os-text-1)] whitespace-nowrap">{r.project}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{r.client}</td>
                    <td className="px-4 py-3 text-white max-w-xs">{r.title}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${ic}22`, color: ic }}>{r.impact}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${lc}22`, color: lc }}>{r.likelihood}</span>
                    </td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{r.owner}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] text-xs max-w-xs">{r.mitigation}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
