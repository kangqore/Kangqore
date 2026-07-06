import { useState } from 'react'
import { Flag, Sparkles } from 'lucide-react'

const ACCENT = '#F43F5E'

type MilestoneStatus = 'On Track' | 'At Risk' | 'Overdue' | 'Complete'

interface Milestone {
  id:      string
  project: string
  client:  string
  name:    string
  dueDate: string
  owner:   string
  status:  MilestoneStatus
  note?:   string
}

const MILESTONES: Milestone[] = [
  { id: 'MS-01', project: 'Kangqore OS',       client: 'Acme Corp',     name: 'UAT Sign-off',               dueDate: '2026-06-30', owner: 'Riya Desai',   status: 'On Track' },
  { id: 'MS-02', project: 'BIDS™ Rollout',     client: 'GlobalMed',     name: 'Phase 2 Delivery',           dueDate: '2026-07-05', owner: 'Sanjay Verma', status: 'At Risk', note: 'data migration delayed' },
  { id: 'MS-03', project: 'Shield Security',   client: 'FinServ',       name: 'Penetration Test Report',    dueDate: '2026-07-01', owner: 'Sanjay Verma', status: 'Overdue', note: 'vendor delay' },
  { id: 'MS-04', project: 'Analytics v2',      client: 'RetailCo',      name: 'Client Review Session',      dueDate: '2026-07-08', owner: 'Riya Desai',   status: 'On Track' },
  { id: 'MS-05', project: 'Data Migration',    client: 'HealthGroup',   name: 'Legacy Data Validated',      dueDate: '2026-07-12', owner: 'Sanjay Verma', status: 'On Track' },
  { id: 'MS-06', project: 'Compliance Auto',   client: 'LegalFirst',    name: 'Scope Agreement Signed',     dueDate: '2026-07-15', owner: 'Riya Desai',   status: 'At Risk', note: 'legal review ongoing' },
  { id: 'MS-07', project: 'Cloud Infra Lift',  client: 'ManufactureCo', name: 'Environment Provisioning',   dueDate: '2026-07-18', owner: 'Sanjay Verma', status: 'On Track' },
  { id: 'MS-08', project: 'Cognition Platform',client: 'DataCo',        name: 'Architecture Decision Record',dueDate: '2026-07-22', owner: 'Riya Desai',   status: 'On Track' },
]

const STATUS_COLOR: Record<MilestoneStatus, string> = {
  'On Track': '#10B981',
  'At Risk':  '#F59E0B',
  'Overdue':  '#EF4444',
  'Complete': '#6B7280',
}

export function DeliveryMilestones() {
  const [filter, setFilter] = useState<'ALL' | MilestoneStatus>('ALL')

  const counts = {
    'On Track': MILESTONES.filter(m => m.status === 'On Track').length,
    'At Risk':  MILESTONES.filter(m => m.status === 'At Risk').length,
    'Overdue':  MILESTONES.filter(m => m.status === 'Overdue').length,
    'Complete': MILESTONES.filter(m => m.status === 'Complete').length,
  }

  const visible = filter === 'ALL' ? MILESTONES : MILESTONES.filter(m => m.status === filter)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Flag size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Milestones</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">8 milestones due this month across all active client projects</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Due This Month', value: String(MILESTONES.length), color: ACCENT },
          { label: 'On Track',       value: String(counts['On Track']), color: '#10B981' },
          { label: 'At Risk',        value: String(counts['At Risk']),  color: '#F59E0B' },
          { label: 'Overdue',        value: String(counts['Overdue']),  color: '#EF4444' },
          { label: 'Completed',      value: String(counts['Complete']), color: '#6B7280' },
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
          FinServ Pen Test overdue (MS-03) is on the critical path for Shield Security sign-off. Revenue at risk: £85K.
          Escalate to vendor today — or propose a partial acceptance approach with documented residual risk.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['ALL', 'On Track', 'At Risk', 'Overdue', 'Complete'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === f ? 'text-white' : 'bg-slate-800/60 text-[var(--os-text-2)] hover:text-[var(--os-text-1)] border border-white/10'
            }`}
            style={filter === f ? { background: f === 'ALL' ? ACCENT : STATUS_COLOR[f as MilestoneStatus] } : {}}
          >
            {f === 'ALL' ? 'All Milestones' : f}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['ID', 'Project', 'Client', 'Milestone', 'Due Date', 'Owner', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {visible.map(m => {
                const sc = STATUS_COLOR[m.status]
                return (
                  <tr key={m.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap"><span className="text-xs font-mono text-[var(--os-text-2)]">{m.id}</span></td>
                    <td className="px-4 py-3 text-[var(--os-text-1)] whitespace-nowrap">{m.project}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{m.client}</td>
                    <td className="px-4 py-3 text-white font-medium">{m.name}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{m.dueDate}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{m.owner}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>{m.status}</span>
                        {m.note && <span className="text-xs text-[var(--os-text-2)]">— {m.note}</span>}
                      </div>
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
