import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const domains: any[] = Array.isArray(viewModel.ecosystemDomains) ? viewModel.ecosystemDomains : [];
    const totalCap = domains.reduce((s:number,d:any)=>s+(d.capabilities??0),0);
    return (
        <div>
            <h3>Public API</h3>
            <div className="focus-grid">
                <div className="focus-card"><span className="count">{totalCap}</span><label>Endpoints</label></div>
                <div className="focus-card"><span className="count">{domains.filter((d:any)=>d.ready).length}</span><label>Active</label></div>
            </div>
        </div>
    );
};
export const PublicApiWidget = withWidgetContext(Core);
