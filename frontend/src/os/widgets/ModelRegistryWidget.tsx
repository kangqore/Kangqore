import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const caps: string[] = Array.isArray(viewModel.activeCapabilities) ? viewModel.activeCapabilities : [];
    return (
        <div>
            <h3>Model Registry</h3>
            <div className="focus-card"><span className="count">{caps.length}</span><label>Active Capabilities</label></div>
            {caps.slice(0,6).map((c:string,i:number)=>(
                <div key={i} className="mission-item">
                    <span className="mission-goal">{c}</span>
                    <span className="mission-status" style={{color:'var(--os-success)'}}>LIVE</span>
                </div>
            ))}
        </div>
    );
};
export const ModelRegistryWidget = withWidgetContext(Core);
