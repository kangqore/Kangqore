import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const vendorSessions: any[]   = Array.isArray(viewModel.vendorSessions)   ? viewModel.vendorSessions   : []
  const untaggedSessions: any[] = Array.isArray(viewModel.untaggedSessions) ? viewModel.untaggedSessions : []
  const fallbackSessions: any[] = Array.isArray(viewModel.externalSessions) ? viewModel.externalSessions : []
  const portalHealthy: boolean  = viewModel.portalHealthy !== false
  const portalPath: string      = viewModel.vendorPortalPath ?? '/kangqore-view/vendor-portal'

  // Prefer explicit vendor sessions; fall back to untagged then all
  let displaySessions: any[]
  if (vendorSessions.length > 0) displaySessions = vendorSessions
  else if (untaggedSessions.length > 0) displaySessions = untaggedSessions
  else displaySessions = fallbackSessions

  const vendorCount = viewModel.vendorCount ?? displaySessions.length
  const highTrust   = displaySessions.filter((s: any) => (s.trustScore ?? 0) >= 0.75).length
  const lowTrust    = displaySessions.filter((s: any) => (s.trustScore ?? 0) < 0.5).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Vendors',    value: vendorCount, warn: false          },
          { label: 'High Trust', value: highTrust,   warn: false          },
          { label: 'Low Trust',  value: lowTrust,    warn: lowTrust > 0   },
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

      {/* Vendor accounts */}
      {displaySessions.length === 0 ? (
        <div style={{ fontSize: 11, color: 'var(--os-text-4)', textAlign: 'center', padding: '8px 0' }}>
          No active vendor sessions
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Vendor Accounts
          </div>
          {displaySessions.slice(0, 4).map((s: any) => {
            const trust = Math.round((s.trustScore ?? 0) * 100)
            let trustCol = 'var(--os-success)'
            if (trust < 50) trustCol = 'var(--os-danger)'
            else if (trust < 75) trustCol = 'var(--os-warning)'
            return (
              <div key={s.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                padding: '5px 10px', borderRadius: 5,
                background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
              }}>
                <span style={{ fontSize: 11, color: 'var(--os-text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {s.company ?? s.name ?? s.id}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: trustCol, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{trust}%</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Portal bridge */}
      <a
        href={portalPath}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 10px', borderRadius: 5, textDecoration: 'none',
          background: portalHealthy ? 'var(--os-blue-dim)' : 'var(--os-surface-3)',
          border: portalHealthy ? '1px solid var(--os-blue)44' : '1px solid var(--os-border-subtle)',
        }}
      >
        <span style={{ fontSize: 10, fontWeight: 600, color: portalHealthy ? 'var(--os-blue)' : 'var(--os-text-4)' }}>
          Open Vendor Portal
        </span>
        <span style={{ fontSize: 9, fontWeight: 700, color: portalHealthy ? 'var(--os-success)' : 'var(--os-text-4)' }}>
          {portalHealthy ? 'LIVE →' : 'OFFLINE'}
        </span>
      </a>
    </div>
  )
}

export const VendorPortalWidget = withWidgetContext(Core)
