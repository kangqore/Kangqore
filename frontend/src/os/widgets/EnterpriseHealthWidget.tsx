import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const EnterpriseHealthWidgetCore: React.FC<WidgetProps> = ({ viewModel }) => {
    const health  = viewModel.platformHealth ?? {};
    const domains: any[] = viewModel.operationalDomains ?? viewModel.domains ?? [];
    const pct = health.healthPercent ?? viewModel.confidence ?? 0;
    return (
        <div className="enterprise-health-widget">
            <h3>Enterprise Health</h3>
            <div className="health-score">
                <span className="score">{typeof pct === 'number' ? pct.toFixed(0) : pct}%</span>
                <label>Platform Health</label>
            </div>
            <div className="health-domains">
                {domains.slice(0, 4).map((d: any, i: number) => (
                    <div key={i} className={`domain-pill ${d.ready ? 'ready' : 'degraded'}`}>
                        {d.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export const EnterpriseHealthWidget = withWidgetContext(EnterpriseHealthWidgetCore);
