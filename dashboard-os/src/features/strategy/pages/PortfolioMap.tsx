import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Progress } from '@design-system/components/Progress'
import { Avatar } from '@design-system/components/Avatar'
import { HealthBadge } from '../components/HealthBadge'
import { useStrategyStore } from '../store'
import type { ProgramStatus } from '../types'

const STATUS_COLOR: Record<ProgramStatus, string> = {
  active:    '#22c55e',
  planned:   '#3b82f6',
  completed: '#a855f7',
  'on-hold': '#94a3b8',
}

const STATUS_VARIANT: Record<ProgramStatus, 'success' | 'info' | 'brand' | 'neutral'> = {
  active:    'success',
  planned:   'info',
  completed: 'brand',
  'on-hold': 'neutral',
}

export function PortfolioMap() {
  const { pillars, programs } = useStrategyStore()

  const barData = pillars.map(p => {
    const pp = programs.filter(pr => pr.pillarId === p.id)
    return {
      name: p.name.split(' ')[0],
      active:    pp.filter(pr => pr.status === 'active').length,
      planned:   pp.filter(pr => pr.status === 'planned').length,
      completed: pp.filter(pr => pr.status === 'completed').length,
      color: p.color,
    }
  })

  const bubblePrograms = programs.map(p => ({
    ...p,
    x: Math.round((p.spent / p.budget) * 100),
    y: p.progress,
    size: p.teamSize,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Portfolio Map</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          {programs.length} programs across {pillars.length} strategic pillars
        </p>
      </div>

      {/* Summary bar chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Programs by Pillar</CardTitle>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              {(['active', 'planned', 'completed'] as ProgramStatus[]).map(s => (
                <span key={s} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: STATUS_COLOR[s] }} />
                  {s}
                </span>
              ))}
            </div>
          </CardHeader>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} barSize={20} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f7" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e4e8f0', fontSize: 12 }} />
              <Bar dataKey="active"    fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="planned"   fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" fill="#a855f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Status summary */}
        <Card>
          <CardHeader><CardTitle>Status Breakdown</CardTitle></CardHeader>
          <div className="space-y-4">
            {(['active', 'planned', 'completed', 'on-hold'] as ProgramStatus[]).map(s => {
              const count = programs.filter(p => p.status === s).length
              const pct   = Math.round((count / programs.length) * 100)
              return (
                <div key={s} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: STATUS_COLOR[s] }} />
                      <span className="font-medium text-slate-700 capitalize">{s}</span>
                    </span>
                    <span className="font-bold text-slate-900">{count}</span>
                  </div>
                  <Progress value={pct} size="sm" color={STATUS_VARIANT[s] === 'success' ? 'success' : STATUS_VARIANT[s] === 'info' ? 'info' : STATUS_VARIANT[s] === 'brand' ? 'brand' : 'brand'} />
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Program grid */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">All Programs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {bubblePrograms.map(prog => (
            <Card key={prog.id} className="hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
              <div className="h-1 rounded-full mb-4" style={{ background: prog.pillarColor }} />
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{prog.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{prog.pillarName}</p>
                </div>
                <Badge variant={STATUS_VARIANT[prog.status]} size="sm">{prog.status}</Badge>
              </div>
              <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">{prog.description}</p>
              <Progress value={prog.progress} size="sm" color="brand" label={`Progress`} showValue />
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Avatar name={prog.owner} size="xs" />
                  <span>{prog.owner}</span>
                </div>
                <HealthBadge status={prog.health} />
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>£{(prog.spent / 1000).toFixed(0)}k / £{(prog.budget / 1000).toFixed(0)}k</span>
                <span>{prog.teamSize} people · ends {new Date(prog.endDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
