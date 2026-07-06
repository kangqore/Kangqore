import { TrendingUp } from 'lucide-react'
import { SharedAnalytics, type AnalyticsKPI, type AgentStat, type WeekTrend } from '../../shared/SharedAnalytics'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['risk-compliance']

const KPIS: AnalyticsKPI[] = [
  { label: 'Open Risks',         value: '34',    subtext: 'Active risk register items',       color: '#EF4444', trend: 'down', trendPct: '−3' },
  { label: 'Critical',           value: '4',     subtext: 'High impact, open status',         color: '#B91C1C', trend: 'flat', trendPct: '0' },
  { label: 'Frameworks Tracked', value: '6',     subtext: 'ISO/SOC2/GDPR/DPDP/HIPAA/Int.',  color: '#6366F1', trend: 'flat', trendPct: '0' },
  { label: 'Compliance Score',   value: '89%',   subtext: 'Weighted avg across frameworks',   color: '#10B981', trend: 'up',   trendPct: '+2%' },
  { label: 'Audits Due',         value: '3',     subtext: 'Scheduled in next 60 days',        color: '#F59E0B', trend: 'flat', trendPct: '0' },
  { label: 'Policy Overdue',     value: '2',     subtext: 'Reviews past due date',            color: '#EF4444', trend: 'up',   trendPct: '+2' },
  { label: 'Exceptions Active',  value: '7',     subtext: 'Above 5-exception threshold',      color: '#F97316', trend: 'up',   trendPct: '+2' },
  { label: 'Vendors Assessed',   value: '24/36', subtext: 'Third-party risk reviews done',    color: '#0EA5E9', trend: 'up',   trendPct: '+4' },
]

const AGENTS: AgentStat[] = [
  {
    id: 'rc1', name: 'Maya Nair', initials: 'MN', color: '#B91C1C',
    resolved: 18, avgHandle: '4d', csat: 96, slaBreaches: 0, trendVsLast: 'up',
    kimmCoaching: 'Strong controls ownership. ISO audit is 5 weeks out — prioritise the A.15 supplier evidence pack. The BCP re-test is the most critical outstanding item; a failed control at Stage 2 audit could delay certification by 6 months.',
  },
  {
    id: 'rc2', name: 'Arjun Singh', initials: 'AS', color: '#EF4444',
    resolved: 14, avgHandle: '5d', csat: 94, slaBreaches: 1, trendVsLast: 'flat',
    kimmCoaching: 'DPDP work is strategically important. 1 SLA breach on audit coordination — recommend building a 3-day buffer into audit evidence collection cycles. GDPR internal audit should close within 2 weeks; the DPA review is the blocking item.',
  },
]

const TREND: WeekTrend[] = [
  { label: 'W1', value: 37, target: 34 },
  { label: 'W2', value: 36, target: 34 },
  { label: 'W3', value: 35, target: 34 },
  { label: 'W4', value: 34, target: 34 },
  { label: 'W5', value: 36, target: 34 },
  { label: 'W6', value: 35, target: 34 },
  { label: 'W7', value: 34, target: 34 },
  { label: 'W8', value: 34, target: 34 },
]

export function RCAnalytics() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#B91C1C20' }}>
          <TrendingUp className="w-6 h-6" style={{ color: '#B91C1C' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Risk &amp; Compliance Analytics</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Risk posture, compliance scores, audit pipeline and KIMMP intelligence.</p>
        </div>
      </div>
      <SharedAnalytics
        config={cfg}
        kpis={KPIS}
        agents={AGENTS}
        weekTrend={TREND}
        kimmInsight="Overall compliance score improved to 89% — driven by SOC 2 certification and GDPR progress. DPDP at 34% remains the primary regulatory risk entering Q3. 7 active exceptions exceed the policy threshold of 5; a Risk Committee review is required. ISO Stage 2 audit in 5 weeks is on track but the failed BCP test (AUD-008) must be re-run before then. Vendors assessed rate is 67% — prioritise the remaining 12 Tier 1/2 vendors."
      />
    </div>
  )
}
