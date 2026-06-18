import { DollarSign, CheckCircle2, Clock, Download, TrendingUp } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { Progress } from '@design-system/components/Progress'
import { usePartnerEarnings } from '../usePartnerData'

const PAYMENTS = [
  { id: 'PAY-026', period: 'May 2026',      amount: 8400,  project: 'Urban Mobility + GreenSpark',   date: '2026-05-28', status: 'paid',    ref: 'BACS-44129' },
  { id: 'PAY-025', period: 'April 2026',    amount: 7800,  project: 'Urban Mobility + Quantum',      date: '2026-04-28', status: 'paid',    ref: 'BACS-43871' },
  { id: 'PAY-024', period: 'March 2026',    amount: 6200,  project: 'Quantum Analytics',             date: '2026-03-28', status: 'paid',    ref: 'BACS-43512' },
  { id: 'PAY-027', period: 'June 2026',     amount: 9600,  project: 'Urban Mobility + GreenSpark',   date: '2026-06-28', status: 'pending', ref: '—'          },
]

const MONTHLY = [
  { month: 'Jan', amount: 4800  },
  { month: 'Feb', amount: 5500  },
  { month: 'Mar', amount: 6200  },
  { month: 'Apr', amount: 7800  },
  { month: 'May', amount: 8400  },
  { month: 'Jun (est.)', amount: 9600 },
]

const maxEarning = Math.max(...MONTHLY.map(m => m.amount))

export function PartnerEarnings() {
  const { data: earningsData } = usePartnerEarnings()

  // Map API invoices → payment rows; fall back to PAYMENTS mock
  const payments = (earningsData?.earnings?.transactions as Record<string, any>[] | undefined)?.length
    ? (earningsData.earnings.transactions as Record<string, any>[]).map((tx, i) => ({
        id:      String(tx.id ?? `PAY-${i}`),
        period:  String(tx.date ?? '').slice(0, 7),
        amount:  Number(tx.amount ?? 0),
        project: String(tx.description ?? '—'),
        date:    String(tx.date ?? '').slice(0, 10),
        status:  String(tx.status ?? 'pending').toLowerCase() === 'paid' ? 'paid' : 'pending',
        ref:     String(tx.id ?? '—'),
      }))
    : PAYMENTS

  const totalPaid    = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const totalPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0)

  return (
    <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-8 space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white">Earnings & Payments</h2>
        <p className="text-sm text-slate-500 mt-1">Your payment history and upcoming earnings from Kangqore projects.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'YTD Earned',        value: `£${totalPaid.toLocaleString()}`,    color: 'bg-green-50', text: 'text-green-700' },
          { label: 'Pending (Jun)',     value: `£${totalPending.toLocaleString()}`, color: 'bg-blue-50',  text: 'text-blue-700'  },
          { label: 'MoM Growth',        value: '+14%',                             color: 'bg-purple-50',text: 'text-purple-700'},
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-5 ${s.color}`}>
            <p className="text-xs font-medium text-slate-500 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              Monthly Earnings Trend
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="flex items-end gap-2 h-36">
              {MONTHLY.map((m, i) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-semibold text-slate-500">£{(m.amount / 1000).toFixed(1)}k</span>
                  <div
                    className={`w-full rounded-t-lg ${i === MONTHLY.length - 1 ? 'bg-blue-300' : 'bg-green-400'}`}
                    style={{ height: `${(m.amount / maxEarning) * 110}px` }}
                  />
                  <span className="text-[9px] text-slate-500 text-center leading-tight">{m.month}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Project breakdown */}
        <Card>
          <CardHeader><CardTitle>By Project (May)</CardTitle></CardHeader>
          <CardBody className="space-y-3">
            {[
              { project: 'Urban Mobility Co.', amount: 5200, pct: 62 },
              { project: 'GreenSpark Energy',  amount: 2100, pct: 25 },
              { project: 'Quantum Analytics',  amount: 1100, pct: 13 },
            ].map(p => (
              <div key={p.project}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300 font-medium">{p.project}</span>
                  <span className="font-semibold text-white">£{p.amount.toLocaleString()}</span>
                </div>
                <Progress value={p.pct} color="success" size="sm" />
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Payment history */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-os-border bg-slate-900/50">
                {['Ref', 'Period', 'Projects', 'Date', 'Amount', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E2854]">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-slate-900 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{p.id}</td>
                  <td className="px-5 py-3.5 font-medium text-white">{p.period}</td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs max-w-[180px]"><span className="line-clamp-1">{p.project}</span></td>
                  <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{p.date}</td>
                  <td className="px-5 py-3.5 font-bold text-white whitespace-nowrap">£{p.amount.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    {p.status === 'paid'
                      ? <div className="flex items-center gap-1.5 text-green-600"><CheckCircle2 className="w-3.5 h-3.5" /><Badge variant="success" size="sm">Paid</Badge></div>
                      : <div className="flex items-center gap-1.5 text-blue-600"><Clock className="w-3.5 h-3.5" /><Badge variant="info" size="sm">Pending</Badge></div>
                    }
                  </td>
                  <td className="px-5 py-3.5">
                    {p.status === 'paid' && (
                      <Button variant="ghost" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>Remittance</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  )
}
