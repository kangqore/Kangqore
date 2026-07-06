import { Sparkles } from 'lucide-react'
import { ShieldCheck } from '@phosphor-icons/react'

const ACCENT = '#16A34A'

type BCPStatus = 'Active' | 'Needs Review' | 'Not Tested'

interface BCPItem {
  system:    string
  rto:       number
  rpo:       number
  planOwner: string
  lastTested: string
  testResult: string
  status:    BCPStatus
}

const BCP_ITEMS: BCPItem[] = [
  { system: 'Production Database (PostgreSQL)', rto: 4,   rpo: 1,  planOwner: 'Suresh Nambiar', lastTested: '2026-02-28', testResult: 'Fail — recovery took 6.2h', status: 'Needs Review' },
  { system: 'AWS Infrastructure',               rto: 2,   rpo: 0.5,planOwner: 'Suresh Nambiar', lastTested: '2026-04-15', testResult: 'Pass — recovered in 1.8h',   status: 'Active' },
  { system: 'Salesforce CRM',                  rto: 8,   rpo: 4,  planOwner: 'Leela Krishnan', lastTested: '2026-03-01', testResult: 'Pass — standard fallback',    status: 'Active' },
  { system: 'Email & Communication',            rto: 2,   rpo: 1,  planOwner: 'Leela Krishnan', lastTested: '2025-12-01', testResult: 'Pass — Microsoft 365 failover',status: 'Needs Review' },
  { system: 'Kangqore OS / Frontend',           rto: 1,   rpo: 0,  planOwner: 'Suresh Nambiar', lastTested: '2026-06-01', testResult: 'Pass — CDN failover instant', status: 'Active' },
  { system: 'Finance System (Xero)',            rto: 24,  rpo: 8,  planOwner: 'Leela Krishnan', lastTested: 'N/A',        testResult: 'Not tested',                 status: 'Not Tested' },
  { system: 'Support Platform (Zendesk)',       rto: 4,   rpo: 2,  planOwner: 'Suresh Nambiar', lastTested: 'N/A',        testResult: 'Not tested',                 status: 'Not Tested' },
  { system: 'HR & Payroll System',             rto: 48,  rpo: 24, planOwner: 'Leela Krishnan', lastTested: 'N/A',        testResult: 'Not tested',                 status: 'Not Tested' },
]

const STATUS_COLOR: Record<BCPStatus, string> = {
  Active:        '#10B981',
  'Needs Review':'#F59E0B',
  'Not Tested':  '#EF4444',
}

export function OpsBCP() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <ShieldCheck size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Business Continuity Plans</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">BCP register — RTO / RPO targets, test results and plan status.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Plans',   value: String(BCP_ITEMS.filter(b => b.status === 'Active').length),       color: '#10B981' },
          { label: 'Needs Review',   value: String(BCP_ITEMS.filter(b => b.status === 'Needs Review').length), color: '#F59E0B' },
          { label: 'Not Tested',     value: String(BCP_ITEMS.filter(b => b.status === 'Not Tested').length),   color: '#EF4444' },
          { label: 'BCP Coverage',   value: `${Math.round(BCP_ITEMS.filter(b => b.status === 'Active').length / BCP_ITEMS.length * 100)}%`, color: ACCENT },
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
          Production Database BCP failed its last test — actual recovery took 6.2h against a 4h RTO target. This must be
          re-tested before the ISO 27001 audit in July (A.17 control). Finance, Support and HR systems have never been
          tested — schedule a tabletop exercise for all three in July. The Kangqore OS BCP is the strongest at RTO 1h
          with CDN failover — document this as a showcase example for the ISO audit evidence pack.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['System / Process', 'RTO (hrs)', 'RPO (hrs)', 'Plan Owner', 'Last Tested', 'Test Result', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {BCP_ITEMS.map(b => {
                const sc = STATUS_COLOR[b.status]
                return (
                  <tr key={b.system} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{b.system}</td>
                    <td className="px-4 py-3 text-white font-bold">{b.rto}</td>
                    <td className="px-4 py-3 text-white font-bold">{b.rpo}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{b.planOwner}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{b.lastTested}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] text-xs">{b.testResult}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>{b.status}</span>
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
