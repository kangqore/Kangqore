import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const Core: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
  const approvals: any[] = Array.isArray(viewModel.pendingApprovals)
    ? viewModel.pendingApprovals
    : Array.isArray(viewModel.pendingDecisions) ? viewModel.pendingDecisions : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Pending Approvals
        </span>
        <span style={{
          fontSize: 18, fontWeight: 800, lineHeight: 1, fontVariantNumeric: 'tabular-nums',
          color: approvals.length > 0 ? 'var(--os-danger)' : 'var(--os-success)',
        }}>
          {approvals.length}
        </span>
      </div>

      {approvals.length === 0 ? (
        <div style={{
          padding: '8px 10px', borderRadius: 6, fontSize: 11,
          background: 'var(--os-success-dim)', border: '1px solid var(--os-success)44',
          color: 'var(--os-success)',
        }}>
          No pending approvals
        </div>
      ) : (
        approvals.slice(0, 4).map((a: any) => (
          <div key={a.id} style={{
            padding: '8px 10px', borderRadius: 6,
            background: 'var(--os-surface-3)',
            border: '1px solid var(--os-warning)33',
          }}>
            <div style={{
              fontSize: 9, fontWeight: 700, color: 'var(--os-warning)',
              textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3,
            }}>
              {a.actionType ?? 'DECISION'} · L{a.level ?? '?'}
            </div>
            <div style={{
              fontSize: 11, color: 'var(--os-text-2)', lineHeight: 1.4, marginBottom: 6,
              overflow: 'hidden', textOverflow: 'ellipsis',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            }}>
              {a.description ?? 'Approval required'}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => onAction('approve', { id: a.id })}
                style={{
                  flex: 1, fontSize: 10, fontWeight: 600, padding: '4px 0', borderRadius: 5,
                  background: 'var(--os-success-dim)', color: 'var(--os-success)',
                  border: '1px solid var(--os-success)44', cursor: 'pointer',
                }}
              >
                Approve
              </button>
              <button
                onClick={() => onAction('reject', { id: a.id })}
                style={{
                  flex: 1, fontSize: 10, fontWeight: 600, padding: '4px 0', borderRadius: 5,
                  background: 'var(--os-danger-dim)', color: 'var(--os-danger)',
                  border: '1px solid var(--os-danger)44', cursor: 'pointer',
                }}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}

      {approvals.length > 4 && (
        <div style={{ fontSize: 10, color: 'var(--os-text-4)', textAlign: 'center' }}>
          +{approvals.length - 4} more in queue
        </div>
      )}
    </div>
  )
}

export const MyApprovalsWidget = withWidgetContext(Core)
