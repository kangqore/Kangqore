import { useState, useMemo } from 'react'
import { ChevronDown, ChevronRight, CheckSquare, Clock, List, GanttChart, Users, Calendar } from 'lucide-react'
import { Badge } from '@design-system/components/Badge'
import { Spinner } from '@design-system/components/Spinner'
import { useClientProjects } from '../useClientData'

const PROJECTS = [
  {
    id: 'p1', name: 'Patient Portal v2', status: 'in-progress', progress: 68,
    startDate: '2026-03-01', targetDate: '2026-07-15',
    deliveryLead: 'Ravi Nair', techLead: 'Dev Patel',
    color: '#2564ea',
    description: 'Full rebuild of the patient-facing portal with HIPAA compliance, telemedicine, and appointment scheduling.',
    milestones: [
      { name: 'Discovery & Architecture',    date: '2026-03-20', done: true  },
      { name: 'Design system & wireframes',  date: '2026-04-10', done: true  },
      { name: 'Core auth & patient flows',   date: '2026-05-01', done: true  },
      { name: 'Telemedicine integration',    date: '2026-06-05', done: false },
      { name: 'Beta release to UAT',         date: '2026-06-20', done: false },
      { name: 'Go-live',                     date: '2026-07-15', done: false },
    ],
  },
  {
    id: 'p2', name: 'HIPAA Compliance Layer', status: 'in-progress', progress: 91,
    startDate: '2026-04-01', targetDate: '2026-06-15',
    deliveryLead: 'Omar Khalid', techLead: 'Jake Morton',
    color: '#00c875',
    description: 'Audit logging, data encryption at rest, and compliance reporting module for regulatory sign-off.',
    milestones: [
      { name: 'Threat model & scope',         date: '2026-04-10', done: true  },
      { name: 'Encryption implementation',    date: '2026-05-01', done: true  },
      { name: 'Audit log module',             date: '2026-05-20', done: true  },
      { name: 'Compliance report builder',    date: '2026-06-01', done: true  },
      { name: 'Final audit & sign-off',       date: '2026-06-15', done: false },
    ],
  },
  {
    id: 'p3', name: 'Analytics Dashboard', status: 'at-risk', progress: 32,
    startDate: '2026-05-01', targetDate: '2026-07-30',
    deliveryLead: 'Anika Roy', techLead: 'Priya Chen',
    color: '#fdab3d',
    description: 'Executive analytics dashboard for patient outcomes, staff efficiency, and operational KPIs.',
    milestones: [
      { name: 'Requirements workshop',    date: '2026-05-10', done: true  },
      { name: 'Data model design',        date: '2026-05-28', done: false },
      { name: 'UI prototypes',            date: '2026-06-08', done: false },
      { name: 'Backend integration',      date: '2026-07-01', done: false },
      { name: 'UAT & launch',             date: '2026-07-30', done: false },
    ],
  },
]

const STATUS_CONFIG = {
  'in-progress': { label: 'In Progress', color: '#2564ea' },
  'at-risk':     { label: 'At Risk',     color: '#fdab3d' },
  'completed':   { label: 'Completed',   color: '#00c875' },
  'on-hold':     { label: 'On Hold',     color: '#64748b' },
}

const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

// ── Timeline view ─────────────────────────────────────────────────────────────

function TimelineView({ projects }: { projects: typeof PROJECTS }) {
  const totalStart = new Date('2026-03-01').getTime()
  const totalEnd   = new Date('2026-08-01').getTime()
  const totalMs    = totalEnd - totalStart

  const months = useMemo(() => {
    const res: string[] = []
    const d = new Date('2026-03-01')
    while (d <= new Date('2026-08-01')) {
      res.push(d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }))
      d.setMonth(d.getMonth() + 1)
    }
    return res
  }, [])

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
                {p.milestones.map((m, mi) => (
                  <div key={mi}
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 transition-all"
                    style={{
                      left: `calc(${pct(m.date)}% - 6px)`,
                      background: m.done ? p.color : '#1f2a4a',
                      border: `1.5px solid ${m.done ? p.color : '#2E2854'}`,
                      boxShadow: m.done ? `0 0 6px ${p.color}50` : 'none',
                    }}
                    title={`${m.name} · ${fmtDate(m.date)}`}
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
  projects: typeof PROJECTS
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
                  {fmtDate(p.startDate)} → {fmtDate(p.targetDate)} · {p.deliveryLead}
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
                    { label: 'Delivery Lead', value: p.deliveryLead },
                    { label: 'Tech Lead',     value: p.techLead     },
                    { label: 'Start Date',    value: fmtDate(p.startDate)  },
                    { label: 'Target Date',   value: fmtDate(p.targetDate) },
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
                        <span className="text-xs text-slate-500 flex-shrink-0">{fmtDate(m.date)}</span>
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

  const projects = useMemo(() => {
    const api = apiProjects as Record<string, unknown>[] | undefined
    return api?.length
      ? api.map(p => ({
          id:          String(p.id),
          name:        String(p.title ?? p.name ?? 'Untitled'),
          status:      p.status === 'ACTIVE' ? 'in-progress' : p.status === 'COMPLETED' ? 'completed' : 'on-hold',
          progress:    Number(p.progress ?? 0),
          startDate:   String(p.createdAt ?? '2026-03-01').slice(0, 10),
          targetDate:  '2026-07-30',
          deliveryLead: 'Kangqore',
          techLead:    'Kangqore',
          color:       '#2564ea',
          description: String(p.description ?? ''),
          milestones:  ((p.deliverables as Record<string,unknown>[] | undefined) ?? []).map((d, i) => ({
            name: String(d.title ?? `Milestone ${i + 1}`),
            date: '2026-07-01',
            done: d.status === 'COMPLETED',
          })),
        }))
      : PROJECTS
  }, [apiProjects])

  const atRisk = projects.filter(p => p.status === 'at-risk').length

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

      {view === 'list' ? (
        <ListView projects={projects as typeof PROJECTS} openId={openId} setOpenId={setOpenId} />
      ) : (
        <TimelineView projects={projects as typeof PROJECTS} />
      )}
    </div>
  )
}
