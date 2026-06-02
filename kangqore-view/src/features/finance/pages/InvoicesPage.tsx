import { useState } from 'react'
import { Search, FileText, Download } from 'lucide-react'
import { Card } from '@design-system/components/Card'
import { Input } from '@design-system/components/Input'
import { Button } from '@design-system/components/Button'
import { StatCard } from '@design-system/components/StatCard'
import { Modal } from '@design-system/components/Modal'
import { Divider } from '@design-system/components/Divider'
import { InlineSelect } from '@components/InlineSelect'
import { useFinanceStore } from '../store'
import type { InvoiceStatus } from '../types'

const STATUS_OPTIONS: { value: InvoiceStatus; label: string; variant: 'success' | 'info' | 'warning' | 'danger' | 'neutral' }[] = [
  { value: 'draft',     label: 'Draft',     variant: 'neutral' },
  { value: 'sent',      label: 'Sent',      variant: 'info'    },
  { value: 'paid',      label: 'Paid',      variant: 'success' },
  { value: 'overdue',   label: 'Overdue',   variant: 'danger'  },
  { value: 'cancelled', label: 'Cancelled', variant: 'neutral' },
]

const fmt  = (n: number) => `£${n.toLocaleString()}`
const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

const STATUS_FILTERS: (InvoiceStatus | 'all')[] = ['all', 'paid', 'sent', 'overdue', 'draft']

export function InvoicesPage() {
  const { invoices, totalInvoiced, totalCollected, totalOverdue, updateInvoiceStatus } = useFinanceStore()
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatus] = useState<InvoiceStatus | 'all'>('all')
  const [selectedId, setSelected] = useState<string | null>(null)

  const selected = invoices.find(i => i.id === selectedId)

  const visible = invoices.filter(i =>
    (statusFilter === 'all' || i.status === statusFilter) &&
    (i.number.toLowerCase().includes(search.toLowerCase()) ||
     i.client.toLowerCase().includes(search.toLowerCase()) ||
     i.projectName.toLowerCase().includes(search.toLowerCase()))
  )

  const sent    = invoices.filter(i => i.status === 'sent').reduce((s, i) => s + i.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Invoices</h2>
          <p className="text-sm text-slate-500 mt-0.5">{invoices.length} invoices</p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<FileText className="w-4 h-4" />}>
          New Invoice
        </Button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Invoiced" value={`£${(totalInvoiced() / 1000).toFixed(0)}k`}  iconColor="bg-blue-100 text-blue-600"   icon={<FileText className="w-5 h-5" />} />
        <StatCard label="Collected"      value={`£${(totalCollected() / 1000).toFixed(0)}k`} iconColor="bg-green-100 text-green-600" icon={<FileText className="w-5 h-5" />} />
        <StatCard label="Awaiting"       value={`£${(sent / 1000).toFixed(0)}k`}             iconColor="bg-amber-100 text-amber-600" icon={<FileText className="w-5 h-5" />} />
        <StatCard label="Overdue"        value={`£${(totalOverdue() / 1000).toFixed(0)}k`}   iconColor={totalOverdue() > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'} icon={<FileText className="w-5 h-5" />} />
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
        <div className="flex items-center gap-2">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === s ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <span className="ml-auto text-sm text-slate-400">{visible.length} invoices</span>
      </div>

      {/* Table */}
      <Card padding="none">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {['Invoice #', 'Client', 'Project', 'Amount', 'Issued', 'Due', 'Status', ''].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {visible.map(inv => (
              <tr
                key={inv.id}
                className="hover:bg-slate-50 transition-colors cursor-pointer group"
                onClick={() => setSelected(inv.id)}
              >
                <td className="px-5 py-3.5 font-mono text-xs text-slate-600">{inv.number}</td>
                <td className="px-5 py-3.5 font-medium text-slate-800">{inv.client}</td>
                <td className="px-5 py-3.5 text-slate-500 text-xs">{inv.projectName.split(' ').slice(0, 2).join(' ')}</td>
                <td className="px-5 py-3.5 font-bold text-slate-900">{fmt(inv.amount)}</td>
                <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">{fmtDate(inv.issueDate)}</td>
                <td className="px-5 py-3.5 text-xs whitespace-nowrap">
                  <span className={inv.status === 'overdue' ? 'text-red-600 font-semibold' : 'text-slate-400'}>
                    {fmtDate(inv.dueDate)}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <InlineSelect
                    value={inv.status}
                    options={STATUS_OPTIONS}
                    onChange={status => updateInvoiceStatus(inv.id, status)}
                    dot
                  />
                </td>
                <td className="px-5 py-3.5">
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100" onClick={e => { e.stopPropagation(); setSelected(inv.id) }}>
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && (
          <div className="py-12 text-center text-sm text-slate-400">No invoices match your filters.</div>
        )}
      </Card>

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
                <p className="text-xs text-slate-400">Issued</p>
                <p className="text-sm font-medium text-slate-700">{fmtDate(selected.issueDate)}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-xs text-slate-400">Due</p>
                <p className="text-sm font-medium text-slate-700">{fmtDate(selected.dueDate)}</p>
              </div>
              <InlineSelect
                value={selected.status}
                options={STATUS_OPTIONS}
                onChange={status => updateInvoiceStatus(selected.id, status)}
                size="md"
                dot
              />
            </div>

            <Divider />

            {/* Line items */}
            <div className="space-y-2">
              <div className="grid grid-cols-12 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <span className="col-span-6">Description</span>
                <span className="col-span-2 text-right">Qty</span>
                <span className="col-span-2 text-right">Rate</span>
                <span className="col-span-2 text-right">Amount</span>
              </div>
              {selected.items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 text-sm py-2 border-b border-slate-50 last:border-0">
                  <span className="col-span-6 text-slate-700">{item.description}</span>
                  <span className="col-span-2 text-right text-slate-500">{item.quantity}</span>
                  <span className="col-span-2 text-right text-slate-500">{fmt(item.rate)}</span>
                  <span className="col-span-2 text-right font-semibold text-slate-900">{fmt(item.amount)}</span>
                </div>
              ))}
            </div>

            <Divider />

            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Total</span>
              <span className="text-xl font-bold text-slate-900">{fmt(selected.amount)}</span>
            </div>

            {selected.paidDate && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                <span className="text-green-600 text-sm font-medium">Paid on {fmtDate(selected.paidDate)}</span>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
