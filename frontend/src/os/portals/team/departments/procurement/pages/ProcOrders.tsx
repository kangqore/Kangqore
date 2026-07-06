import { Sparkles } from 'lucide-react'
import { FileText } from '@phosphor-icons/react'

const ACCENT = '#7C3AED'

type POStatus = 'Raised' | 'Confirmed' | 'Delivered' | 'Disputed'

interface PurchaseOrder {
  id:           string
  vendor:       string
  description:  string
  amount:       string
  deliveryDate: string
  status:       POStatus
}

const ORDERS: PurchaseOrder[] = [
  { id: 'PO-2026-081', vendor: 'Dell Technologies',   description: 'Laptop refresh — 5 × XPS 15',          amount: '£6,250',  deliveryDate: '2026-07-05', status: 'Confirmed' },
  { id: 'PO-2026-082', vendor: 'Datadog',             description: 'Cloud monitoring platform — annual',    amount: '£4,800',  deliveryDate: '2026-07-01', status: 'Raised' },
  { id: 'PO-2026-083', vendor: 'KnowBe4',             description: 'Security awareness training platform',  amount: '£3,600',  deliveryDate: '2026-06-30', status: 'Delivered' },
  { id: 'PO-2026-084', vendor: 'Herman Miller',        description: 'Hot-desking furniture — 12 units',      amount: '£2,100',  deliveryDate: '2026-07-14', status: 'Raised' },
  { id: 'PO-2026-085', vendor: 'Westlaw',              description: 'Legal research subscription renewal',  amount: '£5,400',  deliveryDate: '2026-07-01', status: 'Raised' },
  { id: 'PO-2026-086', vendor: 'Speakeasy Events',    description: 'Conference delegate packages × 3',     amount: '£4,500',  deliveryDate: '2026-09-12', status: 'Confirmed' },
  { id: 'PO-2026-079', vendor: 'AWS',                 description: 'Q2 cloud compute — monthly invoice',   amount: '£12,400', deliveryDate: '2026-06-15', status: 'Disputed' },
  { id: 'PO-2026-076', vendor: 'Slack Technologies',  description: 'Enterprise plan renewal — annual',     amount: '£8,200',  deliveryDate: '2026-06-01', status: 'Delivered' },
]

const STATUS_COLOR: Record<POStatus, string> = {
  'Raised':    '#6366F1',
  'Confirmed': '#F59E0B',
  'Delivered': '#10B981',
  'Disputed':  '#EF4444',
}

export function ProcOrders() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <FileText size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Purchase Orders</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">PO tracker — raised, confirmed, delivered and disputed orders.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active POs',  value: String(ORDERS.filter(o => o.status !== 'Delivered').length), color: ACCENT },
          { label: 'Confirmed',   value: String(ORDERS.filter(o => o.status === 'Confirmed').length),  color: '#F59E0B' },
          { label: 'Delivered',   value: String(ORDERS.filter(o => o.status === 'Delivered').length),  color: '#10B981' },
          { label: 'Disputed',    value: String(ORDERS.filter(o => o.status === 'Disputed').length),   color: '#EF4444' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border p-5 flex gap-4" style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}08` }}>
        <Sparkles size={18} style={{ color: ACCENT }} className="mt-0.5 shrink-0" />
        <p className="text-sm text-[var(--os-text-1)]">
          <span className="font-semibold" style={{ color: ACCENT }}>KIMMP: </span>
          PO-2026-079 (AWS Q2 invoice at £12,400) is disputed — this is the highest-value open dispute. Raise with AWS
          account team and request an itemised cost breakdown. KnowBe4 delivery is confirmed; ensure licence activation
          is completed with IT this week. Datadog PO is Raised but unconfirmed — chase vendor for PO acknowledgement.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['PO Number', 'Vendor', 'Description', 'Amount', 'Delivery Date', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {ORDERS.map(o => {
                const sc = STATUS_COLOR[o.status]
                return (
                  <tr key={o.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3"><span className="text-xs font-mono text-[var(--os-text-2)]">{o.id}</span></td>
                    <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{o.vendor}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)]">{o.description}</td>
                    <td className="px-4 py-3 text-white font-semibold whitespace-nowrap">{o.amount}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{o.deliveryDate}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>{o.status}</span>
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
