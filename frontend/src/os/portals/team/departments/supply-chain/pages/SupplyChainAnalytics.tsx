import { TrendingUp } from 'lucide-react'
import { SharedAnalytics, type AnalyticsKPI, type AgentStat, type WeekTrend } from '../../shared/SharedAnalytics'
import { DEPT_MAP } from '../../../deptConfigs'
const cfg = DEPT_MAP['supply-chain']
const KPIS: AnalyticsKPI[] = [
  { label: 'On-Time Delivery', value: '94.2%', subtext: 'vs 95% target',         color: '#6366F1', trend: 'up',   trendPct: '+2.1%' },
  { label: 'Production Orders',value: '142',   subtext: 'Completed this period', color: '#10B981', trend: 'up',   trendPct: '+11%' },
  { label: 'Inventory Turns',  value: '8.4',   subtext: 'Annual rate',           color: '#F59E0B', trend: 'up',   trendPct: '+0.6' },
  { label: 'Supplier Quality', value: '97.1%', subtext: 'Defect-free %',         color: '#10B981', trend: 'up',   trendPct: '+1.4%' },
  { label: 'Lead Time',        value: '12.3d', subtext: 'Avg order to receive',  color: '#6366F1', trend: 'down', trendPct: '−1.8d' },
  { label: 'Backorders',       value: '7',     subtext: 'Active backorders',     color: '#EF4444', trend: 'down', trendPct: '−3' },
  { label: 'QC Pass Rate',     value: '99.2%', subtext: 'First-pass quality',   color: '#10B981', trend: 'up',   trendPct: '+0.4%' },
  { label: 'Cost Saving',      value: '£42K',  subtext: 'vs budget (YTD)',      color: '#10B981', trend: 'up',   trendPct: '+£8K' },
]
const AGENTS: AgentStat[] = [
  { id: 'sc1', name: 'Supply Chain Lead', initials: 'SL', color: '#6366F1', resolved: 28, avgHandle: '3.2d', csat: 96, slaBreaches: 1, trendVsLast: 'up',   kimmCoaching: 'Lead time reduction excellent. Supplier consolidation opportunity: 4 low-volume suppliers eligible for renegotiation.' },
  { id: 'sc2', name: 'Procurement Mgr',  initials: 'PM', color: '#818CF8', resolved: 34, avgHandle: '2.8d', csat: 94, slaBreaches: 0, trendVsLast: 'up',   kimmCoaching: '£42K cost saving YTD — ahead of target. Develop supplier risk framework for sole-source dependencies.' },
  { id: 'sc3', name: 'Logistics Coord',  initials: 'LC', color: '#4F46E5', resolved: 80, avgHandle: '0.8d', csat: 92, slaBreaches: 2, trendVsLast: 'flat', kimmCoaching: '2 SLA breaches — both port delay events (external). Diversify carrier mix to reduce single-point logistics risk.' },
]
const TREND: WeekTrend[] = [
  { label: 'W1', value: 90, target: 95 }, { label: 'W2', value: 91, target: 95 },
  { label: 'W3', value: 92, target: 95 }, { label: 'W4', value: 94, target: 95 },
  { label: 'W5', value: 93, target: 95 }, { label: 'W6', value: 95, target: 95 },
  { label: 'W7', value: 94, target: 95 }, { label: 'W8', value: 96, target: 95 },
]
export function SupplyChainAnalytics() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0"><TrendingUp className="w-6 h-6 text-indigo-400" /></div>
        <div><h1 className="text-2xl font-bold tracking-tight text-white">Supply Chain Analytics</h1><p className="text-[var(--os-text-2)] mt-1 text-sm">Production KPIs, delivery performance, supplier quality, and KIMMP insights.</p></div>
      </div>
      <SharedAnalytics config={cfg} kpis={KPIS} agents={AGENTS} weekTrend={TREND} kimmInsight="On-time delivery at 94.2% — 0.8% below target, driven by 2 carrier delays at Felixstowe (external, not process). KIMMP recommends activating backup carrier for EU routes. Inventory turns improved to 8.4 — £42K cost saving year-to-date. 7 backorders: 4 are for single-source components; supplier diversification plan should be prioritised." />
    </div>
  )
}
