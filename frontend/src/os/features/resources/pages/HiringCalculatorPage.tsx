import { useMemo } from 'react'
import { Users, TrendingUp, AlertTriangle, Briefcase, DollarSign, Clock } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { Card, CardHeader, CardTitle } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { StatCard } from '@design-system/components/StatCard'
import { Progress } from '@design-system/components/Progress'
import { useResourcesStore } from '../store'
import { useLeadsStore } from '@features/leads/store'

// ─── constants ────────────────────────────────────────────────────────────────

// Average hours per week per ₹10k of pipeline value (rough industry estimate)
const HOURS_PER_10K_GBP = 8
// Assumed win rate for forecasting
const WIN_RATE_PCT = 0.35

// Recommended hire profiles — needed skills + seniority
const HIRE_RECOMMENDATIONS: {
  role: string; skills: string[]; urgency: 'immediate' | 'q2' | 'q3'; rationale: string
}[] = [
  {
    role: 'Senior Full-Stack Engineer',
    skills: ['React', 'Node.js', 'PostgreSQL'],
    urgency: 'immediate',
    rationale: 'Engineering at 93% avg utilisation. 3 active projects with delivery risk.',
  },
  {
    role: 'AI/ML Engineer',
    skills: ['Python', 'LangChain', 'RAG', 'FastAPI'],
    urgency: 'immediate',
    rationale: 'Ravi Nair at 100% — single point of failure on all AI/ML workstreams.',
  },
  {
    role: 'DevOps / Cloud Engineer',
    skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD'],
    urgency: 'q2',
    rationale: 'James Okafor is part-time. Infrastructure coverage gap on 2 projects.',
  },
  {
    role: 'Product Designer',
    skills: ['Figma', 'UX Research', 'Design Systems'],
    urgency: 'q3',
    rationale: 'Design at 75% now, but 3 upcoming projects need dedicated design resource.',
  },
]

const URGENCY_V: Record<string, 'danger' | 'warning' | 'info'> = {
  immediate: 'danger', q2: 'warning', q3: 'info',
}
const URGENCY_LABEL: Record<string, string> = {
  immediate: 'Hire now', q2: 'Q3 2026', q3: 'Q4 2026',
}

const fmt = (n: number) => `₹${Math.round(n).toLocaleString()}`

// ─── capacity projection ──────────────────────────────────────────────────────

