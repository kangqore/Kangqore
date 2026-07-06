import { TrendingUp } from 'lucide-react'
import { SharedAnalytics, type AnalyticsKPI, type AgentStat, type WeekTrend } from '../../shared/SharedAnalytics'
import { DEPT_MAP } from '../../../deptConfigs'
const cfg = DEPT_MAP['finance']
const KPIS: AnalyticsKPI[] = [
  { label: 'Month-End Close',   value: '3d',    subtext: 'Avg days to close',    color: '#10B981', trend: 'down',  trendPct: '−1d' },
  { label: 'Budget Variance',   value: '2.1%',  subtext: 'Under/over target',    color: '#F59E0B', trend: 'down',  trendPct: '−0.9%' },
  { label: 'Invoices Processed',value: '312',   subtext: 'This period',          color: '#10B981', trend: 'up',    trendPct: '+18%' },
  { label: 'AP Days',           value: '34d',   subtext: 'Avg payable days',     color: '#6366F1', trend: 'flat',  trendPct: '0%' },
  { label: 'Expense Reports',   value: '87',    subtext: 'Processed on time',    color: '#10B981', trend: 'up',    trendPct: '+12%' },
  { label: 'Approvals Pending', value: '5',     subtext: 'Awaiting sign-off',    color: '#EF4444', trend: 'up',    trendPct: '+2' },
  { label: 'Forecast Accuracy', value: '94.2%', subtext: 'vs actual P&L',       color: '#10B981', trend: 'up',    trendPct: '+3.1%' },
  { label: 'Vendor Contracts',  value: '14',    subtext: 'Expiring in 90 days', color: '#F97316', trend: 'up',    trendPct: '+4' },
]
const AGENTS: AgentStat[] = [
  { id: 'f1', name: 'Finance Lead',  initials: 'FL', color: '#10B981', resolved: 42, avgHandle: '1.2d', csat: 98, slaBreaches: 0, trendVsLast: 'up',   kimmCoaching: 'Forecasting accuracy class-leading. Recommend quarterly board-level financial briefing ownership.' },
  { id: 'f2', name: 'Accountant',    initials: 'AC', color: '#34D399', resolved: 38, avgHandle: '0.8d', csat: 95, slaBreaches: 1, trendVsLast: 'flat', kimmCoaching: '1 SLA breach on month-end — overlap with audit period. Consider staggered close calendar.' },
  { id: 'f3', name: 'AP Specialist', initials: 'AP', color: '#6EE7B7', resolved: 312,avgHandle: '2h',  csat: 92, slaBreaches: 2, trendVsLast: 'up',   kimmCoaching: 'Invoice processing +18% volume. Consider AP automation for recurring vendor invoices.' },
]
const TREND: WeekTrend[] = [
  { label: 'W1', value: 90, target: 95 }, { label: 'W2', value: 92, target: 95 },
  { label: 'W3', value: 94, target: 95 }, { label: 'W4', value: 95, target: 95 },
  { label: 'W5', value: 96, target: 95 }, { label: 'W6', value: 94, target: 95 },
  { label: 'W7', value: 97, target: 95 }, { label: 'W8', value: 96, target: 95 },
]
export function FinanceAnalytics() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0"><TrendingUp className="w-6 h-6 text-emerald-400" /></div>
        <div><h1 className="text-2xl font-bold tracking-tight text-white">Finance Analytics</h1><p className="text-[var(--os-text-2)] mt-1 text-sm">Month-end performance, AP velocity, forecast accuracy, and KIMMP insights.</p></div>
      </div>
      <SharedAnalytics config={cfg} kpis={KPIS} agents={AGENTS} weekTrend={TREND} kimmInsight="Month-end close improved by 1 day vs prior period — driven by pre-close automation for recurring accruals. 14 vendor contracts expiring in 90 days: 4 are sole-source high-spend — flag for procurement review. Budget variance 2.1% is within target; engineering over-spend (+8%) offset by marketing under-spend (−6%)." />
    </div>
  )
}
