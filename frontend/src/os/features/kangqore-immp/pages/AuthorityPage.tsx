// ---------------------------------------------------------------------------
// WAANDA Authority Page — supreme authority panel
// Shows all 7 registered subsystems, lets the CEO issue directives, and
// displays the full directive log.
// ---------------------------------------------------------------------------

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@lib/api'
import { HANUMANAS, type HanumanasName } from '@lib/hanumanas'
import {
  Crown, Activity, Zap, Radio, Settings2,
  TrendingUp, Eye, Loader2, Send,
} from 'lucide-react'
import { cn } from '@design-system/cn'

// ── Types ─────────────────────────────────────────────────────────────────────

type HealthStatus = 'OPTIMAL' | 'DEGRADED' | 'PAUSED' | 'UNKNOWN'
type DirectiveType = 'ALIGN' | 'PAUSE' | 'RESUME' | 'FOCUS' | 'OVERRIDE' | 'REPORT' | 'CONFIGURE'
type SubsystemName = 'KIMMP' | HanumanasName | 'KEOS' | 'KORE' | 'EQORE' | 'ALIS' | 'VIS'

// Matches backend SubsystemReport shape exactly
interface SubsystemReport {
  name:         SubsystemName
  status:       HealthStatus      // backend field — not "health"
  registeredAt: string
  lastActive:   string
  metrics:      Record<string, number | string>
}

interface SubsystemIntelligence {
  subsystem:  SubsystemName
  summary:    string
  topSignal?: string
  health:     HealthStatus
  lastActive: string
  metrics:    Record<string, number>
}

interface DirectiveLog {
  id:          string
  directiveId: string
  to:          string
  type:        string
  reason:      string | null
  accepted:    boolean | null
  issuedAt:    string
  resolvedAt:  string | null
}

// ── Health dot ────────────────────────────────────────────────────────────────

const HEALTH_COLOR: Record<HealthStatus, string> = {
  OPTIMAL:  '#22c55e',
  DEGRADED: '#f59e0b',
  PAUSED:   '#6366f1',
  UNKNOWN:  '#6b7280',
}

const HEALTH_LABEL: Record<HealthStatus, string> = {
  OPTIMAL:  'Operational',
  DEGRADED: 'Degraded',
  PAUSED:   'Paused',
  UNKNOWN:  'Unknown',
}

function HealthDot({ status, size = 'md' }: { status: HealthStatus; size?: 'sm' | 'md' }) {
  const color = HEALTH_COLOR[status] ?? '#6b7280'
  const px = size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5'
  return (
    <span
      className={cn('rounded-full inline-block flex-shrink-0', px)}
      style={{ background: color, boxShadow: `0 0 5px ${color}60` }}
    />
  )
}

// ── Subsystem icons ───────────────────────────────────────────────────────────

const SUBSYSTEM_ICON: Record<SubsystemName, React.ElementType> = {
  KIMMP: Crown,
  HANUMANAS: Activity,
  KEOS:  Zap,
  KORE:  Settings2,
  EQORE: Radio,
  ALIS:  TrendingUp,
  VIS:   Eye,
}

const SUBSYSTEM_DESC: Record<SubsystemName, string> = {
  KIMMP: 'Cognitive runtime · Loop + cognition pipeline',
  HANUMANAS: 'Governance shield · 80 agents · threat detection',
  KEOS:  'Mission kernel · capability registry · execution',
  KORE:  'Digital twin manager · entity snapshots',
  EQORE: 'Conversation orchestration · 6-agent lead engine',
  ALIS:  'Market intelligence · demand analysis',
  VIS:   'Visibility engine · SEO + content authority',
}

// ── Subsystem card ────────────────────────────────────────────────────────────

function SubsystemCard({ system, intel }: { system: SubsystemReport; intel?: SubsystemIntelligence }) {
  const health = system.status       // backend uses "status", not "health"
  const color  = HEALTH_COLOR[health] ?? '#6b7280'
  const Icon   = SUBSYSTEM_ICON[system.name]

  return (
    <div className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="rounded-2xl p-1.5" style={{ background: `${color}18` }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <div>
            <p className="text-[13px] font-bold text-[var(--os-text-1)] tracking-wide">{system.name}</p>
            <p className="text-[10px] text-[var(--os-text-2)] leading-tight">{SUBSYSTEM_DESC[system.name]}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <HealthDot status={health} />
          <span className="text-[10px] font-semibold" style={{ color }}>
            {HEALTH_LABEL[health]}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] px-2 py-1.5">
          <p className="text-[10px] font-bold text-[var(--os-text-1)] truncate">
            {new Date(system.registeredAt).toLocaleString('en-IN', { timeStyle: 'short' })}
          </p>
          <p className="text-[9px] text-[var(--os-text-2)]">Registered</p>
        </div>
        <div className="rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] px-2 py-1.5">
          <p className="text-[10px] font-bold text-[var(--os-text-1)] truncate">
            {new Date(system.lastActive).toLocaleString('en-IN', { timeStyle: 'short' })}
          </p>
          <p className="text-[9px] text-[var(--os-text-2)]">Last active</p>
        </div>
      </div>

      {intel?.summary && (
        <p className="text-[10px] text-[var(--os-text-2)] leading-snug italic">
          {intel.summary}
        </p>
      )}
      {intel?.topSignal && (
        <p className="text-[10px] font-semibold" style={{ color }}>
          ↑ {intel.topSignal}
        </p>
      )}
    </div>
  )
}

