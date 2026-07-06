import { TrendingUp } from 'lucide-react'
import { SharedAnalytics, type AnalyticsKPI, type AgentStat, type WeekTrend } from '../../shared/SharedAnalytics'
import { DEPT_MAP } from '../../../deptConfigs'
const cfg = DEPT_MAP['hr']
const KPIS: AnalyticsKPI[] = [
  { label: 'Time-to-Hire',     value: '28d',   subtext: 'Avg offer acceptance',  color: '#8B5CF6', trend: 'down',  trendPct: '−5d' },
  { label: 'Headcount',        value: '47',    subtext: 'Active employees',      color: '#10B981', trend: 'up',    trendPct: '+3' },
  { label: 'Attrition Rate',   value: '8.2%',  subtext: 'Rolling 12 months',    color: '#F59E0B', trend: 'down',  trendPct: '−1.8%' },
  { label: 'Open Roles',       value: '6',     subtext: 'Active JDs',            color: '#6366F1', trend: 'flat',  trendPct: '0' },
  { label: 'eNPS',             value: '+34',   subtext: 'Employee NPS',          color: '#10B981', trend: 'up',    trendPct: '+7' },
  { label: 'Leave Utilisation',value: '76%',   subtext: 'Leave days taken/yr',  color: '#F97316', trend: 'up',    trendPct: '+6%' },
  { label: 'Training Compl.',  value: '91%',   subtext: 'Mandatory modules',    color: '#10B981', trend: 'up',    trendPct: '+5%' },
  { label: 'HR Cases',         value: '3',     subtext: 'Open ER cases',        color: '#EF4444', trend: 'flat',  trendPct: '0' },
]
const AGENTS: AgentStat[] = [
  { id: 'hr1', name: 'HRBP Lead',  initials: 'HL', color: '#8B5CF6', resolved: 34, avgHandle: '2d', csat: 96, slaBreaches: 0, trendVsLast: 'up',   kimmCoaching: 'High CSAT across ER cases. Consider expanding TUPE/redundancy expertise.' },
  { id: 'hr2', name: 'HR Admin',   initials: 'HA', color: '#A78BFA', resolved: 82, avgHandle: '4h', csat: 93, slaBreaches: 1, trendVsLast: 'flat', kimmCoaching: 'High volume admin efficiency. 1 SLA breach on payroll deadline — process review recommended.' },
  { id: 'hr3', name: 'Recruiter',  initials: 'RC', color: '#7C3AED', resolved: 6,  avgHandle: '28d',csat: 94, slaBreaches: 0, trendVsLast: 'up',   kimmCoaching: 'Time-to-hire 5 days below target. Tech roles close 2× faster with skills assessments added.' },
]
const TREND: WeekTrend[] = [
  { label: 'W1', value: 85, target: 90 }, { label: 'W2', value: 87, target: 90 },
  { label: 'W3', value: 89, target: 90 }, { label: 'W4', value: 91, target: 90 },
  { label: 'W5', value: 92, target: 90 }, { label: 'W6', value: 91, target: 90 },
  { label: 'W7', value: 93, target: 90 }, { label: 'W8', value: 94, target: 90 },
]
export function HRAnalytics() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0"><TrendingUp className="w-6 h-6 text-violet-400" /></div>
        <div><h1 className="text-2xl font-bold tracking-tight text-white">HR Analytics</h1><p className="text-[var(--os-text-2)] mt-1 text-sm">Headcount, attrition, eNPS trends, and KIMMP people intelligence.</p></div>
      </div>
      <SharedAnalytics config={cfg} kpis={KPIS} agents={AGENTS} weekTrend={TREND} kimmInsight="Attrition dropped 1.8% — correlated with eNPS rising +7 points and the flexible work policy rollout (Q1). 3 ER cases open this period; KIMMP predicts 1 is moderate churn risk (declining engagement signals). Time-to-hire for tech roles is below target — skills assessments added in March have been the key driver." />
    </div>
  )
}
