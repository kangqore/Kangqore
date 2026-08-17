import { useState, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Lightning, MagnifyingGlass, Play, Sparkle, Buildings, ChatText,
  GitBranch, Cloud, CurrencyDollar, Users, Brain, ArrowCounterClockwise,
  CheckCircle, Warning, Lock, Robot, Plugs, PlugsConnected, Envelope,
  SlackLogo, GithubLogo, Wrench,
} from '@phosphor-icons/react'
import { api } from '@lib/api'
import { ActionRunModal } from '../components/ActionRunModal'
import type { OntologyAction } from '../actionEngineService'

// ── Types ─────────────────────────────────────────────────────────────────────

interface LibraryAction {
  id: string
  name: string
  displayName: string
  description: string
  parameters: any[]
  allowedRoles: string[]
  toolCallable: boolean
  executions: number
  validationRuleCount: number
  effectCount: number
}

interface LibraryCategory {
  name: string
  displayName: string
  icon: string
  color: string
  description: string
  count: number
  totalExecutions: number
  toolCallableCount: number
  actions: LibraryAction[]
}

interface LibraryData {
  categories: LibraryCategory[]
  totalActions: number
  totalExecutions: number
  toolCallable: number
}

interface ConnectorStatus {
  configured: boolean
  vars: string[]
}

interface ConnectorHealthData {
  health: Record<string, ConnectorStatus>
  connectors: Array<{ name: string; actions: string[] }>
  configured: number
  total: number
}

// ── Icon map ──────────────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Enterprise: Buildings,
  Communication: ChatText,
  Engineering: GitBranch,
  Cloud,
  Finance: CurrencyDollar,
  HR: Users,
  AI: Brain,
}

// ── Stat tile ─────────────────────────────────────────────────────────────────

function StatTile({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-1)] p-4 flex flex-col gap-1">
      <div className="text-2xl font-bold text-[var(--os-text-0)] tabular-nums">{value}</div>
      <div className="text-xs font-semibold text-[var(--os-text-1)] uppercase tracking-wide">{label}</div>
      {sub && <div className="text-[10px] text-[var(--os-text-2)]">{sub}</div>}
    </div>
  )
}

// ── Role badge ────────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: string }) {
  const colour =
    role === 'ADMIN'     ? '#e2445c' :
    role === 'EXECUTIVE' ? '#9f72e8' :
    role === 'TEAM'      ? '#579bfc' :
    role === 'CLIENT'    ? '#00c875' : '#64748b'
  return (
    <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold"
      style={{ background: `${colour}22`, color: colour }}>
      {role}
    </span>
  )
}

// ── Action card ───────────────────────────────────────────────────────────────

