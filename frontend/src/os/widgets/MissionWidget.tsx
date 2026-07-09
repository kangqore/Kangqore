// Mission Widget
// Core Enterprise Widget

import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const MissionWidgetCore: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
    // The widget expects the ViewModel to provide pre-formatted, lens-aware data.
    const missions = viewModel.missions || [];

    return (
        <div className="mission-widget">
            <h3>Active Missions</h3>
            <ul className="mission-list">
                {missions.map((mission: any) => (
                    <li key={mission.id} className="mission-item">
                        <span className="mission-title">{mission.title}</span>
                        <span className="mission-status badge">{mission.status}</span>
                        <div className="mission-actions">
                            {mission.availableActions.map((action: any) => (
                                <button 
                                    key={action.type}
                                    onClick={() => onAction(action.type, { missionId: mission.id })}
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export const MissionWidget = withWidgetContext(MissionWidgetCore);
