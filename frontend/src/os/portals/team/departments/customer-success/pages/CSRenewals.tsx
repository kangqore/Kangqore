import { CalendarDays } from 'lucide-react'

const ACCENT = '#14B8A6'

type HealthColor = 'GREEN' | 'AMBER' | 'RED'
type RiskFlag    = 'Low' | 'Medium' | 'High — Likely Churn'

interface Renewal {
  account:     string
  arr:         string
  renewalDate: string
  health:      HealthColor
  riskFlag:    RiskFlag
  action:      string
}

const RENEWALS: Renewal[] = [
  { account: 'FinServ Ltd',  arr: '£95k',  renewalDate: '2026-07-28', health: 'RED',   riskFlag: 'High — Likely Churn', action: 'Executive escalation + discount offer'  },
  { account: 'ManuFlex',    arr: '£85k',  renewalDate: '2026-09-30', health: 'AMBER', riskFlag: 'Medium',               action: 'Recovery plan underway'                 },
  { account: 'AgileSystems',arr: '£55k',  renewalDate: '2026-09-15', health: 'AMBER', riskFlag: 'Medium',               action: 'CSM check-in scheduled'                 },
  { account: 'TechScale',   arr: '£60k',  renewalDate: '2026-11-30', health: 'AMBER', riskFlag: 'Low',                  action: 'Standard renewal cycle'                 },
  { account: 'GlobalMed',   arr: '£340k', renewalDate: '2026-12-31', health: 'GREEN', riskFlag: 'Low',                  action: 'On track — QBR booked Jul'              },
  { account: 'RetailGiant', arr: '£180k', renewalDate: '2026-10-31', health: 'GREEN', riskFlag: 'Low',                  action: 'Expansion discussion in progress'        },
  { account: 'DataCo',      arr: '£210k', renewalDate: '2027-03-31', health: 'GREEN', riskFlag: 'Low',                  action: 'Early renewal incentive offer sent'      },
]

const HEALTH_COLOR: Record<HealthColor, { bg: string; text: string; label: string }> = {
  GREEN: { bg: '#10B98122', text: '#10B981', label: 'Healthy' },
  AMBER: { bg: '#F59E0B22', text: '#F59E0B', label: 'At Risk'  },
  RED:   { bg: '#EF444422', text: '#EF4444', label: 'Critical' },
}

const RISK_COLOR: Record<RiskFlag, string> = {
  'Low':                  '#10B981',
  'Medium':               '#F59E0B',
  'High — Likely Churn':  '#EF4444',
}

export function CSRenewals() {
  const renewingIn90 = 7
  const arrAtRisk    = '£840k'
  const renewed      = 4
  const churnRisk    = 2

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <CalendarDays size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Renewal Pipeline</h1>
          <p className="text-sm text-[var(--os-text-2)]">Upcoming renewals, ARR at risk, and churn risk flags</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Renewing in 90 Days', value: String(renewingIn90), color: ACCENT    },
          { label: 'Total ARR at Risk',   value: arrAtRisk,            color: '#EF4444' },
          { label: 'Already Renewed',     value: String(renewed),      color: '#10B981' },
          { label: 'Churn Risk',          value: String(churnRisk),    color: '#F97316' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* KIMMP */}
      <div className="p-4 rounded-2xl border border-teal-500/30 bg-teal-500/10">
        <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-1">KIMMP Intelligence</p>
        <p className="text-sm text-[var(--os-text-1)]">
          FinServ Ltd renewal in 28 days — health score 61 and declining. Recommend executive sponsor
          escalation + discount offer (max 15%) to retain.
        </p>
      </div>

      {/* Renewal Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr_2fr] text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider px-5 py-3 border-b border-white/10">
          <span>Account</span>
          <span>ARR</span>
          <span>Renewal Date</span>
          <span>Health</span>
          <span>Risk Flag</span>
          <span>Action</span>
        </div>
        {RENEWALS.map(r => {
          const hc  = HEALTH_COLOR[r.health]
          const rc  = RISK_COLOR[r.riskFlag]
          const isHighRisk = r.riskFlag === 'High — Likely Churn'
          return (
            <div
              key={r.account}
              className={`grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr_2fr] items-center px-5 py-4 border-b border-white/5 hover:bg-slate-800/40 transition-colors ${isHighRisk ? 'bg-red-500/5' : ''}`}
            >
              <span className="text-sm font-semibold text-white">{r.account}</span>
              <span className="text-sm text-[var(--os-text-1)]">{r.arr}</span>
              <span className={`text-sm ${isHighRisk ? 'text-red-400 font-semibold' : 'text-[var(--os-text-1)]'}`}>{r.renewalDate}</span>
              <span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: hc.bg, color: hc.text }}>
                  {hc.label}
                </span>
              </span>
              <span className="text-xs font-semibold" style={{ color: rc }}>{r.riskFlag}</span>
              <span className="text-xs text-[var(--os-text-2)]">{r.action}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
