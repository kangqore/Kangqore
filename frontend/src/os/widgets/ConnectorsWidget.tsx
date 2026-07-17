import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const domains: any[]       = Array.isArray(viewModel.domains)           ? viewModel.domains           : []
  const domainReg: any[]     = Array.isArray(viewModel.domainRegistry)    ? viewModel.domainRegistry    : domains
  const models: any[]        = Array.isArray(viewModel.registeredModels)  ? viewModel.registeredModels  : []
  const totalCaps: number    = viewModel.domainCapabilities ?? domainReg.reduce((s: number, d: any) => s + (d.capabilities ?? 0), 0)
  const readyCount: number   = viewModel.readyDomainCount   ?? domainReg.filter((d: any) => d.ready).length
  const notReady: number     = viewModel.notReadyDomainCount ?? domainReg.length - readyCount
  const wirVerdict: string   = viewModel.wirVerdict ?? 'NO_DATA'
  let wirCol = 'var(--os-danger)'
  if (wirVerdict === 'PASS')    wirCol = 'var(--os-success)'
  else if (wirVerdict === 'WARN')    wirCol = 'var(--os-warning)'
  else if (wirVerdict === 'NO_DATA') wirCol = 'var(--os-text-4)'

  const displayDomains = domainReg.length > 0 ? domainReg : domains

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Domains',     value: displayDomains.length, warn: false          },
          { label: 'Ready',       value: readyCount,            warn: false          },
          { label: 'Not Ready',   value: notReady,              warn: notReady > 0   },
          { label: 'Capabilities',value: totalCaps,             warn: false          },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-warning-dim, var(--os-surface-3))' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-warning)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1, color: warn ? 'var(--os-warning)' : 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {displayDomains.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Domain Connectors</div>
          {displayDomains.slice(0, 4).map((d: any) => {
            const ok = d.ready
            return (
              <div key={d.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                padding: '4px 10px', borderRadius: 5,
                background: ok ? 'var(--os-surface-3)' : 'var(--os-warning-dim, var(--os-surface-3))',
                border: ok ? '1px solid var(--os-border-subtle)' : '1px solid var(--os-warning)33',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: ok ? 'var(--os-success)' : 'var(--os-text-4)', flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: 'var(--os-text-2)' }}>{d.name}</span>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                  {(d.capabilities ?? d.kpis?.length ?? 0) > 0 && (
                    <span style={{ fontSize: 10, color: 'var(--os-text-4)', fontVariantNumeric: 'tabular-nums' }}>
                      {d.capabilities ?? d.kpis?.length ?? 0} cap
                    </span>
                  )}
                  <span style={{ fontSize: 9, fontWeight: 700, color: ok ? 'var(--os-success)' : 'var(--os-text-4)' }}>
                    {ok ? 'ON' : 'OFF'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {models.length > 0 && (
        <div style={{
          padding: '5px 10px', borderRadius: 5, fontSize: 11,
          background: 'var(--os-blue-dim)', border: '1px solid var(--os-blue)22',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ color: 'var(--os-text-3)' }}>WIR models registered</span>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontWeight: 700, color: 'var(--os-blue)', fontVariantNumeric: 'tabular-nums' }}>{models.length}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: wirCol }}>{wirVerdict}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export const ConnectorsWidget = withWidgetContext(Core)
