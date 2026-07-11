import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const evidence: any[] = Array.isArray(viewModel.evidenceLedger) ? viewModel.evidenceLedger : [];
    const domains: any[] = Array.isArray(viewModel.domainIntelligence) ? viewModel.domainIntelligence : [];
    return (
        <div>
            <h3>Enterprise Search</h3>
            <div className="focus-grid">
                <div className="focus-card"><span className="count">{domains.length}</span><label>Domains Indexed</label></div>
                <div className="focus-card"><span className="count">{evidence.length}</span><label>Evidence Records</label></div>
            </div>
        </div>
    );
};
export const EnterpriseSearchWidget = withWidgetContext(Core);
