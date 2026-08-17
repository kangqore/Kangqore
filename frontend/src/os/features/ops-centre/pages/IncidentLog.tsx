import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  AlertTriangle, CheckCircle, Clock, Plus, ChevronDown, ChevronRight,
  User, Cpu, Zap, X, Filter, RefreshCw,
} from 'lucide-react'
import { api } from '@lib/api'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Incident {
  id:           string
  number:       string
  title:        string
  description:  string
  priority:     string
  status:       string
  category:     string
  slaDeadline:  string | null
  slaBreached:  boolean
  slaStatus:    string
  slaRemaining: string
  aiDraft:      string | null
  resolution:   string | null
  createdAt:    string
  resolvedAt:   string | null
  assignee:     { id: string; name: string; avatarUrl: string | null } | null
  reportedBy:   { id: string; name: string }
  configItem:   { id: string; name: string; ciType: string } | null
  problem:      { id: string; number: string; title: string; status: string } | null
}

interface Stats {
  total:        number
  p1Active:     number
  slaBreached:  number
  resolvedToday: number
  openByPriority: { priority: string; _count: { _all: number } }[]
  byStatus:      { status: string;   _count: { _all: number } }[]
}

// ── Priority config ────────────────────────────────────────────────────────────

const PRIORITY = {
  P1: { label: 'P1 · Critical', bg: 'rgba(226,68,92,0.12)',  text: '#e2445c', border: 'rgba(226,68,92,0.25)'  },
  P2: { label: 'P2 · High',     bg: 'rgba(253,171,61,0.12)', text: '#fdab3d', border: 'rgba(253,171,61,0.25)' },
  P3: { label: 'P3 · Medium',   bg: 'rgba(87,155,252,0.12)', text: '#579bfc', border: 'rgba(87,155,252,0.25)' },
  P4: { label: 'P4 · Low',      bg: 'rgba(0,200,117,0.08)',  text: '#00c875', border: 'rgba(0,200,117,0.2)'   },
} as Record<string, { label: string; bg: string; text: string; border: string }>

const STATUS_COLOUR = {
  NEW:         { bg: 'rgba(124,58,237,0.1)', text: '#7c3aed' },
  TRIAGING:    { bg: 'rgba(253,171,61,0.1)', text: '#fdab3d' },
  IN_PROGRESS: { bg: 'rgba(87,155,252,0.1)', text: '#579bfc' },
  ON_HOLD:     { bg: 'rgba(100,100,100,0.1)', text: 'var(--os-text-2)' },
  RESOLVED:    { bg: 'rgba(0,200,117,0.08)', text: '#00c875' },
  CLOSED:      { bg: 'rgba(0,0,0,0.06)',     text: 'var(--os-text-2)' },
} as Record<string, { bg: string; text: string }>

const SLA_COLOUR = {
  breached: '#e2445c',
  critical: '#e2445c',
  warning:  '#fdab3d',
  ok:       '#00c875',
  none:     'var(--os-text-2)',
}

function PriorityBadge({ p }: { p: string }) {
  const c = PRIORITY[p] ?? PRIORITY['P3']
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-2xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      {c.label}
    </span>
  )
}

function StatusBadge({ s }: { s: string }) {
  const c = STATUS_COLOUR[s] ?? STATUS_COLOUR['NEW']
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-2xl text-[10px] font-bold uppercase tracking-wider"
      style={{ background: c.bg, color: c.text }}>
      {s.replace('_', ' ')}
    </span>
  )
}

function SlaChip({ inc }: { inc: Incident }) {
  if (inc.status === 'RESOLVED' || inc.status === 'CLOSED') return null
  const col = SLA_COLOUR[inc.slaStatus] ?? SLA_COLOUR['none']
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold whitespace-nowrap" style={{ color: col }}>
      <Clock className="w-3 h-3" />
      {inc.slaRemaining}
    </span>
  )
}

// ── Create Incident Modal ──────────────────────────────────────────────────────

function CreateModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient()
  const [form, setForm] = useState({
    title: '', description: '', priority: 'P3', category: 'SOFTWARE',
  })

  const create = useMutation({
    mutationFn: () => api.post('/admin/itil/incidents', form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['itil-incidents'] })
      qc.invalidateQueries({ queryKey: ['itil-stats'] })
      onClose()
    },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl p-6 shadow-2xl" style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-[var(--os-text-1)]">New Incident</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--os-text-2)] hover:bg-[var(--os-surface-0)] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <input
            autoFocus
            placeholder="Incident title *"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full px-3 py-2 text-sm rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none focus:border-[#579bfc]"
          />
          <textarea
            placeholder="Description — what is broken, impact, how to reproduce *"
            rows={3}
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="w-full px-3 py-2 text-sm rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none focus:border-[#579bfc] resize-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[var(--os-text-2)] mb-1 uppercase tracking-wider">Priority</label>
              <select
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none focus:border-[#579bfc]"
              >
                <option value="P1">P1 · Critical</option>
                <option value="P2">P2 · High</option>
                <option value="P3">P3 · Medium</option>
                <option value="P4">P4 · Low</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[var(--os-text-2)] mb-1 uppercase tracking-wider">Category</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none focus:border-[#579bfc]"
              >
                {['SOFTWARE','HARDWARE','NETWORK','ACCESS','APPLICATION','OTHER'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-4 py-2 rounded-2xl text-sm font-bold text-[var(--os-text-2)] hover:bg-[var(--os-surface-0)] transition-colors">
            Cancel
          </button>
          <button
            disabled={!form.title.trim() || !form.description.trim() || create.isPending}
            onClick={() => create.mutate()}
            className="px-5 py-2 rounded-2xl text-sm font-bold text-white disabled:opacity-40 transition-colors"
            style={{ background: '#579bfc' }}
          >
            {create.isPending ? 'Creating…' : 'Create Incident'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Incident Row ───────────────────────────────────────────────────────────────

function IncidentRow({ inc }: { inc: Incident }) {
  const [expanded, setExpanded] = useState(false)
  const [resolution, setResolution] = useState('')
  const qc = useQueryClient()

  const update = useMutation({
    mutationFn: (data: Record<string, unknown>) => api.patch(`/admin/itil/incidents/${inc.id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['itil-incidents'] })
      qc.invalidateQueries({ queryKey: ['itil-stats'] })
    },
  })

  return (
    <>
      <tr
        className="hover:bg-[var(--os-surface-0)] transition-colors cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        <td className="px-4 py-3 w-6">
          {expanded ? <ChevronDown className="w-3.5 h-3.5 text-[var(--os-text-2)]" /> : <ChevronRight className="w-3.5 h-3.5 text-[var(--os-text-2)]" />}
        </td>
        <td className="px-2 py-3 whitespace-nowrap">
          <span className="text-xs font-mono font-bold text-[var(--os-text-2)]">{inc.number}</span>
        </td>
        <td className="px-2 py-3 max-w-xs">
          <p className="text-xs font-bold text-[var(--os-text-1)] truncate">{inc.title}</p>
          <p className="text-[10px] text-[var(--os-text-2)] mt-0.5">{inc.category}</p>
        </td>
        <td className="px-2 py-3 whitespace-nowrap"><PriorityBadge p={inc.priority} /></td>
        <td className="px-2 py-3 whitespace-nowrap"><StatusBadge s={inc.status} /></td>
        <td className="px-2 py-3 whitespace-nowrap"><SlaChip inc={inc} /></td>
        <td className="px-2 py-3 whitespace-nowrap">
          {inc.assignee
            ? <span className="text-xs font-medium text-[var(--os-text-2)]">{inc.assignee.name}</span>
            : <span className="text-[10px] text-[var(--os-text-2)] italic">Unassigned</span>}
        </td>
        <td className="px-2 py-3 whitespace-nowrap">
          <span className="text-[10px] text-[var(--os-text-2)]">{new Date(inc.createdAt).toLocaleDateString()}</span>
        </td>
        <td className="px-2 py-3" onClick={e => e.stopPropagation()}>
          {inc.status !== 'RESOLVED' && inc.status !== 'CLOSED' && (
            <button
              onClick={() => update.mutate({ status: 'RESOLVED' })}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-2xl text-[10px] font-bold transition-colors"
              style={{ background: 'rgba(0,200,117,0.1)', color: '#00c875' }}
            >
              <CheckCircle className="w-3 h-3" /> Resolve
            </button>
          )}
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={9} className="px-0 pb-0">
            <div className="mx-4 mb-3 p-4 rounded-2xl border border-[var(--os-border)]" style={{ background: 'var(--os-surface-0)' }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Description */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)] mb-1.5">Description</p>
                  <p className="text-xs text-[var(--os-text-1)] leading-relaxed">{inc.description}</p>
                  {inc.resolution && (
                    <>
                      <p className="text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)] mt-3 mb-1.5">Resolution</p>
                      <p className="text-xs text-[var(--os-text-1)] leading-relaxed">{inc.resolution}</p>
                    </>
                  )}
                  {/* Resolve form */}
                  {inc.status !== 'RESOLVED' && inc.status !== 'CLOSED' && (
                    <div className="mt-3 flex gap-2">
                      <input
                        placeholder="Resolution notes…"
                        value={resolution}
                        onChange={e => setResolution(e.target.value)}
                        className="flex-1 px-2.5 py-1.5 text-xs rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] text-[var(--os-text-1)] focus:outline-none focus:border-[#579bfc]"
                      />
                      <button
                        disabled={!resolution.trim() || update.isPending}
                        onClick={() => update.mutate({ status: 'RESOLVED', resolution })}
                        className="px-3 py-1.5 rounded-2xl text-xs font-bold text-white disabled:opacity-40"
                        style={{ background: '#00c875' }}
                      >
                        Resolve
                      </button>
                    </div>
                  )}
                </div>

                {/* AI Draft */}
                {inc.aiDraft && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Zap className="w-3 h-3" style={{ color: '#7c3aed' }} />
                      <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#7c3aed' }}>KIMMP · INCIDENT_RESPONDER</p>
                    </div>
                    <p className="text-xs text-[var(--os-text-1)] leading-relaxed">{inc.aiDraft}</p>
                  </div>
                )}
                {!inc.aiDraft && (
                  <div className="flex items-center gap-2 text-[10px] text-[var(--os-text-2)]">
                    <Zap className="w-3 h-3 animate-pulse" style={{ color: '#7c3aed' }} />
                    KIMMP is drafting response…
                  </div>
                )}
              </div>

              {/* Status change strip */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--os-border)]" onClick={e => e.stopPropagation()}>
                <span className="text-[10px] text-[var(--os-text-2)] font-bold">Move to:</span>
                {['TRIAGING','IN_PROGRESS','ON_HOLD','RESOLVED','CLOSED']
                  .filter(s => s !== inc.status)
                  .map(s => (
                    <button
                      key={s}
                      onClick={() => update.mutate({ status: s })}
                      className="px-2 py-0.5 rounded-2xl text-[10px] font-bold transition-colors"
                      style={{ background: (STATUS_COLOUR[s] ?? STATUS_COLOUR['NEW']).bg, color: (STATUS_COLOUR[s] ?? STATUS_COLOUR['NEW']).text }}
                    >
                      {s.replace('_', ' ')}
                    </button>
                  ))}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

// ── Stats Bar ──────────────────────────────────────────────────────────────────

function StatsBar({ stats }: { stats: Stats }) {
  const cards = [
    { label: 'Total',          value: stats.total,         color: 'var(--os-text-1)' },
    { label: 'P1 Active',      value: stats.p1Active,      color: '#e2445c' },
    { label: 'SLA Breached',   value: stats.slaBreached,   color: '#fdab3d' },
    { label: 'Resolved Today', value: stats.resolvedToday, color: '#00c875' },
  ]
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
      {cards.map(c => (
        <div key={c.label} className="rounded-2xl px-4 py-3" style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)' }}>
          <p className="text-2xl font-black tabular-nums" style={{ color: c.color }}>{c.value}</p>
          <p className="text-[10px] font-bold text-[var(--os-text-2)] uppercase tracking-wider mt-0.5">{c.label}</p>
        </div>
      ))}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function IncidentLog() {
  const qc = useQueryClient()
  const [creating, setCreating]     = useState(false)
  const [filterStatus, setStatus]   = useState('')
  const [filterPriority, setPriority] = useState('')

  const { data: stats } = useQuery<Stats>({
    queryKey:       ['itil-stats'],
    queryFn:        () => api.get('/admin/itil/incidents/stats').then(r => r.data),
    staleTime:      30_000,
    refetchInterval: 30_000,
  })

  const params = new URLSearchParams()
  if (filterStatus)   params.set('status',   filterStatus)
  if (filterPriority) params.set('priority', filterPriority)

  const { data, isLoading } = useQuery<{ rows: Incident[]; total: number }>({
    queryKey:       ['itil-incidents', filterStatus, filterPriority],
    queryFn:        () => api.get(`/admin/itil/incidents?${params}`).then(r => r.data),
    staleTime:      20_000,
    refetchInterval: 20_000,
  })

  const rows  = data?.rows  ?? []
  const total = data?.total ?? 0

  return (
    <div>
      {stats && <StatsBar stats={stats} />}

      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold text-white transition-colors"
          style={{ background: '#579bfc' }}
        >
          <Plus className="w-3.5 h-3.5" /> New Incident
        </button>

        <div className="flex items-center gap-1.5 ml-auto">
          <Filter className="w-3.5 h-3.5 text-[var(--os-text-2)]" />
          <select
            value={filterPriority}
            onChange={e => setPriority(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none"
          >
            <option value="">All priorities</option>
            {['P1','P2','P3','P4'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={e => setStatus(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none"
          >
            <option value="">All statuses</option>
            {['NEW','TRIAGING','IN_PROGRESS','ON_HOLD','RESOLVED','CLOSED'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button
            onClick={() => qc.invalidateQueries({ queryKey: ['itil-incidents'] })}
            className="w-7 h-7 rounded-2xl flex items-center justify-center text-[var(--os-text-2)] hover:bg-[var(--os-surface-0)] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <span className="text-xs text-[var(--os-text-2)]">{total} incidents</span>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[var(--os-border)] overflow-hidden" style={{ background: 'var(--os-card)' }}>
        {isLoading ? (
          <div className="p-6 space-y-2">
            {[1,2,3,4,5].map(i => <div key={i} className="h-10 rounded-2xl animate-pulse" style={{ background: 'var(--os-surface-0)' }} />)}
          </div>
        ) : rows.length === 0 ? (
          <div className="py-16 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <p className="text-sm font-bold text-[var(--os-text-1)]">No incidents</p>
            <p className="text-xs text-[var(--os-text-2)] mt-1">Systems are running normally.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--os-border)]">
                  <th className="px-4 py-2.5 w-6" />
                  <th className="px-2 py-2.5 text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)]">#</th>
                  <th className="px-2 py-2.5 text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)]">Title</th>
                  <th className="px-2 py-2.5 text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)]">Priority</th>
                  <th className="px-2 py-2.5 text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)]">Status</th>
                  <th className="px-2 py-2.5 text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)]">SLA</th>
                  <th className="px-2 py-2.5 text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)]">Assignee</th>
                  <th className="px-2 py-2.5 text-[10px] font-black uppercase tracking-wider text-[var(--os-text-2)]">Opened</th>
                  <th className="px-2 py-2.5 w-20" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--os-border)]">
                {rows.map(inc => <IncidentRow key={inc.id} inc={inc} />)}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {creating && <CreateModal onClose={() => setCreating(false)} />}
    </div>
  )
}
