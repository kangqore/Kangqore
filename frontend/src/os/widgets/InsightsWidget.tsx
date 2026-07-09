// Insights Widget
// Intelligence Domain

import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const InsightsWidgetCore: React.FC<WidgetProps> = ({ viewModel }) => {
    const insights = viewModel.insights || [];

    return (
        <div className="insights-widget">
            <ul className="insights-list">
                {insights.map((insight: any) => (
                    <li key={insight.id} className={`insight-card severity-${insight.severity.toLowerCase()}`}>
                        <p>{insight.message}</p>
                        <span className="insight-source">Source: {insight.source}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export const InsightsWidget = withWidgetContext(InsightsWidgetCore);
