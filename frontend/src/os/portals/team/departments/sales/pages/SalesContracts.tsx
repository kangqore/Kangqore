import { Handshake } from 'lucide-react'

const ACCENT = '#0EA5E9'

type ContractStatus = 'Active' | 'Pending Signature' | 'Expiring Soon' | 'Renewed'
type ContractType   = 'MSA' | 'SOW' | 'NDA'

interface Contract {
  id:      string
  client:  string
  value:   string
  type:    ContractType
  status:  ContractStatus
  expiry:  string
}

const CONTRACTS: Contract[] = [
  { id: 'CON-001', client: 'Acme Corp',       value: '£120k', type: 'MSA', status: 'Active',            expiry: '2027-03-31' },
  { id: 'CON-002', client: 'GlobalMed',        value: '£340k', type: 'MSA', status: 'Pending Signature', expiry: '2027-06-30' },
  { id: 'CON-003', client: 'FinServ Ltd',      value: '£95k',  type: 'SOW', status: 'Expiring Soon',     expiry: '2026-08-15' },
  { id: 'CON-004', client: 'TechScale Inc',    value: '£60k',  type: 'MSA', status: 'Active',            expiry: '2026-12-31' },
  { id: 'CON-005', client: 'BlueArch Capital', value: '£85k',  type: 'SOW', status: 'Expiring Soon',     expiry: '2026-07-30' },
  { id: 'CON-006', client: 'LogiCore Systems', value: '£45k',  type: 'NDA', status: 'Renewed',           expiry: '2027-01-15' },
]

const STATUS_COLOR: Record<ContractStatus, string> = {
  'Active':            '#10B981',
  'Pending Signature': '#0EA5E9',
  'Expiring Soon':     '#F59E0B',
  'Renewed':           '#8B5CF6',
}

const TYPE_COLOR: Record<ContractType, string> = {
  MSA: '#6366F1',
  SOW: '#06B6D4',
  NDA: '#F97316',
}

export function SalesContracts() {
  const active    = CONTRACTS.filter(c => c.status === 'Active').length
  const pending   = CONTRACTS.filter(c => c.status === 'Pending Signature').length
  const expiring  = CONTRACTS.filter(c => c.status === 'Expiring Soon').length
  const renewed   = 9

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Handshake size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Contracts</h1>
          <p className="text-sm text-[var(--os-text-2)]">Contract tracker — active, pending and expiring agreements</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active',              value: String(active),  color: '#10B981' },
          { label: 'Pending Signature',   value: String(pending), color: ACCENT    },
          { label: 'Expiring 90 Days',    value: String(expiring),color: '#F59E0B' },
          { label: 'Renewed YTD',         value: String(renewed), color: '#8B5CF6' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Contracts Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider">Contract ID</th>
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider">Client</th>
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider">Value</th>
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider hidden md:table-cell">Type</th>
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider hidden lg:table-cell">Expiry</th>
            </tr>
          </thead>
          <tbody>
            {CONTRACTS.map((c, i) => {
              const sc  = STATUS_COLOR[c.status]
              const tc  = TYPE_COLOR[c.type]
              const expiring = c.status === 'Expiring Soon'
              return (
                <tr
                  key={c.id}
                  className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.02]'} ${expiring ? 'bg-amber-500/5' : ''}`}
                >
                  <td className="px-5 py-3 font-mono text-xs text-[var(--os-text-2)]">{c.id}</td>
                  <td className="px-5 py-3 text-white font-semibold">{c.client}</td>
                  <td className="px-5 py-3 text-white font-bold">{c.value}</td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${tc}22`, color: tc }}>
                      {c.type}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>
                      {c.status}
                    </span>
                  </td>
                  <td className={`px-5 py-3 text-xs hidden lg:table-cell ${expiring ? 'text-amber-400 font-semibold' : 'text-[var(--os-text-2)]'}`}>
                    {c.expiry}
                    {expiring && <span className="ml-2 text-amber-500">(⚠ Soon)</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
