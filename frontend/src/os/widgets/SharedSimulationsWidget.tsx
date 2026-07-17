import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const runCol: Record<string, string> = {
  RUNNING:   'var(--os-blue)',
  COMPLETED: 'var(--os-success)',
  FAILED:    'var(--os-danger)',
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const sharedRuns: any[]  = Array.isArray(viewModel.sharedRuns)   ? viewModel.sharedRuns   : []
  const missionRooms: any[]= Array.isArray(viewModel.missionRooms) ? viewModel.missionRooms : []
  const activeMission      = viewModel.activeMissionCount ?? 0
  const running            = sharedRuns.filter((r: any) => r.status === 'RUNNING').length
  const failed             = sharedRuns.filter((r: any) => r.status === 'FAILED').length
  const completed          = sharedRuns.filter((r: any) => r.status === 'COMPLETED').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Shared Runs',   value: sharedRuns.length,  warn: false          },
          { label: 'Running',       value: running,            warn: false          },
          { label: 'Failed',        value: failed,             warn: failed > 0     },
          { label: 'Mission Rooms', value: missionRooms.length,warn: false          },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1, color: warn ? 'var(--os-danger)' : 'var(--os-text-1)' }}>{value}</div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {sharedRuns.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Shared Workflow Runs</div>
          {sharedRuns.slice(0, 3).map((r: any) => {
            const col = runCol[r.status] ?? 'var(--os-text-4)'
            return (
              <div key={r.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                padding: '5px 10px', borderRadius: 5,
                background: r.status === 'FAILED' ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
                border: r.status === 'FAILED' ? '1px solid var(--os-danger)33' : '1px solid var(--os-border-subtle)',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: 'var(--os-text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.workflowName ?? r.name ?? 'Workflow Run'}
                  </div>
                  {r.triggeredBy && (
                    <div style={{ fontSize: 10, color: 'var(--os-text-4)' }}>by {r.triggeredBy}</div>
                  )}
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, color: col, flexShrink: 0 }}>{r.status}</span>
              </div>
            )
          })}
        </div>
      )}

      {missionRooms.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Mission Rooms</div>
            {activeMission > 0 && (
              <span style={{ fontSize: 10, color: 'var(--os-blue)', fontVariantNumeric: 'tabular-nums' }}>{activeMission} active</span>
            )}
          </div>
          {missionRooms.slice(0, 2).map((m: any) => {
            const isActive = m.status === 'ACTIVE' || m.status === 'RUNNING'
            return (
              <div key={m.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                padding: '5px 10px', borderRadius: 5,
                background: isActive ? 'var(--os-blue-dim)' : 'var(--os-surface-3)',
                border: isActive ? '1px solid var(--os-blue)22' : '1px solid var(--os-border-subtle)',
              }}>
                <span style={{ fontSize: 11, color: 'var(--os-text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {m.name}
                </span>
                <span style={{ fontSize: 9, fontWeight: 700, color: isActive ? 'var(--os-blue)' : 'var(--os-text-4)', flexShrink: 0 }}>
                  {m.lastRunStatus ?? m.status ?? '—'}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {sharedRuns.length === 0 && missionRooms.length === 0 && (
        <div style={{ fontSize: 11, color: 'var(--os-text-4)', textAlign: 'center', padding: '10px 0' }}>No shared runs or mission rooms</div>
      )}
    </div>
  )
}

export const SharedSimulationsWidget = withWidgetContext(Core)
