// Evidence Widget
// Core Enterprise Widget

import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const EvidenceWidgetCore: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
    const evidenceItems = viewModel.evidence || [];

    return (
        <div className="evidence-widget">
            <h3>Underlying Evidence</h3>
            <ul className="evidence-list">
                {evidenceItems.map((evidence: any) => (
                    <li key={evidence.id} className="evidence-item">
                        <span className="evidence-source badge">{evidence.sourceSystem}</span>
                        <p className="evidence-claim">{evidence.claim}</p>
                        <div className="evidence-confidence">
                            Confidence: {evidence.confidenceScore}%
                        </div>
                        <button onClick={() => onAction('VIEW_EVIDENCE_SOURCE', { evidenceId: evidence.id })}>
                            Inspect Source
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export const EvidenceWidget = withWidgetContext(EvidenceWidgetCore);
