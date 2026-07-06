import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { Avatar } from '@design-system/components/Avatar'
import { useResourcesStore } from '../store'

const MEMBER_COLORS = ['#579bfc','#7c3aed','#00c875','#fdab3d','#e2445c','#0891b2','#579bfc','#0f766e']

function utilColor(u: number) {
  if (u > 100) return '#e2445c'
  if (u > 90)  return '#fdab3d'
  if (u >= 70) return '#00c875'
  return '#579bfc'
}

export function UtilizationPage() {
  const { team, utilHistory } = useResourcesStore()

  const areaData = utilHistory.map(row => {
    const point: Record<string, string | number> = { week: row.week }
    team.forEach(m => { point[m.name.split(' ')[0]] = ((row as Record<string, number | string>)[m.id] as number) ?? m.utilization })
    return point
  })

  const barData = team.map(m => ({
    name:  m.name.split(' ')[0],
    util:  m.utilization,
    avail: 100 - m.utilization,
    color: MEMBER_COLORS[team.indexOf(m) % MEMBER_COLORS.length],
  }))

  const depts = ['Engineering', 'Design', 'Product', 'Sales', 'Operations', 'Finance'] as const
  const deptData = depts.map(d => {
    const members = team.filter(m => m.department === d)
    const avg = members.length ? Math.round(members.reduce((s, m) => s + m.utilization, 0) / members.length) : 0
    return { name: d.slice(0, 3), avg, members: members.length }
  }).filter(d => d.members > 0)

  const avgOverall = team.length > 0 ? Math.round(team.reduce((s, m) => s + m.utilization, 0) / team.length) : 0
  const atRisk     = team.filter(m => m.utilization >= 95).length
  const underutil  = team.filter(m => m.utilization < 50).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Utilization Analytics</h2>
          <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: 'var(--os-text-2)' }}>
            Team capacity usage — last 4 weeks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: '#579bfc20', color: '#579bfc' }}>
            {avgOverall}% avg
          </span>
          <span
            className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
            style={{ background: atRisk > 0 ? '#e2445c20' : '#00c87520', color: atRisk > 0 ? '#e2445c' : '#00c875' }}
          >
            {atRisk} overloaded
          </span>
          <span
            className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
            style={{ background: underutil > 0 ? '#fdab3d20' : 'var(--os-surface-0)', color: underutil > 0 ? '#fdab3d' : 'var(--os-text-2)' }}
          >
            {underutil} under 50%
          </span>
        </div>
      </div>

      {/* Avg utilization big stat */}
      <div className="os-card p-5">
        <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--os-text-2)' }}>
          Average Utilization
        </p>
        <p className="text-3xl font-black tracking-tight mb-3" style={{ color: utilColor(avgOverall) }}>
          {avgOverall}%
        </p>
        <div className="h-1.5 rounded-full" style={{ background: 'var(--os-surface-0)' }}>
          <div
            className="h-1.5 rounded-full"
            style={{ width: `${Math.min(100, avgOverall)}%`, background: utilColor(avgOverall) }}
          />
        </div>
      </div>

      {/* Area chart — all members over time */}
      <div className="os-card p-5">
        <p className="text-sm font-bold mb-4" style={{ color: 'var(--os-text-1)' }}>Utilization Trend (all members)</p>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={areaData}>
            <defs>
              {team.map((m, i) => (
                <linearGradient key={m.id} id={`grad-${m.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={MEMBER_COLORS[i % MEMBER_COLORS.length]} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={MEMBER_COLORS[i % MEMBER_COLORS.length]} stopOpacity={0}   />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--os-border)" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'var(--os-text-2)' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 110]} tick={{ fontSize: 11, fill: 'var(--os-text-2)' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <ReferenceLine y={95} stroke="#e2445c" strokeDasharray="4 2" label={{ value: 'Overload', position: 'right', fontSize: 10, fill: '#e2445c' }} />
            <Tooltip
              formatter={(v, n) => [`${v}%`, n]}
              contentStyle={{ borderRadius: 10, border: '1px solid var(--os-border)', fontSize: 12, background: 'var(--os-card)' }}
            />
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
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="os-card p-5">
          <p className="text-sm font-bold mb-4" style={{ color: 'var(--os-text-1)' }}>Current Utilization by Person</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} layout="vertical" barSize={16}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--os-border)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--os-text-2)' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="name" width={64} tick={{ fontSize: 11, fill: 'var(--os-text-2)' }} axisLine={false} tickLine={false} />
              <ReferenceLine x={95} stroke="#e2445c" strokeDasharray="4 2" />
              <Tooltip
                formatter={(v) => [`${v}%`, 'Utilization']}
                contentStyle={{ borderRadius: 10, border: '1px solid var(--os-border)', fontSize: 12, background: 'var(--os-card)' }}
              />
              <Bar dataKey="util" radius={[0,6,6,0]} fill="#579bfc" name="Utilized" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="os-card p-5">
          <p className="text-sm font-bold mb-4" style={{ color: 'var(--os-text-1)' }}>Avg Utilization by Dept</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={deptData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--os-border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--os-text-2)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--os-text-2)' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <ReferenceLine y={95} stroke="#e2445c" strokeDasharray="4 2" />
              <Tooltip
                formatter={(v) => [`${v}%`, 'Avg Util']}
                contentStyle={{ borderRadius: 10, border: '1px solid var(--os-border)', fontSize: 12, background: 'var(--os-card)' }}
              />
              <Bar dataKey="avg" radius={[6,6,0,0]} fill="#579bfc" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Member horizontal bars */}
      <div className="os-card p-5">
        <p className="text-sm font-bold mb-5" style={{ color: 'var(--os-text-1)' }}>Member Detail</p>
        <div className="space-y-4">
          {[...team].sort((a, b) => b.utilization - a.utilization).map((m, i) => {
            const uc = utilColor(m.utilization)
            return (
              <div key={m.id} className="flex items-center gap-3">
                <span className="text-xs w-4 text-right flex-shrink-0" style={{ color: 'var(--os-text-2)' }}>{i + 1}</span>
                <Avatar name={m.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-semibold" style={{ color: 'var(--os-text-1)' }}>{m.name}</p>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: uc + '20', color: uc }}>
                      {m.utilization}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'var(--os-surface-0)' }}>
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{ width: `${Math.min(100, m.utilization)}%`, background: uc }}
                    />
                  </div>
                </div>
                <span className="text-xs w-24 text-right flex-shrink-0" style={{ color: 'var(--os-text-2)' }}>
                  {Math.round(m.availability * m.utilization / 100)}h / {m.availability}h
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
