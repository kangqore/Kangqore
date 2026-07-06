import { TrendingUp } from 'lucide-react'
import { SharedAnalytics, type AnalyticsKPI, type AgentStat, type WeekTrend } from '../../shared/SharedAnalytics'
import { DEPT_MAP } from '../../../deptConfigs'
const cfg = DEPT_MAP['legal']
const KPIS: AnalyticsKPI[] = [
  { label: 'Contracts Reviewed', value: '48',    subtext: 'This period',         color: '#F59E0B', trend: 'up',   trendPct: '+10%' },
  { label: 'Avg Review Time',    value: '2.4d',  subtext: 'Per contract',        color: '#10B981', trend: 'down', trendPct: '−0.6d' },
  { label: 'NDA Turnaround',     value: '18h',   subtext: 'Avg completion',      color: '#10B981', trend: 'down', trendPct: '−6h' },
  { label: 'Matters Open',       value: '7',     subtext: 'Active legal matters',color: '#EF4444', trend: 'up',   trendPct: '+2' },
  { label: 'Contracts Expiring', value: '9',     subtext: 'In next 60 days',     color: '#F97316', trend: 'up',   trendPct: '+4' },
  { label: 'Approvals Queue',    value: '3',     subtext: 'Awaiting sign-off',   color: '#6366F1', trend: 'flat', trendPct: '0' },
  { label: 'Compliance Score',   value: '98%',   subtext: 'Internal audits',     color: '#10B981', trend: 'up',   trendPct: '+2%' },
  { label: 'Clause Reuse Rate',  value: '74%',   subtext: 'From library',        color: '#8B5CF6', trend: 'up',   trendPct: '+8%' },
]
const AGENTS: AgentStat[] = [
  { id: 'l1', name: 'General Counsel', initials: 'GC', color: '#F59E0B', resolved: 18, avgHandle: '3.2d', csat: 97, slaBreaches: 0, trendVsLast: 'up',   kimmCoaching: 'Matter management excellence. Consider delegating routine NDAs to free capacity for complex matters.' },
  { id: 'l2', name: 'Legal Counsel',   initials: 'LC', color: '#FBBF24', resolved: 22, avgHandle: '2.1d', csat: 95, slaBreaches: 1, trendVsLast: 'up',   kimmCoaching: 'Fastest contract review on team. 1 SLA breach — commercial contract during M&A research conflict.' },
  { id: 'l3', name: 'Paralegal',       initials: 'PL', color: '#D97706', resolved: 8,  avgHandle: '1.1d', csat: 93, slaBreaches: 0, trendVsLast: 'flat', kimmCoaching: 'High clause library reuse — 82%. Develop contract negotiation skills for senior uplift.' },
]
const TREND: WeekTrend[] = [
  { label: 'W1', value: 91, target: 95 }, { label: 'W2', value: 93, target: 95 },
  { label: 'W3', value: 95, target: 95 }, { label: 'W4', value: 97, target: 95 },
  { label: 'W5', value: 96, target: 95 }, { label: 'W6', value: 98, target: 95 },
  { label: 'W7', value: 97, target: 95 }, { label: 'W8', value: 99, target: 95 },
]
export function LegalAnalytics() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0"><TrendingUp className="w-6 h-6 text-amber-400" /></div>
        <div><h1 className="text-2xl font-bold tracking-tight text-white">Legal Analytics</h1><p className="text-[var(--os-text-2)] mt-1 text-sm">Contract velocity, matter status, compliance score, and KIMMP insights.</p></div>
      </div>
      <SharedAnalytics config={cfg} kpis={KPIS} agents={AGENTS} weekTrend={TREND} kimmInsight="NDA turnaround down 6h — clause library adoption reached 74%, eliminating manual drafting for standard NDAs. 9 contracts expiring in 60 days: 3 are critical supplier agreements (>£500K). Recommend GC review of those 3 this week. Compliance score 98% — 1 gap in employment contract template requires updating for 2026 regulations." />
    </div>
  )
}
