import { TrendingUp } from 'lucide-react'
import { SharedAnalytics, type AnalyticsKPI, type AgentStat, type WeekTrend } from '../../shared/SharedAnalytics'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['marketing']

const KPIS: AnalyticsKPI[] = [
  { label: 'MQLs',               value: '284',    subtext: 'Marketing qualified leads',  color: '#EC4899', trend: 'up',   trendPct: '+34%' },
  { label: 'SQLs',               value: '71',     subtext: 'Sales accepted leads',       color: '#F472B6', trend: 'up',   trendPct: '+18%' },
  { label: 'CAC',                value: '£1,840', subtext: 'Cost to acquire customer',   color: '#F59E0B', trend: 'down', trendPct: '−£210' },
  { label: 'Pipeline Influenced', value: '£2.4M', subtext: 'Marketing-sourced pipeline', color: '#10B981', trend: 'up',   trendPct: '+34%' },
  { label: 'Organic Sessions',   value: '14.2k',  subtext: 'Monthly organic traffic',   color: '#6366F1', trend: 'up',   trendPct: '+12%' },
  { label: 'Email Open Rate',    value: '28.4%',  subtext: 'Campaign avg open rate',    color: '#0EA5E9', trend: 'up',   trendPct: '+3.1%' },
  { label: 'Ad ROAS',            value: '4.2x',   subtext: 'Return on ad spend',        color: '#10B981', trend: 'up',   trendPct: '+0.6x' },
  { label: 'Brand Mentions',     value: '142',    subtext: 'Tracked media mentions',     color: '#F97316', trend: 'flat', trendPct: '0' },
]

const AGENTS: AgentStat[] = [
  {
    id: 'mkt1', name: 'Priya Kapoor', initials: 'PK', color: '#EC4899',
    resolved: 48, avgHandle: '3d', csat: 97, slaBreaches: 0, trendVsLast: 'up',
    kimmCoaching: 'Pipeline influence up significantly. Q3 strategy should expand BIDS™ ABM programme — conversion rate on account-targeted campaigns is 2.8× outbound average.',
  },
  {
    id: 'mkt2', name: 'Jamie Walsh', initials: 'JW', color: '#F472B6',
    resolved: 31, avgHandle: '5d', csat: 94, slaBreaches: 1, trendVsLast: 'up',
    kimmCoaching: 'Content output strong. 1 SLA breach on whitepaper review — recommend buffering production timeline by 2 days for assets requiring legal review.',
  },
  {
    id: 'mkt3', name: 'Aisha Patel', initials: 'AP', color: '#BE185D',
    resolved: 62, avgHandle: '1d', csat: 96, slaBreaches: 0, trendVsLast: 'flat',
    kimmCoaching: 'Ad ROAS at 4.2× is best in class. Investigate LinkedIn vs Google split — LinkedIn CPL 18% lower this quarter. Recommend rebalancing budget allocation.',
  },
]

const TREND: WeekTrend[] = [
  { label: 'W1', value: 31, target: 35 },
  { label: 'W2', value: 34, target: 35 },
  { label: 'W3', value: 30, target: 35 },
  { label: 'W4', value: 38, target: 35 },
  { label: 'W5', value: 36, target: 35 },
  { label: 'W6', value: 40, target: 35 },
  { label: 'W7', value: 37, target: 35 },
  { label: 'W8', value: 42, target: 35 },
]

export function MarketingAnalytics() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-6 h-6 text-pink-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Marketing Analytics</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">MQL pipeline, ad performance, and KIMMP marketing intelligence.</p>
        </div>
      </div>
      <SharedAnalytics
        config={cfg}
        kpis={KPIS}
        agents={AGENTS}
        weekTrend={TREND}
        kimmInsight="Pipeline influence up 34% vs last quarter. BIDS™ content driving 62% of SQL attribution — the whitepaper and comparison pages are the top converting assets. Ad ROAS at 4.2× is above benchmark; LinkedIn is outperforming Google by 18% on CPL this quarter. Recommend rebalancing paid spend 60/40 LinkedIn/Google for Q3."
      />
    </div>
  )
}
