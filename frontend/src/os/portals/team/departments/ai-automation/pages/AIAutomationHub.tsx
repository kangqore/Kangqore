import { Sparkles } from 'lucide-react'
import { PlugsConnected } from '@phosphor-icons/react'

const ACCENT = '#D946EF'

type HubStatus = 'Active' | 'Paused' | 'Building'

interface Automation {
  name:         string
  category:     string
  tool:         string
  tasksSavedWk: number
  status:       HubStatus
}

const AUTOMATIONS: Automation[] = [
  { name: 'Lead Enrichment Pipeline',       category: 'Sales',         tool: 'Custom (KIMMP)',  tasksSavedWk: 240, status: 'Active' },
  { name: 'Support Ticket Auto-Triage',     category: 'Support',       tool: 'Custom (KIMMP)',  tasksSavedWk: 180, status: 'Active' },
  { name: 'Invoice OCR & Coding',           category: 'Finance',       tool: 'n8n',             tasksSavedWk: 120, status: 'Active' },
  { name: 'PR Code Review Automation',      category: 'Engineering',   tool: 'Custom (KIMMP)',  tasksSavedWk: 96,  status: 'Active' },
  { name: 'Marketing Email Sequences',      category: 'Marketing',     tool: 'HubSpot',         tasksSavedWk: 84,  status: 'Active' },
  { name: 'Employee Onboarding Workflow',   category: 'HR',            tool: 'n8n',             tasksSavedWk: 60,  status: 'Active' },
  { name: 'Weekly Report Generation',       category: 'Analytics',     tool: 'Custom (KIMMP)',  tasksSavedWk: 48,  status: 'Active' },
  { name: 'Contract Extraction & Review',   category: 'Legal',         tool: 'Custom (KIMMP)',  tasksSavedWk: 36,  status: 'Active' },
  { name: 'Social Media Scheduling',        category: 'Marketing',     tool: 'Zapier',          tasksSavedWk: 24,  status: 'Paused' },
  { name: 'Vendor Invoice Reconciliation',  category: 'Procurement',   tool: 'n8n',             tasksSavedWk: 72,  status: 'Building' },
  { name: 'Compliance Evidence Collection', category: 'Risk',          tool: 'Custom (KIMMP)',  tasksSavedWk: 48,  status: 'Building' },
  { name: 'Data Quality Monitoring',        category: 'Analytics',     tool: 'Custom (KIMMP)',  tasksSavedWk: 120, status: 'Active' },
]

const TOOL_COLOR: Record<string, string> = {
  'Custom (KIMMP)': '#D946EF',
  'n8n':            '#F97316',
  'HubSpot':        '#F59E0B',
  'Zapier':         '#FF4A00',
}

const STATUS_COLOR: Record<HubStatus, string> = {
  Active:   '#10B981',
  Paused:   '#F59E0B',
  Building: '#6366F1',
}

export function AIAutomationHub() {
  const active = AUTOMATIONS.filter(a => a.status === 'Active')
  const totalSaved = AUTOMATIONS.reduce((acc, a) => acc + a.tasksSavedWk, 0)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <PlugsConnected size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Automation Hub</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Full catalogue of business automations — tools, savings and status.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Automations', value: String(active.length),       color: '#10B981' },
          { label: 'Tasks Saved/Week',   value: `${totalSaved.toLocaleString()}`, color: ACCENT },
          { label: 'Building',           value: String(AUTOMATIONS.filter(a => a.status === 'Building').length), color: '#6366F1' },
          { label: 'Paused',             value: String(AUTOMATIONS.filter(a => a.status === 'Paused').length),   color: '#F59E0B' },
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
          {totalSaved.toLocaleString()} tasks saved per week across all automations — equivalent to approximately{' '}
          {Math.round(totalSaved * 0.1)} hours of manual work. Lead Enrichment and Support Triage are the highest-value
          automations. Vendor Invoice Reconciliation (in building) will save 72 tasks/week once live — accelerate delivery
          before month-end close. Social Media Scheduling is paused; assess whether to resume or replace with KIMMP content agent.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Automation', 'Category', 'Tool', 'Tasks Saved/Wk', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {AUTOMATIONS.map(a => {
                const tc = TOOL_COLOR[a.tool] ?? '#6B7280'
                const sc = STATUS_COLOR[a.status]
                return (
                  <tr key={a.name} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{a.name}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{a.category}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${tc}22`, color: tc }}>{a.tool}</span>
                    </td>
                    <td className="px-4 py-3 text-white font-bold">{a.tasksSavedWk}</td>
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
