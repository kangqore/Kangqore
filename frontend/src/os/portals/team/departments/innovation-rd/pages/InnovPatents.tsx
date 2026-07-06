import { Sparkles } from 'lucide-react'
import { Certificate } from '@phosphor-icons/react'

const ACCENT = '#CA8A04'

type PatentStatus = 'Draft' | 'Filed' | 'Pending' | 'Granted' | 'Abandoned'

interface Patent {
  id:           string
  title:        string
  inventors:    string
  filingDate:   string
  jurisdiction: string
  status:       PatentStatus
}

const PATENTS: Patent[] = [
  { id: 'PAT-001', title: 'AI-Assisted Compliance Evidence Generation System',      inventors: 'Ananya Das, Kiran Mehta', filingDate: '2026-03-15', jurisdiction: 'UK / EU', status: 'Filed' },
  { id: 'PAT-002', title: 'Outcome-Based Pricing Calculation Engine for SaaS',      inventors: 'Kiran Mehta',             filingDate: '2026-04-20', jurisdiction: 'UK',      status: 'Filed' },
  { id: 'PAT-003', title: 'Multi-Agent Governance Framework for LLM Orchestration', inventors: 'Ananya Das, Kiran Mehta', filingDate: '2025-11-10', jurisdiction: 'UK / US', status: 'Pending' },
  { id: 'PAT-004', title: 'Natural Language Pipeline Builder for ETL Operations',   inventors: 'Ananya Das',              filingDate: '2026-05-01', jurisdiction: 'UK',      status: 'Draft' },
  { id: 'PAT-005', title: 'Real-time Risk Score Aggregation from Multi-Source Data',inventors: 'Kiran Mehta',             filingDate: '2025-08-22', jurisdiction: 'UK / EU', status: 'Pending' },
  { id: 'PAT-006', title: 'BIDS™ Industry Adaptation Layer — Configuration System', inventors: 'Ananya Das, Kiran Mehta', filingDate: '2025-06-14', jurisdiction: 'UK',      status: 'Granted' },
]

const STATUS_COLOR: Record<PatentStatus, string> = {
  Draft:     '#6B7280',
  Filed:     '#6366F1',
  Pending:   '#F59E0B',
  Granted:   '#10B981',
  Abandoned: '#EF4444',
}

export function InnovPatents() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Certificate size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Patents</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">IP portfolio — patent filings, jurisdictions and grant status.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Patents', value: String(PATENTS.length),                                             color: ACCENT },
          { label: 'Filed',         value: String(PATENTS.filter(p => p.status === 'Filed').length),        color: '#6366F1' },
          { label: 'Pending',       value: String(PATENTS.filter(p => p.status === 'Pending').length),      color: '#F59E0B' },
          { label: 'Granted',       value: String(PATENTS.filter(p => p.status === 'Granted').length),      color: '#10B981' },
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
          PAT-006 (BIDS™ Adaptation Layer) is granted — file the international extension (PCT) within 12 months of the
          UK grant date to preserve global rights. PAT-003 (Multi-Agent Governance) is pending in UK/US — the AI
          governance landscape is moving fast; ensure the claims language covers the AEGIS architecture. PAT-004 (NL
          Pipeline Builder) is still in Draft; move to filing before the PoC becomes public-facing or prior art will be established.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['ID', 'Title', 'Inventors', 'Filing Date', 'Jurisdiction', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {PATENTS.map(p => {
                const sc = STATUS_COLOR[p.status]
                return (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3"><span className="text-xs font-mono text-[var(--os-text-2)]">{p.id}</span></td>
                    <td className="px-4 py-3 text-white font-medium max-w-xs">{p.title}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{p.inventors}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{p.filingDate}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{p.jurisdiction}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>{p.status}</span>
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
