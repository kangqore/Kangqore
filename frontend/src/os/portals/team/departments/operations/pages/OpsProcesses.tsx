import { Sparkles } from 'lucide-react'
import { GearSix } from '@phosphor-icons/react'

const ACCENT = '#16A34A'

type ProcessType = 'Core' | 'Support' | 'Management'
type Maturity = 'Ad-hoc' | 'Defined' | 'Managed' | 'Optimised'

interface Process {
  name:         string
  ownerDept:    string
  processOwner: string
  type:         ProcessType
  maturity:     Maturity
  lastReviewed: string
  documented:   boolean
}

const PROCESSES: Process[] = [
  { name: 'Client Onboarding',            ownerDept: 'Delivery',   processOwner: 'Suresh Nambiar', type: 'Core',       maturity: 'Optimised', lastReviewed: '2026-05-01', documented: true },
  { name: 'Invoice-to-Cash',             ownerDept: 'Finance',    processOwner: 'Leela Krishnan', type: 'Core',       maturity: 'Managed',   lastReviewed: '2026-04-15', documented: true },
  { name: 'Incident Management',          ownerDept: 'IT',         processOwner: 'Suresh Nambiar', type: 'Core',       maturity: 'Managed',   lastReviewed: '2026-06-01', documented: true },
  { name: 'Recruitment & Hiring',         ownerDept: 'HR',         processOwner: 'Leela Krishnan', type: 'Support',    maturity: 'Defined',   lastReviewed: '2026-03-20', documented: true },
  { name: 'Change Management',            ownerDept: 'IT',         processOwner: 'Suresh Nambiar', type: 'Support',    maturity: 'Defined',   lastReviewed: '2026-05-10', documented: true },
  { name: 'Risk Review Cycle',            ownerDept: 'Risk',       processOwner: 'Leela Krishnan', type: 'Management', maturity: 'Defined',   lastReviewed: '2026-04-01', documented: true },
  { name: 'Sprint Planning',              ownerDept: 'Engineering',processOwner: 'Suresh Nambiar', type: 'Core',       maturity: 'Optimised', lastReviewed: '2026-06-10', documented: true },
  { name: 'Vendor Payment Cycle',         ownerDept: 'Finance',    processOwner: 'Leela Krishnan', type: 'Support',    maturity: 'Managed',   lastReviewed: '2026-03-01', documented: true },
  { name: 'Board Reporting',             ownerDept: 'Executive',  processOwner: 'Suresh Nambiar', type: 'Management', maturity: 'Defined',   lastReviewed: '2026-05-25', documented: true },
  { name: 'Emergency Response',           ownerDept: 'Operations', processOwner: 'Leela Krishnan', type: 'Core',       maturity: 'Ad-hoc',    lastReviewed: '2025-11-01', documented: false },
  { name: 'Knowledge Management',         ownerDept: 'Operations', processOwner: 'Suresh Nambiar', type: 'Support',    maturity: 'Ad-hoc',    lastReviewed: '2025-09-01', documented: false },
]

const MATURITY_COLOR: Record<Maturity, string> = {
  'Ad-hoc':   '#EF4444',
  'Defined':  '#F59E0B',
  'Managed':  '#6366F1',
  'Optimised':'#10B981',
}

const TYPE_COLOR: Record<ProcessType, string> = { Core: '#16A34A', Support: '#6366F1', Management: '#F59E0B' }

export function OpsProcesses() {
  const documented = PROCESSES.filter(p => p.documented).length
  const pct = Math.round(documented / PROCESSES.length * 100)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <GearSix size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Process Registry</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Business process register — type, maturity, ownership and documentation status.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Processes',  value: String(PROCESSES.length), color: ACCENT },
          { label: 'Documented',       value: `${pct}%`,                color: '#10B981' },
          { label: 'Optimised',        value: String(PROCESSES.filter(p => p.maturity === 'Optimised').length), color: '#10B981' },
          { label: 'Ad-hoc',           value: String(PROCESSES.filter(p => p.maturity === 'Ad-hoc').length),   color: '#EF4444' },
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
          Emergency Response process is Ad-hoc and undocumented — a critical operational risk. Prioritise documentation
          and a tabletop exercise before Q3. Knowledge Management is also Ad-hoc; the team's reliance on tribal knowledge
          is a scalability bottleneck. Invoice-to-Cash and Incident Management are well-managed; document the optimisation
          steps to enable further automation. The 2 Ad-hoc processes should both be elevated to Defined within this quarter.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Process', 'Owner Dept', 'Process Owner', 'Type', 'Maturity', 'Last Reviewed', 'Documented'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {PROCESSES.map(p => {
                const mc = MATURITY_COLOR[p.maturity]
                const tc = TYPE_COLOR[p.type]
                return (
                  <tr key={p.name} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{p.name}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{p.ownerDept}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{p.processOwner}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${tc}22`, color: tc }}>{p.type}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${mc}22`, color: mc }}>{p.maturity}</span>
                    </td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{p.lastReviewed}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.documented ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {p.documented ? 'Yes' : 'No'}
                      </span>
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