function buildProjectionChart(
  currentCapacityHrs: number,
  pipelineHrsNeeded: number,
  _teamSize: number,
) {
  const months = ['Now', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  // Existing capacity stays flat (no hires modelled yet)
  // Pipeline demand grows as deals close over time
  return months.map((month, i) => ({
    month,
    capacity: Math.round(currentCapacityHrs * (1 + i * 0.02)), // slight growth from efficiency
    demand:   Math.round(currentCapacityHrs * 0.82 + pipelineHrsNeeded * (i / (months.length - 1))),
  }))
}

// ─── page ─────────────────────────────────────────────────────────────────────

export function HiringCalculatorPage() {
  const { team } = useResourcesStore()
  const { leads, forecastValue } = useLeadsStore()

  // Current capacity
  const totalCapacityHrs = team.reduce((s, m) => s + m.availability, 0)
  const usedHrs          = team.reduce((s, m) => s + Math.round(m.availability * m.utilization / 100), 0)
  const freeHrs          = totalCapacityHrs - usedHrs
  const avgUtil          = Math.round(usedHrs / totalCapacityHrs * 100)

  // Pipeline demand projection
  const pipelineValue    = forecastValue()  // ₹
  const expectedWins     = pipelineValue * WIN_RATE_PCT
  const demandHrsPerWeek = Math.round((expectedWins / 1000 / 10) * HOURS_PER_10K_GBP)  // convert ₹ to hrs/wk
  const capacityGap      = Math.max(0, demandHrsPerWeek - freeHrs)
  const hiresNeeded      = Math.ceil(capacityGap / 35) // assuming 35h billable/wk per hire
  const monthsToFill     = hiresNeeded > 0 ? 3 : 0   // average time to hire

  // Dept breakdown
  const depts = ['Engineering', 'Design', 'Product', 'Sales', 'Operations', 'Finance'] as const
  const deptStats = depts.map(dept => {
    const members = team.filter(m => m.department === dept)
    if (!members.length) return null
    const avgU = Math.round(members.reduce((s, m) => s + m.utilization, 0) / members.length)
    return { dept, count: members.length, avgUtil: avgU }
  }).filter(Boolean) as { dept: string; count: number; avgUtil: number }[]

  // Projection chart data
  const chartData = useMemo(
    () => buildProjectionChart(totalCapacityHrs, demandHrsPerWeek * 24, team.length),
    [totalCapacityHrs, demandHrsPerWeek, team.length]
  )

  return (
    <div className="space-y-6">
      <KIMMPSignalBar module="Hiring" />

      <div>
        <h2 className="text-xl font-bold text-white">Hiring Calculator</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Capacity vs pipeline demand — know when to hire before you lose the deal.
        </p>
      </div>

      {/* Current state KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Team capacity"    value={`${totalCapacityHrs}h/wk`} icon={<Users       className="w-5 h-5" />} iconColor="bg-blue-100 text-blue-600" />
        <StatCard label="Current util"     value={`${avgUtil}%`}             icon={<TrendingUp  className="w-5 h-5" />} iconColor={avgUtil >= 90 ? 'bg-red-100 text-red-600' : avgUtil >= 80 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'} />
        <StatCard label="Free capacity"    value={`${freeHrs}h/wk`}          icon={<Clock       className="w-5 h-5" />} iconColor={freeHrs < 20 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} />
        <StatCard label="Hires needed"     value={hiresNeeded}               icon={<Briefcase   className="w-5 h-5" />} iconColor={hiresNeeded > 0 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'} />
      </div>

      {/* Pipeline → demand translation */}
      <Card>
        <CardHeader><CardTitle>Pipeline demand translation</CardTitle></CardHeader>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          <div className="p-4 bg-slate-900 rounded-xl">
            <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" />Forecast pipeline</p>
            <p className="text-xl font-bold text-slate-200">{fmt(pipelineValue)}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{WIN_RATE_PCT * 100}% assumed win rate</p>
          </div>
          <div className="p-4 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 border-l-4 border-l-[#0073ea] border-y border-r border-white/10 border-t-white/20 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <p className="text-xs text-[#0073ea] font-semibold mb-1.5 flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" />Expected wins</p>
            <p className="text-xl font-bold text-slate-200">{fmt(expectedWins)}</p>
            <p className="text-[11px] text-slate-500 mt-1">Across {leads.filter(l => !['won','lost'].includes(l.stage)).length} active leads</p>
          </div>
          <div className={`p-4 rounded-xl border-y border-r border-white/10 border-t-white/20 border-l-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 ${capacityGap > 0 ? 'border-l-[#e2445c]' : 'border-l-[#00c875]'}`}>
            <p className={`text-xs font-semibold mb-1.5 flex items-center gap-1.5 ${capacityGap > 0 ? 'text-[#e2445c]' : 'text-[#00c875]'}`}>
              <AlertTriangle className="w-3.5 h-3.5" />Demand vs capacity
            </p>
            <p className="text-xl font-bold text-slate-200">
              {capacityGap > 0 ? `+${capacityGap}h` : 'Covered'} / wk
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {capacityGap > 0 ? `${hiresNeeded} hire${hiresNeeded !== 1 ? 's' : ''} needed` : 'Current team can absorb pipeline'}
            </p>
          </div>
        </div>
      </Card>

      {/* Capacity vs demand projection */}
      <Card>
        <CardHeader><CardTitle>Capacity vs demand — 6-month projection (hrs/wk)</CardTitle></CardHeader>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f7" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12, border: '1px solid #e4e8f0' }} formatter={(v: unknown, n?: unknown) => [`${v ?? 0}h`, `${n ?? ''}`] as [string, string]} />
            <ReferenceLine y={totalCapacityHrs} stroke="#ef4444" strokeDasharray="4 2" label={{ value: 'Max capacity', position: 'insideTopRight', fontSize: 10, fill: '#ef4444' }} />
            <Bar dataKey="capacity" fill="#22c55e" radius={[4,4,0,0]} name="Available" />
            <Bar dataKey="demand"   fill="#2564ea" radius={[4,4,0,0]} name="Demand" opacity={0.7} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-[11px] text-slate-500 mt-2">
          Green = team capacity · Blue = projected demand from pipeline · Red line = maximum capacity ceiling
        </p>
      </Card>

      {/* Dept utilization */}
      <Card>
        <CardHeader><CardTitle>Utilisation by department</CardTitle></CardHeader>
        <div className="space-y-3 mt-2">
          {deptStats.map(d => (
            <div key={d.dept} className="flex items-center gap-4">
              <span className="text-xs text-slate-500 w-28 flex-shrink-0">{d.dept}</span>
              <div className="flex-1">
                <Progress
                  value={d.avgUtil}
                  size="sm"
                  color={d.avgUtil >= 95 ? 'danger' : d.avgUtil >= 80 ? 'warning' : 'success'}
                />
              </div>
              <span className={`text-xs font-bold w-10 text-right ${d.avgUtil >= 95 ? 'text-red-600' : d.avgUtil >= 80 ? 'text-amber-600' : 'text-green-600'}`}>
                {d.avgUtil}%
              </span>
              <span className="text-[11px] text-slate-500 w-14">{d.count} people</span>
              {d.avgUtil >= 90 && <Badge variant="danger" size="sm">At limit</Badge>}
            </div>
          ))}
        </div>
      </Card>

      {/* Hire recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-slate-500" />
            Recommended hires
          </CardTitle>
        </CardHeader>
        <div className="space-y-4 mt-2">
          {HIRE_RECOMMENDATIONS.map((rec, i) => (
            <div key={i}>
              {i > 0 && <div className="h-px bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 mb-4" />}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-[#0073ea] flex items-center justify-center flex-shrink-0 text-white font-extrabold text-sm shadow-[0_2px_6px_rgba(0,115,234,0.2)]">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-sm font-semibold text-white">{rec.role}</p>
                    <Badge variant={URGENCY_V[rec.urgency]} size="sm">{URGENCY_LABEL[rec.urgency]}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{rec.rationale}</p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {rec.skills.map(s => <Badge key={s} variant="info" size="sm">{s}</Badge>)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {hiresNeeded > 0 && (
          <div className="mt-4 p-3 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 border-l-4 border-l-[#fdab3d] border-y border-r border-white/10 border-t-white/20 rounded-xl">
            <p className="text-xs text-slate-300 font-medium">
              At current pipeline conversion rate, start hiring now — average time-to-hire is {monthsToFill} months.
              Delaying risks capacity crunch in Q3.
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}
