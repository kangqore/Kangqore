import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const domains: any[] = Array.isArray(viewModel.operationalDomains) ? viewModel.operationalDomains : [];
    const totalCap = domains.reduce((s:number,d:any)=>s+(d.capabilities??0),0);
    return (
        <div>
            <h3>Asset Manager</h3>
            <div className="focus-grid">
                <div className="focus-card"><span className="count">{domains.length}</span><label>Domains</label></div>
                <div className="focus-card"><span className="count">{totalCap}</span><label>Capabilities</label></div>
            </div>
            {domains.slice(0,4).map((d:any,i:number)=>(
                <div key={i} className="mission-item">
                    <span className="mission-goal">{d.name}</span>
                    <span className="mission-status">{d.ready?'✓':'–'}</span>
                </div>
            ))}
        </div>
    );
};
export const AssetManagerWidget = withWidgetContext(Core);
