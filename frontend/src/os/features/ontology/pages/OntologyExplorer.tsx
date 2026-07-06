import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  Cube, Lightning, Briefcase, Kanban, Truck, Receipt, FileText,
  User, Warning, Plus, ArrowRight, Sparkle, Play, CheckCircle,
} from '@phosphor-icons/react'
import { api } from '@lib/api'

const ICON_MAP: Record<string, React.ElementType> = {
  Briefcase, Kanban, Lightning, Truck, Receipt, FileText, User, Warning, Cube,
}

const CLASS_COLORS: Record<string, string> = {
  PUBLIC:       'bg-green-500/10 text-green-400 border-green-500/20',
  INTERNAL:     'bg-blue-500/10 text-blue-400 border-blue-500/20',
  CONFIDENTIAL: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  SECRET:       'bg-red-500/10 text-red-400 border-red-500/20',
}

function TypeCard({ type }: { type: any }) {
  const Icon = ICON_MAP[type.icon] ?? Cube
  const color = type.color ?? '#6366f1'

  return (
    <Link
      to={`/kangqore-view/admin/ontology/objects?typeId=${type.id}`}
      className="os-card p-5 hover:border-[var(--os-accent)] transition-all group flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}20`, border: `1px solid ${color}40` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <ArrowRight
          size={14}
          className="text-[var(--os-text-2)] opacity-0 group-hover:opacity-100 transition-opacity mt-1"
        />
      </div>

      <div>
        <p className="text-sm font-bold text-[var(--os-text-1)]">{type.displayName}</p>
        {type.description && (
          <p className="text-[11px] text-[var(--os-text-2)] mt-0.5 leading-relaxed line-clamp-2">
            {type.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 pt-3 border-t border-[var(--os-border)]">
        <span className="text-[10px] text-[var(--os-text-2)]">
          <span className="font-bold text-[var(--os-text-1)]">{type._count?.instances ?? 0}</span> objects
        </span>
        <span className="text-[var(--os-border)]">·</span>
        <span className="text-[10px] text-[var(--os-text-2)]">
          <span className="font-bold text-[var(--os-text-1)]">{type._count?.actions ?? 0}</span> actions
        </span>
      </div>
    </Link>
  )
}

export function OntologyExplorer() {
  const qc = useQueryClient()
  const [seeded, setSeeded] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['ontology-types'],
    queryFn: () => api.get('/admin/ontology/types').then(r => r.data),
  })

  const seed = useMutation({
    mutationFn: () => api.post('/admin/ontology/types/seed', {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ontology-types'] })
      setSeeded(true)
    },
  })

  const types: any[] = data?.types ?? []
  const totalObjects = types.reduce((s: number, t: any) => s + (t._count?.instances ?? 0), 0)
  const totalActions = types.reduce((s: number, t: any) => s + (t._count?.actions ?? 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-black text-[var(--os-text-1)]">Kangqore Ontology</h2>
          <p className="text-xs text-[var(--os-text-2)] mt-0.5">
            Semantic digital twin of the enterprise — governed business objects AI agents interact with.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {types.length === 0 && !isLoading && (
            <button
              onClick={() => seed.mutate()}
              disabled={seed.isPending || seeded}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--os-accent)] text-white text-xs font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {seeded ? <CheckCircle size={13} weight="bold" /> : <Sparkle size={13} />}
              {seeded ? 'Seeded' : 'Seed defaults'}
            </button>
          )}
          <Link
            to="/kangqore-view/admin/ontology/lineage"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--os-text-2)] hover:text-[var(--os-text-1)] border border-[var(--os-border)] hover:border-[var(--os-accent)] transition-all"
          >
            Data Lineage
          </Link>
          <Link
            to="/kangqore-view/admin/ontology/markings"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--os-text-2)] hover:text-[var(--os-text-1)] border border-[var(--os-border)] hover:border-[var(--os-accent)] transition-all"
          >
            MBAC Markings
          </Link>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Object Types',  value: types.length,  bg: 'linear-gradient(135deg,#2564ea 0%,#4ab6d4 100%)', glow: '#2564ea' },
          { label: 'Total Objects', value: totalObjects,  bg: 'linear-gradient(135deg,#7c3aed 0%,#9d4edd 100%)', glow: '#7c3aed' },
          { label: 'Actions',       value: totalActions,  bg: 'linear-gradient(135deg,#00c875 0%,#00a86b 100%)', glow: '#00c875' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-5 relative overflow-hidden" style={{ background: s.bg, boxShadow: `0 4px 20px ${s.glow}40` }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.30) 0%, transparent 60%)' }} />
            <p className="relative text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>{s.label}</p>
            <p className="relative text-3xl font-black tracking-tight" style={{ color: '#ffffff' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Type grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="os-card p-5 h-36 animate-pulse bg-[var(--os-surface-0)]" />
          ))}
        </div>
      ) : types.length === 0 ? (
        <div className="os-card p-12 flex flex-col items-center gap-3 text-center">
          <Cube size={32} className="text-[var(--os-text-2)]" />
          <p className="text-sm text-[var(--os-text-1)] font-semibold">No object types yet</p>
          <p className="text-xs text-[var(--os-text-2)]">Click "Seed defaults" to initialise Kangqore's core business objects.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {types.map((t: any) => <TypeCard key={t.id} type={t} />)}
        </div>
      )}

      {/* Actions panel */}
      {types.length > 0 && <ActionsPanel />}
    </div>
  )
}

function ActionsPanel() {
  const { data, isLoading } = useQuery({
    queryKey: ['ontology-actions'],
    queryFn: () => api.get('/admin/ontology/actions').then(r => r.data),
  })
  const qc = useQueryClient()

  const execute = useMutation({
    mutationFn: (actionId: string) => api.post(`/admin/ontology/actions/${actionId}/execute`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ontology-actions'] }),
  })

  const actions: any[] = data?.actions ?? []
  if (isLoading || actions.length === 0) return null

  return (
    <div className="os-card overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[var(--os-border)]">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--os-text-2)]">
          Kinetic Actions
        </p>
        <p className="text-[10px] text-[var(--os-text-2)] mt-0.5">
          Governed mutations callable on Ontology objects — security and logic enforced at the action layer.
        </p>
      </div>
      <div className="divide-y divide-[var(--os-border)]">
        {actions.slice(0, 10).map((a: any) => (
          <div key={a.id} className="px-5 py-3 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[var(--os-text-1)]">{a.displayName}</p>
              <p className="text-[10px] text-[var(--os-text-2)] mt-0.5">
                {a.type?.displayName} · {a.executions} executions
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {(a.allowedRoles ?? []).map((r: string) => (
                <span key={r} className="text-[9px] bg-[var(--os-surface-0)] border border-[var(--os-border)] px-1.5 py-0.5 rounded font-mono">
                  {r}
                </span>
              ))}
            </div>
            <button
              onClick={() => execute.mutate(a.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] hover:border-[var(--os-accent)] text-[11px] font-semibold text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-all"
            >
              <Play size={11} weight="fill" /> Execute
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
