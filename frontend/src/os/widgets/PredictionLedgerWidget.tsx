// Prediction Ledger Widget — Governance Workspace
// KIMMP decision ledger: open vs resolved decisions, evidence quality, live signal drifts.

import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const decisions: any[]  = Array.isArray(viewModel.kimmpDecisions) ? viewModel.kimmpDecisions : []
  const openCount: number = viewModel.openKimmpCount    ?? decisions.filter(d => !d.selected).length
  const resolvedCount     = viewModel.resolvedKimmpCount ?? decisions.filter(d =>  d.selected).length
  const evidence: any[]   = Array.isArray(viewModel.evidenceLedger) ? viewModel.evidenceLedger : []
  const drifting          = (viewModel.activeDrifts as number) ?? 0
  const openDecisions     = decisions.filter(d => !d.selected && !d.outcome).slice(0, 4)

  const resolutionRate    = decisions.length > 0 ? Math.round((resolvedCount / decisions.length) * 100) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Stats */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Decisions',  value: decisions.length, warn: false          },
          { label: 'Open',       value: openCount,        warn: openCount > 5  },
          { label: 'Resolved',   value: resolvedCount,    warn: false          },
          { label: 'Drifts',     value: drifting,         warn: drifting > 0   },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1, color: warn ? 'var(--os-danger)' : 'var(--os-text-1)' }}>{value}</div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Resolution rate bar */}
      {decisions.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--os-text-4)', marginBottom: 3 }}>
            <span>Resolution rate</span>
            <span style={{ fontVariantNumeric: 'tabular-nums', color: resolutionRate >= 70 ? 'var(--os-success)' : 'var(--os-warning)' }}>
              {resolutionRate}%
            </span>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: 'var(--os-border)' }}>
            <div style={{ width: `${resolutionRate}%`, height: '100%', borderRadius: 2,
              background: resolutionRate >= 70 ? 'var(--os-success)' : 'var(--os-warning)', transition: 'width 0.4s ease' }} />
          </div>
        </div>
      )}

      {/* Open decisions */}
      {openDecisions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Open Decisions</div>
          {openDecisions.map((d: any) => {
            const conf = Math.round((d.confidence ?? 0) * 100)
            const col  = conf >= 80 ? 'var(--os-success)' : conf >= 50 ? 'var(--os-warning)' : 'var(--os-danger)'
            return (
              <div key={d.id} style={{
                padding: '6px 10px', borderRadius: 5,
                background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6,
              }}>
                <span style={{ fontSize: 11, color: 'var(--os-text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {d.question ?? 'Decision'}
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, color: col, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{conf}%</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Evidence ledger summary */}
      {evidence.length > 0 && (
        <div style={{
          padding: '5px 10px', borderRadius: 5, fontSize: 11,
          background: 'var(--os-blue-dim)', border: '1px solid var(--os-blue)22',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ color: 'var(--os-text-3)' }}>Evidence records</span>
          <span style={{ fontWeight: 700, color: 'var(--os-blue)', fontVariantNumeric: 'tabular-nums' }}>{evidence.length}</span>
        </div>
      )}
    </div>
  )
}

export const PredictionLedgerWidget = withWidgetContext(Core)
