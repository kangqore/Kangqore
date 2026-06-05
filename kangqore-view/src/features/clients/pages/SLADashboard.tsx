import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Progress } from '@design-system/components/Progress'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useClientsStore } from '../store'
import type { SLAStatus } from '../types'

const STATUS_VARIANT: Record<SLAStatus, 'success' | 'warning' | 'danger'> = {
  met: 'success', 'at-risk': 'warning', breached: 'danger',
}
const TREND_ICON = { up: TrendingUp, down: TrendingDown, stable: Minus }
const TREND_COLOR = { up: 'text-[#00c875]', down: 'text-[#e2445c]', stable: 'text-slate-400' }

export function SLADashboard() {
  const { clients, slaMetrics } = useClientsStore()

  const met      = slaMetrics.filter(s => s.status === 'met').length
  const atRisk   = slaMetrics.filter(s => s.status === 'at-risk').length
  const breached = slaMetrics.filter(s => s.status === 'breached').length
  const compliance = Math.round((met / slaMetrics.length) * 100)

  // Bar chart data: per-client SLA compliance
  const chartData = clients.map(c => {
    const clientSLAs = slaMetrics.filter(s => s.clientId === c.id)
    const metCount   = clientSLAs.filter(s => s.status === 'met').length
    return {
      name: c.name.split(' ')[0],
      Met:     metCount,
      'At Risk':   clientSLAs.filter(s => s.status === 'at-risk').length,
      Breached: clientSLAs.filter(s => s.status === 'breached').length,
    }
  }).filter(d => d.Met + d['At Risk'] + d.Breached > 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">SLA Dashboard</h2>
          <p className="text-sm text-slate-500 mt-0.5">{slaMetrics.length} metrics across {clients.length} clients</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-slate-900">{compliance}%</span>
          <span className="text-sm text-slate-400">overall compliance</span>
        </div>
      </div>

      {/* Status chips */}
      <div className="flex items-center gap-3">
        {[
          { label: `${met} Met`,       color: 'bg-[#00c875] text-white shadow-[0_2px_8px_rgba(0,200,117,0.25)] border-transparent'   },
          { label: `${atRisk} At Risk`, color: 'bg-[#fdab3d] text-white shadow-[0_2px_8px_rgba(253,171,61,0.25)] border-transparent'  },
          { label: `${breached} Breached`, color: breached > 0 ? 'bg-[#e2445c] text-white shadow-[0_2px_8px_rgba(226,68,92,0.25)] border-transparent' : 'bg-slate-200 text-slate-700 border-transparent' },
        ].map(c => (
          <span key={c.label} className={`text-sm font-bold px-4 py-2 rounded-xl border ${c.color}`}>{c.label}</span>
        ))}
      </div>

      {/* Bar chart */}
      <Card>
        <CardHeader>
          <CardTitle>SLA Status by Client</CardTitle>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            {[{c:'bg-green-500',l:'Met'},{c:'bg-amber-400',l:'At Risk'},{c:'bg-red-400',l:'Breached'}].map(i=>(
              <span key={i.l} className="flex items-center gap-1.5"><span className={`w-2.5 h-2.5 rounded-sm ${i.c}`}/>{i.l}</span>
            ))}
          </div>
        </CardHeader>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} barSize={18} barGap={3}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f7" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e4e8f0', fontSize: 12 }} />
            <Bar dataKey="Met"     fill="#22c55e" radius={[4,4,0,0]} stackId="a" />
            <Bar dataKey="At Risk" fill="#f59e0b" radius={[0,0,0,0]} stackId="a" />
            <Bar dataKey="Breached" fill="#ef4444" radius={[4,4,0,0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Per-client SLA tables */}
      {clients.filter(c => slaMetrics.some(s => s.clientId === c.id)).map(client => {
        const cSLAs = slaMetrics.filter(s => s.clientId === client.id)
        const cBreached = cSLAs.filter(s => s.status === 'breached').length
        const cAtRisk   = cSLAs.filter(s => s.status === 'at-risk').length

        return (
          <Card key={client.id} padding="none">
            <CardHeader className="px-5 pt-5 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2564ea] to-[#4ab6d4] flex items-center justify-center">
                  <span className="text-white font-bold text-xs">{client.logo}</span>
                </div>
                <CardTitle>{client.name}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {cBreached > 0 && <Badge variant="danger" dot size="sm">{cBreached} breached</Badge>}
                {cAtRisk   > 0 && <Badge variant="warning" dot size="sm">{cAtRisk} at risk</Badge>}
                {cBreached === 0 && cAtRisk === 0 && <Badge variant="success" dot size="sm">all met</Badge>}
              </div>
            </CardHeader>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {['Metric','Period','Target','Current','Trend','Status'].map(h=>(
                    <th key={h} className="text-left px-5 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {cSLAs.map(sla => {
                  const TrendIcon = TREND_ICON[sla.trend]
                  const pct = Math.min(100, Math.round((sla.current / sla.target) * 100))
                  return (
                    <tr key={sla.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 font-medium text-slate-700">{sla.metric}</td>
                      <td className="px-5 py-3 text-xs text-slate-400">{sla.period}</td>
                      <td className="px-5 py-3 text-slate-600">{sla.target}{sla.unit}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Progress value={pct} size="sm" color={sla.status === 'met' ? 'success' : sla.status === 'at-risk' ? 'warning' : 'danger'} className="w-20" />
                          <span className="font-semibold text-slate-800">{sla.current}{sla.unit}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <TrendIcon className={`w-4 h-4 ${TREND_COLOR[sla.trend]}`} />
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant={STATUS_VARIANT[sla.status]} dot size="sm">{sla.status}</Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>
        )
      })}
    </div>
  )
}
