import { Sparkles } from 'lucide-react'
import { ChartBar } from '@phosphor-icons/react'

const ACCENT = '#16A34A'

type CapacityHealth = 'Green' | 'Amber' | 'Red'

interface DeptCapacity {
  dept:         string
  headcount:    number
  utilisation:  number
  demand90:     number
  variance:     number
  health:       CapacityHealth
  recommendation: string
}

const CAPACITY: DeptCapacity[] = [
  { dept: 'Engineering',      headcount: 8,  utilisation: 94, demand90: 110, variance: -16, health: 'Red',   recommendation: 'Hire 2 engineers — critical capacity constraint in Q3' },
  { dept: 'Delivery',         headcount: 6,  utilisation: 88, demand90: 95,  variance: -7,  health: 'Amber', recommendation: 'Contractor cover for 1 delivery manager role' },
  { dept: 'Customer Success', headcount: 5,  utilisation: 82, demand90: 88,  variance: -6,  health: 'Amber', recommendation: 'Monitor — watch churn rate; recruit if NRR drops' },
  { dept: 'Sales',            headcount: 4,  utilisation: 78, demand90: 80,  variance: -2,  health: 'Green', recommendation: 'Adequate for current pipeline' },
  { dept: 'Marketing',        headcount: 3,  utilisation: 76, demand90: 78,  variance: -2,  health: 'Green', recommendation: 'Adequate — Paid Media expert gap to watch' },
  { dept: 'Finance',          headcount: 2,  utilisation: 74, demand90: 76,  variance: -2,  health: 'Green', recommendation: 'Adequate for current entity size' },
  { dept: 'Support',          headcount: 4,  utilisation: 71, demand90: 70,  variance: +1,  health: 'Green', recommendation: 'Slight overcapacity — review shift patterns' },
  { dept: 'HR',               headcount: 2,  utilisation: 68, demand90: 74,  variance: -6,  health: 'Amber', recommendation: 'Recruitment load increasing — review capacity in July' },
]

const HEALTH_COLOR: Record<CapacityHealth, string> = { Green: '#10B981', Amber: '#F59E0B', Red: '#EF4444' }

function UtilBar({ value }: { value: number }) {
  const color = value >= 90 ? '#EF4444' : value >= 80 ? '#F59E0B' : '#10B981'
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 rounded-full bg-slate-700 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-semibold" style={{ color }}>{value}%</span>
    </div>
  )
}

export function OpsCapacity() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <ChartBar size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Capacity Planning</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Department utilisation, 90-day demand forecast and resource recommendations.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Dept Reviewed',  value: String(CAPACITY.length),                                         color: ACCENT },
          { label: 'At Capacity',    value: String(CAPACITY.filter(d => d.health === 'Red').length),       color: '#EF4444' },
          { label: 'At Risk',        value: String(CAPACITY.filter(d => d.health === 'Amber').length),     color: '#F59E0B' },
          { label: 'On Track',       value: String(CAPACITY.filter(d => d.health === 'Green').length),     color: '#10B981' },
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
          Engineering at 94% utilisation with a 16% demand gap in Q3 is the most critical capacity constraint in the
          business. Without 2 additional hires, delivery commitments will be at risk by August. Delivery at 88% is
          the second priority; a senior contractor (3-month engagement) would bridge the gap while a permanent hire is
          made. HR capacity needs monitoring — the hiring load is self-referential if they cannot scale to recruit.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Department', 'HC', 'Utilisation', 'Demand 90d', 'Variance', 'Health', 'Recommendation'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {CAPACITY.map(d => {
                const hc = HEALTH_COLOR[d.health]
                return (
                  <tr key={d.dept} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{d.dept}</td>
                    <td className="px-4 py-3 text-white font-bold">{d.headcount}</td>
                    <td className="px-4 py-3"><UtilBar value={d.utilisation} /></td>
                    <td className="px-4 py-3 text-[var(--os-text-2)]">{d.demand90}%</td>
                    <td className="px-4 py-3">
                      <span className={d.variance < 0 ? 'text-red-400 font-semibold' : 'text-green-400 font-semibold'}>
                        {d.variance > 0 ? '+' : ''}{d.variance}%
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${hc}22`, color: hc }}>{d.health}</span>
                    </td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] text-xs">{d.recommendation}</td>
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