// ── Issue Directive panel ─────────────────────────────────────────────────────

const DIRECTIVE_TYPES: DirectiveType[] = ['ALIGN', 'PAUSE', 'RESUME', 'FOCUS', 'OVERRIDE', 'REPORT', 'CONFIGURE']
const SUBSYSTEM_NAMES: SubsystemName[] = ['KIMMP', HANUMANAS.name, 'KEOS', 'KORE', 'EQORE', 'ALIS', 'VIS']

function DirectivePanel() {
  const qc = useQueryClient()
  const [to,      setTo]      = useState<SubsystemName>('KIMMP')
  const [type,    setType]    = useState<DirectiveType>('REPORT')
  const [payload, setPayload] = useState('{}')
  const [reason,  setReason]  = useState('')
  const [result,  setResult]  = useState<string | null>(null)

  const issue = useMutation({
    mutationFn: async () => {
      let parsed: Record<string, unknown> = {}
      try { parsed = JSON.parse(payload) } catch { /* ignore parse error, send empty */ }
      return apiFetch('/api/admin/waanda/authority/directive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, type, payload: parsed, reason: reason || undefined }),
      })
    },
    onSuccess: (data: any) => {
      setResult(JSON.stringify(data, null, 2))
      qc.invalidateQueries({ queryKey: ['waanda-directives'] })
      qc.invalidateQueries({ queryKey: ['waanda-authority'] })
    },
    onError: (err: any) => {
      setResult(`Error: ${err?.message ?? 'Directive failed'}`)
    },
  })

  const selectCls = 'w-full rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-[var(--os-blue)]'

  return (
    <div className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] p-5 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Send className="w-4 h-4 text-[var(--os-blue)]" />
        <h3 className="text-sm font-bold text-[var(--os-text-1)]">Issue Directive</h3>
        <span className="text-[10px] text-[var(--os-text-2)] ml-auto">WAANDA → subsystem</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-[var(--os-text-2)] uppercase tracking-wider">Subsystem</label>
          <select className={selectCls} value={to} onChange={e => setTo(e.target.value as SubsystemName)}>
            {SUBSYSTEM_NAMES.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-[var(--os-text-2)] uppercase tracking-wider">Directive type</label>
          <select className={selectCls} value={type} onChange={e => setType(e.target.value as DirectiveType)}>
            {DIRECTIVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-semibold text-[var(--os-text-2)] uppercase tracking-wider">Payload (JSON)</label>
        <textarea
          className="w-full rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] text-xs font-mono px-3 py-2 h-20 resize-none outline-none focus:ring-1 focus:ring-[var(--os-blue)]"
          value={payload}
          onChange={e => setPayload(e.target.value)}
          spellCheck={false}
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-semibold text-[var(--os-text-2)] uppercase tracking-wider">Reason (optional)</label>
        <input
          className="w-full rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-[var(--os-blue)]"
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Why is WAANDA issuing this directive?"
        />
      </div>

      <button
        onClick={() => issue.mutate()}
        disabled={issue.isPending}
        className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[var(--os-blue)] text-white text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
      >
        {issue.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Crown className="w-3.5 h-3.5" />}
        Issue Directive
      </button>

      {result && (
        <pre className="text-[10px] font-mono rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] p-3 overflow-x-auto text-[var(--os-text-2)] max-h-40">
          {result}
        </pre>
      )}
    </div>
  )
}

// ── Directive log ─────────────────────────────────────────────────────────────

const TYPE_COLOR: Record<string, string> = {
  ALIGN:     '#6366f1',
  PAUSE:     '#ef4444',
  RESUME:    '#22c55e',
  FOCUS:     '#3b82f6',
  OVERRIDE:  '#f97316',
  REPORT:    '#8b5cf6',
  CONFIGURE: '#f59e0b',
}

