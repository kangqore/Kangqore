import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

function confColor(c: number): string {
  if (c >= 0.8) return 'var(--os-success)'
  if (c >= 0.55) return 'var(--os-warning)'
  return 'var(--os-danger)'
}

function fmtValue(v: number | string | boolean | undefined): string {
  if (v === undefined || v === null) return '—'
  if (typeof v === 'boolean') return v ? 'Yes' : 'No'
  if (typeof v === 'number') return v.toLocaleString('en-US', { maximumFractionDigits: 2 })
  return String(v)
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const top: any[]   = Array.isArray(viewModel.topPredictions)    ? viewModel.topPredictions    : []
  const preds: any[] = Array.isArray(viewModel.predictions)       ? viewModel.predictions       : []
  const displayed    = top.length > 0 ? top : [...preds].sort((a, b) => b.confidence - a.confidence).slice(0, 5)

  const driftCount  = viewModel.activeDrifts        ?? preds.filter((p: any) => p.driftDetected).length
  const highConf    = viewModel.highConfidencePredictions ?? preds.filter((p: any) => p.confidence >= 0.8).length
  const total       = viewModel.totalPredictions    ?? preds.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Total',     value: total,      warn: false              },
          { label: 'Reliable',  value: highConf,   warn: false              },
          { label: 'Drifting',  value: driftCount, warn: driftCount > 0     },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1, color: warn ? 'var(--os-danger)' : 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
            <span style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Top 5 by confidence */}
      {displayed.length === 0 ? (
        <div style={{ fontSize: 11, color: 'var(--os-text-4)', textAlign: 'center', padding: '12px 0' }}>No predictions available</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Top Predictions · by confidence
          </div>
          {displayed.map((p: any) => {
            const confPct  = Math.round((p.confidence ?? 0) * 100)
            const col      = confColor(p.confidence ?? 0)
            const fv       = fmtValue(p.outcome?.forecastedValue)
            const unit     = p.outcome?.unit ? ` ${p.outcome.unit}` : ''
            const isAnomaly = p.outcome?.isAnomaly

            return (
              <div key={p.id} style={{
                padding: '7px 10px', borderRadius: 6,
                background: p.driftDetected ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
                border: p.driftDetected ? '1px solid var(--os-danger)33' : '1px solid var(--os-border-subtle)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.driftDetected && <span style={{ color: 'var(--os-danger)', marginRight: 4 }}>⚠</span>}
                      {isAnomaly && <span style={{ color: 'var(--os-warning)', marginRight: 4 }}>◆</span>}
                      {p.target ?? 'Prediction'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                      {p.horizon && (
                        <span style={{ fontSize: 9, color: 'var(--os-text-4)' }}>{p.horizon}</span>
                      )}
                      {fv !== '—' && (
                        <span style={{ fontSize: 9, fontWeight: 600, color: col, fontVariantNumeric: 'tabular-nums' }}>
                          → {fv}{unit}
                        </span>
                      )}
                      {p.driftDetected && (
                        <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-danger)' }}>DRIFT</span>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: col, fontVariantNumeric: 'tabular-nums' }}>{confPct}%</div>
                    <div style={{ height: 2, borderRadius: 1, background: 'var(--os-border)', width: 44, marginTop: 3 }}>
                      <div style={{ width: `${confPct}%`, height: '100%', borderRadius: 1, background: col }} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export const PredictionCenterWidget = withWidgetContext(Core)
