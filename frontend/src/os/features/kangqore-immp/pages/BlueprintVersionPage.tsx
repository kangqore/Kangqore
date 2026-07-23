import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  GitBranch, RotateCcw, Plus, Minus, ArrowRight,
  ChevronDown, ChevronRight, Loader2, FileJson,
} from 'lucide-react'
import { api } from '@lib/api'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'
const GREEN = '#10b981'
const AMBER = '#f59e0b'
const BLUE  = '#3b82f6'
const RED   = '#ef4444'
const PURP  = '#7c3aed'

interface Blueprint {
  id:             string
  customerName:   string
  version:        string
  planTier:       string
  industry:       string | null
  oisBaseline:    number | null
  oisTarget:      number | null
  status:         string
  deployedAt:     string | null
  enabledModules: string[]
}

interface HistoryEntry {
  version:        string
  planTier:       string
  oisTarget:      number | null
  enabledModules: string[]
  bumpedAt:       string
  bumpedBy:       string
}

function diffModules(prev: string[], next: string[]) {
  const added   = next.filter(m => !prev.includes(m))
  const removed = prev.filter(m => !next.includes(m))
  const kept    = next.filter(m => prev.includes(m))
  return { added, removed, kept }
}

function VersionBadge({ v, color }: { v: string; color: string }) {
  return (
    <span style={{ fontSize: 9, fontWeight: 900, padding: '2px 7px', borderRadius: 4, background: color + '15', color, border: `1px solid ${color}25`, fontFamily: 'monospace' }}>
      v{v}
    </span>
  )
}

function DiffRow({ label, prev, next, color }: { label: string; prev: string; next: string; color: string }) {
  if (prev === next) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: `1px solid ${BDR}`, fontSize: 11 }}>
      <span style={{ color: T2, minWidth: 90 }}>{label}</span>
      <span style={{ color: T2 }}>{prev}</span>
      <ArrowRight style={{ width: 10, height: 10, color: T2, flexShrink: 0 }} />
      <span style={{ color, fontWeight: 700 }}>{next}</span>
    </div>
  )
}

function BumpForm({ bp, onDone }: { bp: Blueprint; onDone: () => void }) {
  const qc = useQueryClient()
  const [tier,    setTier]    = useState(bp.planTier)
  const [oisT,    setOisT]    = useState(String(bp.oisTarget ?? 75))
  const [modules, setModules] = useState<string[]>(bp.enabledModules ?? [])

  const ALL_MODULES = ['projects', 'finance', 'sales', 'hr', 'leadership', 'marketing', 'operations', 'analytics']

  const bump = useMutation({
    mutationFn: () => api.post(`/admin/kangqore-immp/customers/blueprints/${bp.id}/version-bump`, {
      planTier:       tier,
      oisTarget:      parseFloat(oisT),
      enabledModules: modules,
    }).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['blueprint-versions'] }); onDone() },
  })

  const diff  = diffModules(bp.enabledModules, modules)
  const hasChanges = tier !== bp.planTier || parseFloat(oisT) !== (bp.oisTarget ?? 75) || diff.added.length > 0 || diff.removed.length > 0

  return (
    <div style={{ padding: '14px 16px', background: BLUE + '04', border: `1px solid ${BLUE}20`, borderRadius: 10, marginBottom: 10 }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: BLUE, textTransform: 'uppercase', letterSpacing: '.09em', marginBottom: 12 }}>
        Bump Blueprint — {bp.customerName} (current v{bp.version})
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <div>
          <label style={{ fontSize: 9, fontWeight: 700, color: T2, textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 3 }}>Plan Tier</label>
          <select value={tier} onChange={e => setTier(e.target.value)}
            style={{ width: '100%', background: CARD, border: `1px solid ${BDR}`, borderRadius: 7, padding: '7px 10px', fontSize: 11, color: T1, outline: 'none', boxSizing: 'border-box' }}>
            {['STARTER', 'PRO', 'ENTERPRISE'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 9, fontWeight: 700, color: T2, textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 3 }}>OIS Target</label>
          <input type="number" value={oisT} onChange={e => setOisT(e.target.value)}
            style={{ width: '100%', background: CARD, border: `1px solid ${BDR}`, borderRadius: 7, padding: '7px 10px', fontSize: 11, color: T1, outline: 'none', boxSizing: 'border-box' }} />
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 9, fontWeight: 700, color: T2, textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 6 }}>Modules</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {ALL_MODULES.map(m => {
            const active = modules.includes(m)
            return (
              <button key={m} onClick={() => setModules(prev => active ? prev.filter(x => x !== m) : [...prev, m])}
                style={{ padding: '4px 10px', borderRadius: 7, fontSize: 10, fontWeight: 700, cursor: 'pointer', border: `1px solid ${active ? GREEN : BDR}`, background: active ? GREEN + '12' : CARD, color: active ? GREEN : T2 }}>
                {active ? <Plus style={{ width: 8, height: 8, display: 'inline', marginRight: 3 }} /> : <Minus style={{ width: 8, height: 8, display: 'inline', marginRight: 3 }} />}
                {m}
              </button>
            )
          })}
        </div>
      </div>

      {/* Live diff preview */}
      {hasChanges && (
        <div style={{ marginBottom: 12, padding: '10px 12px', borderRadius: 8, background: SURF, border: `1px solid ${BDR}` }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: T2, textTransform: 'uppercase', letterSpacing: '.09em', marginBottom: 8 }}>Diff preview</div>
          <DiffRow label="Plan Tier" prev={bp.planTier} next={tier} color={BLUE} />
          <DiffRow label="OIS Target" prev={String(bp.oisTarget ?? '—')} next={oisT} color={GREEN} />
          {diff.added.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 0', fontSize: 11, color: T2 }}>
              <Plus style={{ width: 10, height: 10, color: GREEN }} />
              <span style={{ color: GREEN, fontWeight: 700 }}>Added: {diff.added.join(', ')}</span>
            </div>
          )}
          {diff.removed.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 0', fontSize: 11, color: T2 }}>
              <Minus style={{ width: 10, height: 10, color: RED }} />
              <span style={{ color: RED, fontWeight: 700 }}>Removed: {diff.removed.join(', ')}</span>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => bump.mutate()} disabled={!hasChanges || bump.isPending}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', background: BLUE, color: '#fff', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', opacity: !hasChanges || bump.isPending ? 0.5 : 1 }}>
          {bump.isPending ? <Loader2 style={{ width: 11, height: 11, animation: 'spin 1s linear infinite' }} /> : <GitBranch style={{ width: 11, height: 11 }} />}
          {bump.isPending ? 'Bumping…' : `Bump to v${incrementVersion(bp.version)}`}
        </button>
        <button onClick={onDone}
          style={{ padding: '8px 12px', background: SURF, border: `1px solid ${BDR}`, borderRadius: 8, fontSize: 11, cursor: 'pointer', color: T2 }}>
          Cancel
        </button>
      </div>
      {bump.isError && <p style={{ fontSize: 10, color: RED, marginTop: 6 }}>{(bump.error as any)?.response?.data?.error ?? 'Failed'}</p>}
    </div>
  )
}

