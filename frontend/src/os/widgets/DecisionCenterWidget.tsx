import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const LEVEL_COLOR: Record<number, string> = {
  1: 'var(--os-danger)',
  2: 'var(--os-warning)',
  3: 'var(--os-text-3)',
}

const Core: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
  const decisions: any[] = Array.isArray(viewModel.pendingDecisions) ? viewModel.pendingDecisions : []
  const count: number    = viewModel.decisionCount ?? decisions.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Count banner */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 12px', borderRadius: 6,
        background: count > 0 ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
        border: count > 0 ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)',
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Pending Decisions
        </span>
        <span style={{
          fontSize: 20, fontWeight: 800, lineHeight: 1,
          color: count > 0 ? 'var(--os-danger)' : 'var(--os-success)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {count}
        </span>
      </div>

      {decisions.length === 0 ? (
        <div style={{
          padding: '8px 12px', borderRadius: 6, fontSize: 11,
          background: 'var(--os-success-dim)', border: '1px solid var(--os-success)44',
          color: 'var(--os-success)',
        }}>
          All decisions resolved — no pending items
        </div>
      ) : (
        decisions.slice(0, 4).map((d: any) => {
          const col = LEVEL_COLOR[d.level as number] ?? 'var(--os-text-3)'
          return (
            <div key={d.id} style={{
              padding: '8px 10px', borderRadius: 6,
              background: 'var(--os-surface-3)',
              border: `1px solid ${col}44`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: col, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
                    {d.actionType ?? 'Decision'} · L{d.level ?? '?'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--os-text-2)', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {d.description ?? ''}
                  </div>
                </div>
                <button
                  onClick={() => onAction('review_decision', { id: d.id })}
                  style={{
                    flexShrink: 0, fontSize: 10, padding: '3px 8px', borderRadius: 4, cursor: 'pointer',
                    background: 'var(--os-blue-dim)', color: 'var(--os-blue)',
                    border: '1px solid var(--os-blue)44',
                  }}
                >
                  Review
                </button>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

export const DecisionCenterWidget = withWidgetContext(Core)
