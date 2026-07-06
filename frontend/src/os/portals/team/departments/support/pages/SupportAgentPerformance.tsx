import { BarChart2 } from 'lucide-react'

const ACCENT = '#06B6D4'

interface AgentPerf {
  name: string
  ticketsMTD: number
  avgHandleTime: string
  fcrRate: number
  csat: number
  slaCompliance: number
  trend: 'TOP' | 'GOOD' | 'NEEDS_SUPPORT'
}

const AGENTS: AgentPerf[] = [
  { name: 'Rahul V.',  ticketsMTD: 89, avgHandleTime: '14m', fcrRate: 81, csat: 4.8, slaCompliance: 98, trend: 'TOP'          },
  { name: 'Kavya R.', ticketsMTD: 76, avgHandleTime: '16m', fcrRate: 78, csat: 4.7, slaCompliance: 96, trend: 'TOP'          },
  { name: 'Sneha G.', ticketsMTD: 64, avgHandleTime: '18m', fcrRate: 72, csat: 4.5, slaCompliance: 94, trend: 'GOOD'         },
  { name: 'Priya N.', ticketsMTD: 52, avgHandleTime: '21m', fcrRate: 68, csat: 4.4, slaCompliance: 91, trend: 'GOOD'         },
  { name: 'Arjun S.', ticketsMTD: 31, avgHandleTime: '24m', fcrRate: 59, csat: 4.2, slaCompliance: 87, trend: 'NEEDS_SUPPORT' },
]

const TREND_COLOR: Record<AgentPerf['trend'], string> = {
  TOP:          '#10B981',
  GOOD:         '#F59E0B',
  NEEDS_SUPPORT:'#EF4444',
}

const TREND_LABEL: Record<AgentPerf['trend'], string> = {
  TOP:          '↑ Top Performer',
  GOOD:         '→ On Track',
  NEEDS_SUPPORT:'↓ Needs Support',
}

export function SupportAgentPerformance() {
  const topPerformer = AGENTS.reduce((a, b) => b.csat > a.csat ? b : a, AGENTS[0])
  const teamAvgHandle = '18m'
  const teamFCR       = '72%'
  const teamSLA       = '94%'

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <BarChart2 size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Agent Performance</h1>
          <p className="text-sm text-[var(--os-text-2)]">Month-to-date individual performance metrics — June 2026</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg Handle Time',   value: teamAvgHandle,       color: ACCENT    },
          { label: 'Team FCR',          value: teamFCR,             color: '#10B981' },
          { label: 'Avg SLA Compliance',value: teamSLA,             color: '#10B981' },
          { label: 'Top Performer',     value: topPerformer.name,   color: '#F59E0B' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="mt-2 font-bold truncate" style={{ color: k.color, fontSize: k.label === 'Top Performer' ? '1rem' : '1.5rem' }}>
              {k.value}
            </p>
          </div>
        ))}
      </div>

      {/* Agent Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <p className="text-sm font-semibold text-white">Individual Metrics — MTD</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Agent', 'Tickets (MTD)', 'Avg Handle Time', 'FCR Rate', 'CSAT', 'SLA Compliance', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {AGENTS.map(agent => {
                const tc = TREND_COLOR[agent.trend]
                return (
                  <tr key={agent.name} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-white">{agent.name}</p>
                    </td>
                    <td className="px-4 py-3 text-[var(--os-text-1)]">{agent.ticketsMTD}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold" style={{ color: parseInt(agent.avgHandleTime) <= 18 ? '#10B981' : '#F59E0B' }}>
                        {agent.avgHandleTime}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold" style={{ color: agent.fcrRate >= 75 ? '#10B981' : agent.fcrRate >= 65 ? '#F59E0B' : '#EF4444' }}>
                        {agent.fcrRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold" style={{ color: '#F59E0B' }}>{agent.csat}★</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold" style={{ color: agent.slaCompliance >= 95 ? '#10B981' : agent.slaCompliance >= 90 ? '#F59E0B' : '#EF4444' }}>
                        {agent.slaCompliance}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap" style={{ background: `${tc}22`, color: tc }}>
                        {TREND_LABEL[agent.trend]}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-white/5 bg-slate-800/20">
          <p className="text-xs text-[var(--os-text-2)]">FCR = First Contact Resolution · SLA target ≥95% · Handle time target ≤18m</p>
        </div>
      </div>
    </div>
  )
}