function DirectiveLogTable({ directives }: { directives: DirectiveLog[] }) {
  if (directives.length === 0) {
    return (
      <div className="text-center py-10 text-[var(--os-text-2)] text-sm">
        No directives issued yet. WAANDA awaits its first command cycle.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-[var(--os-border)]">
            {['Issued', 'To', 'Type', 'Reason', 'Accepted', 'Resolved'].map(h => (
              <th key={h} className="text-left text-[10px] font-semibold text-[var(--os-text-2)] uppercase tracking-wider pb-2 pr-4">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--os-border)]">
          {directives.map(d => {
            const color = TYPE_COLOR[d.type] ?? '#6b7280'
            return (
              <tr key={d.id} className="hover:bg-[var(--os-surface-0)] transition-colors">
                <td className="py-2.5 pr-4 text-[11px] font-mono text-[var(--os-text-2)] whitespace-nowrap">
                  {new Date(d.issuedAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                </td>
                <td className="py-2.5 pr-4">
                  <span className="text-[11px] font-bold text-[var(--os-text-1)]">{d.to}</span>
                </td>
                <td className="py-2.5 pr-4">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={{ color, background: `${color}18` }}
                  >
                    {d.type}
                  </span>
                </td>
                <td className="py-2.5 pr-4 text-[11px] text-[var(--os-text-2)] max-w-[240px] truncate">
                  {d.reason ?? '—'}
                </td>
                <td className="py-2.5 pr-4">
                  {d.accepted === null ? (
                    <span className="text-[10px] text-[var(--os-text-2)]">—</span>
                  ) : d.accepted ? (
                    <span className="text-[10px] font-bold text-green-500">Yes</span>
                  ) : (
                    <span className="text-[10px] font-bold text-red-400">No</span>
                  )}
                </td>
                <td className="py-2.5 text-[11px] font-mono text-[var(--os-text-2)]">
                  {d.resolvedAt
                    ? new Date(d.resolvedAt).toLocaleString('en-IN', { timeStyle: 'short' })
                    : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function AuthorityPage() {
  const { data: authorityData, isLoading: loadingSystems } = useQuery({
    queryKey: ['waanda-authority'],
    queryFn:  () => apiFetch('/api/admin/waanda/authority') as Promise<{ subsystems: SubsystemReport[] }>,
    refetchInterval: 30_000,
  })

  const { data: intelData } = useQuery({
    queryKey: ['waanda-authority-intel'],
    queryFn:  () => apiFetch('/api/admin/waanda/authority/intelligence') as Promise<{ reports: SubsystemIntelligence[] }>,
    refetchInterval: 30_000,
  })

  const { data: directivesData, isLoading: loadingDirectives } = useQuery({
    queryKey: ['waanda-directives'],
    queryFn:  () => apiFetch('/api/admin/waanda/authority/directives?limit=50') as Promise<{ directives: DirectiveLog[] }>,
    refetchInterval: 15_000,
  })

  const systems    = authorityData?.subsystems ?? []
  const intelMap   = Object.fromEntries((intelData?.reports ?? []).map(r => [r.subsystem, r]))
  const directives = directivesData?.directives ?? []

  const operational = systems.filter(s => s.status === 'OPTIMAL').length
  const registered  = systems.length

  return (
    <div className="space-y-8 pb-12">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-5 h-5 text-[var(--os-blue)]" />
            <h1 className="text-xl font-bold text-[var(--os-text-1)]">WAANDA Authority</h1>
          </div>
          <p className="text-sm text-[var(--os-text-2)]">
            Supreme intelligence layer · governs all Kangqore subsystems · issues strategic directives
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] px-4 py-2 text-center">
            <p className="text-xl font-bold text-[var(--os-text-1)] font-mono">{registered}</p>
            <p className="text-[9px] text-[var(--os-text-2)] uppercase tracking-wider">Registered</p>
          </div>
          <div className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] px-4 py-2 text-center">
            <p className="text-xl font-bold text-green-500 font-mono">{operational}</p>
            <p className="text-[9px] text-[var(--os-text-2)] uppercase tracking-wider">Operational</p>
          </div>
          <div className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] px-4 py-2 text-center">
            <p className="text-xl font-bold text-[var(--os-blue)] font-mono">{directives.length}</p>
            <p className="text-[9px] text-[var(--os-text-2)] uppercase tracking-wider">Directives</p>
          </div>
        </div>
      </div>

      {/* Subsystem grid */}
      <div>
        <h2 className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider mb-3">
          Registered Subsystems
        </h2>
        {loadingSystems ? (
          <div className="flex items-center gap-2 text-sm text-[var(--os-text-2)] py-4">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading subsystems…
          </div>
        ) : systems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {systems.map(s => <SubsystemCard key={s.name} system={s} intel={intelMap[s.name]} />)}
          </div>
        ) : (
          <div className="text-sm text-[var(--os-text-2)] py-4">
            No subsystems registered yet — WAANDA Authority initialises on server boot.
          </div>
        )}
      </div>

      {/* Issue directive */}
      <div>
        <h2 className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider mb-3">
          CEO Override — Issue Directive
        </h2>
        <DirectivePanel />
      </div>

      {/* Directive log */}
      <div>
        <h2 className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider mb-3">
          Directive Log
        </h2>
        <div className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] p-5">
          {loadingDirectives ? (
            <div className="flex items-center gap-2 text-sm text-[var(--os-text-2)]">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading directives…
            </div>
          ) : (
            <DirectiveLogTable directives={directives} />
          )}
        </div>
      </div>

    </div>
  )
}
