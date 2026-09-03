import { TrendingUp } from 'lucide-react'
import { SharedAnalytics, type AnalyticsKPI, type AgentStat, type WeekTrend } from '../../shared/SharedAnalytics'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['engineering']

const KPIS: AnalyticsKPI[] = [
  { label: 'Velocity',          value: '61.2pts', subtext: 'Avg sprint velocity',     color: '#84CC16', trend: 'up',   trendPct: '+4.2pts' },
  { label: 'Deploy Frequency',  value: '8/wk',    subtext: 'Successful deploys',      color: '#10B981', trend: 'up',   trendPct: '+2' },
  { label: 'Change Failure',    value: '2.5%',    subtext: 'Rollbacks / hotfixes',    color: '#EF4444', trend: 'down', trendPct: '−0.8%' },
  { label: 'MTTR',              value: '1.2h',    subtext: 'Mean time to recovery',   color: '#6366F1', trend: 'down', trendPct: '−0.4h' },
  { label: 'Test Coverage',     value: '89%',     subtext: 'Unit + integration',      color: '#A855F7', trend: 'up',   trendPct: '+6%' },
  { label: 'PR Cycle Time',     value: '1.8d',    subtext: 'Open to merge',           color: '#F59E0B', trend: 'down', trendPct: '−0.6d' },
  { label: 'Bug Escape Rate',   value: '2.8%',    subtext: 'Bugs in production',      color: '#EF4444', trend: 'down', trendPct: '−0.5%' },
  { label: 'Platform Uptime',   value: '99.94%',  subtext: 'All services combined',   color: '#10B981', trend: 'up',   trendPct: '+0.02%' },
]

const AGENTS: AgentStat[] = [
  { id: 'a1', name: 'Siddharth R', initials: 'SR', color: '#84CC16', resolved: 24, avgHandle: '2.1d', csat: 97, slaBreaches: 0, trendVsLast: 'up',   kimmCoaching: 'Highest velocity and lowest MTTR. KIMMP context pipeline ownership is a force multiplier — protect this focus.' },
  { id: 'a2', name: 'Kavya N',     initials: 'KN', color: '#10B981', resolved: 21, avgHandle: '2.4d', csat: 95, slaBreaches: 1, trendVsLast: 'up',   kimmCoaching: 'HANUMANAS audit log delivery was exceptional. One SLA miss on OAuth ticket — dependency on cert renewal, not execution.' },
  { id: 'a3', name: 'Aryan M',     initials: 'AM', color: '#F59E0B', resolved: 18, avgHandle: '2.8d', csat: 93, slaBreaches: 0, trendVsLast: 'flat', kimmCoaching: 'Frontend performance improvements measurably reduced bundle size. Recommend AI/ML integration exposure to grow skillset.' },
]

const TREND: WeekTrend[] = [
  { label: 'W1', value: 54, target: 60 },
  { label: 'W2', value: 58, target: 60 },
  { label: 'W3', value: 56, target: 60 },
  { label: 'W4', value: 61, target: 60 },
  { label: 'W5', value: 63, target: 60 },
  { label: 'W6', value: 60, target: 60 },
  { label: 'W7', value: 65, target: 60 },
  { label: 'W8', value: 61, target: 60 },
]

export function EngineeringAnalytics() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-lime-500/20 flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-6 h-6 text-lime-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Engineering Analytics</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">DORA metrics, sprint velocity, and KIMMP engineering intelligence.</p>
        </div>
      </div>
      <SharedAnalytics
        config={cfg}
        kpis={KPIS}
        agents={AGENTS}
        weekTrend={TREND}
        kimmInsight="DORA metrics are improving across all 4 dimensions. Deploy frequency doubled in 8 weeks — driven by CI/CD pipeline automation. Change failure rate 2.5% is approaching elite threshold (< 1%). PR cycle time improvement (−0.6d) = +2.4 days saved per sprint across the team. Focus: close test coverage from 89% → 95% to qualify as DORA Elite."
      />
    </div>
  )
}
