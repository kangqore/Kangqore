import { TrendingUp } from 'lucide-react'
import { SharedAnalytics, type AnalyticsKPI, type AgentStat, type WeekTrend } from '../../shared/SharedAnalytics'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['it']

const KPIS: AnalyticsKPI[] = [
  { label: 'MTTR',              value: '1h 42m', subtext: 'Mean time to resolve', color: '#2564ea', trend: 'down',  trendPct: '−18%' },
  { label: 'SLA Compliance',    value: '94.2%',  subtext: 'vs 92% target',        color: '#10B981', trend: 'up',    trendPct: '+2.1%' },
  { label: 'Incidents Resolved',value: '312',    subtext: 'This period',           color: '#F59E0B', trend: 'up',    trendPct: '+8%' },
  { label: 'Avg Handle Time',   value: '48m',    subtext: 'Per ticket',            color: '#6366F1', trend: 'down',  trendPct: '−12%' },
  { label: 'P1 Escalations',    value: '4',      subtext: 'Went to L3',            color: '#EF4444', trend: 'down',  trendPct: '−3' },
  { label: 'Change Success',    value: '97%',    subtext: 'No rollbacks',          color: '#10B981', trend: 'flat',  trendPct: '0%' },
  { label: 'First-Call Resolve',value: '68%',    subtext: 'No reassignment',       color: '#F97316', trend: 'up',    trendPct: '+5%' },
  { label: 'CSAT',              value: '4.6/5',  subtext: 'avg user rating',       color: '#8B5CF6', trend: 'up',    trendPct: '+0.2' },
]

const AGENTS: AgentStat[] = [
  { id: 'a1', name: 'Arjun Sharma',  initials: 'AS', color: '#2564ea', resolved: 87, avgHandle: '42m', csat: 96, slaBreaches: 1, trendVsLast: 'up',   kimmCoaching: 'Top performer. Consider mentoring Vikram on network issues.' },
  { id: 'a2', name: 'Rohan Mehta',   initials: 'RM', color: '#10B981', resolved: 74, avgHandle: '51m', csat: 93, slaBreaches: 2, trendVsLast: 'up',   kimmCoaching: 'Strong DevOps performance. Kubernetes cert renewal recommended.' },
  { id: 'a3', name: 'Priya Nair',    initials: 'PN', color: '#8B5CF6', resolved: 68, avgHandle: '58m', csat: 91, slaBreaches: 3, trendVsLast: 'flat', kimmCoaching: 'DB performance strong. 3 SLA breaches — all P1 during understaffed hours.' },
  { id: 'a4', name: 'Vikram Sharma', initials: 'VS', color: '#F59E0B', resolved: 55, avgHandle: '44m', csat: 88, slaBreaches: 1, trendVsLast: 'up',   kimmCoaching: 'Improving trend. Develop Linux skills — 8 assigned tickets below avg resolution.' },
  { id: 'a5', name: 'Kavya Reddy',   initials: 'KR', color: '#6366F1', resolved: 48, avgHandle: '39m', csat: 94, slaBreaches: 0, trendVsLast: 'down', kimmCoaching: 'Lowest volume — on leave 3 days. Fastest handle time on team.' },
]

const TREND: WeekTrend[] = [
  { label: 'W1', value: 88, target: 92 },
  { label: 'W2', value: 90, target: 92 },
  { label: 'W3', value: 87, target: 92 },
  { label: 'W4', value: 92, target: 92 },
  { label: 'W5', value: 94, target: 92 },
  { label: 'W6', value: 93, target: 92 },
  { label: 'W7', value: 95, target: 92 },
  { label: 'W8', value: 94, target: 92 },
]

export function ITAnalytics() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">IT Analytics</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Team performance, agent leaderboard, trend analysis, and KIMMP coaching insights.</p>
        </div>
      </div>
      <SharedAnalytics
        config={cfg}
        kpis={KPIS}
        agents={AGENTS}
        weekTrend={TREND}
        kimmInsight="MTTR improved 18% vs last period — driven by Arjun's systematic VPN playbook adoption. P1 SLA compliance dropped 3 points on Wednesdays (understaffed afternoon shift). Adding 1 AFTERNOON agent on Wednesday would close this gap. CSAT 4.6 → target 4.8: focus area is first-response quality on P3 tickets."
      />
    </div>
  )
}
