import { useState } from 'react'
import { Flag } from 'lucide-react'
import { cn } from '@design-system/cn'
import { usePartnersStore } from '../store'
import type { TaskStatus } from '../types'

const STATUS_COLS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'assigned',    label: 'Assigned',    color: '#9aa0b0' },
  { id: 'in-progress', label: 'In Progress', color: '#579bfc' },
  { id: 'review',      label: 'Review',      color: '#fdab3d' },
  { id: 'completed',   label: 'Completed',   color: '#00c875' },
  { id: 'overdue',     label: 'Overdue',     color: '#e2445c' },
]

const PRIORITY_COLOR = { critical: '#e2445c', high: '#fdab3d', medium: '#579bfc', low: '#9aa0b0' }
const STATUS_COLOR: Record<TaskStatus, string> = {
  assigned: '#9aa0b0', 'in-progress': '#579bfc', review: '#fdab3d', completed: '#00c875', overdue: '#e2445c',
}

export function TasksPage() {
  const { partners, tasks, isLoading } = usePartnersStore()
  const [statusFilter, setStatus] = useState<TaskStatus | 'all'>('all')
  const [partnerFilter, setPartner] = useState('all')

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-6 w-48 rounded bg-slate-700" />
          <div className="h-6 w-32 rounded bg-slate-700" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 rounded bg-slate-700" />
              {[...Array(2)].map((__, j) => (
                <div key={j} className="os-card p-3 h-20" />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const visible = tasks.filter(t =>
    (statusFilter === 'all' || t.status === statusFilter) &&
    (partnerFilter === 'all' || t.partnerId === partnerFilter)
  )

  const activeTasks = tasks.filter(t => t.status !== 'completed').length
  const overdue     = tasks.filter(t => t.status === 'overdue').length
  const inReview    = tasks.filter(t => t.status === 'review').length
  const totalFees   = tasks.filter(t => t.status !== 'completed').reduce((s,t)=>s+t.fee, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[var(--os-text-2)] font-semibold mb-0.5">Assignments</p>
          <h2 className="text-xl font-bold text-[var(--os-text-1)]">Tasks & Assignments</h2>
          <p className="text-sm text-[var(--os-text-2)] mt-0.5">{tasks.length} tasks across {partners.length} partners</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-full font-bold" style={{ background: '#579bfc20', color: '#579bfc' }}>{activeTasks} active</span>
          {inReview > 0 && <span className="px-3 py-1.5 rounded-full font-bold" style={{ background: '#fdab3d20', color: '#fdab3d' }}>{inReview} in review</span>}
          {overdue  > 0 && <span className="px-3 py-1.5 rounded-full font-bold" style={{ background: '#e2445c20', color: '#e2445c' }}>{overdue} overdue</span>}
          <span className="px-3 py-1.5 rounded-full font-bold bg-slate-700/40 text-[var(--os-text-2)]">₹{(totalFees/1000).toFixed(0)}k committed</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={partnerFilter}
          onChange={e => setPartner(e.target.value)}
          className="h-9 rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] text-sm text-[var(--os-text-1)] pl-3 pr-8 outline-none focus:border-[#579bfc]"
        >
          <option value="all">All Partners</option>
          {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <div className="flex items-center gap-2 flex-wrap">
          {(['all','assigned','in-progress','review','completed','overdue'] as const).map(s => {
            const sc = s === 'all' ? '#579bfc' : STATUS_COLOR[s as TaskStatus]
            return (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className="px-3 py-1.5 rounded-2xl text-xs font-bold capitalize transition-all border"
                style={
                  statusFilter === s
                    ? { background: sc, color: '#fff', borderColor: sc }
                    : { background: 'transparent', color: 'var(--os-text-2)', borderColor: 'var(--os-border)' }
                }
              >
                {s === 'all' ? 'All' : s.replace('-',' ')}
              </button>
            )
          })}
        </div>
        <span className="ml-auto text-sm text-[var(--os-text-2)]">{visible.length} tasks</span>
      </div>

      {tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Flag className="w-10 h-10 text-[var(--os-text-2)]" />
          <p className="text-[var(--os-text-2)] font-medium">No tasks assigned</p>
          <p className="text-[var(--os-text-2)] text-sm">Partner tasks will appear here once assigned.</p>
        </div>
      )}

      {/* Kanban board */}
      {tasks.length > 0 && statusFilter === 'all' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {STATUS_COLS.map(col => {
            const colTasks = visible.filter(t => t.status === col.id)
            return (
              <div key={col.id}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                  <span className="text-xs font-semibold text-[var(--os-text-2)]">{col.label}</span>
                  <span
                    className="ml-auto text-xs font-black rounded-full w-5 h-5 flex items-center justify-center text-white"
                    style={{ background: col.color }}
                  >{colTasks.length}</span>
                </div>
                <div className="space-y-2 min-h-[80px]">
                  {colTasks.map(task => {
                    const pc = PRIORITY_COLOR[task.priority]
                    return (
                      <div key={task.id} className="os-card p-3">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Flag className="w-3 h-3 flex-shrink-0" style={{ color: pc }} />
                          <span className="text-[10px] text-[var(--os-text-2)] font-mono truncate">{task.projectName}</span>
                        </div>
                        <p className="text-xs font-medium text-[var(--os-text-1)] leading-tight mb-2">{task.title}</p>
                        <div className="flex items-center justify-between text-[10px] text-[var(--os-text-2)]">
                          <span>{task.partnerName.split(' ')[0]}</span>
                          <span className="font-semibold text-[var(--os-text-1)]">₹{(task.fee/1000).toFixed(1)}k</span>
                        </div>
                      </div>
                    )
                  })}
                  {colTasks.length === 0 && (
                    <div className="h-16 rounded-2xl border-2 border-dashed border-[var(--os-border)] flex items-center justify-center text-xs text-[var(--os-text-2)]">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="os-card overflow-hidden">
          {visible.map(task => {
            const pc = PRIORITY_COLOR[task.priority]
            const sc = STATUS_COLOR[task.status]
            return (
              <div key={task.id} className="flex items-center gap-4 px-4 py-3 border-b border-[var(--os-border)] hover:bg-[var(--os-surface-0)] last:border-0">
                <Flag className={cn('w-4 h-4 flex-shrink-0')} style={{ color: pc }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-[var(--os-text-1)] truncate">{task.title}</p>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full flex-shrink-0" style={{ background: `${sc}20`, color: sc }}>
                      {task.status.replace('-',' ')}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--os-text-2)]">{task.partnerName} · {task.projectName}</p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0 text-xs text-[var(--os-text-2)]">
                  <span>{task.storyPoints} pts</span>
                  <span className="font-semibold text-[var(--os-text-1)]">₹{task.fee.toLocaleString()}</span>
                  <span>Due {new Date(task.dueDate).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
