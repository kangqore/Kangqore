import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  useDroppable, useDraggable, type DragStartEvent, type DragEndEvent,
} from '@dnd-kit/core'
import {
  Plus, X, Check, AlertTriangle, Minus, Mail, Clock,
  LayoutGrid, Rows3, EyeOff, Eye, ChevronRight,
} from 'lucide-react'
import { api } from '@lib/api'
import { useClientsStore } from '../store'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'

interface ClientCard {
  id: string; name: string; industry: string | null
  tier: string; health: string; status: string; stage: string
  contact: { name: string; email: string; role: string } | null
  accountManager: string | null
  userId: string | null; hasPortalAccess: boolean
  daysInOnboarding: number | null
}
interface Group { id: string; label: string; color: string; description: string; items: ClientCard[] }
interface Board { groups: Group[]; total: number; inProgress: number }
interface Effect { step: string; status: 'DONE' | 'SKIPPED' | 'FAILED'; detail: string }

const TIER_COLOR: Record<string, string> = {
  strategic: '#7c3aed', enterprise: '#579bfc', standard: '#14b8a6', starter: '#94a3b8',
}
const HEALTH_COLOR: Record<string, string> = {
  excellent: '#10b981', good: '#10b981', 'at-risk': '#f59e0b', critical: '#ef4444',
}

/** Shared by board cards and table rows so a client reads the same either way. */
function useOpenClient() {
  const navigate = useNavigate()
  const setSelected = useClientsStore(s => s.setSelected)
  return (id: string) => {
    setSelected(id)
    navigate('/kangqore-view/admin/clients/profile')
  }
}

function Card({ c, dragging, onOpen }: { c: ClientCard; dragging?: boolean; onOpen?: (id: string) => void }) {
  return (
    <div
      className="rounded-lg p-2.5 select-none group"
      style={{ background: CARD, border: `1px solid ${BDR}`, opacity: dragging ? 0.4 : 1 }}
    >
      <div className="flex items-start justify-between gap-1.5">
        {/* Only the title opens the client — the rest of the card stays grabbable. */}
        <button
          onPointerDown={e => e.stopPropagation()}
          onClick={e => { e.stopPropagation(); onOpen?.(c.id) }}
          className="text-xs font-semibold leading-tight text-left hover:underline underline-offset-2 min-w-0"
          style={{ color: T1 }}
          title="Open client"
        >
          {c.name}
        </button>
        <span
          className="text-[9px] px-1 py-0.5 rounded uppercase tracking-wide font-bold shrink-0"
          style={{ color: TIER_COLOR[c.tier] ?? T2, background: `${TIER_COLOR[c.tier] ?? '#888'}1a` }}
        >{c.tier.slice(0, 4)}</span>
      </div>

      {c.contact && (
        <div className="flex items-center gap-1 mt-1 min-w-0" style={{ color: T2 }}>
          <Mail size={9} className="shrink-0" />
          <span className="text-[10px] truncate">{c.contact.email}</span>
        </div>
      )}

      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: HEALTH_COLOR[c.health] ?? T2 }} />
        <span className="text-[10px]" style={{ color: T2 }}>{c.industry ?? c.health}</span>
        {c.hasPortalAccess && (
          <span className="text-[9px] px-1 rounded" style={{ color: '#10b981', background: 'rgba(16,185,129,0.12)' }}>portal</span>
        )}
        {c.daysInOnboarding !== null && (
          <span className="flex items-center gap-0.5 text-[10px] ml-auto" style={{ color: T2 }}>
            <Clock size={9} />{c.daysInOnboarding}d
          </span>
        )}
      </div>
    </div>
  )
}

function DraggableCard({ c, onOpen }: { c: ClientCard; onOpen: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: c.id })
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={{ cursor: 'grab' }}>
      <Card c={c} dragging={isDragging} onOpen={onOpen} />
    </div>
  )
}

