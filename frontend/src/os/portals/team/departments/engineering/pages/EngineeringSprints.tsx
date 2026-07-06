import { useState } from 'react'
import { Kanban, AlertCircle, Brain } from 'lucide-react'

type SprintStatus = 'In Progress' | 'Done' | 'Blocked' | 'To Do'

interface SprintItem {
  id:       string
  title:    string
  points:   number
  status:   SprintStatus
  assignee: string
}

const ITEMS: SprintItem[] = [
  { id: 'ENG-201', title: 'KIMMP v3 context pipeline',    points: 13, status: 'In Progress', assignee: 'Siddharth R' },
  { id: 'ENG-202', title: 'AEGIS audit log API',          points: 8,  status: 'Done',        assignee: 'Kavya N' },
  { id: 'ENG-203', title: 'Live board drag-drop perf',    points: 5,  status: 'Done',        assignee: 'Aryan M' },
  { id: 'ENG-204', title: 'OAuth2 SSO integration',       points: 13, status: 'Blocked',     assignee: 'Siddharth R' },
  { id: 'ENG-205', title: 'Monitoring dashboard',         points: 8,  status: 'In Progress', assignee: 'Kavya N' },
  { id: 'ENG-206', title: 'Mobile API endpoints',         points: 5,  status: 'Done',        assignee: 'Aryan M' },
]

const STATUS_COLOR: Record<SprintStatus, string> = {
  'In Progress': '#84CC16',
  'Done':        '#10B981',
  'Blocked':     '#EF4444',
  'To Do':       '#6B7280',
}

const ACCENT = '#84CC16'

export function EngineeringSprints() {
  const [items] = useState<SprintItem[]>(ITEMS)

  const committed  = items.reduce((s, i) => s + i.points, 0)
  const completed  = items.filter(i => i.status === 'Done').reduce((s, i) => s + i.points, 0)
  const inProgress = items.filter(i => i.status === 'In Progress').reduce((s, i) => s + i.points, 0)
  const blocked    = items.filter(i => i.status === 'Blocked').reduce((s, i) => s + i.points, 0)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Kanban className="w-6 h-6" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Sprint 24</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">June 16–30, 2026 · Engineering sprint tracker for Kangqore OS, KIMMP & AEGIS.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Committed',    value: `${committed}pts`,  color: '#84CC16' },
          { label: 'Completed',    value: `${completed}pts`,  color: '#10B981' },
          { label: 'In Progress',  value: `${inProgress}pts`, color: '#84CC16' },
          { label: 'Blocked',      value: `${blocked}pts`,    color: '#EF4444' },
          { label: 'Team Velocity',value: '61.2pts',          color: '#A3E635' },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Sprint items table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Sprint Items</h2>
          <span className="text-xs text-[var(--os-text-2)]">{items.length} items</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider w-28">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider w-24">Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider w-32">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider w-36">Assignee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {items.map(item => (
                <tr
                  key={item.id}
                  className={`transition-colors ${item.status === 'Blocked' ? 'bg-red-500/5' : 'hover:bg-white/[0.02]'}`}
                >
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-[var(--os-text-2)]">{item.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">{item.title}</span>
                    {item.status === 'Blocked' && (
                      <span className="ml-2 text-xs text-red-400 font-medium">— waiting for cert</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[var(--os-text-1)] font-mono">{item.points}pts</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ background: `${STATUS_COLOR[item.status]}18`, color: STATUS_COLOR[item.status] }}
                    >
                      {item.status === 'Blocked' && <AlertCircle className="w-3 h-3" />}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[var(--os-text-2)] text-sm">{item.assignee}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KIMMP insight */}
      <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5 flex gap-4">
        <div className="w-9 h-9 rounded-xl bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
          <Brain className="w-4 h-4 text-yellow-400" />
        </div>
        <div>
          <p className="text-xs font-semibold text-yellow-400 mb-1">KIMMP · Sprint Intelligence</p>
          <p className="text-sm text-[var(--os-text-1)] leading-relaxed">
            ENG-204 SSO blocked by security certificate — 4 enterprise deals dependent. Escalate to Arjun Shah (CISO) immediately.
          </p>
        </div>
      </div>
    </div>
  )
}
