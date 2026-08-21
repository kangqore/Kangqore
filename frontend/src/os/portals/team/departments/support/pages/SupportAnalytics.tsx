import { TrendingUp } from 'lucide-react'
import { SharedAnalytics, type AnalyticsKPI, type AgentStat, type WeekTrend } from '../../shared/SharedAnalytics'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['support']

const KPIS: AnalyticsKPI[] = [
  { label: 'CSAT',             value: '4.4/5',  subtext: 'avg user rating',        color: '#06B6D4', trend: 'up',   trendPct: '+0.3' },
  { label: 'SLA Compliance',   value: '91.8%',  subtext: 'vs 90% target',          color: '#10B981', trend: 'up',   trendPct: '+1.8%' },
  { label: 'Tickets Resolved', value: '487',    subtext: 'This period',            color: '#F59E0B', trend: 'up',   trendPct: '+12%' },
  { label: 'Avg Handle Time',  value: '38m',    subtext: 'Per ticket',             color: '#6366F1', trend: 'down', trendPct: '−9%' },
  { label: 'Escalations',      value: '14',     subtext: 'Went to engineering',    color: '#EF4444', trend: 'down', trendPct: '−4' },
  { label: 'First Contact Res',value: '72%',    subtext: 'No follow-up needed',    color: '#10B981', trend: 'up',   trendPct: '+6%' },
  { label: 'Churn Risks ID',   value: '3',      subtext: 'KIMMP flagged',          color: '#F97316', trend: 'flat', trendPct: '0' },
  { label: 'NPS Contribution', value: '+42',    subtext: 'Support NPS',            color: '#8B5CF6', trend: 'up',   trendPct: '+7' },
]

const AGENTS: AgentStat[] = [
  { id: 'b1', name: 'Meera Joshi',  initials: 'MJ', color: '#06B6D4', resolved: 142, avgHandle: '36m', csat: 97, slaBreaches: 1, trendVsLast: 'up',   kimmCoaching: 'Top performer — enterprise ticket specialist. Consider promotion to Lead.' },
  { id: 'b2', name: 'Dev Patel',    initials: 'DP', color: '#10B981', resolved: 128, avgHandle: '39m', csat: 95, slaBreaches: 2, trendVsLast: 'up',   kimmCoaching: 'Excellent bug resolution speed. Auth ticket expertise makes them a training asset.' },
  { id: 'b3', name: 'Raj Pillai',   initials: 'RP', color: '#8B5CF6', resolved: 115, avgHandle: '41m', csat: 88, slaBreaches: 4, trendVsLast: 'flat', kimmCoaching: '4 SLA breaches — all P2 escalations during short-staffed periods. Not agent fault.' },
  { id: 'b4', name: 'Nisha Singh',  initials: 'NS', color: '#F59E0B', resolved: 102, avgHandle: '33m', csat: 92, slaBreaches: 0, trendVsLast: 'up',   kimmCoaching: 'Fastest handle time. Integration tickets resolved at 2× team average speed.' },
]

const TREND: WeekTrend[] = [
  { label: 'W1', value: 87, target: 90 }, { label: 'W2', value: 89, target: 90 },
  { label: 'W3', value: 88, target: 90 }, { label: 'W4', value: 91, target: 90 },
  { label: 'W5', value: 93, target: 90 }, { label: 'W6', value: 90, target: 90 },
  { label: 'W7', value: 92, target: 90 }, { label: 'W8', value: 95, target: 90 },
]

export function SupportAnalytics() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-6 h-6 text-[#2564ea]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Support Analytics</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">CSAT trends, agent leaderboard, and KIMMP coaching insights.</p>
        </div>
      </div>
      <SharedAnalytics
        config={cfg} kpis={KPIS} agents={AGENTS} weekTrend={TREND}
        kimmInsight="FCR improved 6% — Nisha's integration KB articles are deflecting 18% of repeat tickets. 3 churn-risk clients flagged: Acme, Primark Digital, and Nexus Corp. All three have CSAT <3.2 this month. Recommend proactive executive outreach within 48h."
      />
    </div>
  )
}
