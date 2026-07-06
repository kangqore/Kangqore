import { useState } from 'react'
import { GitBranch } from 'lucide-react'

const ACCENT = '#6366F1'

type BOMStatus = 'ACTIVE' | 'DRAFT' | 'DEPRECATED'

interface BOMItem {
  partNumber: string
  description: string
  qtyPerUnit: number
  unit: string
  supplier: string
  unitCost: number
}

interface BOMProduct {
  id: string
  name: string
  version: string
  itemCount: number
  lastUpdated: string
  status: BOMStatus
  productionVolume: number
  items: BOMItem[]
}

const PRODUCTS: BOMProduct[] = [
  {
    id: 'BOM-001',
    name: 'Control Unit Model X',
    version: 'v4.2',
    itemCount: 18,
    lastUpdated: '14 Jun 2026',
    status: 'ACTIVE',
    productionVolume: 500,
    items: [
      { partNumber: 'CMP-X001', description: 'Main Logic IC',             qtyPerUnit: 1,   unit: 'ea',  supplier: 'Vertex Components', unitCost: 42.00  },
      { partNumber: 'PCB-M004', description: 'Main PCB Assembly v4',      qtyPerUnit: 1,   unit: 'ea',  supplier: 'CircuitPro',        unitCost: 38.00  },
      { partNumber: 'CMP-A012', description: 'Aluminium Enclosure Shell', qtyPerUnit: 1,   unit: 'ea',  supplier: 'MetalCraft UK',     unitCost: 12.50  },
      { partNumber: 'CAB-P022', description: 'Power Cable 24V DC',        qtyPerUnit: 1,   unit: 'ea',  supplier: 'WireWorks Ltd',     unitCost: 2.90   },
      { partNumber: 'THM-M003', description: 'Thermal Interface Pad',     qtyPerUnit: 2,   unit: 'ea',  supplier: 'ThermalTech',       unitCost: 0.85   },
      { partNumber: 'CON-K008', description: 'Connector Kit CK-8',        qtyPerUnit: 1,   unit: 'kit', supplier: 'ConnectPro',        unitCost: 4.20   },
    ],
  },
  {
    id: 'BOM-002',
    name: 'Sensor Array v3',
    version: 'v3.1',
    itemCount: 14,
    lastUpdated: '02 Jun 2026',
    status: 'ACTIVE',
    productionVolume: 1200,
    items: [
      { partNumber: 'SEN-T008', description: 'Temperature Sensor NTC-10K', qtyPerUnit: 4,  unit: 'ea',  supplier: 'Vertex Components', unitCost: 3.80   },
      { partNumber: 'PCB-M004', description: 'Main PCB Assembly v4',        qtyPerUnit: 1,  unit: 'ea',  supplier: 'CircuitPro',        unitCost: 38.00  },
      { partNumber: 'CMP-A012', description: 'Aluminium Enclosure Shell',   qtyPerUnit: 1,  unit: 'ea',  supplier: 'MetalCraft UK',     unitCost: 12.50  },
      { partNumber: 'FAS-S019', description: 'M3 Stainless Fixings ×8',    qtyPerUnit: 1,  unit: 'set', supplier: 'FastFix UK',        unitCost: 0.60   },
      { partNumber: 'CAB-P022', description: 'Power Cable 24V DC',          qtyPerUnit: 1,  unit: 'ea',  supplier: 'WireWorks Ltd',     unitCost: 2.90   },
    ],
  },
  {
    id: 'BOM-003',
    name: 'Power Supply Unit 24V',
    version: 'v2.0-DRAFT',
    itemCount: 15,
    lastUpdated: '20 Jun 2026',
    status: 'DRAFT',
    productionVolume: 300,
    items: [
      { partNumber: 'THM-M003', description: 'Thermal Interface Pad',      qtyPerUnit: 3,  unit: 'ea',  supplier: 'ThermalTech',       unitCost: 0.85   },
      { partNumber: 'CON-K008', description: 'Connector Kit CK-8',         qtyPerUnit: 2,  unit: 'kit', supplier: 'ConnectPro',        unitCost: 4.20   },
      { partNumber: 'FAS-S019', description: 'M3 Stainless Fixings ×6',   qtyPerUnit: 1,  unit: 'set', supplier: 'FastFix UK',        unitCost: 0.45   },
      { partNumber: 'CAB-P022', description: 'Power Cable 24V DC',         qtyPerUnit: 2,  unit: 'ea',  supplier: 'WireWorks Ltd',     unitCost: 2.90   },
    ],
  },
]

