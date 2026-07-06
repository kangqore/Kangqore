import { useState } from 'react'
import { Wrench, Sparkles } from 'lucide-react'

const ACCENT = '#84CC16'

type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
type Effort = 'High' | 'Medium' | 'Low'

interface TechDebtItem {
  id:       string
  area:     string
  title:    string
  severity: Severity
  effort:   Effort
  owner:    string
  added:    string
}

const ITEMS: TechDebtItem[] = [
  { id: 'TD-001', area: 'Auth',        title: 'JWT tokens not rotated — static 90-day expiry',               severity: 'CRITICAL', effort: 'Low',    owner: 'Siddharth R', added: '2026-03-10' },
  { id: 'TD-002', area: 'Database',    title: 'Missing indices on leads & projects tables — N+1 queries',    severity: 'CRITICAL', effort: 'Medium', owner: 'Kavya N',     added: '2026-04-02' },
  { id: 'TD-003', area: 'Frontend',    title: 'kangqore-view/ stale legacy — 93 redirects still in place',   severity: 'CRITICAL', effort: 'High',   owner: 'Aryan M',     added: '2026-06-18' },
  { id: 'TD-004', area: 'API',         title: 'No rate limiting on public endpoints',                         severity: 'CRITICAL', effort: 'Medium', owner: 'Siddharth R', added: '2026-05-14' },
  { id: 'TD-005', area: 'Auth',        title: 'bcrypt rounds at 10 — recommend 12 for 2026 threat model',    severity: 'HIGH',     effort: 'Low',    owner: 'Siddharth R', added: '2026-04-20' },
  { id: 'TD-006', area: 'Frontend',    title: 'Inline styles in 34 legacy components — not using design tokens', severity: 'HIGH',  effort: 'High',   owner: 'Aryan M',     added: '2026-05-01' },
  { id: 'TD-007', area: 'Testing',     title: 'Integration test coverage at 41% — target 80%',               severity: 'HIGH',     effort: 'High',   owner: 'Kavya N',     added: '2026-03-28' },
  { id: 'TD-008', area: 'API',         title: 'Unversioned API — breaking changes risk',                      severity: 'HIGH',     effort: 'High',   owner: 'Siddharth R', added: '2026-02-15' },
  { id: 'TD-009', area: 'Database',    title: 'ClientMilestone cannot link to User — schema gap',            severity: 'HIGH',     effort: 'Medium', owner: 'Kavya N',     added: '2026-05-30' },
  { id: 'TD-010', area: 'Monitoring',  title: 'No structured logging — JSON logs missing correlation IDs',   severity: 'HIGH',     effort: 'Medium', owner: 'Siddharth R', added: '2026-04-11' },
  { id: 'TD-011', area: 'Frontend',    title: 'Bundle size 2.4MB — target < 1.5MB',                         severity: 'HIGH',     effort: 'Medium', owner: 'Aryan M',     added: '2026-06-05' },
  { id: 'TD-012', area: 'Auth',        title: 'CORS whitelist includes localhost in production build',        severity: 'HIGH',     effort: 'Low',    owner: 'Siddharth R', added: '2026-06-12' },
  { id: 'TD-013', area: 'Database',    title: 'Prisma schema has 4 nullable fields that should be required', severity: 'MEDIUM',   effort: 'Low',    owner: 'Kavya N',     added: '2026-05-08' },
  { id: 'TD-014', area: 'Frontend',    title: 'useEffect dependency arrays incomplete in 12 components',     severity: 'MEDIUM',   effort: 'Low',    owner: 'Aryan M',     added: '2026-05-22' },
  { id: 'TD-015', area: 'API',         title: 'Hardcoded pagination limit of 100 — no cursor support',       severity: 'MEDIUM',   effort: 'Medium', owner: 'Siddharth R', added: '2026-04-18' },
]

const SEV_COLOR: Record<Severity, string> = {
  CRITICAL: '#EF4444',
  HIGH:     '#F97316',
  MEDIUM:   '#F59E0B',
  LOW:      '#6B7280',
}

export function EngineeringTechDebt() {
  const [filter, setFilter] = useState<'ALL' | Severity>('ALL')

  const counts = {
    CRITICAL: ITEMS.filter(i => i.severity === 'CRITICAL').length,
    HIGH:     ITEMS.filter(i => i.severity === 'HIGH').length,
    MEDIUM:   ITEMS.filter(i => i.severity === 'MEDIUM').length,
    LOW:      ITEMS.filter(i => i.severity === 'LOW').length,
  }

  const visible = filter === 'ALL' ? ITEMS : ITEMS.filter(i => i.severity === filter)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Wrench size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Tech Debt Register</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">47 items tracked · severity-triaged with effort and ownership</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Items',  value: '47',                           color: ACCENT },
          { label: 'Critical',     value: String(counts.CRITICAL),        color: '#EF4444' },
          { label: 'High',         value: String(counts.HIGH),            color: '#F97316' },
          { label: 'Medium',       value: String(counts.MEDIUM),          color: '#F59E0B' },
          { label: 'Low',          value: String(counts.LOW + (47 - ITEMS.length)), color: '#6B7280' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-lime-500/30 bg-lime-500/5 p-5 flex gap-4">
        <Sparkles size={18} className="text-lime-400 mt-0.5 shrink-0" />
        <p className="text-sm text-[var(--os-text-1)]">
          <span className="font-semibold text-lime-400">KIMMP: </span>
          4 Critical items represent systemic risk. JWT rotation (TD-001) + rate limiting (TD-004) can be resolved in 1 sprint with combined effort of 5 days.
          Legacy frontend deletion (TD-003) unblocks 6 HIGH items — prioritise this in Sprint 25 as planned (target: 2026-08-01).
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === f ? 'text-white' : 'bg-slate-800/60 text-[var(--os-text-2)] hover:text-[var(--os-text-1)] border border-white/10'
            }`}
            style={filter === f ? { background: f === 'ALL' ? ACCENT : SEV_COLOR[f as Severity] } : {}}
          >
            {f === 'ALL' ? 'All Items' : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['ID', 'Area', 'Issue', 'Severity', 'Effort', 'Owner', 'Added'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {visible.map(item => {
                const sc = SEV_COLOR[item.severity]
                return (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap"><span className="text-xs font-mono text-[var(--os-text-2)]">{item.id}</span></td>
                    <td className="px-4 py-3 whitespace-nowrap"><span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/60 text-[var(--os-text-1)]">{item.area}</span></td>
                    <td className="px-4 py-3 text-[var(--os-text-1)] max-w-xs">{item.title}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>{item.severity}</span>
                    </td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{item.effort}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{item.owner}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{item.added}</td>
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
