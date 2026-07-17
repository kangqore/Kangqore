// Pricing Widget — Revenue Workspace
// Contract pricing view: active contracts, ARR, invoice health, stage pricing breakdown.

import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

function fmt(n: number): string {
  if (n >= 1_000_000) return `₹${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `₹${(n / 1_000).toFixed(0)}K`
  return `₹${n.toFixed(0)}`
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const stages: any[] = Array.isArray(viewModel.pipelineStages) ? viewModel.pipelineStages : []
  const kpis          = viewModel.financialKpis
  const contracts     = kpis?.activeContracts ?? 0
  const arr           = kpis?.arr             ?? 0
  const overdueInv    = kpis?.overdueInvoices ?? 0
  const pendingInv    = kpis?.pendingInvoices ?? 0
  const onTimePct     = viewModel.onTimeProjectPct ?? 0

  const arrFormatted  = kpis ? fmt(arr) : '—'
  const mrrFormatted  = kpis ? fmt(arr / 12) : '—'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Key numbers */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Contracts', value: contracts,  warn: false          },
          { label: 'ARR',       value: arrFormatted, warn: false        },
          { label: 'Overdue',   value: overdueInv, warn: overdueInv > 0 },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1, color: warn ? 'var(--os-danger)' : 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
            <span style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* MRR + On-time */}
      <div style={{ display: 'flex', gap: 6 }}>
        <div style={{
          flex: 1, padding: '6px 10px', borderRadius: 6,
          background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 10, color: 'var(--os-text-4)' }}>MRR</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{mrrFormatted}</span>
        </div>
        <div style={{
          flex: 1, padding: '6px 10px', borderRadius: 6,
          background: onTimePct >= 80 ? 'var(--os-success-dim, var(--os-surface-3))' : 'var(--os-warning-dim, var(--os-surface-3))',
          border: `1px solid ${onTimePct >= 80 ? 'var(--os-success)33' : 'var(--os-warning)44'}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 10, color: 'var(--os-text-4)' }}>On-time</span>
          <span style={{ fontSize: 12, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
            color: onTimePct >= 80 ? 'var(--os-success)' : 'var(--os-warning)' }}>{onTimePct}%</span>
        </div>
      </div>

      {/* Invoice status */}
      {(pendingInv > 0 || overdueInv > 0) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Invoice Alerts</div>
          {pendingInv > 0 && (
            <div style={{ padding: '5px 10px', borderRadius: 5, fontSize: 11,
              background: 'var(--os-blue-dim)', border: '1px solid var(--os-blue)22', color: 'var(--os-text-2)' }}>
              {pendingInv} invoice{pendingInv > 1 ? 's' : ''} pending payment
            </div>
          )}
          {overdueInv > 0 && (
            <div style={{ padding: '5px 10px', borderRadius: 5, fontSize: 11,
              background: 'var(--os-danger-dim)', border: '1px solid var(--os-danger)33', color: 'var(--os-danger)' }}>
              {overdueInv} invoice{overdueInv > 1 ? 's' : ''} overdue — action required
            </div>
          )}
        </div>
      )}

      {/* Pipeline pricing */}
      {stages.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pipeline Pricing</div>
          {stages.map((s: any) => {
            const atRisk = s.health === 'AT_RISK'
            const col    = atRisk ? 'var(--os-danger)' : 'var(--os-success)'
            return (
              <div key={s.id ?? s.name} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                padding: '6px 10px', borderRadius: 6,
                background: 'var(--os-surface-3)', border: `1px solid ${atRisk ? 'var(--os-danger)33' : 'var(--os-border-subtle)'}`,
              }}>
                <span style={{ fontSize: 12, color: 'var(--os-text-2)' }}>{s.name}</span>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--os-text-4)', fontVariantNumeric: 'tabular-nums' }}>{s.dealCount} deals</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: col, fontVariantNumeric: 'tabular-nums' }}>
                    {typeof s.value === 'number' ? fmt(s.value) : (s.value ?? '—')}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export const PricingWidget = withWidgetContext(Core)
