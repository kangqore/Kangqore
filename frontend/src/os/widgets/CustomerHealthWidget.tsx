import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const sessions: any[] = Array.isArray(viewModel.liveSessions) ? viewModel.liveSessions : []
  const avgTrust: number = viewModel.avgTrustScore ?? 0
  const atRiskCount: number = viewModel.atRiskSessions ?? sessions.filter((s: any) => (s.trustScore ?? 0) < 0.5).length
  const totalAccounts: number = viewModel.totalAccounts ?? sessions.length

  const avgPct = Math.round(avgTrust * 100)
  const avgColor = avgPct >= 80 ? 'var(--os-success)' : avgPct >= 50 ? 'var(--os-warning)' : 'var(--os-danger)'

  const atRiskSessions = sessions.filter((s: any) => (s.trustScore ?? 0) < 0.5)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Summary stats */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
        {[
          { label: 'Avg Health', value: `${avgPct}%`, warn: avgPct < 50, good: avgPct >= 80 },
          { label: 'At Risk',    value: atRiskCount,   warn: atRiskCount > 0, good: false },
          { label: 'Active',     value: totalAccounts, warn: false,           good: false },
        ].map(({ label, value, warn, good }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: good ? 'var(--os-success-dim)' : warn ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
            border: good ? '1px solid var(--os-success)44' : warn ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{
              fontSize: 17, fontWeight: 700, lineHeight: 1,
              color: good ? 'var(--os-success)' : warn ? 'var(--os-danger)' : 'var(--os-text-1)',
            }}>{value}</div>
            <div style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Avg trust bar */}
      <div style={{
        padding: '8px 10px', borderRadius: 6,
        background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 11, color: 'var(--os-text-3)' }}>Account Trust Score</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: avgColor }}>{avgPct}%</span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: 'var(--os-border)' }}>
          <div style={{ width: `${avgPct}%`, height: '100%', borderRadius: 2, background: avgColor, transition: 'width 0.5s ease' }} />
        </div>
      </div>

      {/* At-risk accounts */}
      {atRiskSessions.length > 0 ? (
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-danger)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 5 }}>
            At Risk ({atRiskSessions.length})
          </div>
          {atRiskSessions.slice(0, 4).map((s: any) => {
            const trust = Math.round((s.trustScore ?? 0) * 100)
            const col = trust >= 40 ? 'var(--os-warning)' : 'var(--os-danger)'
            return (
              <div key={s.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                padding: '6px 10px', borderRadius: 6, marginBottom: 4,
                background: 'var(--os-danger-dim)', border: '1px solid var(--os-danger)22',
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.company ?? s.name ?? 'Visitor'}
                  </div>
                  {s.name && s.company && (
                    <div style={{ fontSize: 10, color: 'var(--os-text-4)' }}>{s.name}</div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <div style={{ width: 40, height: 3, borderRadius: 2, background: 'var(--os-border)' }}>
                    <div style={{ width: `${trust}%`, height: '100%', borderRadius: 2, background: col }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: col }}>{trust}%</span>
                </div>
              </div>
            )
          })}
        </div>
      ) : sessions.length === 0 ? (
        <p style={{ color: 'var(--os-text-4)', fontSize: 12, margin: 0 }}>No active sessions</p>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 6, background: 'var(--os-success-dim)', border: '1px solid var(--os-success)33' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--os-success)', flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: 'var(--os-success)', fontWeight: 600 }}>All accounts healthy</span>
        </div>
      )}
    </div>
  )
}

export const CustomerHealthWidget = withWidgetContext(Core)
