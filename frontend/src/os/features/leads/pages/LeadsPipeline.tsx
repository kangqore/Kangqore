import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import {
  DndContext, DragOverlay, closestCorners,
  PointerSensor, useSensor, useSensors,
  type DragStartEvent, type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TrendingUp, Search, LayoutList, Kanban, Trash2 } from 'lucide-react'
import { Badge } from '@design-system/components/Badge'
import { StatCard } from '@design-system/components/StatCard'
import { Input } from '@design-system/components/Input'
import { cn } from '@design-system/cn'
import { InlineSelect } from '@components/InlineSelect'
import { BulkActionBar } from '@components/BulkActionBar'
import { useLeadsStore } from '../store'
import { api, isDemo } from '@lib/api'
import type { Lead, LeadStage } from '../types'

const STAGES: { id: LeadStage; label: string; color: string }[] = [
  { id: 'new',         label: 'New',         color: '#94a3b8' },
  { id: 'qualified',   label: 'Qualified',   color: '#3b82f6' },
  { id: 'proposal',    label: 'Proposal',    color: '#f59e0b' },
  { id: 'negotiation', label: 'Negotiation', color: '#8b5cf6' },
  { id: 'won',         label: 'Won',         color: '#22c55e' },
  { id: 'lost',        label: 'Lost',        color: '#ef4444' },
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
  new: '#94a3b8', qualified: '#3b82f6', proposal: '#f59e0b',
  negotiation: '#8b5cf6', won: '#22c55e', lost: '#ef4444',
}

function ScoreDot({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-amber-400' : 'bg-slate-300'
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-xs font-bold text-slate-300">{score}</span>
    </div>
  )
}

