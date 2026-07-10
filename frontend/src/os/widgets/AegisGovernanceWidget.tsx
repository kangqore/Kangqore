import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const decisions: any[] = Array.isArray(viewModel.pendingDecisions) ? viewModel.pendingDecisions : [];
    const conf: number = viewModel.platformConfidence ?? 0;
    const l3plus = decisions.filter((d:any)=>d.level>=3);
    return (
        <div>
            <h3>AEGIS Governance</h3>
            <div className="focus-grid">
                <div className="focus-card"><span className="count">{l3plus.length}</span><label>L3+ Actions</label></div>
                <div className="focus-card"><span className="count">{(conf*100).toFixed(0)}%</span><label>Trust</label></div>
            </div>
        </div>
    );
};
export const AegisGovernanceWidget = withWidgetContext(Core);
