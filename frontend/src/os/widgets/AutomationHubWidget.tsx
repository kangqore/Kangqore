import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const domains: any[] = Array.isArray(viewModel.operationalDomains) ? viewModel.operationalDomains : [];
    const automated = domains.filter((d:any)=>(d.capabilities??0)>0);
    return (
        <div>
            <h3>Automation Hub</h3>
            <div className="focus-grid">
                <div className="focus-card"><span className="count">{automated.length}</span><label>Automated</label></div>
                <div className="focus-card"><span className="count">{domains.length - automated.length}</span><label>Manual</label></div>
            </div>
            {automated.slice(0,3).map((d:any,i:number)=>(
                <div key={i} className="mission-item">
                    <span className="mission-goal">{d.name}</span>
                    <span className="mission-status">{d.capabilities} flows</span>
                </div>
            ))}
        </div>
    );
};
export const AutomationHubWidget = withWidgetContext(Core);
