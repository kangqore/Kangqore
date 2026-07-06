import { Sparkles } from 'lucide-react'
import { ChartPie } from '@phosphor-icons/react'

const ACCENT = '#0284C7'

type RefreshRate = 'Live' | 'Daily' | 'Weekly'
type DashStatus = 'Active' | 'Deprecated' | 'Draft'

interface Dashboard {
  name:        string
  owner:       string
  dept:        string
  sources:     string
  refresh:     RefreshRate
  lastViewed:  string
  status:      DashStatus
}

const DASHBOARDS: Dashboard[] = [
  { name: 'Executive KPI Dashboard',     owner: 'Vikram Rao',   dept: 'Executive',       sources: 'Salesforce, Finance, JIRA',  refresh: 'Daily',  lastViewed: '2026-06-24', status: 'Active' },
  { name: 'Sales Pipeline Intelligence', owner: 'Deepa Menon',  dept: 'Sales',           sources: 'Salesforce, HubSpot',        refresh: 'Live',   lastViewed: '2026-06-24', status: 'Active' },
  { name: 'Marketing Attribution',       owner: 'Vikram Rao',   dept: 'Marketing',       sources: 'HubSpot, Google Ads, Slack', refresh: 'Daily',  lastViewed: '2026-06-23', status: 'Active' },
  { name: 'Engineering Velocity',        owner: 'Cyrus Irani',  dept: 'Engineering',     sources: 'JIRA, GitHub',               refresh: 'Daily',  lastViewed: '2026-06-24', status: 'Active' },
  { name: 'Customer Health Monitor',     owner: 'Deepa Menon',  dept: 'Customer Success',sources: 'Salesforce, Zendesk',        refresh: 'Live',   lastViewed: '2026-06-24', status: 'Active' },
  { name: 'Financial Performance',       owner: 'Vikram Rao',   dept: 'Finance',         sources: 'Xero, Salesforce',           refresh: 'Daily',  lastViewed: '2026-06-22', status: 'Active' },
  { name: 'HR People Analytics',         owner: 'Deepa Menon',  dept: 'HR',              sources: 'BambooHR, Greenhouse',       refresh: 'Weekly', lastViewed: '2026-06-20', status: 'Active' },
  { name: 'Support SLA Monitor',         owner: 'Cyrus Irani',  dept: 'Support',         sources: 'Zendesk, Slack',             refresh: 'Live',   lastViewed: '2026-06-24', status: 'Active' },
]

const REFRESH_COLOR: Record<RefreshRate, string> = { Live: '#10B981', Daily: '#6366F1', Weekly: '#F59E0B' }
const STATUS_COLOR: Record<DashStatus, string> = { Active: '#10B981', Deprecated: '#6B7280', Draft: '#F59E0B' }

export function DADashboards() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <ChartPie size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard Registry</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Live BI dashboards across all departments — ownership and refresh cadences.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Dashboards', value: String(DASHBOARDS.length),                                              color: ACCENT },
          { label: 'Live Refresh',     value: String(DASHBOARDS.filter(d => d.refresh === 'Live').length),         color: '#10B981' },
          { label: 'Daily Refresh',    value: String(DASHBOARDS.filter(d => d.refresh === 'Daily').length),        color: '#6366F1' },
          { label: 'Weekly Refresh',   value: String(DASHBOARDS.filter(d => d.refresh === 'Weekly').length),       color: '#F59E0B' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border p-5 flex gap-4" style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}08` }}>
        <Sparkles size={18} style={{ color: ACCENT }} className="mt-0.5 shrink-0" />
        <p className="text-sm text-[var(--os-text-1)]">
          <span className="font-semibold" style={{ color: ACCENT }}>KIMMP: </span>
          3 live dashboards are consuming real-time API quota — monitor Salesforce API limits. HR People Analytics is weekly;
          consider moving to daily as headcount velocity increases. The Executive KPI Dashboard is the most-viewed asset —
          ensure data quality SLAs are enforced upstream. Engineering Velocity dashboard should include deployment frequency
          and DORA metrics to align with the CTO roadmap.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Dashboard', 'Owner', 'Dept', 'Data Sources', 'Refresh', 'Last Viewed', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {DASHBOARDS.map(d => {
                const rc = REFRESH_COLOR[d.refresh]
                const sc = STATUS_COLOR[d.status]
                return (
                  <tr key={d.name} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{d.name}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{d.owner}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{d.dept}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] text-xs">{d.sources}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${rc}22`, color: rc }}>{d.refresh}</span>
                    </td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{d.lastViewed}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>{d.status}</span>
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
