import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const Core: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
  const approvals: any[] = Array.isArray(viewModel.pendingExecutionApprovals) ? viewModel.pendingExecutionApprovals : []
  const count: number    = viewModel.pendingApprovalCount ?? approvals.length
  const confidence       = viewModel.confidence != null ? Math.round((viewModel.confidence as number) * 100) : null
  const projectCount     = viewModel.projectCount ?? 0
  const atRisk           = viewModel.atRiskCount  ?? 0
  const synthesis        = typeof viewModel.kimmSynthesis === 'string' ? viewModel.kimmSynthesis : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Stat row */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Pending',    value: count,        warn: count > 0 },
          { label: 'Projects',   value: projectCount, warn: false     },
          { label: 'At Risk',    value: atRisk,       warn: atRisk > 0 },
          { label: 'Confidence', value: confidence != null ? `${confidence}%` : '—', warn: false },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{
              fontSize: 17, fontWeight: 700, lineHeight: 1,
              color: warn ? 'var(--os-danger)' : 'var(--os-text-1)',
            }}>{value}</div>
            <div style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Pending approvals */}
      {approvals.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Pending Actions
          </div>
          {approvals.slice(0, 3).map((a: any) => (
            <div key={a.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              padding: '6px 10px', borderRadius: 6,
              background: 'var(--os-surface-3)',
              border: '1px solid var(--os-danger)33',
            }}>
              <span style={{ fontSize: 12, color: 'var(--os-text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {a.description ?? a.actionType ?? 'Action'}
              </span>
              <button
                onClick={() => onAction('review', { id: a.id })}
                style={{
                  flexShrink: 0, fontSize: 10, padding: '2px 8px', borderRadius: 4, cursor: 'pointer',
                  background: 'var(--os-blue-dim)', color: 'var(--os-blue)',
                  border: '1px solid var(--os-blue)44',
                }}
              >
                Review
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* KIMMP synthesis when no pending actions */
        synthesis && (
          <div style={{
            padding: '8px 10px', borderRadius: 6, fontSize: 11,
            background: 'var(--os-blue-dim)',
            border: '1px solid var(--os-blue)33',
            color: 'var(--os-text-3)',
            lineHeight: 1.5,
          }}>
            <span style={{ color: 'var(--os-blue)', fontWeight: 600, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>
              KIMMP · Latest Synthesis
            </span>
            {synthesis.length > 180 ? synthesis.slice(0, 180) + '…' : synthesis}
          </div>
        )
      )}
    </div>
  )
}

export const OperationsCenterWidget = withWidgetContext(Core)
