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
  completed: '#3b82f6',
  'on-hold': 'var(--os-text-2)',
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
    <div className="space-y-12 pb-16">
      {/* Title block with spacious bottom margin */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-os-cyan tracking-tight">Portfolio Map</h2>
        <p className="text-sm text-[var(--os-text-2)] mt-1">
          {programs.length} programs across {pillars.length} strategic pillars
        </p>
      </div>

      {/* Summary bar chart with spacious gap-8 layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2" padding="lg">
          <CardHeader className="mb-6">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold">Programs by Pillar</CardTitle>
              <p className="text-xs text-[var(--os-text-2)]">Distribution of active and planned programs</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-[var(--os-text-2)]">
              {(['active', 'planned', 'completed'] as ProgramStatus[]).map(s => (
                <span key={s} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-[3px]" style={{ background: STATUS_COLOR[s] }} />
                  <span className="capitalize font-medium">{s}</span>
                </span>
              ))}
            </div>
          </CardHeader>
          <div className="pt-2">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData} barSize={24} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f7" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} dy={8} />
                <YAxis tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} dx={-8} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e4e8f0', fontSize: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }} />
                <Bar dataKey="active"    fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="planned"   fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Status summary */}
        <Card padding="lg" className="flex flex-col justify-between">
          <CardHeader className="mb-6">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold">Status Breakdown</CardTitle>
              <p className="text-xs text-[var(--os-text-2)]">Overall completion volume</p>
            </div>
          </CardHeader>
          <div className="space-y-5 flex-1 flex flex-col justify-center pb-2">
            {(['active', 'planned', 'completed', 'on-hold'] as ProgramStatus[]).map(s => {
              const count = programs.filter(p => p.status === s).length
              const pct   = programs.length > 0 ? Math.round((count / programs.length) * 100) : 0
              return (
                <div key={s} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_COLOR[s] }} />
                      <span className="font-semibold text-[var(--os-text-1)] capitalize">{s}</span>
                    </span>
                    <span className="font-bold text-white">{count}</span>
                  </div>
                  <Progress value={pct} size="sm" color={STATUS_VARIANT[s] === 'success' ? 'success' : STATUS_VARIANT[s] === 'info' ? 'info' : STATUS_VARIANT[s] === 'brand' ? 'brand' : 'brand'} />
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Program grid - Overhauled for high-end spacious cards */}
      <div>
        <h3 className="text-base font-bold text-[var(--os-text-1)] mb-5 tracking-tight">All Programs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {bubblePrograms.map(prog => (
            <Card key={prog.id} padding="lg" className="hover:shadow-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] cursor-pointer flex flex-col justify-between border border-[var(--os-border)] border-t-white/20 hover:border-[var(--os-border)] border-t-white/20/80 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_var(--os-border),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10">
              <div>
                {/* Pillar Accent Line */}
                <div className="h-1.5 rounded-full mb-5 w-16" style={{ background: prog.pillarColor }} />
                
                {/* Title & Badge */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-os-cyan tracking-tight truncate">{prog.name}</p>
                    <p className="text-xs text-[var(--os-text-2)] mt-1 font-medium truncate">{prog.pillarName}</p>
                  </div>
                  <Badge variant={STATUS_VARIANT[prog.status]} size="sm" className="capitalize font-semibold">{prog.status}</Badge>
                </div>
                
                {/* Description with spacious text layout */}
                <p className="text-xs text-[var(--os-text-2)] mb-5 line-clamp-2 leading-relaxed font-normal">{prog.description}</p>
              </div>

              <div>
                {/* Progress bar with labels */}
                <Progress value={prog.progress} size="sm" color="brand" label={`Progress`} showValue />
                
                {/* Team & Health */}
                <div className="mt-5 flex items-center justify-between text-xs text-[var(--os-text-2)]">
                  <div className="flex items-center gap-2">
                    <Avatar name={prog.owner} size="xs" className="ring-2 ring-slate-50" />
                    <span className="font-medium text-[var(--os-text-1)]">{prog.owner}</span>
                  </div>
                  <HealthBadge status={prog.health} />
                </div>
                
                {/* Footer specs with expanded padding */}
                <div className="mt-5 pt-4 border-t border-[var(--os-border)] border-t-white/20/80 flex items-center justify-between text-[11px] font-medium text-[var(--os-text-2)] tracking-wide">
                  <span className="text-[var(--os-text-2)]">₹{(prog.spent / 1000).toFixed(0)}k <span className="text-slate-350">/</span> ₹{(prog.budget / 1000).toFixed(0)}k</span>
                  <span>{prog.teamSize} people · ends {new Date(prog.endDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
