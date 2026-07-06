import { useState, useMemo } from 'react'
import { ChevronDown, ChevronRight, CheckSquare, Clock, List, GanttChart } from 'lucide-react'
import { Spinner } from '@design-system/components/Spinner'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
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
  'in-progress': { label: 'In Progress', color: '#579bfc' },
  'at-risk':     { label: 'At Risk',     color: '#fdab3d' },
  'behind':      { label: 'Behind',      color: '#e2445c' },
  'completed':   { label: 'Completed',   color: '#00c875' },
  'on-hold':     { label: 'On Hold',     color: '#c5c7d0' },
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
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', boxShadow: 'var(--os-shadow-card)' }}>
      {/* Month header */}
      <div className="flex" style={{ borderBottom: '1px solid var(--os-border)' }}>
        <div className="w-48 flex-shrink-0 px-4 py-3" style={{ borderRight: '1px solid var(--os-border)' }}>
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--os-text-3)' }}>Project</span>
        </div>
        <div className="flex-1 relative h-10">
          <div className="flex h-full">
            {months.map(m => (
              <div key={m} className="flex-1 flex items-center justify-center"
                style={{ borderRight: '1px solid var(--os-border)' }}>
                <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: 'var(--os-text-3)' }}>{m}</span>
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
        const cfg      = STATUS_CONFIG[p.status as keyof typeof STATUS_CONFIG]
        const barLeft  = pct(p.startDate)
        const barRight = pct(p.targetDate)
        const barWidth = barRight - barLeft

        return (
          <div key={p.id} style={{ borderBottom: i < projects.length - 1 ? '1px solid var(--os-border)' : 'none' }}>
            <div className="flex items-center">
              <div className="w-48 flex-shrink-0 px-4 py-3" style={{ borderRight: '1px solid var(--os-border)' }}>
                <p className="text-xs font-semibold truncate" style={{ color: 'var(--os-text-1)' }}>{p.name}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--os-text-2)' }}>{p.progress}% · {cfg.label}</p>
              </div>
              <div className="flex-1 relative py-3 px-2" style={{ height: 52 }}>
                {/* Bar track */}
                <div className="absolute top-1/2 -translate-y-1/2 h-6 rounded-lg overflow-hidden"
                  style={{ left: `${barLeft}%`, width: `${barWidth}%`, background: `${p.color}15`, border: `1px solid ${p.color}30` }}>
                  <div className="h-full rounded-lg transition-all duration-700"
                    style={{ width: `${p.progress}%`, background: p.color }} />
                </div>
                {/* Milestone diamonds */}
                {p.milestones.filter(m => m.date).map((m, mi) => (
                  <div key={mi}
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 transition-all"
                    style={{
                      left: `calc(${pct(m.date!)}% - 6px)`,
                      background: m.done ? p.color : 'var(--os-surface)',
                      border: `1.5px solid ${m.done ? p.color : 'var(--os-border)'}`,
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
        const isOpen    = openId === p.id
        const cfg       = STATUS_CONFIG[p.status as keyof typeof STATUS_CONFIG]
        const doneMiles = p.milestones.filter(m => m.done).length

        return (
          <div key={p.id} className="rounded-2xl overflow-hidden"
            style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', boxShadow: 'var(--os-shadow-card)' }}>
            <button
              className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
              style={{ borderLeft: `4px solid ${p.color}` }}
              onClick={() => setOpenId(isOpen ? '' : p.id)}
            >
              {isOpen
                ? <ChevronDown  className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--os-text-3)' }} />
                : <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--os-text-3)' }} />
              }
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold" style={{ color: 'var(--os-text-1)' }}>{p.name}</p>
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full"
                    style={{ background: cfg.color, color: '#fff' }}>
                    {cfg.label}
                  </span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: 'var(--os-text-2)' }}>
                  {p.startDate ? fmtDate(p.startDate) : '—'} → {p.targetDate ? fmtDate(p.targetDate) : '—'} · {p.lead}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: 'var(--os-text-1)' }}>{p.progress}%</p>
                  <p className="text-[10px]" style={{ color: 'var(--os-text-2)' }}>{doneMiles}/{p.milestones.length} milestones</p>
                </div>
                <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--os-border)' }}>
                  <div className="h-full rounded-full"
                    style={{ width: `${p.progress}%`, background: p.color, boxShadow: `0 0 6px ${p.color}40` }} />
                </div>
              </div>
            </button>

            {isOpen && (
              <div className="px-5 pb-5 pt-4 space-y-5" style={{ borderTop: '1px solid var(--os-border)' }}>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--os-text-2)' }}>{p.description}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Delivery Lead', value: p.lead },
                    { label: 'Progress',      value: `${p.progress}%` },
                    { label: 'Start Date',    value: p.startDate ? fmtDate(p.startDate) : '—' },
                    { label: 'Target Date',   value: p.targetDate ? fmtDate(p.targetDate) : '—' },
                  ].map(item => (
                    <div key={item.label} className="rounded-xl p-3" style={{ background: 'var(--os-surface)', border: '1px solid var(--os-border)' }}>
                      <p className="text-[10px] mb-0.5" style={{ color: 'var(--os-text-3)' }}>{item.label}</p>
                      <p className="text-sm font-semibold" style={{ color: 'var(--os-text-1)' }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: 'var(--os-text-3)' }}>Milestones</p>
                  <div className="space-y-2">
                    {p.milestones.map((m, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            background: m.done ? p.color : 'var(--os-surface)',
                            border: `1px solid ${m.done ? p.color : 'var(--os-border)'}`,
                          }}>
                          {m.done
                            ? <CheckSquare className="w-3.5 h-3.5 text-white" />
                            : <Clock       className="w-3.5 h-3.5" style={{ color: 'var(--os-text-3)' }} />
                          }
                        </div>
                        <span className="text-sm flex-1"
                          style={{
                            color: m.done ? 'var(--os-text-3)' : 'var(--os-text-1)',
                            fontWeight: m.done ? 400 : 500,
                            textDecoration: m.done ? 'line-through' : 'none',
                          }}>
                          {m.name}
                        </span>
                        <span className="text-xs flex-shrink-0" style={{ color: 'var(--os-text-2)' }}>
                          {m.date ? fmtDate(m.date) : '—'}
                        </span>
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
  const [view, setView]     = useState<'list' | 'timeline'>('list')
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

  const atRisk    = projects.filter(p => p.status === 'at-risk' || p.status === 'behind').length
  const avgProgress = projects.length ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length) : 0
  const completed   = projects.filter(p => p.status === 'completed').length

  return (
    <div className="space-y-5">
      <KIMMPSignalBar module="Projects" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Your Projects</h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--os-text-2)' }}>
            {projects.length} engagement{projects.length !== 1 ? 's' : ''} · live delivery view
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'var(--os-surface)', border: '1px solid var(--os-border)' }}>
          {([['list', List, 'List'], ['timeline', GanttChart, 'Timeline']] as const).map(([v, Icon, label]) => (
            <button key={v} onClick={() => setView(v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: view === v ? '#579bfc' : 'transparent',
                color: view === v ? '#fff' : 'var(--os-text-2)',
                boxShadow: view === v ? '0 1px 4px rgba(87,155,252,0.35)' : 'none',
              }}>
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI strip — only shown when projects are loaded */}
      {!isLoading && projects.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Engagements',    value: String(projects.length), bg: 'linear-gradient(135deg,#2564ea 0%,#4ab6d4 100%)', glow: '#2564ea' },
            { label: 'Avg Progress',   value: `${avgProgress}%`,        bg: avgProgress >= 75 ? 'linear-gradient(135deg,#00c875 0%,#00a86b 100%)' : 'linear-gradient(135deg,#fdab3d 0%,#f59e0b 100%)', glow: avgProgress >= 75 ? '#00c875' : '#fdab3d' },
            { label: 'Completed',      value: String(completed),        bg: completed > 0 ? 'linear-gradient(135deg,#7f53f9 0%,#5c32e8 100%)' : 'linear-gradient(135deg,#64748b 0%,#475569 100%)', glow: completed > 0 ? '#7f53f9' : '#64748b' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-5 relative overflow-hidden" style={{ background: s.bg, boxShadow: `0 4px 20px ${s.glow}35` }}>
              <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.4) 0%, transparent 60%)' }} />
              <p className="relative text-xs font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>{s.label}</p>
              <p className="relative text-2xl font-black tracking-tight text-white">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--os-text-2)' }}>
          <Spinner size="sm" /> Loading projects…
        </div>
      )}

      {!isLoading && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl"
          style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', boxShadow: 'var(--os-shadow-card)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(37,100,234,0.08)' }}>
            <GanttChart className="w-7 h-7" style={{ color: '#2564ea' }} />
          </div>
          <p className="font-semibold text-base" style={{ color: 'var(--os-text-1)' }}>No active projects</p>
          <p className="text-sm mt-1.5" style={{ color: 'var(--os-text-2)' }}>Projects assigned to your account will appear here.</p>
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
