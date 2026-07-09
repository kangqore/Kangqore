// Universal Timeline
// Generation III Runtime

import React from 'react';

interface TimelineEvent {
    id: string;
    timestamp: string;
    category: 'ACTIVITY' | 'EVIDENCE' | 'PREDICTION' | 'APPROVAL' | 'EXECUTION';
    actor: string;
    description: string;
}

interface UniversalTimelineProps {
    events: TimelineEvent[];
}

/**
 * A reusable primitive attached to every Object, Mission, and Decision.
 */
export const UniversalTimeline: React.FC<UniversalTimelineProps> = ({ events }) => {
    return (
        <div className="universal-timeline">
            <h3>Timeline</h3>
            <ul className="timeline-list">
                {events.map(event => (
                    <li key={event.id} className={`timeline-item category-${event.category.toLowerCase()}`}>
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                            <span className="timeline-timestamp">{new Date(event.timestamp).toLocaleString()}</span>
                            <span className="timeline-actor">{event.actor}</span>
                            <p className="timeline-desc">{event.description}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
