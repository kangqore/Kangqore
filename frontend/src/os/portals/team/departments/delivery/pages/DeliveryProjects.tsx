import { useState } from 'react'
import { ClipboardList, Sparkles } from 'lucide-react'

const ACCENT = '#F43F5E'

type RAG = 'GREEN' | 'AMBER' | 'RED'
type Stage = 'Planning' | 'In Progress' | 'Review' | 'Closed'

interface Project {
  id:       string
  name:     string
  client:   string
  value:    string
  pm:       string
  stage:    Stage
  rag:      RAG
  ragNote?: string
  endDate:  string
}

const PROJECTS: Project[] = [
  { id: 'PRJ-001', name: 'Kangqore OS Implementation', client: 'Acme Corp',    value: '£120k', pm: 'Riya Desai',   stage: 'In Progress', rag: 'GREEN',                                  endDate: '2026-08-15' },
  { id: 'PRJ-002', name: 'BIDS™ Rollout',              client: 'GlobalMed',    value: '£280k', pm: 'Sanjay Verma', stage: 'In Progress', rag: 'AMBER', ragNote: 'milestone slipped',       endDate: '2026-09-30' },
  { id: 'PRJ-003', name: 'Cognition AI Platform',      client: 'DataCo',       value: '£95k',  pm: 'Riya Desai',   stage: 'Planning',    rag: 'GREEN',                                  endDate: '2026-10-15' },
  { id: 'PRJ-004', name: 'Shield Security Deployment', client: 'FinServ',      value: '£85k',  pm: 'Sanjay Verma', stage: 'In Progress', rag: 'RED',   ragNote: 'budget overrun',          endDate: '2026-07-31' },
  { id: 'PRJ-005', name: 'Analytics Dashboard v2',     client: 'RetailCo',     value: '£62k',  pm: 'Riya Desai',   stage: 'Review',      rag: 'GREEN',                                  endDate: '2026-07-10' },
  { id: 'PRJ-006', name: 'Data Migration Programme',   client: 'HealthGroup',  value: '£145k', pm: 'Sanjay Verma', stage: 'In Progress', rag: 'GREEN',                                  endDate: '2026-11-01' },
  { id: 'PRJ-007', name: 'Compliance Automation',      client: 'LegalFirst',   value: '£78k',  pm: 'Riya Desai',   stage: 'Planning',    rag: 'AMBER', ragNote: 'scope still being agreed',endDate: '2026-12-15' },
  { id: 'PRJ-008', name: 'Cloud Infrastructure Lift',  client: 'ManufactureCo',value: '£190k', pm: 'Sanjay Verma', stage: 'In Progress', rag: 'GREEN',                                  endDate: '2026-09-01' },
]

const RAG_COLOR: Record<RAG, string> = {
  GREEN: '#10B981',
  AMBER: '#F59E0B',
  RED:   '#EF4444',
}

const STAGE_COLOR: Record<Stage, string> = {
  'Planning':    '#6366F1',
  'In Progress': '#2564ea',
  'Review':      '#F97316',
  'Closed':      '#6B7280',
}

export function DeliveryProjects() {
  const [filter, setFilter] = useState<'ALL' | RAG>('ALL')

  const active    = PROJECTS.filter(p => p.stage !== 'Closed').length
  const onTrack   = PROJECTS.filter(p => p.rag === 'GREEN').length
  const atRisk    = PROJECTS.filter(p => p.rag === 'AMBER').length
  const overdue   = PROJECTS.filter(p => p.rag === 'RED').length

  const visible = filter === 'ALL' ? PROJECTS : PROJECTS.filter(p => p.rag === filter)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <ClipboardList size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Active Projects</h1>
          <p className="text-sm text-[var(--os-text-2)]">Client project tracker — all live engagements with RAG status</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Active Projects',   value: String(active),   color: ACCENT    },
          { label: 'On Track',          value: String(onTrack),  color: '#10B981' },
          { label: 'At Risk',           value: String(atRisk),   color: '#F59E0B' },
          { label: 'Overdue',           value: String(overdue),  color: '#EF4444' },
          { label: 'Revenue Managed',   value: '£2.1M',          color: '#8B5CF6' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* KIMMP Insight */}
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5 flex gap-4">
        <Sparkles size={18} className="text-rose-400 mt-0.5 shrink-0" />
        <p className="text-sm text-[var(--os-text-1)]">
          <span className="font-semibold text-rose-400">KIMMP: </span>
          FinServ Shield project is 18% over budget with 6 weeks remaining. Root cause: scope creep in week 3.
          Recommend raising a change request for £15k additional scope before the next governance review.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['ALL', 'GREEN', 'AMBER', 'RED'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === f
                ? 'text-white'
                : 'bg-slate-800/60 text-[var(--os-text-2)] hover:text-[var(--os-text-1)] border border-white/10'
            }`}
            style={filter === f ? { background: f === 'ALL' ? ACCENT : RAG_COLOR[f as RAG] } : {}}
          >
            {f === 'ALL' ? 'All Projects' : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Projects Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['ID', 'Project', 'Client', 'Value', 'PM', 'Stage', 'RAG', 'End Date'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {visible.map(p => {
                const rc = RAG_COLOR[p.rag]
                const sc = STAGE_COLOR[p.stage]
                return (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-mono text-[var(--os-text-2)]">{p.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-white whitespace-nowrap">{p.name}</p>
                    </td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{p.client}</td>
                    <td className="px-4 py-3 text-[var(--os-text-1)] font-semibold whitespace-nowrap">{p.value}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{p.pm}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>
                        {p.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: rc }} />
                        <span className="text-xs font-semibold" style={{ color: rc }}>{p.rag}</span>
                        {p.ragNote && <span className="text-xs text-[var(--os-text-2)]">— {p.ragNote}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{p.endDate}</td>
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
