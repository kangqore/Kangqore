import { TrendingUp } from 'lucide-react'
import { SharedAnalytics, type AnalyticsKPI, type AgentStat, type WeekTrend } from '../../shared/SharedAnalytics'
import { DEPT_MAP } from '../../../deptConfigs'

const cfg = DEPT_MAP['innovation-rd']

const KPIS: AnalyticsKPI[] = [
  { label: 'Ideas Submitted',   value: '142',  subtext: 'Total in the pipeline',            color: '#CA8A04', trend: 'up',   trendPct: '+18' },
  { label: 'Experiments Active',value: '8',    subtext: 'Running experiments',               color: '#F59E0B', trend: 'up',   trendPct: '+2' },
  { label: 'Prototypes',        value: '12',   subtext: 'From Concept to Pilot',            color: '#D946EF', trend: 'up',   trendPct: '+3' },
  { label: 'Success Rate',      value: '34%',  subtext: 'Experiments reaching success',     color: '#10B981', trend: 'up',   trendPct: '+4%' },
  { label: 'Patents Filed',     value: '6',    subtext: 'Active IP portfolio',               color: '#6366F1', trend: 'up',   trendPct: '+2' },
  { label: 'Research Papers',   value: '48',   subtext: 'In the research library',           color: '#0284C7', trend: 'up',   trendPct: '+6' },
  { label: 'Partners',          value: '9',    subtext: 'University / Startup / Govt',      color: '#F97316', trend: 'up',   trendPct: '+1' },
  { label: 'Avg Idea-to-PoC',   value: '67d',  subtext: 'Days from idea to first prototype',color: '#EF4444', trend: 'down', trendPct: '−8d' },
]

const AGENTS: AgentStat[] = [
  {
    id: 'innov1', name: 'Kiran Mehta', initials: 'KM', color: '#CA8A04',
    resolved: 18, avgHandle: '5d', csat: 95, slaBreaches: 0, trendVsLast: 'up',
    kimmCoaching: 'Strong pipeline management — outcome pricing pilot is the highest-value active item. Idea-to-PoC time improvement from 75d to 67d is excellent. Focus on PAT-004 filing before the NL pipeline builder becomes public; file within the next 2 weeks to protect IP.',
  },
  {
    id: 'innov2', name: 'Ananya Das', initials: 'AD', color: '#F59E0B',
    resolved: 14, avgHandle: '6d', csat: 93, slaBreaches: 0, trendVsLast: 'flat',
    kimmCoaching: 'Compliance Evidence Generator PoC is the most strategically important prototype in the pipeline — direct revenue impact via RC and client-facing audit automation. Accelerate to MVP by July. Imperial College research collaboration should be formalised with a joint IP agreement before the academic year begins in September.',
  },
]

const TREND: WeekTrend[] = [
  { label: 'W1', value: 14, target: 18 },
  { label: 'W2', value: 16, target: 18 },
  { label: 'W3', value: 12, target: 18 },
  { label: 'W4', value: 18, target: 18 },
  { label: 'W5', value: 20, target: 18 },
  { label: 'W6', value: 16, target: 18 },
  { label: 'W7', value: 22, target: 18 },
  { label: 'W8', value: 18, target: 18 },
]

export function InnovAnalytics() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#CA8A0420' }}>
          <TrendingUp className="w-6 h-6" style={{ color: '#CA8A04' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Innovation Analytics</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Ideas pipeline, experiment velocity, patents and KIMMP innovation intelligence.</p>
        </div>
      </div>
      <SharedAnalytics
        config={cfg}
        kpis={KPIS}
        agents={AGENTS}
        weekTrend={TREND}
        kimmInsight="142 ideas in the pipeline with 34% experiment success rate — above the 25% industry benchmark for corporate innovation. Idea-to-PoC time has improved 8 days to 67 days — the structured evaluation process is working. The top 3 highest-scored ideas (ID-004, ID-003, ID-007) are all in active prototype stages; this is excellent portfolio management. Patent portfolio is growing at 2 filings/quarter — maintain this cadence to build defensive IP coverage around the KIMMP/BIDS™ architecture."
      />
    </div>
  )
}
