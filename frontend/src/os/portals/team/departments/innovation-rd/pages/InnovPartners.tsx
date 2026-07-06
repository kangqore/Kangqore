import { Sparkles } from 'lucide-react'
import { Handshake } from '@phosphor-icons/react'

const ACCENT = '#CA8A04'

type PartnerType = 'University' | 'Startup' | 'Vendor' | 'Govt'

interface Partner {
  name:        string
  type:        PartnerType
  relationship: string
  activeProjects: number
  keyContact:  string
}

const PARTNERS: Partner[] = [
  { name: 'Imperial College London',   type: 'University', relationship: 'Research collaboration on AI safety evaluation', activeProjects: 2, keyContact: 'Prof. Sarah Ahmed' },
  { name: 'UCL Computer Science',      type: 'University', relationship: 'MSc placement programme & joint research',        activeProjects: 1, keyContact: 'Dr. James Park' },
  { name: 'Synthesis AI (startup)',    type: 'Startup',    relationship: 'Synthetic data generation for model training',   activeProjects: 1, keyContact: 'Elena Vasquez' },
  { name: 'Anthropic',                 type: 'Vendor',     relationship: 'Premier partner — KIMMP model provider',         activeProjects: 3, keyContact: 'Partnerships Team' },
  { name: 'UK AI Safety Institute',   type: 'Govt',       relationship: 'AI governance framework consultation',            activeProjects: 1, keyContact: 'Policy Team' },
  { name: 'Innovate UK',               type: 'Govt',       relationship: 'R&D grant programme — BIDS™ healthcare edition', activeProjects: 1, keyContact: 'Grant Manager' },
  { name: 'DataIQ (network)',          type: 'Vendor',     relationship: 'Data science community & benchmarking',          activeProjects: 0, keyContact: 'Community Lead' },
  { name: 'Deepmind Spinout (stealth)',type: 'Startup',    relationship: 'Exploratory conversation — multimodal research', activeProjects: 0, keyContact: 'Ananya Das' },
  { name: 'Edinburgh Uni AI Lab',     type: 'University', relationship: 'NLP research partnership — conversational AI',   activeProjects: 1, keyContact: 'Dr. Rahul Kapoor' },
]

const TYPE_COLOR: Record<PartnerType, string> = {
  University: '#6366F1',
  Startup:    '#D946EF',
  Vendor:     '#10B981',
  Govt:       '#F59E0B',
}

export function InnovPartners() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Handshake size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Innovation Partners</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Research, technology and government partners supporting the R&amp;D programme.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(['University', 'Startup', 'Vendor', 'Govt'] as const).map(type => (
          <div key={type} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{type}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: TYPE_COLOR[type] }}>
              {PARTNERS.filter(p => p.type === type).length}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border p-5 flex gap-4" style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}08` }}>
        <Sparkles size={18} style={{ color: ACCENT }} className="mt-0.5 shrink-0" />
        <p className="text-sm text-[var(--os-text-1)]">
          <span className="font-semibold" style={{ color: ACCENT }}>KIMMP: </span>
          Anthropic partnership has 3 active projects — the most active partner in the portfolio. Ensure the partnership
          tier review is scheduled before the annual contract renewal. Innovate UK grant requires quarterly reporting;
          check the next submission date with the Grant Manager. The stealth startup conversation should be formalised
          with an NDA before any IP is shared. UCL placement programme is a talent pipeline — fast-track strong performers
          to Kangqore roles.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Organisation', 'Type', 'Relationship', 'Active Projects', 'Key Contact'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {PARTNERS.map(p => {
                const tc = TYPE_COLOR[p.type]
                return (
                  <tr key={p.name} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{p.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${tc}22`, color: tc }}>{p.type}</span>
                    </td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] text-xs">{p.relationship}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-bold ${p.activeProjects > 0 ? 'text-white' : 'text-[var(--os-text-2)]'}`}>{p.activeProjects}</span>
                    </td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{p.keyContact}</td>
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
