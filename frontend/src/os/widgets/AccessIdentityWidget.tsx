import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const conf: number = viewModel.platformConfidence ?? 0;
    const decisions: any[] = Array.isArray(viewModel.pendingDecisions) ? viewModel.pendingDecisions : [];
    return (
        <div>
            <h3>Access &amp; Identity</h3>
            <div className="focus-grid">
                <div className="focus-card"><span className="count" style={{color:'var(--os-success)'}}>{(conf*100).toFixed(0)}%</span><label>Trust Level</label></div>
                <div className="focus-card"><span className="count">{decisions.length}</span><label>Pending Access</label></div>
            </div>
        </div>
    );
};
export const AccessIdentityWidget = withWidgetContext(Core);
