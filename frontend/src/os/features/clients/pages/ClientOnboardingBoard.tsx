import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  useDroppable, useDraggable, type DragStartEvent, type DragEndEvent,
} from '@dnd-kit/core'
import { Plus, X, Check, AlertTriangle, Minus, Building2, Mail, User2, Clock } from 'lucide-react'
import { api } from '@lib/api'

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

function Card({ c, dragging }: { c: ClientCard; dragging?: boolean }) {
  return (
    <div
      className="rounded-lg p-2.5 select-none"
      style={{
        background: CARD,
        border: `1px solid ${BDR}`,
        opacity: dragging ? 0.4 : 1,
        cursor: 'grab',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-semibold leading-tight" style={{ color: T1 }}>{c.name}</span>
        <span
          className="text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wide font-bold shrink-0"
          style={{ color: TIER_COLOR[c.tier] ?? T2, background: `${TIER_COLOR[c.tier] ?? '#888'}1a` }}
        >{c.tier}</span>
      </div>

      {c.industry && (
        <div className="flex items-center gap-1 mt-1" style={{ color: T2 }}>
          <Building2 size={9} /><span className="text-[10px]">{c.industry}</span>
        </div>
      )}
      {c.contact && (
        <div className="flex items-center gap-1 mt-0.5" style={{ color: T2 }}>
          <Mail size={9} /><span className="text-[10px] truncate">{c.contact.email}</span>
        </div>
      )}

      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
        <span className="flex items-center gap-1 text-[10px]" style={{ color: HEALTH_COLOR[c.health] ?? T2 }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: HEALTH_COLOR[c.health] ?? T2 }} />
          {c.health}
        </span>
        {c.hasPortalAccess && (
          <span className="text-[9px] px-1 py-0.5 rounded" style={{ color: '#10b981', background: 'rgba(16,185,129,0.12)' }}>
            portal
          </span>
        )}
        {c.daysInOnboarding !== null && (
          <span className="flex items-center gap-0.5 text-[10px] ml-auto" style={{ color: T2 }}>
            <Clock size={9} />{c.daysInOnboarding}d
          </span>
        )}
      </div>
      {c.accountManager && (
        <div className="flex items-center gap-1 mt-1" style={{ color: T2 }}>
          <User2 size={9} /><span className="text-[10px]">{c.accountManager}</span>
        </div>
      )}
    </div>
  )
}

function DraggableCard({ c }: { c: ClientCard }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: c.id })
  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      <Card c={c} dragging={isDragging} />
    </div>
  )
}

function Column({ g }: { g: Group }) {
  const { setNodeRef, isOver } = useDroppable({ id: g.id })
  return (
    <div className="flex flex-col min-w-[230px] w-[230px]">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: g.color }} />
        <span className="text-xs font-semibold" style={{ color: T1 }}>{g.label}</span>
        <span className="text-[10px] tabular-nums" style={{ color: T2 }}>{g.items.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className="flex-1 rounded-lg p-1.5 space-y-1.5 min-h-[120px] transition-colors"
        style={{
          background: isOver ? `${g.color}14` : SURF,
          border: `1px ${isOver ? 'solid' : 'dashed'} ${isOver ? g.color : BDR}`,
        }}
      >
        {g.items.map(c => <DraggableCard key={c.id} c={c} />)}
        {!g.items.length && (
          <p className="text-[10px] text-center py-3" style={{ color: T2 }}>{g.description}</p>
        )}
      </div>
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
      <input
        value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })} placeholder={ph}
        className="w-full rounded px-2 py-1.5 text-xs outline-none"
        style={{ background: SURF, border: `1px solid ${BDR}`, color: T1 }}
      />
    </div>
  )

  return (
    <div className="rounded-lg p-3 space-y-2.5 mb-4" style={{ background: CARD, border: `1px solid ${BDR}` }}>
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
          <select
            value={f.tier} onChange={e => setF({ ...f, tier: e.target.value })}
            className="w-full rounded px-2 py-1.5 text-xs outline-none"
            style={{ background: SURF, border: `1px solid ${BDR}`, color: T1 }}
          >
            {['starter', 'standard', 'enterprise', 'strategic'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <p className="text-[10px]" style={{ color: T2 }}>
        A contact email is needed before Kickoff — that is what the portal account is created from.
      </p>
      <button
        disabled={!f.name.trim() || create.isPending}
        onClick={() => create.mutate()}
        className="px-3 py-1.5 rounded text-xs font-semibold disabled:opacity-40"
        style={{ background: '#7c3aed', color: '#fff' }}
      >
        {create.isPending ? 'Adding…' : 'Add to board'}
      </button>
    </div>
  )
}

export function ClientOnboardingBoard() {
  const qc = useQueryClient()
  const [adding, setAdding] = useState(false)
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

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: T1 }}>Client Onboarding</h1>
          <p className="text-xs mt-0.5" style={{ color: T2 }}>
            Drag a client through the stages. Each move does the real work — creates their account,
            grants portal access, provisions the first project, starts the Day-0 clock.
          </p>
        </div>
        <button
          onClick={() => setAdding(v => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold"
          style={{ background: '#7c3aed', color: '#fff' }}
        >
          <Plus size={13} /> New client
        </button>
      </div>

      {adding && <NewClientForm onClose={() => setAdding(false)} />}

      {effects && (
        <div className="rounded-lg p-3" style={{ background: CARD, border: `1px solid ${BDR}` }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold" style={{ color: T1 }}>{effects.name} — what just happened</span>
            <button onClick={() => setEffects(null)} style={{ color: T2 }}><X size={13} /></button>
          </div>
          <div className="space-y-1">
            {effects.list.map((e, i) => {
              const cfg = e.status === 'DONE'
                ? { icon: <Check size={11} />, color: '#10b981' }
                : e.status === 'FAILED'
                  ? { icon: <AlertTriangle size={11} />, color: '#ef4444' }
                  : { icon: <Minus size={11} />, color: T2 }
              return (
                <div key={i} className="flex items-start gap-2 text-xs">
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

      {data && (
        <>
          <div className="text-xs" style={{ color: T2 }}>
            {data.total} clients · <span style={{ color: '#f59e0b' }}>{data.inProgress}</span> mid-onboarding
          </div>
          <DndContext
            sensors={sensors}
            onDragStart={(e: DragStartEvent) => setActiveId(e.active.id as string)}
            onDragEnd={onDragEnd}
          >
            <div className="flex gap-3 overflow-x-auto pb-3">
              {data.groups.map(g => <Column key={g.id} g={g} />)}
            </div>
            <DragOverlay>{active ? <div className="w-[218px]"><Card c={active} /></div> : null}</DragOverlay>
          </DndContext>
        </>
      )}
    </div>
  )
}

export default ClientOnboardingBoard
