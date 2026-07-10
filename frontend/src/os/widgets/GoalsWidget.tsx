import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const GoalsWidgetCore: React.FC<WidgetProps> = ({ viewModel }) => {
    const goals: any[] = viewModel.goals ?? [];
    return (
        <div className="goals-widget">
            <h3>Goals</h3>
            {goals.length === 0 ? (
                <p className="empty-state">No goals defined</p>
            ) : (
                <ul className="goal-list">
                    {goals.map((g: any, i: number) => (
                        <li key={i} className={`goal-item status-${(g.status ?? 'active').toLowerCase()}`}>
                            <span className="goal-kpi">{g.kpi ?? g.name ?? 'Goal'}</span>
                            <div className="goal-progress">
                                <div
                                    className="progress-bar"
                                    style={{ width: `${Math.min(100, g.progress ?? 0)}%` }}
                                />
                            </div>
                            <span className="goal-pct">{(g.progress ?? 0).toFixed(0)}%</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export const GoalsWidget = withWidgetContext(GoalsWidgetCore);
