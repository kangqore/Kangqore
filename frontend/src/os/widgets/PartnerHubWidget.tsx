import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const partnerSessions: any[]  = Array.isArray(viewModel.partnerSessions)  ? viewModel.partnerSessions  : []
  const partnerProjects: any[]  = Array.isArray(viewModel.partnerProjects)  ? viewModel.partnerProjects  : []
  const fallbackSessions: any[] = Array.isArray(viewModel.externalSessions) ? viewModel.externalSessions : []
  const portalHealthy: boolean  = viewModel.portalHealthy !== false
  const portalPath: string      = viewModel.partnerPortalPath ?? '/kangqore-view/partner-portal'

  const displaySessions = partnerSessions.length > 0 ? partnerSessions : fallbackSessions.slice(0, 4)
  const partnerCount    = viewModel.partnerCount ?? displaySessions.length
  const deliverableCount = viewModel.partnerDeliverableCount ?? partnerProjects.length
  const avgTrust        = viewModel.avgExternalTrust ?? 0
  const trustPct        = Math.round(avgTrust > 1 ? avgTrust : avgTrust * 100)

  let trustCol = 'var(--os-success)'
  if (trustPct < 50) trustCol = 'var(--os-danger)'
  else if (trustPct < 75) trustCol = 'var(--os-warning)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Partners',     value: partnerCount,    warn: false         },
          { label: 'Deliverables', value: deliverableCount, warn: false        },
          { label: 'Avg Trust',    value: `${trustPct}%`,  warn: trustPct < 50 && trustPct > 0 },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1, color: warn ? 'var(--os-danger)' : trustCol, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Partner deliverables (in-progress projects) */}
      {partnerProjects.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Active Deliverables
          </div>
          {partnerProjects.slice(0, 3).map((p: any) => {
            const prog = p.progress ?? 0
            let progCol = 'var(--os-success)'
            if (prog < 33) progCol = 'var(--os-danger)'
            else if (prog < 66) progCol = 'var(--os-warning)'
            return (
              <div key={p.id} style={{
                padding: '6px 10px', borderRadius: 5,
                background: p.status === 'At Risk' ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
                border: p.status === 'At Risk' ? '1px solid var(--os-danger)33' : '1px solid var(--os-border-subtle)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.name}
                    </div>
                    {p.clientName && (
                      <div style={{ fontSize: 8, color: 'var(--os-text-4)', marginTop: 1 }}>{p.clientName}</div>
                    )}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: progCol, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                    {prog}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Partner accounts (sessions) */}
      {displaySessions.length > 0 && partnerProjects.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Partner Accounts
          </div>
          {displaySessions.slice(0, 4).map((s: any) => {
            const trust = Math.round((s.trustScore ?? 0) * 100)
            return (
              <div key={s.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                padding: '5px 10px', borderRadius: 5,
                background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
              }}>
                <span style={{ fontSize: 11, color: 'var(--os-text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {s.company ?? s.name ?? s.id}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, flexShrink: 0, fontVariantNumeric: 'tabular-nums',
                  color: trust >= 75 ? 'var(--os-success)' : 'var(--os-warning)' }}>{trust}%</span>
              </div>
            )
          })}
        </div>
      )}

      {displaySessions.length === 0 && partnerProjects.length === 0 && (
        <div style={{ fontSize: 11, color: 'var(--os-text-4)', textAlign: 'center', padding: '8px 0' }}>
          No active partner activity
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
          Open Partner Portal
        </span>
        <span style={{ fontSize: 9, fontWeight: 700, color: portalHealthy ? 'var(--os-success)' : 'var(--os-text-4)' }}>
          {portalHealthy ? 'LIVE →' : 'OFFLINE'}
        </span>
      </a>
    </div>
  )
}

export const PartnerHubWidget = withWidgetContext(Core)
