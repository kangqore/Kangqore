import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { useUIStore } from '@store/ui'
import { usePageViews } from '@hooks/usePageViews'
import {
  DndContext, DragOverlay, closestCorners,
  PointerSensor, useSensor, useSensors,
  type DragStartEvent, type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TrendingUp, Search, Trash2, Zap, ArrowRight, Star } from 'lucide-react'
import { useNavigate as useNav } from 'react-router-dom'
import { Badge } from '@design-system/components/Badge'
import { StatCard } from '@design-system/components/StatCard'
import { Input } from '@design-system/components/Input'
import { cn } from '@design-system/cn'
import { InlineSelect } from '@components/InlineSelect'
import { BulkActionBar } from '@components/BulkActionBar'
import { useLeadsStore } from '../store'
import { api, isDemo } from '@lib/api'
import { LEADS, EQORE_SIGNALS, ACTIVITIES, NURTURE_SEQUENCES } from '../data'
import type { Lead, LeadStage } from '../types'

interface EqoreLeadRaw {
  id?: unknown
  companyName?: unknown
  company?: unknown
  name?: unknown
  contactName?: unknown
  role?: unknown
  contactRole?: unknown
  jobTitle?: unknown
  email?: unknown
  phone?: unknown
  country?: unknown
  industry?: unknown
  stage?: unknown
  source?: unknown
  leadScore?: unknown
  score?: unknown
  eqoreScore?: unknown
  value?: unknown
  dealValue?: unknown
  projectedValue?: unknown
  probability?: unknown
  winProbability?: unknown
  pipelineWeight?: unknown
  owner?: unknown
  assignedTo?: unknown
  createdAt?: unknown
  updatedAt?: unknown
  lastActivity?: unknown
  tags?: unknown
  description?: unknown
  notes?: unknown
}

const VALID_STAGES: Lead['stage'][] = ['new', 'qualified', 'proposal', 'negotiation', 'won', 'lost']
const VALID_SOURCES: Lead['source'][] = ['inbound', 'outbound', 'referral', 'eQORE', 'event', 'website']

function toLead(e: EqoreLeadRaw, i: number): Lead {
  const rawStage  = String(e.stage  ?? 'new').toLowerCase()
  const rawSource = String(e.source ?? 'inbound')
  return {
    id:           String(e.id ?? `l${i}`),
    company:      String(e.companyName ?? e.company ?? 'Unknown'),
    contactName:  String(e.contactName ?? e.name ?? ''),
    contactRole:  String(e.contactRole ?? e.role ?? e.jobTitle ?? ''),
    email:        String(e.email ?? ''),
    phone:        e.phone ? String(e.phone) : undefined,
    country:      String(e.country ?? 'UK'),
    industry:     String(e.industry ?? ''),
    stage:        VALID_STAGES.includes(rawStage as Lead['stage']) ? rawStage as Lead['stage'] : 'new',
    source:       VALID_SOURCES.includes(rawSource as Lead['source']) ? rawSource as Lead['source'] : 'inbound',
    score:        Number(e.score ?? e.eqoreScore ?? e.leadScore ?? 50),
    value:        Number(e.value ?? e.dealValue ?? e.projectedValue ?? 0),
    probability:  Number(e.probability ?? e.winProbability ?? e.pipelineWeight ?? 30),
    owner:        String(e.owner ?? e.assignedTo ?? 'Unassigned'),
    createdAt:    String(e.createdAt ?? '').slice(0, 10),
    lastActivity: String(e.updatedAt ?? e.lastActivity ?? '').slice(0, 10),
    tags:         Array.isArray(e.tags) ? (e.tags as string[]) : [],
    description:  String(e.description ?? e.notes ?? ''),
  }
}

const STAGES: { id: LeadStage; label: string; color: string; bg: string }[] = [
  { id: 'new',         label: 'New',         color: '#579bfc', bg: '#579bfc' },
  { id: 'qualified',   label: 'Qualified',   color: '#fdab3d', bg: '#fdab3d' },
  { id: 'proposal',    label: 'Proposal',    color: '#7c3aed', bg: '#7c3aed' },
  { id: 'negotiation', label: 'Negotiation', color: '#323338', bg: '#323338' },
  { id: 'won',         label: 'Won',         color: '#00c875', bg: '#00c875' },
  { id: 'lost',        label: 'Lost',        color: '#e2445c', bg: '#e2445c' },
]

