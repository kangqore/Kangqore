import { useState } from 'react'
import { Package } from 'lucide-react'

const ACCENT = '#6366F1'

type InvStatus = 'OK' | 'LOW' | 'CRITICAL' | 'OUT_OF_STOCK'

interface InventoryItem {
  sku: string
  name: string
  category: string
  currentStock: number
  reorderPoint: number
  daysRemaining: number
  supplier: string
  status: InvStatus
}

const INVENTORY: InventoryItem[] = [
  { sku: 'CMP-X001', name: 'Component X — Main Logic IC',    category: 'Electronic',  currentStock: 48,    reorderPoint: 200,  daysRemaining: 6,  supplier: 'Vertex Components', status: 'CRITICAL'     },
  { sku: 'CMP-A012', name: 'Aluminium Enclosure Shell',      category: 'Mechanical',  currentStock: 124,   reorderPoint: 150,  daysRemaining: 14, supplier: 'MetalCraft UK',     status: 'LOW'          },
  { sku: 'PCB-M004', name: 'Main PCB Assembly v4',           category: 'Electronic',  currentStock: 312,   reorderPoint: 100,  daysRemaining: 38, supplier: 'CircuitPro',        status: 'OK'           },
  { sku: 'CAB-P022', name: 'Power Cable 24V DC (1.5m)',      category: 'Cable',       currentStock: 890,   reorderPoint: 200,  daysRemaining: 45, supplier: 'WireWorks Ltd',     status: 'OK'           },
  { sku: 'SEN-T008', name: 'Temperature Sensor NTC-10K',     category: 'Electronic',  currentStock: 0,     reorderPoint: 500,  daysRemaining: 0,  supplier: 'Vertex Components', status: 'OUT_OF_STOCK' },
  { sku: 'FAS-S019', name: 'M3 Stainless Fixings (×500pk)',  category: 'Fasteners',   currentStock: 3200,  reorderPoint: 500,  daysRemaining: 64, supplier: 'FastFix UK',        status: 'OK'           },
  { sku: 'THM-M003', name: 'Thermal Interface Pad 0.5mm',    category: 'Thermal',     currentStock: 180,   reorderPoint: 200,  daysRemaining: 18, supplier: 'ThermalTech',       status: 'LOW'          },
  { sku: 'CON-K008', name: 'Connector Kit CK-8 (×50pk)',     category: 'Connector',   currentStock: 420,   reorderPoint: 100,  daysRemaining: 52, supplier: 'ConnectPro',        status: 'OK'           },
]

const STATUS_COLOR: Record<InvStatus, string> = {
  OK:            '#10B981',
  LOW:           '#F59E0B',
  CRITICAL:      '#EF4444',
  OUT_OF_STOCK:  '#7C3AED',
}

const STATUS_LABEL: Record<InvStatus, string> = {
  OK:            'OK',
  LOW:           'Low',
  CRITICAL:      'Critical',
  OUT_OF_STOCK:  'Out of Stock',
}

const CAT_COLOR: Record<string, string> = {
  Electronic: '#6366F1',
  Mechanical: '#F97316',
  Cable:      '#06B6D4',
  Fasteners:  '#10B981',
  Thermal:    '#F59E0B',
  Connector:  '#8B5CF6',
}

export function SupplyChainInventory() {
  const [filter, setFilter] = useState<'ALL' | InvStatus>('ALL')

  const alerts      = INVENTORY.filter(i => i.status === 'CRITICAL' || i.status === 'OUT_OF_STOCK').length
  const reorderPend = INVENTORY.filter(i => i.status !== 'OK').length
  const avgDays     = Math.round(INVENTORY.filter(i => i.daysRemaining > 0).reduce((a, i) => a + i.daysRemaining, 0) / INVENTORY.filter(i => i.daysRemaining > 0).length)

  const tabs: Array<{ key: typeof filter; label: string }> = [
    { key: 'ALL',           label: 'All' },
    { key: 'CRITICAL',      label: 'Critical' },
    { key: 'LOW',           label: 'Low' },
    { key: 'OUT_OF_STOCK',  label: 'Out of Stock' },
    { key: 'OK',            label: 'OK' },
  ]

  const visible = filter === 'ALL' ? INVENTORY : INVENTORY.filter(i => i.status === filter)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Package size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Inventory</h1>
          <p className="text-sm text-[var(--os-text-2)]">Stock levels, reorder alerts & supply status across 142 SKUs</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'SKUs Tracked',      value: '142',           color: ACCENT    },
          { label: 'Stock Alerts',      value: String(alerts),  color: '#EF4444' },
          { label: 'Reorder Pending',   value: String(reorderPend), color: '#F59E0B' },
          { label: 'Days Coverage Avg', value: `${avgDays}d`,   color: '#10B981' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Critical Alert */}
      <div className="p-4 rounded-2xl border border-red-500/30 bg-red-500/10 flex items-start gap-3">
        <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0 animate-pulse" />
        <div>
          <p className="text-sm font-bold text-red-400">CRITICAL — Component X down to 48 units (6 days remaining)</p>
          <p className="text-xs text-[var(--os-text-2)] mt-0.5">Emergency PO raised (PROC-0094). Temperature Sensor NTC-10K is completely out of stock — Line 2 at risk of stoppage.</p>
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

      {/* Inventory List */}
      <div className="space-y-2">
        {visible
          .sort((a, b) => {
            const order: Record<InvStatus, number> = { OUT_OF_STOCK: 0, CRITICAL: 1, LOW: 2, OK: 3 }
            return order[a.status] - order[b.status]
          })
          .map(item => {
            const sc = STATUS_COLOR[item.status]
            const cc = CAT_COLOR[item.category] ?? '#94A3B8'
            const pct = item.reorderPoint > 0 ? Math.min(Math.round((item.currentStock / item.reorderPoint) * 100), 200) : 100
            return (
              <div
                key={item.sku}
                className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
                style={item.status === 'CRITICAL' || item.status === 'OUT_OF_STOCK' ? { borderColor: '#EF444430' } : {}}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-xs font-mono text-[var(--os-text-2)]">{item.sku}</p>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${cc}22`, color: cc }}>
                      {item.category}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white">{item.name}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="w-24 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: sc }} />
                    </div>
                    <p className="text-xs text-[var(--os-text-2)]">{item.currentStock.toLocaleString()} units (reorder at {item.reorderPoint.toLocaleString()})</p>
                  </div>
                </div>
                <div className="text-right w-24 shrink-0 hidden sm:block">
                  <p className="text-xs text-[var(--os-text-2)]">Days Left</p>
                  <p className="text-sm font-bold" style={{ color: item.daysRemaining <= 7 ? '#EF4444' : item.daysRemaining <= 14 ? '#F59E0B' : '#10B981' }}>
                    {item.daysRemaining > 0 ? `${item.daysRemaining}d` : 'None'}
                  </p>
                </div>
                <div className="text-right w-28 shrink-0 hidden md:block">
                  <p className="text-xs text-[var(--os-text-2)]">Supplier</p>
                  <p className="text-xs text-[var(--os-text-1)]">{item.supplier}</p>
                </div>
                <div className="w-28 text-right shrink-0">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>
                    {STATUS_LABEL[item.status]}
                  </span>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
