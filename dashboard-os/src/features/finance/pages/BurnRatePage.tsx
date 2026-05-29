import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { Card, CardHeader, CardTitle } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { useFinanceStore } from '../store'

const fmt = (n: number) => `£${n.toLocaleString()}`
const fmtK = (n: number) => `£${(n / 1000).toFixed(0)}k`

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
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Burn Rate & Runway</h2>
        <p className="text-sm text-slate-500 mt-0.5">Monthly outflow analysis and cash runway projection</p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg Monthly Burn',  value: fmtK(avgBurn),       bg: 'bg-red-50   border-red-100',    text: 'text-red-700'    },
          { label: 'Current Balance',   value: fmtK(latestBalance), bg: 'bg-green-50 border-green-100',  text: 'text-green-700'  },
          { label: 'Cash Runway',       value: `${runway} months`,   bg: 'bg-purple-50 border-purple-100',text: 'text-purple-700' },
          { label: 'Months of Data',    value: `${months}`,          bg: 'bg-slate-50  border-slate-100', text: 'text-slate-700'  },
        ].map(c => (
          <div key={c.label} className={`${c.bg} border rounded-2xl p-4`}>
            <p className="text-xs font-semibold text-slate-500 mb-1">{c.label}</p>
            <p className={`text-2xl font-bold ${c.text}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Burn vs revenue chart */}
      <Card>
        <CardHeader>
          <CardTitle>Burn Rate vs Revenue</CardTitle>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-400" />Monthly burn</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-green-400" />Revenue</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-orange-400 rounded" />3-month avg burn</span>
          </div>
        </CardHeader>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={burnData} barGap={4} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f7" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} tickFormatter={fmtK} />
            <Tooltip formatter={(v) => [fmt(Number(v)), '']} contentStyle={{ borderRadius: 12, border: '1px solid #e4e8f0', fontSize: 12 }} />
            <Bar dataKey="Revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Burn"    fill="#f87171" radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="Rolling Avg" stroke="#f59e0b" strokeWidth={2} dot={false} />
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
            <defs>
              <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#9333ea" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#9333ea" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f7" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} tickFormatter={fmtK} />
            <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4 2" label={{ value: 'Zero cash', position: 'insideTopRight', fontSize: 10, fill: '#ef4444' }} />
            <Tooltip formatter={(v) => [fmt(Number(v)), '']} contentStyle={{ borderRadius: 12, border: '1px solid #e4e8f0', fontSize: 12 }} />
            <Line type="monotone" dataKey="balance"   stroke="#9333ea" strokeWidth={2.5} dot={{ r: 3, fill: '#9333ea' }} connectNulls={false} name="Actual"    />
            <Line type="monotone" dataKey="projected" stroke="#9333ea" strokeWidth={2}   dot={{ r: 3 }} strokeDasharray="6 3"                 name="Projected" />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-slate-400 mt-2 text-center">Projected at avg burn of {fmtK(avgBurn)}/month — assumes no new revenue</p>
      </Card>

      {/* Burn by project */}
      <Card>
        <CardHeader><CardTitle>Spend by Project (YTD)</CardTitle></CardHeader>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={projectBurn} layout="vertical" barSize={16}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f3f7" />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} tickFormatter={fmtK} />
            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11, fill: '#4b5368' }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => [fmt(Number(v)), 'Spent']} contentStyle={{ borderRadius: 12, border: '1px solid #e4e8f0', fontSize: 12 }} />
            <Bar dataKey="burn" fill="#9333ea" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
