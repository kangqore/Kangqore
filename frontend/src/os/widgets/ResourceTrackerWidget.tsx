import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const domains: any[] = Array.isArray(viewModel.operationalDomains) ? viewModel.operationalDomains : [];
    return (
        <div>
            <h3>Resource Tracker</h3>
            <div className="focus-grid">
                <div className="focus-card"><span className="count">{domains.length}</span><label>Domains</label></div>
                <div className="focus-card"><span className="count">{domains.filter((d:any)=>d.ready).length}</span><label>Ready</label></div>
            </div>
            {domains.slice(0,4).map((d:any,i:number)=>(
                <div key={i} className="mission-item">
                    <span className="mission-goal">{d.name}</span>
                    <span className={`mission-status`}>{d.capabilities ?? 0} cap</span>
                </div>
            ))}
        </div>
    );
};
export const ResourceTrackerWidget = withWidgetContext(Core);
