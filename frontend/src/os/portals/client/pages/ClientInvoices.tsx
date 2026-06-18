import { FileText, CheckCircle2, Clock, AlertCircle, Download } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { useClientInvoices } from '../useClientData'

const INVOICES = [
  { id: 'INV-2026-041', project: 'Patient Portal v2 — Sprint 11-12',        date: '2026-05-20', due: '2026-06-04', amount: 42000, status: 'overdue'  },
  { id: 'INV-2026-038', project: 'HIPAA Compliance Layer — Phase 2',        date: '2026-05-01', due: '2026-05-16', amount: 28500, status: 'paid'     },
  { id: 'INV-2026-034', project: 'Patient Portal v2 — Sprint 9-10',        date: '2026-04-05', due: '2026-04-20', amount: 38000, status: 'paid'     },
  { id: 'INV-2026-031', project: 'HIPAA Compliance Layer — Phase 1',        date: '2026-03-15', due: '2026-03-30', amount: 24000, status: 'paid'     },
  { id: 'INV-2026-029', project: 'Analytics Dashboard — Discovery',         date: '2026-03-01', due: '2026-03-16', amount: 8500,  status: 'paid'     },
  { id: 'INV-2026-UPC', project: 'Patient Portal v2 — Sprint 13-14 (est.)', date: '2026-06-15', due: '2026-06-30', amount: 42000, status: 'upcoming' },
]

const STATUS_CONFIG = {
  paid:     { label: 'Paid',     variant: 'success' as const, icon: CheckCircle2 },
  overdue:  { label: 'Overdue',  variant: 'danger'  as const, icon: AlertCircle  },
  pending:  { label: 'Pending',  variant: 'warning' as const, icon: Clock        },
  upcoming: { label: 'Upcoming', variant: 'neutral' as const, icon: Clock        },
}

export function ClientInvoices() {
  const { data: apiInvoices } = useClientInvoices()

  const invoices = (apiInvoices as Record<string, unknown>[] | undefined)?.length
    ? (apiInvoices as Record<string, unknown>[]).map(i => ({
        id:      String(i.invoiceNumber ?? i.id ?? '—'),
        project: String((i.project as Record<string,unknown>)?.title ?? i.projectName ?? '—'),
        date:    String(i.issueDate ?? i.createdAt ?? '').slice(0, 10),
        due:     String(i.dueDate ?? '').slice(0, 10),
        amount:  Number(i.amount ?? 0),
        status:  (['paid','overdue','pending','upcoming','cancelled'].includes(String(i.status ?? '').toLowerCase())
                  ? String(i.status).toLowerCase()
                  : 'pending') as string,
      }))
    : INVOICES

  const paid         = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  const outstanding  = invoices.filter(i => i.status === 'overdue' || i.status === 'pending').reduce((s, i) => s + i.amount, 0)

  return (
    <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-8 space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white">Invoices & Payments</h2>
        <p className="text-sm text-slate-500 mt-1">All invoices for your Kangqore engagement.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Total Paid',       value: `£${(paid / 1000).toFixed(0)}k`,        color: 'bg-[#00c875] text-white shadow-[0_2px_8px_rgba(0,200,117,0.25)]' },
          { label: 'Outstanding',      value: outstanding > 0 ? `£${(outstanding / 1000).toFixed(0)}k` : '£0', color: outstanding > 0 ? 'bg-[#e2445c] text-white shadow-[0_2px_8px_rgba(226,68,92,0.25)]' : 'bg-slate-800 text-white' },
          { label: 'Total Engagement', value: `£${(invoices.filter(i => i.status !== 'upcoming').reduce((s, i) => s + i.amount, 0) / 1000).toFixed(0)}k`, color: 'bg-[#0073ea] text-white shadow-[0_2px_8px_rgba(0,115,234,0.25)]' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-5 ${s.color}`}>
            <p className="text-xs font-semibold opacity-85 mb-1">{s.label}</p>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Invoice table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            Invoice History
          </CardTitle>
        </CardHeader>
        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2E2854] bg-[#0F172A]/50">
                {['Invoice', 'Description', 'Issue Date', 'Due Date', 'Amount', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E2854]">
              {invoices.map(inv => {
                const cfg = STATUS_CONFIG[inv.status as keyof typeof STATUS_CONFIG]
                const Icon = cfg.icon
                return (
                  <tr key={inv.id} className="hover:bg-[#0F172A] transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-300">{inv.id}</td>
                    <td className="px-5 py-3.5 text-slate-300 max-w-xs">
                      <span className="line-clamp-1">{inv.project}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{inv.date}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={inv.status === 'overdue' ? 'text-[#e2445c] font-bold' : 'text-slate-500'}>
                        {inv.due}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-white whitespace-nowrap">£{inv.amount.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Icon className={`w-3.5 h-3.5 ${inv.status === 'paid' ? 'text-[#00c875]' : inv.status === 'overdue' ? 'text-[#e2445c]' : 'text-slate-500'}`} />
                        <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {inv.status !== 'upcoming' && (
                        <Button variant="ghost" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
                          PDF
                        </Button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  )
}
