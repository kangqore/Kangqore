import { useState } from 'react'
import { Brain, AlertTriangle, ChevronRight, Layers } from 'lucide-react'

type EntityType = 'Client' | 'Project' | 'Resource' | 'Vendor' | 'Finance' | 'Contract'
type RiskLevel = 'critical' | 'elevated' | 'normal'

interface GraphEntity {
  id: string
  name: string
  type: EntityType
  risk: RiskLevel
  openIssues: number
  activeChanges: number
  kimmpSignals: string[]
  connections: string[]
}

const ENTITIES: GraphEntity[] = [
  {
    id: 'E-001',
    name: 'Synapse Health',
    type: 'Client',
    risk: 'critical',
    openIssues: 1,
    activeChanges: 2,
    kimmpSignals: ['Delivery milestone at risk', 'Sprint velocity -34%'],
    connections: ['E-003', 'E-007', 'E-009'],
  },
  {
    id: 'E-002',
    name: 'Meridian Logistics',
    type: 'Client',
    risk: 'critical',
    openIssues: 2,
    activeChanges: 0,
    kimmpSignals: ['Pre-churn pattern detected', 'Invoice overdue 18 days', 'No engagement 22 days'],
    connections: ['E-008', 'E-010'],
  },
  {
    id: 'E-003',
    name: 'Project Phoenix',
    type: 'Project',
    risk: 'critical',
    openIssues: 1,
    activeChanges: 1,
    kimmpSignals: ['Delivery blocked on E-006', 'Sprint 14 milestone overdue'],
    connections: ['E-001', 'E-006', 'E-007'],
  },
  {
    id: 'E-004',
    name: 'Project Atlas',
    type: 'Project',
    risk: 'elevated',
    openIssues: 0,
    activeChanges: 1,
    kimmpSignals: ['Competing for E-006 allocation weeks 26–28'],
    connections: ['E-006', 'E-007'],
  },
  {
    id: 'E-005',
    name: 'GlobalTech Infra',
    type: 'Vendor',
    risk: 'normal',
    openIssues: 0,
    activeChanges: 0,
    kimmpSignals: ['No active signals'],
    connections: ['E-003', 'E-004'],
  },
  {
    id: 'E-006',
    name: 'Aarav Shah',
    type: 'Resource',
    risk: 'critical',
    openIssues: 1,
    activeChanges: 0,
    kimmpSignals: ['140% allocated weeks 26–28', 'P1 delivery dependency in Project Phoenix'],
    connections: ['E-003', 'E-004'],
  },
  {
    id: 'E-007',
    name: 'Engineering Team',
    type: 'Resource',
    risk: 'elevated',
    openIssues: 0,
    activeChanges: 0,
    kimmpSignals: ['Velocity trend -22% over 3 sprints'],
    connections: ['E-003', 'E-004', 'E-006'],
  },
  {
    id: 'E-008',
    name: 'Meridian MSA',
    type: 'Contract',
    risk: 'elevated',
    openIssues: 1,
    activeChanges: 0,
    kimmpSignals: ['Renewal in 47 days', 'Churn risk elevated on parent entity'],
    connections: ['E-002', 'E-010'],
  },
  {
    id: 'E-009',
    name: 'Synapse Retainer',
    type: 'Contract',
    risk: 'critical',
    openIssues: 1,
    activeChanges: 0,
    kimmpSignals: ['Milestone breach triggers penalty clause', 'Review in 5 days'],
    connections: ['E-001', 'E-003'],
  },
  {
    id: 'E-010',
    name: 'AR Outstanding',
    type: 'Finance',
    risk: 'critical',
    openIssues: 1,
    activeChanges: 0,
    kimmpSignals: ['₹8.4L overdue >30 days', 'Cash flow critical in 47 days if unresolved'],
    connections: ['E-002', 'E-008'],
  },
]

const ENTITY_COLOR: Record<EntityType, string> = {
  Client:   '#00c875',
  Project:  '#2564ea',
  Resource: '#7f53f9',
  Vendor:   '#64748b',
  Finance:  '#fdab3d',
  Contract: '#e2445c',
}

const RISK_COLOR: Record<RiskLevel, string> = {
  critical: '#e2445c',
  elevated: '#fdab3d',
  normal:   '#00c875',
}

function EntityCard({ entity, selected, onSelect }: { entity: GraphEntity; selected: boolean; onSelect: () => void }) {
  const typeColor = ENTITY_COLOR[entity.type]
  const riskColor = RISK_COLOR[entity.risk]

  return (
    <button onClick={onSelect}
      className="w-full text-left rounded-xl p-3.5 transition-all"
      style={{
        background: selected ? `${typeColor}0c` : '#0d1117',
        border: `1px solid ${selected ? typeColor + '40' : '#2E2854'}`,
        borderLeft: `3px solid ${riskColor}`,
      }}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
              style={{ color: typeColor, background: `${typeColor}14`, border: `1px solid ${typeColor}25` }}>
              {entity.type}
            </span>
            {entity.openIssues > 0 && (
              <span className="flex items-center gap-0.5 text-[9px] font-bold"
                style={{ color: riskColor }}>
                <AlertTriangle className="w-2.5 h-2.5" />
                {entity.openIssues}
              </span>
            )}
          </div>
          <p className="text-[13px] font-semibold text-white leading-tight">{entity.name}</p>
          <p className="text-[10px] text-slate-600 mt-0.5">{entity.connections.length} connections</p>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-slate-700 flex-shrink-0 mt-1" />
      </div>
    </button>
  )
}

