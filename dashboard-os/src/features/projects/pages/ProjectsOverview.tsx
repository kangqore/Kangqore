import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Briefcase, CheckCircle2, AlertTriangle, Clock } from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { Card, CardHeader, CardTitle } from '@design-system/components/Card'
import { StatCard } from '@design-system/components/StatCard'
import { Badge } from '@design-system/components/Badge'
import { Progress } from '@design-system/components/Progress'
import { Avatar, AvatarGroup } from '@design-system/components/Avatar'
import { useProjectsStore } from '../store'

const STATUS_VARIANT = {
  active:    'success',
  planned:   'info',
  'on-hold': 'warning',
  completed: 'brand',
} as const

const HEALTH_VARIANT = {
  'on-track': 'success',
  'at-risk':  'warning',
  'behind':   'danger',
  'completed':'info',
} as const

export function ProjectsOverview() {
  const { projects, tasks, issues } = useProjectsStore()

  const active    = projects.filter(p => p.status === 'active').length
  const completed = projects.filter(p => p.status === 'completed').length
  const atRisk    = projects.filter(p => p.health === 'at-risk' || p.health === 'behind').length
  const openIssues= issues.filter(i => i.status !== 'done').length

  const chartData = projects
    .filter(p => p.status !== 'planned')
    .map(p => ({ name: p.name.split(' ').slice(0, 2).join(' '), progress: p.progress, color: p.pillarColor }))

  return (
    <div className="space-y-6">
      <KIMMPSignalBar module="Projects" />
      <div>
        <h2 className="text-xl font-bold text-slate-900">Projects</h2>
        <p className="text-sm text-slate-500 mt-0.5">{projects.length} projects · {tasks.length} tasks tracked</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Projects"  value={active}     icon={<Briefcase    className="w-5 h-5" />} iconColor="bg-blue-100 text-blue-600" />
        <StatCard label="Completed"        value={completed}  icon={<CheckCircle2 className="w-5 h-5" />} iconColor="bg-green-100 text-green-600"   />
        <StatCard label="At Risk / Behind" value={atRisk}     icon={<AlertTriangle className="w-5 h-5"/>} iconColor={atRisk > 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'} />
        <StatCard label="Open Issues"      value={openIssues} icon={<Clock        className="w-5 h-5" />} iconColor="bg-blue-100 text-blue-600"     />
      </div>

      {/* Progress chart */}
      <Card>
        <CardHeader><CardTitle>Project Progress</CardTitle></CardHeader>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} layout="vertical" barSize={14}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f3f7" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11, fill: '#4b5368' }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => [`${v}%`, 'Progress']} contentStyle={{ borderRadius: 12, border: '1px solid #e4e8f0', fontSize: 12 }} />
            <Bar dataKey="progress" radius={[0, 6, 6, 0]} fill="#2564ea" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Project list */}
      <div className="space-y-3">
        {projects.map(p => (
          <Card key={p.id} className="hover:shadow-md transition-all duration-200 cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: p.pillarColor }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-semibold text-slate-900 text-sm">{p.name}</h3>
                  <Badge variant={STATUS_VARIANT[p.status]} size="sm">{p.status}</Badge>
                  <Badge variant={HEALTH_VARIANT[p.health]} dot size="sm">{p.health}</Badge>
                </div>
                <p className="text-xs text-slate-400 mb-3 line-clamp-1">{p.description}</p>
                <div className="flex items-center gap-6 text-xs text-slate-500 mb-3">
                  <span>Client: <span className="font-medium text-slate-700">{p.client}</span></span>
                  <span>Due: <span className="font-medium text-slate-700">{new Date(p.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span></span>
                  <span>Budget: <span className="font-medium text-slate-700">£{(p.spent / 1000).toFixed(0)}k / £{(p.budget / 1000).toFixed(0)}k</span></span>
                  <span>{p.taskCount} tasks · {p.openIssues} issues</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Progress value={p.progress} size="sm" color={p.health === 'behind' ? 'danger' : p.health === 'at-risk' ? 'warning' : 'brand'} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 w-8">{p.progress}%</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <Avatar name={p.owner} size="sm" />
                <AvatarGroup users={p.team.map(n => ({ name: n }))} max={3} size="xs" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
