import { Sparkles } from 'lucide-react'
import { Article } from '@phosphor-icons/react'

const ACCENT = '#16A34A'

interface OpsReport {
  name:          string
  frequency:     string
  owner:         string
  lastPublished: string
  recipients:    string
  format:        string
}

const REPORTS: OpsReport[] = [
  { name: 'Weekly Operations Review',      frequency: 'Weekly (Mon)',   owner: 'Suresh Nambiar', lastPublished: '2026-06-23', recipients: 'Leadership Team',    format: 'Slide Deck' },
  { name: 'Monthly KPI Scorecard',         frequency: 'Monthly (1st)',  owner: 'Leela Krishnan', lastPublished: '2026-06-01', recipients: 'MD, Directors',      format: 'PDF' },
  { name: 'Capacity Planning Report',      frequency: 'Monthly (15th)', owner: 'Suresh Nambiar', lastPublished: '2026-06-15', recipients: 'Department Heads',   format: 'Excel' },
  { name: 'Vendor SLA Performance Report', frequency: 'Monthly (5th)',  owner: 'Leela Krishnan', lastPublished: '2026-06-05', recipients: 'COO, Procurement',   format: 'PDF' },
  { name: 'BCP Status Report',             frequency: 'Quarterly',      owner: 'Suresh Nambiar', lastPublished: '2026-04-01', recipients: 'MD, CISO',          format: 'PDF' },
  { name: 'Process Improvement Log',       frequency: 'Monthly (1st)',  owner: 'Leela Krishnan', lastPublished: '2026-06-01', recipients: 'Operations Team',    format: 'Confluence' },
  { name: 'Approval Queue Status',         frequency: 'Daily',          owner: 'Suresh Nambiar', lastPublished: '2026-06-24', recipients: 'Approvers (Slack)', format: 'Slack' },
  { name: 'SLA Breach Alert',              frequency: 'Ad-hoc',         owner: 'Leela Krishnan', lastPublished: '2026-06-21', recipients: 'COO, Vendor Owner', format: 'Email' },
]

export function OpsReporting() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Article size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Operational Reports</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Scheduled and ad-hoc operational reporting — owners, recipients and formats.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Reports', value: String(REPORTS.length),                                                 color: ACCENT },
          { label: 'PDF',           value: String(REPORTS.filter(r => r.format === 'PDF').length),             color: '#EF4444' },
          { label: 'Excel',         value: String(REPORTS.filter(r => r.format === 'Excel').length),           color: '#10B981' },
          { label: 'Automated',     value: String(REPORTS.filter(r => ['Slack', 'Email'].includes(r.format)).length), color: '#6366F1' },
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
          BCP Status Report is quarterly and was last published in April — publish the Q2 report by end of June to
          align with the ISO 27001 audit cycle. The Capacity Planning Report is due 15 July; given the Engineering Red
          alert, ensure the headcount recommendation is prominently featured. Automate the Vendor SLA Performance Report
          using KIMMP data pipeline to reduce the manual preparation time from ~3h to ~20 minutes.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Report', 'Frequency', 'Owner', 'Last Published', 'Recipients', 'Format'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {REPORTS.map(r => (
                <tr key={r.name} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{r.frequency}</td>
                  <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{r.owner}</td>
                  <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{r.lastPublished}</td>
                  <td className="px-4 py-3 text-[var(--os-text-2)]">{r.recipients}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-700/60 text-[var(--os-text-1)]">{r.format}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
