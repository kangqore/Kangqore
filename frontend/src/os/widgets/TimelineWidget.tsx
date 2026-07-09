// Timeline Widget
// Core Enterprise Widget

import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const TimelineWidgetCore: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
    const events = viewModel.timelineEvents || [];

    return (
        <div className="timeline-widget">
            <h3>Enterprise Timeline</h3>
            <div className="timeline-container">
                {events.map((event: any) => (
                    <div key={event.id} className={`timeline-entry type-${event.type.toLowerCase()}`}>
                        <div className="timeline-time">{event.formattedTime}</div>
                        <div className="timeline-body">
                            <span className="timeline-actor">{event.actorName}</span>
                            <span className="timeline-action">{event.description}</span>
                        </div>
                        {event.requiresReview && (
                            <button onClick={() => onAction('REVIEW_EVENT', { eventId: event.id })}>
                                Review
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export const TimelineWidget = withWidgetContext(TimelineWidgetCore);
