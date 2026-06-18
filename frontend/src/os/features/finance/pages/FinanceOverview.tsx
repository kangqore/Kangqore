import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { DollarSign, TrendingUp, AlertCircle, Wallet } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@design-system/components/Card'
import { StatCard } from '@design-system/components/StatCard'
import { Badge } from '@design-system/components/Badge'
import { Progress } from '@design-system/components/Progress'
import { useFinanceStore } from '../store'

const fmt = (n: number) =>
  n >= 1000000 ? `₹${(n / 1000000).toFixed(2)}M` : `₹${(n / 1000).toFixed(0)}k`

export function FinanceOverview() {
  const {
    cashFlow, projectFinancials,
    totalInvoiced, totalCollected, totalOverdue, totalBudget, totalSpent,
  } = useFinanceStore()

  const invoiced   = totalInvoiced()
  const collected  = totalCollected()
  const overdue    = totalOverdue()
  const budget     = totalBudget()
  const spent      = totalSpent()
  const balance    = cashFlow[cashFlow.length - 1]?.runningBalance ?? 0
  const monthlyBurn = Math.round(cashFlow.slice(-3).reduce((s, m) => s + m.outflow, 0) / 3)
  const runway     = Math.round(balance / monthlyBurn)

  const netFlowData = cashFlow.map(m => ({
    month: m.month,
    Inflow:  m.inflow,
    Outflow: -m.outflow,
    Net:     m.net,
  }))

  return (
    <div className="space-y-6">
      <KIMMPSignalBar module="Finance" />
      <div>
        <h2 className="text-xl font-bold text-white">Financial Overview</h2>
        <p className="text-sm text-slate-500 mt-0.5">Cash position · {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Cash Balance"    value={fmt(balance)}   prefix="" icon={<Wallet        className="w-5 h-5" />} iconColor="bg-blue-100 text-blue-600" change={8}  changeLabel="vs last month" />
        <StatCard label="Revenue Invoiced" value={fmt(invoiced)}  prefix="" icon={<DollarSign    className="w-5 h-5" />} iconColor="bg-blue-100 text-blue-600"    change={12} changeLabel="YTD"          />
        <StatCard label="Collected"        value={fmt(collected)} prefix="" icon={<TrendingUp    className="w-5 h-5" />} iconColor="bg-green-100 text-green-600"  />
        <StatCard label="Overdue"          value={fmt(overdue)}   prefix="" icon={<AlertCircle   className="w-5 h-5" />} iconColor={overdue > 0 ? 'bg-red-100 text-red-600' : 'bg-[#151C2F] text-slate-300'} />
      </div>

      {/* Runway chip */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-100 rounded-2xl">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Cash Runway</span>
          <span className="text-2xl font-bold text-white">{runway} months</span>
        </div>
        <div className="w-px self-stretch bg-blue-200 mx-2" />
        <div className="flex flex-col">
          <span className="text-xs text-slate-500">Monthly burn rate</span>
          <span className="text-lg font-bold text-slate-300">{fmt(monthlyBurn)}</span>
        </div>
        <div className="w-px self-stretch bg-blue-200 mx-2" />
        <div className="flex flex-col">
          <span className="text-xs text-slate-500">Total budget</span>
          <span className="text-lg font-bold text-slate-300">{fmt(budget)}</span>
        </div>
        <div className="w-px self-stretch bg-blue-200 mx-2" />
        <div className="flex-1">
          <Progress
            value={Math.round((spent / budget) * 100)}
            color={spent / budget > 0.85 ? 'danger' : spent / budget > 0.7 ? 'warning' : 'success'}
            size="md"
            label="Budget consumed"
            showValue
          />
        </div>
      </div>

      {/* Cash flow chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow — Jan to Aug 2026</CardTitle>
          <Badge variant="neutral" size="sm">inflow vs outflow</Badge>
        </CardHeader>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={netFlowData} barGap={4} barSize={18}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f7" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${Math.abs(v) / 1000}k`} />
            <ReferenceLine y={0} stroke="#e4e8f0" />
            <Tooltip formatter={(v) => [`₹${Math.abs(Number(v)).toLocaleString()}`, '']} contentStyle={{ borderRadius: 12, border: '1px solid #e4e8f0', fontSize: 12 }} />
            <Bar dataKey="Inflow"  fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Outflow" fill="#f87171" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Running balance area */}
      <Card>
        <CardHeader>
          <CardTitle>Running Balance</CardTitle>
          <span className="text-sm font-bold text-white">{fmt(balance)}</span>
        </CardHeader>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={cashFlow}>
            <defs>
              <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#2564ea" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2564ea" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f7" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}k`} />
            <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString()}`, 'Balance']} contentStyle={{ borderRadius: 12, border: '1px solid #e4e8f0', fontSize: 12 }} />
            <Area type="monotone" dataKey="runningBalance" stroke="#2564ea" fill="url(#balGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Project financials */}
      <Card>
        <CardHeader>
          <CardTitle>Project P&L</CardTitle>
          <Badge variant="neutral" size="sm">{projectFinancials.length} projects</Badge>
        </CardHeader>
        <div className="space-y-3">
          {projectFinancials.map(p => {
            const spentPct = Math.round((p.spent / p.budget) * 100)
            const collectedPct = Math.round((p.collected / p.budget) * 100)
            return (
              <div key={p.projectId} className="flex items-center gap-4 py-2 border-b border-[#2E2854] last:border-0">
                <div className="w-1.5 h-10 rounded-full flex-shrink-0" style={{ background: p.projectColor }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-slate-200 truncate">{p.projectName}</p>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      {p.margin > 0 && <Badge variant="success" size="sm">{p.margin}% margin</Badge>}
                      {p.margin === 0 && <Badge variant="neutral" size="sm">internal</Badge>}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-xs text-slate-500">
                    <span>Budget <strong className="text-slate-300">{fmt(p.budget)}</strong></span>
                    <span>Spent <strong className="text-slate-300">{fmt(p.spent)}</strong></span>
                    <span>Invoiced <strong className="text-slate-300">{fmt(p.invoiced)}</strong></span>
                    <span>Collected <strong className="text-slate-300">{fmt(p.collected)}</strong></span>
                  </div>
                </div>
                <div className="w-32 flex-shrink-0">
                  <div className="relative h-2 bg-[#151C2F] rounded-full overflow-hidden">
                    <div className="absolute left-0 top-0 h-full rounded-full bg-green-400" style={{ width: `${collectedPct}%` }} />
                    <div className="absolute left-0 top-0 h-full rounded-full bg-blue-500 opacity-40" style={{ width: `${spentPct}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 text-right">{spentPct}% spent</p>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
