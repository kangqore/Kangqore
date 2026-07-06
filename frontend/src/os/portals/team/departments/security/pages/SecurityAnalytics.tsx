import { TrendingUp } from 'lucide-react'
import { SharedAnalytics, type AnalyticsKPI, type AgentStat, type WeekTrend } from '../../shared/SharedAnalytics'
import { DEPT_MAP } from '../../../deptConfigs'
const cfg = DEPT_MAP['security']
const KPIS: AnalyticsKPI[] = [
  { label: 'MTTR (Incidents)',  value: '3h 12m', subtext: 'Mean time to resolve',  color: '#EF4444', trend: 'down',  trendPct: '−22%' },
  { label: 'Vulnerabilities',   value: '14',     subtext: 'Open critical/high',    color: '#F87171', trend: 'down',  trendPct: '−6' },
  { label: 'SLA Compliance',    value: '96.1%',  subtext: 'Incident response SLA', color: '#10B981', trend: 'up',    trendPct: '+1.5%' },
  { label: 'Access Reviews',    value: '100%',   subtext: 'Completed this quarter', color: '#10B981', trend: 'flat',  trendPct: '0%' },
  { label: 'SIEM Alerts',       value: '2,841',  subtext: 'Triaged this period',   color: '#6366F1', trend: 'up',    trendPct: '+15%' },
  { label: 'False Positive %',  value: '3.2%',   subtext: 'Alert noise reduction',  color: '#F59E0B', trend: 'down',  trendPct: '−1.1%' },
  { label: 'CVEs Patched',      value: '28',     subtext: 'Within SLA',             color: '#10B981', trend: 'up',    trendPct: '+8' },
  { label: 'Pen Test Coverage', value: '78%',    subtext: 'Surface area tested',   color: '#F97316', trend: 'up',    trendPct: '+12%' },
]
const AGENTS: AgentStat[] = [
  { id: 'sec1', name: 'Security Lead',    initials: 'SL', color: '#EF4444', resolved: 48, avgHandle: '3h 2m', csat: 99, slaBreaches: 0, trendVsLast: 'up',   kimmCoaching: 'Exceptional incident response. Recommend threat modelling training for team.' },
  { id: 'sec2', name: 'Security Analyst', initials: 'SA', color: '#F87171', resolved: 42, avgHandle: '2h 51m', csat: 97, slaBreaches: 1, trendVsLast: 'flat', kimmCoaching: 'Strong vulnerability management. Deepen SIEM query skills to reduce false positives.' },
]
const TREND: WeekTrend[] = [
  { label: 'W1', value: 92, target: 95 }, { label: 'W2', value: 94, target: 95 },
  { label: 'W3', value: 95, target: 95 }, { label: 'W4', value: 97, target: 95 },
  { label: 'W5', value: 96, target: 95 }, { label: 'W6', value: 98, target: 95 },
  { label: 'W7', value: 96, target: 95 }, { label: 'W8', value: 97, target: 95 },
]
export function SecurityAnalytics() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0"><TrendingUp className="w-6 h-6 text-red-400" /></div>
        <div><h1 className="text-2xl font-bold tracking-tight text-white">Security Analytics</h1><p className="text-[var(--os-text-2)] mt-1 text-sm">Incident response performance, vulnerability trends, and KIMMP threat intelligence.</p></div>
      </div>
      <SharedAnalytics config={cfg} kpis={KPIS} agents={AGENTS} weekTrend={TREND} kimmInsight="SIEM alert volume up 15% this period — 97% attributed to new AWS CloudTrail policy changes, not actual threats. False positive rate improved to 3.2% (down from 4.3%). CVE-2026-1182 nginx vulnerability is highest current risk: 4 prod servers unpatched. Recommend emergency patch window this week." />
    </div>
  )
}
