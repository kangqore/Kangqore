import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

function fmtLatency(ms: number | null): string {
  if (ms === null) return '—'
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function fmtAge(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime()
    const h = Math.floor(diff / 3_600_000)
    if (h < 1) return `${Math.floor(diff / 60_000)}m ago`
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  } catch { return '' }
}

const RUN_STATUS_COL: Record<string, string> = {
  COMPLETED:  'var(--os-success)',
  RUNNING:    'var(--os-blue)',
  FAILED:     'var(--os-danger)',
  CANCELLED:  'var(--os-text-4)',
  PENDING:    'var(--os-warning)',
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const status: string      = viewModel.bootStatus ?? 'UNKNOWN'
  const phases: any[]       = Array.isArray(viewModel.phases) ? viewModel.phases : []
  const health: any         = viewModel.platformHealth ?? {}
  const healthPct           = health.healthPercent ?? 0
  const nominal             = health.nominal ?? phases.filter((p: any) => p.status === 'PASS').length
  const total               = health.total   ?? phases.length
  const missionRuns: any[]  = Array.isArray(viewModel.recentMissionRuns) ? viewModel.recentMissionRuns : []
  const runningCount: number = viewModel.runningCount ?? 0
  const failedCount: number  = viewModel.failedCount  ?? 0
  const avgLatencyMs: number | null = viewModel.avgLatencyMs ?? null
  const workflowCount: number = viewModel.workflowCount ?? 0

  const statusOk = status === 'OPERATIONAL'
  let healthCol = 'var(--os-success)'
  if (healthPct < 50) healthCol = 'var(--os-danger)'
  else if (healthPct < 80) healthCol = 'var(--os-warning)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* MissionDispatcher stats */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'KEOS',       value: status,                 col: statusOk ? 'var(--os-success)' : 'var(--os-warning)' },
          { label: 'Health',     value: `${healthPct}%`,        col: healthCol                                              },
          { label: 'Phases OK',  value: `${nominal}/${total}`,  col: nominal === total ? 'var(--os-success)' : 'var(--os-warning)' },
          { label: 'Missions',   value: workflowCount,          col: 'var(--os-text-1)'                                    },
        ].map(({ label, value, col }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, lineHeight: 1, color: col, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* KEOS pipeline health bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--os-text-4)', marginBottom: 4 }}>
          <span>KEOS Pipeline · MissionDispatcher</span>
          <span style={{ fontVariantNumeric: 'tabular-nums', color: healthCol }}>{healthPct}%</span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: 'var(--os-border)' }}>
          <div style={{ width: `${healthPct}%`, height: '100%', borderRadius: 2, background: healthCol, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* Pipeline summary: running / failed / avg latency */}
      {(runningCount > 0 || failedCount > 0 || avgLatencyMs !== null) && (
        <div style={{ display: 'flex', gap: 5 }}>
          {runningCount > 0 && (
            <div style={{
              flex: 1, padding: '5px 8px', borderRadius: 5, textAlign: 'center',
              background: 'var(--os-blue-dim)', border: '1px solid var(--os-blue)33',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-blue)', fontVariantNumeric: 'tabular-nums' }}>{runningCount}</div>
              <span style={{ fontSize: 8, color: 'var(--os-text-4)' }}>Running</span>
            </div>
          )}
          {failedCount > 0 && (
            <div style={{
              flex: 1, padding: '5px 8px', borderRadius: 5, textAlign: 'center',
              background: 'var(--os-danger-dim)', border: '1px solid var(--os-danger)33',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-danger)', fontVariantNumeric: 'tabular-nums' }}>{failedCount}</div>
              <span style={{ fontSize: 8, color: 'var(--os-text-4)' }}>Failed</span>
            </div>
          )}
          {avgLatencyMs !== null && (
            <div style={{
              flex: 1, padding: '5px 8px', borderRadius: 5, textAlign: 'center',
              background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>
                {fmtLatency(avgLatencyMs)}
              </div>
              <span style={{ fontSize: 8, color: 'var(--os-text-4)' }}>Avg Latency</span>
            </div>
          )}
        </div>
      )}

      {/* Recent mission executions */}
      {missionRuns.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Recent Executions
          </div>
          {missionRuns.slice(0, 4).map((r: any) => {
            const stCol = RUN_STATUS_COL[r.status] ?? 'var(--os-text-4)'
            return (
              <div key={r.id} style={{
                padding: '5px 10px', borderRadius: 5,
                background: r.status === 'FAILED' ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
                border: r.status === 'FAILED' ? '1px solid var(--os-danger)33' : '1px solid var(--os-border-subtle)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--os-text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.workflowName}
                  </span>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                    {r.latencyMs !== null && (
                      <span style={{ fontSize: 9, color: 'var(--os-text-4)', fontVariantNumeric: 'tabular-nums' }}>
                        {fmtLatency(r.latencyMs)}
                      </span>
                    )}
                    <span style={{ fontSize: 9, fontWeight: 700, color: stCol, textTransform: 'uppercase' }}>
                      {r.status}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: 8, color: 'var(--os-text-4)', marginTop: 1 }}>
                  {fmtAge(r.startedAt)} · {r.triggeredBy}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Degraded phases */}
      {phases.filter((p: any) => p.status !== 'PASS').length > 0 && missionRuns.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Degraded Phases
          </div>
          {phases.filter((p: any) => p.status !== 'PASS').slice(0, 3).map((p: any) => (
            <div key={p.name} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              padding: '5px 10px', borderRadius: 5,
              background: p.status === 'ERROR' ? 'var(--os-danger-dim)' : 'var(--os-warning-dim, var(--os-surface-3))',
              border: p.status === 'ERROR' ? '1px solid var(--os-danger)33' : '1px solid var(--os-warning)33',
            }}>
              <span style={{ fontSize: 11, color: 'var(--os-text-2)', flex: 1 }}>{p.name}</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: p.status === 'ERROR' ? 'var(--os-danger)' : 'var(--os-warning)', flexShrink: 0 }}>
                {p.status}{p.duration ? ` ${p.duration}ms` : ''}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const KoreRuntimeWidget = withWidgetContext(Core)