const STAGE_OPTIONS: { value: LeadStage; label: string; variant: 'neutral' | 'info' | 'warning' | 'brand' | 'success' | 'danger' }[] = [
  { value: 'new',         label: 'New',         variant: 'neutral' },
  { value: 'qualified',   label: 'Qualified',   variant: 'info'    },
  { value: 'proposal',    label: 'Proposal',    variant: 'warning' },
  { value: 'negotiation', label: 'Negotiation', variant: 'brand'   },
  { value: 'won',         label: 'Won',         variant: 'success' },
  { value: 'lost',        label: 'Lost',        variant: 'danger'  },
]

const SOURCE_BADGE = {
  eQORE: 'brand', inbound: 'success', outbound: 'neutral',
  referral: 'info', event: 'warning', website: 'neutral',
} as const

const STAGE_DOT: Record<LeadStage, string> = {
  new: '#579bfc', qualified: '#fdab3d', proposal: '#7c3aed',
  negotiation: '#323338', won: '#00c875', lost: '#e2445c',
}

const STAGE_BG: Record<LeadStage, string> = {
  new: '#579bfc', qualified: '#fdab3d', proposal: '#7c3aed',
  negotiation: '#323338', won: '#00c875', lost: '#e2445c',
}

// ── Customer One Banner ───────────────────────────────────────────────────────

function CustomerOneBanner({ leads }: { leads: Lead[] }) {
  const nav = useNav()
  const topQualified = [...leads]
    .filter(l => ['won', 'negotiation', 'proposal'].includes(l.stage))
    .sort((a, b) => b.score - a.score)[0]

  if (!topQualified) return null

  const coigEstimate = Math.round(topQualified.score * 0.12 + (topQualified.value / 100000) * 2)
  const isWon = topQualified.stage === 'won'

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1200 0%, #2a1e00 50%, #0a0f1a 100%)',
      border: '1px solid #d4a01740',
      borderLeft: '4px solid #d4a017',
      borderRadius: 12, padding: '16px 20px',
      display: 'flex', alignItems: 'center', gap: 16,
      marginBottom: 4,
    }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: '#d4a01720', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Star size={20} color="#d4a017" fill="#d4a017" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '.1em', color: '#d4a017', marginBottom: 4 }}>
          Customer One Target
        </div>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 2 }}>{topQualified.company}</div>
        <div style={{ fontSize: 11, color: '#9898c0' }}>
          {topQualified.contactName} · <span style={{ color: '#d4a017', fontWeight: 700 }}>WAANDA Score {topQualified.score}</span> · ₹{(topQualified.value / 1000).toFixed(0)}K · Est. COIG +{coigEstimate}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        {isWon ? (
          <button
            onClick={() => nav('/kangqore-view/admin/kangqore-immp/blueprint-customize')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 8, border: 'none',
              background: '#d4a017', color: '#000', cursor: 'pointer',
              fontWeight: 800, fontSize: 12,
            }}
          >
            <Zap size={13} /> Convert to Customer <ArrowRight size={13} />
          </button>
        ) : (
          <span style={{ fontSize: 11, fontWeight: 700, padding: '6px 12px', borderRadius: 8, background: '#fdab3d20', color: '#fdab3d', border: '1px solid #fdab3d40' }}>
            {topQualified.stage === 'negotiation' ? 'In Negotiation' : 'In Proposal'}
          </span>
        )}
      </div>
    </div>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const bg = score >= 80 ? '#00c87522' : score >= 60 ? '#fdab3d22' : '#57575722'
  const color = score >= 80 ? '#00c875' : score >= 60 ? '#fdab3d' : 'var(--os-text-2)'
  return (
    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: bg, color }}>
      {score}
    </span>
  )
}

