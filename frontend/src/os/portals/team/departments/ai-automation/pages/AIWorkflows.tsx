import { Sparkles } from 'lucide-react'
import { Lightning } from '@phosphor-icons/react'

const ACCENT = '#D946EF'

type TriggerType = 'Schedule' | 'Event' | 'Manual'
type WorkflowStatus = 'Active' | 'Paused' | 'Error'

interface Workflow {
  name:       string
  trigger:    TriggerType
  steps:      number
  runsMonth:  number
  avgDuration: string
  lastRun:    string
  status:     WorkflowStatus
}

const WORKFLOWS: Workflow[] = [
  { name: 'New Lead Enrichment',           trigger: 'Event',    steps: 5,  runsMonth: 284,  avgDuration: '12s',  lastRun: '2026-06-24 09:14', status: 'Active' },
  { name: 'Weekly Executive Report Gen',   trigger: 'Schedule', steps: 8,  runsMonth: 4,    avgDuration: '4m 20s',lastRun: '2026-06-23 07:00', status: 'Active' },
  { name: 'Support Ticket Triage',         trigger: 'Event',    steps: 4,  runsMonth: 1240, avgDuration: '3s',   lastRun: '2026-06-24 09:42', status: 'Active' },
  { name: 'Invoice Processing',            trigger: 'Event',    steps: 6,  runsMonth: 84,   avgDuration: '45s',  lastRun: '2026-06-23 16:30', status: 'Active' },
  { name: 'Churn Risk Alert',              trigger: 'Schedule', steps: 3,  runsMonth: 30,   avgDuration: '2m 10s',lastRun: '2026-06-24 06:00', status: 'Active' },
  { name: 'GitHub PR Review Trigger',      trigger: 'Event',    steps: 3,  runsMonth: 96,   avgDuration: '4m',   lastRun: '2026-06-24 08:52', status: 'Active' },
  { name: 'Monthly Finance Reconciliation',trigger: 'Schedule', steps: 12, runsMonth: 1,    avgDuration: '18m',  lastRun: '2026-06-01 23:00', status: 'Active' },
  { name: 'Outbound Email Sequence',       trigger: 'Manual',   steps: 5,  runsMonth: 12,   avgDuration: '1m',   lastRun: '2026-06-20 11:00', status: 'Paused' },
  { name: 'Legacy Data Sync',              trigger: 'Schedule', steps: 4,  runsMonth: 120,  avgDuration: '8m',   lastRun: '2026-06-23 02:00', status: 'Error' },
]

const TRIGGER_COLOR: Record<TriggerType, string> = { Schedule: '#6366F1', Event: '#10B981', Manual: '#F59E0B' }
const STATUS_COLOR: Record<WorkflowStatus, string> = { Active: '#10B981', Paused: '#F59E0B', Error: '#EF4444' }

export function AIWorkflows() {
  const totalRuns = WORKFLOWS.reduce((acc, w) => acc + w.runsMonth, 0)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Lightning size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Automation Workflows</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Active workflow automations — triggers, run frequency and status.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Workflows', value: String(WORKFLOWS.filter(w => w.status === 'Active').length), color: '#10B981' },
          { label: 'Runs This Month', value: totalRuns.toLocaleString(),                                    color: ACCENT },
          { label: 'Errors',          value: String(WORKFLOWS.filter(w => w.status === 'Error').length),   color: '#EF4444' },
          { label: 'Paused',          value: String(WORKFLOWS.filter(w => w.status === 'Paused').length),  color: '#F59E0B' },
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
          Legacy Data Sync is in Error — this is feeding the Finance reconciliation workflow. Investigate immediately;
          failure will impact Month-End Close if not resolved before 1 July. Support Ticket Triage at 1,240 runs/month
          is the highest-frequency workflow — ensure error rate is below 1%. The 18-minute Monthly Finance Reconciliation
          should be profiled for optimisation; target sub-10 minutes.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Workflow', 'Trigger', 'Steps', 'Runs/Month', 'Avg Duration', 'Last Run', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {WORKFLOWS.map(w => {
                const tc = TRIGGER_COLOR[w.trigger]
                const sc = STATUS_COLOR[w.status]
                return (
                  <tr key={w.name} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{w.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${tc}22`, color: tc }}>{w.trigger}</span>
                    </td>
                    <td className="px-4 py-3 text-[var(--os-text-2)]">{w.steps}</td>
                    <td className="px-4 py-3 text-white font-bold">{w.runsMonth.toLocaleString()}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{w.avgDuration}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap text-xs">{w.lastRun}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>{w.status}</span>
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
