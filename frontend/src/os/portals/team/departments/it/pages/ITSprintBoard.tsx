import { useState } from 'react'
import { LayoutGrid, Circle, AlertCircle, CheckCircle2 } from 'lucide-react'

type TicketStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
type TicketPriority = 'HIGH' | 'MEDIUM' | 'LOW'

const TICKETS = [
  { id: 'IT-S-001', title: 'Patch VPN gateway — EU region',              status: 'IN_PROGRESS' as TicketStatus, priority: 'HIGH'   as TicketPriority, assignee: 'Rohan M.',  points: 5 },
  { id: 'IT-S-002', title: 'Upgrade prod-db-01 to PostgreSQL 16',        status: 'TODO'        as TicketStatus, priority: 'HIGH'   as TicketPriority, assignee: 'Priya N.',  points: 8 },
  { id: 'IT-S-003', title: 'Set up GitHub Actions self-hosted runners',  status: 'IN_PROGRESS' as TicketStatus, priority: 'MEDIUM' as TicketPriority, assignee: 'Rohan M.',  points: 5 },
  { id: 'IT-S-004', title: 'Add BRAVE_SEARCH_API_KEY to prod env',       status: 'TODO'        as TicketStatus, priority: 'MEDIUM' as TicketPriority, assignee: 'Arjun S.', points: 1 },
  { id: 'IT-S-005', title: 'Implement zero-trust network policy v2',     status: 'REVIEW'      as TicketStatus, priority: 'HIGH'   as TicketPriority, assignee: 'Rohan M.',  points: 13},
  { id: 'IT-S-006', title: 'SOC 2 control evidence — CC6.1 upload',      status: 'DONE'        as TicketStatus, priority: 'HIGH'   as TicketPriority, assignee: 'Priya N.',  points: 3 },
  { id: 'IT-S-007', title: 'Rotate all prod API keys',                   status: 'DONE'        as TicketStatus, priority: 'MEDIUM' as TicketPriority, assignee: 'Rohan M.',  points: 2 },
  { id: 'IT-S-008', title: 'Replace SSL cert — legacy dashboard',        status: 'DONE'        as TicketStatus, priority: 'LOW'    as TicketPriority, assignee: 'Sneha G.',  points: 1 },
  { id: 'IT-S-009', title: 'Datadog alert tuning — reduce noise',        status: 'BACKLOG'     as TicketStatus, priority: 'LOW'    as TicketPriority, assignee: 'Unassigned', points: 3 },
  { id: 'IT-S-010', title: 'Asset refresh plan — FY26 budget request',   status: 'BACKLOG'     as TicketStatus, priority: 'MEDIUM' as TicketPriority, assignee: 'Unassigned', points: 5 },
]

const COLS: { id: TicketStatus; label: string; color: string }[] = [
  { id: 'BACKLOG',     label: 'Backlog',     color: 'var(--os-text-2)' },
  { id: 'TODO',        label: 'To Do',       color: '#6B7280' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: '#2564ea' },
  { id: 'REVIEW',      label: 'Review',      color: '#F59E0B' },
  { id: 'DONE',        label: 'Done',        color: '#10B981' },
]

const P_COLOR: Record<TicketPriority, string> = { HIGH: '#EF4444', MEDIUM: '#F59E0B', LOW: '#6B7280' }

export function ITSprintBoard() {
  const [view, setView] = useState<'board' | 'list'>('list')

  const byStatus = (s: TicketStatus) => TICKETS.filter(t => t.status === s)
  const donePoints = TICKETS.filter(t => t.status === 'DONE').reduce((s, t) => s + t.points, 0)
  const totalPoints = TICKETS.reduce((s, t) => s + t.points, 0)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <LayoutGrid className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Sprint Board</h1>
            <p className="text-[var(--os-text-2)] mt-1 text-sm">Current sprint progress for IT project work.</p>
          </div>
        </div>
        <div className="flex gap-2">
          {(['list', 'board'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${view === v ? 'bg-blue-600 text-white' : 'bg-slate-800/60 text-[var(--os-text-2)] border border-white/10'}`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Sprint progress */}
      <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Sprint IT-2 · 23 Jun – 7 Jul</p>
          <p className="text-xs text-[var(--os-text-2)]">{donePoints}/{totalPoints} points</p>
        </div>
        <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
          <div className="h-full rounded-full bg-blue-500" style={{ width: `${(donePoints / totalPoints) * 100}%` }} />
        </div>
        <div className="flex gap-6 text-xs text-[var(--os-text-2)]">
          <span>{byStatus('DONE').length} done</span>
          <span>{byStatus('IN_PROGRESS').length} in progress</span>
          <span>{byStatus('TODO').length + byStatus('BACKLOG').length} remaining</span>
        </div>
      </div>

      {/* List view */}
      {view === 'list' && (
        <div className="space-y-2">
          {TICKETS.map(t => (
            <div key={t.id} className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: P_COLOR[t.priority] }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{t.title}</p>
                <p className="text-xs text-[var(--os-text-2)] mt-0.5">{t.id} · {t.assignee} · {t.points}pt</p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: `${COLS.find(c => c.id === t.status)!.color}22`, color: COLS.find(c => c.id === t.status)!.color }}>
                {t.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Board view */}
      {view === 'board' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {COLS.map(col => (
            <div key={col.id} className="space-y-2">
              <div className="flex items-center gap-1.5 px-1">
                <span className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                <p className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider">{col.label}</p>
                <span className="ml-auto text-xs text-[var(--os-text-2)]">{byStatus(col.id).length}</span>
              </div>
              {byStatus(col.id).map(t => (
                <div key={t.id} className="p-3 rounded-xl border border-white/10 bg-slate-900/60 space-y-2">
                  <p className="text-xs font-medium text-white leading-snug">{t.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[var(--os-text-2)]">{t.id}</span>
                    <span className="text-[10px] font-bold" style={{ color: P_COLOR[t.priority] }}>{t.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
