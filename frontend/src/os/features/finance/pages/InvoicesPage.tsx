import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { api } from '@lib/api'
import { Search, FileText, Download } from 'lucide-react'
import { Input } from '@design-system/components/Input'
import { Button } from '@design-system/components/Button'
import { Modal } from '@design-system/components/Modal'
import { Divider } from '@design-system/components/Divider'
import { InlineSelect } from '@components/InlineSelect'
import type { InvoiceStatus } from '../types'

interface ApiInvoice {
  id: string
  invoiceNumber: string
  amount: number
  currency: string
  status: string
  issueDate: string | null
  dueDate: string
  paidAt: string | null
  notes: string | null
  clientId: string
  project: { title: string } | null
}

interface NormalizedInvoice {
  id: string
  number: string
  client: string
  projectName: string
  amount: number
  currency: string
  status: InvoiceStatus
  issueDate: string
  dueDate: string
  paidDate?: string
  items: []
}

const STATUS_OPTIONS: { value: InvoiceStatus; label: string; variant: 'success' | 'info' | 'warning' | 'danger' | 'neutral' }[] = [
  { value: 'draft',     label: 'Draft',     variant: 'neutral' },
  { value: 'sent',      label: 'Sent',      variant: 'info'    },
  { value: 'paid',      label: 'Paid',      variant: 'success' },
  { value: 'overdue',   label: 'Overdue',   variant: 'danger'  },
  { value: 'cancelled', label: 'Cancelled', variant: 'neutral' },
]

const STATUS_STYLE: Record<InvoiceStatus | string, { bg: string; color: string; label: string }> = {
  paid:      { bg: '#00c87520', color: '#00c875', label: 'Paid'      },
  sent:      { bg: '#579bfc20', color: '#579bfc', label: 'Pending'   },
  draft:     { bg: '#579bfc20', color: '#579bfc', label: 'Draft'     },
  overdue:   { bg: '#e2445c20', color: '#e2445c', label: 'Overdue'   },
  cancelled: { bg: 'var(--os-surface-0)', color: 'var(--os-text-2)', label: 'Cancelled' },
}

const fmt     = (n: number) => `₹${n.toLocaleString()}`
const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

const STATUS_FILTERS: (InvoiceStatus | 'all')[] = ['all', 'paid', 'sent', 'overdue', 'draft']

function normalizeStatus(raw: string): InvoiceStatus {
  const map: Record<string, InvoiceStatus> = {
    DRAFT: 'draft', SENT: 'sent', PAID: 'paid', OVERDUE: 'overdue', CANCELLED: 'cancelled',
    draft: 'draft', sent: 'sent', paid: 'paid', overdue: 'overdue', cancelled: 'cancelled',
  }
  return map[raw] ?? 'draft'
}

function normalize(inv: ApiInvoice): NormalizedInvoice {
  return {
    id:          inv.id,
    number:      inv.invoiceNumber,
    client:      inv.clientId,
    projectName: inv.project?.title ?? '—',
    amount:      Number(inv.amount),
    currency:    inv.currency,
    status:      normalizeStatus(inv.status),
    issueDate:   inv.issueDate ?? inv.dueDate,
    dueDate:     inv.dueDate,
    paidDate:    inv.paidAt ?? undefined,
    items:       [],
  }
}

function SkeletonRow() {
  return (
    <tr>
      {[1,2,3,4,5,6,7,8].map(i => (
        <td key={i} className="px-4 py-3">
          <div className="h-3.5 rounded" style={{ background: 'var(--os-surface-0)', width: i === 1 ? 72 : i === 4 ? 64 : 96 }} />
        </td>
      ))}
    </tr>
  )
}

