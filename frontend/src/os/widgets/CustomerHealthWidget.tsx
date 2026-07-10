import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const CustomerHealthWidgetCore: React.FC<WidgetProps> = ({ viewModel }) => {
    const sessions: any[] = viewModel.liveSessions ?? viewModel.externalSessions ?? [];
    const avgTrust: number = viewModel.avgExternalTrust ??
        (sessions.length > 0 ? sessions.reduce((s: number, e: any) => s + (e.trustScore ?? 0), 0) / sessions.length : 0);
    const atRisk = sessions.filter((s: any) => (s.trustScore ?? 100) < 50).length;
    return (
        <div className="customer-health-widget">
            <h3>Customer Health</h3>
            <div className="health-metrics">
                <div className="metric">
                    <span className="value">{(avgTrust * 100 > 1 ? avgTrust : avgTrust * 100).toFixed(0)}%</span>
                    <label>Avg Trust</label>
                </div>
                <div className="metric at-risk">
                    <span className="value">{atRisk}</span>
                    <label>At Risk</label>
                </div>
                <div className="metric">
                    <span className="value">{sessions.length}</span>
                    <label>Active</label>
                </div>
            </div>
        </div>
    );
};

export const CustomerHealthWidget = withWidgetContext(CustomerHealthWidgetCore);
