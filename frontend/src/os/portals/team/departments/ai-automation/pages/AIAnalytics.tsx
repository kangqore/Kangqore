import { TrendingUp } from 'lucide-react'
import { SharedAnalytics, type AnalyticsKPI, type AgentStat, type WeekTrend } from '../../shared/SharedAnalytics'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['ai-automation']

const KPIS: AnalyticsKPI[] = [
  { label: 'Active Agents',       value: '80',      subtext: 'KIMMP + WAANDA + AEGIS fleet', color: '#D946EF', trend: 'up',   trendPct: '+4' },
  { label: 'Workflows Running',   value: '34',      subtext: 'Active automation workflows',   color: '#E879F9', trend: 'up',   trendPct: '+2' },
  { label: 'LLM Requests/Day',    value: '48k',     subtext: 'Across all models',             color: '#A855F7', trend: 'up',   trendPct: '+6k' },
  { label: 'Tasks Saved/Wk',      value: '1,240',   subtext: 'Automation hours recovered',    color: '#10B981', trend: 'up',   trendPct: '+84' },
  { label: 'AI Cost MTD',         value: '£8,420',  subtext: 'LLM + infrastructure spend',   color: '#EF4444', trend: 'up',   trendPct: '+£420' },
  { label: 'Avg Latency',         value: '1.2s',    subtext: 'Weighted avg across agents',    color: '#F59E0B', trend: 'down', trendPct: '−0.2s' },
  { label: 'Error Rate',          value: '0.4%',    subtext: 'Agent & workflow errors',       color: '#10B981', trend: 'down', trendPct: '−0.1%' },
  { label: 'Experiments Active',  value: '6',       subtext: 'Running LLM experiments',       color: '#6366F1', trend: 'up',   trendPct: '+2' },
]

const AGENTS: AgentStat[] = [
  {
    id: 'ai1', name: 'Rohan Gupta', initials: 'RG', color: '#D946EF',
    resolved: 34, avgHandle: '2d', csat: 96, slaBreaches: 0, trendVsLast: 'up',
    kimmCoaching: 'Excellent velocity on agent deployments. LLM cost at £8.4k MTD — model tier optimisation could reduce by 15% without quality loss. Prioritise promoting EXP-001 haiku results to production to capture the savings. Legacy Summariser still receiving 12 tasks/day — migrate and deprecate this week.',
  },
  {
    id: 'ai2', name: 'Priya Sharma', initials: 'PS', color: '#E879F9',
    resolved: 28, avgHandle: '3d', csat: 94, slaBreaches: 0, trendVsLast: 'up',
    kimmCoaching: 'AI governance programme is strong — bias review coverage is the gap. Support Triage Agent needs a bias review added to the sprint. Churn model conditional approval is blocking; focus on the SHAP explainability improvement to reach >75%. Good experimental design on EXP-006 (multi-agent code review).',
  },
]

const TREND: WeekTrend[] = [
  { label: 'W1', value: 38, target: 34 },
  { label: 'W2', value: 36, target: 34 },
  { label: 'W3', value: 40, target: 34 },
  { label: 'W4', value: 42, target: 34 },
  { label: 'W5', value: 44, target: 34 },
  { label: 'W6', value: 41, target: 34 },
  { label: 'W7', value: 38, target: 34 },
  { label: 'W8', value: 48, target: 34 },
]

export function AIAnalytics() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#D946EF20' }}>
          <TrendingUp className="w-6 h-6" style={{ color: '#D946EF' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">AI &amp; Automation Analytics</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Agent fleet metrics, LLM spend intelligence, and KIMMP AI insights.</p>
        </div>
      </div>
      <SharedAnalytics
        config={cfg}
        kpis={KPIS}
        agents={AGENTS}
        weekTrend={TREND}
        kimmInsight="80 active agents processing 48k LLM requests/day — the AI fleet is healthy. LLM cost at £8,420 MTD is tracking to £16.8k monthly; the haiku promotion for triage (EXP-001) could reduce this by ~£400/month. 1,240 tasks saved per week is equivalent to ~31 FTE hours — this justifies the AI programme ROI. Error rate at 0.4% is within threshold; the Legacy Data Sync workflow error is the only active incident requiring immediate attention."
      />
    </div>
  )
}
