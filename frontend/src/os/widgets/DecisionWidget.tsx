// Decision Widget
// Core Enterprise Widget

import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const DecisionWidgetCore: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
    const decisions = viewModel.pendingDecisions || [];

    return (
        <div className="decision-widget">
            <h3>Decision Queue</h3>
            {decisions.length === 0 ? (
                <p>No pending decisions.</p>
            ) : (
                <div className="decision-queue">
                    {decisions.map((decision: any) => (
                        <div key={decision.id} className="decision-card">
                            <h4>{decision.prompt}</h4>
                            <p className="decision-context">{decision.contextSummary}</p>
                            <div className="decision-options">
                                {decision.options.map((option: any) => (
                                    <button 
                                        key={option.id}
                                        className={`btn-${option.intent.toLowerCase()}`}
                                        onClick={() => onAction('SUBMIT_DECISION', { 
                                            decisionId: decision.id, 
                                            selectedOptionId: option.id 
                                        })}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const DecisionWidget = withWidgetContext(DecisionWidgetCore);
