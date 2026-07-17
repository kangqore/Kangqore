import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const caps: string[]    = Array.isArray(viewModel.activeCapabilities) ? viewModel.activeCapabilities : []
  const totalCaps: number = viewModel.domainCapabilities ?? caps.length
  const idle              = Math.max(0, totalCaps - caps.length)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Loaded',   value: caps.length, warn: false     },
          { label: 'Total',    value: totalCaps,   warn: false     },
          { label: 'Inactive', value: idle,        warn: idle > 0  },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-warning-dim, var(--os-surface-3))' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-warning)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1, color: warn ? 'var(--os-warning)' : 'var(--os-text-1)' }}>{value}</div>
            <span style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {caps.length === 0 ? (
        <div style={{ fontSize: 11, color: 'var(--os-text-4)', textAlign: 'center', padding: '12px 0' }}>No extensions loaded</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Loaded Extensions</div>
          {caps.slice(0, 5).map((c: string) => (
            <div key={c} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              padding: '4px 10px', borderRadius: 5,
              background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
            }}>
              <span style={{ fontSize: 11, color: 'var(--os-text-2)' }}>{c}</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-success)' }}>✓</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const ExtensionsWidget = withWidgetContext(Core)
