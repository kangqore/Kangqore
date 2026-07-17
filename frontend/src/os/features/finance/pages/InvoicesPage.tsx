import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { api } from '@lib/api'
import {
  FileText, Plus, Search, Send, CheckCircle2,
  AlertTriangle, XCircle, RefreshCw, Download,
} from 'lucide-react'

// ── Types ────────────────────────────────────────────────────────────────────

type Status = 'DRAFT' | 'SENT' | 'OVERDUE' | 'PAID' | 'CANCELLED'

interface Invoice {
  id: string
  invoiceNumber: string
  amount: number
  currency: string
  status: Status
  issueDate: string | null
  dueDate: string
  paidAt: string | null
  notes: string | null
  clientId: string
  project: { title: string } | null
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => `₹${n >= 100000 ? (n / 100000).toFixed(1) + 'L' : n >= 1000 ? (n / 1000).toFixed(0) + 'K' : n.toLocaleString()}`
const fmtFull = (n: number) => `₹${n.toLocaleString('en-IN')}`
const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const daysOverdue = (due: string) => Math.floor((Date.now() - new Date(due).getTime()) / 86400000)

const STATUS_CFG: Record<Status, { label: string; color: string; bg: string; Icon: React.FC<any> }> = {
  DRAFT:     { label: 'Draft',     color: '#9898c0', bg: '#9898c020', Icon: FileText      },
  SENT:      { label: 'Sent',      color: '#579bfc', bg: '#579bfc20', Icon: Send          },
  OVERDUE:   { label: 'Overdue',   color: '#e2445c', bg: '#e2445c20', Icon: AlertTriangle },
  PAID:      { label: 'Paid',      color: '#00c875', bg: '#00c87520', Icon: CheckCircle2  },
  CANCELLED: { label: 'Cancelled', color: '#5a5a80', bg: '#5a5a8020', Icon: XCircle       },
}

const WORKFLOW: Status[] = ['DRAFT', 'SENT', 'OVERDUE', 'PAID']

// ── Workflow card ─────────────────────────────────────────────────────────────

function WorkflowCard({ status, invoices }: { status: Status; invoices: Invoice[] }) {
  const { label, color, bg, Icon } = STATUS_CFG[status]
  const total = invoices.reduce((s, i) => s + i.amount, 0)
  return (
    <div style={{
      flex: 1, background: 'var(--os-card)', border: '1px solid var(--os-border)',
      borderRadius: 12, padding: '16px 18px', borderTop: `3px solid ${color}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={14} color={color} />
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: 'var(--os-text-2)' }}>{label}</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--os-text-1)', lineHeight: 1 }}>{invoices.length}</div>
      <div style={{ fontSize: 11, color: 'var(--os-text-3)', marginTop: 3 }}>{fmt(total)}</div>
    </div>
  )
}

// ── Action button ─────────────────────────────────────────────────────────────

function ActionBtn({ children, color, onClick }: { children: React.ReactNode; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.06em',
      padding: '4px 9px', borderRadius: 6,
      background: color + '18', color, border: `1px solid ${color}30`, cursor: 'pointer',
    }}>{children}</button>
  )
}

// ── Invoice row ───────────────────────────────────────────────────────────────

function InvoiceRow({ inv, onStatusChange }: { inv: Invoice; onStatusChange: (id: string, status: Status) => void }) {
  const { label, color, bg, Icon } = STATUS_CFG[inv.status]
  const isOverdue = inv.status === 'OVERDUE'
  const over = isOverdue ? daysOverdue(inv.dueDate) : 0

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '3px 1fr 130px 110px 90px 180px',
      alignItems: 'center', borderBottom: '1px solid var(--os-border)', minHeight: 52,
    }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--os-surface-0)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <div style={{ alignSelf: 'stretch', background: color, borderRadius: '2px 0 0 2px' }} />
      <div style={{ padding: '0 14px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--os-text-1)' }}>{inv.invoiceNumber}</div>
        <div style={{ fontSize: 11, color: 'var(--os-text-3)' }}>
          {inv.project?.title ?? '—'}
          {isOverdue && <span style={{ marginLeft: 8, color: '#e2445c', fontWeight: 700 }}>{over}d overdue</span>}
        </div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-text-1)' }}>{fmtFull(inv.amount)}</div>
      <div style={{ fontSize: 11, color: 'var(--os-text-2)' }}>{fmtDate(inv.dueDate)}</div>
      <div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.06em',
          padding: '3px 8px', borderRadius: 10, background: bg, color,
        }}>
          <Icon size={10} />{label}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 6, paddingRight: 14, justifyContent: 'flex-end' }}>
        {inv.status === 'DRAFT' && (
          <ActionBtn color="#579bfc" onClick={() => onStatusChange(inv.id, 'SENT')}><Send size={10} /> Send</ActionBtn>
        )}
        {(inv.status === 'SENT' || inv.status === 'OVERDUE') && (
          <ActionBtn color="#00c875" onClick={() => onStatusChange(inv.id, 'PAID')}><CheckCircle2 size={10} /> Paid</ActionBtn>
        )}
        {inv.status === 'SENT' && (
          <ActionBtn color="#e2445c" onClick={() => onStatusChange(inv.id, 'OVERDUE')}><AlertTriangle size={10} /> Overdue</ActionBtn>
        )}
        <ActionBtn color="#9898c0" onClick={() => downloadInvoicePDF(inv)}><Download size={10} /> PDF</ActionBtn>
      </div>
    </div>
  )
}

// ── Create modal ──────────────────────────────────────────────────────────────

function CreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ invoiceNumber: '', amount: '', dueDate: '', notes: '', clientId: '' })
  const [saving, setSaving] = useState(false)
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    if (!form.invoiceNumber || !form.amount || !form.dueDate || !form.clientId) {
      toast.error('Fill in all required fields'); return
    }
    setSaving(true)
    try {
      await api.post('/invoices', { ...form, amount: parseFloat(form.amount), currency: 'INR' })
      toast.success('Invoice created'); onCreated(); onClose()
    } catch { toast.error('Failed to create invoice') }
    finally { setSaving(false) }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#00000080', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 16, padding: 28, width: 440, maxWidth: '95vw' }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--os-text-1)', marginBottom: 20 }}>New Invoice</div>
        {[
          { k: 'invoiceNumber', label: 'Invoice Number *', placeholder: 'INV-2026-001' },
          { k: 'clientId', label: 'Client ID *', placeholder: 'Client user ID' },
          { k: 'amount', label: 'Amount (₹) *', placeholder: '50000' },
          { k: 'dueDate', label: 'Due Date *', placeholder: '', type: 'date' },
          { k: 'notes', label: 'Notes', placeholder: 'Optional notes' },
        ].map(f => (
          <div key={f.k} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-text-2)', display: 'block', marginBottom: 5 }}>{f.label}</label>
            <input type={f.type ?? 'text'} placeholder={f.placeholder} value={(form as any)[f.k]}
              onChange={e => set(f.k, e.target.value)}
              style={{ width: '100%', background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: 'var(--os-text-1)', outline: 'none', boxSizing: 'border-box' as const }}
            />
          </div>
        ))}
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid var(--os-border)', background: 'transparent', color: 'var(--os-text-2)', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', background: '#579bfc', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>
            {saving ? 'Creating…' : 'Create Invoice'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── PDF Download ─────────────────────────────────────────────────────────────

function downloadInvoicePDF(inv: Invoice) {
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<title>Invoice ${inv.invoiceNumber}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, system-ui, sans-serif; padding: 48px; color: #111; font-size: 13px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
  .brand { font-size: 22px; font-weight: 900; color: #2564ea; }
  .brand-sub { font-size: 10px; color: #6b7280; margin-top: 2px; letter-spacing: .08em; text-transform: uppercase; }
  .inv-no { font-size: 28px; font-weight: 900; color: #111; }
  .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em;
    background: ${inv.status === 'PAID' ? '#00c87520' : inv.status === 'OVERDUE' ? '#e2445c20' : '#579bfc20'};
    color: ${inv.status === 'PAID' ? '#00c875' : inv.status === 'OVERDUE' ? '#e2445c' : '#579bfc'}; }
  .section-title { font-size: 9px; font-weight: 700; color: #9b9bbf; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 6px; margin-top: 28px; }
  .amount { font-size: 36px; font-weight: 900; color: #2564ea; margin: 8px 0; }
  .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 28px; }
  .meta-item label { font-size: 9px; font-weight: 700; color: #9b9bbf; text-transform: uppercase; letter-spacing: .1em; display: block; margin-bottom: 3px; }
  .meta-item span { font-size: 13px; font-weight: 700; color: #111; }
  .divider { border: none; border-top: 1px solid #e5e7eb; margin: 28px 0; }
  .footer { font-size: 10px; color: #9b9bbf; margin-top: 48px; }
  @media print { body { padding: 32px; } }
</style>
</head><body>
<div class="header">
  <div>
    <div class="brand">Kangqore</div>
    <div class="brand-sub">Enterprise Intelligence OS</div>
  </div>
  <div style="text-align:right">
    <div class="inv-no">${inv.invoiceNumber}</div>
    <div class="status-badge" style="margin-top:8px">${inv.status}</div>
  </div>
</div>
<hr class="divider"/>
<div class="section-title">Invoice Amount</div>
<div class="amount">₹${inv.amount.toLocaleString('en-IN')}</div>
<div class="meta-grid">
  <div class="meta-item"><label>Issue Date</label><span>${inv.issueDate ? fmtDate(inv.issueDate) : '—'}</span></div>
  <div class="meta-item"><label>Due Date</label><span>${fmtDate(inv.dueDate)}</span></div>
  <div class="meta-item"><label>Currency</label><span>${inv.currency}</span></div>
  <div class="meta-item"><label>Project</label><span>${inv.project?.title ?? '—'}</span></div>
  ${inv.paidAt ? `<div class="meta-item"><label>Paid At</label><span>${fmtDate(inv.paidAt)}</span></div>` : ''}
</div>
${inv.notes ? `<div class="section-title">Notes</div><p style="font-size:12px;color:#374151;line-height:1.6">${inv.notes}</p>` : ''}
<hr class="divider"/>
<div class="footer">Generated by Kangqore OS · WAANDA Finance Engine · ${new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}</div>
</body></html>`

  const w = window.open('', '_blank', 'width=760,height=900')
  if (!w) return
  w.document.write(html)
  w.document.close()
  w.focus()
  setTimeout(() => w.print(), 300)
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function InvoicesPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all')
  const [showCreate, setShowCreate] = useState(false)

  const { data, isLoading } = useQuery<{ invoices: any[] }>({
    queryKey: ['invoices'],
    queryFn: () => api.get('/invoices').then(r => r.data),
    staleTime: 60_000,
  })

  const statusMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Status }) =>
      api.patch(`/invoices/${id}/status`, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['invoices'] }); toast.success('Invoice updated') },
    onError: () => toast.error('Update failed'),
  })

  const rawInvoices: Invoice[] = (data?.invoices ?? []).map((i: any) => ({
    ...i, amount: Number(i.amount), status: (i.status as string).toUpperCase() as Status,
  }))

  // Finance B+ — auto-OVERDUE: patch any SENT invoice past its due date
  useEffect(() => {
    const toMark = rawInvoices.filter(
      i => i.status === 'SENT' && new Date(i.dueDate) < new Date()
    )
    toMark.forEach(i => {
      statusMut.mutate({ id: i.id, status: 'OVERDUE' })
    })
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  const byStatus = (s: Status) => rawInvoices.filter(i => i.status === s)

  const filtered = rawInvoices.filter(i => {
    if (statusFilter !== 'all' && i.status !== statusFilter) return false
    if (search && !i.invoiceNumber.toLowerCase().includes(search.toLowerCase()) &&
        !(i.project?.title ?? '').toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const totalOverdue = byStatus('OVERDUE').reduce((s, i) => s + i.amount, 0)
  const totalPending = byStatus('SENT').reduce((s, i) => s + i.amount, 0)

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--os-text-1)' }}>Invoices</div>
          <div style={{ fontSize: 11, color: 'var(--os-text-3)', marginTop: 2 }}>
            {rawInvoices.length} total · {fmt(totalPending)} pending
            {totalOverdue > 0 && <span style={{ color: '#e2445c', fontWeight: 700 }}> · {fmt(totalOverdue)} overdue</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => qc.invalidateQueries({ queryKey: ['invoices'] })}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid var(--os-border)', background: 'transparent', color: 'var(--os-text-2)', cursor: 'pointer', fontSize: 12 }}>
            <RefreshCw size={13} /> Refresh
          </button>
          <button onClick={() => setShowCreate(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', background: '#579bfc', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>
            <Plus size={14} /> New Invoice
          </button>
        </div>
      </div>

      {/* Workflow strip */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {WORKFLOW.map(s => <WorkflowCard key={s} status={s} invoices={byStatus(s)} />)}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' as const }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 280 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--os-text-3)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoices…"
            style={{ width: '100%', padding: '8px 12px 8px 30px', borderRadius: 8, border: '1px solid var(--os-border)', background: 'var(--os-surface-0)', color: 'var(--os-text-1)', fontSize: 12, outline: 'none', boxSizing: 'border-box' as const }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
          {(['all', ...WORKFLOW, 'CANCELLED'] as (Status | 'all')[]).map(s => {
            const active = statusFilter === s
            const color = s === 'all' ? '#579bfc' : STATUS_CFG[s as Status]?.color ?? '#579bfc'
            const bg = s === 'all' ? '#579bfc20' : STATUS_CFG[s as Status]?.bg ?? '#579bfc20'
            return (
              <button key={s} onClick={() => setStatusFilter(s)} style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                border: `1px solid ${active ? color : 'var(--os-border)'}`,
                background: active ? bg : 'transparent',
                color: active ? color : 'var(--os-text-2)',
              }}>
                {s === 'all' ? 'All' : STATUS_CFG[s as Status]?.label ?? s}
              </button>
            )
          })}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '3px 1fr 130px 110px 90px 180px',
          background: 'var(--os-surface-0)', padding: '10px 0', borderBottom: '1px solid var(--os-border)',
        }}>
          <div />
          {['Invoice / Project', 'Amount', 'Due Date', 'Status', 'Actions'].map((h, i) => (
            <div key={h} style={{ padding: i === 4 ? '0 14px 0 0' : '0 14px 0 0', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.08em', color: 'var(--os-text-3)', textAlign: i === 4 ? 'right' as const : 'left' as const }}>
              {i === 0 ? <span style={{ paddingLeft: 14 }}>{h}</span> : h}
            </div>
          ))}
        </div>

        {isLoading && <div style={{ padding: 40, textAlign: 'center' as const, color: 'var(--os-text-3)', fontSize: 13 }}>Loading…</div>}

        {!isLoading && filtered.length === 0 && (
          <div style={{ padding: 48, textAlign: 'center' as const }}>
            <FileText size={32} color="var(--os-text-3)" style={{ margin: '0 auto 12px', display: 'block' }} />
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--os-text-2)' }}>No invoices found</div>
            <div style={{ fontSize: 11, color: 'var(--os-text-3)', marginTop: 4 }}>Create the first one above</div>
          </div>
        )}

        {filtered.map(inv => (
          <InvoiceRow key={inv.id} inv={inv} onStatusChange={(id, status) => statusMut.mutate({ id, status })} />
        ))}
      </div>

      {/* Footer summary */}
      {rawInvoices.length > 0 && (
        <div style={{ display: 'flex', gap: 20, marginTop: 12, padding: '10px 16px', background: 'var(--os-surface-0)', borderRadius: 10, border: '1px solid var(--os-border)', flexWrap: 'wrap' as const }}>
          {WORKFLOW.map(s => {
            const invs = byStatus(s)
            if (!invs.length) return null
            const { label, color } = STATUS_CFG[s]
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block' }} />
                <span style={{ fontSize: 11, color: 'var(--os-text-3)' }}>{label}:</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--os-text-1)' }}>{fmt(invs.reduce((s, i) => s + i.amount, 0))}</span>
              </div>
            )
          })}
          <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--os-text-3)' }}>
            Total: <strong style={{ color: 'var(--os-text-1)' }}>{fmtFull(rawInvoices.reduce((s, i) => s + i.amount, 0))}</strong>
          </div>
        </div>
      )}

      {showCreate && <CreateModal onClose={() => setShowCreate(false)} onCreated={() => qc.invalidateQueries({ queryKey: ['invoices'] })} />}
    </div>
  )
}
