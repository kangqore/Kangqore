import { TrendingUp } from 'lucide-react'
import { SharedAnalytics, type AnalyticsKPI, type AgentStat, type WeekTrend } from '../../shared/SharedAnalytics'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['data-analytics']

const KPIS: AnalyticsKPI[] = [
  { label: 'Dashboards Live',   value: '28',    subtext: 'Active BI dashboards',           color: '#0284C7', trend: 'up',   trendPct: '+3' },
  { label: 'Reports Automated', value: '64',    subtext: 'Scheduled automated reports',    color: '#38BDF8', trend: 'up',   trendPct: '+8' },
  { label: 'Data Sources',      value: '19',    subtext: 'Connected data source catalogue',color: '#6366F1', trend: 'up',   trendPct: '+2' },
  { label: 'KPIs Tracked',      value: '142',   subtext: 'Business KPIs in registry',      color: '#10B981', trend: 'up',   trendPct: '+12' },
  { label: 'BI Requests',       value: '8 open',subtext: 'Open backlog items',             color: '#F59E0B', trend: 'up',   trendPct: '+3' },
  { label: 'Data Quality',      value: '94%',   subtext: 'Weighted avg across sources',    color: '#10B981', trend: 'up',   trendPct: '+1%' },
  { label: 'Query Volume/day',  value: '12.4k', subtext: 'Avg daily warehouse queries',    color: '#A78BFA', trend: 'up',   trendPct: '+840' },
  { label: 'Forecast Accuracy', value: '87%',   subtext: 'Avg across active models',       color: '#F97316', trend: 'flat', trendPct: '0' },
]

const AGENTS: AgentStat[] = [
  {
    id: 'da1', name: 'Vikram Rao', initials: 'VR', color: '#0284C7',
    resolved: 28, avgHandle: '3d', csat: 97, slaBreaches: 0, trendVsLast: 'up',
    kimmCoaching: 'Strong delivery across dashboards and KPI registry. Board Data Pack is due 25 June — ensure final cut-off is actioned today. Revenue Forecast accuracy at 91% is best-in-class; document the methodology for team knowledge transfer.',
  },
  {
    id: 'da2', name: 'Deepa Menon', initials: 'DM', color: '#38BDF8',
    resolved: 22, avgHandle: '4d', csat: 95, slaBreaches: 0, trendVsLast: 'up',
    kimmCoaching: 'Churn Prediction model at 84% is the key improvement area — add product usage feature signals from the Kafka stream. Marketing Attribution dashboard is highly valued by the CMO; ensure data freshness is maintained as the HubSpot integration scales.',
  },
  {
    id: 'da3', name: 'Cyrus Irani', initials: 'CI', color: '#6366F1',
    resolved: 18, avgHandle: '2d', csat: 96, slaBreaches: 0, trendVsLast: 'flat',
    kimmCoaching: 'Data infrastructure is solid — 2 streaming sources at 99% quality. Engineering Velocity dashboard review is pending; move to done by EOD. JIRA integration should be extended to include release tagging for better sprint analytics.',
  },
]

const TREND: WeekTrend[] = [
  { label: 'W1', value: 6,  target: 8 },
  { label: 'W2', value: 9,  target: 8 },
  { label: 'W3', value: 7,  target: 8 },
  { label: 'W4', value: 10, target: 8 },
  { label: 'W5', value: 8,  target: 8 },
  { label: 'W6', value: 11, target: 8 },
  { label: 'W7', value: 9,  target: 8 },
  { label: 'W8', value: 8,  target: 8 },
]

export function DAAnalytics() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#0284C720' }}>
          <TrendingUp className="w-6 h-6" style={{ color: '#0284C7' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Data &amp; Analytics Analytics</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Platform metrics, team velocity, and KIMMP data intelligence.</p>
        </div>
      </div>
      <SharedAnalytics
        config={cfg}
        kpis={KPIS}
        agents={AGENTS}
        weekTrend={TREND}
        kimmInsight="28 live dashboards serving all business functions — adoption is strong at 12.4k queries/day. Data quality at 94% is good but 2 sources are below 85%: Google Analytics (88%) and Excel Finance exports (76%). The Excel source is the highest-risk — eliminate it by migrating to direct Xero API. BI backlog at 8 items is growing; churn prediction and revenue attribution are the two highest-value deliverables to prioritise this sprint."
      />
    </div>
  )
}
