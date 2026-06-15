import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Briefcase, CheckCircle2, AlertTriangle, Clock, Pencil } from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { InlineSelect } from '@components/InlineSelect'
import { EditDrawer } from '@components/EditDrawer'
import { Card, CardHeader, CardTitle } from '@design-system/components/Card'
import { StatCard } from '@design-system/components/StatCard'
import { Progress } from '@design-system/components/Progress'
import { Avatar, AvatarGroup } from '@design-system/components/Avatar'
import { Button } from '@design-system/components/Button'
import { Input } from '@design-system/components/Input'
import { useProjectsStore } from '../store'
import type { Project, ProjectStatus, HealthStatus } from '../types'

const STATUS_OPTIONS: { value: ProjectStatus; label: string; variant: 'success' | 'info' | 'warning' | 'brand' }[] = [
  { value: 'active',    label: 'Active',    variant: 'success' },
  { value: 'planned',   label: 'Planned',   variant: 'info'    },
  { value: 'on-hold',   label: 'On Hold',   variant: 'warning' },
  { value: 'completed', label: 'Completed', variant: 'brand'   },
]

const HEALTH_OPTIONS: { value: HealthStatus; label: string; variant: 'success' | 'warning' | 'danger' | 'info' }[] = [
  { value: 'on-track',  label: 'On Track',  variant: 'success' },
  { value: 'at-risk',   label: 'At Risk',   variant: 'warning' },
  { value: 'behind',    label: 'Behind',    variant: 'danger'  },
  { value: 'completed', label: 'Completed', variant: 'info'    },
]

const HEALTH_VARIANT: Record<HealthStatus, 'success' | 'warning' | 'danger' | 'info'> = {
  'on-track': 'success', 'at-risk': 'warning', behind: 'danger', completed: 'info',
}

function ProjectEditDrawer({ project, onClose }: { project: Project; onClose: () => void }) {
  const { updateProject } = useProjectsStore()
  const [form, setForm] = useState({
    name:    project.name,
    client:  project.client,
    owner:   project.owner,
    endDate: project.endDate.slice(0, 10),
    budget:  String(project.budget),
  })

  function save() {
    updateProject(project.id, {
      name:    form.name,
      client:  form.client,
      owner:   form.owner,
      endDate: form.endDate,
      budget:  Number(form.budget),
    })
    onClose()
  }

  return (
    <EditDrawer
      open
      onClose={onClose}
      title="Edit Project"
      description={project.name}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={save}>Save changes</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Project name</label>
          <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Client</label>
          <Input value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Owner</label>
          <Input value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Due date</label>
          <Input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Budget (£)</label>
          <Input type="number" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} />
        </div>

        <div className="pt-2 border-t border-slate-100 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">Status</label>
            <InlineSelect
              value={project.status}
              options={STATUS_OPTIONS}
              onChange={status => updateProject(project.id, { status })}
              size="md"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">Health</label>
            <InlineSelect
              value={project.health}
              options={HEALTH_OPTIONS}
              onChange={health => updateProject(project.id, { health })}
              size="md"
              dot
            />
          </div>
        </div>
      </div>
    </EditDrawer>
  )
}

export function ProjectsOverview() {
  const { projects, tasks, issues, updateProjectStatus, updateProjectHealth } = useProjectsStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const editingProject = projects.find(p => p.id === editingId)

  const active     = projects.filter(p => p.status === 'active').length
  const completed  = projects.filter(p => p.status === 'completed').length
  const atRisk     = projects.filter(p => p.health === 'at-risk' || p.health === 'behind').length
  const openIssues = issues.filter(i => i.status !== 'done').length

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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Projects"  value={active}     icon={<Briefcase    className="w-5 h-5" />} iconColor="bg-blue-100 text-blue-600" />
        <StatCard label="Completed"        value={completed}  icon={<CheckCircle2 className="w-5 h-5" />} iconColor="bg-green-100 text-green-600"   />
        <StatCard label="At Risk / Behind" value={atRisk}     icon={<AlertTriangle className="w-5 h-5"/>} iconColor={atRisk > 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'} />
        <StatCard label="Open Issues"      value={openIssues} icon={<Clock        className="w-5 h-5" />} iconColor="bg-blue-100 text-blue-600"     />
      </div>

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

      <div className="space-y-3">
        {projects.map(p => (
          <Card key={p.id} className="hover:shadow-md transition-all duration-200 group">
            <div className="flex items-start gap-4">
              <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: p.pillarColor }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-semibold text-slate-900 text-sm">{p.name}</h3>
                  <InlineSelect
                    value={p.status}
                    options={STATUS_OPTIONS}
                    onChange={status => updateProjectStatus(p.id, status)}
                    size="sm"
                  />
                  <InlineSelect
                    value={p.health}
                    options={HEALTH_OPTIONS}
                    onChange={health => updateProjectHealth(p.id, health)}
                    size="sm"
                    dot
                  />
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
                    <Progress value={p.progress} size="sm" color={HEALTH_VARIANT[p.health] === 'danger' ? 'danger' : HEALTH_VARIANT[p.health] === 'warning' ? 'warning' : 'brand'} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 w-8">{p.progress}%</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={e => { e.stopPropagation(); setEditingId(p.id) }}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Avatar name={p.owner} size="sm" />
                </div>
                <AvatarGroup users={p.team.map(n => ({ name: n }))} max={3} size="xs" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {editingProject && (
        <ProjectEditDrawer project={editingProject} onClose={() => setEditingId(null)} />
      )}
    </div>
  )
}
