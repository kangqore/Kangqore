import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const MyNotificationsWidgetCore: React.FC<WidgetProps> = ({ viewModel }) => {
    const notifications: any[] = viewModel.notifications ?? viewModel.systemBriefings ?? [];
    return (
        <div className="my-notifications-widget">
            <h3>My Notifications</h3>
            {notifications.length === 0 ? (
                <p className="empty-state">All caught up</p>
            ) : (
                <ul className="notification-list">
                    {notifications.slice(0, 6).map((n: any, i: number) => (
                        <li key={i} className={`notification-item ${n.alerts?.length ? 'has-alert' : ''}`}>
                            <span className="notification-text">{n.summary ?? n.message ?? 'Notification'}</span>
                        </li>
                    ))}
                </ul>
            )}
            {notifications.length > 6 && (
                <p className="overflow-count">+{notifications.length - 6} more</p>
            )}
        </div>
    );
};

export const MyNotificationsWidget = withWidgetContext(MyNotificationsWidgetCore);
