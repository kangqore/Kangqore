import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const preds: any[]     = Array.isArray(viewModel.predictions) ? viewModel.predictions : []
  const total: number    = viewModel.totalPredictions            ?? preds.length
  const highConf: number = viewModel.highConfidencePredictions   ?? 0
  const drifts: number   = viewModel.activeDrifts                ?? 0
  const conf: number     = (viewModel.confidence as number)      ?? 0
  const confPct          = Math.round(conf * 100)

  let confCol = 'var(--os-success)'
  if (confPct < 50) confCol = 'var(--os-danger)'
  else if (confPct < 75) confCol = 'var(--os-warning)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Predictions', value: total,    warn: false      },
          { label: 'High Conf',   value: highConf, warn: false      },
          { label: 'Drifts',      value: drifts,   warn: drifts > 0 },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1, color: warn ? 'var(--os-danger)' : 'var(--os-text-1)' }}>{value}</div>
            <span style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--os-text-4)', marginBottom: 4 }}>
          <span>Intelligence Confidence</span>
          <span style={{ fontVariantNumeric: 'tabular-nums', color: confCol }}>{confPct}%</span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: 'var(--os-border)' }}>
          <div style={{ width: `${confPct}%`, height: '100%', borderRadius: 2, background: confCol, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {preds.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Live Signals</div>
          {preds.slice(0, 3).map((p: any) => {
            const pct = Math.round((p.confidence ?? 0) * 100)
            let col = 'var(--os-success)'
            if (pct < 60) col = 'var(--os-danger)'
            else if (pct < 80) col = 'var(--os-warning)'
            return (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                padding: '5px 10px', borderRadius: 5,
                background: p.driftDetected ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
                border: p.driftDetected ? '1px solid var(--os-danger)33' : '1px solid var(--os-border-subtle)',
              }}>
                <span style={{ fontSize: 12, color: 'var(--os-text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.driftDetected && <span style={{ color: 'var(--os-danger)', marginRight: 4 }}>⚠</span>}
                  {p.target ?? 'Signal'}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: col, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export const AnalyticsDashboardWidget = withWidgetContext(Core)
