import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Progress } from '@design-system/components/Progress'
import { usePartnersStore } from '../store'
import type { PaymentStatus } from '../types'

function SkeletonBar() {
  return (
    <div className="flex items-center gap-4 animate-pulse">
      <div className="w-9 h-9 rounded-xl bg-slate-700 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-1/3 rounded bg-slate-700" />
        <div className="h-2 rounded bg-slate-800" />
      </div>
    </div>
  )
}

// Monday.com status badge colors
const STATUS_COLOR: Record<PaymentStatus, string> = {
  paid:       '#00c875',
  processing: '#579bfc',
  pending:    '#fdab3d',
  overdue:    '#e2445c',
}

const fmt  = (n: number) => `₹${n.toLocaleString()}`
const fmtK = (n: number) => `₹${(n/1000).toFixed(0)}k`

export function EarningsPage() {
  const { partners, payments, isLoading } = usePartnersStore()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-48 rounded bg-slate-700 animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="os-card p-5 h-24 animate-pulse" />)}
        </div>
        <div className="os-card p-5 h-56 animate-pulse" />
        <div className="os-card p-5 space-y-4">
          {[...Array(4)].map((_, i) => <SkeletonBar key={i} />)}
        </div>
      </div>
    )
  }

  if (partners.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-[var(--os-text-2)] font-medium">No earnings data available</p>
        <p className="text-[var(--os-text-2)] text-sm">Add partners to track earnings and payments.</p>
      </div>
    )
  }

  const totalPaid    = payments.filter(p => p.status === 'paid').reduce((s,p)=>s+p.amount, 0)
  const totalPending = payments.filter(p => p.status === 'pending' || p.status === 'processing').reduce((s,p)=>s+p.amount, 0)
  const totalOverdue = payments.filter(p => p.status === 'overdue').reduce((s,p)=>s+p.amount, 0)

  const barData = partners.map(p => ({
    name: p.name.split(' ')[0],
    Paid: p.totalEarned - p.pendingPayment,
    Pending: p.pendingPayment,
  })).sort((a,b) => (b.Paid + b.Pending) - (a.Paid + a.Pending))

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-[var(--os-text-2)] font-semibold mb-1">Finance</p>
        <h2 className="text-xl font-bold text-[var(--os-text-1)]">Earnings & Payments</h2>
        <p className="text-sm text-[var(--os-text-2)] mt-0.5">{payments.length} invoices across {partners.length} partners</p>
      </div>

      {/* Monthly totals */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Paid Out', value: totalPaid,    color: '#00c875' },
          { label: 'Pending',        value: totalPending, color: '#fdab3d' },
          { label: 'Overdue',        value: totalOverdue, color: totalOverdue > 0 ? '#e2445c' : '#9aa0b0' },
        ].map(c => (
          <div key={c.label} className="os-card p-5">
            <p className="text-[10px] uppercase tracking-widest text-[var(--os-text-2)] font-semibold mb-2">{c.label}</p>
            <p className="text-3xl font-black" style={{ color: c.color }}>{fmtK(c.value)}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="os-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[var(--os-text-1)]">Earnings by Partner</h3>
          <div className="flex items-center gap-3 text-xs text-[var(--os-text-2)]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#00c875' }} />Paid</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#fdab3d' }} />Pending</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData} barSize={24} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--os-surface-0)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--os-text-2)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--os-text-2)' }} axisLine={false} tickLine={false} tickFormatter={fmtK} />
            <Tooltip formatter={(v) => [fmt(Number(v)), '']} contentStyle={{ borderRadius: 12, border: '1px solid var(--os-border)', background: 'var(--os-card)', color: 'var(--os-text-1)', fontSize: 12 }} />
            <Bar dataKey="Paid"    fill="#00c875" radius={[0,0,0,0]} stackId="a" />
            <Bar dataKey="Pending" fill="#fdab3d" radius={[4,4,0,0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Per-partner breakdown */}
      <div className="os-card p-5">
        <h3 className="font-semibold text-[var(--os-text-1)] mb-4">Per-Partner Breakdown</h3>
        <div className="space-y-4">
          {[...partners].sort((a,b) => b.totalEarned - a.totalEarned).map(p => {
            const pPaid   = p.totalEarned - p.pendingPayment
            const pctPaid = p.totalEarned > 0 ? Math.round((pPaid / p.totalEarned) * 100) : 0
            return (
              <div key={p.id} className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs text-white" style={{ background: '#579bfc' }}>
                  {p.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-[var(--os-text-1)]">{p.name}</p>
                    <span className="text-sm font-bold text-[var(--os-text-1)]">{fmtK(p.totalEarned)}</span>
                  </div>
                  <Progress value={pctPaid} size="sm" color="success" />
                  <div className="flex items-center justify-between mt-1 text-[10px] text-[var(--os-text-2)]">
                    <span>Paid: {fmtK(pPaid)}</span>
                    {p.pendingPayment > 0 && <span className="font-semibold" style={{ color: '#fdab3d' }}>Pending: {fmtK(p.pendingPayment)}</span>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* All invoices */}
      <div className="os-card overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="font-semibold text-[var(--os-text-1)]">All Invoices</h3>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-700/50 text-[var(--os-text-2)]">{payments.length}</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--os-border)] bg-[var(--os-surface-0)]">
              {['Invoice','Partner','Description','Amount','Issued','Due','Status'].map(h=>(
                <th key={h} className="text-left px-5 py-3 text-[10px] font-semibold text-[var(--os-text-2)] uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...payments].sort((a,b) => b.issuedDate.localeCompare(a.issuedDate)).map(p => {
              const sc = STATUS_COLOR[p.status]
              return (
                <tr key={p.id} className="border-b border-[var(--os-border)] hover:bg-[var(--os-surface-0)] transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-[var(--os-text-2)]">{p.invoiceNumber}</td>
                  <td className="px-5 py-3 text-[var(--os-text-1)] font-medium text-xs">{p.partnerName.split(' ')[0]}</td>
                  <td className="px-5 py-3 text-[var(--os-text-2)] max-w-[200px] truncate">{p.description}</td>
                  <td className="px-5 py-3 font-black text-[var(--os-text-1)]">{fmt(p.amount)}</td>
                  <td className="px-5 py-3 text-xs text-[var(--os-text-2)]">{new Date(p.issuedDate).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</td>
                  <td className="px-5 py-3 text-xs text-[var(--os-text-2)]">{new Date(p.dueDate).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</td>
                  <td className="px-5 py-3">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: `${sc}20`, color: sc }}>{p.status}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
