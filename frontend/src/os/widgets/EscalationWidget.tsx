import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const Core: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
  const decisions: any[]  = Array.isArray(viewModel.allPendingDecisions) ? viewModel.allPendingDecisions : []
  const escalated         = decisions.filter((d: any) => (d.level ?? 0) >= 4)
  const critical24h       = viewModel.critical24h ?? 0
  const autonomy: any[]   = Array.isArray(viewModel.autonomyEvents) ? viewModel.autonomyEvents : []
  const autoCritical      = viewModel.autonomyCritical ?? autonomy.filter((e: any) => e.verdict === 'CRITICAL').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Escalations', value: escalated.length, warn: escalated.length > 0 },
          { label: 'Critical 24h',value: critical24h,      warn: critical24h > 0       },
          { label: 'Auto Flags',  value: autoCritical,     warn: autoCritical > 0      },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1, color: warn ? 'var(--os-danger)' : 'var(--os-text-1)' }}>{value}</div>
            <span style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {escalated.length === 0 && autoCritical === 0 ? (
        <div style={{
          padding: '6px 10px', borderRadius: 5, fontSize: 11,
          background: 'var(--os-success-dim, var(--os-surface-3))', border: '1px solid var(--os-success)44',
          color: 'var(--os-success)',
        }}>
          No active escalations
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Requires Action</div>
          {escalated.slice(0, 4).map((d: any) => (
            <div key={d.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              padding: '5px 10px', borderRadius: 5,
              background: 'var(--os-danger-dim)', border: '1px solid var(--os-danger)33',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: 'var(--os-danger)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {d.description ?? d.actionType ?? 'Escalation'}
                </div>
                <span style={{ fontSize: 10, color: 'var(--os-text-4)' }}>L{d.level}</span>
              </div>
              <button
                onClick={() => onAction('escalate', { id: d.id })}
                style={{
                  fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4, cursor: 'pointer',
                  background: 'var(--os-danger-dim)', border: '1px solid var(--os-danger)55',
                  color: 'var(--os-danger)', flexShrink: 0,
                }}
              >
                Escalate
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const EscalationWidget = withWidgetContext(Core)
