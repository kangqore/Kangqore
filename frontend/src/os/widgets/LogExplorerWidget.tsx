import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const statusCol: Record<string, string> = {
  PASS:      'var(--os-success)',
  COMPLETED: 'var(--os-success)',
  WARN:      'var(--os-warning)',
  FAIL:      'var(--os-danger)',
  FAILED:    'var(--os-danger)',
  RUNNING:   'var(--os-blue)',
  PENDING:   'var(--os-text-4)',
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const missionRuns: any[] = Array.isArray(viewModel.recentMissionRuns) ? viewModel.recentMissionRuns : []
  const phases: any[]      = Array.isArray(viewModel.phases)            ? viewModel.phases            : []
  const running: number    = viewModel.runningCount ?? 0
  const failed: number     = viewModel.failedCount  ?? 0
  const avgMs: number|null = viewModel.avgLatencyMs ?? null

  const passCount = phases.filter((p: any) => p.status === 'PASS').length
  const warnCount = phases.filter((p: any) => p.status === 'WARN').length
  const failCount = phases.filter((p: any) => p.status === 'FAIL').length
  const avgDisplay = avgMs !== null ? `${avgMs}ms` : '—'
  const avgWarn    = (avgMs ?? 0) > 5000

  const statItems = missionRuns.length > 0 ? [
    { label: 'Executions',  value: missionRuns.length, warn: false       },
    { label: 'Running',     value: running,            warn: false       },
    { label: 'Failed',      value: failed,             warn: failed > 0  },
    { label: 'Avg Latency', value: avgDisplay,         warn: avgWarn     },
  ] : [
    { label: 'Pass',  value: passCount,    warn: false          },
    { label: 'Warn',  value: warnCount,    warn: warnCount > 0  },
    { label: 'Fail',  value: failCount,    warn: failCount > 0  },
    { label: 'Total', value: phases.length,warn: false          },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {statItems.map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1, color: warn ? 'var(--os-danger)' : 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {primaryLog.length === 0 ? (
        <div style={{ fontSize: 11, color: 'var(--os-text-4)', textAlign: 'center', padding: '10px 0' }}>No log entries</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {missionRuns.length > 0 ? 'Execution Log' : 'Phase Log'}
          </div>
          {missionRuns.length > 0
            ? missionRuns.slice(0, 5).map((r: any) => {
                const col = statusCol[r.status] ?? 'var(--os-text-4)'
                return (
                  <div key={r.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                    padding: '4px 10px', borderRadius: 5,
                    background: r.status === 'FAILED' || r.status === 'FAIL' ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
                    border: r.status === 'FAILED' || r.status === 'FAIL' ? '1px solid var(--os-danger)33' : '1px solid var(--os-border-subtle)',
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
              })
            : [...phases].sort((a, b) => {
                const order: Record<string, number> = { FAIL: 0, WARN: 1, PASS: 2 }
                return (order[a.status] ?? 3) - (order[b.status] ?? 3)
              }).slice(0, 5).map((p: any) => (
                <div key={p.name} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                  padding: '4px 10px', borderRadius: 5,
                  background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
                }}>
                  <span style={{ fontSize: 11, color: 'var(--os-text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: statusCol[p.status] ?? 'var(--os-text-4)', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                    {p.status}{p.duration ? ` ${p.duration}ms` : ''}
                  </span>
                </div>
              ))
          }
        </div>
      )}
    </div>
  )
}

export const LogExplorerWidget = withWidgetContext(Core)
