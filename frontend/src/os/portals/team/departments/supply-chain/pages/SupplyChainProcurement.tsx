import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'

const ACCENT = '#6366F1'

type POStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'DELIVERED' | 'OVERDUE'

interface PurchaseOrder {
  id: string
  supplier: string
  description: string
  value: number
  submitted: string
  expectedDelivery: string
  status: POStatus
  isEmergency?: boolean
}

const PURCHASE_ORDERS: PurchaseOrder[] = [
  { id: 'PROC-0094', supplier: 'Vertex Components',    description: 'EMERGENCY: Component X Main Logic IC — 500 units',     value: 42000, submitted: '22 Jun 2026', expectedDelivery: '28 Jun 2026', status: 'APPROVED',        isEmergency: true },
  { id: 'PROC-0093', supplier: 'Vertex Components',    description: 'Temperature Sensor NTC-10K — 1000 units (stockout)',   value: 8500,  submitted: '22 Jun 2026', expectedDelivery: '30 Jun 2026', status: 'PENDING_APPROVAL', isEmergency: true },
  { id: 'PROC-0092', supplier: 'MetalCraft UK',        description: 'Aluminium Enclosure Shell — 400 units Q3 stock',      value: 18200, submitted: '19 Jun 2026', expectedDelivery: '10 Jul 2026', status: 'PENDING_APPROVAL' },
  { id: 'PROC-0091', supplier: 'ThermalTech',          description: 'Thermal Interface Pad 0.5mm — 1000 units',            value: 3400,  submitted: '18 Jun 2026', expectedDelivery: '08 Jul 2026', status: 'PENDING_APPROVAL' },
  { id: 'PROC-0090', supplier: 'CircuitPro',           description: 'Main PCB Assembly v4 — 200 units batch',              value: 76000, submitted: '15 Jun 2026', expectedDelivery: '04 Jul 2026', status: 'APPROVED'         },
  { id: 'PROC-0089', supplier: 'WireWorks Ltd',        description: 'Power Cable 24V DC 1.5m — 2000 units',               value: 5800,  submitted: '14 Jun 2026', expectedDelivery: '25 Jun 2026', status: 'OVERDUE'          },
  { id: 'PROC-0088', supplier: 'FastFix UK',           description: 'M3 Stainless Fixings ×500pk — 20 packs',             value: 980,   submitted: '12 Jun 2026', expectedDelivery: '20 Jun 2026', status: 'DELIVERED'        },
  { id: 'PROC-0087', supplier: 'EcoPackage Solutions', description: 'Retail packaging — Q3 production run (10K units)',    value: 14200, submitted: '10 Jun 2026', expectedDelivery: '28 Jun 2026', status: 'DRAFT'            },
]

const STATUS_COLOR: Record<POStatus, string> = {
  DRAFT:            '#6B7280',
  PENDING_APPROVAL: '#F59E0B',
  APPROVED:         '#2564ea',
  DELIVERED:        '#10B981',
  OVERDUE:          '#EF4444',
}

const STATUS_LABEL: Record<POStatus, string> = {
  DRAFT:            'Draft',
  PENDING_APPROVAL: 'Pending Approval',
  APPROVED:         'Approved',
  DELIVERED:        'Delivered',
  OVERDUE:          'Overdue',
}

function fmtVal(n: number) {
  if (n >= 1000) return `£${(n / 1000).toFixed(1)}K`
  return `£${n}`
}

export function SupplyChainProcurement() {
  const [filter, setFilter] = useState<'ALL' | POStatus>('ALL')

  const openPOs       = PURCHASE_ORDERS.filter(p => p.status !== 'DELIVERED').length
  const pendingAppr   = PURCHASE_ORDERS.filter(p => p.status === 'PENDING_APPROVAL').length
  const totalValue    = PURCHASE_ORDERS.filter(p => p.status !== 'DELIVERED').reduce((a, p) => a + p.value, 0)
  const overdue       = PURCHASE_ORDERS.filter(p => p.status === 'OVERDUE').length

  const tabs: Array<{ key: typeof filter; label: string }> = [
    { key: 'ALL',              label: 'All' },
    { key: 'PENDING_APPROVAL', label: 'Pending Approval' },
    { key: 'APPROVED',         label: 'Approved' },
    { key: 'OVERDUE',          label: 'Overdue' },
    { key: 'DELIVERED',        label: 'Delivered' },
  ]

  const visible = filter === 'ALL' ? PURCHASE_ORDERS : PURCHASE_ORDERS.filter(p => p.status === filter)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <ShoppingCart size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Procurement</h1>
          <p className="text-sm text-[var(--os-text-2)]">Purchase orders, approvals & supplier deliveries</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Open POs',          value: String(openPOs),     color: ACCENT    },
          { label: 'Pending Approval',  value: String(pendingAppr), color: '#F59E0B' },
          { label: 'Total Value',       value: fmtVal(totalValue),  color: '#10B981' },
          { label: 'Overdue Delivery',  value: String(overdue),     color: '#EF4444' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Emergency Alert */}
      <div className="p-4 rounded-2xl border border-red-500/30 bg-red-500/10 flex items-start gap-3">
        <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0 animate-pulse" />
        <div>
          <p className="text-sm font-bold text-red-400">EMERGENCY PO raised — PROC-0094 (Component X) approved for expedited delivery</p>
          <p className="text-xs text-[var(--os-text-2)] mt-0.5">PROC-0093 (Temperature Sensor) awaiting CFO approval. Both are critical to prevent production stoppage.</p>
        </div>
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

      {/* PO List */}
      <div className="space-y-2">
        {visible.map(po => {
          const sc = STATUS_COLOR[po.status]
          return (
            <div
              key={po.id}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
              style={po.isEmergency ? { borderColor: '#EF444430' } : {}}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xs font-mono text-[var(--os-text-2)]">{po.id}</p>
                  {po.isEmergency && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                      EMERGENCY
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-white truncate">{po.description}</p>
                <p className="text-xs text-[var(--os-text-2)] mt-0.5">{po.supplier} · Submitted {po.submitted}</p>
              </div>
              <div className="text-right w-24 shrink-0 hidden sm:block">
                <p className="text-xs text-[var(--os-text-2)]">Value</p>
                <p className="text-sm font-bold text-white">{fmtVal(po.value)}</p>
              </div>
              <div className="text-right w-28 shrink-0 hidden md:block">
                <p className="text-xs text-[var(--os-text-2)]">Exp. Delivery</p>
                <p className="text-xs font-semibold" style={{ color: po.status === 'OVERDUE' ? '#EF4444' : '#94A3B8' }}>{po.expectedDelivery}</p>
              </div>
              <div className="w-32 text-right shrink-0">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap" style={{ background: `${sc}22`, color: sc }}>
                  {STATUS_LABEL[po.status]}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
