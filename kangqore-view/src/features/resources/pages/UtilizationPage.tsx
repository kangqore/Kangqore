import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { Card, CardHeader, CardTitle } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Avatar } from '@design-system/components/Avatar'
import { Progress } from '@design-system/components/Progress'
import { useResourcesStore } from '../store'

const MEMBER_COLORS = ['#2564ea','#2563eb','#059669','#d97706','#dc2626','#0891b2','#2564ea','#0f766e']

export function UtilizationPage() {
  const { team, utilHistory } = useResourcesStore()

  // Build area chart data: one series per member
  const areaData = utilHistory.map(row => {
    const point: Record<string, string | number> = { week: row.week }
    team.forEach(m => { point[m.name.split(' ')[0]] = ((row as Record<string, number | string>)[m.id] as number) ?? m.utilization })
    return point
  })

  // Bar chart: current utilization per person
  const barData = team.map(m => ({
    name:  m.name.split(' ')[0],
    util:  m.utilization,
    avail: 100 - m.utilization,
    color: MEMBER_COLORS[team.indexOf(m) % MEMBER_COLORS.length],
  }))

  // Dept rollup
  const depts = ['Engineering', 'Design', 'Product', 'Sales', 'Operations', 'Finance'] as const
  const deptData = depts.map(d => {
    const members = team.filter(m => m.department === d)
    const avg = members.length ? Math.round(members.reduce((s, m) => s + m.utilization, 0) / members.length) : 0
    return { name: d.slice(0, 3), avg, members: members.length }
  }).filter(d => d.members > 0)

  const avgOverall = Math.round(team.reduce((s, m) => s + m.utilization, 0) / team.length)
  const atRisk     = team.filter(m => m.utilization >= 95).length
  const underutil  = team.filter(m => m.utilization < 50).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Utilization Analytics</h2>
          <p className="text-sm text-slate-500 mt-0.5">Team capacity usage — last 4 weeks</p>
        </div>
        <div className="flex items-center gap-2">
          {[
            { label: `${avgOverall}% avg`, variant: 'brand'   },
            { label: `${atRisk} overloaded`,  variant: atRisk > 0 ? 'danger' : 'success' },
            { label: `${underutil} under 50%`, variant: underutil > 0 ? 'warning' : 'neutral' },
          ].map((c, i) => (
            <Badge key={i} variant={c.variant as 'brand' | 'danger' | 'success' | 'warning' | 'neutral'} size="md">{c.label}</Badge>
          ))}
        </div>
      </div>

      {/* Area chart — all members over time */}
      <Card>
        <CardHeader>
          <CardTitle>Utilization Trend (all members)</CardTitle>
          <ReferenceLine y={100} />
        </CardHeader>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={areaData}>
            <defs>
              {team.map((m, i) => (
                <linearGradient key={m.id} id={`grad-${m.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={MEMBER_COLORS[i % MEMBER_COLORS.length]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={MEMBER_COLORS[i % MEMBER_COLORS.length]} stopOpacity={0}   />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f7" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 110]} tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <ReferenceLine y={95} stroke="#ef4444" strokeDasharray="4 2" label={{ value: 'Overload', position: 'right', fontSize: 10, fill: '#ef4444' }} />
            <Tooltip formatter={(v, n) => [`${v}%`, n]} contentStyle={{ borderRadius: 12, border: '1px solid #e4e8f0', fontSize: 12 }} />
            {team.map((m, i) => (
              <Area
                key={m.id}
                type="monotone"
                dataKey={m.name.split(' ')[0]}
                stroke={MEMBER_COLORS[i % MEMBER_COLORS.length]}
                fill={`url(#grad-${m.id})`}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Bar chart — current utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Current Utilization by Person</CardTitle></CardHeader>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} layout="vertical" barSize={16}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f3f7" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="name" width={64} tick={{ fontSize: 11, fill: '#4b5368' }} axisLine={false} tickLine={false} />
              <ReferenceLine x={95} stroke="#ef4444" strokeDasharray="4 2" />
              <Tooltip formatter={(v) => [`${v}%`, 'Utilization']} contentStyle={{ borderRadius: 12, border: '1px solid #e4e8f0', fontSize: 12 }} />
              <Bar dataKey="util" radius={[0, 6, 6, 0]} fill="#2564ea" name="Utilized" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardHeader><CardTitle>Avg Utilization by Dept</CardTitle></CardHeader>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={deptData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f7" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <ReferenceLine y={95} stroke="#ef4444" strokeDasharray="4 2" />
              <Tooltip formatter={(v) => [`${v}%`, 'Avg Util']} contentStyle={{ borderRadius: 12, border: '1px solid #e4e8f0', fontSize: 12 }} />
              <Bar dataKey="avg" radius={[6, 6, 0, 0]} fill="#1d54d8" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Member detail list */}
      <Card>
        <CardHeader><CardTitle>Member Detail</CardTitle></CardHeader>
        <div className="space-y-3">
          {[...team].sort((a, b) => b.utilization - a.utilization).map((m, i) => (
            <div key={m.id} className="flex items-center gap-3">
              <span className="text-xs text-slate-500 w-4 text-right">{i + 1}</span>
              <Avatar name={m.name} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-slate-200">{m.name}</p>
                  <span className={`text-xs font-bold ${m.utilization >= 95 ? 'text-red-600' : m.utilization >= 80 ? 'text-amber-600' : 'text-green-600'}`}>
                    {m.utilization}%
                  </span>
                </div>
                <Progress
                  value={m.utilization}
                  size="sm"
                  color={m.utilization >= 95 ? 'danger' : m.utilization >= 80 ? 'warning' : 'success'}
                />
              </div>
              <span className="text-xs text-slate-500 w-24 text-right">
                {Math.round(m.availability * m.utilization / 100)}h / {m.availability}h
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