function ActionCard({
  action, categoryColor, onRun,
}: { action: LibraryAction; categoryColor: string; onRun: (a: OntologyAction) => void }) {
  const [expanded, setExpanded] = useState(false)
  const requiredParams = action.parameters.filter((p: any) => p.required).length
  const optionalParams = action.parameters.length - requiredParams

  return (
    <div
      className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-1)] overflow-hidden transition-all"
      style={{ borderLeftColor: expanded ? categoryColor : undefined, borderLeftWidth: expanded ? '3px' : undefined }}
    >
      {/* Header row */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-[var(--os-surface-2)] transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-[var(--os-text-0)] truncate">{action.displayName}</span>
            {action.toolCallable && (
              <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold"
                style={{ background: '#b05ef722', color: '#b05ef7' }}>
                <Robot className="w-3 h-3" /> AI
              </span>
            )}
          </div>
          <p className="text-[11px] text-[var(--os-text-2)] leading-relaxed line-clamp-2">{action.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] text-[var(--os-text-2)]">
              {action.parameters.length} param{action.parameters.length !== 1 ? 's' : ''}
            </span>
            {action.validationRuleCount > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] text-amber-400">
                <CheckCircle className="w-3 h-3" /> {action.validationRuleCount} rule{action.validationRuleCount !== 1 ? 's' : ''}
              </span>
            )}
            {action.executions > 0 && (
              <span className="text-[10px] text-[var(--os-text-2)]">
                {action.executions.toLocaleString()} run{action.executions !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {action.allowedRoles.slice(0, 2).map(r => <RoleBadge key={r} role={r} />)}
          {action.allowedRoles.length > 2 && (
            <span className="text-[10px] text-[var(--os-text-2)]">+{action.allowedRoles.length - 2}</span>
          )}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-[var(--os-border)] px-4 pb-4 pt-3 space-y-3">
          {/* Parameters */}
          {action.parameters.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-[var(--os-text-2)] uppercase tracking-wide mb-2">Parameters</div>
              <div className="space-y-1.5">
                {action.parameters.map((p: any) => (
                  <div key={p.name} className="flex items-start gap-2">
                    <span className="text-[10px] font-mono font-semibold text-[var(--os-text-1)] w-36 flex-shrink-0">{p.name}</span>
                    <span className="text-[10px] rounded px-1 py-0.5 font-mono flex-shrink-0"
                      style={{ background: `${categoryColor}22`, color: categoryColor }}>{p.type}</span>
                    {p.required && (
                      <span className="text-[10px] text-[var(--os-text-2)] flex-shrink-0">required</span>
                    )}
                    {p.description && (
                      <span className="text-[10px] text-[var(--os-text-2)]">{p.description}</span>
                    )}
                    {p.enum && (
                      <span className="text-[10px] text-[var(--os-text-2)] truncate">
                        [{p.enum.join(', ')}]
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action name + governance info */}
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-[var(--os-text-2)]">{action.name}</span>
            {action.toolCallable && (
              <span className="text-[10px] text-[var(--os-text-2)] flex items-center gap-1">
                <Robot className="w-3 h-3 text-[#b05ef7]" /> KIMMP can invoke
              </span>
            )}
            {action.validationRuleCount > 0 && (
              <span className="text-[10px] text-amber-400 flex items-center gap-1">
                <Warning className="w-3 h-3" /> {action.validationRuleCount} governance rule{action.validationRuleCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Execute button */}
          <button
            onClick={() => onRun(action as unknown as OntologyAction)}
            className="flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-semibold transition-colors text-white"
            style={{ background: categoryColor }}
          >
            <Play className="w-3.5 h-3.5" /> Execute
          </button>
        </div>
      )}
    </div>
  )
}

// ── Connector panel ───────────────────────────────────────────────────────────

const CONNECTOR_META: Record<string, { label: string; Icon: React.ElementType; color: string }> = {
  slack:       { label: 'Slack',       Icon: SlackLogo,       color: '#4A154B' },
  teams:       { label: 'Teams',       Icon: ChatText,        color: '#6264A7' },
  github:      { label: 'GitHub',      Icon: GithubLogo,      color: '#24292F' },
  email:       { label: 'Email',       Icon: Envelope,        color: '#00875A' },
  engineering: { label: 'Engineering', Icon: Wrench,          color: '#e2445c' },
}

function ConnectorPanel({ data }: { data: ConnectorHealthData }) {
  const connectors = Object.entries(data.health)
  const configuredCount = data.configured

  return (
    <div className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-1)] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <PlugsConnected className="w-4 h-4 text-[var(--os-text-2)]" />
          <span className="text-xs font-semibold text-[var(--os-text-1)]">Integration Connectors</span>
        </div>
        <span className="text-[10px] text-[var(--os-text-2)]">
          {configuredCount}/{data.total} configured
        </span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {connectors.map(([key, status]) => {
          const meta = CONNECTOR_META[key]
          if (!meta) return null
          const { label, Icon, color } = meta
          return (
            <div
              key={key}
              className="flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center"
              style={{
                borderColor: status.configured ? `${color}55` : 'var(--os-border)',
                background: status.configured ? `${color}11` : undefined,
              }}
            >
              <Icon
                className="w-5 h-5"
                style={{ color: status.configured ? color : 'var(--os-text-2)' }}
              />
              <span className="text-[10px] font-semibold" style={{ color: status.configured ? color : 'var(--os-text-2)' }}>
                {label}
              </span>
              {status.configured ? (
                <span className="flex items-center gap-0.5 text-[9px] text-emerald-400">
                  <CheckCircle className="w-2.5 h-2.5" weight="fill" /> Live
                </span>
              ) : (
                <span className="text-[9px] text-[var(--os-text-2)]">{status.vars[0]}</span>
              )}
            </div>
          )
        })}
      </div>
      {configuredCount === 0 && (
        <p className="text-[10px] text-[var(--os-text-2)] mt-3">
          Add env vars to your <span className="font-mono">.env</span> file to enable live delivery.
          Actions still execute, audit, and govern — connectors add real-world delivery on top.
        </p>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ActionLibraryPage() {
  const qc = useQueryClient()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [runAction, setRunAction] = useState<OntologyAction | null>(null)

  const { data, isLoading, error } = useQuery<LibraryData>({
    queryKey: ['action-library'],
    queryFn: () => api.get('/admin/ontology/actions/library').then(r => r.data),
  })

  const { data: connectorData } = useQuery<ConnectorHealthData>({
    queryKey: ['action-connectors'],
    queryFn: () => api.get('/admin/ontology/actions/connectors').then(r => r.data),
  })

  const seedMutation = useMutation({
    mutationFn: () => api.post('/admin/ontology/actions/library/seed'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['action-library'] }),
  })

  const filtered = useMemo(() => {
    if (!data) return []
    const q = search.toLowerCase()
    return data.categories
      .filter(c => !activeCategory || c.name === activeCategory)
      .map(c => ({
        ...c,
        actions: c.actions.filter(a =>
          !q ||
          a.displayName.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
        ),
      }))
      .filter(c => c.actions.length > 0)
  }, [data, activeCategory, search])

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 rounded-full border-2 border-[var(--os-text-2)] border-t-[var(--os-text-0)] animate-spin" />
    </div>
  )

  if (error || !data) return (
    <div className="p-6">
      <p className="text-sm text-red-400">Failed to load action library</p>
    </div>
  )

  const isEmpty = data.totalActions === 0

  return (
    <div className="p-6 space-y-6 max-w-6xl">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Lightning className="w-5 h-5 text-[#fdcb2f]" weight="fill" />
            <h1 className="text-lg font-bold text-[var(--os-text-0)]">Action Library</h1>
          </div>
          <p className="text-sm text-[var(--os-text-2)] max-w-xl">
            Enterprise execution fabric — {data.totalActions} governed actions across {data.categories.length} categories.
            Every action is typed, validated, permission-aware, idempotent, and audited.
          </p>
        </div>
        <button
          onClick={() => seedMutation.mutate()}
          disabled={seedMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold bg-[var(--os-surface-2)] border border-[var(--os-border)] text-[var(--os-text-1)] hover:text-[var(--os-text-0)] transition-colors disabled:opacity-50"
        >
          <ArrowCounterClockwise className={`w-3.5 h-3.5 ${seedMutation.isPending ? 'animate-spin' : ''}`} />
          {seedMutation.isPending ? 'Seeding…' : seedMutation.isSuccess ? 'Seeded' : 'Seed Library'}
        </button>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-4 gap-3">
        <StatTile label="Actions" value={data.totalActions} sub="defined in library" />
        <StatTile label="Categories" value={data.categories.length} sub="Enterprise · AI · Cloud · …" />
        <StatTile label="AI-Callable" value={data.toolCallable} sub="KIMMP can invoke" />
        <StatTile label="Executions" value={data.totalExecutions.toLocaleString()} sub="all-time runs" />
      </div>

      {/* Connector health */}
      {connectorData && <ConnectorPanel data={connectorData} />}

      {/* Seed prompt when empty */}
      {isEmpty && (
        <div className="rounded-2xl border border-dashed border-[var(--os-border)] p-8 text-center">
          <Sparkle className="w-8 h-8 text-[var(--os-text-2)] mx-auto mb-3" />
          <p className="text-sm font-semibold text-[var(--os-text-1)] mb-1">Library not seeded yet</p>
          <p className="text-xs text-[var(--os-text-2)] mb-4">
            Click "Seed Library" to load all {' '}
            <span className="font-semibold text-[var(--os-text-1)]">37 governed actions</span>
            {' '}across 7 categories.
          </p>
          <button
            onClick={() => seedMutation.mutate()}
            disabled={seedMutation.isPending}
            className="px-4 py-2 rounded-2xl text-sm font-semibold text-white bg-[#579bfc] hover:bg-[#4a8ae8] transition-colors disabled:opacity-50"
          >
            {seedMutation.isPending ? 'Seeding…' : 'Seed Library'}
          </button>
        </div>
      )}

      {!isEmpty && (
        <>
          {/* Category pills + search */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-shrink-0">
              <MagnifyingGlass className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--os-text-2)]" />
              <input
                className="pl-7 pr-3 py-1.5 rounded-2xl text-xs bg-[var(--os-surface-1)] border border-[var(--os-border)] text-[var(--os-text-1)] outline-none w-48 focus:border-[var(--os-text-2)]"
                placeholder="Search actions…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-1.5 rounded-2xl text-xs font-semibold transition-colors ${!activeCategory ? 'bg-[var(--os-text-0)] text-[var(--os-bg)]' : 'bg-[var(--os-surface-1)] border border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'}`}
            >
              All
            </button>

            {data.categories.map(cat => {
              const Icon = CATEGORY_ICONS[cat.name] ?? Lightning
              const isActive = activeCategory === cat.name
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(isActive ? null : cat.name)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold transition-all border"
                  style={{
                    background: isActive ? `${cat.color}22` : undefined,
                    borderColor: isActive ? cat.color : 'var(--os-border)',
                    color: isActive ? cat.color : 'var(--os-text-2)',
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.displayName}
                  <span className="opacity-60">{cat.count}</span>
                </button>
              )
            })}
          </div>

          {/* Action grids by category */}
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-sm text-[var(--os-text-2)]">No actions match "{search}"</div>
          ) : (
            <div className="space-y-8">
              {filtered.map(cat => {
                const Icon = CATEGORY_ICONS[cat.name] ?? Lightning
                return (
                  <section key={cat.name}>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="w-4 h-4 flex-shrink-0" style={{ color: cat.color }} />
                      <h2 className="text-sm font-bold text-[var(--os-text-0)]">{cat.displayName}</h2>
                      <span className="text-xs text-[var(--os-text-2)]">— {cat.description}</span>
                      <span className="ml-auto text-[10px] text-[var(--os-text-2)] flex items-center gap-1">
                        <Lock className="w-3 h-3" /> all actions governed · audited
                      </span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {cat.actions.map(action => (
                        <ActionCard
                          key={action.id}
                          action={action}
                          categoryColor={cat.color}
                          onRun={a => setRunAction(a)}
                        />
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* Execute modal */}
      {runAction && (
        <ActionRunModal
          action={runAction}
          onClose={() => setRunAction(null)}
          onSuccess={() => {
            qc.invalidateQueries({ queryKey: ['action-library'] })
            setRunAction(null)
          }}
        />
      )}
    </div>
  )
}
