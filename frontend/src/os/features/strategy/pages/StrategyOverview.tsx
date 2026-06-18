import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Target, LayoutDashboard, TrendingUp, AlertTriangle } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@design-system/components/Card'
import { StatCard } from '@design-system/components/StatCard'
import { Badge } from '@design-system/components/Badge'
import { Progress } from '@design-system/components/Progress'
import { Avatar } from '@design-system/components/Avatar'
import { PillarCard } from '../components/PillarCard'
import { useStrategyStore } from '../store'

const QUARTER_OPTIONS = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'] as const

export function StrategyOverview() {
  const { pillars, programs, filteredObjectives, selectedQuarter, setSelectedQuarter } = useStrategyStore()
  const objectives = filteredObjectives()

  const health = {
    onTrack:  pillars.filter(p => p.health === 'on-track').length,
    atRisk:   pillars.filter(p => p.health === 'at-risk').length,
    behind:   pillars.filter(p => p.health === 'behind').length,
  }
  const okrHealth = {
    onTrack:  objectives.filter(o => o.status === 'on-track').length,
    atRisk:   objectives.filter(o => o.status === 'at-risk').length,
    behind:   objectives.filter(o => o.status === 'behind').length,
    completed:objectives.filter(o => o.status === 'completed').length,
  }
  const avgProgress = Math.round(objectives.reduce((s, o) => s + o.progress, 0) / (objectives.length || 1))
  const activePrograms = programs.filter(p => p.status === 'active').length

  const donutData = [
    { name: 'On Track',  value: okrHealth.onTrack,  color: '#22c55e' },
    { name: 'At Risk',   value: okrHealth.atRisk,   color: '#f59e0b' },
    { name: 'Behind',    value: okrHealth.behind,   color: '#ef4444' },
    { name: 'Completed', value: okrHealth.completed,color: '#3b82f6' },
  ].filter(d => d.value > 0)

  const totalBudget = pillars.reduce((s, p) => s + p.budget, 0)
  const totalSpent  = pillars.reduce((s, p) => s + p.spent, 0)

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-6 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-[#4ab6d4] tracking-tight">Strategy Overview</h2>
          <p className="text-sm text-slate-500 mt-1">Company-wide strategic health across all pillars and OKRs</p>
        </div>
        <div className="flex items-center gap-2">
          {QUARTER_OPTIONS.map(q => (
            <button
              key={q}
              onClick={() => setSelectedQuarter(q)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                selectedQuarter === q
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-[#151C2F] border border-[#2E2854] text-slate-300 hover:border-[#2E2854]'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row - Spacious gap-8 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard
          label="Strategic Pillars"
          value={pillars.length}
          icon={<Target className="w-5 h-5" />}
          iconColor="bg-[#0F172A] text-slate-300"
          change={0}
          changeLabel="all active"
        />
        <StatCard
          label="Active Programs"
          value={activePrograms}
          icon={<LayoutDashboard className="w-5 h-5" />}
          iconColor="bg-[#0F172A] text-slate-300"
          suffix={`/${programs.length}`}
        />
        <StatCard
          label="OKR Progress"
          value={`${avgProgress}%`}
          icon={<TrendingUp className="w-5 h-5" />}
          iconColor="bg-[#0F172A] text-slate-300"
          change={8}
          changeLabel="vs last quarter"
        />
        <StatCard
          label="At Risk / Behind"
          value={health.atRisk + health.behind}
          icon={<AlertTriangle className="w-5 h-5" />}
          iconColor={health.atRisk + health.behind > 1 ? 'bg-red-50 text-red-600' : 'bg-[#0F172A] text-slate-300'}
          changeLabel="pillars need attention"
        />
      </div>

      {/* OKR health + Budget - Spacious gap-8 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Donut */}
        <Card className="lg:col-span-1" padding="lg">
          <CardHeader className="mb-6">
            <div className="space-y-1">
              <CardTitle className="text-base font-bold">OKR Health</CardTitle>
              <Badge variant="neutral" size="sm" className="font-semibold">{objectives.length} objectives</Badge>
            </div>
          </CardHeader>
          <div className="flex items-center gap-8 py-3">
            <ResponsiveContainer width={110} height={110}>
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={36} outerRadius={48} dataKey="value" strokeWidth={1.5}>
                  {donutData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {donutData.map(d => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                    <span className="text-slate-500 font-medium">{d.name}</span>
                  </span>
                  <span className="font-bold text-slate-200">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Budget overview */}
        <Card className="lg:col-span-2" padding="lg">
          <CardHeader className="mb-6">
            <div className="space-y-1">
              <CardTitle className="text-base font-bold">Portfolio Budget</CardTitle>
              <p className="text-xs text-slate-500">Pillar spent distribution</p>
            </div>
            <span className="text-sm font-bold text-slate-200 bg-[#0F172A] px-3 py-1 rounded-md border border-[#2E2854]/50">
              ₹{(totalSpent / 1000).toFixed(0)}k / ₹{(totalBudget / 1000).toFixed(0)}k
            </span>
          </CardHeader>
          <div className="space-y-5">
            {pillars.map(p => (
              <div key={p.id} className="flex items-center gap-4">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
                <span className="text-xs font-semibold text-slate-500 w-36 truncate">{p.name}</span>
                <div className="flex-1">
                  <Progress
                    value={Math.round((p.spent / p.budget) * 100)}
                    size="sm"
                    color={p.spent / p.budget > 0.85 ? 'danger' : p.spent / p.budget > 0.7 ? 'warning' : 'success'}
                  />
                </div>
                <span className="text-xs font-bold text-slate-500 w-16 text-right">
                  {Math.round((p.spent / p.budget) * 100)}%
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-5 border-t border-[#2E2854]/80">
            <Progress
              value={Math.round((totalSpent / totalBudget) * 100)}
              color="brand"
              size="md"
              label="Total portfolio spend"
              showValue
            />
          </div>
        </Card>
      </div>

      {/* Pillars grid - Spacious gap-8 */}
      <div>
        <h3 className="text-base font-bold text-slate-200 mb-5 tracking-tight">Strategic Pillars</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {pillars.map(p => <PillarCard key={p.id} pillar={p} />)}
        </div>
      </div>

      {/* Recent program activity */}
      <Card padding="lg">
        <CardHeader className="mb-6">
          <div className="space-y-1">
            <CardTitle className="text-base font-bold">Active Programs</CardTitle>
            <p className="text-xs text-slate-500">Currently executing workstreams</p>
          </div>
          <Badge variant="brand" size="sm" className="font-semibold">{activePrograms} running</Badge>
        </CardHeader>
        <div className="space-y-4">
          {programs.filter(p => p.status === 'active').slice(0, 6).map(prog => (
            <div key={prog.id} className="flex items-center gap-6 py-4 border-b border-[#2E2854]/50 last:border-0 last:pb-0 first:pt-0">
              <div className="w-2 h-8 rounded-full flex-shrink-0" style={{ background: prog.pillarColor }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-200 truncate">{prog.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{prog.pillarName}</p>
              </div>
              <div className="w-36">
                <Progress value={prog.progress} size="sm" color="brand" />
                <p className="text-[10px] text-slate-500 mt-1.5 text-right font-semibold">{prog.progress}%</p>
              </div>
              <Avatar name={prog.owner} size="xs" className="ring-2 ring-slate-50" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
