import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const kpis: any         = viewModel.financialKpis ?? null
  const target: any       = viewModel.revenueTarget  ?? null
  const onTimePct: number = viewModel.onTimeProjectPct ?? 0

  if (!kpis && !target) {
    return <p style={{ color: 'var(--os-text-4)', fontSize: 12, margin: 0 }}>Financial data loading…</p>
  }

  const delta: number = kpis?.mrrDeltaPct ?? 0
  const deltaColor    = delta > 0 ? 'var(--os-success)' : delta < 0 ? 'var(--os-danger)' : 'var(--os-text-4)'
  const deltaSign     = delta > 0 ? '+' : ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* ARR — hero number */}
      <div style={{
        padding: '10px 12px', borderRadius: 8,
        background: 'var(--os-blue-dim)',
        border: '1px solid var(--os-blue)33',
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-blue)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
          Annual Recurring Revenue
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--os-text-1)', lineHeight: 1 }}>
          {target?.arr ?? '—'}
        </div>
        {delta !== 0 && (
          <div style={{ fontSize: 11, color: deltaColor, marginTop: 4 }}>
            {deltaSign}{delta}% MoM · MTD {target?.value ?? '—'} vs {target?.lastMonth ?? '—'} LM
          </div>
        )}
      </div>

      {/* KPI row */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'MTD Revenue', value: target?.value ?? '—',           warn: false },
          { label: 'On-Time',     value: `${onTimePct}%`,                warn: onTimePct < 70 },
          { label: 'Overdue Inv', value: kpis?.overdueInvoices ?? 0,     warn: (kpis?.overdueInvoices ?? 0) > 0 },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 6px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{
              fontSize: 14, fontWeight: 700, lineHeight: 1,
              color: warn ? 'var(--os-danger)' : 'var(--os-text-1)',
            }}>{value}</div>
            <div style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Budget utilisation */}
      {kpis && kpis.totalBudget > 0 && (
        <div style={{ padding: '8px 10px', borderRadius: 6, background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: 'var(--os-text-4)' }}>Budget Utilisation</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-2)' }}>
              {Math.round((kpis.totalSpend / kpis.totalBudget) * 100)}%
            </span>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: 'var(--os-border)' }}>
            <div style={{
              width: `${Math.min(100, Math.round((kpis.totalSpend / kpis.totalBudget) * 100))}%`,
              height: '100%', borderRadius: 2,
              background: kpis.totalSpend / kpis.totalBudget > 0.9 ? 'var(--os-danger)' : 'var(--os-blue)',
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
      )}
    </div>
  )
}

export const ForecastWidget = withWidgetContext(Core)
