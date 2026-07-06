import { useState } from 'react'
import { Factory } from 'lucide-react'

const ACCENT = '#6366F1'

type ProdStatus = 'ON_SCHEDULE' | 'AT_RISK' | 'BEHIND' | 'COMPLETED'

interface ProductionOrder {
  id: string
  product: string
  batchNumber: string
  targetQty: number
  completedQty: number
  line: string
  status: ProdStatus
  targetDate: string
}

const ORDERS: ProductionOrder[] = [
  { id: 'PO-P0214', product: 'Control Unit Model X',  batchNumber: 'BX-2026-041', targetQty: 500,  completedQty: 480, line: 'Line 1',  status: 'ON_SCHEDULE', targetDate: '28 Jun 2026' },
  { id: 'PO-P0213', product: 'Sensor Array v3',        batchNumber: 'SA-2026-038', targetQty: 1200, completedQty: 810, line: 'Line 2',  status: 'AT_RISK',     targetDate: '30 Jun 2026' },
  { id: 'PO-P0212', product: 'Power Supply Unit 24V',  batchNumber: 'PS-2026-036', targetQty: 300,  completedQty: 115, line: 'Line 3',  status: 'BEHIND',      targetDate: '25 Jun 2026' },
  { id: 'PO-P0211', product: 'Enclosure Assembly B',   batchNumber: 'EA-2026-034', targetQty: 800,  completedQty: 800, line: 'Line 1',  status: 'COMPLETED',   targetDate: '20 Jun 2026' },
  { id: 'PO-P0210', product: 'Thermal Module TM-12',   batchNumber: 'TM-2026-033', targetQty: 400,  completedQty: 400, line: 'Line 4',  status: 'COMPLETED',   targetDate: '18 Jun 2026' },
  { id: 'PO-P0209', product: 'Control Unit Model X',  batchNumber: 'BX-2026-040', targetQty: 500,  completedQty: 342, line: 'Line 2',  status: 'ON_SCHEDULE', targetDate: '05 Jul 2026' },
  { id: 'PO-P0208', product: 'Connector Kit CK-8',     batchNumber: 'CK-2026-031', targetQty: 2000, completedQty: 1840, line: 'Line 3', status: 'ON_SCHEDULE', targetDate: '03 Jul 2026' },
  { id: 'PO-P0207', product: 'Firmware Flash Unit v2', batchNumber: 'FF-2026-029', targetQty: 150,  completedQty: 12,  line: 'Line 4', status: 'BEHIND',       targetDate: '22 Jun 2026' },
]

const STATUS_COLOR: Record<ProdStatus, string> = {
  ON_SCHEDULE: '#10B981',
  AT_RISK:     '#F59E0B',
  BEHIND:      '#EF4444',
  COMPLETED:   'var(--os-text-2)',
}

const STATUS_LABEL: Record<ProdStatus, string> = {
  ON_SCHEDULE: 'On Schedule',
  AT_RISK:     'At Risk',
  BEHIND:      'Behind',
  COMPLETED:   'Completed',
}

export function SupplyChainProduction() {
  const [filter, setFilter] = useState<'ALL' | ProdStatus>('ALL')

  const active     = ORDERS.filter(o => o.status !== 'COMPLETED').length
  const onSchedule = ORDERS.filter(o => o.status === 'ON_SCHEDULE').length
  const behind     = ORDERS.filter(o => o.status === 'BEHIND').length
  const atRisk     = ORDERS.filter(o => o.status === 'AT_RISK').length
  const completionRate = Math.round((ORDERS.filter(o => o.status !== 'BEHIND' && o.status !== 'AT_RISK').length / ORDERS.length) * 100)

  const tabs: Array<{ key: typeof filter; label: string }> = [
    { key: 'ALL',         label: 'All' },
    { key: 'ON_SCHEDULE', label: 'On Schedule' },
    { key: 'AT_RISK',     label: 'At Risk' },
    { key: 'BEHIND',      label: 'Behind' },
    { key: 'COMPLETED',   label: 'Completed' },
  ]

  const visible = filter === 'ALL' ? ORDERS : ORDERS.filter(o => o.status === filter)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Factory size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Production Orders</h1>
          <p className="text-sm text-[var(--os-text-2)]">Active manufacturing runs, batch progress & schedule status</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Orders',    value: String(active),           color: ACCENT    },
          { label: 'On Schedule',      value: String(onSchedule),       color: '#10B981' },
          { label: 'Behind',           value: String(behind + atRisk),  color: '#EF4444' },
          { label: 'Completion Rate',  value: `${completionRate}%`,     color: '#10B981' },
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

      {/* Order List */}
      <div className="space-y-2">
        {visible.map(o => {
          const sc  = STATUS_COLOR[o.status]
          const pct = Math.round((o.completedQty / o.targetQty) * 100)
          return (
            <div
              key={o.id}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xs font-mono text-[var(--os-text-2)]">{o.id}</p>
                  <span className="text-xs text-[var(--os-text-2)]">{o.batchNumber}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">
                    {o.line}
                  </span>
                </div>
                <p className="text-sm font-semibold text-white">{o.product}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 max-w-32 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: sc }} />
                  </div>
                  <p className="text-xs text-[var(--os-text-2)]">{o.completedQty.toLocaleString()} / {o.targetQty.toLocaleString()} ({pct}%)</p>
                </div>
              </div>
              <div className="text-right w-28 shrink-0 hidden md:block">
                <p className="text-xs text-[var(--os-text-2)]">Target Date</p>
                <p className="text-xs font-semibold" style={{ color: o.status === 'BEHIND' ? '#EF4444' : '#94A3B8' }}>{o.targetDate}</p>
              </div>
              <div className="w-28 text-right shrink-0">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>
                  {STATUS_LABEL[o.status]}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
