import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { MultiProgress } from '@design-system/components/Progress'
import { useFinanceStore } from '../store'
import type { BudgetCategory } from '../types'

interface FinancialKPIs {
  revenueMTD: number
  revenueLastMonth: number
  arr: number
  totalBudget: number
  totalSpend: number
  pipelineValue: number
  mrrDeltaPct: number
  pendingInvoices: number
  overdueInvoices: number
  activeProjects: number
}

const fmt = (n: number) => `₹${(n / 1000).toFixed(0)}k`

const CATEGORIES: (BudgetCategory | 'all')[] = ['all', 'Personnel', 'Software', 'Infrastructure', 'Marketing', 'Travel', 'Legal', 'Other']

const CAT_COLOR: Record<BudgetCategory, string> = {
  Personnel:      '#579bfc',
  Software:       '#7c3aed',
  Infrastructure: '#00c875',
  Marketing:      '#fdab3d',
  Travel:         '#579bfc',
  Legal:          '#e2445c',
  Other:          'var(--os-text-2)',
}

function SummarySkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[0,1,2,3].map(i => (
        <div key={i} className="h-24 rounded-xl animate-pulse" style={{ background: 'var(--os-surface-0)' }} />
      ))}
    </div>
  )
}

export function BudgetTracker() {
  const { budgetLines } = useFinanceStore()
  const [catFilter, setCat] = useState<BudgetCategory | 'all'>('all')

  const { data: kpis, isLoading: kpisLoading } = useQuery<FinancialKPIs>({
    queryKey: ['financial-kpis'],
    queryFn: () => api.get('/admin/financial-kpis').then(r => r.data),
    staleTime: 120_000,
  })

  const visible = budgetLines.filter(b => catFilter === 'all' || b.category === catFilter)

  const localAllocated = visible.reduce((s, b) => s + b.allocated, 0)
  const localSpent     = visible.reduce((s, b) => s + b.spent, 0)
  const localCommitted = visible.reduce((s, b) => s + b.committed, 0)

  const totalAllocated = kpis?.totalBudget ?? localAllocated
  const totalSpent     = kpis?.totalSpend  ?? localSpent
  const totalCommitted = localCommitted
  const totalRemaining = totalAllocated - totalSpent - totalCommitted

  const catRollup = (['Personnel', 'Software', 'Infrastructure', 'Marketing', 'Travel', 'Legal', 'Other'] as BudgetCategory[]).map(cat => {
    const lines = budgetLines.filter(b => b.category === cat)
    return {
      cat,
      allocated: lines.reduce((s, b) => s + b.allocated, 0),
      spent:     lines.reduce((s, b) => s + b.spent, 0),
    }
  }).filter(c => c.allocated > 0)

  const summaryCards = [
    { label: 'Total Budget',  value: fmt(totalAllocated),                  accent: '#579bfc' },
    { label: 'Spent',         value: fmt(totalSpent),                      accent: '#e2445c' },
    { label: 'Committed',     value: fmt(totalCommitted),                  accent: '#fdab3d' },
    { label: 'Remaining',     value: fmt(Math.max(0, totalRemaining)),     accent: '#00c875' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Budget Tracker</h2>
        <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: 'var(--os-text-2)' }}>
          Full-year 2026 budget — spend vs allocation
        </p>
      </div>

      {/* Summary cards */}
      {kpisLoading ? <SummarySkeleton /> : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {summaryCards.map(c => (
            <div key={c.label} className="os-card p-5">
              <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--os-text-2)' }}>{c.label}</p>
              <p className="text-3xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>{c.value}</p>
              <div className="mt-3 h-1 rounded-full" style={{ background: 'var(--os-surface-0)' }}>
                <div className="h-1 rounded-full w-1/2" style={{ background: c.accent }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Overall multi-bar */}
      <div className="os-card p-5">
        <p className="text-sm font-bold mb-4" style={{ color: 'var(--os-text-1)' }}>Budget Consumption</p>
        {kpisLoading ? (
          <div className="h-6 rounded-full animate-pulse" style={{ background: 'var(--os-surface-0)' }} />
        ) : (
          <>
            <MultiProgress
              segments={[
                { value: totalSpent,     color: 'danger',  label: `Spent: ${fmt(totalSpent)}`         },
                { value: totalCommitted, color: 'warning', label: `Committed: ${fmt(totalCommitted)}`  },
                { value: Math.max(0, totalRemaining), color: 'success', label: `Remaining: ${fmt(Math.max(0, totalRemaining))}` },
              ]}
              size="lg"
            />
            <div className="flex items-center gap-6 mt-3 text-xs" style={{ color: 'var(--os-text-2)' }}>
              {[
                { color: '#e2445c', label: 'Spent',     val: fmt(totalSpent)     },
                { color: '#fdab3d', label: 'Committed', val: fmt(totalCommitted) },
                { color: '#00c875', label: 'Remaining', val: fmt(Math.max(0, totalRemaining)) },
              ].map(s => (
                <span key={s.label} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
                  {s.label} <strong style={{ color: 'var(--os-text-1)' }}>{s.val}</strong>
                </span>
              ))}
            </div>
          </>
        )}

        {/* Category breakdown */}
        {catRollup.length > 0 && (
          <div className="mt-6 space-y-3">
            {catRollup.map(c => {
              const pct = Math.round((c.spent / c.allocated) * 100)
              const overBudget = pct > 100
              const accent = overBudget ? '#e2445c' : pct > 85 ? '#fdab3d' : '#00c875'
              return (
                <div key={c.cat} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: CAT_COLOR[c.cat] }} />
                  <span className="text-xs w-32 flex-shrink-0" style={{ color: 'var(--os-text-2)' }}>{c.cat}</span>
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--os-surface-0)' }}>
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{ width: `${Math.min(100, pct)}%`, background: accent }}
                    />
                  </div>
                  <span className="text-xs w-28 text-right flex-shrink-0" style={{ color: 'var(--os-text-2)' }}>
                    {fmt(c.spent)} / {fmt(c.allocated)}
                  </span>
                  <span
                    className="text-[11px] font-bold px-2.5 py-0.5 rounded-full w-14 text-center flex-shrink-0"
                    style={{ background: accent + '20', color: accent }}
                  >
                    {pct}%
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Category filter tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className="px-3 py-1.5 text-xs font-bold rounded-full transition-all"
            style={catFilter === c
              ? { background: '#579bfc', color: '#fff' }
              : { background: 'var(--os-surface-0)', color: 'var(--os-text-2)', border: '1px solid var(--os-border)' }
            }
          >
            {c === 'all' ? 'All Categories' : c}
          </button>
        ))}
      </div>

      {/* Budget lines table */}
      <div className="os-card" style={{ padding: 0 }}>
        <div className="flex items-center justify-between px-5 pt-5 pb-3" style={{ borderBottom: '1px solid var(--os-border)' }}>
          <p className="text-sm font-bold" style={{ color: 'var(--os-text-1)' }}>Budget Lines</p>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: 'var(--os-surface-0)', color: 'var(--os-text-2)' }}>
            {visible.length} lines
          </span>
        </div>
        {visible.length === 0 ? (
          <div className="py-12 text-center text-sm" style={{ color: 'var(--os-text-2)' }}>No budget lines available.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--os-border)', background: 'var(--os-surface-0)' }}>
                {['Category', 'Department', 'Description', 'Allocated', 'Spent', 'Committed', 'Remaining', 'Used'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--os-text-2)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map(b => {
                const remaining = b.allocated - b.spent - b.committed
                const pct       = Math.round((b.spent / b.allocated) * 100)
                const accent    = pct > 90 ? '#e2445c' : pct > 75 ? '#fdab3d' : '#00c875'

                return (
                  <tr
                    key={b.id}
                    className="transition-colors"
                    style={{ borderBottom: '1px solid var(--os-border)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--os-surface-0)')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                  >
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: CAT_COLOR[b.category] }} />
                        <span className="text-xs font-semibold" style={{ color: 'var(--os-text-2)' }}>{b.category}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--os-text-2)' }}>{b.department}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <span className="truncate block text-sm" style={{ color: 'var(--os-text-1)' }}>{b.description}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold" style={{ color: 'var(--os-text-1)' }}>{fmt(b.allocated)}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--os-text-2)' }}>{fmt(b.spent)}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: '#fdab3d' }}>{fmt(b.committed)}</td>
                    <td className="px-4 py-3 font-bold" style={{ color: remaining < 0 ? '#e2445c' : '#00c875' }}>
                      {fmt(remaining)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--os-surface-0)' }}>
                          <div className="h-1.5 rounded-full" style={{ width: `${Math.min(100, pct)}%`, background: accent }} />
                        </div>
                        <span className="text-[11px] font-bold" style={{ color: accent }}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
