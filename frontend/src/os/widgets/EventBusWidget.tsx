import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const runCol: Record<string, string> = {
  RUNNING:   'var(--os-blue)',
  COMPLETED: 'var(--os-success)',
  FAILED:    'var(--os-danger)',
  PENDING:   'var(--os-text-4)',
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const missionRuns: any[] = Array.isArray(viewModel.recentMissionRuns) ? viewModel.recentMissionRuns : []
  const phases: any[]      = Array.isArray(viewModel.phases)            ? viewModel.phases            : []
  const running: number    = viewModel.runningCount    ?? missionRuns.filter((r: any) => r.status === 'RUNNING').length
  const failed: number     = viewModel.failedCount     ?? missionRuns.filter((r: any) => r.status === 'FAILED').length
  const avgMs: number|null = viewModel.avgLatencyMs    ?? null
  const totalRuns: number  = viewModel.workflowRunCount ?? missionRuns.length
  const passPhases         = phases.filter((p: any) => p.status === 'PASS').length
  const avgLatencyDisplay  = avgMs !== null ? `${avgMs}ms` : '—'
  const avgLatencyWarn     = (avgMs ?? 0) > 5000

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Total Runs',  value: totalRuns,         col: 'var(--os-text-1)',  bg: 'var(--os-surface-3)',  border: '1px solid var(--os-border-subtle)' },
          { label: 'Running',     value: running,           col: 'var(--os-text-1)',  bg: 'var(--os-surface-3)',  border: '1px solid var(--os-border-subtle)' },
          { label: 'Failed',      value: failed,            col: failed > 0 ? 'var(--os-danger)' : 'var(--os-text-1)', bg: failed > 0 ? 'var(--os-danger-dim)' : 'var(--os-surface-3)', border: failed > 0 ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)' },
          { label: 'Avg Latency', value: avgLatencyDisplay, col: avgLatencyWarn ? 'var(--os-danger)' : 'var(--os-text-1)', bg: avgLatencyWarn ? 'var(--os-danger-dim)' : 'var(--os-surface-3)', border: avgLatencyWarn ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)' },
        ].map(({ label, value, col, bg, border }) => (
          <div key={label} style={{ flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center', background: bg, border }}>
            <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1, color: col, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {missionRuns.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Mission Executions (WAOE)</div>
          {missionRuns.slice(0, 4).map((r: any) => {
            const col = runCol[r.status] ?? 'var(--os-text-4)'
            return (
              <div key={r.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                padding: '5px 10px', borderRadius: 5,
                background: r.status === 'FAILED' ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
                border: r.status === 'FAILED' ? '1px solid var(--os-danger)33' : '1px solid var(--os-border-subtle)',
              }}>
                <span style={{ fontSize: 11, color: 'var(--os-text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.workflowName ?? r.name ?? 'Mission'}
                </span>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                  {r.latencyMs && (
                    <span style={{ fontSize: 10, color: 'var(--os-text-4)', fontVariantNumeric: 'tabular-nums' }}>{r.latencyMs}ms</span>
                  )}
                  <span style={{ fontSize: 9, fontWeight: 700, color: col }}>{r.status}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {phases.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Event Streams</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {phases.slice(0, 6).map((p: any) => {
              const col = p.status === 'PASS' ? 'var(--os-success)' : p.status === 'WARN' ? 'var(--os-warning)' : 'var(--os-danger)'
              return (
                <span key={p.name} style={{
                  fontSize: 10, padding: '2px 7px', borderRadius: 4,
                  background: 'var(--os-surface-3)', border: `1px solid ${col}33`, color: col,
                }}>
                  {p.name}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {missionRuns.length === 0 && phases.length === 0 && (
        <div style={{ fontSize: 11, color: 'var(--os-text-4)', textAlign: 'center', padding: '10px 0' }}>No mission runs recorded</div>
      )}
    </div>
  )
}

export const EventBusWidget = withWidgetContext(Core)
