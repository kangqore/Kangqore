import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const DecisionCenterWidgetCore: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
    const decisions: any[] = viewModel.pendingDecisions ?? viewModel.openDecisions ?? [];
    return (
        <div className="decision-center-widget">
            <h3>Decision Center</h3>
            <div className="decision-count">
                <span className="count">{decisions.length}</span>
                <label>Pending Decisions</label>
            </div>
            {decisions.slice(0, 3).map((d: any, i: number) => (
                <div key={i} className={`decision-card level-${d.level ?? 1}`}>
                    <p className="decision-type">{d.actionType ?? d.type ?? 'Decision'}</p>
                    <p className="decision-desc">{d.description ?? ''}</p>
                    <button onClick={() => onAction('review_decision', { id: d.id })}>Review</button>
                </div>
            ))}
        </div>
    );
};

export const DecisionCenterWidget = withWidgetContext(DecisionCenterWidgetCore);
