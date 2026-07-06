import { Anchor } from 'lucide-react'

const ACCENT = '#6366F1'

type ShipmentStatus = 'IN_TRANSIT' | 'DELIVERED' | 'DELAYED' | 'CUSTOMS_HOLD'

interface Shipment {
  id: string
  origin: string
  destination: string
  carrier: string
  departed: string
  eta: string
  status: ShipmentStatus
  contents: string
  notes?: string
}

const SHIPMENTS: Shipment[] = [
  { id: 'SHP-0091', origin: 'Shenzhen, CN',    destination: 'London, UK',     carrier: 'DHL Express',    departed: '18 Jun 2026', eta: '25 Jun 2026', status: 'IN_TRANSIT',   contents: 'Component X — 500 units (PROC-0094)',   notes: 'Expedited air freight. Track via DHL-7842910.' },
  { id: 'SHP-0090', origin: 'Birmingham, UK',  destination: 'London, UK',     carrier: 'Palletline',     departed: '21 Jun 2026', eta: '24 Jun 2026', status: 'IN_TRANSIT',   contents: 'Aluminium Enclosure Shells — 300 units' },
  { id: 'SHP-0089', origin: 'Rotterdam, NL',   destination: 'Manchester, UK', carrier: 'FedEx',          departed: '14 Jun 2026', eta: '23 Jun 2026', status: 'DELAYED',      contents: 'Power Cable 24V DC — 2000 units (PROC-0089)', notes: 'DELAYED 2 days — ferry disruption at Rotterdam. New ETA 25 Jun.' },
  { id: 'SHP-0088', origin: 'Seoul, KR',       destination: 'London, UK',     carrier: 'Korean Air Cargo',departed: '16 Jun 2026', eta: '21 Jun 2026', status: 'CUSTOMS_HOLD', contents: 'Main PCB Assembly v4 — 200 units', notes: 'Awaiting HMRC customs clearance — commodity code query raised.' },
  { id: 'SHP-0087', origin: 'Coventry, UK',    destination: 'London, UK',     carrier: 'APC Overnight',  departed: '20 Jun 2026', eta: '21 Jun 2026', status: 'DELIVERED',    contents: 'M3 Stainless Fixings — 20 packs (PROC-0088)' },
  { id: 'SHP-0086', origin: 'Frankfurt, DE',   destination: 'London, UK',     carrier: 'TNT',            departed: '19 Jun 2026', eta: '22 Jun 2026', status: 'DELIVERED',    contents: 'Thermal Interface Pads — 500 units' },
  { id: 'SHP-0085', origin: 'Guangzhou, CN',   destination: 'Manchester, UK', carrier: 'DHL Freight',    departed: '10 Jun 2026', eta: '28 Jun 2026', status: 'IN_TRANSIT',   contents: 'Connector Kit CK-8 — 1000 packs' },
  { id: 'SHP-0083', origin: 'Osaka, JP',       destination: 'London, UK',     carrier: 'Nippon Express', departed: '12 Jun 2026', eta: '26 Jun 2026', status: 'DELAYED',      contents: 'Temperature Sensor NTC-10K — 1000 units', notes: 'DELAYED 2 days — KIMMP signal detected supplier logistics disruption in Osaka port.' },
]

const STATUS_COLOR: Record<ShipmentStatus, string> = {
  IN_TRANSIT:   '#2564ea',
  DELIVERED:    '#10B981',
  DELAYED:      '#EF4444',
  CUSTOMS_HOLD: '#F59E0B',
}

const STATUS_LABEL: Record<ShipmentStatus, string> = {
  IN_TRANSIT:   'In Transit',
  DELIVERED:    'Delivered',
  DELAYED:      'Delayed',
  CUSTOMS_HOLD: 'Customs Hold',
}

export function SupplyChainLogistics() {
  const active    = SHIPMENTS.filter(s => s.status === 'IN_TRANSIT').length
  const onTime    = SHIPMENTS.filter(s => s.status === 'IN_TRANSIT' || s.status === 'DELIVERED').length - SHIPMENTS.filter(s => s.status === 'DELAYED').length
  const delayed   = SHIPMENTS.filter(s => s.status === 'DELAYED').length
  const avgTransit = '4.2d'

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Anchor size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Logistics</h1>
          <p className="text-sm text-[var(--os-text-2)]">Active shipments, delivery status & transit tracking</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Shipments', value: String(active),     color: '#2564ea' },
          { label: 'On Time',          value: String(onTime),     color: '#10B981' },
          { label: 'Delayed',          value: String(delayed),    color: '#EF4444' },
          { label: 'Avg Transit Time', value: avgTransit,         color: ACCENT    },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Alert for SHP-0083 — KIMMP Signal */}
      <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3">
        <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-amber-400">KIMMP Signal — SHP-0083 delayed 2 days (Osaka port disruption)</p>
          <p className="text-xs text-[var(--os-text-2)] mt-0.5">WAANDA flagged logistics disruption in Osaka impacting NTC-10K sensors shipment. Combined with current stock-out this creates a 5-day production risk window.</p>
        </div>
      </div>

      {/* Shipments List */}
      <div className="space-y-2">
        {SHIPMENTS
          .sort((a, b) => {
            const order: Record<ShipmentStatus, number> = { DELAYED: 0, CUSTOMS_HOLD: 1, IN_TRANSIT: 2, DELIVERED: 3 }
            return order[a.status] - order[b.status]
          })
          .map(s => {
            const sc = STATUS_COLOR[s.status]
            return (
              <div
                key={s.id}
                className="p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
                style={s.status === 'DELAYED' || s.status === 'CUSTOMS_HOLD' ? { borderColor: `${sc}30` } : {}}
              >
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-xs font-mono text-[var(--os-text-2)]">{s.id}</p>
                      <span className="text-xs text-[var(--os-text-2)]">{s.carrier}</span>
                    </div>
                    <p className="text-sm font-semibold text-white">{s.contents}</p>
                    <p className="text-xs text-[var(--os-text-2)] mt-0.5">{s.origin} → {s.destination} · Departed {s.departed}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-[var(--os-text-2)]">ETA</p>
                      <p className="text-sm font-semibold" style={{ color: s.status === 'DELAYED' ? '#EF4444' : '#94A3B8' }}>{s.eta}</p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap" style={{ background: `${sc}22`, color: sc }}>
                      {STATUS_LABEL[s.status]}
                    </span>
                  </div>
                </div>
                {s.notes && (
                  <p className="text-xs text-[var(--os-text-2)] mt-2">{s.notes}</p>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}
