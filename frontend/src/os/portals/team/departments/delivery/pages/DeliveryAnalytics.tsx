import { TrendingUp } from 'lucide-react'
import { SharedAnalytics, type AnalyticsKPI, type AgentStat, type WeekTrend } from '../../shared/SharedAnalytics'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['delivery']

const KPIS: AnalyticsKPI[] = [
  { label: 'Projects Delivered', value: '8',     subtext: 'This quarter',             color: '#F43F5E', trend: 'up',   trendPct: '+2' },
  { label: 'On-Time Delivery',   value: '75%',   subtext: 'vs 80% target',            color: '#F59E0B', trend: 'down', trendPct: '−5%' },
  { label: 'Utilisation',        value: '78%',   subtext: 'PM capacity used',          color: '#6366F1', trend: 'up',   trendPct: '+3%' },
  { label: 'CSAT',               value: '4.3/5', subtext: 'Client delivery rating',   color: '#10B981', trend: 'up',   trendPct: '+0.2' },
  { label: 'Revenue Managed',    value: '£2.1M', subtext: 'Active SOW value',         color: '#F43F5E', trend: 'up',   trendPct: '+£280k' },
  { label: 'Margin',             value: '34%',   subtext: 'Avg project margin',        color: '#10B981', trend: 'up',   trendPct: '+2%' },
  { label: 'At-Risk Projects',   value: '3',     subtext: 'RAG Amber or Red',          color: '#EF4444', trend: 'up',   trendPct: '+1' },
  { label: 'RAID Items Closed',  value: '67%',   subtext: 'Risks & issues resolved',  color: '#A855F7', trend: 'up',   trendPct: '+12%' },
]

const AGENTS: AgentStat[] = [
  { id: 'a1', name: 'Riya Desai',   initials: 'RD', color: '#F43F5E', resolved: 12, avgHandle: '8.2w', csat: 96, slaBreaches: 0, trendVsLast: 'up',   kimmCoaching: 'Highest CSAT in portfolio. Acme and DataCo accounts are at Green — model the proactive check-in cadence for Sanjay.' },
  { id: 'a2', name: 'Sanjay Verma', initials: 'SV', color: '#F97316', resolved: 10, avgHandle: '9.8w', csat: 90, slaBreaches: 2, trendVsLast: 'flat', kimmCoaching: 'GlobalMed report overdue is the priority. FinServ escalation needs a recovery plan this week before it impacts CSAT further.' },
]

const TREND: WeekTrend[] = [
  { label: 'W1', value: 70, target: 80 },
  { label: 'W2', value: 72, target: 80 },
  { label: 'W3', value: 75, target: 80 },
  { label: 'W4', value: 74, target: 80 },
  { label: 'W5', value: 78, target: 80 },
  { label: 'W6', value: 76, target: 80 },
  { label: 'W7', value: 80, target: 80 },
  { label: 'W8', value: 75, target: 80 },
]

export function DeliveryAnalytics() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-6 h-6 text-rose-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Delivery Analytics</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Project performance, PM leaderboard, and KIMMP delivery intelligence.</p>
        </div>
      </div>
      <SharedAnalytics
        config={cfg}
        kpis={KPIS}
        agents={AGENTS}
        weekTrend={TREND}
        kimmInsight="On-time delivery at 75% vs 80% target — 3 projects slipped due to scope underestimation (GlobalMed) and vendor dependency (FinServ). Margin improving at 34%: efficiency gains from KIMMP resource planning. To hit 80% OTD next quarter: implement change control earlier in discovery. RAID close rate at 67% is a leading indicator — projects closing 80%+ of RAID items by week 4 have 91% on-time delivery."
      />
    </div>
  )
}
