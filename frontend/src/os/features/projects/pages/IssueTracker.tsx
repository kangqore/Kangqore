import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Bug, Zap, CheckSquare, Layers, Search } from 'lucide-react'
import { EmptyState } from '@design-system/components/EmptyState'
import { Badge } from '@design-system/components/Badge'
import { Avatar } from '@design-system/components/Avatar'
import { Input } from '@design-system/components/Input'
import { cn } from '@design-system/cn'
import { api, isDemo } from '@lib/api'
import { useProjectsStore } from '../store'
import type { IssueType, Priority, TaskStatus } from '../types'

interface PmoStats {
  stats: { label: string; value: string; change: string; icon: string; color: string; bg: string }[]
  investmentMix: { name: string; value: number; color: string }[]
  healthTrend: { month: string; health: number; budget: number }[]
}

const TYPE_ICON: Record<IssueType, React.ElementType> = {
  bug:     Bug,
  feature: Zap,
  task:    CheckSquare,
  epic:    Layers,
}
const TYPE_COLOR: Record<IssueType, string> = {
  bug:     'text-red-500',
  feature: 'text-blue-500',
  task:    'text-green-500',
  epic:    'text-blue-500',
}
const PRIORITY_BORDER: Record<Priority, string> = {
  critical: '#e2445c',
  high:     '#fdab3d',
  medium:   '#579bfc',
  low:      '#00c875',
}
const STATUS_VARIANT: Record<TaskStatus, 'success' | 'warning' | 'brand' | 'neutral' | 'info'> = {
  done:        'success',
  'in-progress':'warning',
  review:      'brand',
  todo:        'neutral',
  backlog:     'neutral',
}

const PRIORITIES: (Priority | 'all')[] = ['all', 'critical', 'high', 'medium', 'low']
const TYPES: (IssueType | 'all')[] = ['all', 'bug', 'feature', 'task', 'epic']

