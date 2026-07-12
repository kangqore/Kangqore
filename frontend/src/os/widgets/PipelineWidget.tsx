// Pipeline Widget — Revenue Workspace

import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const stages: any[]     = Array.isArray(viewModel.pipelineStages) ? viewModel.pipelineStages : []
  const totalValue        = viewModel.pipelineTotalValue ?? '—'
  const dealCount: number = viewModel.pipelineDealCount  ?? 0
  const pending: number   = viewModel.pendingInvoices    ?? 0
  const overdue: number   = viewModel.overdueInvoices    ?? 0
  const contracts: number = viewModel.activeContracts    ?? 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Header stats */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
        {[
          { label: 'Pipeline',   value: totalValue, warn: false },
          { label: 'Deals',      value: dealCount,  warn: false },
          { label: 'Contracts',  value: contracts,  warn: false },
          { label: 'Overdue',    value: overdue,    warn: overdue > 0 },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{
              fontSize: warn ? 17 : 14, fontWeight: 700, lineHeight: 1,
              color: warn ? 'var(--os-danger)' : 'var(--os-text-1)',
            }}>{value}</div>
            <div style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Funnel stages */}
      {stages.length === 0 ? (
        <p style={{ color: 'var(--os-text-4)', fontSize: 12, margin: 0 }}>No pipeline data</p>
      ) : (
        stages.map((stage: any, i: number) => {
          const isAtRisk = stage.health === 'AT_RISK'
          const col      = isAtRisk ? 'var(--os-danger)' : 'var(--os-blue)'
          return (
            <div key={stage.id ?? i} style={{
              padding: '8px 10px', borderRadius: 6,
              background: 'var(--os-surface-3)',
              border: `1px solid ${isAtRisk ? 'var(--os-danger)44' : 'var(--os-border-subtle)'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-text-2)' }}>{stage.name}</span>
                <span style={{ fontSize: 11, color: 'var(--os-text-4)' }}>{stage.dealCount} deals</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: 'var(--os-border)' }}>
                <div style={{
                  width: `${stage.fillPercent ?? 0}%`, height: '100%', borderRadius: 2,
                  background: col, transition: 'width 0.4s ease',
                }} />
              </div>
              {stage.value > 0 && (
                <div style={{ fontSize: 10, color: col, marginTop: 3, textAlign: 'right', fontWeight: 600 }}>
                  {stage.value >= 1_000_000
                    ? `₹${(stage.value / 1_000_000).toFixed(1)}M`
                    : stage.value >= 1_000
                      ? `₹${(stage.value / 1_000).toFixed(0)}K`
                      : `₹${stage.value}`
                  }
                </div>
              )}
            </div>
          )
        })
      )}

      {pending > 0 && (
        <div style={{
          padding: '6px 10px', borderRadius: 6, fontSize: 11,
          background: 'var(--os-warning-dim)',
          border: '1px solid var(--os-warning)44',
          color: 'var(--os-warning)',
        }}>
          {pending} invoice{pending > 1 ? 's' : ''} pending payment
        </div>
      )}
    </div>
  )
}

export const PipelineWidget = withWidgetContext(Core)
