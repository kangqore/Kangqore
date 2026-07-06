import { FileText, CheckCircle2, Clock, AlertCircle, Download } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Button } from '@design-system/components/Button'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
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

  const totalEngagement = invoices.filter(i => i.status !== 'upcoming').reduce((s, i) => s + i.amount, 0)

  return (
    <div className="space-y-8">
      <KIMMPSignalBar module="Invoices" />

      <div>
        <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Invoices & Payments</h2>
        <p className="text-[10px] uppercase tracking-widest font-semibold mt-1" style={{ color: 'var(--os-text-2)' }}>All invoices for your Kangqore engagement</p>
      </div>

      {/* Summary KPI strip — matches admin colored stat block pattern */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Total Paid',       value: `₹${(paid / 1000).toFixed(0)}k`,           bg: 'linear-gradient(135deg,#00c875 0%,#00a86b 100%)', glow: '#00c875' },
          { label: 'Outstanding',      value: outstanding > 0 ? `₹${(outstanding / 1000).toFixed(0)}k` : '₹0', bg: outstanding > 0 ? 'linear-gradient(135deg,#e2445c 0%,#c0392b 100%)' : 'linear-gradient(135deg,#64748b 0%,#475569 100%)', glow: outstanding > 0 ? '#e2445c' : '#64748b' },
          { label: 'Total Engagement', value: `₹${(totalEngagement / 1000).toFixed(0)}k`, bg: 'linear-gradient(135deg,#2564ea 0%,#4ab6d4 100%)', glow: '#2564ea' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-5 relative overflow-hidden" style={{ background: s.bg, boxShadow: `0 4px 20px ${s.glow}35` }}>
            <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.4) 0%, transparent 60%)' }} />
            <p className="relative text-xs font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>{s.label}</p>
            <p className="relative text-2xl font-black tracking-tight text-white">{s.value}</p>
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
              <tr style={{ borderBottom: '1px solid var(--os-border)', background: 'var(--os-surface)' }}>
                {['Invoice', 'Description', 'Issue Date', 'Due Date', 'Amount', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: 'var(--os-text-3)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => {
                const cfg = STATUS_CONFIG[inv.status as keyof typeof STATUS_CONFIG]
                const Icon = cfg.icon
                const STATUS_COLORS: Record<string, string> = { paid: '#00c875', overdue: '#e2445c', pending: '#fdab3d', upcoming: '#c5c7d0' }
                const badgeColor = STATUS_COLORS[inv.status] ?? '#c5c7d0'
                return (
                  <tr key={inv.id} className="transition-colors" style={{ borderBottom: '1px solid var(--os-border)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--os-surface)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold whitespace-nowrap" style={{ color: 'var(--os-text-2)' }}>{inv.id}</td>
                    <td className="px-5 py-3.5 max-w-xs" style={{ color: 'var(--os-text-2)' }}>
                      <span className="line-clamp-1">{inv.project}</span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: 'var(--os-text-3)' }}>{inv.date}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span style={{ color: inv.status === 'overdue' ? '#e2445c' : 'var(--os-text-3)', fontWeight: inv.status === 'overdue' ? 700 : 400 }}>
                        {inv.due}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold whitespace-nowrap" style={{ color: 'var(--os-text-1)' }}>₹{inv.amount.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full w-fit" style={{ background: badgeColor, color: '#fff' }}>
                        <Icon className="w-3 h-3" />
                        {cfg.label}
                      </span>
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