export function IssueTracker() {
  const { issues, projects, isLoading: storeLoading } = useProjectsStore()
  const [search, setSearch]           = useState('')
  const [priorityFilter, setPriority] = useState<Priority | 'all'>('all')
  const [typeFilter, setType]         = useState<IssueType | 'all'>('all')
  const [projectFilter, setProject]   = useState('all')

  const { isLoading: statsLoading } = useQuery<PmoStats>({
    queryKey: ['pmo-stats'],
    queryFn: () => api.get('/admin/pmo/stats').then(r => r.data),
    staleTime: 120_000,
    enabled: !isDemo(),
  })

  const isLoading = storeLoading || statsLoading

  const visible = issues.filter(i =>
    (priorityFilter === 'all' || i.priority === priorityFilter) &&
    (typeFilter === 'all' || i.type === typeFilter) &&
    (projectFilter === 'all' || i.projectId === projectFilter) &&
    (i.title.toLowerCase().includes(search.toLowerCase()) || i.projectName.toLowerCase().includes(search.toLowerCase()))
  )

  const critical = issues.filter(i => i.priority === 'critical' && i.status !== 'done').length
  const bugs     = issues.filter(i => i.type === 'bug' && i.status !== 'done').length
  const open     = issues.filter(i => i.status !== 'done').length

  const STATUS_COLOR: Record<string, string> = {
    done: '#00c875', 'in-progress': '#fdab3d', review: '#7c3aed', todo: '#579bfc', backlog: 'var(--os-text-2)',
  }

  if (isLoading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-8 w-40 rounded-lg" style={{ background: 'var(--os-surface-0)' }} />
        <div className="h-12 rounded-xl" style={{ background: 'var(--os-surface-0)' }} />
        <div className="h-96 rounded-xl" style={{ background: 'var(--os-surface-0)' }} />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--os-text-1)' }}>Issue Tracker</h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--os-text-2)' }}>
            {open} open · {critical} critical · {bugs} bugs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full text-[11px] font-bold px-2.5 py-0.5 text-white" style={{ background: '#e2445c' }}>{critical} Critical</span>
          <span className="rounded-full text-[11px] font-bold px-2.5 py-0.5 text-white" style={{ background: '#fdab3d' }}>{bugs} Bugs</span>
          <span className="rounded-full text-[11px] font-bold px-2.5 py-0.5" style={{ background: 'var(--os-surface-0)', color: 'var(--os-text-1)', border: '1px solid var(--os-border)' }}>{open} Open</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Input
          placeholder="Search issues…"
          prefix={<Search className="w-3.5 h-3.5" />}
          className="w-56"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {[
          { value: priorityFilter, onChange: (v: string) => setPriority(v as Priority | 'all'), options: PRIORITIES.map(p => ({ value: p, label: p === 'all' ? 'All Priorities' : p })) },
          { value: typeFilter,     onChange: (v: string) => setType(v as IssueType | 'all'),   options: TYPES.map(t => ({ value: t, label: t === 'all' ? 'All Types' : t })) },
        ].map((sel, idx) => (
          <select
            key={idx}
            value={sel.value}
            onChange={e => sel.onChange(e.target.value)}
            className="h-9 rounded-xl text-sm pl-3 pr-8 outline-none"
            style={{ border: '1px solid var(--os-border)', background: 'var(--os-card)', color: 'var(--os-text-1)' }}
          >
            {sel.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        ))}
        <select
          value={projectFilter}
          onChange={e => setProject(e.target.value)}
          className="h-9 rounded-xl text-sm pl-3 pr-8 outline-none"
          style={{ border: '1px solid var(--os-border)', background: 'var(--os-card)', color: 'var(--os-text-1)' }}
        >
          <option value="all">All Projects</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <span className="ml-auto text-sm" style={{ color: 'var(--os-text-2)' }}>{visible.length} issues</span>
      </div>

      {/* Table */}
      <div className="overflow-hidden" style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, boxShadow: 'var(--os-shadow-card)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--os-border)', background: 'var(--os-surface-0)' }}>
              {['#', 'Issue', 'Project', 'Priority', 'Status', 'Assignee', 'Created'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--os-text-2)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map(issue => {
              const TypeIcon = TYPE_ICON[issue.type]
              return (
                <tr
                  key={issue.id}
                  className="cursor-pointer group transition-colors"
                  style={{ borderBottom: '1px solid var(--os-border)', borderLeft: `3px solid ${PRIORITY_BORDER[issue.priority]}` }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--os-surface-0)')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}
                >
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--os-text-2)' }}>{issue.id.toUpperCase()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <TypeIcon className={cn('w-4 h-4 flex-shrink-0', TYPE_COLOR[issue.type])} />
                      <span className="font-medium" style={{ color: 'var(--os-text-1)' }}>{issue.title}</span>
                      {issue.labels.slice(0, 2).map(l => (
                        <Badge key={l} variant="neutral" size="sm">{l}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: 'var(--os-text-2)' }}>{issue.projectName.split(' ').slice(0, 2).join(' ')}</td>
                  <td className="px-4 py-3">
                    <span
                      className="rounded-full text-[11px] font-bold px-2.5 py-0.5 text-white capitalize"
                      style={{ background: PRIORITY_BORDER[issue.priority] }}
                    >
                      {issue.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold">
                      <span className="w-2 h-2 rounded-full" style={{ background: STATUS_COLOR[issue.status] ?? 'var(--os-text-2)' }} />
                      <span style={{ color: 'var(--os-text-1)' }}>{issue.status}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Avatar name={issue.assignee} size="xs" />
                      <span className="text-xs" style={{ color: 'var(--os-text-2)' }}>{issue.assignee.split(' ')[0]}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: 'var(--os-text-2)' }}>
                    {new Date(issue.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {visible.length === 0 && (
          <EmptyState
            icon={<Bug className="w-6 h-6" />}
            title="No issues match"
            description="Try a different status, type, or priority filter."
          />
        )}
      </div>
    </div>
  )
}
