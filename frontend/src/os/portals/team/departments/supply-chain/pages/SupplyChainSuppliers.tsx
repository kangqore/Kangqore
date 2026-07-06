import { useState } from 'react'
import { Truck } from 'lucide-react'

const ACCENT = '#6366F1'

type SupplierTier   = 'Critical' | 'Primary' | 'Secondary'
type SupplierStatus = 'ACTIVE' | 'REVIEW' | 'INACTIVE'

interface Supplier {
  id: string
  name: string
  tier: SupplierTier
  category: string
  leadTime: number
  qualityScore: number
  onTimeDelivery: number
  contractExpiry: string
  status: SupplierStatus
}

const SUPPLIERS: Supplier[] = [
  { id: 'SUP-001', name: 'Vertex Components',    tier: 'Critical',  category: 'Electronic ICs',  leadTime: 14, qualityScore: 96, onTimeDelivery: 98, contractExpiry: '31 Dec 2026', status: 'ACTIVE' },
  { id: 'SUP-002', name: 'MetalCraft UK',         tier: 'Critical',  category: 'Enclosures',      leadTime: 10, qualityScore: 94, onTimeDelivery: 96, contractExpiry: '30 Jun 2027', status: 'ACTIVE' },
  { id: 'SUP-003', name: 'CircuitPro',            tier: 'Critical',  category: 'PCB Assembly',    leadTime: 18, qualityScore: 97, onTimeDelivery: 95, contractExpiry: '28 Feb 2027', status: 'ACTIVE' },
  { id: 'SUP-004', name: 'WireWorks Ltd',         tier: 'Critical',  category: 'Cables & Looms',  leadTime: 8,  qualityScore: 98, onTimeDelivery: 99, contractExpiry: '31 Mar 2027', status: 'ACTIVE' },
  { id: 'SUP-005', name: 'ThermalTech',           tier: 'Primary',   category: 'Thermal Mgmt',    leadTime: 12, qualityScore: 92, onTimeDelivery: 93, contractExpiry: '31 Oct 2026', status: 'ACTIVE' },
  { id: 'SUP-006', name: 'FastFix UK',            tier: 'Primary',   category: 'Fasteners/Fixings',leadTime: 5,  qualityScore: 95, onTimeDelivery: 97, contractExpiry: '30 Sep 2026', status: 'ACTIVE' },
  { id: 'SUP-007', name: 'ConnectPro',            tier: 'Primary',   category: 'Connectors',      leadTime: 9,  qualityScore: 93, onTimeDelivery: 94, contractExpiry: '31 Jan 2027', status: 'ACTIVE' },
  { id: 'SUP-008', name: 'EcoPackage Solutions',  tier: 'Secondary', category: 'Packaging',       leadTime: 7,  qualityScore: 90, onTimeDelivery: 91, contractExpiry: '31 Aug 2026', status: 'REVIEW' },
]

const TIER_COLOR: Record<SupplierTier, string> = {
  Critical:  '#EF4444',
  Primary:   '#F59E0B',
  Secondary: '#6B7280',
}

const STATUS_COLOR: Record<SupplierStatus, string> = {
  ACTIVE:   '#10B981',
  REVIEW:   '#F59E0B',
  INACTIVE: 'var(--os-text-2)',
}

export function SupplyChainSuppliers() {
  const [filter, setFilter] = useState<'ALL' | SupplierTier>('ALL')

  const critical  = SUPPLIERS.filter(s => s.tier === 'Critical').length
  const avgLead   = Math.round(SUPPLIERS.reduce((a, s) => a + s.leadTime, 0) / SUPPLIERS.length)
  const avgOnTime = Math.round(SUPPLIERS.reduce((a, s) => a + s.onTimeDelivery, 0) / SUPPLIERS.length)

  const tabs: Array<{ key: typeof filter; label: string }> = [
    { key: 'ALL',       label: 'All' },
    { key: 'Critical',  label: 'Critical' },
    { key: 'Primary',   label: 'Primary' },
    { key: 'Secondary', label: 'Secondary' },
  ]

  const visible = filter === 'ALL' ? SUPPLIERS : SUPPLIERS.filter(s => s.tier === filter)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Truck size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Suppliers</h1>
          <p className="text-sm text-[var(--os-text-2)]">Supplier performance, tiers, and contract health — 37 total suppliers</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Suppliers', value: '37',             color: ACCENT    },
          { label: 'Critical Tier',    value: String(critical), color: '#EF4444' },
          { label: 'Avg Lead Time',    value: `${avgLead}d`,    color: '#F59E0B' },
          { label: 'Avg On-Time',      value: `${avgOnTime}%`,  color: '#10B981' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === t.key
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800/60 text-[var(--os-text-2)] hover:text-[var(--os-text-1)] border border-white/10'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Supplier List */}
      <div className="space-y-2">
        {visible.map(s => {
          const tc = TIER_COLOR[s.tier]
          const sc = STATUS_COLOR[s.status]
          return (
            <div
              key={s.id}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${tc}22`, color: tc }}>
                    {s.tier}
                  </span>
                  <span className="text-xs text-[var(--os-text-2)]">{s.category}</span>
                </div>
                <p className="text-sm font-semibold text-white">{s.name}</p>
                <p className="text-xs text-[var(--os-text-2)] mt-0.5">Contract expires: {s.contractExpiry}</p>
              </div>
              <div className="text-right w-20 shrink-0 hidden sm:block">
                <p className="text-xs text-[var(--os-text-2)]">Lead Time</p>
                <p className="text-sm font-semibold text-white">{s.leadTime}d</p>
              </div>
              <div className="text-right w-20 shrink-0 hidden md:block">
                <p className="text-xs text-[var(--os-text-2)]">Quality</p>
                <p className="text-sm font-semibold" style={{ color: s.qualityScore >= 95 ? '#10B981' : '#F59E0B' }}>
                  {s.qualityScore}%
                </p>
              </div>
              <div className="text-right w-20 shrink-0 hidden lg:block">
                <p className="text-xs text-[var(--os-text-2)]">On-Time</p>
                <p className="text-sm font-semibold" style={{ color: s.onTimeDelivery >= 95 ? '#10B981' : '#F59E0B' }}>
                  {s.onTimeDelivery}%
                </p>
              </div>
              <div className="w-20 text-right shrink-0">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>
                  {s.status.charAt(0) + s.status.slice(1).toLowerCase()}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
