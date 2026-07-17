import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const Core: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
  const all: any[]   = Array.isArray(viewModel.pendingExecutionApprovals) ? viewModel.pendingExecutionApprovals : []
  const kpis         = viewModel.financialKpis
  const totalBudget  = kpis?.totalBudget ?? 0
  const totalSpend   = kpis?.totalSpend  ?? 0
  const spendPct     = totalBudget > 0 ? Math.round((totalSpend / totalBudget) * 100) : 0
  let spendCol = 'var(--os-success)'
  if (spendPct > 90)      spendCol = 'var(--os-danger)'
  else if (spendPct > 75) spendCol = 'var(--os-warning)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Open Requests', value: all.length,  warn: all.length > 0 },
          { label: 'Budget Used',   value: `${spendPct}%`, warn: spendPct > 90 },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-warning-dim, var(--os-surface-3))' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-warning)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1, color: warn ? 'var(--os-warning)' : 'var(--os-text-1)' }}>{value}</div>
            <div style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {totalBudget > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--os-text-4)', marginBottom: 4 }}>
            <span>Budget Utilisation</span>
            <span style={{ fontVariantNumeric: 'tabular-nums', color: spendCol }}>{spendPct}%</span>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: 'var(--os-border)' }}>
            <div style={{ width: `${Math.min(100, spendPct)}%`, height: '100%', borderRadius: 2, background: spendCol, transition: 'width 0.4s ease' }} />
          </div>
        </div>
      )}

      {all.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pending Requests</div>
          {all.slice(0, 3).map((a: any) => (
            <div key={a.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              padding: '6px 10px', borderRadius: 6,
              background: 'var(--os-surface-3)', border: '1px solid var(--os-warning)33',
            }}>
              <span style={{ fontSize: 12, color: 'var(--os-text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {a.description ?? a.actionType ?? 'Request'}
              </span>
              <button onClick={() => onAction('approve', { id: a.id })} style={{
                flexShrink: 0, fontSize: 10, padding: '2px 8px', borderRadius: 4, cursor: 'pointer',
                background: 'var(--os-blue-dim)', color: 'var(--os-blue)', border: '1px solid var(--os-blue)44',
              }}>Approve</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const ProcurementWidget = withWidgetContext(Core)
