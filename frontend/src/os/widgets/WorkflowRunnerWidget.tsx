import React, { useCallback } from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const TRIGGER_ICON: Record<string, string> = {
  MANUAL:   '▶',
  GOAL:     '◎',
  SIGNAL:   '⚡',
  SCHEDULE: '⏱',
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const workflows: any[] = Array.isArray(viewModel.workflows) ? viewModel.workflows : []

  const openWorkflows = useCallback(() => {
    window.location.href = '/kangqore-view/admin/workflows'
  }, [])

  // Each workflow has .runs: [{ status, startedAt, ... }] embedded from the API
  function lastRunStatus(wf: any): string | null {
    return wf.runs?.[0]?.status ?? null
  }

  const statusColor: Record<string, string> = {
    COMPLETED: '#22c55e',
    RUNNING:   '#3b82f6',
    PENDING:   '#f59e0b',
    FAILED:    '#ef4444',
    PAUSED:    '#8b5cf6',
  }

  if (workflows.length === 0) {
    const synthesis: string | null = (viewModel.kimmSynthesis as string) ?? null
    return (
      <div>
        <h3>Workflow Runner</h3>
        {synthesis
          ? <p className="empty-state" style={{ color: 'var(--os-cyan)', fontSize: 11 }}>{synthesis}</p>
          : <p className="empty-state">No active workflows — build one on the Intelligence Canvas</p>
        }
      </div>
    )
  }

  return (
    <div>
      <h3>Workflow Runner</h3>
      {workflows.slice(0, 6).map((wf: any, i: number) => {
        const lastStatus = lastRunStatus(wf)
        return (
          <div key={wf.id ?? i} className="mission-item" style={{ alignItems: 'flex-start', gap: '8px' }}>
            <span style={{
              fontSize: '13px', color: 'var(--text-secondary,#94a3b8)',
              minWidth: '16px', paddingTop: '1px',
            }}>
              {TRIGGER_ICON[wf.trigger] ?? '▶'}
            </span>
            <span className="mission-goal" style={{ flex: 1, lineHeight: '1.3' }}>
              {wf.name}
              {wf.description && (
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary,#94a3b8)', marginTop: '1px' }}>
                  {wf.description.slice(0, 60)}{wf.description.length > 60 ? '…' : ''}
                </span>
              )}
            </span>
            {lastStatus ? (
              <span style={{
                fontSize: '10px', padding: '1px 5px', borderRadius: '3px',
                background: `${statusColor[lastStatus] ?? '#6b7280'}22`,
                color: statusColor[lastStatus] ?? '#6b7280',
                fontWeight: 600, whiteSpace: 'nowrap', alignSelf: 'center',
              }}>
                {lastStatus}
              </span>
            ) : (
              <span style={{ fontSize: '10px', color: 'var(--text-secondary,#94a3b8)', alignSelf: 'center' }}>
                never run
              </span>
            )}
            {wf.trigger === 'MANUAL' && (
              <button
                className="mission-action"
                onClick={openWorkflows}
                style={{ alignSelf: 'center', padding: '2px 8px', fontSize: '11px' }}
              >
                Run
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

export const WorkflowRunnerWidget = withWidgetContext(Core)
