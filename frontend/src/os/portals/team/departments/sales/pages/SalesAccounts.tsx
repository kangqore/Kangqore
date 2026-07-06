import { Building2 } from 'lucide-react'

const ACCENT = '#0EA5E9'

type HealthStatus = 'Green' | 'Amber' | 'Red'

interface Account {
  id:           string
  name:         string
  industry:     string
  arr:          string
  health:       HealthStatus
  owner:        string
  lastActivity: string
}

const ACCOUNTS: Account[] = [
  { id: 'ACC-001', name: 'Acme Corp',         industry: 'Technology',      arr: '£120k', health: 'Green', owner: 'Arjun Shah',  lastActivity: '1d ago'  },
  { id: 'ACC-002', name: 'GlobalMed',          industry: 'Healthcare',      arr: '£340k', health: 'Green', owner: 'Arjun Shah',  lastActivity: '2h ago'  },
  { id: 'ACC-003', name: 'FinServ Ltd',        industry: 'Financial Svcs',  arr: '£95k',  health: 'Amber', owner: 'Meera Nair',  lastActivity: '3d ago'  },
  { id: 'ACC-004', name: 'TechScale Inc',      industry: 'SaaS',            arr: '£60k',  health: 'Green', owner: 'Dev Patel',   lastActivity: '5d ago'  },
  { id: 'ACC-005', name: 'BlueArch Capital',   industry: 'Finance',         arr: '£85k',  health: 'Green', owner: 'Meera Nair',  lastActivity: '2d ago'  },
  { id: 'ACC-006', name: 'LogiCore Systems',   industry: 'Logistics',       arr: '£45k',  health: 'Red',   owner: 'Dev Patel',   lastActivity: '10d ago' },
  { id: 'ACC-007', name: 'EduTech Group',      industry: 'Education',       arr: '£30k',  health: 'Amber', owner: 'Meera Nair',  lastActivity: '7d ago'  },
  { id: 'ACC-008', name: 'RetailPulse Ltd',    industry: 'Retail',          arr: '£55k',  health: 'Green', owner: 'Arjun Shah',  lastActivity: '4d ago'  },
]

const HEALTH_COLOR: Record<HealthStatus, string> = {
  Green: '#10B981',
  Amber: '#F59E0B',
  Red:   '#EF4444',
}

export function SalesAccounts() {
  const total      = ACCOUNTS.length
  const active     = ACCOUNTS.filter(a => a.health === 'Green').length
  const atRisk     = ACCOUNTS.filter(a => a.health === 'Amber' || a.health === 'Red').length
  const expansion  = 8

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Building2 size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Accounts</h1>
          <p className="text-sm text-[var(--os-text-2)]">Account directory — health, ARR and expansion opportunities</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Accounts',         value: String(total),    color: ACCENT    },
          { label: 'Active',                 value: String(active),   color: '#10B981' },
          { label: 'At Risk',                value: String(atRisk),   color: '#F59E0B' },
          { label: 'Expansion Opportunities',value: String(expansion),color: '#8B5CF6' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Accounts Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider">Account</th>
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider hidden md:table-cell">Industry</th>
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider">ARR</th>
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider">Health</th>
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider hidden lg:table-cell">Owner</th>
              <th className="text-left px-5 py-3 text-xs text-[var(--os-text-2)] font-semibold uppercase tracking-wider hidden sm:table-cell">Last Activity</th>
            </tr>
          </thead>
          <tbody>
            {ACCOUNTS.map((a, i) => {
              const hc = HEALTH_COLOR[a.health]
              return (
                <tr key={a.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                  <td className="px-5 py-3">
                    <p className="text-white font-semibold">{a.name}</p>
                    <p className="text-xs font-mono text-[var(--os-text-2)]">{a.id}</p>
                  </td>
                  <td className="px-5 py-3 text-[var(--os-text-2)] hidden md:table-cell">{a.industry}</td>
                  <td className="px-5 py-3 text-white font-bold">{a.arr}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: hc }} />
                      <span className="text-xs font-semibold" style={{ color: hc }}>{a.health}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[var(--os-text-2)] hidden lg:table-cell">{a.owner}</td>
                  <td className="px-5 py-3 text-[var(--os-text-2)] text-xs hidden sm:table-cell">{a.lastActivity}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
