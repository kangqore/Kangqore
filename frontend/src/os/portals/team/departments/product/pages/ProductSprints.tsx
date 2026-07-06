import { Kanban, Brain, AlertTriangle } from 'lucide-react'

const TICKETS = [
  { id: 'KIMMP-438', title: 'Context window caching layer',          points: 5, assignee: 'AR', status: 'Done'        },
  { id: 'KIMMP-435', title: 'AEGIS audit log pagination',            points: 3, assignee: 'PM', status: 'Done'        },
  { id: 'KIMMP-433', title: 'Roadmap drag-and-drop reorder',         points: 3, assignee: 'OS', status: 'Done'        },
  { id: 'KIMMP-440', title: 'Sprint velocity chart component',       points: 2, assignee: 'AR', status: 'Done'        },
  { id: 'KIMMP-441', title: 'Feature backlog search & filter',       points: 3, assignee: 'PM', status: 'Done'        },
  { id: 'KIMMP-436', title: 'Release notes auto-generation (KIMMP)', points: 5, assignee: 'AR', status: 'In Progress' },
  { id: 'KIMMP-437', title: 'Design system dark mode audit',         points: 3, assignee: 'OS', status: 'In Progress' },
  { id: 'KIMMP-439', title: 'Research tracker MVP',                  points: 5, assignee: 'PM', status: 'In Progress' },
  { id: 'KIMMP-442', title: 'OAuth 2.0 enterprise SSO integration',  points: 8, assignee: 'AR', status: 'Blocked',
    blockedReason: 'Waiting on identity provider credentials from IT. Priya Mistry to follow up — on critical path for 2026-06-30 sprint close.' },
]

const STATUS_COLOR: Record<string, string> = {
  'Done':        '#10B981',
  'In Progress': '#F59E0B',
  'Blocked':     '#EF4444',
}

const STATUS_BG: Record<string, string> = {
  'Done':        '#10B98122',
  'In Progress': '#F59E0B22',
  'Blocked':     '#EF444422',
}

export function ProductSprints() {
  const committed  = TICKETS.reduce((s, t) => s + t.points, 0)
  const completed  = TICKETS.filter(t => t.status === 'Done').reduce((s, t) => s + t.points, 0)
  const inProgress = TICKETS.filter(t => t.status === 'In Progress').reduce((s, t) => s + t.points, 0)
  const blocked    = TICKETS.filter(t => t.status === 'Blocked').reduce((s, t) => s + t.points, 0)
  const blockedTicket = TICKETS.find(t => t.status === 'Blocked')

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
          <Kanban className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Sprint Board</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Sprint 24 · 2026-06-16 → 2026-06-30 · Burndown: <span className="text-amber-400 font-semibold">12% behind</span></p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Committed',     value: `${committed}pts`, color: '#A855F7' },
          { label: 'Completed',     value: `${completed}pts`, color: '#10B981' },
          { label: 'In Progress',   value: `${inProgress}pts`,color: '#F59E0B' },
          { label: 'Blocked',       value: `${blocked}pts`,   color: '#EF4444' },
          { label: 'Velocity Avg',  value: '26.4',            color: '#6366F1' },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* KIMMP Insight */}
      <div className="p-4 rounded-2xl border border-purple-500/30 bg-purple-500/10 flex items-start gap-3">
        <Brain className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-purple-200">
          <span className="font-semibold text-purple-300">KIMMP:</span>{' '}
          Sprint 24 burndown is 12% behind. Blocked ticket (KIMMP-442 OAuth integration) is on the critical path. Recommend reassigning Priya Mistry to unblock today.
        </p>
      </div>

      {/* Blocked callout */}
      {blockedTicket && (
        <div className="p-4 rounded-2xl border border-red-500/30 bg-red-500/10 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-300">{blockedTicket.id} — {blockedTicket.title}</p>
            <p className="text-xs text-red-400/80 mt-1">{blockedTicket.blockedReason}</p>
          </div>
        </div>
      )}

      {/* Ticket list */}
      <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-2">
        <h2 className="text-sm font-semibold text-[var(--os-text-1)] uppercase tracking-wider mb-3">Sprint Items</h2>
        {TICKETS.map(t => (
          <div key={t.id}
            className={`flex items-center gap-4 py-3 border-b border-white/[0.05] last:border-0 ${t.status === 'Blocked' ? 'opacity-90' : ''}`}>
            <span className="text-xs text-[var(--os-text-2)] font-mono w-24 flex-shrink-0">{t.id}</span>
            <span className="flex-1 text-sm text-[var(--os-text-1)] leading-snug">{t.title}</span>
            <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px] font-bold text-purple-300 flex-shrink-0">
              {t.assignee}
            </div>
            <span className="text-xs font-semibold text-[var(--os-text-2)] w-8 text-right flex-shrink-0">{t.points}pt</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ color: STATUS_COLOR[t.status], background: STATUS_BG[t.status] }}>
              {t.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
