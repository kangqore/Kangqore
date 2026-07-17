import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const subsystems: Record<string, string> = (viewModel.subsystems as any) ?? {}
  const domains: number   = viewModel.registeredDomains ?? 0
  const caps: string[]    = Array.isArray(viewModel.activeCapabilities) ? viewModel.activeCapabilities : []
  const subEntries        = Object.entries(subsystems)
  const total             = domains + subEntries.length + caps.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Total Objects', value: total,           warn: false },
          { label: 'Domains',       value: domains,         warn: false },
          { label: 'Subsystems',    value: subEntries.length,warn: false },
          { label: 'Capabilities',  value: caps.length,     warn: false },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1, color: 'var(--os-text-1)' }}>{value}</div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {subEntries.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Subsystem Objects</div>
          {subEntries.slice(0, 4).map(([k, v]) => (
            <div key={k} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              padding: '4px 10px', borderRadius: 5,
              background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
            }}>
              <span style={{ fontSize: 11, color: 'var(--os-text-2)' }}>{k}</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: v === 'OPERATIONAL' ? 'var(--os-success)' : 'var(--os-warning)' }}>{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const ObjectCatalogWidget = withWidgetContext(Core)
