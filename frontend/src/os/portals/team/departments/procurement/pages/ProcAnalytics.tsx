import { TrendingUp } from 'lucide-react'
import { SharedAnalytics, type AnalyticsKPI, type AgentStat, type WeekTrend } from '../../shared/SharedAnalytics'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['procurement']

const KPIS: AnalyticsKPI[] = [
  { label: 'Total Spend YTD',    value: '£793k',  subtext: 'Across all categories',          color: '#7C3AED', trend: 'up',   trendPct: '+8%' },
  { label: 'Open PRs',           value: '12',     subtext: 'Purchase requests in flight',    color: '#F59E0B', trend: 'down', trendPct: '−3' },
  { label: 'POs Active',         value: '34',     subtext: 'Open purchase orders',           color: '#6366F1', trend: 'flat', trendPct: '0' },
  { label: 'Avg Lead Time',      value: '8d',     subtext: 'From PR to PO delivery',        color: '#0EA5E9', trend: 'down', trendPct: '−2d' },
  { label: 'Savings Achieved',   value: '£124k',  subtext: 'YTD vs budget baseline',        color: '#10B981', trend: 'up',   trendPct: '+£18k' },
  { label: 'Vendor Count',       value: '47',     subtext: 'Active approved vendors',       color: '#A78BFA', trend: 'flat', trendPct: '0' },
  { label: 'Contract Renewals',  value: '3 due',  subtext: 'Due within 30 days',            color: '#EF4444', trend: 'up',   trendPct: '+2' },
  { label: 'Budget Utilisation', value: '67%',    subtext: 'YTD vs annual budget',          color: '#F97316', trend: 'up',   trendPct: '+5%' },
]

const AGENTS: AgentStat[] = [
  {
    id: 'proc1', name: 'Aarav Patel', initials: 'AP', color: '#7C3AED',
    resolved: 22, avgHandle: '3d', csat: 95, slaBreaches: 0, trendVsLast: 'up',
    kimmCoaching: 'Strong approval turnaround. The AWS invoice dispute needs commercial escalation — recommend a vendor call this week. Catalogue usage is increasing; consider adding a self-service ordering workflow for low-value items to reduce manual PR volume.',
  },
  {
    id: 'proc2', name: 'Nisha Kapoor', initials: 'NK', color: '#A78BFA',
    resolved: 19, avgHandle: '4d', csat: 93, slaBreaches: 1, trendVsLast: 'flat',
    kimmCoaching: 'Contract renewals are the priority this week — Salesforce MSA has expired. 1 SLA breach on PR processing; triage the approval queue daily to stay within 3-day target. Vendor directory review for Westlaw and Herman Miller is overdue.',
  },
]

const TREND: WeekTrend[] = [
  { label: 'W1', value: 9,  target: 12 },
  { label: 'W2', value: 14, target: 12 },
  { label: 'W3', value: 11, target: 12 },
  { label: 'W4', value: 13, target: 12 },
  { label: 'W5', value: 10, target: 12 },
  { label: 'W6', value: 15, target: 12 },
  { label: 'W7', value: 12, target: 12 },
  { label: 'W8', value: 12, target: 12 },
]

export function ProcAnalytics() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#7C3AED20' }}>
          <TrendingUp className="w-6 h-6" style={{ color: '#7C3AED' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Procurement Analytics</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Spend intelligence, vendor performance and KIMMP procurement insights.</p>
        </div>
      </div>
      <SharedAnalytics
        config={cfg}
        kpis={KPIS}
        agents={AGENTS}
        weekTrend={TREND}
        kimmInsight="£793k YTD spend on track; savings programme has delivered £124k against a £100k target. 3 contract renewals due within 30 days — Salesforce is already expired. Recommend a dedicated contract renewal sprint next week. Avg lead time improved to 8 days (down from 10 days last quarter) — the catalogue workflow is driving efficiency. Budget utilisation at 67% with 6 months elapsed suggests Q3 will need controlled acceleration to avoid budget clawback."
      />
    </div>
  )
}
