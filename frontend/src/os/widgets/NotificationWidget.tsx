// Notification Widget
// Communication Domain

import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const NotificationWidgetCore: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
    const notifications = viewModel.notifications || [];

    return (
        <div className="notification-widget">
            <ul className="notification-list">
                {notifications.map((notif: any) => (
                    <li key={notif.id} className={`notification-item category-${notif.category.toLowerCase()}`}>
                        <div className="notif-header">
                            <span className="notif-category badge">{notif.category}</span>
                            <span className="notif-time">{notif.timestamp}</span>
                        </div>
                        <p className="notif-message">{notif.message}</p>
                        <button onClick={() => onAction('ACKNOWLEDGE_NOTIFICATION', { notifId: notif.id })}>
                            Acknowledge
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export const NotificationWidget = withWidgetContext(NotificationWidgetCore);
