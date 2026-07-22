import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import {
  CheckSquare, Clock, AlertTriangle, Cpu, Calendar, TrendingUp,
  Bell, Star, ChevronRight, Circle, CheckCircle2, Timer, User,
  BarChart3, Zap, Target,
} from 'lucide-react'

const S: Record<string, React.CSSProperties> = {
  page:    { display: 'flex', flexDirection: 'column', gap: 24, padding: '4px 0' },
  grid3:   { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
  grid2:   { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  card:    { background: 'var(--os-surface-1)', border: '1px solid var(--os-border)', borderRadius: 10, padding: 18, display: 'flex', flexDirection: 'column', gap: 12 },
  cardH:   { fontSize: 11, fontWeight: 700, letterSpacing: '.06em', color: 'var(--os-text-3)', textTransform: 'uppercase' as const },
  stat:    { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '14px 10px', borderRadius: 8, background: 'var(--os-surface-2)', border: '1px solid var(--os-border-subtle)' },
  statVal: { fontSize: 26, fontWeight: 800, lineHeight: 1, fontVariantNumeric: 'tabular-nums' as const },
  statLbl: { fontSize: 10, color: 'var(--os-text-3)', marginTop: 3 },
  row:     { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 7, background: 'var(--os-surface-2)', border: '1px solid var(--os-border-subtle)' },
  badge:   { display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20 },
  sectionH: { fontSize: 13, fontWeight: 700, color: 'var(--os-text-1)', marginBottom: 2 },
}

function priorityColor(p: string): string {
  if (p === 'CRITICAL' || p === 'HIGH') return 'var(--os-danger)'
  if (p === 'MEDIUM') return 'var(--os-warning)'
  return 'var(--os-text-3)'
}

function statusColor(s: string): string {
  if (s === 'DONE' || s === 'COMPLETE') return 'var(--os-success)'
  if (s === 'IN_PROGRESS' || s === 'ACTIVE') return '#579bfc'
  if (s === 'BLOCKED' || s === 'OVERDUE') return 'var(--os-danger)'
  return 'var(--os-text-3)'
}

function relDate(d: string): string {
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return `${diff}d ago`
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export const PersonalWorkspacePage: React.FC = () => {
  const { data: pmo } = useQuery({
    queryKey: ['ws-pmo-stats'],
    queryFn: () => api.get('/admin/pmo/stats').then(r => r.data),
  })
  const { data: projects } = useQuery({
    queryKey: ['ws-pmo-projects'],
    queryFn: () => api.get('/admin/pmo/projects').then(r => r.data),
  })
  const { data: health } = useQuery({
    queryKey: ['ws-system-health'],
    queryFn: () => api.get('/admin/kangqore-immp/system-health').then(r => r.data).catch(() => null),
  })
  const { data: insights } = useQuery({
    queryKey: ['ws-personal-insights'],
    queryFn: () => api.get('/admin/kangqore-immp/insights?limit=5').then(r => r.data).catch(() => []),
  })

  const tasks = (projects ?? []).flatMap((p: any) => (p.tasks ?? []).slice(0, 2))
  const overdue  = tasks.filter((t: any) => t.status === 'OVERDUE' || t.isOverdue).length
  const today    = tasks.filter((t: any) => t.dueToday || t.status === 'IN_PROGRESS').length
  const done     = tasks.filter((t: any) => t.status === 'DONE' || t.status === 'COMPLETE').length
  const total    = tasks.length

  const oisScore = health?.oisScore ?? pmo?.oisScore ?? null
  const agentHealth = health?.agentHealth ?? null
  const uptime   = health?.uptime ?? null

  return (
    <div style={S.page}>

      {/* ── Top stat bar ── */}
      <div style={S.grid3}>
        <div style={{ ...S.card, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(87,155,252,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckSquare size={20} color="#579bfc" />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{pmo?.totalTasks ?? total ?? '—'}</div>
            <div style={{ fontSize: 11, color: 'var(--os-text-3)' }}>Total Tasks</div>
          </div>
        </div>
        <div style={{ ...S.card, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,80,80,.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={20} color="var(--os-danger)" />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: overdue > 0 ? 'var(--os-danger)' : 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{pmo?.overdueTasks ?? overdue}</div>
            <div style={{ fontSize: 11, color: 'var(--os-text-3)' }}>Overdue</div>
          </div>
        </div>
        <div style={{ ...S.card, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(0,200,150,.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={20} color="var(--os-success)" />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>
              {oisScore !== null ? `${oisScore.toFixed(1)}` : '—'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--os-text-3)' }}>OIS Score</div>
          </div>
        </div>
      </div>

      <div style={S.grid2}>
        {/* ── Task Feed ── */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={S.cardH}>Task Feed</span>
            <div style={{ display: 'flex', gap: 8, fontSize: 10, color: 'var(--os-text-3)' }}>
              <span>{done}/{total} done</span>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: 4, borderRadius: 4, background: 'var(--os-surface-3)', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #579bfc, #00c8a0)', width: total > 0 ? `${(done / total) * 100}%` : '0%', transition: 'width .4s' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {tasks.length === 0 ? (
              <div style={{ color: 'var(--os-text-4)', fontSize: 12, textAlign: 'center', padding: 16 }}>No tasks found</div>
            ) : tasks.slice(0, 7).map((t: any, i: number) => (
              <div key={t.id ?? i} style={S.row}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: priorityColor(t.priority ?? 'LOW'), flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 11.5, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {t.title ?? t.name ?? 'Task'}
                </span>
                <span style={{ ...S.badge, background: statusColor(t.status ?? '') + '18', color: statusColor(t.status ?? '') }}>
                  {t.status ?? 'TODO'}
                </span>
                {t.dueDate && (
                  <span style={{ fontSize: 9, color: 'var(--os-text-4)', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                    {relDate(t.dueDate)}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Task stats row */}
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { label: 'Overdue', val: overdue, col: 'var(--os-danger)' },
              { label: 'Today', val: today, col: 'var(--os-warning)' },
              { label: 'Done', val: done, col: 'var(--os-success)' },
            ].map(s => (
              <div key={s.label} style={{ flex: 1, textAlign: 'center', padding: '6px 4px', borderRadius: 6, background: s.col + '11', border: `1px solid ${s.col}22` }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: s.col, fontVariantNumeric: 'tabular-nums' }}>{s.val}</div>
                <div style={{ fontSize: 9, color: 'var(--os-text-4)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── OIS + Intelligence snapshot ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* OIS Snapshot */}
          <div style={S.card}>
            <span style={S.cardH}>OIS Snapshot</span>
            {oisScore !== null ? (
              <>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 36, fontWeight: 900, color: oisScore >= 75 ? 'var(--os-success)' : oisScore >= 55 ? 'var(--os-warning)' : 'var(--os-danger)', fontVariantNumeric: 'tabular-nums' }}>
                    {oisScore.toFixed(1)}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--os-text-3)' }}>/100</span>
                </div>
                {/* Score bar */}
                <div style={{ height: 8, borderRadius: 8, background: 'var(--os-surface-3)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 8, width: `${oisScore}%`, background: oisScore >= 75 ? 'linear-gradient(90deg,#00c8a0,#00e5b5)' : oisScore >= 55 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#ef4444,#f87171)', transition: 'width .5s' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {[
                    { label: 'Agent Health', val: agentHealth != null ? `${agentHealth}%` : '—' },
                    { label: 'Uptime', val: uptime ? `${uptime}%` : '—' },
                    { label: 'Active Missions', val: health?.activeMissions ?? '—' },
                    { label: 'Decisions Today', val: health?.decisionsToday ?? '—' },
                  ].map(m => (
                    <div key={m.label} style={{ padding: '8px 10px', borderRadius: 7, background: 'var(--os-surface-2)', border: '1px solid var(--os-border-subtle)' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{m.val}</div>
                      <div style={{ fontSize: 9, color: 'var(--os-text-4)' }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ color: 'var(--os-text-4)', fontSize: 12, textAlign: 'center', padding: '12px 0' }}>OIS data unavailable</div>
            )}
          </div>

          {/* Active Projects */}
          <div style={S.card}>
            <span style={S.cardH}>Active Projects</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {(projects ?? []).slice(0, 4).length === 0 ? (
                <div style={{ color: 'var(--os-text-4)', fontSize: 12, textAlign: 'center', padding: 8 }}>No active projects</div>
              ) : (projects ?? []).slice(0, 4).map((p: any, i: number) => (
                <div key={p.id ?? i} style={S.row}>
                  <Star size={11} color="#fbbf24" />
                  <span style={{ flex: 1, fontSize: 11.5, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name ?? p.title}</span>
                  <span style={{ ...S.badge, background: '#579bfc18', color: '#579bfc' }}>{p.status ?? 'ACTIVE'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Intelligence Feed ── */}
      <div style={S.card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Zap size={13} color="#a78bfa" />
          <span style={S.cardH}>Recent WAANDA Insights</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {(Array.isArray(insights) ? insights : []).slice(0, 4).length === 0 ? (
            <div style={{ gridColumn: '1/-1', color: 'var(--os-text-4)', fontSize: 12, textAlign: 'center', padding: 12 }}>No insights yet</div>
          ) : (Array.isArray(insights) ? insights : []).slice(0, 4).map((ins: any, i: number) => (
            <div key={ins.id ?? i} style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--os-surface-2)', border: '1px solid var(--os-border-subtle)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-text-1)', marginBottom: 3 }}>
                {ins.title ?? ins.type ?? 'Insight'}
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--os-text-3)', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {ins.body ?? ins.description ?? ins.content ?? ''}
              </div>
              {ins.createdAt && (
                <div style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 5 }}>{relDate(ins.createdAt)}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
