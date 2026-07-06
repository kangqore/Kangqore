import { Sparkles } from 'lucide-react'
import { Target } from '@phosphor-icons/react'

const ACCENT = '#0284C7'

type Trend = 'up' | 'down' | 'flat'

interface KPI {
  name:       string
  definition: string
  owner:      string
  source:     string
  current:    string
  target:     string
  trend:      Trend
}

const KPIS: KPI[] = [
  { name: 'Monthly Recurring Revenue',   definition: 'Total contracted MRR from active clients',              owner: 'CFO',          source: 'Xero',       current: '£284k',  target: '£320k',  trend: 'up' },
  { name: 'Net Revenue Retention',       definition: 'Revenue from existing clients incl. expansion/churn',  owner: 'CS Director',  source: 'Salesforce', current: '112%',   target: '115%',   trend: 'up' },
  { name: 'Customer Acquisition Cost',   definition: 'Total S&M spend / new clients acquired',               owner: 'CMO',          source: 'HubSpot',    current: '£1,840', target: '£1,600', trend: 'down' },
  { name: 'MQL Volume',                  definition: 'Marketing qualified leads per month',                   owner: 'CMO',          source: 'HubSpot',    current: '284',    target: '300',    trend: 'up' },
  { name: 'Time to Close (days)',        definition: 'Avg days from MQL to closed-won',                      owner: 'Sales Director',source: 'Salesforce', current: '42d',    target: '35d',    trend: 'down' },
  { name: 'Support CSAT',                definition: 'Customer satisfaction score from support surveys',      owner: 'Support Lead', source: 'Zendesk',    current: '94%',    target: '95%',    trend: 'flat' },
  { name: 'Deployment Frequency',        definition: 'Production deployments per week',                       owner: 'CTO',          source: 'GitHub',     current: '8/wk',   target: '10/wk',  trend: 'up' },
  { name: 'Employee NPS',               definition: 'Net Promoter Score from quarterly staff surveys',        owner: 'CHRO',         source: 'BambooHR',   current: '+42',    target: '+50',    trend: 'up' },
  { name: 'P95 API Latency',            definition: '95th percentile API response time in production',        owner: 'CTO',          source: 'Datadog',    current: '180ms',  target: '150ms',  trend: 'flat' },
  { name: 'Gross Margin',               definition: 'Revenue minus cost of goods sold / revenue',             owner: 'CFO',          source: 'Xero',       current: '68%',    target: '70%',    trend: 'up' },
]

const TREND_ICON: Record<Trend, string> = { up: '↑', down: '↓', flat: '→' }
const TREND_COLOR: Record<Trend, string> = { up: '#10B981', down: '#EF4444', flat: '#F59E0B' }

export function DAKPIRegistry() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Target size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">KPI Registry</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Business-wide KPI definitions, owners, sources and live performance.</p>
        </div>
      </div>

      <div className="rounded-2xl border p-5 flex gap-4" style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}08` }}>
        <Sparkles size={18} style={{ color: ACCENT }} className="mt-0.5 shrink-0" />
        <p className="text-sm text-[var(--os-text-1)]">
          <span className="font-semibold" style={{ color: ACCENT }}>KIMMP: </span>
          MRR is £36k below target — Sales velocity needs to improve by 2 deals/month to close the gap by Q3.
          CAC is trending in the wrong direction at £1,840 vs £1,600 target; Marketing should investigate channel
          efficiency. NRR at 112% is a positive signal — expansion revenue is healthy. Time to Close at 42 days is
          above target; a mid-funnel bottleneck is likely — run a stage-by-stage conversion analysis.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['KPI', 'Definition', 'Owner', 'Source', 'Current', 'Target', 'Trend'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {KPIS.map(k => {
                const tc = TREND_COLOR[k.trend]
                return (
                  <tr key={k.name} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{k.name}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] text-xs max-w-xs">{k.definition}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{k.owner}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{k.source}</td>
                    <td className="px-4 py-3 text-white font-bold whitespace-nowrap" style={{ color: ACCENT }}>{k.current}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{k.target}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-bold" style={{ color: tc }}>{TREND_ICON[k.trend]}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
