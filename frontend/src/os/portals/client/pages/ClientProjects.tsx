import { useState, useMemo } from 'react'
import { ChevronDown, ChevronRight, CheckSquare, Clock, List, GanttChart, Users, Calendar } from 'lucide-react'
import { Badge } from '@design-system/components/Badge'
import { Spinner } from '@design-system/components/Spinner'
import { useClientProjects } from '../useClientData'

interface Project {
  id: string
  name: string
  description: string
  status: 'in-progress' | 'at-risk' | 'behind' | 'completed' | 'on-hold'
  progress: number
  startDate: string
  targetDate: string
  lead: string
  color: string
  milestones: Array<{ name: string; date: string | null; done: boolean }>
}

const PROJECT_COLORS = ['#2564ea', '#7f53f9', '#00c875', '#06b6d4', '#f472b6']

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  'in-progress': { label: 'In Progress', color: '#2564ea' },
  'at-risk':     { label: 'At Risk',     color: '#fdab3d' },
  'behind':      { label: 'Behind',      color: '#e2445c' },
  'completed':   { label: 'Completed',   color: '#00c875' },
  'on-hold':     { label: 'On Hold',     color: '#64748b' },
}

const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

// ── Timeline view ─────────────────────────────────────────────────────────────

function TimelineView({ projects }: { projects: Project[] }) {
  const { totalStart, totalEnd } = useMemo(() => {
    if (!projects.length) {
      const now = new Date()
      return {
        totalStart: new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime(),
        totalEnd:   new Date(now.getFullYear(), now.getMonth() + 4, 1).getTime(),
      }
    }
    const starts = projects.map(p => new Date(p.startDate).getTime()).filter(Boolean)
    const ends   = projects.map(p => new Date(p.targetDate || p.startDate).getTime()).filter(Boolean)
    const minMs  = Math.min(...starts)
    const maxMs  = Math.max(...ends)
    // Pad 2 weeks on each side
    return { totalStart: minMs - 14 * 86400000, totalEnd: maxMs + 14 * 86400000 }
  }, [projects])
  const totalMs = totalEnd - totalStart

  const months = useMemo(() => {
    const res: string[] = []
    const d = new Date(totalStart)
    d.setDate(1)
    const end = new Date(totalEnd)
    while (d <= end) {
      res.push(d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }))
      d.setMonth(d.getMonth() + 1)
    }
    return res
  }, [totalStart, totalEnd])

  const pct = (dateStr: string) => {
    const t = new Date(dateStr).getTime()
    return Math.max(0, Math.min(100, ((t - totalStart) / totalMs) * 100))
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(32px) saturate(200%)', WebkitBackdropFilter: 'blur(32px) saturate(200%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.3)', border: '1px solid rgba(30, 41, 59, 0.6)', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
      {/* Month header */}
      <div className="flex border-b" style={{ borderColor: 'rgba(30, 41, 59, 0.6)' }}>
        <div className="w-48 flex-shrink-0 px-4 py-3" style={{ borderRight: '1px solid rgba(30, 41, 59, 0.6)' }}>
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Project</span>
        </div>
        <div className="flex-1 relative h-10">
          <div className="flex h-full">
            {months.map(m => (
              <div key={m} className="flex-1 flex items-center justify-center"
                style={{ borderRight: '1px solid rgba(15, 23, 42, 0.4)' }}>
                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wide">{m}</span>
              </div>
            ))}
          </div>
          {/* Today line */}
          <div className="absolute top-0 bottom-0 w-px pointer-events-none"
            style={{ left: `${pct(new Date().toISOString().slice(0, 10))}%`, background: 'rgba(226,68,92,0.6)' }}>
            <div className="w-1.5 h-1.5 rounded-full -ml-0.5 mt-1" style={{ background: '#e2445c' }} />
          </div>
        </div>
      </div>

      {/* Project rows */}
      {projects.map((p, i) => {
        const cfg = STATUS_CONFIG[p.status as keyof typeof STATUS_CONFIG]
        const barLeft  = pct(p.startDate)
        const barRight = pct(p.targetDate)
        const barWidth = barRight - barLeft

        return (
          <div key={p.id} style={{ borderBottom: i < projects.length - 1 ? '1px solid #1a2340' : 'none' }}>
            {/* Project bar row */}
            <div className="flex items-center">
              <div className="w-48 flex-shrink-0 px-4 py-3" style={{ borderRight: '1px solid rgba(30, 41, 59, 0.6)' }}>
                <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{p.progress}% · {cfg.label}</p>
              </div>
              <div className="flex-1 relative py-3 px-2" style={{ height: 52 }}>
                {/* Bar */}
                <div className="absolute top-1/2 -translate-y-1/2 h-6 rounded-lg overflow-hidden"
                  style={{ left: `${barLeft}%`, width: `${barWidth}%`, background: `${p.color}20`, border: `1px solid ${p.color}40` }}>
                  <div className="h-full rounded-lg transition-all duration-700"
                    style={{ width: `${p.progress}%`, background: p.color, opacity: 0.7 }} />
                </div>
                {/* Milestone diamonds */}
                {p.milestones.filter(m => m.date).map((m, mi) => (
                  <div key={mi}
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 transition-all"
                    style={{
                      left: `calc(${pct(m.date!)}% - 6px)`,
                      background: m.done ? p.color : '#1f2a4a',
                      border: `1.5px solid ${m.done ? p.color : '#2E2854'}`,
                      boxShadow: m.done ? `0 0 6px ${p.color}50` : 'none',
                    }}
                    title={`${m.name} · ${fmtDate(m.date!)}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── List view (accordion) ─────────────────────────────────────────────────────

function ListView({ projects, openId, setOpenId }: {
  projects: Project[]
  openId: string
  setOpenId: (id: string) => void
}) {
  return (
    <div className="space-y-3">
      {projects.map(p => {
        const isOpen = openId === p.id
        const cfg    = STATUS_CONFIG[p.status as keyof typeof STATUS_CONFIG]
        const doneMiles = p.milestones.filter(m => m.done).length

        return (
          <div key={p.id} className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(32px) saturate(200%)', WebkitBackdropFilter: 'blur(32px) saturate(200%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.3)', border: '1px solid rgba(30, 41, 59, 0.6)', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <button
              className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors"
              style={{ borderLeft: `3px solid ${p.color}` }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#080c18' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              onClick={() => setOpenId(isOpen ? '' : p.id)}>
              {isOpen
                ? <ChevronDown  className="w-4 h-4 text-slate-500 flex-shrink-0" />
                : <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
              }
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-white">{p.name}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ color: cfg.color, background: `${cfg.color}14`, border: `1px solid ${cfg.color}25` }}>
                    {cfg.label}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {p.startDate ? fmtDate(p.startDate) : '—'} → {p.targetDate ? fmtDate(p.targetDate) : '—'} · {p.lead}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{p.progress}%</p>
                  <p className="text-[10px] text-slate-500">{doneMiles}/{p.milestones.length} milestones</p>
                </div>
                <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: '#1a2340' }}>
                  <div className="h-full rounded-full"
                    style={{ width: `${p.progress}%`, background: p.color, boxShadow: `0 0 6px ${p.color}40` }} />
                </div>
              </div>
            </button>

            {isOpen && (
              <div className="px-5 pb-5 pt-4 space-y-5" style={{ borderTop: '1px solid rgba(30, 41, 59, 0.6)' }}>
                <p className="text-sm text-slate-400 leading-relaxed">{p.description}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Delivery Lead', value: p.lead },
                    { label: 'Progress',      value: `${p.progress}%` },
                    { label: 'Start Date',    value: p.startDate ? fmtDate(p.startDate) : '—' },
                    { label: 'Target Date',   value: p.targetDate ? fmtDate(p.targetDate) : '—' },
                  ].map(item => (
                    <div key={item.label} className="rounded-xl p-3" style={{ background: 'rgba(15, 23, 42, 0.2)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid #1a2340' }}>
                      <p className="text-[10px] text-slate-500 mb-0.5">{item.label}</p>
                      <p className="text-sm font-semibold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-3">Milestones</p>
                  <div className="space-y-2">
                    {p.milestones.map((m, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: m.done ? `${p.color}18` : '#151C2F',
                                   border: `1px solid ${m.done ? p.color + '40' : '#2E2854'}` }}>
                          {m.done
                            ? <CheckSquare className="w-3.5 h-3.5" style={{ color: p.color }} />
                            : <Clock       className="w-3.5 h-3.5 text-slate-600" />
                          }
                        </div>
                        <span className={`text-sm flex-1 ${m.done ? 'text-slate-500 line-through' : 'text-white font-medium'}`}>
                          {m.name}
                        </span>
                        <span className="text-xs text-slate-500 flex-shrink-0">{m.date ? fmtDate(m.date) : '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function ClientProjects() {
  const [view, setView]   = useState<'list' | 'timeline'>('list')
  const [openId, setOpenId] = useState<string>('p1')
  const { data: apiProjects, isLoading } = useClientProjects()

  const projects: Project[] = useMemo(() => {
    if (!apiProjects?.length) return []
    return apiProjects.map((p, i) => {
      const color = p.health === 'behind' ? '#e2445c'
        : p.health === 'at-risk' ? '#fdab3d'
        : PROJECT_COLORS[i % PROJECT_COLORS.length]
      const status: Project['status'] =
        String(p.status) === 'COMPLETED' ? 'completed'
        : String(p.status) === 'ON_HOLD'  ? 'on-hold'
        : p.health === 'behind'           ? 'behind'
        : p.health === 'at-risk'          ? 'at-risk'
        : 'in-progress'
      return {
        id:          p.id,
        name:        p.name,
        description: p.description,
        progress:    p.progress,
        status,
        startDate:   p.startDate,
        targetDate:  p.targetDate,
        lead:        p.lead,
        color,
        milestones:  p.deliverables.map(d => ({
          name: d.title,
          date: d.dueDate,
          done: d.status === 'COMPLETED' || d.status === 'APPROVED',
        })),
      }
    })
  }, [apiProjects])

  const atRisk = projects.filter(p => p.status === 'at-risk' || p.status === 'behind').length

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-white">Your Projects</h2>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-slate-500">{projects.length} active engagement{projects.length > 1 ? 's' : ''}</p>
            {atRisk > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ color: '#fdab3d', background: 'rgba(253,171,61,0.1)', border: '1px solid rgba(253,171,61,0.2)' }}>
                {atRisk} at risk
              </span>
            )}
          </div>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(32px) saturate(200%)', WebkitBackdropFilter: 'blur(32px) saturate(200%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.3)', border: '1px solid rgba(30, 41, 59, 0.6)', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
          {([['list', List, 'List'], ['timeline', GanttChart, 'Timeline']] as const).map(([v, Icon, label]) => (
            <button key={v} onClick={() => setView(v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{ background: view === v ? '#151C2F' : 'transparent',
                       color: view === v ? '#2564ea' : '#64748b',
                       border: view === v ? '1px solid #2E2854' : '1px solid transparent' }}>
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Spinner size="sm" /> Loading projects…
        </div>
      )}

      {!isLoading && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl"
          style={{ background: 'rgba(15,23,42,0.3)', border: '1px solid rgba(30,41,59,0.6)' }}>
          <GanttChart className="w-10 h-10 text-slate-700 mb-4" />
          <p className="text-slate-400 font-semibold">No active projects</p>
          <p className="text-slate-600 text-sm mt-1">Projects assigned to your account will appear here.</p>
        </div>
      )}

      {projects.length > 0 && (view === 'list' ? (
        <ListView projects={projects} openId={openId} setOpenId={setOpenId} />
      ) : (
        <TimelineView projects={projects} />
      ))}
    </div>
  )
}
