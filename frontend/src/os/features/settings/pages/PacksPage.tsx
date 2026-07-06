import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Package, CheckCircle2, Download, Trash2, ChevronDown, ChevronRight,
  GitMerge, Workflow, Shield, Boxes, Globe, X, Bot, ShieldCheck
} from 'lucide-react'
import { apiFetch } from '../../../lib/api'
import { cn } from '@design-system/cn'

// ── Types ─────────────────────────────────────────────────────────────────────

type PackCategory = 'ONTOLOGY' | 'WORKFLOW' | 'POLICY' | 'AGENT' | 'INDUSTRY'

interface PackListing {
  packId: string
  name: string
  version: string
  description: string
  author: string
  category: PackCategory
  tags: string[]
  icon: string
  installed: boolean
  installedAt: string | null
  installedBy: string | null
  ontologyTypeCount: number
  workflowCount: number
  policyCount: number
  agentCount: number
  contents: {
    ontologyTypes: Array<{ name: string; displayName: string; description: string }>
    workflows: Array<{ name: string; description: string; triggerType: string; stepCount: number }>
    policies: Array<{ name: string; description?: string; trigger: string; effect: string; priority: number }>
    agents: Array<{ name: string; role: string; description?: string; maxLevel: number }>
  }
}

interface PackStats {
  total: number
  installed: number
  available: number
  byCategory: Record<string, number>
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const CAT_CONFIG: Record<PackCategory, { label: string; color: string; icon: React.ElementType }> = {
  ONTOLOGY: { label: 'Ontology',  color: '#579bfc', icon: Boxes    },
  WORKFLOW: { label: 'Workflow',  color: '#7c3aed', icon: Workflow  },
  POLICY:   { label: 'Policy',   color: '#e2445c', icon: Shield    },
  AGENT:    { label: 'Agent',    color: '#fdab3d', icon: GitMerge  },
  INDUSTRY: { label: 'Industry', color: '#00c875', icon: Globe     },
}

// ── Confirm Uninstall Modal ───────────────────────────────────────────────────

function UninstallModal({ pack, onClose, onDone }: { pack: PackListing; onClose: () => void; onDone: () => void }) {
  const mut = useMutation({
    mutationFn: () => apiFetch(`/admin/packs/${encodeURIComponent(pack.packId)}/uninstall`, { method: 'POST' }),
    onSuccess: () => { onDone(); onClose() },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-[var(--os-card)] border border-[var(--os-border)] rounded-xl w-full max-w-sm p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[var(--os-text-1)]">Uninstall Pack</h3>
          <button onClick={onClose}><X className="w-4 h-4 text-[var(--os-text-2)]" /></button>
        </div>
        <p className="text-sm text-[var(--os-text-2)] mb-4">
          Uninstalling <strong className="text-[var(--os-text-1)]">{pack.name}</strong> marks it as uninstalled but does{' '}
          <strong>not</strong> delete any data already created by this pack (ontology types, workflow definitions).
        </p>
        {mut.isError && <p className="text-xs text-[#e2445c] mb-3">{String((mut.error as any)?.message)}</p>}
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)]">Cancel</button>
          <button onClick={() => mut.mutate()} disabled={mut.isPending}
            className="px-4 py-2 text-sm rounded-lg bg-[#e2445c] text-white font-medium disabled:opacity-50">
            {mut.isPending ? 'Uninstalling…' : 'Uninstall'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Pack Card ─────────────────────────────────────────────────────────────────

function PackCard({ pack, onRefresh }: { pack: PackListing; onRefresh: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const [showUninstall, setShowUninstall] = useState(false)

  const catCfg = CAT_CONFIG[pack.category] ?? CAT_CONFIG.ONTOLOGY

  const install = useMutation({
    mutationFn: () => apiFetch(`/admin/packs/${encodeURIComponent(pack.packId)}/install`, { method: 'POST' }),
    onSuccess: onRefresh,
  })

  return (
    <>
      <div className={cn(
        'rounded-xl border bg-[var(--os-card)] overflow-hidden transition-all',
        pack.installed ? 'border-[#00c875]/30' : 'border-[var(--os-border)]'
      )}>
        {/* Header */}
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-start gap-4">
            <div className="text-3xl leading-none select-none">{pack.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-[var(--os-text-1)]">{pack.name}</h3>
                <span className="font-mono text-[10px] text-[var(--os-text-2)] border border-[var(--os-border)] px-1.5 py-0.5 rounded">{pack.version}</span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: `${catCfg.color}15`, color: catCfg.color }}>
                  <catCfg.icon className="w-3 h-3" />
                  {catCfg.label}
                </span>
                {pack.installed && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#00c875]/10 text-[#00c875]">
                    <CheckCircle2 className="w-3 h-3" />Installed
                  </span>
                )}
              </div>
              <p className="text-sm text-[var(--os-text-2)] mt-1 leading-relaxed">{pack.description}</p>
            </div>
          </div>

          {/* Tags */}
          {pack.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {pack.tags.map(tag => (
                <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[var(--os-text-2)]">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Content summary */}
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            {pack.ontologyTypeCount > 0 && (
              <span className="text-xs text-[var(--os-text-2)] flex items-center gap-1">
                <Boxes className="w-3.5 h-3.5" />
                {pack.ontologyTypeCount} ontology type{pack.ontologyTypeCount !== 1 ? 's' : ''}
              </span>
            )}
            {pack.workflowCount > 0 && (
              <span className="text-xs text-[var(--os-text-2)] flex items-center gap-1">
                <Workflow className="w-3.5 h-3.5" />
                {pack.workflowCount} workflow{pack.workflowCount !== 1 ? 's' : ''}
              </span>
            )}
            {pack.policyCount > 0 && (
              <span className="text-xs text-[var(--os-text-2)] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {pack.policyCount} polic{pack.policyCount !== 1 ? 'ies' : 'y'}
              </span>
            )}
            {pack.agentCount > 0 && (
              <span className="text-xs text-[var(--os-text-2)] flex items-center gap-1">
                <Bot className="w-3.5 h-3.5" />
                {pack.agentCount} agent{pack.agentCount !== 1 ? 's' : ''}
              </span>
            )}
            {pack.installed && pack.installedAt && (
              <span className="text-xs text-[var(--os-text-2)] ml-auto">Installed {fmt(pack.installedAt)}</span>
            )}
          </div>
        </div>

        {/* Expand / collapse content details */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-1.5 px-5 py-2 text-xs text-[var(--os-text-2)] hover:bg-[var(--os-surface-0)] border-t border-[var(--os-border)] transition-colors"
        >
          {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          {expanded ? 'Hide contents' : 'View contents'}
        </button>

        {expanded && (
          <div className="px-5 py-4 border-t border-[var(--os-border)] bg-[var(--os-surface-0)] space-y-4">
            {pack.contents.ontologyTypes.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[var(--os-text-2)] mb-2 flex items-center gap-1.5">
                  <Boxes className="w-3.5 h-3.5 text-[#579bfc]" />ONTOLOGY TYPES
                </p>
                <div className="space-y-2">
                  {pack.contents.ontologyTypes.map(t => (
                    <div key={t.name} className="flex items-start gap-2">
                      <span className="font-mono text-xs font-semibold text-[#579bfc] mt-0.5 shrink-0">{t.displayName}</span>
                      <span className="text-xs text-[var(--os-text-2)]">{t.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {pack.contents.workflows.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[var(--os-text-2)] mb-2 flex items-center gap-1.5">
                  <Workflow className="w-3.5 h-3.5 text-[#7c3aed]" />WORKFLOWS
                </p>
                <div className="space-y-2">
                  {pack.contents.workflows.map(w => (
                    <div key={w.name} className="flex items-start gap-2">
                      <span className="font-mono text-xs font-semibold text-[#7c3aed] mt-0.5 shrink-0 max-w-[180px] truncate">{w.name}</span>
                      <span className="text-xs text-[var(--os-text-2)] flex-1">{w.description}</span>
                      <span className="text-[10px] text-[var(--os-text-2)] shrink-0">{w.stepCount} steps · {w.triggerType}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {pack.contents.policies.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[var(--os-text-2)] mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#e2445c]" />POLICIES
                </p>
                <div className="space-y-2">
                  {pack.contents.policies.map(pol => (
                    <div key={pol.name} className="flex items-start gap-2">
                      <span className="font-mono text-xs font-semibold text-[#e2445c] mt-0.5 shrink-0 max-w-[200px] truncate">{pol.name}</span>
                      <span className="text-xs text-[var(--os-text-2)] flex-1">{pol.description}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          pol.effect === 'DENY'             ? 'bg-[#e2445c]/10 text-[#e2445c]'
                          : pol.effect === 'REQUIRE_APPROVAL' ? 'bg-[#fdab3d]/10 text-[#fdab3d]'
                          : pol.effect === 'NOTIFY'           ? 'bg-[#579bfc]/10 text-[#579bfc]'
                          : 'bg-[#00c875]/10 text-[#00c875]'
                        }`}>{pol.effect.replace('_', ' ')}</span>
                        <span className="text-[10px] text-[var(--os-text-2)]">on {pol.trigger}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {pack.contents.agents.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[var(--os-text-2)] mb-2 flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-[#fdab3d]" />AGENTS
                </p>
                <div className="space-y-2">
                  {pack.contents.agents.map(a => (
                    <div key={a.name} className="flex items-start gap-2">
                      <span className="font-mono text-xs font-semibold text-[#fdab3d] mt-0.5 shrink-0 max-w-[160px] truncate">{a.name}</span>
                      <span className="text-xs text-[var(--os-text-2)] flex-1">{a.description}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[var(--os-text-2)]">{a.role}</span>
                        <span className="text-[10px] text-[var(--os-text-2)]">L{a.maxLevel}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--os-border)] bg-[var(--os-surface-0)]">
          <span className="text-xs text-[var(--os-text-2)]">by {pack.author}</span>
          {pack.installed ? (
            <button
              onClick={() => setShowUninstall(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[#e2445c] hover:border-[#e2445c]/40 transition-colors"
            >
              <Trash2 className="w-3 h-3" />Uninstall
            </button>
          ) : (
            <button
              onClick={() => install.mutate()}
              disabled={install.isPending}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs rounded-lg bg-[#579bfc] text-white font-medium hover:bg-[#579bfc]/90 disabled:opacity-50"
            >
              <Download className="w-3 h-3" />
              {install.isPending ? 'Installing…' : 'Install'}
            </button>
          )}
        </div>
      </div>

      {showUninstall && (
        <UninstallModal pack={pack} onClose={() => setShowUninstall(false)} onDone={onRefresh} />
      )}
    </>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const CATEGORY_FILTERS: Array<{ key: PackCategory | 'ALL'; label: string }> = [
  { key: 'ALL',      label: 'All'      },
  { key: 'ONTOLOGY', label: 'Ontology' },
  { key: 'WORKFLOW', label: 'Workflow' },
  { key: 'POLICY',   label: 'Policy'   },
  { key: 'AGENT',    label: 'Agent'    },
  { key: 'INDUSTRY', label: 'Industry' },
]

export function PacksPage() {
  const qc = useQueryClient()
  const [categoryFilter, setCategoryFilter] = useState<PackCategory | 'ALL'>('ALL')

  const query = useQuery({
    queryKey: ['packs'],
    queryFn: () => apiFetch<{ packs: PackListing[]; stats: PackStats }>('/admin/packs'),
    refetchInterval: 60_000,
  })

  const refresh = () => qc.invalidateQueries({ queryKey: ['packs'] })

  const allPacks = query.data?.packs ?? []
  const stats    = query.data?.stats

  const packs = categoryFilter === 'ALL'
    ? allPacks
    : allPacks.filter(p => p.category === categoryFilter)

  const installedCount = allPacks.filter(p => p.installed).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-[var(--os-text-1)] flex items-center gap-2">
          <Package className="w-4 h-4 text-[#579bfc]" />
          Solution Packs
        </h2>
        <p className="text-sm text-[var(--os-text-2)] mt-0.5">
          Install pre-built ontology types, workflows, and configurations into your OS.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: 'Available',  value: stats?.total               ?? 0, bg: 'linear-gradient(135deg,#2564ea 0%,#579bfc 100%)', glow: '#2564ea' },
          { label: 'Installed',  value: installedCount,                  bg: 'linear-gradient(135deg,#00c875 0%,#00a86b 100%)', glow: '#00c875' },
          { label: 'Ontology',   value: stats?.byCategory?.ONTOLOGY  ?? 0, bg: 'linear-gradient(135deg,#2564ea 0%,#4ab6d4 100%)', glow: '#2564ea' },
          { label: 'Workflow',   value: stats?.byCategory?.WORKFLOW  ?? 0, bg: 'linear-gradient(135deg,#7c3aed 0%,#9d4edd 100%)', glow: '#7c3aed' },
          { label: 'Policy',     value: stats?.byCategory?.POLICY    ?? 0, bg: 'linear-gradient(135deg,#e2445c 0%,#c0392b 100%)', glow: '#e2445c' },
          { label: 'Agent',      value: stats?.byCategory?.AGENT     ?? 0, bg: 'linear-gradient(135deg,#fdab3d 0%,#f59e0b 100%)', glow: '#fdab3d' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 relative overflow-hidden" style={{ background: s.bg, boxShadow: `0 4px 16px ${s.glow}35` }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.28) 0%, transparent 60%)' }} />
            <p className="relative text-[9px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>{s.label}</p>
            <p className="relative text-2xl font-black" style={{ color: '#ffffff' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {CATEGORY_FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setCategoryFilter(f.key as PackCategory | 'ALL')}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
              categoryFilter === f.key
                ? 'bg-[#579bfc] text-white'
                : 'bg-[var(--os-surface-0)] text-[var(--os-text-2)] border border-[var(--os-border)] hover:text-[var(--os-text-1)]'
            )}
          >
            {f.label}
            {f.key !== 'ALL' && stats?.byCategory?.[f.key] != null && (
              <span className="ml-1 opacity-70">({stats.byCategory[f.key]})</span>
            )}
          </button>
        ))}
      </div>

      {/* Pack grid */}
      {query.isLoading && <p className="text-sm text-[var(--os-text-2)]">Loading packs…</p>}

      {!query.isLoading && packs.length === 0 && (
        <div className="rounded-xl border border-dashed border-[var(--os-border)] p-10 text-center">
          <Package className="w-8 h-8 text-[var(--os-text-2)] mx-auto mb-2" />
          <p className="text-sm text-[var(--os-text-2)]">No packs in this category</p>
        </div>
      )}

      {/* Installed first, then available */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...packs].sort((a, b) => (b.installed ? 1 : 0) - (a.installed ? 1 : 0)).map(p => (
          <PackCard key={p.packId} pack={p} onRefresh={refresh} />
        ))}
      </div>
    </div>
  )
}
