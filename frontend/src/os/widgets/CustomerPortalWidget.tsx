import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const STATUS_COL: Record<string, string> = {
  ON_TRACK: 'var(--os-success)',
  WATCH:    'var(--os-warning)',
  AT_RISK:  'var(--os-danger)',
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const clientPortals: any[] = Array.isArray(viewModel.clientPortals) ? viewModel.clientPortals : []
  const atRiskCount: number  = viewModel.clientPortalsAtRisk ?? clientPortals.filter((c: any) => c.status === 'AT_RISK').length
  const portalHealthy: boolean = viewModel.portalHealthy !== false
  const portalPath: string   = viewModel.clientPortals?.[0]?.portalPath ?? '/kangqore-view/client-portal'

  // Fallback to session-based list when no CRM projects
  const sessions: any[]    = Array.isArray(viewModel.externalSessions) ? viewModel.externalSessions : []
  const displayList        = clientPortals.length > 0 ? clientPortals : sessions
  const totalCount         = viewModel.clientPortalCount ?? displayList.length
  const avgTrust: number   = viewModel.avgExternalTrust ?? 0
  const avgPct             = Math.round(avgTrust > 1 ? avgTrust : avgTrust * 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Clients',  value: totalCount,   warn: false            },
          { label: 'At Risk',  value: atRiskCount,  warn: atRiskCount > 0  },
          { label: 'Avg Trust',value: `${avgPct}%`, warn: avgPct > 0 && avgPct < 50 },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1, color: warn ? 'var(--os-danger)' : 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Client portals list */}
      {clientPortals.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Client Portals · {totalCount} active
          </div>
          {clientPortals.slice(0, 4).map((c: any) => {
            const stCol = STATUS_COL[c.status] ?? 'var(--os-text-4)'
            return (
              <div key={c.id} style={{
                padding: '6px 10px', borderRadius: 5,
                background: c.status === 'AT_RISK' ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
                border: c.status === 'AT_RISK' ? '1px solid var(--os-danger)33' : '1px solid var(--os-border-subtle)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: 8, color: 'var(--os-text-4)', marginTop: 1 }}>
                      {c.projectCount} project{c.projectCount !== 1 ? 's' : ''} · {c.avgProgress}% avg
                    </div>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: stCol, flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {c.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      ) : sessions.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Customer Accounts
          </div>
          {sessions.slice(0, 4).map((s: any) => {
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
      ) : (
        <div style={{ fontSize: 11, color: 'var(--os-text-4)', textAlign: 'center', padding: '8px 0' }}>
          No active clients
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
          Open Client Portal
        </span>
        <span style={{ fontSize: 9, color: portalHealthy ? 'var(--os-success)' : 'var(--os-text-4)', fontWeight: 700 }}>
          {portalHealthy ? 'LIVE →' : 'OFFLINE'}
        </span>
      </a>
    </div>
  )
}

export const CustomerPortalWidget = withWidgetContext(Core)
