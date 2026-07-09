// Analytics Widget
// Core Enterprise Widget

import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const AnalyticsWidgetCore: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
    const kpis = viewModel.kpis || [];

    return (
        <div className="analytics-widget">
            <h3>Performance Metrics</h3>
            <div className="kpi-grid">
                {kpis.map((kpi: any) => (
                    <div key={kpi.id} className="kpi-card">
                        <span className="kpi-label">{kpi.label}</span>
                        <span className="kpi-value">{kpi.formattedValue}</span>
                        <span className={`kpi-trend trend-${kpi.trendDirection.toLowerCase()}`}>
                            {kpi.trendIndicator} {kpi.trendValue}
                        </span>
                        {kpi.drilldownAvailable && (
                            <button onClick={() => onAction('DRILLDOWN_KPI', { kpiId: kpi.id })}>
                                Analyze
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export const AnalyticsWidget = withWidgetContext(AnalyticsWidgetCore);
