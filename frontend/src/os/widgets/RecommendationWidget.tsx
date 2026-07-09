// Recommendation Widget
// Intelligence Domain

import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const RecommendationWidgetCore: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
    const recommendations = viewModel.recommendations || [];

    return (
        <div className="recommendation-widget">
            <ul className="recommendation-list">
                {recommendations.map((rec: any) => (
                    <li key={rec.id} className="recommendation-card">
                        <span className="rec-confidence">{rec.confidence}%</span>
                        <div className="rec-body">
                            <p>{rec.description}</p>
                            <span className="rec-action">Suggested Action: {rec.suggestedAction}</span>
                        </div>
                        <button onClick={() => onAction('EXECUTE_RECOMMENDATION', { recId: rec.id })}>
                            Execute
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export const RecommendationWidget = withWidgetContext(RecommendationWidgetCore);
