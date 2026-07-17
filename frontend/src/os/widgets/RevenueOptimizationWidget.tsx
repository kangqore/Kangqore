// Revenue Optimization Widget — Revenue Workspace
// EPF-powered revenue signals: prediction confidence, drift alerts, MRR trajectory, optimisation recommendations.

import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const highConf: number  = viewModel.highConfidencePredictions ?? 0
  const drifts: number    = viewModel.activeDrifts              ?? 0
  const totalPred: number = viewModel.totalPredictions          ?? 0
  const briefings: any[]  = Array.isArray(viewModel.analyticsBriefings) ? viewModel.analyticsBriefings : []
  const kpis              = viewModel.financialKpis
  const mrrDelta: number  = kpis?.mrrDeltaPct ?? 0
  const preds: any[]      = Array.isArray(viewModel.predictions) ? viewModel.predictions : []

  const deltaCol    = mrrDelta >= 0 ? 'var(--os-success)' : 'var(--os-danger)'
  const confRate    = totalPred > 0 ? Math.round((highConf / totalPred) * 100) : 0
  const recs: string[] = briefings.flatMap(b => b.recommendations ?? []).slice(0, 3)
  const topPred    = preds.filter(p => p.confidence >= 0.8).slice(0, 3)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Stats */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Predictions', value: totalPred, warn: false       },
          { label: 'High Conf',   value: highConf,  warn: false       },
          { label: 'Drifts',      value: drifts,    warn: drifts > 0  },
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

      {/* MRR delta + confidence rate */}
      <div style={{ display: 'flex', gap: 6 }}>
        {kpis && (
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '6px 10px', borderRadius: 6,
            background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
          }}>
            <span style={{ fontSize: 10, color: 'var(--os-text-4)' }}>MRR Δ</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: deltaCol, fontVariantNumeric: 'tabular-nums' }}>
              {mrrDelta >= 0 ? '+' : ''}{mrrDelta.toFixed(1)}%
            </span>
          </div>
        )}
        {totalPred > 0 && (
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '6px 10px', borderRadius: 6,
            background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
          }}>
            <span style={{ fontSize: 10, color: 'var(--os-text-4)' }}>Conf rate</span>
            <span style={{ fontSize: 12, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
              color: confRate >= 70 ? 'var(--os-success)' : 'var(--os-warning)' }}>{confRate}%</span>
          </div>
        )}
      </div>

      {/* Top high-confidence predictions */}
      {topPred.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>High-Confidence Signals</div>
          {topPred.map((p: any, i: number) => (
            <div key={p.id ?? i} style={{
              padding: '5px 9px', borderRadius: 5, fontSize: 11,
              background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ color: 'var(--os-text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {p.label ?? p.type ?? 'Signal'}
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-success)', flexShrink: 0, marginLeft: 6, fontVariantNumeric: 'tabular-nums' }}>
                {Math.round((p.confidence ?? 0) * 100)}%
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Optimisation recommendations */}
      {recs.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Optimisation Signals</div>
          {recs.map((r: string) => (
            <div key={r} style={{
              padding: '5px 9px', borderRadius: 5, fontSize: 11,
              background: 'var(--os-blue-dim)', border: '1px solid var(--os-blue)33',
              color: 'var(--os-text-2)',
            }}>
              <span style={{ color: 'var(--os-blue)', marginRight: 5 }}>↗</span>{r}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const RevenueOptimizationWidget = withWidgetContext(Core)
