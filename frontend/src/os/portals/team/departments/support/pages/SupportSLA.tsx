import { Clock } from 'lucide-react'

const ACCENT = '#06B6D4'

interface SLATier {
  priority: string
  color: string
  targetFRT: string
  actualFRT: string
  targetRes: string
  actualRes: string
  breaches: number
  breachRate: string
  frtMet: boolean
  resMet: boolean
}

const SLA_DATA: SLATier[] = [
  { priority: 'P1 — Critical',  color: '#EF4444', targetFRT: '1h',  actualFRT: '0.8h', targetRes: '4h',  actualRes: '3.2h',  breaches: 0, breachRate: '0.0%',  frtMet: true,  resMet: true  },
  { priority: 'P2 — High',      color: '#F97316', targetFRT: '4h',  actualFRT: '3.8h', targetRes: '8h',  actualRes: '9.1h',  breaches: 2, breachRate: '6.7%',  frtMet: true,  resMet: false },
  { priority: 'P3 — Medium',    color: '#F59E0B', targetFRT: '8h',  actualFRT: '7.2h', targetRes: '24h', actualRes: '26.3h', breaches: 1, breachRate: '3.8%',  frtMet: true,  resMet: false },
  { priority: 'P4 — Low',       color: '#6B7280', targetFRT: '24h', actualFRT: '18h',  targetRes: '72h', actualRes: '68h',   breaches: 0, breachRate: '0.0%',  frtMet: true,  resMet: true  },
]

const WEEKLY_TREND = [
  { week: 'W23 (2–8 Jun)',    overall: '93.1%', frt: '97.2%', resolution: '90.3%' },
  { week: 'W24 (9–15 Jun)',   overall: '91.8%', frt: '96.4%', resolution: '88.7%' },
  { week: 'W25 (16–22 Jun)',  overall: '92.4%', frt: '96.8%', resolution: '89.2%' },
  { week: 'W26 (23 Jun–)',    overall: '91.2%', frt: '96.0%', resolution: '88.0%' },
]

export function SupportSLA() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Clock size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">SLA Dashboard</h1>
          <p className="text-sm text-[var(--os-text-2)]">Service Level Agreement performance by priority tier — rolling 30 days</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Overall SLA Met',   value: '91.2%', color: '#F59E0B' },
          { label: 'First Response',    value: '96%',   color: '#10B981' },
          { label: 'Resolution',        value: '88%',   color: '#F59E0B' },
          { label: 'Breaches MTD',      value: '3',     color: '#EF4444' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* SLA Tier Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <p className="text-sm font-semibold text-white">Performance by Priority Tier</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Priority', 'Target FRT', 'Actual FRT', 'Target Res.', 'Actual Res.', 'Breaches', 'Breach Rate'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {SLA_DATA.map(row => (
                <tr key={row.priority} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${row.color}22`, color: row.color }}>
                      {row.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{row.targetFRT}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span style={{ color: row.frtMet ? '#10B981' : '#EF4444' }} className="font-semibold">{row.actualFRT}</span>
                  </td>
                  <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{row.targetRes}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span style={{ color: row.resMet ? '#10B981' : '#EF4444' }} className="font-semibold">{row.actualRes}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-semibold" style={{ color: row.breaches > 0 ? '#EF4444' : '#10B981' }}>{row.breaches}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-semibold" style={{ color: row.breaches > 0 ? '#EF4444' : '#10B981' }}>{row.breachRate}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekly Trend */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <p className="text-sm font-semibold text-white">Weekly Trend — Last 4 Weeks</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Week', 'Overall SLA', 'First Response', 'Resolution'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {WEEKLY_TREND.map(row => (
                <tr key={row.week} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{row.week}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold" style={{ color: parseFloat(row.overall) >= 95 ? '#10B981' : '#F59E0B' }}>
                      {row.overall}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold" style={{ color: parseFloat(row.frt) >= 95 ? '#10B981' : '#F59E0B' }}>
                      {row.frt}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold" style={{ color: parseFloat(row.resolution) >= 90 ? '#10B981' : '#F59E0B' }}>
                      {row.resolution}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-white/5 bg-slate-800/20">
          <p className="text-xs text-[var(--os-text-2)]">FRT = First Response Time · Res. = Resolution Time · Target: Overall ≥95%, FRT ≥98%, Resolution ≥92%</p>
        </div>
      </div>
    </div>
  )
}
