import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const MissionCenterWidgetCore: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
    const missions: any[] = viewModel.activeMissions ?? [];
    return (
        <div className="mission-center-widget">
            <h3>Mission Center</h3>
            <div className="mission-count">
                <span className="count">{missions.length}</span>
                <label>Active Missions</label>
            </div>
            {missions.slice(0, 4).map((m: any, i: number) => (
                <div key={i} className="mission-row">
                    <span className="mission-title">{m.goal ?? m.title ?? 'Mission'}</span>
                    <span className={`mission-priority priority-${(m.priority ?? 'normal').toLowerCase()}`}>
                        {m.priority ?? 'NORMAL'}
                    </span>
                </div>
            ))}
            <button className="launch-mission-btn" onClick={() => onAction('launch_mission', {})}>
                Launch Mission
            </button>
        </div>
    );
};

export const MissionCenterWidget = withWidgetContext(MissionCenterWidgetCore);
