import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const health: any     = viewModel.platformHealth ?? {}
  const pct: number     = health.healthPercent ?? 0
  const nominal: number = health.nominal ?? 0
  const total: number   = health.total   ?? 0
  const phases: any[]   = Array.isArray(viewModel.phases) ? viewModel.phases : []
  const failing         = phases.filter((p: any) => p.status !== 'PASS')

  let healthCol = 'var(--os-success)'
  if (pct < 50) healthCol = 'var(--os-danger)'
  else if (pct < 80) healthCol = 'var(--os-warning)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Health',    value: `${pct}%`,           col: healthCol },
          { label: 'Phases OK', value: `${nominal}/${total}`,col: nominal === total ? 'var(--os-success)' : 'var(--os-warning)' },
          { label: 'Failing',   value: failing.length,      col: failing.length > 0 ? 'var(--os-danger)' : 'var(--os-text-4)' },
        ].map(({ label, value, col }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1, color: col }}>{value}</div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--os-text-4)', marginBottom: 4 }}>
          <span>Platform Health</span>
          <span style={{ fontVariantNumeric: 'tabular-nums', color: healthCol }}>{pct}%</span>
        </div>
        <div style={{ height: 5, borderRadius: 3, background: 'var(--os-border)' }}>
          <div style={{ width: `${pct}%`, height: '100%', borderRadius: 3, background: healthCol, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {failing.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Degraded</div>
          {failing.slice(0, 3).map((p: any) => (
            <div key={p.name} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              padding: '4px 10px', borderRadius: 5,
              background: 'var(--os-danger-dim)', border: '1px solid var(--os-danger)33',
            }}>
              <span style={{ fontSize: 11, color: 'var(--os-text-2)' }}>{p.name}</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-danger)' }}>{p.status}</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          padding: '5px 10px', borderRadius: 5, fontSize: 11,
          background: 'var(--os-success-dim, var(--os-surface-3))', border: '1px solid var(--os-success)44',
          color: 'var(--os-success)',
        }}>
          All phases operational
        </div>
      )}
    </div>
  )
}

export const HealthMonitorWidget = withWidgetContext(Core)
