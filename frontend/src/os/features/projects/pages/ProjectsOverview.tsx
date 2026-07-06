import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Briefcase, Pencil, Trash2 } from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { InlineSelect } from '@components/InlineSelect'
import { EditDrawer } from '@components/EditDrawer'
import { Card, CardHeader, CardTitle } from '@design-system/components/Card'
import { Avatar, AvatarGroup } from '@design-system/components/Avatar'
import { Button } from '@design-system/components/Button'
import { Input } from '@design-system/components/Input'
import { api, isDemo } from '@lib/api'
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


function ProjectEditDrawer({ project, onClose }: { project: Project; onClose: () => void }) {
  const { updateProject } = useProjectsStore()
  const [form, setForm] = useState({
    name:    project.name,
    client:  project.client,
    owner:   project.owner,
    endDate: project.endDate.slice(0, 10),
    budget:  String(project.budget),
  })
  const [saving, setSaving] = useState(false)

  async function save() {
    const patch = {
      name:    form.name,
      client:  form.client,
      owner:   form.owner,
      endDate: form.endDate,
      budget:  Number(form.budget),
    }
    updateProject(project.id, patch)
    if (!isDemo()) {
      setSaving(true)
      await api.patch(`/projects/${project.id}`, patch).catch(() => {}).finally(() => setSaving(false))
    }
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
          <Button variant="primary" size="sm" onClick={save} loading={saving}>Save changes</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--os-text-2)] mb-1.5">Project name</label>
          <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--os-text-2)] mb-1.5">Client</label>
          <Input value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--os-text-2)] mb-1.5">Owner</label>
          <Input value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--os-text-2)] mb-1.5">Due date</label>
          <Input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--os-text-2)] mb-1.5">Budget (₹)</label>
          <Input type="number" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} />
        </div>

        <div className="pt-2 border-t border-[var(--os-border)] border-t-white/20 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[var(--os-text-2)] mb-2">Status</label>
            <InlineSelect
              value={project.status}
              options={STATUS_OPTIONS}
              onChange={status => updateProject(project.id, { status })}
              size="md"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--os-text-2)] mb-2">Health</label>
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
  const { projects, tasks, isLoading, updateProjectStatus, updateProjectHealth, deleteProject } = useProjectsStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const editingProject = projects.find(p => p.id === editingId)

  function patchStatus(id: string, status: ProjectStatus) {
    updateProjectStatus(id, status)
    if (!isDemo()) api.patch(`/projects/${id}`, { status })
  }

  function patchHealth(id: string, health: HealthStatus) {
    updateProjectHealth(id, health)
    if (!isDemo()) api.patch(`/projects/${id}`, { health })
  }

  function handleDelete(id: string) {
    deleteProject(id)
    if (!isDemo()) api.delete(`/projects/${id}`)
  }


  const chartData = projects
    .filter(p => p.status !== 'planned')
    .map(p => ({ name: p.name.split(' ').slice(0, 2).join(' '), progress: p.progress, color: p.pillarColor }))

  const HEALTH_COLOR: Record<HealthStatus, string> = {
    'on-track': '#00c875', 'at-risk': '#fdab3d', behind: '#e2445c', completed: '#579bfc',
  }
  const HEALTH_LABEL: Record<HealthStatus, string> = {
    'on-track': 'On Track', 'at-risk': 'At Risk', behind: 'Behind', completed: 'Completed',
  }

  const onTrack = projects.filter(p => p.health === 'on-track').length

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded-lg" style={{ background: 'var(--os-surface-0)' }} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl" style={{ background: 'var(--os-surface-0)' }} />
          ))}
        </div>
        <div className="h-48 rounded-xl" style={{ background: 'var(--os-surface-0)' }} />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl" style={{ background: 'var(--os-surface-0)' }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <KIMMPSignalBar module="Projects" />
      <div>
        <h2 className="text-[22px] font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Projects</h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--os-text-2)' }}>{projects.length} projects · {tasks.length} tasks tracked</p>
      </div>

      {/* 4-stat header */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Projects', value: projects.length,                                              bg: 'linear-gradient(135deg,#2564ea 0%,#4ab6d4 100%)', glow: '#2564ea' },
          { label: 'On Track',       value: onTrack,                                                      bg: 'linear-gradient(135deg,#00c875 0%,#00a86b 100%)', glow: '#00c875' },
          { label: 'At Risk',        value: projects.filter(p => p.health === 'at-risk').length,          bg: 'linear-gradient(135deg,#fdab3d 0%,#f59e0b 100%)', glow: '#fdab3d' },
          { label: 'Behind',         value: projects.filter(p => p.health === 'behind').length,           bg: 'linear-gradient(135deg,#e2445c 0%,#c0392b 100%)', glow: '#e2445c' },
        ].map(stat => (
          <div key={stat.label} className="rounded-2xl p-5 relative overflow-hidden" style={{ background: stat.bg, boxShadow: `0 4px 20px ${stat.glow}40` }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.30) 0%, transparent 60%)' }} />
            <p className="relative text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>{stat.label}</p>
            <p className="relative text-3xl font-black tracking-tight" style={{ color: '#ffffff' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Project Progress</CardTitle></CardHeader>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} layout="vertical" barSize={14}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--os-border)" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--os-text-2)' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11, fill: 'var(--os-text-1)' }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => [`${v}%`, 'Progress']} contentStyle={{ borderRadius: 10, border: '1px solid var(--os-border)', background: 'var(--os-card)', color: 'var(--os-text-1)', fontSize: 12 }} />
            <Bar dataKey="progress" radius={[0, 6, 6, 0]} fill="url(#brandGradient2)" />
            <defs>
              <linearGradient id="brandGradient2" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#579bfc" />
                <stop offset="100%" stopColor="#00c875" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="space-y-3">
        {projects.length === 0 && (
          <div className="py-16 text-center" style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12 }}>
            <Briefcase className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--os-text-2)' }} />
            <p className="font-medium" style={{ color: 'var(--os-text-1)' }}>No projects yet</p>
            <p className="text-sm mt-1" style={{ color: 'var(--os-text-2)' }}>Projects you create will appear here.</p>
          </div>
        )}
        {projects.map(p => (
          <div key={p.id} className="group transition-all duration-200 hover:shadow-md" style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, boxShadow: 'var(--os-shadow-card)' }}>
            <div className="flex items-start gap-4 p-5">
              {/* health accent bar */}
              <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: HEALTH_COLOR[p.health] }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--os-text-1)' }}>{p.name}</h3>
                  {/* health badge */}
                  <span className="rounded-full text-[11px] font-bold px-2.5 py-0.5 text-white" style={{ background: HEALTH_COLOR[p.health] }}>
                    {HEALTH_LABEL[p.health]}
                  </span>
                  <InlineSelect
                    value={p.status}
                    options={STATUS_OPTIONS}
                    onChange={status => patchStatus(p.id, status)}
                    size="sm"
                  />
                  <InlineSelect
                    value={p.health}
                    options={HEALTH_OPTIONS}
                    onChange={health => patchHealth(p.id, health)}
                    size="sm"
                    dot
                  />
                </div>
                <p className="text-xs mb-3 line-clamp-1" style={{ color: 'var(--os-text-2)' }}>{p.description}</p>
                <div className="flex items-center gap-6 text-xs mb-3" style={{ color: 'var(--os-text-2)' }}>
                  <span>Client: <span className="font-medium" style={{ color: 'var(--os-text-1)' }}>{p.client}</span></span>
                  <span>Due: <span className="font-medium" style={{ color: 'var(--os-text-1)' }}>{new Date(p.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span></span>
                  <span>Budget: <span className="font-medium" style={{ color: 'var(--os-text-1)' }}>₹{(p.spent / 1000).toFixed(0)}k / ₹{(p.budget / 1000).toFixed(0)}k</span></span>
                  <span>{p.taskCount} tasks · {p.openIssues} issues</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--os-surface-0)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${p.progress}%`, background: HEALTH_COLOR[p.health] }}
                    />
                  </div>
                  <span className="text-xs font-bold w-8" style={{ color: HEALTH_COLOR[p.health] }}>{p.progress}%</span>
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-400"
                    onClick={e => { e.stopPropagation(); handleDelete(p.id) }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                  <Avatar name={p.owner} size="sm" />
                </div>
                <AvatarGroup users={p.team.map(n => ({ name: n }))} max={3} size="xs" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingProject && (
        <ProjectEditDrawer project={editingProject} onClose={() => setEditingId(null)} />
      )}
    </div>
  )
}
