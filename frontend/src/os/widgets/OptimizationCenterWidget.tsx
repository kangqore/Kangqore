import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const OptimizationCenterWidgetCore: React.FC<WidgetProps> = ({ viewModel }) => {
    const breachedKpis: number = viewModel.totalBreachedKpis ?? 0;
    const confidence: number  = viewModel.platformConfidence ?? viewModel.confidence ?? 0;
    const domains: any[]      = viewModel.domainRiskExposure ?? viewModel.operationalDomains ?? [];
    return (
        <div className="optimization-center-widget">
            <h3>Optimization Center</h3>
            <div className="optimization-summary">
                <div className="metric">
                    <span className="value">{breachedKpis}</span>
                    <label>Breached KPIs</label>
                </div>
                <div className="metric">
                    <span className="value">{(confidence * 100).toFixed(0)}%</span>
                    <label>Platform Confidence</label>
                </div>
            </div>
            {domains.slice(0, 3).map((d: any, i: number) => {
                const breached = d.breachedKpis?.length ?? 0;
                return breached > 0 ? (
                    <div key={i} className="domain-risk-row">
                        <span>{d.name}</span>
                        <span className="risk-count">{breached} KPI{breached !== 1 ? 's' : ''} at risk</span>
                    </div>
                ) : null;
            })}
        </div>
    );
};

export const OptimizationCenterWidget = withWidgetContext(OptimizationCenterWidgetCore);
