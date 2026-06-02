import { useState } from 'react'
import { Card, CardHeader, CardTitle } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Progress, MultiProgress } from '@design-system/components/Progress'
import { useFinanceStore } from '../store'
import type { BudgetCategory } from '../types'

const fmt = (n: number) => `£${(n / 1000).toFixed(0)}k`

const CATEGORIES: (BudgetCategory | 'all')[] = ['all', 'Personnel', 'Software', 'Infrastructure', 'Marketing', 'Travel', 'Legal', 'Other']

const CAT_COLOR: Record<BudgetCategory, string> = {
  Personnel:      '#2564ea',
  Software:       '#2563eb',
  Infrastructure: '#059669',
  Marketing:      '#d97706',
  Travel:         '#0891b2',
  Legal:          '#dc2626',
  Other:          '#94a3b8',
}

export function BudgetTracker() {
  const { budgetLines } = useFinanceStore()
  const [catFilter, setCat] = useState<BudgetCategory | 'all'>('all')

  const visible = budgetLines.filter(b => catFilter === 'all' || b.category === catFilter)

  const totalAllocated  = visible.reduce((s, b) => s + b.allocated, 0)
  const totalSpent      = visible.reduce((s, b) => s + b.spent, 0)
  const totalCommitted  = visible.reduce((s, b) => s + b.committed, 0)
  const totalRemaining  = totalAllocated - totalSpent - totalCommitted

  // Category rollup for the donut-like breakdown
  const catRollup = (['Personnel', 'Software', 'Infrastructure', 'Marketing', 'Travel', 'Legal', 'Other'] as BudgetCategory[]).map(cat => {
    const lines = budgetLines.filter(b => b.category === cat)
    return {
      cat,
      allocated: lines.reduce((s, b) => s + b.allocated, 0),
      spent:     lines.reduce((s, b) => s + b.spent, 0),
    }
  }).filter(c => c.allocated > 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Budget Tracker</h2>
        <p className="text-sm text-slate-500 mt-0.5">Full-year 2026 budget — spend vs allocation</p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Budget',  value: fmt(totalAllocated),  color: 'bg-blue-100 text-blue-700' },
          { label: 'Spent',         value: fmt(totalSpent),      color: 'bg-red-100 text-red-700'       },
          { label: 'Committed',     value: fmt(totalCommitted),  color: 'bg-amber-100 text-amber-700'   },
          { label: 'Remaining',     value: fmt(totalRemaining),  color: 'bg-green-100 text-green-700'   },
        ].map(c => (
          <div key={c.label} className={`${c.color} rounded-2xl p-4`}>
            <p className="text-xs font-semibold opacity-70 mb-1">{c.label}</p>
            <p className="text-2xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Overall multi-bar */}
      <Card>
        <CardHeader><CardTitle>Budget Consumption</CardTitle></CardHeader>
        <MultiProgress
          segments={[
            { value: totalSpent,     color: 'danger',  label: `Spent: ${fmt(totalSpent)}`         },
            { value: totalCommitted, color: 'warning', label: `Committed: ${fmt(totalCommitted)}`  },
            { value: totalRemaining, color: 'success', label: `Remaining: ${fmt(totalRemaining)}`  },
          ]}
          size="lg"
        />
        <div className="flex items-center gap-6 mt-3 text-xs text-slate-500">
          {[
            { color: 'bg-red-500',    label: 'Spent',     val: fmt(totalSpent)     },
            { color: 'bg-amber-500',  label: 'Committed', val: fmt(totalCommitted) },
            { color: 'bg-green-500',  label: 'Remaining', val: fmt(totalRemaining) },
          ].map(s => (
            <span key={s.label} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-sm ${s.color}`} />
              {s.label} <strong className="text-slate-700">{s.val}</strong>
            </span>
          ))}
        </div>

        {/* Category breakdown */}
        <div className="mt-5 space-y-2">
          {catRollup.map(c => {
            const pct = Math.round((c.spent / c.allocated) * 100)
            return (
              <div key={c.cat} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: CAT_COLOR[c.cat] }} />
                <span className="text-xs text-slate-600 w-32">{c.cat}</span>
                <div className="flex-1">
                  <Progress value={pct} size="sm" color={pct > 85 ? 'danger' : pct > 70 ? 'warning' : 'success'} />
                </div>
                <span className="text-xs text-slate-500 w-20 text-right">{fmt(c.spent)} / {fmt(c.allocated)}</span>
                <span className="text-xs font-bold w-10 text-right text-slate-700">{pct}%</span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              catFilter === c ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300'
            }`}
          >
            {c === 'all' ? 'All Categories' : c}
          </button>
        ))}
      </div>

      {/* Budget lines table */}
      <Card padding="none">
        <CardHeader className="px-5 pt-5 pb-3">
          <CardTitle>Budget Lines</CardTitle>
          <Badge variant="neutral" size="sm">{visible.length} lines</Badge>
        </CardHeader>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {['Category', 'Department', 'Description', 'Allocated', 'Spent', 'Committed', 'Remaining', 'Status'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {visible.map(b => {
              const remaining = b.allocated - b.spent - b.committed
              const pct       = Math.round((b.spent / b.allocated) * 100)
              const health    = pct > 90 ? 'danger' : pct > 75 ? 'warning' : 'success'

              return (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: CAT_COLOR[b.category] }} />
                      <span className="text-xs font-semibold text-slate-600">{b.category}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">{b.department}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-700 max-w-xs">
                    <span className="truncate block">{b.description}</span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800">{fmt(b.allocated)}</td>
                  <td className="px-5 py-3.5 text-slate-600">{fmt(b.spent)}</td>
                  <td className="px-5 py-3.5 text-amber-600">{fmt(b.committed)}</td>
                  <td className="px-5 py-3.5 font-semibold" style={{ color: remaining < 0 ? '#ef4444' : '#15803d' }}>
                    {fmt(remaining)}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Progress value={pct} size="sm" color={health} className="w-16" />
                      <span className="text-xs font-bold text-slate-600">{pct}%</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
