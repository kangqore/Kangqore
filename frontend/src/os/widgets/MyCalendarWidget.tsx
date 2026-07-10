import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const MyCalendarWidgetCore: React.FC<WidgetProps> = ({ viewModel }) => {
    const events: any[] = viewModel.calendarEvents ?? [];
    const next = events[0];
    return (
        <div className="my-calendar-widget">
            <h3>My Calendar</h3>
            {next ? (
                <div className="next-event">
                    <p className="event-label">Next</p>
                    <p className="event-title">{next.title ?? 'Meeting'}</p>
                    <p className="event-time">{next.time ?? next.startsAt ?? '--'}</p>
                </div>
            ) : (
                <p className="empty-state">No upcoming events</p>
            )}
            <p className="event-count">{events.length} event{events.length !== 1 ? 's' : ''} today</p>
        </div>
    );
};

export const MyCalendarWidget = withWidgetContext(MyCalendarWidgetCore);
