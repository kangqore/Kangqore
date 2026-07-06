import { Sparkles } from 'lucide-react'
import { Gavel } from '@phosphor-icons/react'

const ACCENT = '#B91C1C'

type AuditStatus = 'Scheduled' | 'In Progress' | 'Complete' | 'Failed'

interface Audit {
  id:       string
  name:     string
  auditor:  string
  scope:    string
  date:     string
  status:   AuditStatus
}

const AUDITS: Audit[] = [
  { id: 'AUD-001', name: 'ISO 27001 Stage 2',        auditor: 'BSI Group',          scope: 'ISMS full scope — 114 controls',           date: '2026-07-28', status: 'Scheduled' },
  { id: 'AUD-002', name: 'SOC 2 Type II Annual',     auditor: 'Deloitte',           scope: 'Security, Availability, Confidentiality',   date: '2027-05-01', status: 'Scheduled' },
  { id: 'AUD-003', name: 'GDPR Internal Audit',      auditor: 'Maya Nair (Internal)',scope: 'ROPA, DPA, consent mechanisms',             date: '2026-07-10', status: 'In Progress' },
  { id: 'AUD-004', name: 'DPDP Readiness Review',    auditor: 'PwC India',          scope: 'DPDP Act compliance gap assessment',        date: '2026-08-15', status: 'Scheduled' },
  { id: 'AUD-005', name: 'Q1 Internal Controls Audit',auditor: 'Arjun Singh (Internal)',scope: 'Financial controls, access management',  date: '2026-04-30', status: 'Complete' },
  { id: 'AUD-006', name: 'Vendor Security Assessment',auditor: 'Maya Nair (Internal)',scope: '6 Tier 1 vendors — security posture',       date: '2026-05-15', status: 'Complete' },
  { id: 'AUD-007', name: 'Penetration Test',         auditor: 'NCC Group',          scope: 'External & internal network, web apps',     date: '2026-03-20', status: 'Complete' },
  { id: 'AUD-008', name: 'Business Continuity Test', auditor: 'Arjun Singh (Internal)',scope: 'DR drill — core systems failover',         date: '2026-02-28', status: 'Failed' },
]

const STATUS_COLOR: Record<AuditStatus, string> = {
  'Scheduled':   '#6366F1',
  'In Progress': '#F59E0B',
  'Complete':    '#10B981',
  'Failed':      '#EF4444',
}

export function RCAuditManagement() {
  const counts = {
    Scheduled:   AUDITS.filter(a => a.status === 'Scheduled').length,
    'In Progress': AUDITS.filter(a => a.status === 'In Progress').length,
    Complete:    AUDITS.filter(a => a.status === 'Complete').length,
    Failed:      AUDITS.filter(a => a.status === 'Failed').length,
  }

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Gavel size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Audit Management</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Audit schedule, status and outcomes — internal and external.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Scheduled',   value: String(counts['Scheduled']),   color: '#6366F1' },
          { label: 'In Progress', value: String(counts['In Progress']), color: '#F59E0B' },
          { label: 'Complete',    value: String(counts['Complete']),    color: '#10B981' },
          { label: 'Failed',      value: String(counts['Failed']),      color: '#EF4444' },
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
          The failed Business Continuity Test (AUD-008) has not been re-run — 4 months overdue. ISO 27001 A.17 requires
          tested and documented BCP. Schedule a re-test before the Stage 2 audit on 28 July or risk a major non-conformity.
          GDPR internal audit (AUD-003) is in progress — prioritise DPA review to close within 2 weeks.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['ID', 'Audit Name', 'Auditor', 'Scope', 'Date', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {AUDITS.map(a => {
                const sc = STATUS_COLOR[a.status]
                return (
                  <tr key={a.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3"><span className="text-xs font-mono text-[var(--os-text-2)]">{a.id}</span></td>
                    <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{a.name}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{a.auditor}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] max-w-xs">{a.scope}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{a.date}</td>
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
