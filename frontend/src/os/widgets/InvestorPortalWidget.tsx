import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const domains: any[] = Array.isArray(viewModel.ecosystemDomains) ? viewModel.ecosystemDomains : [];
    const conf: number = viewModel.confidence ?? 0;
    return (
        <div>
            <h3>Investor Portal</h3>
            <div className="focus-grid">
                <div className="focus-card"><span className="count">{domains.length}</span><label>Domains</label></div>
                <div className="focus-card"><span className="count">{(conf*100).toFixed(0)}%</span><label>Confidence</label></div>
            </div>
        </div>
    );
};
export const InvestorPortalWidget = withWidgetContext(Core);
