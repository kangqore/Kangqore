import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, TrendingUp, AlertTriangle, CheckCircle2, FolderKanban, CalendarDays, ArrowUpRight, Pencil, Trash2, Brain, Zap, Activity } from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { InlineSelect } from '@components/InlineSelect'
import { EditDrawer } from '@components/EditDrawer'
import { Button } from '@design-system/components/Button'
import { Input } from '@design-system/components/Input'
import { api, isDemo } from '@lib/api'
import { getSocket, connectSocket } from '../../../lib/socket'
import { useProjectsStore } from '../store'
import type { Project, ProjectStatus, HealthStatus } from '../types'

// ── Colour system ──────────────────────────────────────────────────────────────

const CAT_COLOR: Record<string, string> = {
  'Transformation':   '#2564ea',
  'Innovation / R&D': '#7c3aed',
  'Run & Maintain':   '#0d9488',
}
const HEALTH_COLOR: Record<string, string> = {
  'on-track': '#10b981', 'at-risk': '#f59e0b', behind: '#ef4444', completed: '#6366f1',
}
const HEALTH_LABEL: Record<string, string> = {
  'on-track': 'On Track', 'at-risk': 'At Risk', behind: 'Behind', completed: 'Done',
}

function catColor(cat: string) { return CAT_COLOR[cat] ?? '#64748b' }

function fmt(n: number): string {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)}Cr`
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(1)}L`
  if (n >= 1_000)      return `₹${(n / 1_000).toFixed(0)}K`
  return `₹${n}`
}

function daysLeft(iso: string): number {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000)
}

function dueDateLabel(iso: string): { label: string; color: string } {
  const d = daysLeft(iso)
  if (d < 0)  return { label: `${Math.abs(d)}d overdue`, color: '#ef4444' }
  if (d <= 7) return { label: `${d}d left`,             color: '#f59e0b' }
  if (d <= 30) return { label: `${d}d left`,            color: '#10b981' }
  return { label: new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }), color: 'var(--os-text-4)' }
}

// ── Status / health selects ────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: ProjectStatus; label: string; variant: 'success' | 'info' | 'warning' | 'brand' }[] = [
  { value: 'active',    label: 'Active',    variant: 'success' },
  { value: 'planned',   label: 'Planned',   variant: 'info'    },
  { value: 'on-hold',   label: 'On Hold',   variant: 'warning' },
  { value: 'completed', label: 'Completed', variant: 'brand'   },
]
const HEALTH_OPTIONS: { value: HealthStatus; label: string; variant: 'success' | 'warning' | 'danger' | 'info' }[] = [
  { value: 'on-track',  label: 'On Track',  variant: 'success' },
  { value: 'at-risk',   label: 'At Risk',   variant: 'warning' },
  { value: 'behind',    label: 'Behind',    variant: 'danger'  },
  { value: 'completed', label: 'Completed', variant: 'info'    },
]

// ── Edit drawer ────────────────────────────────────────────────────────────────

function ProjectEditDrawer({ project, onClose }: { project: Project; onClose: () => void }) {
  const { updateProject, updateProjectStatus, updateProjectHealth } = useProjectsStore()
  const [form, setForm] = useState({
    name:    project.name,
    client:  project.client,
    endDate: project.endDate.slice(0, 10),
    budget:  String(project.budget),
  })
  const [saving, setSaving] = useState(false)

  async function save() {
    const patch = { name: form.name, client: form.client, endDate: form.endDate, budget: Number(form.budget) }
    updateProject(project.id, patch)
    if (!isDemo()) {
      setSaving(true)
      await api.patch(`/projects/${project.id}`, patch).catch(() => {}).finally(() => setSaving(false))
    }
    onClose()
  }

  return (
    <EditDrawer open onClose={onClose} title="Edit Project" description={project.name}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={save} loading={saving}>Save</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--os-text-2)] mb-1.5">Project name</label>
          <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--os-text-2)] mb-1.5">Client</label>
          <Input value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--os-text-2)] mb-1.5">Due date</label>
          <Input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--os-text-2)] mb-1.5">Budget (₹)</label>
          <Input type="number" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} />
        </div>
        <div className="pt-2 border-t border-[var(--os-border)] space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[var(--os-text-2)] mb-2">Status</label>
            <InlineSelect value={project.status} options={STATUS_OPTIONS} onChange={s => updateProjectStatus(project.id, s)} size="md" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--os-text-2)] mb-2">Health</label>
            <InlineSelect value={project.health} options={HEALTH_OPTIONS} onChange={h => updateProjectHealth(project.id, h)} size="md" dot />
          </div>
        </div>
      </div>
    </EditDrawer>
  )
}

