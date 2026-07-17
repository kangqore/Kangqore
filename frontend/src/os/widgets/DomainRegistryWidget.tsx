import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

function fmtSyncAge(iso: string | null): string {
  if (!iso) return 'Never'
  try {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60_000)
    if (m < 1) return 'Just now'
    if (m < 60) return `${m}m ago`
    return `${Math.floor(m / 60)}h ago`
  } catch { return '' }
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const domainRegistry: any[] = Array.isArray(viewModel.domainRegistry) ? viewModel.domainRegistry
    : Array.isArray(viewModel.domains) ? viewModel.domains : []
  const domains: any[]        = domainRegistry.length > 0 ? domainRegistry
    : Array.isArray(viewModel.domainRiskExposure) ? viewModel.domainRiskExposure : []

  const total     = viewModel.registeredDomains ?? domains.length
  const readyCount    = viewModel.readyDomainCount    ?? domains.filter((d: any) => d.ready).length
  const notReadyCount = viewModel.notReadyDomainCount ?? (total - readyCount)
  const capsTotal     = viewModel.domainCapabilities ?? domains.reduce((s: number, d: any) => s + (d.capabilities ?? 0), 0)
  const lastSynced: string | null = viewModel.lastSynced ?? null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* Sync header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          EDF · Domain Registry
        </span>
        <span style={{ fontSize: 9, color: 'var(--os-text-4)', fontVariantNumeric: 'tabular-nums' }}>
          synced {fmtSyncAge(lastSynced)}
        </span>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Domains',      value: total,        warn: false              },
          { label: 'Ready',        value: readyCount,   warn: false              },
          { label: 'Not Ready',    value: notReadyCount, warn: notReadyCount > 0 },
          { label: 'Capabilities', value: capsTotal,    warn: false              },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-warning-dim, var(--os-surface-3))' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-warning)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1, color: warn ? 'var(--os-warning)' : 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Domain list */}
      {domains.length === 0 ? (
        <div style={{ fontSize: 11, color: 'var(--os-text-4)', textAlign: 'center', padding: '12px 0' }}>
          No domains registered
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {domains.slice(0, 5).map((d: any) => {
            const breached = d.breachedKpis ?? 0
            const caps     = d.capabilities ?? 0
            const kpiCount = d.kpiCount ?? d.kpis?.length ?? 0
            const dotCol   = d.ready ? 'var(--os-success)' : 'var(--os-warning)'
            return (
              <div key={d.id} style={{
                padding: '6px 10px', borderRadius: 5,
                background: breached > 0 ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
                border: breached > 0 ? '1px solid var(--os-danger)33' : '1px solid var(--os-border-subtle)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: dotCol, flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 11, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {d.name}
                      </div>
                      {d.version && (
                        <span style={{ fontSize: 8, color: 'var(--os-text-4)' }}>v{d.version}</span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                    {caps > 0 && (
                      <span style={{ fontSize: 9, color: 'var(--os-blue)', fontVariantNumeric: 'tabular-nums' }}>
                        {caps} cap
                      </span>
                    )}
                    <span style={{ fontSize: 9, color: 'var(--os-text-4)', fontVariantNumeric: 'tabular-nums' }}>
                      {kpiCount} KPI{kpiCount !== 1 ? 's' : ''}
                    </span>
                    {breached > 0 && (
                      <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-danger)' }}>
                        {breached}⚠
                      </span>
                    )}
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

export const DomainRegistryWidget = withWidgetContext(Core)
