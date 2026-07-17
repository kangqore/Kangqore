import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const clientPortals: any[]  = Array.isArray(viewModel.clientPortals)    ? viewModel.clientPortals    : []
  const partnerCount: number  = viewModel.partnerCount    ?? 0
  const vendorCount: number   = viewModel.vendorCount     ?? 0
  const portalCount: number   = viewModel.clientPortalCount ?? clientPortals.length
  const atRiskCount: number   = viewModel.clientPortalsAtRisk ?? clientPortals.filter((c: any) => c.status === 'AT_RISK').length
  const avgTrust: number      = viewModel.avgExternalTrust ?? 0
  const evidenceCount: number = viewModel.evidenceCount   ?? 0
  const sessions: any[]       = Array.isArray(viewModel.externalSessions) ? viewModel.externalSessions : []

  let trustCol = 'var(--os-danger)'
  if (avgTrust >= 0.75)      trustCol = 'var(--os-success)'
  else if (avgTrust >= 0.5)  trustCol = 'var(--os-warning)'
  const trustPct = Math.round(avgTrust * 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Client Portals', value: portalCount,  warn: false               },
          { label: 'At Risk',        value: atRiskCount,  warn: atRiskCount > 0     },
          { label: 'Partners',       value: partnerCount, warn: false               },
          { label: 'Vendors',        value: vendorCount,  warn: false               },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1, color: warn ? 'var(--os-danger)' : 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {sessions.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--os-text-4)', marginBottom: 3 }}>
            <span>External trust ({sessions.length} sessions)</span>
            <span style={{ fontVariantNumeric: 'tabular-nums', color: trustCol }}>{trustPct}%</span>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: 'var(--os-border)' }}>
            <div style={{ width: `${trustPct}%`, height: '100%', borderRadius: 2, background: trustCol, transition: 'width 0.4s ease' }} />
          </div>
        </div>
      )}

      {clientPortals.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Client Portals</div>
          {clientPortals.slice(0, 4).map((c: any) => {
            const isRisk = c.status === 'AT_RISK'
            return (
              <div key={c.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                padding: '5px 10px', borderRadius: 5,
                background: isRisk ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
                border: isRisk ? '1px solid var(--os-danger)33' : '1px solid var(--os-border-subtle)',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: 'var(--os-text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.name ?? c.id}
                  </div>
                  {c.projectCount > 0 && (
                    <div style={{ fontSize: 10, color: 'var(--os-text-4)', fontVariantNumeric: 'tabular-nums' }}>
                      {c.projectCount} project{c.projectCount > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, color: isRisk ? 'var(--os-danger)' : 'var(--os-success)', flexShrink: 0 }}>
                  {c.status ?? 'ACTIVE'}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {evidenceCount > 0 && (
        <div style={{
          padding: '5px 10px', borderRadius: 5, fontSize: 11,
          background: 'var(--os-blue-dim)', border: '1px solid var(--os-blue)22',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ color: 'var(--os-text-3)' }}>Evidence records</span>
          <span style={{ fontWeight: 700, color: 'var(--os-blue)', fontVariantNumeric: 'tabular-nums' }}>{evidenceCount}</span>
        </div>
      )}
    </div>
  )
}

export const WebhookConfigWidget = withWidgetContext(Core)
