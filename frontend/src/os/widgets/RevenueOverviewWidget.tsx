// Revenue Overview Widget
// Core Enterprise Widget — Revenue Workspace

import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const RevenueOverviewWidgetCore: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
    const metrics = viewModel.revenueMetrics || [];
    const target = viewModel.revenueTarget || { label: 'Annual Target', value: '—', attainment: 0 };

    return (
        <div className="revenue-overview-widget">
            <div className="revenue-header">
                <h3>Revenue Overview</h3>
                <span className={`attainment-badge attainment-${target.attainment >= 80 ? 'on-track' : 'at-risk'}`}>
                    {target.attainment}% Attainment
                </span>
            </div>
            <div className="revenue-target-bar">
                <div className="target-label">{target.label}</div>
                <div className="target-progress">
                    <div className="target-fill" style={{ width: `${Math.min(target.attainment, 100)}%` }} />
                </div>
                <div className="target-value">{target.value}</div>
            </div>
            <div className="revenue-kpi-grid">
                {metrics.map((metric: any) => (
                    <div key={metric.id} className="revenue-kpi-card">
                        <span className="revenue-kpi-label">{metric.label}</span>
                        <span className="revenue-kpi-value">{metric.formattedValue}</span>
                        <span className={`revenue-kpi-trend trend-${metric.trendDirection?.toLowerCase() || 'neutral'}`}>
                            {metric.trendIndicator} {metric.trendValue}
                        </span>
                        {metric.drilldownAvailable && (
                            <button onClick={() => onAction('DRILLDOWN_REVENUE_KPI', { metricId: metric.id })}>
                                Drill Down
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export const RevenueOverviewWidget = withWidgetContext(RevenueOverviewWidgetCore);
