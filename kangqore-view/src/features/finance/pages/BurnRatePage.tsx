import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell
} from 'recharts'
import { Card, CardHeader, CardTitle } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { useFinanceStore } from '../store'

const fmt = (n: number) => `₹${n.toLocaleString()}`
const fmtK = (n: number) => `₹${(n / 1000).toFixed(0)}k`

export function BurnRatePage() {
  const { cashFlow, projectFinancials } = useFinanceStore()

  const months = cashFlow.length
  const totalOutflow  = cashFlow.reduce((s, m) => s + m.outflow, 0)
  const avgBurn       = Math.round(totalOutflow / months)
  const latestBalance = cashFlow[cashFlow.length - 1]?.runningBalance ?? 0
  const runway        = Math.round(latestBalance / avgBurn)

  // Burn rate trend (3-month rolling avg)
  const burnData = cashFlow.map((m, i) => {
    const window = cashFlow.slice(Math.max(0, i - 2), i + 1)
    const rolling = Math.round(window.reduce((s, w) => s + w.outflow, 0) / window.length)
    return { month: m.month, Burn: m.outflow, 'Rolling Avg': rolling, Revenue: m.inflow }
  })

  // Projection — 6 months forward at avg burn
  const projected = [
    ...cashFlow.map(m => ({ month: m.month, balance: m.runningBalance, projected: null as number | null })),
    ...Array.from({ length: 6 }, (_, i) => ({
      month: `+${i + 1}m`,
      balance: null as number | null,
      projected: Math.max(0, latestBalance - avgBurn * (i + 1)),
    })),
  ]

  // Project burn contribution
  const projectBurn = projectFinancials
    .filter(p => p.spent > 0)
    .map(p => ({ name: p.projectName.split(' ').slice(0, 2).join(' '), burn: p.spent, color: p.projectColor }))
    .sort((a, b) => b.burn - a.burn)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Burn Rate & Runway</h2>
          <p className="text-sm text-slate-500 mt-0.5">Monthly outflow analysis and cash runway projection</p>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Avg Monthly Burn',  value: fmtK(avgBurn),       text: 'text-red-600' },
          { label: 'Current Balance',   value: fmtK(latestBalance), text: 'text-green-600' },
          { label: 'Cash Runway',       value: `${runway} months`,   text: 'text-blue-600' },
          { label: 'Months of Data',    value: `${months}`,          text: 'text-slate-300' },
        ].map(c => (
          <Card key={c.label} className="hover:border-os-border/80 transition-all duration-200">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{c.label}</p>
            <p className="text-2xl font-bold text-slate-200">{c.value}</p>
          </Card>
        ))}
      </div>

      {/* Burn vs revenue chart */}
      <Card>
        <CardHeader>
          <CardTitle>Burn Rate vs Revenue</CardTitle>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400" />Outflow (Burn)</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400" />Inflow (Revenue)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-orange-400 rounded" />3-Mo Avg</span>
          </div>
        </CardHeader>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={burnData} barGap={6} barSize={16}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f7/60" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} tickFormatter={fmtK} />
            <Tooltip formatter={(v) => [fmt(Number(v)), '']} contentStyle={{ borderRadius: 12, border: '1px solid #e4e8f0', fontSize: 12 }} />
            <Bar dataKey="Revenue" fill="#22c55e" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Burn"    fill="#ef4444" radius={[3, 3, 0, 0]} />
            <Line type="monotone" dataKey="Rolling Avg" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Runway projection */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Runway Projection</CardTitle>
          <Badge variant={runway < 6 ? 'danger' : runway < 12 ? 'warning' : 'success'} dot>
            {runway} months runway
          </Badge>
        </CardHeader>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={projected}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f7/60" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} tickFormatter={fmtK} />
            <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4 2" label={{ value: 'Zero cash', position: 'insideTopRight', fontSize: 10, fill: '#ef4444', fontWeight: 600 }} />
            <Tooltip formatter={(v) => [fmt(Number(v)), '']} contentStyle={{ borderRadius: 12, border: '1px solid #e4e8f0', fontSize: 12 }} />
            <Line type="monotone" dataKey="balance"   stroke="#2564ea" strokeWidth={2} dot={{ r: 3, fill: '#2564ea', strokeWidth: 0 }} connectNulls={false} name="Actual"    />
            <Line type="monotone" dataKey="projected" stroke="#2564ea" strokeWidth={1.5} dot={{ r: 3 }} strokeDasharray="6 3"                 name="Projected" />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-[10px] font-semibold text-slate-500 mt-3 text-center uppercase tracking-wider">Projected at avg burn of {fmtK(avgBurn)}/month — assumes no new revenue</p>
      </Card>

      {/* Burn by project */}
      <Card>
        <CardHeader><CardTitle>Spend by Project (YTD)</CardTitle></CardHeader>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={projectBurn} layout="vertical" barSize={16}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f3f7/60" />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} tickFormatter={fmtK} />
            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11, fill: '#4b5368' }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => [fmt(Number(v)), 'Spent']} contentStyle={{ borderRadius: 12, border: '1px solid #e4e8f0', fontSize: 12 }} />
            <Bar dataKey="burn" radius={[0, 4, 4, 0]}>
              {projectBurn.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
