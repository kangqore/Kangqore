import { Sparkles } from 'lucide-react'
import { Article } from '@phosphor-icons/react'

const ACCENT = '#0284C7'

interface Report {
  name:       string
  frequency:  string
  format:     string
  recipients: string
  lastSent:   string
  nextRun:    string
}

const REPORTS: Report[] = [
  { name: 'Weekly Executive Summary',     frequency: 'Weekly (Mon)',    format: 'PDF',   recipients: 'MD, Directors',      lastSent: '2026-06-23', nextRun: '2026-06-30' },
  { name: 'Monthly Finance Report',       frequency: 'Monthly (1st)',   format: 'Excel', recipients: 'CFO, Finance Team',  lastSent: '2026-06-01', nextRun: '2026-07-01' },
  { name: 'Sales Pipeline Digest',        frequency: 'Daily (8am)',     format: 'Slack', recipients: '#sales channel',     lastSent: '2026-06-24', nextRun: '2026-06-25' },
  { name: 'Marketing Performance Report', frequency: 'Weekly (Fri)',    format: 'PDF',   recipients: 'CMO, Marketing Team',lastSent: '2026-06-20', nextRun: '2026-06-27' },
  { name: 'Engineering Sprint Report',    frequency: 'Bi-weekly',       format: 'Slack', recipients: '#engineering',       lastSent: '2026-06-17', nextRun: '2026-07-01' },
  { name: 'Support SLA Report',           frequency: 'Weekly (Mon)',    format: 'PDF',   recipients: 'Support Manager',    lastSent: '2026-06-23', nextRun: '2026-06-30' },
  { name: 'QBR Data Pack',               frequency: 'Quarterly',       format: 'Excel', recipients: 'CS Managers',        lastSent: '2026-04-01', nextRun: '2026-07-01' },
  { name: 'Board Data Pack',             frequency: 'Monthly (25th)',   format: 'PDF',   recipients: 'Board Members',      lastSent: '2026-05-25', nextRun: '2026-06-25' },
]

export function DAReports() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Article size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Scheduled Reports</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Automated report schedule — format, recipients and run cadence.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Total Reports',  value: String(REPORTS.length), color: ACCENT },
          { label: 'PDF',            value: String(REPORTS.filter(r => r.format === 'PDF').length),   color: '#EF4444' },
          { label: 'Excel',          value: String(REPORTS.filter(r => r.format === 'Excel').length), color: '#10B981' },
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
          Board Data Pack is due 25 June — 1 day away. Confirm data cut-off and sign-off process with CFO today.
          QBR Data Pack is due 1 July — coordinate with CS Managers on data completeness. The daily Sales Pipeline
          Digest is the highest-frequency automated report; ensure the pipeline query is optimised to avoid Salesforce
          API throttling during business hours.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Report', 'Frequency', 'Format', 'Recipients', 'Last Sent', 'Next Run'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {REPORTS.map(r => (
                <tr key={r.name} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{r.frequency}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-700/60 text-[var(--os-text-1)]">{r.format}</span>
                  </td>
                  <td className="px-4 py-3 text-[var(--os-text-2)]">{r.recipients}</td>
                  <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{r.lastSent}</td>
                  <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{r.nextRun}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
