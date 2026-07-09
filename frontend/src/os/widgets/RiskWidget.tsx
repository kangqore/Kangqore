// Risk Widget
// Core Enterprise Widget

import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const RiskWidgetCore: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
    const risks = viewModel.risks || [];

    return (
        <div className="risk-widget">
            <h3>Risk Radar</h3>
            <div className="risk-grid">
                {risks.map((risk: any) => (
                    <div key={risk.id} className={`risk-card severity-${risk.severity.toLowerCase()}`}>
                        <h4>{risk.title}</h4>
                        <p>{risk.description}</p>
                        <div className="risk-metrics">
                            <span>Impact: {risk.impactScore}</span>
                            <span>Probability: {risk.probabilityScore}</span>
                        </div>
                        <button onClick={() => onAction('MITIGATE_RISK', { riskId: risk.id })}>
                            Explore Mitigations
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const RiskWidget = withWidgetContext(RiskWidgetCore);
