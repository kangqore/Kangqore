import { Building2 } from 'lucide-react'

const ACCENT = '#14B8A6'

type HealthColor = 'GREEN' | 'AMBER' | 'RED'

interface Account {
  name:          string
  arr:           string
  score:         number
  health:        HealthColor
  csm:           string
  contractEnd:   string
  lastTouch:     string
}

const ACCOUNTS: Account[] = [
  { name: 'Acme Corp',    arr: '£120k', score: 92, health: 'GREEN', csm: 'Lena Park',  contractEnd: '2027-01-31', lastTouch: '2d ago'  },
  { name: 'GlobalMed',   arr: '£340k', score: 88, health: 'GREEN', csm: 'Raj Mehta',  contractEnd: '2026-12-31', lastTouch: '1d ago'  },
  { name: 'FinServ Ltd', arr: '£95k',  score: 61, health: 'RED',   csm: 'Lena Park',  contractEnd: '2026-07-28', lastTouch: '8d ago'  },
  { name: 'TechScale',   arr: '£60k',  score: 79, health: 'AMBER', csm: 'Raj Mehta',  contractEnd: '2026-11-30', lastTouch: '5d ago'  },
  { name: 'DataCo',      arr: '£210k', score: 85, health: 'GREEN', csm: 'Lena Park',  contractEnd: '2027-03-31', lastTouch: '3d ago'  },
  { name: 'ManuFlex',    arr: '£85k',  score: 74, health: 'AMBER', csm: 'Raj Mehta',  contractEnd: '2026-09-30', lastTouch: '6d ago'  },
  { name: 'LegalPlus',   arr: '£45k',  score: 90, health: 'GREEN', csm: 'Raj Mehta',  contractEnd: '2027-02-28', lastTouch: '1d ago'  },
  { name: 'RetailGiant', arr: '£180k', score: 82, health: 'GREEN', csm: 'Lena Park',  contractEnd: '2026-10-31', lastTouch: '2d ago'  },
]

const HEALTH_COLOR: Record<HealthColor, { bg: string; text: string; label: string }> = {
  GREEN: { bg: '#10B98122', text: '#10B981', label: 'Healthy' },
  AMBER: { bg: '#F59E0B22', text: '#F59E0B', label: 'At Risk'  },
  RED:   { bg: '#EF444422', text: '#EF4444', label: 'Critical' },
}

export function CSAccounts() {
  const total   = ACCOUNTS.length
  const healthy = ACCOUNTS.filter(a => a.health === 'GREEN').length
  const atRisk  = ACCOUNTS.filter(a => a.health === 'AMBER' || a.health === 'RED').length
  const churned = 3

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Building2 size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Account Portfolio</h1>
          <p className="text-sm text-[var(--os-text-2)]">Full account register with ARR, health scores and CSM coverage</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Accounts', value: String(total),  color: ACCENT    },
          { label: 'Healthy',        value: String(healthy), color: '#10B981' },
          { label: 'At Risk',        value: String(atRisk),  color: '#F59E0B' },
          { label: 'Churned YTD',    value: String(churned), color: '#EF4444' },
          { label: 'NRR',            value: '112%',          color: '#A78BFA' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* KIMMP insight */}
      <div className="p-4 rounded-2xl border border-teal-500/30 bg-teal-500/10">
        <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-1">KIMMP Intelligence</p>
        <p className="text-sm text-[var(--os-text-1)]">
          FinServ Ltd health dropped 14 points in 30 days. Last support ticket unresolved 8 days.
          Recommend CSM outreach today.
        </p>
      </div>

      {/* Account table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider px-5 py-3 border-b border-white/10">
          <span>Account</span>
          <span>ARR</span>
          <span>Health</span>
          <span>CSM</span>
          <span>Contract End</span>
          <span>Last Touch</span>
        </div>
        {ACCOUNTS.map(a => {
          const hc = HEALTH_COLOR[a.health]
          return (
            <div
              key={a.name}
              className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] items-center px-5 py-4 border-b border-white/5 hover:bg-slate-800/40 transition-colors ${a.health === 'RED' ? 'bg-red-500/5' : ''}`}
            >
              <span className="text-sm font-semibold text-white">{a.name}</span>
              <span className="text-sm text-[var(--os-text-1)]">{a.arr}</span>
              <span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: hc.bg, color: hc.text }}>
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: hc.text }} />
                  {hc.label} · {a.score}
                </span>
              </span>
              <span className="text-sm text-[var(--os-text-1)]">{a.csm}</span>
              <span className="text-sm text-[var(--os-text-2)]">{a.contractEnd}</span>
              <span className="text-sm text-[var(--os-text-2)]">{a.lastTouch}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