function LeadCard({
  lead, dragging = false, onClick, onStageChange, selected, onToggle,
}: {
  lead: Lead; dragging?: boolean; onClick: () => void; onStageChange: (stage: LeadStage) => void
  selected?: boolean; onToggle?: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lead.id })
  const stageBg = STAGE_BG[lead.stage]
  const initials = lead.company.slice(0, 2).toUpperCase()
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, background: stageBg }}
      className={cn(
        'rounded-xl p-3 select-none text-white shadow-sm transition-all duration-150',
        'hover:brightness-110 hover:scale-[1.02]',
        isDragging && !dragging && 'opacity-30',
        dragging && 'shadow-xl rotate-1 scale-105',
        selected ? 'ring-2 ring-white/60' : '',
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer" onClick={onClick}>
          {onToggle && (
            <input
              type="checkbox"
              checked={selected}
              onChange={onToggle}
              onClick={e => e.stopPropagation()}
              className="w-3.5 h-3.5 rounded bg-white/20 border-white/40 accent-white cursor-pointer flex-shrink-0"
            />
          )}
          <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <span className="text-[11px] font-bold text-white">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-white truncate leading-tight">{lead.company}</p>
            <p className="text-[11px] text-white/70 truncate">{lead.contactName}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <ScoreBadge score={lead.score} />
          <button {...attributes} {...listeners} className="text-white/50 hover:text-[var(--os-text-1)] flex-shrink-0 cursor-grab active:cursor-grabbing" onClick={e => e.stopPropagation()}>
            ⋮⋮
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2" onClick={onClick}>
        <span className="text-sm font-bold text-white cursor-pointer">₹{(lead.value / 1000).toFixed(0)}k</span>
        <span className="text-[11px] text-white/70">{lead.probability}% win</span>
      </div>

      <div className="pt-2 border-t border-[var(--os-border)]">
        <InlineSelect
          value={lead.stage}
          options={STAGE_OPTIONS}
          onChange={onStageChange}
          size="sm"
        />
      </div>
    </div>
  )
}

