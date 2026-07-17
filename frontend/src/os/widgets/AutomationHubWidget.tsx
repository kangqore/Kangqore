import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const RUN_STATUS_COLOR: Record<string, string> = {
  COMPLETED:    '#22c55e',
  RUNNING:      '#3b82f6',
  PENDING:      '#f59e0b',
  FAILED:       '#ef4444',
  PAUSED:       '#8b5cf6',
  COMPENSATING: '#f97316',
}

const TRIGGER_LABEL: Record<string, string> = {
  MANUAL:   'Manual',
  GOAL:     'Goal',
  SIGNAL:   'Signal',
  SCHEDULE: 'Schedule',
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const m = Math.floor(ms / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const stats: any = viewModel.workflowStats ?? {}
  const recentRuns: any[] = Array.isArray(stats.recentRuns) ? stats.recentRuns : []
  const workflows: any[]  = Array.isArray(viewModel.workflows) ? viewModel.workflows : []
  const byTrigger: Record<string, number> = stats.byTrigger ?? {}
  const activeCount    = (stats.activeRuns ?? []).length
  const completedCount = stats.completedCount ?? 0
  const failedCount    = stats.failedCount ?? 0

  return (
    <div>
      <h3>Automation Hub</h3>

      <div className="focus-grid">
        <div className="focus-card">
          <span className="count">{stats.total ?? workflows.length}</span>
          <label>Workflows</label>
        </div>
        <div className="focus-card">
          <span className="count" style={{ color: activeCount > 0 ? '#3b82f6' : undefined }}>
            {activeCount}
          </span>
          <label>Active</label>
        </div>
        <div className="focus-card">
          <span className="count" style={{ color: '#22c55e' }}>{completedCount}</span>
          <label>Completed</label>
        </div>
        <div className="focus-card">
          <span className="count" style={{ color: failedCount > 0 ? '#ef4444' : undefined }}>
            {failedCount}
          </span>
          <label>Failed</label>
        </div>
      </div>

      {Object.keys(byTrigger).length > 0 && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '10px 0' }}>
          {Object.entries(byTrigger).map(([t, n]) => (
            <span key={t} style={{
              fontSize: '11px', padding: '2px 7px', borderRadius: '4px',
              background: 'var(--surface-raised,rgba(255,255,255,0.06))',
              color: 'var(--text-secondary,#94a3b8)',
            }}>
              {TRIGGER_LABEL[t] ?? t} · {n}
            </span>
          ))}
        </div>
      )}

      {recentRuns.length > 0 ? (
        <>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary,#94a3b8)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Recent Runs
          </div>
          {recentRuns.map((r: any, i: number) => {
            const wf = workflows.find(w => w.id === r.workflowId)
            return (
              <div key={r.id ?? i} className="mission-item">
                <span className="mission-goal" style={{ flex: 1 }}>
                  {r.workflow?.name ?? wf?.name ?? r.workflowId?.slice(-6) ?? '—'}
                </span>
                <span style={{
                  fontSize: '11px', padding: '1px 6px', borderRadius: '3px',
                  background: `${RUN_STATUS_COLOR[r.status] ?? '#6b7280'}22`,
                  color: RUN_STATUS_COLOR[r.status] ?? '#6b7280',
                  fontWeight: 600, marginRight: '6px',
                }}>
                  {r.status}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary,#94a3b8)' }}>
                  {timeAgo(r.startedAt)}
                </span>
              </div>
            )
          })}
        </>
      ) : (
        <p className="empty-state">No recent automation runs</p>
      )}
    </div>
  )
}

export const AutomationHubWidget = withWidgetContext(Core)
