import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Progress } from '@design-system/components/Progress'
import { usePartnersStore } from '../store'
import type { PaymentStatus } from '../types'

const STATUS_VARIANT: Record<PaymentStatus,'success'|'info'|'warning'|'danger'> = {
  paid: 'success', processing: 'info', pending: 'warning', overdue: 'danger',
}
const fmt  = (n: number) => `₹${n.toLocaleString()}`
const fmtK = (n: number) => `₹${(n/1000).toFixed(0)}k`

export function EarningsPage() {
  const { partners, payments } = usePartnersStore()

  const totalPaid       = payments.filter(p => p.status === 'paid').reduce((s,p)=>s+p.amount, 0)
  const totalPending    = payments.filter(p => p.status === 'pending' || p.status === 'processing').reduce((s,p)=>s+p.amount, 0)
  const totalOverdue    = payments.filter(p => p.status === 'overdue').reduce((s,p)=>s+p.amount, 0)

  // Bar chart: earnings per partner
  const barData = partners.map(p => ({
    name: p.name.split(' ')[0],
    Paid: p.totalEarned - p.pendingPayment,
    Pending: p.pendingPayment,
  })).sort((a,b) => (b.Paid + b.Pending) - (a.Paid + a.Pending))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Earnings & Payments</h2>
        <p className="text-sm text-slate-500 mt-0.5">{payments.length} invoices across {partners.length} partners</p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Paid Out', value: fmtK(totalPaid),   bg: 'bg-green-50 border-green-100', text: 'text-green-700' },
          { label: 'Pending',        value: fmtK(totalPending), bg: 'bg-amber-50 border-amber-100', text: 'text-amber-700' },
          { label: 'Overdue',        value: fmtK(totalOverdue), bg: totalOverdue > 0 ? 'bg-red-50 border-red-100' : 'bg-[#0F172A] border-[#2E2854]', text: totalOverdue > 0 ? 'text-red-700' : 'text-slate-500' },
        ].map(c => (
          <div key={c.label} className={`${c.bg} border rounded-2xl p-5`}>
            <p className="text-xs font-semibold opacity-60 mb-1">{c.label}</p>
            <p className={`text-2xl font-bold ${c.text}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings by Partner</CardTitle>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-green-500"/>Paid</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400"/>Pending</span>
          </div>
        </CardHeader>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData} barSize={24} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f7" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} tickFormatter={fmtK} />
            <Tooltip formatter={(v) => [fmt(Number(v)), '']} contentStyle={{ borderRadius: 12, border: '1px solid #e4e8f0', fontSize: 12 }} />
            <Bar dataKey="Paid"    fill="#22c55e" radius={[0,0,0,0]} stackId="a" />
            <Bar dataKey="Pending" fill="#f59e0b" radius={[4,4,0,0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Partner earnings breakdown */}
      <Card>
        <CardHeader><CardTitle>Per-Partner Breakdown</CardTitle></CardHeader>
        <div className="space-y-4">
          {[...partners].sort((a,b) => b.totalEarned - a.totalEarned).map(p => {
            const pPaid    = p.totalEarned - p.pendingPayment
            const pctPaid  = Math.round((pPaid / p.totalEarned) * 100)
            return (
              <div key={p.id} className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2564ea] to-[#4ab6d4] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xs">{p.logo}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-slate-200">{p.name}</p>
                    <span className="text-sm font-bold text-white">{fmtK(p.totalEarned)}</span>
                  </div>
                  <Progress value={pctPaid} size="sm" color="success" />
                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                    <span>Paid: {fmtK(pPaid)}</span>
                    {p.pendingPayment > 0 && <span className="text-amber-500 font-semibold">Pending: {fmtK(p.pendingPayment)}</span>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* All invoices table */}
      <Card padding="none">
        <CardHeader className="px-5 pt-5 pb-3">
          <CardTitle>All Invoices</CardTitle>
          <Badge variant="neutral" size="sm">{payments.length}</Badge>
        </CardHeader>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2E2854] bg-[#0F172A]">
              {['Invoice','Partner','Description','Amount','Issued','Due','Status'].map(h=>(
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2E2854]">
            {[...payments].sort((a,b) => b.issuedDate.localeCompare(a.issuedDate)).map(p => (
              <tr key={p.id} className="hover:bg-[#0F172A] transition-colors">
                <td className="px-5 py-3 font-mono text-xs text-slate-500">{p.invoiceNumber}</td>
                <td className="px-5 py-3 text-slate-300 font-medium text-xs">{p.partnerName.split(' ')[0]}</td>
                <td className="px-5 py-3 text-slate-500 max-w-[200px] truncate">{p.description}</td>
                <td className="px-5 py-3 font-bold text-white">{fmt(p.amount)}</td>
                <td className="px-5 py-3 text-xs text-slate-500">{new Date(p.issuedDate).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</td>
                <td className="px-5 py-3 text-xs text-slate-500">{new Date(p.dueDate).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</td>
                <td className="px-5 py-3">
                  <Badge variant={STATUS_VARIANT[p.status]} dot size="sm">{p.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