function Column({ g, onOpen }: { g: Group; onOpen: (id: string) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: g.id })
  return (
    <div className="flex flex-col flex-1 min-w-0">
      <div className="flex items-center gap-1.5 mb-2 px-0.5">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: g.color }} />
        <span className="text-[11px] font-semibold truncate" style={{ color: T1 }}>{g.label}</span>
        <span className="text-[10px] tabular-nums ml-auto shrink-0" style={{ color: T2 }}>{g.items.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className="flex-1 rounded-lg p-1.5 space-y-1.5 min-h-[110px] transition-colors"
        style={{
          background: isOver ? `${g.color}14` : SURF,
          border: `1px ${isOver ? 'solid' : 'dashed'} ${isOver ? g.color : BDR}`,
        }}
      >
        {g.items.map(c => <DraggableCard key={c.id} c={c} onOpen={onOpen} />)}
        {!g.items.length && (
          <p className="text-[10px] text-center py-2 leading-snug" style={{ color: T2 }}>{g.description}</p>
        )}
      </div>
    </div>
  )
}

/** Table view — the honest default when most columns are empty. */
function TableView({ groups, onOpen, onMove }: {
  groups: Group[]; onOpen: (id: string) => void
  onMove: (id: string, stage: string) => void
}) {
  const rows = groups.flatMap(g => g.items.map(c => ({ ...c, group: g })))
  if (!rows.length) return <p className="text-xs" style={{ color: T2 }}>No clients yet.</p>

  return (
    <div className="overflow-x-auto rounded-lg" style={{ border: `1px solid ${BDR}` }}>
      <table className="w-full text-xs" style={{ background: CARD }}>
        <thead>
          <tr style={{ color: T2 }}>
            {['Client', 'Stage', 'Tier', 'Health', 'Contact', 'Owner', 'Days', ''].map(h => (
              <th key={h} className="text-left px-3 py-2 font-semibold text-[10px] uppercase tracking-wide whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} style={{ borderTop: `1px solid ${BDR}` }} className="hover:bg-[var(--os-surface-1)]">
              <td className="px-3 py-2">
                <button onClick={() => onOpen(r.id)} className="font-medium hover:underline underline-offset-2 text-left" style={{ color: T1 }}>
                  {r.name}
                </button>
                {r.industry && <div className="text-[10px]" style={{ color: T2 }}>{r.industry}</div>}
              </td>
              <td className="px-3 py-2">
                <select
                  value={r.stage}
                  onChange={e => onMove(r.id, e.target.value)}
                  className="text-[11px] rounded px-1.5 py-1 outline-none cursor-pointer"
                  style={{ background: `${r.group.color}1a`, color: r.group.color, border: `1px solid ${r.group.color}44` }}
                >
                  {groups.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
                </select>
              </td>
              <td className="px-3 py-2" style={{ color: TIER_COLOR[r.tier] ?? T2 }}>{r.tier}</td>
              <td className="px-3 py-2">
                <span className="flex items-center gap-1" style={{ color: HEALTH_COLOR[r.health] ?? T2 }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: HEALTH_COLOR[r.health] ?? T2 }} />
                  {r.health}
                </span>
              </td>
              <td className="px-3 py-2" style={{ color: T2 }}>{r.contact?.email ?? '—'}</td>
              <td className="px-3 py-2" style={{ color: T2 }}>{r.accountManager ?? '—'}</td>
              <td className="px-3 py-2 tabular-nums" style={{ color: T2 }}>{r.daysInOnboarding ?? '—'}</td>
              <td className="px-3 py-2">
                <button onClick={() => onOpen(r.id)} style={{ color: T2 }} title="Open client">
                  <ChevronRight size={13} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function NewClientForm({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient()
  const [f, setF] = useState({ name: '', industry: '', tier: 'standard', contactName: '', contactEmail: '', accountManager: '' })
  const create = useMutation({
    mutationFn: () => api.post('/admin/client-onboarding/clients', f).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['onboarding-board'] }); onClose() },
  })
  const field = (k: keyof typeof f, label: string, ph = '') => (
    <div key={k}>
      <label className="block text-[10px] uppercase tracking-wide mb-1" style={{ color: T2 }}>{label}</label>
      <input value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })} placeholder={ph}
        className="w-full rounded px-2 py-1.5 text-xs outline-none"
        style={{ background: SURF, border: `1px solid ${BDR}`, color: T1 }} />
    </div>
  )
  return (
    <div className="rounded-lg p-3 space-y-2.5" style={{ background: CARD, border: `1px solid ${BDR}` }}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold" style={{ color: T1 }}>New client</span>
        <button onClick={onClose} style={{ color: T2 }}><X size={14} /></button>
      </div>
      <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
        {field('name', 'Company *', 'Northwind Labs')}
        {field('industry', 'Industry', 'Biotech')}
        {field('contactName', 'Primary contact', 'Dana Reeve')}
        {field('contactEmail', 'Contact email', 'dana@northwind.com')}
        {field('accountManager', 'Account manager', 'Priya')}
        <div>
          <label className="block text-[10px] uppercase tracking-wide mb-1" style={{ color: T2 }}>Tier</label>
          <select value={f.tier} onChange={e => setF({ ...f, tier: e.target.value })}
            className="w-full rounded px-2 py-1.5 text-xs outline-none"
            style={{ background: SURF, border: `1px solid ${BDR}`, color: T1 }}>
            {['starter', 'standard', 'enterprise', 'strategic'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <p className="text-[10px]" style={{ color: T2 }}>
        A contact email is needed before Kickoff — the portal account is created from it.
      </p>
      <button disabled={!f.name.trim() || create.isPending} onClick={() => create.mutate()}
        className="px-3 py-1.5 rounded text-xs font-semibold disabled:opacity-40"
        style={{ background: '#7c3aed', color: '#fff' }}>
        {create.isPending ? 'Adding…' : 'Add to board'}
      </button>
    </div>
  )
}

export function ClientOnboardingBoard() {
  const qc = useQueryClient()
  const openClient = useOpenClient()
  const [adding, setAdding] = useState(false)
  const [view, setView] = useState<'board' | 'table'>('board')
  const [hideEmpty, setHideEmpty] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [effects, setEffects] = useState<{ name: string; list: Effect[] } | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const { data, isLoading } = useQuery<Board>({
    queryKey: ['onboarding-board'],
    queryFn: () => api.get('/admin/client-onboarding/board').then(r => r.data),
  })

  const move = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: string }) =>
      api.post(`/admin/client-onboarding/clients/${id}/stage`, { stage }).then(r => r.data),
    onSuccess: res => {
      qc.invalidateQueries({ queryKey: ['onboarding-board'] })
      if (res.effects?.length) setEffects({ name: res.client.name, list: res.effects })
    },
  })

  const all = data?.groups.flatMap(g => g.items) ?? []

  // Most stages are empty most of the time. Showing seven fixed columns pushes
  // everything off-screen for no benefit, so empty ones collapse by default —
  // and are still valid drop targets when you are dragging.
  const visibleGroups = useMemo(() => {
    if (!data) return []
    if (!hideEmpty || activeId) return data.groups
    return data.groups.filter(g => g.items.length > 0)
  }, [data, hideEmpty, activeId])

  const hiddenCount = (data?.groups.length ?? 0) - visibleGroups.length
  const active = all.find(c => c.id === activeId) ?? null

  function onDragEnd(e: DragEndEvent) {
    setActiveId(null)
    const to = e.over?.id as string | undefined
    const id = e.active.id as string
    if (!to) return
    const current = all.find(c => c.id === id)
    if (!current || current.stage === to) return
    move.mutate({ id, stage: to })
  }

  const toggle = (v: 'board' | 'table', Icon: any, label: string) => (
    <button
      onClick={() => setView(v)}
      className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium"
      style={{
        background: view === v ? 'var(--os-surface-1)' : 'transparent',
        color: view === v ? T1 : T2,
        border: `1px solid ${view === v ? BDR : 'transparent'}`,
      }}
    >
      <Icon size={12} /> {label}
    </button>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold" style={{ color: T1 }}>Client Onboarding</h1>
          <p className="text-xs mt-0.5 max-w-[68ch]" style={{ color: T2 }}>
            Move a client through the stages. Each move does the real work — creates their account,
            grants portal access, provisions the first project, starts the Day-0 clock.
            Click a name to open the client.
          </p>
        </div>
        <button onClick={() => setAdding(v => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold shrink-0"
          style={{ background: '#7c3aed', color: '#fff' }}>
          <Plus size={13} /> New client
        </button>
      </div>

      {adding && <NewClientForm onClose={() => setAdding(false)} />}

      {/* Toolbar */}
      {data && (
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 rounded p-0.5" style={{ background: SURF, border: `1px solid ${BDR}` }}>
            {toggle('board', LayoutGrid, 'Board')}
            {toggle('table', Rows3, 'Table')}
          </div>
          {view === 'board' && (
            <button onClick={() => setHideEmpty(v => !v)}
              className="flex items-center gap-1 px-2 py-1 rounded text-[11px]"
              style={{ background: SURF, border: `1px solid ${BDR}`, color: T2 }}>
              {hideEmpty ? <Eye size={12} /> : <EyeOff size={12} />}
              {hideEmpty ? `Show all stages${hiddenCount ? ` (+${hiddenCount})` : ''}` : 'Hide empty stages'}
            </button>
          )}
          <span className="text-xs ml-auto" style={{ color: T2 }}>
            {data.total} clients · <span style={{ color: '#f59e0b' }}>{data.inProgress}</span> mid-onboarding
          </span>
        </div>
      )}

      {effects && (
        <div className="rounded-lg p-3" style={{ background: CARD, border: `1px solid ${BDR}` }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold" style={{ color: T1 }}>{effects.name} — what just happened</span>
            <button onClick={() => setEffects(null)} style={{ color: T2 }}><X size={13} /></button>
          </div>
          <div className="space-y-1">
            {effects.list.map((e, i) => {
              const cfg = e.status === 'DONE' ? { icon: <Check size={11} />, color: '#10b981' }
                : e.status === 'FAILED' ? { icon: <AlertTriangle size={11} />, color: '#ef4444' }
                : { icon: <Minus size={11} />, color: T2 }
              return (
                <div key={i} className="flex items-start gap-2 text-xs flex-wrap">
                  <span style={{ color: cfg.color }} className="mt-0.5">{cfg.icon}</span>
                  <span style={{ color: T1 }} className="font-medium min-w-[110px]">{e.step}</span>
                  <span style={{ color: T2 }}>{e.detail}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {isLoading && <p className="text-xs" style={{ color: T2 }}>Loading…</p>}

      {data && view === 'table' && (
        <TableView
          groups={data.groups}
          onOpen={openClient}
          onMove={(id, stage) => move.mutate({ id, stage })}
        />
      )}

      {data && view === 'board' && (
        <DndContext
          sensors={sensors}
          onDragStart={(e: DragStartEvent) => setActiveId(e.active.id as string)}
          onDragEnd={onDragEnd}
          onDragCancel={() => setActiveId(null)}
        >
          {/* Columns share the width rather than overflowing. Dragging reveals
              every stage, so a hidden empty column is still reachable. */}
          <div className="flex gap-2 items-stretch">
            {visibleGroups.map(g => <Column key={g.id} g={g} onOpen={openClient} />)}
          </div>
          {hideEmpty && hiddenCount > 0 && !activeId && (
            <p className="text-[10px] mt-2" style={{ color: T2 }}>
              {hiddenCount} empty stage{hiddenCount > 1 ? 's' : ''} hidden — they reappear while you drag.
            </p>
          )}
          <DragOverlay>{active ? <div className="w-[200px]"><Card c={active} /></div> : null}</DragOverlay>
        </DndContext>
      )}
    </div>
  )
}

export default ClientOnboardingBoard
