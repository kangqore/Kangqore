import { useState } from 'react'
import { Flag } from 'lucide-react'
import { Card } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { cn } from '@design-system/cn'
import { usePartnersStore } from '../store'
import type { TaskStatus } from '../types'

const STATUS_COLS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'assigned',    label: 'Assigned',    color: '#94a3b8' },
  { id: 'in-progress', label: 'In Progress', color: '#2564ea' },
  { id: 'review',      label: 'Review',      color: '#f59e0b' },
  { id: 'completed',   label: 'Completed',   color: '#22c55e' },
  { id: 'overdue',     label: 'Overdue',     color: '#ef4444' },
]
const PRIORITY_COLOR = { critical: 'text-red-500', high: 'text-orange-500', medium: 'text-amber-400', low: 'text-slate-300' }
const STATUS_VARIANT: Record<TaskStatus,'info'|'warning'|'success'|'danger'|'neutral'> = {
  assigned: 'neutral', 'in-progress': 'info', review: 'warning', completed: 'success', overdue: 'danger',
}

export function TasksPage() {
  const { partners, tasks } = usePartnersStore()
  const [statusFilter, setStatus] = useState<TaskStatus | 'all'>('all')
  const [partnerFilter, setPartner] = useState('all')

  const visible = tasks.filter(t =>
    (statusFilter === 'all' || t.status === statusFilter) &&
    (partnerFilter === 'all' || t.partnerId === partnerFilter)
  )

  const activeTasks   = tasks.filter(t => t.status !== 'completed').length
  const overdue       = tasks.filter(t => t.status === 'overdue').length
  const inReview      = tasks.filter(t => t.status === 'review').length
  const totalFees     = tasks.filter(t => t.status !== 'completed').reduce((s,t)=>s+t.fee, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Tasks & Assignments</h2>
          <p className="text-sm text-slate-500 mt-0.5">{tasks.length} tasks across {partners.length} partners</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-[#2564ea]/5 text-[#2564ea] font-semibold border border-[#2564ea]/15">{activeTasks} active</span>
          {inReview > 0 && <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 font-semibold border border-amber-200">{inReview} in review</span>}
          {overdue  > 0 && <span className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 font-semibold border border-red-200">{overdue} overdue</span>}
          <span className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 font-semibold border border-slate-200">£{(totalFees/1000).toFixed(0)}k committed</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <select value={partnerFilter} onChange={e => setPartner(e.target.value)}
          className="h-9 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 pl-3 pr-8 outline-none focus:border-[#2564ea] focus:ring-2 focus:ring-[#2564ea]/20">
          <option value="all">All Partners</option>
          {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <div className="flex items-center gap-2">
          {(['all','assigned','in-progress','review','completed','overdue'] as const).map(s => (
            <button key={s} onClick={() => setStatus(s)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${statusFilter === s ? 'bg-[#2564ea] text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-[#2564ea]/40'}`}>
              {s === 'all' ? 'All' : s.replace('-',' ')}
            </button>
          ))}
        </div>
        <span className="ml-auto text-sm text-slate-400">{visible.length} tasks</span>
      </div>

      {/* Kanban-style columns (status board) */}
      {statusFilter === 'all' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {STATUS_COLS.map(col => {
            const colTasks = visible.filter(t => t.status === col.id)
            return (
              <div key={col.id}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                  <span className="text-xs font-semibold text-slate-600">{col.label}</span>
                  <span className="ml-auto text-xs font-bold text-slate-400 bg-slate-100 rounded-full w-5 h-5 flex items-center justify-center">{colTasks.length}</span>
                </div>
                <div className="space-y-2 min-h-[80px]">
                  {colTasks.map(task => (
                    <div key={task.id} className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Flag className={cn('w-3 h-3', PRIORITY_COLOR[task.priority])} />
                        <span className="text-[10px] text-slate-400 font-mono truncate">{task.projectName}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-800 leading-tight mb-2">{task.title}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>{task.partnerName.split(' ')[0]}</span>
                        <span className="font-semibold text-slate-600">£{(task.fee/1000).toFixed(1)}k</span>
                      </div>
                    </div>
                  ))}
                  {colTasks.length === 0 && <div className="h-16 rounded-xl border-2 border-dashed border-slate-100 flex items-center justify-center text-xs text-slate-300">Empty</div>}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* List view for filtered status */
        <div className="space-y-2">
          {visible.map(task => (
            <Card key={task.id} className="hover:shadow-sm transition-all">
              <div className="flex items-center gap-4">
                <Flag className={cn('w-4 h-4 flex-shrink-0', PRIORITY_COLOR[task.priority])} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-slate-800 truncate">{task.title}</p>
                    <Badge variant={STATUS_VARIANT[task.status]} size="sm">{task.status.replace('-',' ')}</Badge>
                  </div>
                  <p className="text-xs text-slate-400">{task.partnerName} · {task.projectName}</p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0 text-xs text-slate-500">
                  <span>{task.storyPoints} pts</span>
                  <span className="font-semibold text-slate-800">£{task.fee.toLocaleString()}</span>
                  <span>Due {new Date(task.dueDate).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
