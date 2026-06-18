import { Briefcase, Calendar, DollarSign, Users } from 'lucide-react'
import { Card } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Progress } from '@design-system/components/Progress'
import { StatCard } from '@design-system/components/StatCard'
import { usePartnerProjects } from '../usePartnerData'

const MOCK_PROJECTS = [
  {
    id: 'p1', title: 'Urban Mobility Platform', status: 'ACTIVE', health: 'on-track',
    client: { name: 'Urban Mobility Co.', company: 'Urban Mobility Co.' },
    progress: 65, budget: 85000, spent: 52000,
    dueDate: '2026-08-31', description: 'Real-time fleet tracking and route optimisation platform.',
    taskCount: 24, openIssues: 3,
  },
  {
    id: 'p2', title: 'GreenSpark Energy Dashboard', status: 'ACTIVE', health: 'at-risk',
    client: { name: 'GreenSpark Energy', company: 'GreenSpark Energy' },
    progress: 38, budget: 60000, spent: 28000,
    dueDate: '2026-07-15', description: 'Solar and wind energy monitoring with predictive maintenance alerts.',
    taskCount: 18, openIssues: 5,
  },
  {
    id: 'p3', title: 'Quantum Analytics Suite', status: 'COMPLETED', health: 'completed',
    client: { name: 'Quantum Analytics', company: 'Quantum Analytics' },
    progress: 100, budget: 45000, spent: 43500,
    dueDate: '2026-05-31', description: 'Custom data visualisation and reporting suite.',
    taskCount: 32, openIssues: 0,
  },
]

const STATUS_V: Record<string, 'success' | 'info' | 'warning' | 'neutral'> = {
  ACTIVE: 'success', PLANNED: 'info', COMPLETED: 'neutral', 'ON_HOLD': 'warning',
}
const HEALTH_V: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  'on-track': 'success', 'at-risk': 'warning', behind: 'danger', completed: 'neutral',
}

const fmt     = (n: number) => `£${n.toLocaleString()}`
const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export function PartnerProjects() {
  const { data } = usePartnerProjects()
  const projects = (data as typeof MOCK_PROJECTS | undefined)?.length ? data as typeof MOCK_PROJECTS : MOCK_PROJECTS

  const active    = projects.filter(p => p.status === 'ACTIVE').length
  const completed = projects.filter(p => p.status === 'COMPLETED').length

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-white">My Projects</h2>
        <p className="text-sm text-slate-500 mt-0.5">{projects.length} assigned projects</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Active"    value={active}    icon={<Briefcase className="w-5 h-5" />} iconColor="bg-green-100 text-green-600" />
        <StatCard label="Completed" value={completed} icon={<Briefcase className="w-5 h-5" />} iconColor="bg-blue-100 text-blue-600" />
        <StatCard label="Total"     value={projects.length} icon={<Briefcase className="w-5 h-5" />} iconColor="bg-[#151C2F] text-slate-500" />
      </div>

      <div className="space-y-4">
        {projects.map(p => (
          <Card key={p.id} className="hover:shadow-md transition-all duration-200">
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-sm font-semibold text-white">{p.title}</h3>
                  <Badge variant={STATUS_V[p.status] ?? 'neutral'} size="sm">{p.status}</Badge>
                  <Badge variant={HEALTH_V[p.health] ?? 'neutral'} dot size="sm">{p.health}</Badge>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">{p.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                {p.client.name}
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Due {fmtDate(p.dueDate)}
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                {fmt(p.spent)} / {fmt(p.budget)}
              </div>
              <div className="text-slate-500">
                {p.taskCount} tasks · {p.openIssues} issues
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Progress value={p.progress} size="sm" color={p.health === 'at-risk' ? 'warning' : p.health === 'behind' ? 'danger' : 'brand'} />
              </div>
              <span className="text-xs font-bold text-slate-300 w-8">{p.progress}%</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
