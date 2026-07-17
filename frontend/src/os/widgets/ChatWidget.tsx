import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const conversations: any[] = Array.isArray(viewModel.conversations)
    ? viewModel.conversations
    : Array.isArray(viewModel.liveSessions) ? viewModel.liveSessions : []

  const highTrustCount: number = Array.isArray(viewModel.highTrustSessions) ? viewModel.highTrustSessions.length : 0
  const lowTrustCount: number  = Array.isArray(viewModel.lowTrustSessions)  ? viewModel.lowTrustSessions.length  : 0
  const avgTrust: number = viewModel.avgTrust ?? 0
  const avgPct = Math.round(avgTrust * 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Conversations', value: conversations.length, warn: false               },
          { label: 'High Trust',    value: highTrustCount,       warn: false               },
          { label: 'Low Trust',     value: lowTrustCount,        warn: lowTrustCount > 0   },
          { label: 'Avg Trust',     value: `${avgPct}%`,         warn: avgPct < 50         },
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

      {/* Enterprise conversations */}
      {conversations.length === 0 ? (
        <div style={{ fontSize: 11, color: 'var(--os-text-4)', textAlign: 'center', padding: '12px 0' }}>
          No active enterprise conversations
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            URGI · Enterprise Sessions
          </div>
          {conversations.slice(0, 4).map((s: any) => {
            const trustPct = s.trustPct ?? Math.round((s.trustScore ?? 0) * 100)
            let trustCol = 'var(--os-success)'
            if (trustPct < 50) trustCol = 'var(--os-danger)'
            else if (trustPct < 75) trustCol = 'var(--os-warning)'

            let tier = 'MED'
            if (s.tier) {
              tier = s.tier
            } else if (trustPct >= 75) {
              tier = 'HIGH'
            } else if (trustPct < 50) {
              tier = 'LOW'
            }

            let tierCol = 'var(--os-warning)'
            if (tier === 'HIGH') tierCol = 'var(--os-success)'
            else if (tier === 'LOW') tierCol = 'var(--os-danger)'

            return (
              <div key={s.id} style={{
                padding: '6px 10px', borderRadius: 5,
                background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.company ?? s.name ?? s.sessionType ?? s.id}
                    </div>
                    {s.sessionType && s.company && (
                      <div style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 1 }}>{s.sessionType}</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                    <span style={{
                      fontSize: 8, fontWeight: 700, padding: '1px 5px', borderRadius: 3,
                      background: tierCol + '18', border: `1px solid ${tierCol}33`, color: tierCol,
                      letterSpacing: '0.04em',
                    }}>
                      {tier}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: trustCol, fontVariantNumeric: 'tabular-nums' }}>
                      {trustPct}%
                    </span>
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

export const ChatWidget = withWidgetContext(Core)
