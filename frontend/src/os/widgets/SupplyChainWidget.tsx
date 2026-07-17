import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const forecasts: any[] = Array.isArray(viewModel.capacityForecasts) ? viewModel.capacityForecasts : []
  const drifts = forecasts.filter((f: any) => f.driftDetected)
  const highConf = forecasts.filter((f: any) => f.confidence >= 0.8)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Signals',    value: forecasts.length, warn: false },
          { label: 'High Conf',  value: highConf.length,  warn: false },
          { label: 'Drifts',     value: drifts.length,    warn: drifts.length > 0 },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1, color: warn ? 'var(--os-danger)' : 'var(--os-text-1)' }}>{value}</div>
            <div style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {forecasts.length === 0 ? (
        <div style={{ fontSize: 11, color: 'var(--os-text-4)', textAlign: 'center', padding: '12px 0' }}>No capacity signals</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Capacity Signals</div>
          {forecasts.slice(0, 4).map((f: any) => {
            const pct = Math.round((f.confidence ?? 0) * 100)
            const col = pct >= 80 ? 'var(--os-success)' : pct >= 60 ? 'var(--os-warning)' : 'var(--os-danger)'
            return (
              <div key={f.id ?? f.target} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                padding: '6px 10px', borderRadius: 6,
                background: f.driftDetected ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
                border: f.driftDetected ? '1px solid var(--os-danger)33' : '1px solid var(--os-border-subtle)',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: 'var(--os-text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {f.driftDetected && <span style={{ color: 'var(--os-danger)', marginRight: 4 }}>⚠</span>}
                    {f.target ?? 'Signal'} — {f.horizon ?? ''}
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: col, flexShrink: 0 }}>{pct}%</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export const SupplyChainWidget = withWidgetContext(Core)
