import { TrendingUp } from 'lucide-react'
import { SharedAnalytics, type AnalyticsKPI, type AgentStat, type WeekTrend } from '../../shared/SharedAnalytics'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['customer-success']

const KPIS: AnalyticsKPI[] = [
  { label: 'NRR',            value: '112%',   subtext: 'Net revenue retention',    color: '#14B8A6', trend: 'up',   trendPct: '+3%' },
  { label: 'Churn Rate',     value: '3.2%',   subtext: 'vs 5% target',             color: '#10B981', trend: 'down', trendPct: '−1.1%' },
  { label: 'Avg Health',     value: '84/100', subtext: 'Portfolio health score',    color: '#F59E0B', trend: 'up',   trendPct: '+6pts' },
  { label: 'QBRs Completed', value: '28',     subtext: 'This quarter',             color: '#6366F1', trend: 'up',   trendPct: '+5' },
  { label: 'Time to Value',  value: '34d',    subtext: 'Avg onboarding duration',  color: '#8B5CF6', trend: 'down', trendPct: '−8d' },
  { label: 'CSAT',           value: '4.6/5',  subtext: 'Avg client satisfaction',  color: '#14B8A6', trend: 'up',   trendPct: '+0.3' },
  { label: 'Expansion ARR',  value: '£210k',  subtext: 'Upsells & expansions',     color: '#10B981', trend: 'up',   trendPct: '+£45k' },
  { label: 'At-Risk',        value: '6',      subtext: 'Accounts health < 70',     color: '#EF4444', trend: 'up',   trendPct: '+2' },
]

const AGENTS: AgentStat[] = [
  { id: 'a1', name: 'Lena Park',  initials: 'LP', color: '#14B8A6', resolved: 42, avgHandle: '3.2d', csat: 97, slaBreaches: 0, trendVsLast: 'up',   kimmCoaching: 'Highest NRR in portfolio. Expansion motion on HealthGroup could unlock £35k upsell.' },
  { id: 'a2', name: 'Raj Mehta', initials: 'RM', color: '#8B5CF6', resolved: 38, avgHandle: '4.1d', csat: 93, slaBreaches: 1, trendVsLast: 'flat', kimmCoaching: 'FinServ account is at-risk. Recommend proactive exec call before next invoice cycle.' },
]

const TREND: WeekTrend[] = [
  { label: 'W1', value: 80, target: 85 },
  { label: 'W2', value: 82, target: 85 },
  { label: 'W3', value: 83, target: 85 },
  { label: 'W4', value: 81, target: 85 },
  { label: 'W5', value: 85, target: 85 },
  { label: 'W6', value: 86, target: 85 },
  { label: 'W7', value: 88, target: 85 },
  { label: 'W8', value: 84, target: 85 },
]

export function CSAnalytics() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-6 h-6 text-teal-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">CS Analytics</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Team performance, portfolio health, and KIMMP retention intelligence.</p>
        </div>
      </div>
      <SharedAnalytics
        config={cfg}
        kpis={KPIS}
        agents={AGENTS}
        weekTrend={TREND}
        kimmInsight="NRR at 112% — driven by Lena's expansion motion on HealthGroup and RetailCo. 6 at-risk accounts require attention: FinServ health score 62 with no contact in 14 days — highest churn probability this quarter. Recommend: assign Raj to FinServ exec recovery call this week."
      />
    </div>
  )
}