function EntityDetail({ entity }: { entity: GraphEntity }) {
  const typeColor = ENTITY_COLOR[entity.type]
  const riskColor = RISK_COLOR[entity.risk]
  const connected = entity.connections.map(id => ENTITIES.find(e => e.id === id)).filter(Boolean) as GraphEntity[]

  return (
    <div className="rounded-xl overflow-hidden h-full"
      style={{ background: '#0d1117', border: '1px solid #2E2854' }}>
      <div className="p-4 border-b border-[#1f2a4a]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
            style={{ color: typeColor, background: `${typeColor}14`, border: `1px solid ${typeColor}25` }}>
            {entity.type}
          </span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded capitalize"
            style={{ color: riskColor, background: `${riskColor}10`, border: `1px solid ${riskColor}28` }}>
            {entity.risk}
          </span>
          <span className="text-[9px] text-slate-600">{entity.id}</span>
        </div>
        <p className="text-base font-bold text-white">{entity.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-px border-b border-[#1f2a4a]" style={{ background: '#1f2a4a' }}>
        <div className="px-4 py-3 bg-[#0d1117]">
          <p className="text-lg font-bold tabular-nums" style={{ color: entity.openIssues > 0 ? '#e2445c' : '#00c875' }}>
            {entity.openIssues}
          </p>
          <p className="text-[10px] text-slate-600">Open Issues</p>
        </div>
        <div className="px-4 py-3 bg-[#0d1117]">
          <p className="text-lg font-bold text-white tabular-nums">{entity.activeChanges}</p>
          <p className="text-[10px] text-slate-600">Active Changes</p>
        </div>
      </div>

      {/* KIMMP Signals */}
      <div className="p-4 border-b border-[#1f2a4a]">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Brain className="w-3.5 h-3.5 text-purple-400" />
          <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">KIMMP Active Signals</p>
        </div>
        <ul className="space-y-1.5">
          {entity.kimmpSignals.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-[11px] text-slate-300">
              <span className="w-1 h-1 rounded-full bg-purple-500 flex-shrink-0 mt-1.5" />
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Connections */}
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Layers className="w-3.5 h-3.5 text-slate-500" />
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Connected Entities</p>
        </div>
        <div className="space-y-1.5">
          {connected.map(c => (
            <div key={c.id} className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: '#111827', border: '1px solid #1f2a4a' }}>
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: RISK_COLOR[c.risk], boxShadow: `0 0 4px ${RISK_COLOR[c.risk]}40` }} />
              <span className="text-[11px] font-semibold text-slate-300 flex-1">{c.name}</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                style={{ color: ENTITY_COLOR[c.type], background: `${ENTITY_COLOR[c.type]}14` }}>
                {c.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function EntityGraphPage() {
  const [selected, setSelected] = useState<string>('E-001')
  const selectedEntity = ENTITIES.find(e => e.id === selected)!
  const criticalCount = ENTITIES.filter(e => e.risk === 'critical').length

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="rounded-xl p-3.5 flex items-start gap-3"
        style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.12)' }}>
        <Brain className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="text-[11px] font-bold text-purple-300">Business Entity Graph</span>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
            {criticalCount} entities at critical risk. Click any entity to see active KIMMP signals, open issues, and dependency connections.
            Disruption on a critical-risk entity propagates to all connected nodes.
          </p>
        </div>
      </div>

      {/* Filter strip */}
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(ENTITY_COLOR) as EntityType[]).map(t => (
          <span key={t} className="text-[10px] font-bold px-2.5 py-1 rounded-lg"
            style={{ color: ENTITY_COLOR[t], background: `${ENTITY_COLOR[t]}10`, border: `1px solid ${ENTITY_COLOR[t]}20` }}>
            {t}s: {ENTITIES.filter(e => e.type === t).length}
          </span>
        ))}
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-5 gap-4" style={{ minHeight: 520 }}>
        {/* Entity list */}
        <div className="col-span-2 space-y-2 overflow-y-auto pr-1" style={{ maxHeight: 540 }}>
          {ENTITIES.map(e => (
            <EntityCard key={e.id} entity={e} selected={selected === e.id} onSelect={() => setSelected(e.id)} />
          ))}
        </div>

        {/* Detail panel */}
        <div className="col-span-3">
          <EntityDetail entity={selectedEntity} />
        </div>
      </div>
    </div>
  )
}
