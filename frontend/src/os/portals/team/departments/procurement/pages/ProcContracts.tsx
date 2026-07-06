import { Sparkles } from 'lucide-react'
import { Handshake } from '@phosphor-icons/react'

const ACCENT = '#7C3AED'

type ContractStatus = 'Active' | 'Expiring Soon' | 'Expired' | 'Under Review'

interface Contract {
  id:     string
  vendor: string
  type:   string
  value:  string
  start:  string
  expiry: string
  status: ContractStatus
}

const CONTRACTS: Contract[] = [
  { id: 'CTR-001', vendor: 'AWS',                type: 'MSA',  value: '£148,000 pa', start: '2025-01-01', expiry: '2027-12-31', status: 'Active' },
  { id: 'CTR-002', vendor: 'Salesforce',          type: 'MSA',  value: '£64,000 pa',  start: '2024-04-01', expiry: '2026-03-31', status: 'Expired' },
  { id: 'CTR-003', vendor: 'Slack Technologies',  type: 'SLA',  value: '£8,200 pa',   start: '2025-06-01', expiry: '2026-05-31', status: 'Expiring Soon' },
  { id: 'CTR-004', vendor: 'NCC Group',           type: 'SOW',  value: '£18,000',     start: '2026-02-01', expiry: '2026-07-31', status: 'Active' },
  { id: 'CTR-005', vendor: 'Dell Technologies',   type: 'MSA',  value: '£24,000 pa',  start: '2025-09-01', expiry: '2028-08-31', status: 'Active' },
  { id: 'CTR-006', vendor: 'Westlaw',             type: 'SLA',  value: '£5,400 pa',   start: '2025-07-01', expiry: '2026-06-30', status: 'Expiring Soon' },
  { id: 'CTR-007', vendor: 'BSI Group',           type: 'SOW',  value: '£22,000',     start: '2026-05-01', expiry: '2026-08-31', status: 'Active' },
  { id: 'CTR-008', vendor: 'Legacy Print Co.',    type: 'MSA',  value: '£1,800 pa',   start: '2022-01-01', expiry: '2026-12-31', status: 'Under Review' },
]

const STATUS_COLOR: Record<ContractStatus, string> = {
  'Active':        '#10B981',
  'Expiring Soon': '#F59E0B',
  'Expired':       '#EF4444',
  'Under Review':  '#6366F1',
}

export function ProcContracts() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Handshake size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Contract Register</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Active contracts, renewals and vendor agreement status.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active',        value: String(CONTRACTS.filter(c => c.status === 'Active').length),        color: '#10B981' },
          { label: 'Expiring Soon', value: String(CONTRACTS.filter(c => c.status === 'Expiring Soon').length), color: '#F59E0B' },
          { label: 'Expired',       value: String(CONTRACTS.filter(c => c.status === 'Expired').length),       color: '#EF4444' },
          { label: 'Under Review',  value: String(CONTRACTS.filter(c => c.status === 'Under Review').length),  color: '#6366F1' },
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
          Salesforce MSA has expired — the team is operating on expired terms which creates commercial risk. Prioritise
          renewal negotiation immediately; leverage renewal for improved pricing given multi-year commitment. Slack and Westlaw
          both expire within 30 days — initiate renewal workflows now. The NCC Group SOW expires 31 July; confirm scope extension if pen test remediation is not complete.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['ID', 'Vendor', 'Type', 'Value', 'Start', 'Expiry', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {CONTRACTS.map(c => {
                const sc = STATUS_COLOR[c.status]
                return (
                  <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3"><span className="text-xs font-mono text-[var(--os-text-2)]">{c.id}</span></td>
                    <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{c.vendor}</td>
                    <td className="px-4 py-3"><span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-700/60 text-[var(--os-text-1)]">{c.type}</span></td>
                    <td className="px-4 py-3 text-white font-semibold whitespace-nowrap">{c.value}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{c.start}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{c.expiry}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>{c.status}</span>
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