function LeadCard({
  lead, dragging = false, onClick, onStageChange, selected, onToggle,
}: {
  lead: Lead; dragging?: boolean; onClick: () => void; onStageChange: (stage: LeadStage) => void
  selected?: boolean; onToggle?: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lead.id })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'bg-os-s1 border rounded-xl p-3 select-none shadow-sm',
        'hover:shadow-lg hover:shadow-[#4ab6d4]/10 hover:-translate-y-1 hover:border-os-blue/30 transition-all duration-150',
        isDragging && !dragging && 'opacity-30',
        dragging && 'shadow-xl rotate-1 scale-105',
        selected ? 'border-os-blue/60 bg-[#1a2440]' : 'border-os-border',
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        {onToggle && (
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggle}
            onClick={e => e.stopPropagation()}
            className="mt-0.5 w-3.5 h-3.5 rounded border-os-border bg-slate-900 accent-[#2564ea] cursor-pointer flex-shrink-0"
          />
        )}
        <div className="min-w-0 flex-1 cursor-pointer" onClick={onClick}>
          <p className="text-sm font-semibold text-white truncate">{lead.company}</p>
          <p className="text-xs text-slate-500 truncate">{lead.contactName} · {lead.contactRole}</p>
        </div>
        <button {...attributes} {...listeners} className="text-slate-200 hover:text-slate-500 flex-shrink-0 cursor-grab active:cursor-grabbing mt-0.5" onClick={e => e.stopPropagation()}>
          ⋮⋮
        </button>
      </div>

      <div className="flex items-center justify-between mb-2" onClick={onClick}>
        <span className="text-sm font-bold text-slate-200 cursor-pointer">₹{(lead.value / 1000).toFixed(0)}k</span>
        <ScoreDot score={lead.score} />
      </div>

      <div className="flex items-center gap-1.5 flex-wrap" onClick={onClick}>
        <Badge variant={SOURCE_BADGE[lead.source]} size="sm">{lead.source}</Badge>
        <span className="text-[10px] text-slate-500">{lead.probability}% win</span>
      </div>

      <div className="mt-2 pt-2 border-t border-os-border">
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
    <div className="overflow-x-auto rounded-xl border border-os-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-os-border bg-slate-900">
            <th className="w-10 px-3 py-2.5">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleAll}
                className="w-3.5 h-3.5 rounded border-os-border bg-slate-900 accent-[#2564ea]"
              />
            </th>
            <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Company</th>
            <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
            <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Stage</th>
            <th className="px-3 py-2.5 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Value</th>
            <th className="px-3 py-2.5 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Score</th>
            <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Source</th>
            <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Owner</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, i) => (
            <tr
              key={lead.id}
              className={cn(
                'border-b border-os-border transition-colors',
                selected.has(lead.id) ? 'bg-[#1a2440]' : i % 2 === 0 ? 'bg-os-s1' : 'bg-slate-900',
                'hover:bg-[#1E2D4A] cursor-pointer',
              )}
            >
              <td className="px-3 py-2.5" onClick={e => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selected.has(lead.id)}
                  onChange={() => onToggle(lead.id)}
                  className="w-3.5 h-3.5 rounded border-os-border bg-slate-900 accent-[#2564ea]"
                />
              </td>
              <td className="px-3 py-2.5" onClick={() => onOpen(lead.id)}>
                <span className="font-semibold text-white">{lead.company}</span>
              </td>
              <td className="px-3 py-2.5 text-slate-400" onClick={() => onOpen(lead.id)}>
                <span className="truncate max-w-[140px] block">{lead.contactName}</span>
                <span className="text-[11px] text-slate-600">{lead.contactRole}</span>
              </td>
              <td className="px-3 py-2.5" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: STAGE_DOT[lead.stage] }} />
                  <InlineSelect value={lead.stage} options={STAGE_OPTIONS} onChange={s => onStageChange(lead.id, s)} size="sm" />
                </div>
              </td>
              <td className="px-3 py-2.5 text-right font-semibold text-slate-200" onClick={() => onOpen(lead.id)}>
                ₹{(lead.value / 1000).toFixed(0)}k
              </td>
              <td className="px-3 py-2.5 text-right" onClick={() => onOpen(lead.id)}>
                <ScoreDot score={lead.score} />
              </td>
              <td className="px-3 py-2.5" onClick={() => onOpen(lead.id)}>
                <Badge variant={SOURCE_BADGE[lead.source]} size="sm">{lead.source}</Badge>
              </td>
              <td className="px-3 py-2.5 text-slate-400 text-xs" onClick={() => onOpen(lead.id)}>
                {lead.owner.split(' ')[0]}
              </td>
            </tr>
          ))}
          {leads.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-10 text-center text-slate-500 text-sm">No leads match your search</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export function LeadsPipeline() {
  const { leads, moveLeadStage, updateLead, bulkUpdateLeads, bulkDeleteLeads, setSelected, pipelineValue, forecastValue } = useLeadsStore()
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

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

  return (
    <div className="space-y-5">
      <KIMMPSignalBar module="Leads" />
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Lead Pipeline</h2>
          <p className="text-sm text-slate-500 mt-0.5">{leads.length} leads · drag to move stages</p>
        </div>
        <div className="flex items-center gap-2">
          <Input placeholder="Search leads…" prefix={<Search className="w-3.5 h-3.5"/>} className="w-52" value={search} onChange={e => setSearch(e.target.value)} />
          <div className="flex items-center gap-1 bg-os-s1 border border-os-border rounded-lg p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={cn('p-1.5 rounded-md transition-colors', viewMode === 'kanban' ? 'bg-os-blue text-white' : 'text-slate-500 hover:text-white')}
              title="Kanban view"
            >
              <Kanban className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={cn('p-1.5 rounded-md transition-colors', viewMode === 'table' ? 'bg-os-blue text-white' : 'text-slate-500 hover:text-white')}
              title="Table view"
            >
              <LayoutList className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Pipeline Value"  value={`₹${(totalPipeline/1000).toFixed(0)}k`}  icon={<TrendingUp className="w-5 h-5"/>} iconColor="bg-os-blue/10 text-os-blue"  />
        <StatCard label="Forecast Value"  value={`₹${(totalForecast/1000).toFixed(0)}k`}  icon={<TrendingUp className="w-5 h-5"/>} iconColor="bg-amber-100 text-amber-600"     />
        <StatCard label="Won YTD"          value={`₹${(wonValue/1000).toFixed(0)}k`}       icon={<TrendingUp className="w-5 h-5"/>} iconColor="bg-green-100 text-green-600"     />
        <StatCard label="Active Leads"     value={activeCount}                              icon={<TrendingUp className="w-5 h-5"/>} iconColor="bg-os-s1 text-slate-300"     />
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
                <div key={stage.id} className="flex flex-col min-w-[210px] w-[210px]">
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: stage.color }} />
                    <span className="text-xs font-semibold text-slate-300">{stage.label}</span>
                    <span className="ml-auto text-[10px] font-bold text-slate-300 bg-os-s1 rounded-full px-1.5 py-0.5">{stageLeads.length}</span>
                  </div>
                  {stageValue > 0 && (
                    <p className="text-[10px] text-slate-500 mb-2 px-1">₹{(stageValue/1000).toFixed(0)}k</p>
                  )}
                  <SortableContext id={stage.id} items={stageLeads.map(l => l.id)} strategy={verticalListSortingStrategy}>
                    <div className={cn('flex flex-col gap-2 p-2 rounded-xl bg-slate-900 border border-os-border min-h-[100px] flex-1',
                      stageLeads.length === 0 && 'items-center justify-center'
                    )}>
                      {stageLeads.length === 0 && <p className="text-xs text-slate-300 py-4">Drop here</p>}
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
