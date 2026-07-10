import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const sessions: any[] = Array.isArray(viewModel.externalSessions) ? viewModel.externalSessions : [];
    return (
        <div>
            <h3>Vendor Portal</h3>
            <div className="focus-card"><span className="count">{sessions.length}</span><label>Vendor Sessions</label></div>
            {sessions.slice(0,3).map((s:any,i:number)=>(
                <div key={i} className="mission-item">
                    <span className="mission-goal">{s.company??s.name??`Vendor ${i+1}`}</span>
                    <span className="mission-status">{(s.trustScore*100).toFixed(0)}%</span>
                </div>
            ))}
        </div>
    );
};
export const VendorPortalWidget = withWidgetContext(Core);
