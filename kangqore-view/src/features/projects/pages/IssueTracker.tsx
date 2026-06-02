import { useState } from 'react'
import { Bug, Zap, CheckSquare, Layers, Search, Flag } from 'lucide-react'
import { EmptyState } from '@design-system/components/EmptyState'
import { Badge } from '@design-system/components/Badge'
import { Avatar } from '@design-system/components/Avatar'
import { Input } from '@design-system/components/Input'
import { cn } from '@design-system/cn'
import { useProjectsStore } from '../store'
import type { IssueType, Priority, TaskStatus } from '../types'

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
const PRIORITY_COLOR: Record<Priority, string> = {
  critical: 'text-red-500',
  high:     'text-orange-500',
  medium:   'text-amber-400',
  low:      'text-slate-300',
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
  const { issues, projects } = useProjectsStore()
  const [search, setSearch]         = useState('')
  const [priorityFilter, setPriority] = useState<Priority | 'all'>('all')
  const [typeFilter, setType]       = useState<IssueType | 'all'>('all')
  const [projectFilter, setProject] = useState('all')

  const visible = issues.filter(i =>
    (priorityFilter === 'all' || i.priority === priorityFilter) &&
    (typeFilter === 'all' || i.type === typeFilter) &&
    (projectFilter === 'all' || i.projectId === projectFilter) &&
    (i.title.toLowerCase().includes(search.toLowerCase()) || i.projectName.toLowerCase().includes(search.toLowerCase()))
  )

  const critical = issues.filter(i => i.priority === 'critical' && i.status !== 'done').length
  const bugs     = issues.filter(i => i.type === 'bug' && i.status !== 'done').length
  const open     = issues.filter(i => i.status !== 'done').length

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Issue Tracker</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {open} open · {critical} critical · {bugs} bugs
          </p>
        </div>
        <div className="flex items-center gap-2">
          {[
            { label: `${critical} Critical`, color: 'bg-red-50 text-red-600 border-red-200' },
            { label: `${bugs} Bugs`,         color: 'bg-orange-50 text-orange-600 border-orange-200' },
            { label: `${open} Open`,         color: 'bg-slate-50 text-slate-600 border-slate-200' },
          ].map(c => (
            <span key={c.label} className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${c.color}`}>{c.label}</span>
          ))}
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
        <select
          value={priorityFilter}
          onChange={e => setPriority(e.target.value as Priority | 'all')}
          className="h-9 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 pl-3 pr-8 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          {PRIORITIES.map(p => <option key={p} value={p}>{p === 'all' ? 'All Priorities' : p}</option>)}
        </select>
        <select
          value={typeFilter}
          onChange={e => setType(e.target.value as IssueType | 'all')}
          className="h-9 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 pl-3 pr-8 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          {TYPES.map(t => <option key={t} value={t}>{t === 'all' ? 'All Types' : t}</option>)}
        </select>
        <select
          value={projectFilter}
          onChange={e => setProject(e.target.value)}
          className="h-9 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 pl-3 pr-8 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          <option value="all">All Projects</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <span className="ml-auto text-sm text-slate-400">{visible.length} issues</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider w-8">#</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Issue</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Project</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Priority</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Assignee</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {visible.map(issue => {
              const TypeIcon = TYPE_ICON[issue.type]
              return (
                <tr key={issue.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                  <td className="px-4 py-3 text-xs text-slate-400 font-mono">{issue.id.toUpperCase()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <TypeIcon className={cn('w-4 h-4 flex-shrink-0', TYPE_COLOR[issue.type])} />
                      <span className="font-medium text-slate-800 group-hover:text-blue-700 transition-colors">{issue.title}</span>
                      {issue.labels.slice(0, 2).map(l => (
                        <Badge key={l} variant="neutral" size="sm">{l}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{issue.projectName.split(' ').slice(0, 2).join(' ')}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5">
                      <Flag className={cn('w-3.5 h-3.5', PRIORITY_COLOR[issue.priority])} />
                      <span className="text-xs capitalize text-slate-600">{issue.priority}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANT[issue.status]} size="sm">{issue.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Avatar name={issue.assignee} size="xs" />
                      <span className="text-xs text-slate-500">{issue.assignee.split(' ')[0]}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
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
