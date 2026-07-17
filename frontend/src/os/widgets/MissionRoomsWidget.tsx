import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

function fmtAge(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime()
    const h = Math.floor(diff / 3_600_000)
    if (h < 1) return `${Math.floor(diff / 60_000)}m ago`
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  } catch { return '' }
}

const STATUS_COL: Record<string, string> = {
  ACTIVE:    'var(--os-success)',
  RUNNING:   'var(--os-success)',
  IDLE:      'var(--os-text-4)',
  COMPLETED: 'var(--os-blue)',
  FAILED:    'var(--os-danger)',
  PAUSED:    'var(--os-warning)',
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const rooms: any[]         = Array.isArray(viewModel.missionRooms)   ? viewModel.missionRooms   : []
  const activeMissions: any[] = Array.isArray(viewModel.activeMissions) ? viewModel.activeMissions : []
  const openDecisionCount     = viewModel.openDecisionCount ?? viewModel.decisionCount ?? 0

  const activeMissionCount: number = viewModel.activeMissionCount
    ?? rooms.filter((r: any) => r.status === 'ACTIVE' || r.status === 'RUNNING').length

  // Show workflow-based rooms if available; fall back to briefing-derived missions
  let displayRooms: any[]
  if (rooms.length > 0) {
    displayRooms = rooms
  } else {
    displayRooms = activeMissions.map((m: any) => ({
      id:           m.id ?? m.goal ?? '',
      name:         m.goal ?? m.title ?? 'Mission',
      description:  null,
      status:       m.priority === 'CRITICAL' ? 'ACTIVE' : 'IDLE',
      stepCount:    0,
      trigger:      null,
      lastActivity: null,
      lastRunStatus: null,
    }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Active Rooms',   value: activeMissionCount,  warn: false                  },
          { label: 'Total Rooms',    value: displayRooms.length, warn: false                  },
          { label: 'Open Decisions', value: openDecisionCount,   warn: openDecisionCount > 0  },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-warning-dim, var(--os-surface-3))' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-warning)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1, color: warn ? 'var(--os-warning)' : 'var(--os-text-1)' }}>{value}</div>
            <span style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Mission rooms */}
      {displayRooms.length === 0 ? (
        <div style={{ fontSize: 11, color: 'var(--os-text-4)', textAlign: 'center', padding: '12px 0' }}>
          No active mission rooms
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            WAANDA · Mission Rooms
          </div>
          {displayRooms.slice(0, 5).map((r: any) => {
            const stCol = STATUS_COL[r.status] ?? 'var(--os-text-4)'
            const isLive = r.status === 'ACTIVE' || r.status === 'RUNNING'
            return (
              <div key={r.id} style={{
                padding: '6px 10px', borderRadius: 5,
                background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.name}
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 2, alignItems: 'center' }}>
                      {r.stepCount > 0 && (
                        <span style={{ fontSize: 8, color: 'var(--os-text-4)' }}>{r.stepCount} steps</span>
                      )}
                      {r.trigger && (
                        <span style={{ fontSize: 8, color: 'var(--os-text-4)' }}>{r.trigger}</span>
                      )}
                      {r.lastActivity && (
                        <span style={{ fontSize: 8, color: 'var(--os-text-4)' }}>{fmtAge(r.lastActivity)}</span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{
                        width: 6, height: 6, borderRadius: '50%', background: stCol,
                        boxShadow: isLive ? `0 0 4px ${stCol}` : 'none',
                      }} />
                      <span style={{ fontSize: 9, fontWeight: 700, color: stCol, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {r.status ?? 'IDLE'}
                      </span>
                    </div>
                    {r.lastRunStatus && r.lastRunStatus !== r.status && (
                      <span style={{ fontSize: 8, color: 'var(--os-text-4)' }}>last: {r.lastRunStatus}</span>
                    )}
                  </div>
                </div>
                {r.description && (
                  <div style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.description.slice(0, 65)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export const MissionRoomsWidget = withWidgetContext(Core)