// ── Project card ───────────────────────────────────────────────────────────────

function ProjectCard({ p, onEdit, onDelete }: { p: Project; onEdit: () => void; onDelete: () => void }) {
  const col    = catColor(p.category)
  const hcol   = HEALTH_COLOR[p.health] ?? '#64748b'
  const due    = dueDateLabel(p.endDate)
  const budgetUsed = p.budget > 0 ? Math.min(100, Math.round((p.spent / p.budget) * 100)) : 0
  const overBudget = p.budget > 0 && p.spent > p.budget

  return (
    <div
      style={{
        background: 'var(--os-card)',
        border: '1px solid var(--os-border)',
        borderRadius: 14,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.15s, border-color 0.15s',
        boxShadow: 'var(--os-shadow-card)',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${col}18, var(--os-shadow-card)`; (e.currentTarget as HTMLElement).style.borderColor = col + '55' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--os-shadow-card)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--os-border)' }}
    >
      {/* Category accent bar */}
      <div style={{ height: 3, background: col, flexShrink: 0 }} />

      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {/* Top row: title + health pill */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 13, fontWeight: 700, color: 'var(--os-text-1)', lineHeight: 1.35,
              overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            }}>
              {p.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--os-text-3)', marginTop: 3 }}>{p.client}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 20,
              background: hcol + '1a', color: hcol, border: `1px solid ${hcol}33`,
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              {HEALTH_LABEL[p.health]}
            </span>
          </div>
        </div>

        {/* Services tags */}
        {(p.services ?? []).length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {(p.services ?? []).slice(0, 2).map(s => (
              <span key={s} style={{
                fontSize: 9, padding: '2px 7px', borderRadius: 4,
                background: col + '12', color: col, border: `1px solid ${col}22`,
                fontWeight: 600,
              }}>{s}</span>
            ))}
            {(p.services ?? []).length > 2 && (
              <span style={{
                fontSize: 9, padding: '2px 7px', borderRadius: 4,
                background: 'var(--os-surface-3)', color: 'var(--os-text-4)',
                border: '1px solid var(--os-border-subtle)',
              }}>+{(p.services ?? []).length - 2}</span>
            )}
          </div>
        )}

        {/* Progress */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: 'var(--os-text-4)' }}>Progress</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: hcol, fontVariantNumeric: 'tabular-nums' }}>{p.progress}%</span>
          </div>
          <div style={{ height: 5, borderRadius: 3, background: 'var(--os-surface-0)', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 3, width: `${p.progress}%`, background: `linear-gradient(90deg, ${col}, ${hcol})`, transition: 'width 0.5s ease' }} />
          </div>
        </div>

        {/* Budget utilization */}
        {p.budget > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: 'var(--os-text-4)' }}>Budget</span>
              <span style={{
                fontSize: 10, fontVariantNumeric: 'tabular-nums',
                color: overBudget ? '#ef4444' : 'var(--os-text-3)',
              }}>
                {fmt(p.spent)} / {fmt(p.budget)}
              </span>
            </div>
            <div style={{ height: 3, borderRadius: 2, background: 'var(--os-surface-0)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 2, width: `${budgetUsed}%`,
                background: overBudget ? '#ef4444' : col,
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        )}

        {/* Footer: due date + category + actions */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 8, marginTop: 'auto',
          borderTop: '1px solid var(--os-border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <CalendarDays style={{ width: 11, height: 11, color: due.color }} />
            <span style={{ fontSize: 10, color: due.color, fontWeight: daysLeft(p.endDate) <= 7 ? 700 : 400 }}>{due.label}</span>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={e => { e.stopPropagation(); onEdit() }} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '3px 5px', borderRadius: 5,
              color: 'var(--os-text-4)', display: 'flex', alignItems: 'center',
            }}>
              <Pencil style={{ width: 12, height: 12 }} />
            </button>
            <button onClick={e => { e.stopPropagation(); onDelete() }} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '3px 5px', borderRadius: 5,
              color: '#ef444488', display: 'flex', alignItems: 'center',
            }}>
              <Trash2 style={{ width: 12, height: 12 }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── List row ───────────────────────────────────────────────────────────────────

function ProjectRow({ p, onEdit, onDelete }: { p: Project; onEdit: () => void; onDelete: () => void }) {
  const col  = catColor(p.category)
  const hcol = HEALTH_COLOR[p.health] ?? '#64748b'
  const due  = dueDateLabel(p.endDate)
  const budgetUsed = p.budget > 0 ? Math.min(100, Math.round((p.spent / p.budget) * 100)) : 0

  return (
    <div style={{
      background: 'var(--os-card)', border: '1px solid var(--os-border)',
      borderRadius: 10, padding: '0', overflow: 'hidden',
      display: 'grid',
      gridTemplateColumns: '3px 1fr 140px 100px 140px 90px 36px',
      alignItems: 'center',
      gap: 0,
      transition: 'border-color 0.15s',
    }}>
      {/* Left accent */}
      <div style={{ width: 3, alignSelf: 'stretch', background: col }} />

      {/* Name + client + services */}
      <div style={{ padding: '12px 14px', minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {p.name}
        </div>
        <div style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 2 }}>{p.client}</div>
        {(p.services ?? []).length > 0 && (
          <div style={{ display: 'flex', gap: 3, marginTop: 4, flexWrap: 'wrap' }}>
            {(p.services ?? []).slice(0, 2).map(s => (
              <span key={s} style={{
                fontSize: 8, padding: '1px 5px', borderRadius: 3,
                background: col + '12', color: col, border: `1px solid ${col}22`, fontWeight: 600,
              }}>{s}</span>
            ))}
            {(p.services ?? []).length > 2 && (
              <span style={{ fontSize: 8, color: 'var(--os-text-4)' }}>+{(p.services ?? []).length - 2}</span>
            )}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ padding: '0 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 9, color: 'var(--os-text-4)' }}>Progress</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: hcol }}>{p.progress}%</span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: 'var(--os-surface-0)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${p.progress}%`, background: `linear-gradient(90deg, ${col}, ${hcol})`, borderRadius: 2 }} />
        </div>
      </div>

      {/* Budget */}
      <div style={{ padding: '0 12px', textAlign: 'right' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{fmt(p.budget)}</div>
        <div style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2 }}>{fmt(p.spent)} spent</div>
      </div>

      {/* Health + category */}
      <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{
          fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 20,
          background: hcol + '1a', color: hcol, border: `1px solid ${hcol}33`,
          textTransform: 'uppercase', letterSpacing: '0.05em', alignSelf: 'flex-start',
        }}>
          {HEALTH_LABEL[p.health]}
        </span>
        <span style={{
          fontSize: 9, padding: '1px 6px', borderRadius: 3, alignSelf: 'flex-start',
          background: col + '12', color: col, fontWeight: 600,
        }}>
          {p.category === 'Innovation / R&D' ? 'R&D' : p.category === 'Run & Maintain' ? 'Retainer' : 'Transform'}
        </span>
      </div>

      {/* Due date */}
      <div style={{ padding: '0 12px', textAlign: 'right' }}>
        <div style={{ fontSize: 10, color: due.color, fontWeight: daysLeft(p.endDate) <= 14 ? 700 : 400 }}>{due.label}</div>
      </div>

      {/* Actions */}
      <div style={{ padding: '0 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <button onClick={e => { e.stopPropagation(); onEdit() }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--os-text-4)', padding: 3 }}>
          <Pencil style={{ width: 11, height: 11 }} />
        </button>
        <button onClick={e => { e.stopPropagation(); onDelete() }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef444466', padding: 3 }}>
          <Trash2 style={{ width: 11, height: 11 }} />
        </button>
      </div>
    </div>
  )
}

