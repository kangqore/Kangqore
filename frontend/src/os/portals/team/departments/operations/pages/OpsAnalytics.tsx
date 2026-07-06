import { TrendingUp } from 'lucide-react'
import { SharedAnalytics, type AnalyticsKPI, type AgentStat, type WeekTrend } from '../../shared/SharedAnalytics'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['operations']

const KPIS: AnalyticsKPI[] = [
  { label: 'Processes Documented', value: '84%',   subtext: 'Of total process registry',         color: '#16A34A', trend: 'up',   trendPct: '+4%' },
  { label: 'Avg Utilisation',      value: '78%',   subtext: 'Weighted avg across departments',   color: '#4ADE80', trend: 'up',   trendPct: '+2%' },
  { label: 'Vendor SLA',           value: '94%',   subtext: 'Avg SLA adherence across vendors',  color: '#10B981', trend: 'down', trendPct: '−1%' },
  { label: 'BCP Tested',           value: '67%',   subtext: 'Plans with valid test results',      color: '#F59E0B', trend: 'up',   trendPct: '+8%' },
  { label: 'SLA Breaches MTD',     value: '2',     subtext: 'Print Co. + Salesforce',            color: '#EF4444', trend: 'up',   trendPct: '+2' },
  { label: 'Approvals Pending',    value: '14',    subtext: 'Awaiting decision across business', color: '#6366F1', trend: 'up',   trendPct: '+6' },
  { label: 'Capacity Alert Depts', value: '3',     subtext: 'Engineering (Red), Delivery, HR',  color: '#F97316', trend: 'up',   trendPct: '+1' },
  { label: 'Vendor At Risk',       value: '2',     subtext: 'Print Co. + Herman Miller',         color: '#EF4444', trend: 'flat', trendPct: '0' },
]

const AGENTS: AgentStat[] = [
  {
    id: 'ops1', name: 'Suresh Nambiar', initials: 'SN', color: '#16A34A',
    resolved: 24, avgHandle: '2d', csat: 96, slaBreaches: 0, trendVsLast: 'up',
    kimmCoaching: 'Strong approval throughput and weekly reporting cadence. Engineering capacity is the business-critical priority this week — the headcount request needs MD sign-off urgently. BCP re-test for Production Database should be scheduled before end of June to clear the ISO audit risk.',
  },
  {
    id: 'ops2', name: 'Leela Krishnan', initials: 'LK', color: '#4ADE80',
    resolved: 20, avgHandle: '3d', csat: 94, slaBreaches: 0, trendVsLast: 'flat',
    kimmCoaching: 'Good vendor management oversight. Legacy Print Co. SLA breach requires formal written notice today — the 30-day cure period starts from notice date. Monthly KPI Scorecard was well-received by the MD. Automate the Vendor SLA report next quarter to reduce 3h manual effort.',
  },
]

const TREND: WeekTrend[] = [
  { label: 'W1', value: 10, target: 14 },
  { label: 'W2', value: 12, target: 14 },
  { label: 'W3', value: 14, target: 14 },
  { label: 'W4', value: 16, target: 14 },
  { label: 'W5', value: 13, target: 14 },
  { label: 'W6', value: 15, target: 14 },
  { label: 'W7', value: 17, target: 14 },
  { label: 'W8', value: 14, target: 14 },
]

export function OpsAnalytics() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#16A34A20' }}>
          <TrendingUp className="w-6 h-6" style={{ color: '#16A34A' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Operations Analytics</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Business health metrics, capacity signals, SLA performance and KIMMP operational intelligence.</p>
        </div>
      </div>
      <SharedAnalytics
        config={cfg}
        kpis={KPIS}
        agents={AGENTS}
        weekTrend={TREND}
        kimmInsight="84% process documentation is solid — targeting 95% requires capturing the 2 Ad-hoc processes (Emergency Response, Knowledge Management) this quarter. Vendor SLA aggregate is 94% but the Print Co. breach is pulling the average down; removing a non-performing vendor is the fastest route to improvement. Capacity alerts in 3 departments is a systemic signal — Kangqore is in a growth phase that requires a structured headcount planning cycle, not ad-hoc requests. Recommend a monthly capacity committee chaired by the COO."
      />
    </div>
  )
}
