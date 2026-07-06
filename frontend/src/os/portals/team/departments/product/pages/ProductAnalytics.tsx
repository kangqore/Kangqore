import { TrendingUp } from 'lucide-react'
import { SharedAnalytics, type AnalyticsKPI, type AgentStat, type WeekTrend } from '../../shared/SharedAnalytics'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['product']

const KPIS: AnalyticsKPI[] = [
  { label: 'Features Shipped', value: '18',     subtext: 'This quarter',            color: '#A855F7', trend: 'up',   trendPct: '+4' },
  { label: 'Velocity',         value: '26.4pts', subtext: 'Avg sprint velocity',    color: '#10B981', trend: 'up',   trendPct: '+3.2' },
  { label: 'Bug Escape Rate',  value: '2.8%',   subtext: 'Bugs reaching prod',      color: '#EF4444', trend: 'down', trendPct: '−0.5%' },
  { label: 'Design:Dev Ratio', value: '1:1.4',  subtext: 'Design to dev handoff',   color: '#6366F1', trend: 'flat', trendPct: '0%' },
  { label: 'NPS',              value: '+52',    subtext: 'Product NPS score',        color: '#A855F7', trend: 'up',   trendPct: '+7' },
  { label: 'Time to Ship',     value: '34d',    subtext: 'Idea to prod',             color: '#F59E0B', trend: 'down', trendPct: '−6d' },
  { label: 'Feature Adoption', value: '68%',    subtext: '90-day adoption rate',     color: '#10B981', trend: 'up',   trendPct: '+11%' },
  { label: 'Research Coverage',value: '78%',    subtext: 'Features with user research', color: '#8B5CF6', trend: 'up', trendPct: '+13%' },
]

const AGENTS: AgentStat[] = [
  { id: 'a1', name: 'Ananya Rao',   initials: 'AR', color: '#A855F7', resolved: 11, avgHandle: '18d', csat: 96, slaBreaches: 0, trendVsLast: 'up',   kimmCoaching: 'Shipping velocity at personal best. Roadmap alignment with Engineering is strong — maintain weekly syncs.' },
  { id: 'a2', name: 'Priya Mistry', initials: 'PM', color: '#EC4899', resolved: 8,  avgHandle: '22d', csat: 94, slaBreaches: 1, trendVsLast: 'flat', kimmCoaching: 'Design:Dev ratio improving. User research coverage at 72% — target 80% by next quarter.' },
  { id: 'a3', name: 'Omar Shah',    initials: 'OS', color: '#F59E0B', resolved: 5,  avgHandle: '28d', csat: 91, slaBreaches: 0, trendVsLast: 'up',   kimmCoaching: 'Growing fast. Consider leading a smaller end-to-end feature to build ownership confidence.' },
]

const TREND: WeekTrend[] = [
  { label: 'W1', value: 22, target: 26 },
  { label: 'W2', value: 24, target: 26 },
  { label: 'W3', value: 23, target: 26 },
  { label: 'W4', value: 26, target: 26 },
  { label: 'W5', value: 28, target: 26 },
  { label: 'W6', value: 25, target: 26 },
  { label: 'W7', value: 27, target: 26 },
  { label: 'W8', value: 26, target: 26 },
]

export function ProductAnalytics() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-6 h-6 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Product Analytics</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Shipping velocity, adoption trends, and KIMMP product intelligence.</p>
        </div>
      </div>
      <SharedAnalytics
        config={cfg}
        kpis={KPIS}
        agents={AGENTS}
        weekTrend={TREND}
        kimmInsight="Feature adoption up 11% — driven by KIMMP OS and AEGIS dashboard launches. Bug escape rate falling: 2.8% vs 3.3% last quarter. Bottleneck: design handoff on Sprints 22–23 added 6 days to cycle time. Embedding Priya earlier in Engineering planning will close this gap. NPS +52 = strong signal to invest in UX polish sprint."
      />
    </div>
  )
}
