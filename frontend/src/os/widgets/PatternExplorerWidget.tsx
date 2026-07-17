import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const preds: any[]        = Array.isArray(viewModel.predictions) ? viewModel.predictions : []
  const drifts              = preds.filter((p: any) => p.driftDetected)
  const targets             = [...new Set(preds.map((p: any) => p.target as string))]
  const stableTargets       = targets.filter(t => !preds.some(p => p.target === t && p.driftDetected))
  const memoryCount: number = viewModel.kimmpMemoryCount ?? 0
  const memoryByType: any   = viewModel.memoryByType ?? {}
  const scenarios: any[]    = Array.isArray(viewModel.twinScenarios) ? viewModel.twinScenarios : []
  const bestScenario        = viewModel.bestScenario ?? scenarios[0] ?? null

  const memTypes = Object.entries(memoryByType).slice(0, 3)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Targets',    value: targets.length,       warn: false               },
          { label: 'Drifting',   value: drifts.length,        warn: drifts.length > 0   },
          { label: 'Stable',     value: stableTargets.length, warn: false               },
          { label: 'Memories',   value: memoryCount,          warn: false               },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1, color: warn ? 'var(--os-danger)' : 'var(--os-text-1)' }}>{value}</div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {targets.length === 0 ? (
        <div style={{ fontSize: 11, color: 'var(--os-text-4)', textAlign: 'center', padding: '8px 0' }}>No prediction patterns detected</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pattern Map</div>
          {targets.slice(0, 3).map((t: string) => {
            const signals  = preds.filter((p: any) => p.target === t)
            const hasDrift = signals.some(p => p.driftDetected)
            const avgConf  = signals.length ? Math.round(signals.reduce((s, p) => s + (p.confidence ?? 0), 0) / signals.length * 100) : 0
            return (
              <div key={t} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                padding: '5px 10px', borderRadius: 5,
                background: hasDrift ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
                border: hasDrift ? '1px solid var(--os-danger)33' : '1px solid var(--os-border-subtle)',
              }}>
                <span style={{ fontSize: 11, color: 'var(--os-text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {hasDrift && <span style={{ color: 'var(--os-danger)', marginRight: 4 }}>⚠</span>}
                  {t}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <span style={{ fontSize: 10, color: 'var(--os-text-4)', fontVariantNumeric: 'tabular-nums' }}>{signals.length} sig</span>
                  <span style={{ fontSize: 11, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
                    color: avgConf >= 80 ? 'var(--os-success)' : 'var(--os-warning)' }}>{avgConf}%</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {memTypes.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>KIMMP Memory</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {memTypes.map(([type, count]) => (
              <span key={type} style={{
                fontSize: 10, padding: '2px 7px', borderRadius: 4,
                background: 'var(--os-blue-dim)', color: 'var(--os-blue)', border: '1px solid var(--os-blue)22',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {type} {String(count)}
              </span>
            ))}
          </div>
        </div>
      )}

      {bestScenario && (
        <div style={{
          padding: '5px 10px', borderRadius: 5, fontSize: 11,
          background: 'var(--os-success-dim, var(--os-surface-3))', border: '1px solid var(--os-success)33',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ color: 'var(--os-text-3)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Best scenario: {bestScenario.name ?? bestScenario.type ?? 'Digital Twin'}
          </span>
          {bestScenario.confidence !== undefined && (
            <span style={{ fontWeight: 700, color: 'var(--os-success)', fontVariantNumeric: 'tabular-nums', flexShrink: 0, marginLeft: 8 }}>
              {Math.round((bestScenario.confidence ?? 0) * 100)}%
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export const PatternExplorerWidget = withWidgetContext(Core)
