import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const sessions: any[]    = Array.isArray(viewModel.liveSessions) ? viewModel.liveSessions : []
  const totalAccounts      = viewModel.totalAccounts        ?? sessions.length
  const avgTrust: number   = viewModel.avgTrustScore        ?? 0
  const atRisk: number     = viewModel.atRiskSessions       ?? 0
  const newLeads: number   = viewModel.newLeadsCount        ?? 0
  const inProgress: number = viewModel.inProgressLeadsCount ?? 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
        {[
          { label: 'Visitors',    value: totalAccounts,                       accent: false },
          { label: 'New Leads',   value: newLeads,                            accent: newLeads > 0 },
          { label: 'In Progress', value: inProgress,                          accent: false },
          { label: 'Avg Trust',   value: `${Math.round(avgTrust * 100)}%`,   accent: false, warn: atRisk > 0 },
        ].map(({ label, value, accent, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: accent ? 'var(--os-success-dim)' : warn ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
            border: accent ? '1px solid var(--os-success)44' : warn ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{
              fontSize: 17, fontWeight: 700, lineHeight: 1,
              color: accent ? 'var(--os-success)' : warn ? 'var(--os-danger)' : 'var(--os-text-1)',
            }}>{value}</div>
            <div style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {sessions.length === 0 ? (
        <p style={{ color: 'var(--os-text-4)', fontSize: 12, margin: 0 }}>No live sessions</p>
      ) : (
        sessions.slice(0, 5).map((s: any) => {
          const trust = Math.round((s.trustScore ?? 0) * 100)
          const col = trust >= 80 ? 'var(--os-success)' : trust >= 50 ? 'var(--os-warning)' : 'var(--os-danger)'
          return (
            <div key={s.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              padding: '6px 10px', borderRadius: 6,
              background: 'var(--os-surface-3)',
              border: '1px solid var(--os-border-subtle)',
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
        })
      )}
    </div>
  )
}

export const AccountsWidget = withWidgetContext(Core)