// ── Gen3 Intelligence Panel (Phase 5.4) ───────────────────────────────────────

const ROLE_COLOR: Record<string, string> = {
  RESEARCH: '#579bfc', DIAGNOSTICS: '#f59e0b', EXECUTION: '#10b981', COACH: '#7c3aed',
}

interface Gen3Subtask { id: string; label: string; status: string; agentRole: string; steps: string[]; result?: string | null }
interface Gen3Progress { planId: string; goal: string; subtasks: Gen3Subtask[]; planStatus: string; priorResultCount?: number }

function Gen3ProjectsPanel() {
  const [goal, setGoal] = useState('')
  const [dispatching, setDispatching] = useState(false)
  const [activePlan, setActivePlan] = useState<Gen3Progress | null>(null)
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null)

  useEffect(() => {
    try { connectSocket() } catch {}
    const socket = getSocket()
    socketRef.current = socket

    const onProgress = (data: Gen3Progress) => {
      setActivePlan(prev => (prev && prev.planId !== data.planId) ? prev : data)
    }
    socket.on('PLAN_PROGRESS', onProgress)
    return () => { socket.off('PLAN_PROGRESS', onProgress) }
  }, [])

  async function dispatch() {
    if (!goal.trim() || dispatching) return
    setDispatching(true)
    setActivePlan(null)
    try {
      const r = await api.post('/admin/kangqore-immp/gen3/dispatch-project-task', { goal: goal.trim() })
      setActivePlan({ planId: r.data.planId, goal: r.data.goal, subtasks: [], planStatus: 'PENDING' })
      setGoal('')
    } catch { /* ignore */ } finally {
      setDispatching(false)
    }
  }

  const T1 = 'var(--os-text-1)', T2 = 'var(--os-text-2)', BDR = 'var(--os-border)', CARD = 'var(--os-card)', SURF = 'var(--os-surface-0)'

  return (
    <div style={{ borderRadius: 14, border: `1px solid ${BDR}`, background: CARD, padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(87,155,252,0.1)', border: '1px solid rgba(87,155,252,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Brain size={13} style={{ color: '#579bfc' }} />
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 800, color: T1, margin: 0 }}>Gen3 Intelligence — Projects (Phase 5.4)</p>
          <p style={{ fontSize: 10, color: T2, margin: 0 }}>Dispatch a 6-step AI pipeline to plan, simulate, and execute a project-level goal</p>
        </div>
        {activePlan && (
          <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', padding: '2px 7px', borderRadius: 4,
            background: activePlan.planStatus === 'DONE' ? 'rgba(16,185,129,0.1)' : 'rgba(87,155,252,0.1)',
            color: activePlan.planStatus === 'DONE' ? '#10b981' : '#579bfc' }}>
            {activePlan.planStatus}
          </span>
        )}
      </div>

      {/* Goal input */}
      <div style={{ display: 'flex', gap: 8, marginBottom: activePlan ? 14 : 0 }}>
        <input
          value={goal}
          onChange={e => setGoal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && dispatch()}
          placeholder="e.g. Identify delivery blockers on the Alpha Platform project and propose a recovery plan"
          style={{ flex: 1, padding: '8px 12px', fontSize: 11, borderRadius: 8, border: `1px solid ${BDR}`, background: SURF, color: T1, outline: 'none' }}
        />
        <button
          onClick={dispatch}
          disabled={!goal.trim() || dispatching || isDemo()}
          style={{ padding: '8px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700, background: '#579bfc', color: '#fff', border: 'none', cursor: 'pointer', flexShrink: 0, opacity: (!goal.trim() || dispatching) ? 0.5 : 1 }}>
          <Zap size={11} style={{ display: 'inline', marginRight: 5 }} />
          {dispatching ? 'Dispatching…' : 'Dispatch Gen3 Plan'}
        </button>
      </div>

      {/* Live subtask list */}
      {activePlan && activePlan.subtasks.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {activePlan.subtasks.map((st, idx) => {
            const roleColor = ROLE_COLOR[st.agentRole] ?? '#64748b'
            const statusColor = st.status === 'DONE' ? '#10b981' : st.status === 'ACTIVE' ? '#579bfc' : st.status === 'FAILED' ? '#ef4444' : T2 as string
            const prior = (activePlan.priorResultCount ?? 0)
            return (
              <div key={st.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, background: SURF, border: `1px solid ${st.status === 'ACTIVE' ? statusColor + '40' : BDR}` }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: statusColor, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: T1 }}>{st.label}</span>
                    <span style={{ fontSize: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.06em', padding: '1px 5px', borderRadius: 3, background: roleColor + '15', color: roleColor }}>{st.agentRole}</span>
                    {st.status === 'ACTIVE' && idx > 0 && prior > 0 && (
                      <span style={{ fontSize: 8, color: '#579bfc' }}>building on {prior} prior agent{prior > 1 ? 's' : ''}</span>
                    )}
                  </div>
                  {st.result && st.status === 'DONE' && (
                    <p style={{ fontSize: 9, color: T2, margin: '3px 0 0', lineHeight: 1.5 }}>{st.result.slice(0, 120)}{st.result.length > 120 ? '…' : ''}</p>
                  )}
                </div>
                <Activity size={9} style={{ color: statusColor, flexShrink: 0 }} />
              </div>
            )
          })}
        </div>
      )}

      {activePlan && activePlan.subtasks.length === 0 && (
        <p style={{ fontSize: 10, color: T2, marginTop: 8 }}>Waiting for Gen3 plan to start…</p>
      )}
    </div>
  )
}

