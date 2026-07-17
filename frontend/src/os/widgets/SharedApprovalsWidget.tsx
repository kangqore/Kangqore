import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const Core: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
  const approvals: any[]   = Array.isArray(viewModel.allPendingDecisions) ? viewModel.allPendingDecisions : []
  const conversations: any[]= Array.isArray(viewModel.conversations)      ? viewModel.conversations      : []
  const openDecisions: any[]= Array.isArray(viewModel.openDecisions)      ? viewModel.openDecisions      : []
  const sessions: any[]    = Array.isArray(viewModel.liveSessions)        ? viewModel.liveSessions       : []
  const count              = viewModel.decisionCount ?? approvals.length
  const openCount          = viewModel.openDecisionCount ?? openDecisions.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Pending',       value: count,              warn: count > 0        },
          { label: 'Open Decisions',value: openCount,          warn: openCount > 0    },
          { label: 'Conversations', value: conversations.length,warn: false           },
          { label: 'Live Sessions', value: sessions.length,    warn: false            },
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

      {approvals.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pending Approvals</div>
          {approvals.slice(0, 3).map((a: any) => (
            <div key={a.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              padding: '5px 10px', borderRadius: 5,
              background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
            }}>
              <span style={{ fontSize: 11, color: 'var(--os-text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {a.description ?? a.actionType ?? 'Approval required'}
              </span>
              <button
                onClick={() => onAction('approve', { id: a.id })}
                style={{
                  fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4, cursor: 'pointer',
                  background: 'var(--os-success-dim, var(--os-surface-3))', border: '1px solid var(--os-success)55',
                  color: 'var(--os-success)', flexShrink: 0,
                }}
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      )}

      {openDecisions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>KIMMP Decision Threads</div>
          {openDecisions.slice(0, 2).map((d: any) => {
            const conf = Math.round((d.confidence ?? 0) * 100)
            return (
              <div key={d.id} style={{
                padding: '5px 10px', borderRadius: 5,
                background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6,
              }}>
                <span style={{ fontSize: 11, color: 'var(--os-text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {d.question ?? 'Open decision'}
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, color: conf >= 70 ? 'var(--os-success)' : 'var(--os-warning)', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                  {conf}%
                </span>
              </div>
            )
          })}
        </div>
      )}

      {conversations.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Active Conversations</div>
          {conversations.slice(0, 2).map((c: any) => (
            <div key={c.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              padding: '5px 10px', borderRadius: 5,
              background: 'var(--os-blue-dim)', border: '1px solid var(--os-blue)22',
            }}>
              <span style={{ fontSize: 11, color: 'var(--os-text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.company ?? c.contactName ?? c.id}
              </span>
              <span style={{ fontSize: 9, color: 'var(--os-text-4)', flexShrink: 0 }}>{c.status ?? 'ACTIVE'}</span>
            </div>
          ))}
        </div>
      )}

      {approvals.length === 0 && openDecisions.length === 0 && conversations.length === 0 && (
        <div style={{ fontSize: 11, color: 'var(--os-text-4)', textAlign: 'center', padding: '10px 0' }}>No pending approvals or decisions</div>
      )}
    </div>
  )
}

export const SharedApprovalsWidget = withWidgetContext(Core)
