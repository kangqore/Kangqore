import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { WarningCircle } from '@phosphor-icons/react'

const ACCENT = '#B91C1C'

type Impact = 'High' | 'Med' | 'Low'
type Status = 'Open' | 'Mitigated' | 'Accepted'

interface RiskEntry {
  id:         string
  category:   string
  title:      string
  impact:     Impact
  likelihood: Impact
  owner:      string
  status:     Status
}

const RISKS: RiskEntry[] = [
  { id: 'RC-001', category: 'ISO',      title: 'Incomplete asset inventory for ISO 27001 A.8 control',        impact: 'High', likelihood: 'Med',  owner: 'Maya Nair',   status: 'Open' },
  { id: 'RC-002', category: 'GDPR',     title: 'Third-party data processor agreements not reviewed in 12m',    impact: 'High', likelihood: 'High', owner: 'Arjun Singh', status: 'Open' },
  { id: 'RC-003', category: 'SOC2',     title: 'Encryption at rest not enforced on legacy backup servers',     impact: 'High', likelihood: 'Med',  owner: 'Maya Nair',   status: 'Open' },
  { id: 'RC-004', category: 'DPDP',     title: 'DPDP consent mechanism not implemented for Indian customers',  impact: 'High', likelihood: 'High', owner: 'Arjun Singh', status: 'Open' },
  { id: 'RC-005', category: 'Internal', title: 'Access review overdue for 14 privileged accounts',            impact: 'Med',  likelihood: 'High', owner: 'Maya Nair',   status: 'Open' },
  { id: 'RC-006', category: 'GDPR',     title: 'Cookie consent banner does not cover analytics trackers',      impact: 'Med',  likelihood: 'Med',  owner: 'Arjun Singh', status: 'Mitigated' },
  { id: 'RC-007', category: 'HIPAA',    title: 'PHI data handling policy not documented for HealthGroup project',impact: 'High', likelihood: 'Low', owner: 'Maya Nair',   status: 'Open' },
  { id: 'RC-008', category: 'Internal', title: 'Security awareness training completion below 80% threshold',   impact: 'Low',  likelihood: 'Med',  owner: 'Arjun Singh', status: 'Accepted' },
]

const IMPACT_COLOR: Record<Impact, string> = { High: '#EF4444', Med: '#F59E0B', Low: '#10B981' }
const STATUS_COLOR: Record<Status, string> = { Open: '#EF4444', Mitigated: '#10B981', Accepted: '#6B7280' }

export function RCRiskRegister() {
  const [filter, setFilter] = useState<'ALL' | Status>('ALL')

  const open      = RISKS.filter(r => r.status === 'Open').length
  const mitigated = RISKS.filter(r => r.status === 'Mitigated').length
  const accepted  = RISKS.filter(r => r.status === 'Accepted').length
  const critical  = RISKS.filter(r => r.impact === 'High' && r.status === 'Open').length

  const visible = filter === 'ALL' ? RISKS : RISKS.filter(r => r.status === filter)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <WarningCircle size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Risk Register</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Enterprise risk registry — ISO / GDPR / SOC 2 / DPDP / HIPAA / Internal controls.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Open Risks',    value: String(open),      color: '#EF4444' },
          { label: 'Critical',      value: String(critical),  color: ACCENT },
          { label: 'Mitigated',     value: String(mitigated), color: '#10B981' },
          { label: 'Accepted',      value: String(accepted),  color: '#6B7280' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border p-5 flex gap-4" style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}08` }}>
        <Sparkles size={18} style={{ color: ACCENT }} className="mt-0.5 shrink-0" />
        <p className="text-sm text-[var(--os-text-1)]">
          <span className="font-semibold" style={{ color: ACCENT }}>KIMMP: </span>
          RC-004 (DPDP consent) and RC-002 (processor agreements) are co-dependent high-impact risks. DPDP enforcement
          begins Q3 — recommend treating these as a single remediation programme with a dedicated sprint. RC-003
          encryption gap on backup servers could fail SOC 2 CC6.1 control — prioritise before the scheduled audit in 6 weeks.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['ALL', 'Open', 'Mitigated', 'Accepted'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === f ? 'text-white' : 'bg-slate-800/60 text-[var(--os-text-2)] hover:text-[var(--os-text-1)] border border-white/10'
            }`}
            style={filter === f ? { background: f === 'ALL' ? ACCENT : STATUS_COLOR[f as Status] } : {}}
          >
            {f === 'ALL' ? 'All Risks' : f}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['ID', 'Category', 'Risk Title', 'Impact', 'Likelihood', 'Owner', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {visible.map(r => {
                const ic = IMPACT_COLOR[r.impact]
                const lc = IMPACT_COLOR[r.likelihood]
                const sc = STATUS_COLOR[r.status]
                return (
                  <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3"><span className="text-xs font-mono text-[var(--os-text-2)]">{r.id}</span></td>
                    <td className="px-4 py-3"><span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-700/60 text-[var(--os-text-1)]">{r.category}</span></td>
                    <td className="px-4 py-3 text-white max-w-xs">{r.title}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${ic}22`, color: ic }}>{r.impact}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${lc}22`, color: lc }}>{r.likelihood}</span>
                    </td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{r.owner}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>{r.status}</span>
                    </td>
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
