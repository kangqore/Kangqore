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
import { TrendingUp, Search } from 'lucide-react'
import { Badge } from '@design-system/components/Badge'
import { StatCard } from '@design-system/components/StatCard'
import { Input } from '@design-system/components/Input'
import { cn } from '@design-system/cn'
import { InlineSelect } from '@components/InlineSelect'
import { useLeadsStore } from '../store'
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

function ScoreDot({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-amber-400' : 'bg-slate-300'
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-xs font-bold text-slate-700">{score}</span>
    </div>
  )
}

function LeadCard({
  lead, dragging = false, onClick, onStageChange,
}: {
  lead: Lead; dragging?: boolean; onClick: () => void; onStageChange: (stage: LeadStage) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lead.id })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'bg-white border border-slate-200 rounded-xl p-3 cursor-pointer select-none shadow-sm',
        'hover:shadow-md hover:border-[#2564ea]/30 transition-all duration-150',
        isDragging && !dragging && 'opacity-30',
        dragging && 'shadow-xl rotate-1 scale-105',
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{lead.company}</p>
          <p className="text-xs text-slate-400 truncate">{lead.contactName} · {lead.contactRole}</p>
        </div>
        <button {...attributes} {...listeners} className="text-slate-200 hover:text-slate-400 flex-shrink-0 cursor-grab active:cursor-grabbing mt-0.5" onClick={e => e.stopPropagation()}>
          ⋮⋮
        </button>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-slate-800">£{(lead.value / 1000).toFixed(0)}k</span>
        <ScoreDot score={lead.score} />
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <Badge variant={SOURCE_BADGE[lead.source]} size="sm">{lead.source}</Badge>
        <span className="text-[10px] text-slate-400">{lead.probability}% win</span>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-100">
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

export function LeadsPipeline() {
  const { leads, moveLeadStage, setSelected, pipelineValue, forecastValue } = useLeadsStore()
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

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

  function openLead(id: string) { setSelected(id); navigate('/os/leads/profile') }

  const totalPipeline  = pipelineValue()
  const totalForecast  = forecastValue()
  const wonValue       = leads.filter(l => l.stage === 'won').reduce((s, l) => s + l.value, 0)
  const activeCount    = filteredLeads.filter(l => !['won','lost'].includes(l.stage)).length

  return (
    <div className="space-y-5">
      <KIMMPSignalBar module="Leads" />
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Lead Pipeline</h2>
          <p className="text-sm text-slate-500 mt-0.5">{leads.length} leads · drag to move stages</p>
        </div>
        <Input placeholder="Search leads…" prefix={<Search className="w-3.5 h-3.5"/>} className="w-52" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Pipeline Value"  value={`£${(totalPipeline/1000).toFixed(0)}k`}  icon={<TrendingUp className="w-5 h-5"/>} iconColor="bg-[#2564ea]/10 text-[#2564ea]"  />
        <StatCard label="Forecast Value"  value={`£${(totalForecast/1000).toFixed(0)}k`}  icon={<TrendingUp className="w-5 h-5"/>} iconColor="bg-amber-100 text-amber-600"     />
        <StatCard label="Won YTD"          value={`£${(wonValue/1000).toFixed(0)}k`}       icon={<TrendingUp className="w-5 h-5"/>} iconColor="bg-green-100 text-green-600"     />
        <StatCard label="Active Leads"     value={activeCount}                              icon={<TrendingUp className="w-5 h-5"/>} iconColor="bg-slate-100 text-slate-500"     />
      </div>

      {/* Pipeline board */}
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-4">
          {STAGES.map(stage => {
            const stageLeads = filteredLeads.filter(l => l.stage === stage.id)
            const stageValue = stageLeads.reduce((s, l) => s + l.value, 0)
            return (
              <div key={stage.id} className="flex flex-col min-w-[210px] w-[210px]">
                <div className="flex items-center gap-2 mb-2 px-1">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: stage.color }} />
                  <span className="text-xs font-semibold text-slate-700">{stage.label}</span>
                  <span className="ml-auto text-[10px] font-bold text-slate-400 bg-slate-100 rounded-full px-1.5 py-0.5">{stageLeads.length}</span>
                </div>
                {stageValue > 0 && (
                  <p className="text-[10px] text-slate-400 mb-2 px-1">£{(stageValue/1000).toFixed(0)}k</p>
                )}
                <SortableContext id={stage.id} items={stageLeads.map(l => l.id)} strategy={verticalListSortingStrategy}>
                  <div className={cn('flex flex-col gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 min-h-[100px] flex-1',
                    stageLeads.length === 0 && 'items-center justify-center'
                  )}>
                    {stageLeads.length === 0 && <p className="text-xs text-slate-300 py-4">Drop here</p>}
                    {stageLeads.map(lead => (
                      <LeadCard
                        key={lead.id}
                        lead={lead}
                        onClick={() => openLead(lead.id)}
                        onStageChange={stage => moveLeadStage(lead.id, stage)}
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
    </div>
  )
}
