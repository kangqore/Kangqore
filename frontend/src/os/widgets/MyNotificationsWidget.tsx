import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const notifications: any[] = Array.isArray(viewModel.notifications)
    ? viewModel.notifications
    : Array.isArray(viewModel.systemBriefings) ? viewModel.systemBriefings : []

  const hasAlerts = notifications.some((n: any) => n.alerts?.length > 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Notifications
        </span>
        {notifications.length > 0 && (
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10,
            background: hasAlerts ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
            color: hasAlerts ? 'var(--os-danger)' : 'var(--os-text-3)',
            border: hasAlerts ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {notifications.length}
          </span>
        )}
      </div>

      {notifications.length === 0 ? (
        <div style={{
          padding: '8px 10px', borderRadius: 6, fontSize: 11,
          background: 'var(--os-success-dim)', border: '1px solid var(--os-success)44',
          color: 'var(--os-success)',
        }}>
          All caught up — no alerts
        </div>
      ) : (
        notifications.slice(0, 5).map((n: any, i: number) => {
          const alert = n.alerts?.length > 0
          return (
            <div key={n.id ?? i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 8,
              padding: '7px 10px', borderRadius: 6,
              background: 'var(--os-surface-3)',
              border: alert ? '1px solid var(--os-danger)33' : '1px solid var(--os-border-subtle)',
            }}>
              <div style={{
                width: 5, height: 5, borderRadius: '50%', flexShrink: 0, marginTop: 4,
                background: alert ? 'var(--os-danger)' : 'var(--os-text-4)',
              }} />
              <span style={{
                fontSize: 11, color: 'var(--os-text-2)', lineHeight: 1.4, flex: 1,
                overflow: 'hidden', textOverflow: 'ellipsis',
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              }}>
                {n.summary ?? n.message ?? 'Notification'}
              </span>
            </div>
          )
        })
      )}

      {notifications.length > 5 && (
        <div style={{ fontSize: 10, color: 'var(--os-text-4)', textAlign: 'center' }}>
          +{notifications.length - 5} more
        </div>
      )}
    </div>
  )
}

export const MyNotificationsWidget = withWidgetContext(Core)
