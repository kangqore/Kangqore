import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const MyTasksWidgetCore: React.FC<WidgetProps> = ({ viewModel }) => {
    const tasks: any[] = viewModel.tasks ?? [];
    const overdue = tasks.filter((t: any) => t.overdue).length;
    const today   = tasks.filter((t: any) => !t.overdue && t.dueToday).length;
    const upcoming = tasks.filter((t: any) => !t.overdue && !t.dueToday).length;
    return (
        <div className="my-tasks-widget">
            <h3>My Tasks</h3>
            <div className="task-summary">
                <div className="task-bucket overdue">
                    <span className="count">{overdue}</span>
                    <label>Overdue</label>
                </div>
                <div className="task-bucket today">
                    <span className="count">{today}</span>
                    <label>Due Today</label>
                </div>
                <div className="task-bucket upcoming">
                    <span className="count">{upcoming}</span>
                    <label>Upcoming</label>
                </div>
            </div>
        </div>
    );
};

export const MyTasksWidget = withWidgetContext(MyTasksWidgetCore);
