import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const domains: any[]  = Array.isArray(viewModel.operationalDomains) ? viewModel.operationalDomains : []
  const workflows: any[] = Array.isArray(viewModel.workflows) ? viewModel.workflows : []
  const readyCount      = domains.filter((d: any) => d.ready).length
  const totalCap        = domains.reduce((s: number, d: any) => s + (d.capabilities ?? 0), 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Domains',      value: domains.length   },
          { label: 'Ready',        value: readyCount       },
          { label: 'Capabilities', value: totalCap         },
          { label: 'Workflows',    value: workflows.length },
        ].map(({ label, value }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1, color: 'var(--os-text-1)' }}>{value}</div>
            <span style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {domains.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Domain Assets</div>
          {domains.slice(0, 5).map((d: any) => (
            <div key={d.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              padding: '5px 10px', borderRadius: 5,
              background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
            }}>
              <span style={{ fontSize: 12, color: 'var(--os-text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                {d.capabilities != null && (
                  <span style={{ fontSize: 10, color: 'var(--os-text-4)' }}>{d.capabilities} cap</span>
                )}
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 3,
                  background: d.ready ? 'var(--os-success)18' : 'var(--os-border)',
                  color: d.ready ? 'var(--os-success)' : 'var(--os-text-4)',
                }}>{d.ready ? 'Ready' : 'Pending'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const AssetManagerWidget = withWidgetContext(Core)
