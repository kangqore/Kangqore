import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const caps: string[] = Array.isArray(viewModel.activeCapabilities) ? viewModel.activeCapabilities : [];
    return (
        <div>
            <h3>Extensions</h3>
            <div className="focus-card"><span className="count">{caps.length}</span><label>Loaded Extensions</label></div>
            {caps.slice(0,5).map((c:string,i:number)=>(
                <div key={i} className="mission-item"><span className="mission-goal">{c}</span><span className="mission-status" style={{color:'var(--os-cyan)'}}>✓</span></div>
            ))}
        </div>
    );
};
export const ExtensionsWidget = withWidgetContext(Core);
