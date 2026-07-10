import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const MyMissionsWidgetCore: React.FC<WidgetProps> = ({ viewModel }) => {
    const missions: any[] = Array.isArray(viewModel.activeMissions) ? viewModel.activeMissions : [];
    return (
        <div className="my-missions-widget">
            <h3>My Missions</h3>
            {missions.length === 0 ? (
                <p className="empty-state">No active missions</p>
            ) : (
                <ul className="mission-list">
                    {missions.map((m: any, i: number) => (
                        <li key={i} className={`mission-item priority-${(m.priority ?? 'normal').toLowerCase()}`}>
                            <span className="mission-goal">{m.goal ?? m.title ?? 'Mission'}</span>
                            <span className="mission-status">{m.status ?? 'ACTIVE'}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export const MyMissionsWidget = withWidgetContext(MyMissionsWidgetCore);