const STATUS_COLOR: Record<BOMStatus, string> = {
  ACTIVE:     '#10B981',
  DRAFT:      '#F59E0B',
  DEPRECATED: 'var(--os-text-2)',
}

export function SupplyChainBOM() {
  const [expanded, setExpanded] = useState<string | null>(null)

  const totalItems    = PRODUCTS.reduce((a, p) => a + p.itemCount, 0)
  const pendingReview = PRODUCTS.filter(p => p.status === 'DRAFT').length

  // Avg material cost — based on sample items
  const avgMatCost = '£18.40'

  function calcBOMCost(product: BOMProduct) {
    return product.items.reduce((a, item) => a + (item.unitCost * item.qtyPerUnit), 0)
  }

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <GitBranch size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Bill of Materials</h1>
          <p className="text-sm text-[var(--os-text-2)]">Component lists, costs & version control for production products</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Products',          value: String(PRODUCTS.length), color: ACCENT    },
          { label: 'Total BOM Items',   value: String(totalItems),      color: '#8B5CF6' },
          { label: 'Pending Review',    value: String(pendingReview),   color: '#F59E0B' },
          { label: 'Avg Material Cost', value: avgMatCost,              color: '#10B981' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* BOM Products */}
      <div className="space-y-3">
        {PRODUCTS.map(product => {
          const sc       = STATUS_COLOR[product.status]
          const isOpen   = expanded === product.id
          const bomCost  = calcBOMCost(product)
          const totalProdCost = bomCost * product.productionVolume

          return (
            <div key={product.id} className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
              <button
                className="w-full flex items-center gap-4 p-4 hover:bg-slate-900/60 transition-colors text-left"
                onClick={() => setExpanded(isOpen ? null : product.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono text-[var(--os-text-2)]">{product.id}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>
                      {product.status}
                    </span>
                    <span className="text-xs text-[var(--os-text-2)]">v{product.version.replace('v', '')}</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{product.name}</p>
                  <p className="text-xs text-[var(--os-text-2)] mt-0.5">{product.itemCount} components · Updated {product.lastUpdated}</p>
                </div>
                <div className="text-right w-32 shrink-0 hidden sm:block">
                  <p className="text-xs text-[var(--os-text-2)]">Unit Cost (sample)</p>
                  <p className="text-sm font-bold text-white">£{bomCost.toFixed(2)}</p>
                </div>
                <div className="text-right w-32 shrink-0 hidden md:block">
                  <p className="text-xs text-[var(--os-text-2)]">Run Cost ({product.productionVolume} units)</p>
                  <p className="text-sm font-bold" style={{ color: ACCENT }}>£{totalProdCost.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                </div>
                <span className="text-[var(--os-text-2)] text-lg ml-1">{isOpen ? '↑' : '↓'}</span>
              </button>

              {isOpen && (
                <div className="border-t border-white/5">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5 bg-slate-800/20">
                          {['Part Number', 'Description', 'Qty/Unit', 'Unit', 'Supplier', 'Unit Cost', 'Line Cost'].map(h => (
                            <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--os-border)]">
                        {product.items.map(item => {
                          const lineCost = item.unitCost * item.qtyPerUnit
                          return (
                            <tr key={item.partNumber} className="hover:bg-slate-800/30 transition-colors">
                              <td className="px-4 py-2.5">
                                <span className="text-xs font-mono text-[var(--os-text-2)]">{item.partNumber}</span>
                              </td>
                              <td className="px-4 py-2.5 text-[var(--os-text-1)] whitespace-nowrap">{item.description}</td>
                              <td className="px-4 py-2.5 text-[var(--os-text-1)] text-center">{item.qtyPerUnit}</td>
                              <td className="px-4 py-2.5 text-[var(--os-text-2)]">{item.unit}</td>
                              <td className="px-4 py-2.5 text-[var(--os-text-2)] whitespace-nowrap">{item.supplier}</td>
                              <td className="px-4 py-2.5 text-[var(--os-text-1)]">£{item.unitCost.toFixed(2)}</td>
                              <td className="px-4 py-2.5 font-semibold" style={{ color: ACCENT }}>£{lineCost.toFixed(2)}</td>
                            </tr>
                          )
                        })}
                        <tr className="bg-slate-800/30">
                          <td colSpan={5} className="px-4 py-2.5 text-xs text-[var(--os-text-2)] font-medium">
                            Sample components ({product.items.length} of {product.itemCount} shown)
                          </td>
                          <td className="px-4 py-2.5 text-xs text-[var(--os-text-2)] font-medium">Subtotal:</td>
                          <td className="px-4 py-2.5 text-sm font-bold text-white">£{bomCost.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