function TableView({
  leads,
  selected,
  onToggle,
  onToggleAll,
  onOpen,
  onStageChange,
}: {
  leads: Lead[]
  selected: Set<string>
  onToggle: (id: string) => void
  onToggleAll: () => void
  onOpen: (id: string) => void
  onStageChange: (id: string, stage: LeadStage) => void
}) {
  const allSelected = leads.length > 0 && leads.every(l => selected.has(l.id))
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--os-border)] shadow-[var(--os-shadow-card)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--os-border)]" style={{ background: 'var(--os-surface-0)' }}>
            <th className="w-10 px-4 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleAll}
                className="w-3.5 h-3.5 rounded accent-[#579bfc]"
              />
            </th>
            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--os-text-2)' }}>Company</th>
            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--os-text-2)' }}>Contact</th>
            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--os-text-2)' }}>Stage</th>
            <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--os-text-2)' }}>Value</th>
            <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--os-text-2)' }}>Score</th>
            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--os-text-2)' }}>Source</th>
            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--os-text-2)' }}>Owner</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead.id}
              className={cn(
                'border-b border-[var(--os-border)] transition-colors cursor-pointer',
                selected.has(lead.id) ? 'bg-[#579bfc]/8' : 'hover:bg-[var(--os-surface-0)]',
              )}
            >
              <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selected.has(lead.id)}
                  onChange={() => onToggle(lead.id)}
                  className="w-3.5 h-3.5 rounded accent-[#579bfc]"
                />
              </td>
              <td className="px-4 py-3" onClick={() => onOpen(lead.id)}>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0" style={{ background: STAGE_DOT[lead.stage] }}>
                    {lead.company.slice(0,2).toUpperCase()}
                  </div>
                  <span className="font-semibold text-white">{lead.company}</span>
                </div>
              </td>
              <td className="px-4 py-3" onClick={() => onOpen(lead.id)}>
                <span className="block text-sm font-medium" style={{ color: 'var(--os-text-1)' }}>{lead.contactName}</span>
                <span className="text-[11px]" style={{ color: 'var(--os-text-2)' }}>{lead.contactRole}</span>
              </td>
              <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: STAGE_DOT[lead.stage] }} />
                  <InlineSelect value={lead.stage} options={STAGE_OPTIONS} onChange={s => onStageChange(lead.id, s)} size="sm" />
                </div>
              </td>
              <td className="px-4 py-3 text-right font-bold text-white" onClick={() => onOpen(lead.id)}>
                ₹{(lead.value / 1000).toFixed(0)}k
              </td>
              <td className="px-4 py-3 text-center" onClick={() => onOpen(lead.id)}>
                <ScoreBadge score={lead.score} />
              </td>
              <td className="px-4 py-3" onClick={() => onOpen(lead.id)}>
                <Badge variant={SOURCE_BADGE[lead.source]} size="sm">{lead.source}</Badge>
              </td>
              <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--os-text-2)' }} onClick={() => onOpen(lead.id)}>
                {lead.owner.split(' ')[0]}
              </td>
            </tr>
          ))}
          {leads.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-12 text-center text-sm" style={{ color: 'var(--os-text-2)' }}>No leads match your search</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export function LeadsPipeline() {
  const { leads, isLoading, hydrate, moveLeadStage, updateLead, bulkUpdateLeads, bulkDeleteLeads, setSelected, pipelineValue, forecastValue } = useLeadsStore()
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  usePageViews(['list', 'board', 'kanban'])
  const globalViewMode = useUIStore(s => s.viewMode)
  // list → table, board → card grid (kanban pipe), kanban → kanban columns
  const viewMode = globalViewMode === 'list' ? 'table' : 'kanban'

  const { data: rawLeads } = useQuery({
    queryKey: ['leads-pipeline'],
    queryFn: () => api.get('/admin/eqore/leads').then(r => (r.data.leads ?? r.data ?? []) as EqoreLeadRaw[]),
    staleTime: 60_000,
    enabled: !isDemo(),
  })

  useEffect(() => {
    if (isDemo()) {
      hydrate(LEADS)
      useLeadsStore.setState({ signals: EQORE_SIGNALS, activities: ACTIVITIES, nurtureSequences: NURTURE_SEQUENCES })
    } else if (rawLeads !== undefined) {
      hydrate(rawLeads.map((e, i) => toLead(e, i)))
    }
  }, [rawLeads, hydrate])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const activeLead = leads.find(l => l.id === activeId)

  const filteredLeads = leads.filter(l =>
    l.company.toLowerCase().includes(search.toLowerCase()) ||
    l.contactName.toLowerCase().includes(search.toLowerCase())
  )

  function onDragStart({ active }: DragStartEvent) { setActiveId(active.id as string) }
  function onDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null)
    if (!over) return
    const stageId = STAGES.find(s => s.id === over.id)?.id
      ?? leads.find(l => l.id === over.id)?.stage
    if (stageId) moveLeadStage(active.id as string, stageId)
  }

  function openLead(id: string) { setSelected(id); navigate('/kangqore-view/admin/leads/profile') }

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (filteredLeads.every(l => selectedIds.has(l.id))) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredLeads.map(l => l.id)))
    }
  }

  async function handleBulkStage(stage: string) {
    const ids = [...selectedIds]
    bulkUpdateLeads(ids, { stage: stage as LeadStage })
    if (!isDemo()) {
      await Promise.all(ids.map(id => api.patch(`/admin/leads/${id}`, { stage })))
    }
    setSelectedIds(new Set())
  }

  async function handleBulkDelete() {
    const ids = [...selectedIds]
    bulkDeleteLeads(ids)
    if (!isDemo()) {
      await Promise.all(ids.map(id => api.delete(`/admin/leads/${id}`)))
    }
    setSelectedIds(new Set())
  }

  function handleStageChange(leadId: string, stage: LeadStage) {
    updateLead(leadId, { stage })
    if (!isDemo()) api.patch(`/admin/leads/${leadId}`, { stage })
  }

  const totalPipeline  = pipelineValue()
  const totalForecast  = forecastValue()
  const wonValue       = leads.filter(l => l.stage === 'won').reduce((s, l) => s + l.value, 0)
  const activeCount    = filteredLeads.filter(l => !['won','lost'].includes(l.stage)).length

  if (isLoading && leads.length === 0) {
    return (
      <div className="space-y-5">
        <div className="h-8 w-64 bg-[var(--os-surface-0)] rounded-xl animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-[var(--os-surface-0)] rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="flex gap-3 overflow-x-auto pb-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="min-w-[210px] w-[210px] h-64 bg-[var(--os-surface-0)] rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <KIMMPSignalBar module="Leads" />
      <CustomerOneBanner leads={leads} />
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Lead Pipeline</h2>
          <p className="text-sm text-[var(--os-text-2)] mt-0.5">{leads.length} leads · drag to move stages</p>
        </div>
        <Input placeholder="Search leads…" prefix={<Search className="w-3.5 h-3.5"/>} className="w-52" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Pipeline Value',  value: `₹${(totalPipeline/1000).toFixed(0)}k`, sub: 'total active',  bg: 'linear-gradient(135deg,#2564ea 0%,#4ab6d4 100%)', glow: '#2564ea' },
          { label: 'Forecast Value',  value: `₹${(totalForecast/1000).toFixed(0)}k`, sub: 'weighted',      bg: 'linear-gradient(135deg,#fdab3d 0%,#f59e0b 100%)', glow: '#fdab3d' },
          { label: 'Won YTD',         value: `₹${(wonValue/1000).toFixed(0)}k`,       sub: 'closed won',    bg: 'linear-gradient(135deg,#00c875 0%,#00a86b 100%)', glow: '#00c875' },
          { label: 'Active Leads',    value: activeCount,                              sub: 'in pipeline',   bg: 'linear-gradient(135deg,#7c3aed 0%,#9d4edd 100%)', glow: '#7c3aed' },
        ].map(t => (
          <div key={t.label} className="rounded-2xl p-5 relative overflow-hidden" style={{ background: t.bg, boxShadow: `0 4px 20px ${t.glow}40` }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.30) 0%, transparent 60%)' }} />
            <p className="relative text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>{t.label}</p>
            <p className="relative text-3xl font-black tracking-tight" style={{ color: '#ffffff' }}>{t.value}</p>
            <p className="relative text-[11px] mt-2" style={{ color: 'rgba(255,255,255,0.72)' }}>{t.sub}</p>
          </div>
        ))}
      </div>

      {viewMode === 'table' ? (
        <TableView
          leads={filteredLeads}
          selected={selectedIds}
          onToggle={toggleSelect}
          onToggleAll={toggleAll}
          onOpen={openLead}
          onStageChange={handleStageChange}
        />
      ) : (
        /* Pipeline board */
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <div className="flex gap-3 overflow-x-auto pb-4">
            {STAGES.map(stage => {
              const stageLeads = filteredLeads.filter(l => l.stage === stage.id)
              const stageValue = stageLeads.reduce((s, l) => s + l.value, 0)
              return (
                <div key={stage.id} className="flex flex-col min-w-[220px] w-[220px]">
                  {/* Column header with colored top bar */}
                  <div className="rounded-xl overflow-hidden mb-2">
                    <div className="h-1 w-full" style={{ background: stage.bg }} />
                    <div className="flex items-center gap-2 px-3 py-2" style={{ background: 'var(--os-surface-0)' }}>
                      <span className="text-xs font-bold" style={{ color: 'var(--os-text-1)' }}>{stage.label}</span>
                      <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: stage.bg }}>{stageLeads.length}</span>
                    </div>
                    {stageValue > 0 && (
                      <div className="px-3 pb-2" style={{ background: 'var(--os-surface-0)' }}>
                        <p className="text-[10px] font-semibold" style={{ color: 'var(--os-text-2)' }}>₹{(stageValue/1000).toFixed(0)}k</p>
                      </div>
                    )}
                  </div>
                  <SortableContext id={stage.id} items={stageLeads.map(l => l.id)} strategy={verticalListSortingStrategy}>
                    <div className={cn('flex flex-col gap-2 p-2 rounded-xl min-h-[100px] flex-1 border border-[var(--os-border)]',
                      stageLeads.length === 0 && 'items-center justify-center'
                    )} style={{ background: 'var(--os-surface-0)' }}>
                      {stageLeads.length === 0 && <p className="text-xs py-4" style={{ color: 'var(--os-text-2)' }}>Drop here</p>}
                      {stageLeads.map(lead => (
                        <LeadCard
                          key={lead.id}
                          lead={lead}
                          selected={selectedIds.has(lead.id)}
                          onToggle={() => toggleSelect(lead.id)}
                          onClick={() => openLead(lead.id)}
                          onStageChange={s => handleStageChange(lead.id, s)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </div>
              )
            })}
          </div>
          <DragOverlay>
            {activeLead && <LeadCard lead={activeLead} dragging onClick={() => {}} onStageChange={() => {}} />}
          </DragOverlay>
        </DndContext>
      )}

      <BulkActionBar
        count={selectedIds.size}
        onClear={() => setSelectedIds(new Set())}
        groups={[
          {
            label: 'Move to Stage',
            options: STAGES.map(s => ({ value: s.id, label: s.label })),
            onSelect: handleBulkStage,
          },
        ]}
        actions={[
          {
            label: 'Delete',
            icon: <Trash2 className="w-3 h-3" />,
            variant: 'danger',
            onClick: handleBulkDelete,
          },
        ]}
      />
    </div>
  )
}
