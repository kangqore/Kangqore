import { TrendingUp } from 'lucide-react'
import { SharedAnalytics, type AnalyticsKPI, type AgentStat, type WeekTrend } from '../../shared/SharedAnalytics'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['sales']

const KPIS: AnalyticsKPI[] = [
  { label: 'Pipeline Value',   value: '£1.24M', subtext: 'Total active pipeline',    color: '#0EA5E9', trend: 'up',   trendPct: '+£180k' },
  { label: 'Win Rate',         value: '63%',    subtext: 'vs 55% last quarter',      color: '#10B981', trend: 'up',   trendPct: '+8%'    },
  { label: 'Avg Deal Size',    value: '£89k',   subtext: 'Per closed deal',          color: '#8B5CF6', trend: 'up',   trendPct: '+£12k'  },
  { label: 'Sales Cycle',      value: '34 days',subtext: 'Avg prospect to close',   color: '#F59E0B', trend: 'down', trendPct: '−6 days'},
  { label: 'Q2 Attainment',    value: '78%',    subtext: '£840k of £1.08M',         color: '#F97316', trend: 'up',   trendPct: '+14%'   },
  { label: 'SQLs',             value: '24',     subtext: 'Qualified this period',    color: '#06B6D4', trend: 'up',   trendPct: '+6'     },
  { label: 'New Logos',        value: '3',      subtext: 'Net new clients',          color: '#10B981', trend: 'flat', trendPct: '0'      },
  { label: 'NRR',              value: '112%',   subtext: 'Net revenue retention',    color: '#6366F1', trend: 'up',   trendPct: '+4%'    },
]

const AGENTS: AgentStat[] = [
  { id: 's1', name: 'Arjun Shah',  initials: 'AS', color: '#0EA5E9', resolved: 5,  avgHandle: '28 days', csat: 96, slaBreaches: 0, trendVsLast: 'up',   kimmCoaching: 'Top closer — highest deal value average (£134k). Enterprise specialist. Recommend targeting GlobalMed upsell post-close.' },
  { id: 's2', name: 'Meera Nair',  initials: 'MN', color: '#8B5CF6', resolved: 4,  avgHandle: '36 days', csat: 91, slaBreaches: 1, trendVsLast: 'up',   kimmCoaching: 'Strong proposal writer — 3 of 4 wins had a proposal sent within 24h of demo. Continue that pattern.' },
  { id: 's3', name: 'Dev Patel',   initials: 'DP', color: '#10B981', resolved: 3,  avgHandle: '41 days', csat: 85, slaBreaches: 2, trendVsLast: 'flat', kimmCoaching: '67% attainment — 3 deals lost on pricing. Consider co-pitching with Arjun on next enterprise deal to learn negotiation approach.' },
]

const TREND: WeekTrend[] = [
  { label: 'W1', value: 58, target: 63 }, { label: 'W2', value: 60, target: 63 },
  { label: 'W3', value: 55, target: 63 }, { label: 'W4', value: 62, target: 63 },
  { label: 'W5', value: 65, target: 63 }, { label: 'W6', value: 63, target: 63 },
  { label: 'W7', value: 68, target: 63 }, { label: 'W8', value: 63, target: 63 },
]

export function SalesAnalytics() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-6 h-6 text-sky-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Sales Analytics</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Pipeline trends, rep leaderboard, and KIMMP coaching insights.</p>
        </div>
      </div>
      <SharedAnalytics
        config={cfg} kpis={KPIS} agents={AGENTS} weekTrend={TREND}
        kimmInsight="Win rate up 8% vs last quarter. Enterprise deals >£200k closing 2.1x faster when technical demo is included in week 1. Dev Patel's 3 lost deals all had pricing as the primary objection — recommend a discount authority review and structured negotiation training before Q3."
      />
    </div>
  )
}
