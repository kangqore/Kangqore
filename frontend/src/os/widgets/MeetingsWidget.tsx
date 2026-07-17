import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

function fmtMeetingTime(iso: string): string {
  try {
    const d = new Date(iso)
    const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    const date = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    return `${time} · ${date}`
  } catch { return iso }
}

const MEETING_TYPE_COL: Record<string, string> = {
  CLIENT_CALL:       'var(--os-blue)',
  INTERNAL:          'var(--os-text-4)',
  REVIEW:            'var(--os-warning)',
  DEMO:              'var(--os-success)',
  STRATEGY:          'var(--os-blue)',
  ONBOARDING:        'var(--os-success)',
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const meetings: any[] = Array.isArray(viewModel.upcomingMeetings) ? viewModel.upcomingMeetings
    : Array.isArray(viewModel.calendarEvents) ? viewModel.calendarEvents : []
  const meetingCount    = viewModel.meetingCount ?? meetings.length
  const projects: any[] = Array.isArray(viewModel.projects) ? viewModel.projects : []
  let atRisk = 0
  if (Array.isArray(viewModel.atRiskProjects)) {
    atRisk = viewModel.atRiskProjects.length
  } else {
    atRisk = projects.filter((p: any) => p.status === 'At Risk').length
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Upcoming', value: meetingCount,    warn: false      },
          { label: 'Projects', value: projects.length, warn: false      },
          { label: 'At Risk',  value: atRisk,          warn: atRisk > 0 },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1, color: warn ? 'var(--os-danger)' : 'var(--os-text-1)' }}>{value}</div>
            <span style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Meetings list */}
      {meetings.length === 0 ? (
        <div style={{ fontSize: 11, color: 'var(--os-text-4)', textAlign: 'center', padding: '12px 0' }}>
          No upcoming meetings
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Upcoming · {meetingCount} scheduled
          </div>
          {meetings.slice(0, 5).map((m: any) => {
            const typeCol = MEETING_TYPE_COL[m.type] ?? 'var(--os-text-4)'
            const timeStr = m.startsAt ? fmtMeetingTime(m.startsAt) : m.time ?? 'Scheduled'
            const linked  = m.linkedProject ?? null
            return (
              <div key={m.id} style={{
                padding: '6px 10px', borderRadius: 5,
                background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.title ?? m.company ?? m.name ?? 'Meeting'}
                    </div>
                    <div style={{ display: 'flex', gap: 5, marginTop: 2, alignItems: 'center' }}>
                      {m.type && (
                        <span style={{ fontSize: 8, fontWeight: 700, color: typeCol, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {m.type.replace(/_/g, ' ')}
                        </span>
                      )}
                      {linked && (
                        <span style={{ fontSize: 8, color: 'var(--os-blue)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          · {linked.clientName ?? linked.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <span style={{ fontSize: 9, color: 'var(--os-text-4)', flexShrink: 0, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    {timeStr}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export const MeetingsWidget = withWidgetContext(Core)
