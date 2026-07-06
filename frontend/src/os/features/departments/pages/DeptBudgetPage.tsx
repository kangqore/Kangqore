import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Progress } from '@design-system/components/Progress'
import { useDepartmentsStore } from '../store'

const BUDGET_BADGE: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  'on-track': 'success', 'under': 'neutral', 'at-risk': 'warning', 'over': 'danger',
}

export function DeptBudgetPage() {
  const { budgets, departments, totalBudget, totalSpent } = useDepartmentsStore()
  const overallPct = Math.round((totalSpent() / (totalBudget() * 0.5)) * 100)

  return (
    <div className="space-y-6">
      {/* Totals */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Annual Budget', value: `₹${(totalBudget() / 1000).toFixed(2)}M`, sub: 'All departments' },
          { label: 'YTD Spend (H1)',       value: `₹${totalSpent()}k`,                       sub: `${overallPct}% of H1 allocation` },
          { label: 'Remaining H1',         value: `₹${Math.round(totalBudget() * 0.5) - totalSpent()}k`, sub: 'Available H1 budget' },
          { label: 'H2 Budget',            value: `₹${Math.round(totalBudget() * 0.5)}k`,    sub: 'Allocated, not started' },
        ].map(item => (
          <div key={item.label} className="bg-[var(--os-card)] border border-[var(--os-border)] rounded-xl p-5">
            <p className="text-xs text-[var(--os-text-2)] mb-1">{item.label}</p>
            <p className="text-2xl font-bold tracking-tight text-[var(--os-text-1)]">{item.value}</p>
            <p className="text-xs text-[var(--os-text-2)] mt-1">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* Per-department budget cards */}
      <div className="space-y-4">
        {budgets.map(b => {
          const dept       = departments.find(d => d.id === b.deptId)
          const h1budget   = b.q1 + b.q2
          const h1spent    = b.q1Spent + b.q2Spent
          const h1pct      = Math.round((h1spent / h1budget) * 100)

          const quarters = [
            { label: 'Q1', budget: b.q1, spent: b.q1Spent, done: true },
            { label: 'Q2', budget: b.q2, spent: b.q2Spent, done: true },
            { label: 'Q3', budget: b.q3, spent: 0, done: false },
            { label: 'Q4', budget: b.q4, spent: 0, done: false },
          ]

          return (
            <Card key={b.deptId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{b.deptName}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={BUDGET_BADGE[dept?.budgetStatus ?? 'on-track']} size="sm" dot>
                      {dept?.budgetStatus ?? 'on-track'}
                    </Badge>
                    <span className="text-sm font-semibold text-[var(--os-text-1)]">₹{b.annual}k / yr</span>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="space-y-5">
                {/* H1 summary */}
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-[var(--os-text-2)]">H1 Utilisation</span>
                    <span className="font-semibold text-[var(--os-text-1)]">₹{h1spent}k / ₹{h1budget}k ({h1pct}%)</span>
                  </div>
                  <Progress
                    value={Math.min(h1pct, 100)}
                    color={h1pct > 100 ? 'danger' : h1pct > 90 ? 'warning' : 'brand'}
                    size="sm"
                  />
                </div>

                {/* Quarterly breakdown */}
                <div className="grid grid-cols-4 gap-3">
                  {quarters.map(q => (
                    <div key={q.label} className={`rounded-xl p-3 border border-[var(--os-border)] bg-[var(--os-surface-0)] ${!q.done ? 'opacity-60' : ''}`}>
                      <p className="text-xs font-semibold text-[var(--os-text-2)] mb-1">{q.label}</p>
                      <p className="text-sm font-bold text-[var(--os-text-1)]">₹{q.budget}k</p>
                      {q.done ? (
                        <p className="text-xs text-[var(--os-text-2)]">Spent: ₹{q.spent}k</p>
                      ) : (
                        <p className="text-xs text-[var(--os-text-2)]">Budgeted</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Category breakdown */}
                <div>
                  <p className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wide mb-2">Category Breakdown</p>
                  <div className="space-y-2">
                    {b.categories.map(cat => {
                      const pct = Math.round((cat.spent / cat.budget) * 100)
                      return (
                        <div key={cat.name} className="flex items-center gap-3">
                          <span className="text-sm text-[var(--os-text-1)] w-40 flex-shrink-0">{cat.name}</span>
                          <div className="flex-1">
                            <Progress value={Math.min(pct, 100)} color={pct > 100 ? 'danger' : 'brand'} size="sm" />
                          </div>
                          <span className="text-xs text-[var(--os-text-2)] w-28 text-right flex-shrink-0">
                            ₹{cat.spent}k / ₹{cat.budget}k
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardBody>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
