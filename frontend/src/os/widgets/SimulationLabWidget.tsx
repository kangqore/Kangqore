import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  } catch { return iso }
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const scenarios: any[] = Array.isArray(viewModel.twinScenarios) ? viewModel.twinScenarios : []
  const oisScore         = viewModel.oisScore ?? null
  const bestScenario: any | null = viewModel.bestScenario ?? null
  const preds: any[]     = Array.isArray(viewModel.predictions) ? viewModel.predictions : []
  const driftCount       = viewModel.activeDrifts ?? preds.filter((p: any) => p.driftDetected).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* Current OIS + twin summary */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          {
            label: 'Current OIS',
            value: oisScore !== null ? oisScore.toFixed(1) : '—',
            col:   oisScore !== null && oisScore >= 70 ? 'var(--os-success)' : 'var(--os-warning)',
          },
          {
            label: 'Scenarios Run',
            value: scenarios.length,
            col:   'var(--os-text-1)',
          },
          {
            label: 'Drift Signals',
            value: driftCount,
            col:   driftCount > 0 ? 'var(--os-danger)' : 'var(--os-text-1)',
          },
        ].map(({ label, value, col }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1, color: col, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Best scenario highlight */}
      {bestScenario && (
        <div style={{
          padding: '8px 11px', borderRadius: 6,
          background: bestScenario.delta >= 0 ? 'var(--os-success)10' : 'var(--os-danger)10',
          border: `1px solid ${bestScenario.delta >= 0 ? 'var(--os-success)' : 'var(--os-danger)'}33`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Best Scenario
            </span>
            <span style={{
              fontSize: 12, fontWeight: 800,
              color: bestScenario.delta >= 0 ? 'var(--os-success)' : 'var(--os-danger)',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {bestScenario.delta >= 0 ? '+' : ''}{bestScenario.delta.toFixed(1)} OIS
            </span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--os-text-2)', marginTop: 4, lineHeight: 1.4 }}>
            {bestScenario.scenario.slice(0, 80)}
          </div>
          {bestScenario.recommendation && (
            <div style={{ fontSize: 9, color: 'var(--os-success)', marginTop: 3 }}>
              ↗ {bestScenario.recommendation.slice(0, 70)}
            </div>
          )}
        </div>
      )}

      {/* Recent scenarios */}
      {scenarios.length === 0 ? (
        <div style={{
          padding: '6px 10px', borderRadius: 5, fontSize: 11,
          background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
          color: 'var(--os-text-4)', textAlign: 'center',
        }}>
          No scenarios run yet — try WhatIf widget
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Recent Scenarios · G8.3 Digital Twin
          </div>
          {scenarios.slice(0, 4).map((s: any) => {
            const positive = s.delta >= 0
            const col      = positive ? 'var(--os-success)' : 'var(--os-danger)'
            const confPct  = Math.round((s.confidence ?? 0) * 100)
            return (
              <div key={s.id} style={{
                padding: '6px 10px', borderRadius: 5,
                background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: 'var(--os-text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.scenario}
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                      <span style={{ fontSize: 8, color: 'var(--os-text-4)' }}>{s.horizon}d · {fmtDate(s.createdAt)}</span>
                      <span style={{ fontSize: 8, color: 'var(--os-text-4)', fontVariantNumeric: 'tabular-nums' }}>{confPct}% conf</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: col, fontVariantNumeric: 'tabular-nums' }}>
                      {positive ? '+' : ''}{s.delta.toFixed(1)}
                    </div>
                    <div style={{ fontSize: 8, color: 'var(--os-text-4)' }}>OIS Δ</div>
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

export const SimulationLabWidget = withWidgetContext(Core)
