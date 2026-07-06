import { TrendingUp } from 'lucide-react'
import { SharedAnalytics, type AnalyticsKPI, type AgentStat, type WeekTrend } from '../../shared/SharedAnalytics'
import { DEPT_MAP } from '../../../deptConfigs'
const cfg = DEPT_MAP['facilities']
const KPIS: AnalyticsKPI[] = [
  { label: 'Work Orders',      value: '64',   subtext: 'Completed this period',  color: '#F97316', trend: 'up',   trendPct: '+18%' },
  { label: 'Avg Resolution',   value: '1.8d', subtext: 'Per work order',        color: '#10B981', trend: 'down', trendPct: '−0.4d' },
  { label: 'Space Utilisation',value: '78%',  subtext: 'Office occupancy',      color: '#F59E0B', trend: 'up',   trendPct: '+6%' },
  { label: 'Inspections Due',  value: '3',    subtext: 'Overdue this period',   color: '#EF4444', trend: 'up',   trendPct: '+3' },
  { label: 'Lease Renewals',   value: '2',    subtext: 'Expiring in 90 days',   color: '#F97316', trend: 'flat', trendPct: '0' },
  { label: 'Vendor SLA %',     value: '91%',  subtext: 'Supplier compliance',   color: '#10B981', trend: 'up',   trendPct: '+3%' },
  { label: 'PM Compliance',    value: '96%',  subtext: 'Planned maintenance',   color: '#10B981', trend: 'up',   trendPct: '+2%' },
  { label: 'Energy Score',     value: 'B+',   subtext: 'vs targets',            color: '#6366F1', trend: 'up',   trendPct: '↑1 grade' },
]
const AGENTS: AgentStat[] = [
  { id: 'fac1', name: 'Facilities Manager', initials: 'FM', color: '#F97316', resolved: 22, avgHandle: '2.1d', csat: 94, slaBreaches: 1, trendVsLast: 'up',   kimmCoaching: 'Lease management and vendor SLA performance excellent. Delegate routine work orders to improve capacity.' },
  { id: 'fac2', name: 'Maintenance Lead',   initials: 'ML', color: '#FB923C', resolved: 38, avgHandle: '1.4d', csat: 92, slaBreaches: 2, trendVsLast: 'flat', kimmCoaching: '2 SLA breaches — both HVAC emergency calls during peak booking. Consider standby technician model.' },
  { id: 'fac3', name: 'Space Coordinator',  initials: 'SC', color: '#EA580C', resolved: 4,  avgHandle: '0.5d', csat: 96, slaBreaches: 0, trendVsLast: 'up',   kimmCoaching: 'Space utilisation analytics improving decisions. Develop work order skills to provide maintenance backup.' },
]
const TREND: WeekTrend[] = [
  { label: 'W1', value: 88, target: 90 }, { label: 'W2', value: 90, target: 90 },
  { label: 'W3', value: 89, target: 90 }, { label: 'W4', value: 92, target: 90 },
  { label: 'W5', value: 93, target: 90 }, { label: 'W6', value: 91, target: 90 },
  { label: 'W7', value: 94, target: 90 }, { label: 'W8', value: 95, target: 90 },
]
export function FacilitiesAnalytics() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0"><TrendingUp className="w-6 h-6 text-orange-400" /></div>
        <div><h1 className="text-2xl font-bold tracking-tight text-white">Facilities Analytics</h1><p className="text-[var(--os-text-2)] mt-1 text-sm">Work order velocity, space utilisation, and KIMMP facilities intelligence.</p></div>
      </div>
      <SharedAnalytics config={cfg} kpis={KPIS} agents={AGENTS} weekTrend={TREND} kimmInsight="Work order volume up 18% — post-office refurbishment punch list driving spike. 3 overdue inspections: fire safety in Zone C, lift annual check, and AHU 4 filter. All 3 must be completed before Fri (regulatory deadline). Space utilisation at 78% is highest in 18 months — capacity analysis needed before Q3 headcount increase." />
    </div>
  )
}
