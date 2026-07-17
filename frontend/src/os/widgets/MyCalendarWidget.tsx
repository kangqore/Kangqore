import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

function fmtTime(raw: string | undefined): string {
  if (!raw) return '—'
  try {
    return new Date(raw).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  } catch { return raw }
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const events: any[] = Array.isArray(viewModel.calendarEvents) ? viewModel.calendarEvents : []
  const next = events[0] ?? null
  const rest = events.slice(1, 4)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Today
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--os-text-3)', fontVariantNumeric: 'tabular-nums' }}>
          {events.length} event{events.length !== 1 ? 's' : ''}
        </span>
      </div>

      {!next ? (
        <div style={{
          padding: '8px 10px', borderRadius: 6, fontSize: 11,
          background: 'var(--os-success-dim)', border: '1px solid var(--os-success)44',
          color: 'var(--os-success)',
        }}>
          Clear schedule — no events today
        </div>
      ) : (
        <>
          {/* Next event hero */}
          <div style={{
            padding: '10px 12px', borderRadius: 8,
            background: 'var(--os-blue-dim)', border: '1px solid var(--os-blue)33',
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-blue)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
              Next
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-text-1)', lineHeight: 1.3 }}>
              {next.title ?? 'Meeting'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--os-blue)', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
              {fmtTime(next.startsAt ?? next.time)}
              {next.duration && <span style={{ color: 'var(--os-text-4)', marginLeft: 4 }}>· {next.duration}m</span>}
            </div>
          </div>

          {/* Remaining events */}
          {rest.map((e: any) => (
            <div key={e.id ?? String(e.startsAt ?? e.time)} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '5px 10px', borderRadius: 6,
              background: 'var(--os-surface-3)',
              border: '1px solid var(--os-border-subtle)',
            }}>
              <span style={{ fontSize: 10, color: 'var(--os-text-4)', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                {fmtTime(e.startsAt ?? e.time)}
              </span>
              <span style={{ fontSize: 11, color: 'var(--os-text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {e.title ?? 'Event'}
              </span>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export const MyCalendarWidget = withWidgetContext(Core)