export function InvoicesPage() {
  const queryClient = useQueryClient()
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatus] = useState<InvoiceStatus | 'all'>('all')
  const [selectedId, setSelected] = useState<string | null>(null)

  const { data: rawInvoices = [], isLoading } = useQuery<NormalizedInvoice[]>({
    queryKey: ['invoices'],
    queryFn: () =>
      api.get('/invoices').then(r => {
        const list: ApiInvoice[] = r.data.invoices ?? r.data
        return list.map(normalize)
      }),
    staleTime: 60_000,
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: InvoiceStatus }) =>
      api.patch(`/invoices/${id}/status`, { status: status.toUpperCase() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      toast.success('Invoice status updated')
    },
    onError: () => toast.error('Failed to update invoice status'),
  })

  const invoices = rawInvoices
  const selected = invoices.find(i => i.id === selectedId)

  const visible = invoices.filter(i =>
    (statusFilter === 'all' || i.status === statusFilter) &&
    (i.number.toLowerCase().includes(search.toLowerCase()) ||
     i.client.toLowerCase().includes(search.toLowerCase()) ||
     i.projectName.toLowerCase().includes(search.toLowerCase()))
  )

  const totalInvoiced  = invoices.filter(i => i.status !== 'cancelled').reduce((s, i) => s + i.amount, 0)
  const totalCollected = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  const sent           = invoices.filter(i => i.status === 'sent').reduce((s, i) => s + i.amount, 0)
  const totalOverdue   = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0)

  const kpiCards = [
    { label: 'Total Invoiced', value: `₹${(totalInvoiced / 1000).toFixed(0)}k`,  accent: '#579bfc' },
    { label: 'Collected',      value: `₹${(totalCollected / 1000).toFixed(0)}k`, accent: '#00c875' },
    { label: 'Awaiting',       value: `₹${(sent / 1000).toFixed(0)}k`,           accent: '#fdab3d' },
    { label: 'Overdue',        value: `₹${(totalOverdue / 1000).toFixed(0)}k`,   accent: totalOverdue > 0 ? '#e2445c' : '#00c875' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Invoices</h2>
          <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: 'var(--os-text-2)' }}>
            {isLoading ? '—' : `${invoices.length} invoices`}
          </p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<FileText className="w-4 h-4" />}>
          New Invoice
        </Button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpiCards.map(k => (
          <div key={k.label} className="os-card p-5">
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--os-text-2)' }}>{k.label}</p>
            <p className="text-3xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>{k.value}</p>
            <div className="mt-3 h-1 rounded-full" style={{ background: 'var(--os-surface-0)' }}>
              <div className="h-1 rounded-full w-1/2" style={{ background: k.accent }} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Input
          placeholder="Search invoices…"
          prefix={<Search className="w-3.5 h-3.5" />}
          className="w-56"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex items-center gap-1.5">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className="px-3 py-1.5 text-xs font-bold rounded-full transition-all capitalize"
              style={statusFilter === s
                ? { background: '#579bfc', color: '#fff' }
                : { background: 'var(--os-surface-0)', color: 'var(--os-text-2)', border: '1px solid var(--os-border)' }
              }
            >
              {s === 'all' ? 'All' : s === 'sent' ? 'Pending' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs font-semibold" style={{ color: 'var(--os-text-2)' }}>{visible.length} invoices</span>
      </div>

      {/* Table */}
      <div className="os-card" style={{ padding: 0 }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--os-border)', background: 'var(--os-surface-0)' }}>
              {['Invoice #', 'Client', 'Project', 'Amount', 'Issued', 'Due', 'Status', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--os-text-2)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : visible.length > 0 ? (
              visible.map(inv => {
                const ss = STATUS_STYLE[inv.status] ?? STATUS_STYLE.draft
                return (
                  <tr
                    key={inv.id}
                    className="transition-colors cursor-pointer group"
                    style={{ borderBottom: '1px solid var(--os-border)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--os-surface-0)')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                    onClick={() => setSelected(inv.id)}
                  >
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--os-text-2)' }}>{inv.number}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: 'var(--os-text-1)' }}>{inv.client}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--os-text-2)' }}>{inv.projectName.split(' ').slice(0, 2).join(' ')}</td>
                    <td className="px-4 py-3 font-black text-right" style={{ color: 'var(--os-text-1)' }}>{fmt(inv.amount)}</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: 'var(--os-text-2)' }}>{fmtDate(inv.issueDate)}</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                      <span style={{ color: inv.status === 'overdue' ? '#e2445c' : 'var(--os-text-2)', fontWeight: inv.status === 'overdue' ? 700 : 400 }}>
                        {fmtDate(inv.dueDate)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                        style={{ background: ss.bg, color: ss.color }}
                      >
                        {ss.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                        <button
                          className="text-xs font-bold px-2.5 py-1 rounded-full border transition-all"
                          style={{ borderColor: '#00c875', color: '#00c875' }}
                          onClick={e => {
                            e.stopPropagation()
                            if (inv.status !== 'paid') statusMutation.mutate({ id: inv.id, status: 'paid' })
                          }}
                        >
                          Mark Paid
                        </button>
                        <button
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ color: 'var(--os-text-2)' }}
                          onClick={e => { e.stopPropagation(); setSelected(inv.id) }}
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : null}
          </tbody>
        </table>
        {!isLoading && visible.length === 0 && (
          <div className="py-12 text-center text-sm" style={{ color: 'var(--os-text-2)' }}>No invoices match your filters.</div>
        )}
      </div>

      {/* Invoice detail modal */}
      {selected && (
        <Modal
          open={!!selectedId}
          onClose={() => setSelected(null)}
          title={selected.number}
          description={`${selected.client} · ${selected.projectName}`}
          size="md"
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setSelected(null)}>Close</Button>
              <Button variant="primary" size="sm" leftIcon={<Download className="w-4 h-4" />}>Download PDF</Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs" style={{ color: 'var(--os-text-2)' }}>Issued</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--os-text-1)' }}>{fmtDate(selected.issueDate)}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-xs" style={{ color: 'var(--os-text-2)' }}>Due</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--os-text-1)' }}>{fmtDate(selected.dueDate)}</p>
              </div>
              <InlineSelect
                value={selected.status}
                options={STATUS_OPTIONS}
                onChange={status => statusMutation.mutate({ id: selected.id, status })}
                size="md"
                dot
              />
            </div>

            <Divider />

            <div className="space-y-2">
              {selected.items.length === 0 ? (
                <p className="text-sm text-center py-4" style={{ color: 'var(--os-text-2)' }}>No line items available.</p>
              ) : (
                <>
                  <div className="grid grid-cols-12 text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--os-text-2)' }}>
                    <span className="col-span-6">Description</span>
                    <span className="col-span-2 text-right">Qty</span>
                    <span className="col-span-2 text-right">Rate</span>
                    <span className="col-span-2 text-right">Amount</span>
                  </div>
                  {(selected.items as Array<{ description: string; quantity: number; rate: number; amount: number }>).map((item, i) => (
                    <div key={i} className="grid grid-cols-12 text-sm py-2 border-b border-[var(--os-border)] last:border-0">
                      <span className="col-span-6" style={{ color: 'var(--os-text-1)' }}>{item.description}</span>
                      <span className="col-span-2 text-right" style={{ color: 'var(--os-text-2)' }}>{item.quantity}</span>
                      <span className="col-span-2 text-right" style={{ color: 'var(--os-text-2)' }}>{fmt(item.rate)}</span>
                      <span className="col-span-2 text-right font-bold" style={{ color: 'var(--os-text-1)' }}>{fmt(item.amount)}</span>
                    </div>
                  ))}
                </>
              )}
            </div>

            <Divider />

            <div className="flex items-center justify-between">
              <span className="font-semibold" style={{ color: 'var(--os-text-2)' }}>Total</span>
              <span className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>{fmt(selected.amount)}</span>
            </div>

            {selected.paidDate && (
              <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: '#00c87510', border: '1px solid #00c87540' }}>
                <span className="text-sm font-semibold" style={{ color: '#00c875' }}>Paid on {fmtDate(selected.paidDate)}</span>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
