import { useState } from 'react'
import { Handshake, Sparkles } from 'lucide-react'

const ACCENT = '#F43F5E'

type SOWStatus = 'Active' | 'Renewal Due' | 'In Negotiation' | 'Closed'

interface SOW {
  id:       string
  client:   string
  project:  string
  value:    string
  signed:   string
  expires:  string
  pm:       string
  status:   SOWStatus
}

const SOWS: SOW[] = [
  { id: 'SOW-001', client: 'Acme Corp',     project: 'Kangqore OS Implementation',  value: '£120,000', signed: '2026-02-01', expires: '2026-08-31', pm: 'Riya Desai',   status: 'Active' },
  { id: 'SOW-002', client: 'GlobalMed',     project: 'BIDS™ Rollout',               value: '£280,000', signed: '2025-10-01', expires: '2026-09-30', pm: 'Sanjay Verma', status: 'Active' },
  { id: 'SOW-003', client: 'DataCo',        project: 'Cognition AI Platform',        value: '£95,000',  signed: '2026-03-15', expires: '2026-10-15', pm: 'Riya Desai',   status: 'Active' },
  { id: 'SOW-004', client: 'FinServ',       project: 'Shield Security Deployment',   value: '£85,000',  signed: '2026-01-10', expires: '2026-07-31', pm: 'Sanjay Verma', status: 'Renewal Due' },
  { id: 'SOW-005', client: 'RetailCo',      project: 'Analytics Dashboard v2',       value: '£62,000',  signed: '2026-04-01', expires: '2026-07-10', pm: 'Riya Desai',   status: 'Renewal Due' },
  { id: 'SOW-006', client: 'HealthGroup',   project: 'Data Migration Programme',     value: '£145,000', signed: '2025-11-01', expires: '2026-11-01', pm: 'Sanjay Verma', status: 'Active' },
  { id: 'SOW-007', client: 'LegalFirst',    project: 'Compliance Automation',        value: '£78,000',  signed: '2026-05-20', expires: '2026-12-15', pm: 'Riya Desai',   status: 'In Negotiation' },
  { id: 'SOW-008', client: 'ManufactureCo', project: 'Cloud Infrastructure Lift',    value: '£190,000', signed: '2026-02-15', expires: '2026-09-01', pm: 'Sanjay Verma', status: 'Active' },
  { id: 'SOW-009', client: 'RetailCo',      project: 'CRM Integration',              value: '£44,000',  signed: '2025-09-01', expires: '2026-06-30', pm: 'Riya Desai',   status: 'Renewal Due' },
  { id: 'SOW-010', client: 'Acme Corp',     project: 'Support Retainer',             value: '£36,000',  signed: '2026-01-01', expires: '2026-12-31', pm: 'Sanjay Verma', status: 'Active' },
  { id: 'SOW-011', client: 'DataCo',        project: 'Managed AI Services',          value: '£72,000',  signed: '2026-04-15', expires: '2026-10-15', pm: 'Riya Desai',   status: 'Active' },
  { id: 'SOW-012', client: 'GlobalMed',     project: 'Training & Enablement',        value: '£48,000',  signed: '2026-05-01', expires: '2026-08-31', pm: 'Sanjay Verma', status: 'Active' },
]

const STATUS_COLOR: Record<SOWStatus, string> = {
  'Active':          '#10B981',
  'Renewal Due':     '#F59E0B',
  'In Negotiation':  '#6366F1',
  'Closed':          '#6B7280',
}

export function DeliverySOWs() {
  const [filter, setFilter] = useState<'ALL' | SOWStatus>('ALL')

  const totalValue = '£2.1M'
  const renewalDue = SOWS.filter(s => s.status === 'Renewal Due').length

  const visible = filter === 'ALL' ? SOWS : SOWS.filter(s => s.status === filter)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Handshake size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Statements of Work</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">12 active SOWs · {totalValue} total managed value</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active SOWs',   value: String(SOWS.length), color: ACCENT },
          { label: 'Total Value',   value: totalValue,           color: '#10B981' },
          { label: 'Renewal Due',   value: String(renewalDue),  color: '#F59E0B' },
          { label: 'Negotiating',   value: '1',                  color: '#6366F1' },
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
          3 SOWs expire within 40 days (SOW-004, 005, 009) — combined value £191K. All 3 clients have health scores above 75.
          Optimal renewal window: reach out 30 days before expiry. SOW-004 (FinServ) is highest risk due to active delivery issues — resolve Shield delays before renewal conversation.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['ALL', 'Active', 'Renewal Due', 'In Negotiation', 'Closed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === f ? 'text-white' : 'bg-slate-800/60 text-[var(--os-text-2)] hover:text-[var(--os-text-1)] border border-white/10'
            }`}
            style={filter === f ? { background: f === 'ALL' ? ACCENT : STATUS_COLOR[f as SOWStatus] } : {}}
          >
            {f === 'ALL' ? 'All SOWs' : f}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['SOW ID', 'Client', 'Project', 'Value', 'Signed', 'Expires', 'PM', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {visible.map(s => {
                const sc = STATUS_COLOR[s.status]
                return (
                  <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap"><span className="text-xs font-mono text-[var(--os-text-2)]">{s.id}</span></td>
                    <td className="px-4 py-3 text-[var(--os-text-1)] whitespace-nowrap font-medium">{s.client}</td>
                    <td className="px-4 py-3 text-[var(--os-text-1)] whitespace-nowrap">{s.project}</td>
                    <td className="px-4 py-3 text-[var(--os-text-1)] whitespace-nowrap font-semibold">{s.value}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{s.signed}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{s.expires}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{s.pm}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>{s.status}</span>
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
