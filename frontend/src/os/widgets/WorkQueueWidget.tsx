// WorkQueue Widget
// Focus Domain

import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const WorkQueueWidgetCore: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
    const queue = viewModel.queue || [];

    return (
        <div className="workqueue-widget">
            <h3>Work Queue</h3>
            <ul className="queue-list">
                {queue.map((item: any) => (
                    <li key={item.id} className="queue-item">
                        <div className="queue-path">
                            <span>{item.missionName}</span> &rarr; 
                            <span>{item.taskName}</span>
                        </div>
                        <button onClick={() => onAction('START_WORK', { taskId: item.id })}>
                            Execute Task
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export const WorkQueueWidget = withWidgetContext(WorkQueueWidgetCore);