function incrementVersion(v: string): string {
  const parts = v.split('.').map(Number)
  parts[parts.length - 1] = (parts[parts.length - 1] ?? 0) + 1
  return parts.join('.')
}

export function BlueprintVersionPage() {
  const qc = useQueryClient()
  const [selected, setSelected] = useState<string | null>(null)
  const [showBump, setShowBump]  = useState<string | null>(null)
  const [expanded, setExpanded]  = useState<string | null>(null)

  const bpQuery = useQuery<{ blueprints: Blueprint[] }>({
    queryKey: ['blueprint-versions'],
    queryFn:  () => api.get('/admin/kangqore-immp/customers/blueprints').then(r => r.data),
    staleTime: 30_000,
  })

  const historyQuery = useQuery<{ history: HistoryEntry[]; currentVersion: string }>({
    queryKey: ['blueprint-history', selected],
    queryFn:  () => api.get(`/admin/kangqore-immp/customers/blueprints/${selected}/history`).then(r => r.data),
    enabled:  !!selected,
    staleTime: 60_000,
  })

  const rollback = useMutation({
    mutationFn: (toVersion: string) => api.post(`/admin/kangqore-immp/customers/blueprints/${selected}/rollback`, { toVersion }).then(r => r.data),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['blueprint-versions'] }); qc.invalidateQueries({ queryKey: ['blueprint-history'] }) },
  })

  const blueprints = bpQuery.data?.blueprints ?? []
  const history    = historyQuery.data?.history ?? []
  const currentBp  = blueprints.find(b => b.id === selected)

  return (
    <div style={{ maxWidth: 900 }} className="space-y-5">

      {/* Header */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: T1, margin: 0, letterSpacing: '-.02em' }}>Blueprint Versioning</h2>
        <p style={{ fontSize: 11, color: T2, marginTop: 4 }}>Bump and diff customer blueprint specs. Each version bump stores the previous state for rollback.</p>
      </div>

      {/* Blueprint picker */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
        {blueprints.map(bp => (
          <button key={bp.id} onClick={() => { setSelected(bp.id); setShowBump(null) }}
            style={{ padding: '10px 14px', borderRadius: 10, border: `1px solid ${selected === bp.id ? BLUE : BDR}`, background: selected === bp.id ? BLUE + '08' : CARD, cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T1, marginBottom: 3 }}>{bp.customerName}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <VersionBadge v={bp.version} color={BLUE} />
              <span style={{ fontSize: 9, color: T2 }}>{bp.planTier}</span>
            </div>
          </button>
        ))}
      </div>

      {currentBp && (
        <>
          {/* Current spec summary */}
          <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileJson style={{ width: 13, height: 13, color: BLUE }} />
                <span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>{currentBp.customerName}</span>
                <VersionBadge v={currentBp.version} color={BLUE} />
              </div>
              {showBump === currentBp.id
                ? null
                : <button onClick={() => setShowBump(currentBp.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: BLUE, color: '#fff', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                    <GitBranch style={{ width: 11, height: 11 }} /> Bump Version
                  </button>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 12 }}>
              {[
                { label: 'Tier',        value: currentBp.planTier,                      color: PURP },
                { label: 'OIS Baseline',value: currentBp.oisBaseline?.toFixed(1) ?? '—', color: T2   },
                { label: 'OIS Target',  value: currentBp.oisTarget?.toFixed(1) ?? '—',  color: GREEN },
                { label: 'Modules',     value: String(currentBp.enabledModules.length),  color: BLUE  },
              ].map(f => (
                <div key={f.label} style={{ textAlign: 'center', padding: '8px', borderRadius: 8, background: SURF }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: f.color, fontVariantNumeric: 'tabular-nums' }}>{f.value}</div>
                  <div style={{ fontSize: 9, color: T2 }}>{f.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {currentBp.enabledModules.map(m => (
                <span key={m} style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: GREEN + '10', color: GREEN, border: `1px solid ${GREEN}20` }}>{m}</span>
              ))}
            </div>

            {showBump === currentBp.id && (
              <div style={{ marginTop: 14 }}>
                <BumpForm bp={currentBp} onDone={() => setShowBump(null)} />
              </div>
            )}
          </div>

          {/* Version history */}
          <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BDR}`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <GitBranch style={{ width: 13, height: 13, color: AMBER }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: T1 }}>Version History</span>
              {historyQuery.isLoading && <Loader2 style={{ width: 11, height: 11, color: T2, animation: 'spin 1s linear infinite' }} />}
            </div>

            {history.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: T2, fontSize: 11 }}>
                No previous versions — current v{currentBp.version} is the baseline.
              </div>
            ) : (
              history.map((h, i) => {
                const next = i === 0 ? currentBp : history[i - 1] as any
                const diff = diffModules(h.enabledModules, next.enabledModules ?? [])
                const open = expanded === h.version
                return (
                  <div key={h.version} style={{ borderBottom: `1px solid ${BDR}` }}>
                    <button onClick={() => setExpanded(open ? null : h.version)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}>
                      {open
                        ? <ChevronDown style={{ width: 12, height: 12, color: T2 }} />
                        : <ChevronRight style={{ width: 12, height: 12, color: T2 }} />}
                      <VersionBadge v={h.version} color={AMBER} />
                      <span style={{ fontSize: 11, color: T2, marginLeft: 4 }}>
                        Bumped {new Date(h.bumpedAt).toLocaleDateString()} by {h.bumpedBy}
                      </span>
                      <span style={{ marginLeft: 'auto', fontSize: 10, color: T2 }}>{h.planTier} · OIS target {h.oisTarget ?? '—'}</span>
                      <button onClick={e => { e.stopPropagation(); rollback.mutate(h.version) }}
                        disabled={rollback.isPending}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: AMBER + '10', color: AMBER, border: `1px solid ${AMBER}25`, borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'pointer', opacity: rollback.isPending ? 0.5 : 1 }}>
                        <RotateCcw style={{ width: 9, height: 9 }} /> Rollback
                      </button>
                    </button>

                    {open && (
                      <div style={{ padding: '8px 16px 14px 44px' }}>
                        <DiffRow label="Tier"       prev={h.planTier}              next={next.planTier ?? h.planTier}  color={BLUE}  />
                        <DiffRow label="OIS Target" prev={String(h.oisTarget ?? '—')} next={String(next.oisTarget ?? '—')} color={GREEN} />
                        {diff.added.length > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 0', fontSize: 11, color: T2 }}>
                            <Plus style={{ width: 10, height: 10, color: GREEN }} />
                            <span style={{ color: GREEN }}>Added in next: {diff.added.join(', ')}</span>
                          </div>
                        )}
                        {diff.removed.length > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 0', fontSize: 11, color: T2 }}>
                            <Minus style={{ width: 10, height: 10, color: RED }} />
                            <span style={{ color: RED }}>Removed in next: {diff.removed.join(', ')}</span>
                          </div>
                        )}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
                          {h.enabledModules.map(m => (
                            <span key={m} style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: SURF, color: T2, border: `1px solid ${BDR}` }}>{m}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
