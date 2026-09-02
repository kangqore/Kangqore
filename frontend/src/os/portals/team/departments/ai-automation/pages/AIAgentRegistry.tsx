import { Sparkles } from 'lucide-react'
import { Robot } from '@phosphor-icons/react'

const ACCENT = '#D946EF'

type AgentStatus = 'Active' | 'Paused' | 'Deprecated'

interface Agent {
  name:      string
  role:      string
  model:     string
  owner:     string
  tasksDay:  number
  latency:   string
  status:    AgentStatus
}

const AGENTS: Agent[] = [
  { name: 'KIMMP',                 role: 'AI Brain / OS Orchestrator',      model: 'claude-sonnet-4-6', owner: 'Rohan Gupta',  tasksDay: 1840, latency: '0.9s', status: 'Active' },
  { name: 'WAANDA',                role: 'Client-facing AI Layer',           model: 'claude-sonnet-4-6', owner: 'Rohan Gupta',  tasksDay: 640,  latency: '1.1s', status: 'Active' },
  { name: 'HANUMANAS — Audit Agent',   role: 'Governance & Audit Trail',         model: 'claude-sonnet-4-6', owner: 'Priya Sharma', tasksDay: 380,  latency: '0.7s', status: 'Active' },
  { name: 'HANUMANAS — Shield Agent',  role: 'Access Control & Anomaly Detection',model: 'claude-sonnet-4-6',owner: 'Priya Sharma', tasksDay: 2100, latency: '0.4s', status: 'Active' },
  { name: 'Scout',                 role: 'Web Intelligence & Research',      model: 'claude-sonnet-4-6', owner: 'Rohan Gupta',  tasksDay: 184,  latency: '2.4s', status: 'Active' },
  { name: 'Content Agent',         role: 'Marketing Content Generation',     model: 'claude-sonnet-4-6', owner: 'Priya Sharma', tasksDay: 48,   latency: '3.2s', status: 'Active' },
  { name: 'Support Triage Agent',  role: 'Ticket Classification & Routing',  model: 'claude-sonnet-4-6', owner: 'Rohan Gupta',  tasksDay: 312,  latency: '0.6s', status: 'Active' },
  { name: 'Code Review Agent',     role: 'PR Analysis & Quality Gates',      model: 'claude-sonnet-4-6', owner: 'Priya Sharma', tasksDay: 96,   latency: '4.1s', status: 'Active' },
  { name: 'Data Pipeline Agent',   role: 'ETL Orchestration & Monitoring',   model: 'claude-sonnet-4-6', owner: 'Rohan Gupta',  tasksDay: 420,  latency: '1.8s', status: 'Active' },
  { name: 'Legacy Summariser',     role: 'Document Summarisation (v1)',       model: 'claude-sonnet-4-6', owner: 'Priya Sharma', tasksDay: 12,   latency: '5.2s', status: 'Deprecated' },
]

const STATUS_COLOR: Record<AgentStatus, string> = {
  Active:     '#10B981',
  Paused:     '#F59E0B',
  Deprecated: '#6B7280',
}

export function AIAgentRegistry() {
  const active = AGENTS.filter(a => a.status === 'Active')
  const totalTasks = active.reduce((acc, a) => acc + a.tasksDay, 0)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Robot size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Agent Registry</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">All KIMMP, WAANDA, HANUMANAS and operational agents — models, owners and live metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Agents',  value: String(active.length),    color: '#10B981' },
          { label: 'Tasks/Day',      value: totalTasks.toLocaleString(), color: ACCENT },
          { label: 'Deprecated',     value: String(AGENTS.filter(a => a.status === 'Deprecated').length), color: '#6B7280' },
          { label: 'Paused',         value: String(AGENTS.filter(a => a.status === 'Paused').length),     color: '#F59E0B' },
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
          HANUMANAS Shield is processing 2,100 tasks/day — the highest-volume agent. Monitor for latency spikes during
          peak authentication windows. Legacy Summariser should be formally deprecated and removed from the registry;
          it is still receiving 12 tasks/day which suggests a missed migration. Code Review Agent at 4.1s latency is
          above the 3s target — profile the prompt and consider streaming the response.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Agent', 'Role', 'Model', 'Owner', 'Tasks/Day', 'Avg Latency', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {AGENTS.map(a => {
                const sc = STATUS_COLOR[a.status]
                return (
                  <tr key={a.name} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-white font-semibold whitespace-nowrap">{a.name}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] text-xs">{a.role}</td>
                    <td className="px-4 py-3"><span className="text-xs font-mono text-purple-400">{a.model}</span></td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{a.owner}</td>
                    <td className="px-4 py-3 text-white font-bold">{a.tasksDay.toLocaleString()}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{a.latency}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>{a.status}</span>
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
