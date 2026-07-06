import { Sparkles } from 'lucide-react'
import { Package } from '@phosphor-icons/react'

const ACCENT = '#7C3AED'

type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'On Order'

interface CatalogueItem {
  name:       string
  category:   string
  supplier:   string
  unitCost:   string
  leadTime:   string
  stockStatus: StockStatus
}

const ITEMS: CatalogueItem[] = [
  { name: 'Laptop — Dell XPS 15',           category: 'Hardware',          supplier: 'Dell Technologies', unitCost: '£1,250', leadTime: '7d',  stockStatus: 'In Stock' },
  { name: 'Monitor — 27" 4K',               category: 'Hardware',          supplier: 'Dell Technologies', unitCost: '£420',   leadTime: '5d',  stockStatus: 'In Stock' },
  { name: 'Slack Enterprise Seat (annual)', category: 'SaaS',              supplier: 'Slack Technologies', unitCost: '£92 pa', leadTime: '1d',  stockStatus: 'In Stock' },
  { name: 'Datadog Pro Seat (annual)',       category: 'SaaS',              supplier: 'Datadog',           unitCost: '£420 pa',leadTime: '1d',  stockStatus: 'In Stock' },
  { name: 'Office Desk (hot-desk unit)',     category: 'Furniture',         supplier: 'Herman Miller',     unitCost: '£175',   leadTime: '14d', stockStatus: 'Low Stock' },
  { name: 'Ergonomic Chair',                category: 'Furniture',         supplier: 'Herman Miller',     unitCost: '£310',   leadTime: '14d', stockStatus: 'Out of Stock' },
  { name: 'Security Awareness Training Seat',category: 'Training',         supplier: 'KnowBe4',           unitCost: '£48 pa', leadTime: '3d',  stockStatus: 'In Stock' },
  { name: 'Background Check (per hire)',    category: 'Professional Service',supplier: 'Verifile',         unitCost: '£84',    leadTime: '5d',  stockStatus: 'On Order' },
]

const STATUS_COLOR: Record<StockStatus, string> = {
  'In Stock':     '#10B981',
  'Low Stock':    '#F59E0B',
  'Out of Stock': '#EF4444',
  'On Order':     '#6366F1',
}

export function ProcCatalogue() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Package size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Service &amp; Goods Catalogue</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Approved catalogue of goods and services available to all departments.</p>
        </div>
      </div>

      <div className="rounded-2xl border p-5 flex gap-4" style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}08` }}>
        <Sparkles size={18} style={{ color: ACCENT }} className="mt-0.5 shrink-0" />
        <p className="text-sm text-[var(--os-text-1)]">
          <span className="font-semibold" style={{ color: ACCENT }}>KIMMP: </span>
          Ergonomic chairs are out of stock — 3 new hire requisitions are pending fulfilment. Herman Miller lead time is
          14 days; place an order now to meet the July onboarding cohort. SaaS seat provisioning (Slack, Datadog) can be
          actioned same-day — direct requestors to the catalogue workflow. Background checks have a 5-day lead time;
          ensure HR raises requests at offer stage not start date.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Item', 'Category', 'Supplier', 'Unit Cost', 'Lead Time', 'Stock Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {ITEMS.map(item => {
                const sc = STATUS_COLOR[item.stockStatus]
                return (
                  <tr key={item.name} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{item.category}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{item.supplier}</td>
                    <td className="px-4 py-3 text-white font-semibold whitespace-nowrap">{item.unitCost}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{item.leadTime}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>{item.stockStatus}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