// ── Main overview ──────────────────────────────────────────────────────────────

const CATEGORIES = ['All', 'Transformation', 'Innovation / R&D', 'Run & Maintain']
type ViewMode = 'grid' | 'list'

export function ProjectsOverview() {
  const { projects, tasks, isLoading, updateProjectStatus, updateProjectHealth, deleteProject } = useProjectsStore()
  const navigate = useNavigate()

  const [editingId,   setEditingId]   = useState<string | null>(null)
  const [search,      setSearch]      = useState('')
  const [catFilter,   setCatFilter]   = useState('All')
  const [healthFilter, setHealthFilter] = useState('All')
  const [viewMode,    setViewMode]    = useState<ViewMode>('grid')

  const editingProject = projects.find(p => p.id === editingId)

  function patchStatus(id: string, status: ProjectStatus) {
    updateProjectStatus(id, status)
    if (!isDemo()) api.patch(`/projects/${id}`, { status })
  }
  function patchHealth(id: string, health: HealthStatus) {
    updateProjectHealth(id, health)
    if (!isDemo()) api.patch(`/projects/${id}`, { health })
  }
  function handleDelete(id: string) {
    deleteProject(id)
    if (!isDemo()) api.delete(`/projects/${id}`)
  }

  // Portfolio metrics
  const totalValue    = projects.reduce((s, p) => s + p.budget, 0)
  const totalSpent    = projects.reduce((s, p) => s + p.spent, 0)
  const onTrack       = projects.filter(p => p.health === 'on-track').length
  const atRisk        = projects.filter(p => p.health === 'at-risk').length
  const behind        = projects.filter(p => p.health === 'behind').length
  const avgProgress   = projects.length > 0 ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length) : 0
  const portfolioHealth = projects.length > 0 ? Math.round((onTrack / projects.length) * 100) : 0

  // Filtered list
  const filtered = useMemo(() => {
    return projects.filter(p => {
      if (catFilter !== 'All' && p.category !== catFilter) return false
      if (healthFilter !== 'All' && p.health !== healthFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q) || p.services.some(s => s.toLowerCase().includes(q))
      }
      return true
    })
  }, [projects, catFilter, healthFilter, search])

  // Category counts
  const catCounts = useMemo(() => {
    const m: Record<string, number> = {}
    projects.forEach(p => { m[p.category] = (m[p.category] ?? 0) + 1 })
    return m
  }, [projects])

  if (isLoading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-8 w-48 rounded-2xl" style={{ background: 'var(--os-surface-0)' }} />
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 rounded-2xl" style={{ background: 'var(--os-surface-0)' }} />)}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-52 rounded-2xl" style={{ background: 'var(--os-surface-0)' }} />)}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <KIMMPSignalBar module="Projects" />

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--os-text-1)', margin: 0, lineHeight: 1.2 }}>Projects</h2>
          <p style={{ fontSize: 12, color: 'var(--os-text-3)', margin: '4px 0 0' }}>
            {projects.length} active · {fmt(totalValue)} portfolio · {tasks.length} tasks tracked
          </p>
        </div>
        <button
          onClick={() => navigate('/kangqore-view/admin/projects/kanban')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8,
            background: '#2564ea', color: '#fff', border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 700,
          }}
        >
          <Plus style={{ width: 14, height: 14 }} />
          New Project
        </button>
      </div>

      {/* Portfolio stat bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
        {[
          { label: 'Portfolio Value', value: fmt(totalValue),       sub: `${fmt(totalSpent)} spent`,         icon: TrendingUp,    col: '#2564ea' },
          { label: 'Total Projects',  value: String(projects.length), sub: `${avgProgress}% avg progress`,   icon: FolderKanban,  col: '#7c3aed' },
          { label: 'Portfolio Health',value: `${portfolioHealth}%`,  sub: `${onTrack} on track`,             icon: CheckCircle2,  col: '#10b981' },
          { label: 'At Risk',         value: String(atRisk),         sub: `needs attention`,                 icon: AlertTriangle, col: '#f59e0b' },
          { label: 'Behind',          value: String(behind),         sub: `overdue or delayed`,              icon: AlertTriangle, col: '#ef4444' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'var(--os-card)', border: `1px solid ${stat.col}22`,
            borderRadius: 12, padding: '14px 16px',
            borderLeft: `3px solid ${stat.col}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{stat.label}</span>
              <stat.icon style={{ width: 12, height: 12, color: stat.col }} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--os-text-1)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{stat.value}</div>
            <div style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 4 }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Controls: category filter + health filter + search + view toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 4, background: 'var(--os-surface-3)', borderRadius: 8, padding: 3 }}>
          {CATEGORIES.map(cat => {
            const count = cat === 'All' ? projects.length : (catCounts[cat] ?? 0)
            const active = catFilter === cat
            const col = cat === 'All' ? '#64748b' : catColor(cat)
            return (
              <button key={cat} onClick={() => setCatFilter(cat)} style={{
                padding: '5px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                fontSize: 11, fontWeight: active ? 700 : 500,
                background: active ? (cat === 'All' ? 'var(--os-card)' : col + '18') : 'transparent',
                color: active ? (cat === 'All' ? 'var(--os-text-1)' : col) : 'var(--os-text-4)',
                display: 'flex', alignItems: 'center', gap: 5,
                boxShadow: active ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
              }}>
                {cat === 'All' ? 'All' : cat === 'Innovation / R&D' ? 'R&D' : cat === 'Run & Maintain' ? 'Retainer' : cat}
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 10,
                  background: active ? (cat === 'All' ? 'var(--os-surface-3)' : col + '22') : 'var(--os-surface-0)',
                  color: active ? (cat === 'All' ? 'var(--os-text-3)' : col) : 'var(--os-text-4)',
                }}>{count}</span>
              </button>
            )
          })}
        </div>

        {/* Health filter */}
        <select
          value={healthFilter}
          onChange={e => setHealthFilter(e.target.value)}
          style={{
            fontSize: 11, fontWeight: 500, padding: '6px 10px', borderRadius: 7,
            background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
            color: 'var(--os-text-2)', cursor: 'pointer',
          }}
        >
          <option value="All">All Health</option>
          <option value="on-track">On Track</option>
          <option value="at-risk">At Risk</option>
          <option value="behind">Behind</option>
          <option value="completed">Completed</option>
        </select>

        {/* Search */}
        <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
          <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 13, height: 13, color: 'var(--os-text-4)' }} />
          <input
            placeholder="Search projects, clients, services…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '7px 10px 7px 30px', borderRadius: 7, fontSize: 12,
              background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
              color: 'var(--os-text-1)', outline: 'none',
            }}
          />
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: 2, background: 'var(--os-surface-3)', borderRadius: 7, padding: 3 }}>
          {(['grid', 'list'] as ViewMode[]).map(v => (
            <button key={v} onClick={() => setViewMode(v)} style={{
              padding: '5px 10px', borderRadius: 5, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600,
              background: viewMode === v ? 'var(--os-card)' : 'transparent',
              color: viewMode === v ? 'var(--os-text-1)' : 'var(--os-text-4)',
              boxShadow: viewMode === v ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
            }}>
              {v === 'grid' ? '⊞ Grid' : '≡ List'}
            </button>
          ))}
        </div>
      </div>

      {/* Results count when filtering */}
      {(catFilter !== 'All' || healthFilter !== 'All' || search) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--os-text-4)' }}>{filtered.length} of {projects.length} projects</span>
          <button onClick={() => { setCatFilter('All'); setHealthFilter('All'); setSearch('') }} style={{
            fontSize: 10, fontWeight: 600, color: '#2564ea', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}>
            Clear filters
          </button>
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{
          padding: '48px 0', textAlign: 'center',
          background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 14,
        }}>
          <FolderKanban style={{ width: 36, height: 36, color: 'var(--os-text-3)', margin: '0 auto 12px' }} />
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--os-text-2)', margin: 0 }}>No projects match</p>
          <p style={{ fontSize: 12, color: 'var(--os-text-4)', marginTop: 4 }}>Try clearing filters or adjusting your search.</p>
        </div>
      )}

      {/* Grid view */}
      {viewMode === 'grid' && filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {filtered.map(p => (
            <ProjectCard
              key={p.id}
              p={p}
              onEdit={() => setEditingId(p.id)}
              onDelete={() => handleDelete(p.id)}
            />
          ))}
        </div>
      )}

      {/* List view */}
      {viewMode === 'list' && filtered.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {/* Header row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '3px 1fr 140px 100px 140px 90px 36px',
            padding: '6px 0',
            fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            <div />
            <div style={{ paddingLeft: 14 }}>Project</div>
            <div style={{ paddingLeft: 12 }}>Progress</div>
            <div style={{ paddingRight: 12, textAlign: 'right' }}>Budget</div>
            <div style={{ paddingLeft: 12 }}>Health</div>
            <div style={{ paddingRight: 12, textAlign: 'right' }}>Due</div>
            <div />
          </div>
          {filtered.map(p => (
            <ProjectRow
              key={p.id}
              p={p}
              onEdit={() => setEditingId(p.id)}
              onDelete={() => handleDelete(p.id)}
            />
          ))}
        </div>
      )}

      {/* Portfolio breakdown by category */}
      {filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 4 }}>
          {Object.entries(CAT_COLOR).map(([cat, col]) => {
            const catProjects = projects.filter(p => p.category === cat)
            if (catProjects.length === 0) return null
            const catValue = catProjects.reduce((s, p) => s + p.budget, 0)
            const catOnTrack = catProjects.filter(p => p.health === 'on-track').length
            return (
              <div key={cat} style={{
                background: 'var(--os-card)', border: `1px solid ${col}22`,
                borderRadius: 10, padding: '12px 14px',
                borderLeft: `3px solid ${col}`,
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: col, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                  {cat === 'Innovation / R&D' ? 'Innovation / R&D' : cat}
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{fmt(catValue)}</div>
                <div style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 3 }}>
                  {catProjects.length} project{catProjects.length !== 1 ? 's' : ''} · {catOnTrack} on track
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Gen3 Intelligence Panel — Phase 5.4 */}
      <Gen3ProjectsPanel />

      {editingProject && (
        <ProjectEditDrawer project={editingProject} onClose={() => setEditingId(null)} />
      )}
    </div>
  )
}
