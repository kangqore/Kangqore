import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const sessions: any[] = Array.isArray(viewModel.externalSessions) ? viewModel.externalSessions : [];
    const clients = sessions.filter((s:any)=>!s.company?.toLowerCase().includes('partner'));
    return (
        <div>
            <h3>Customer Portal</h3>
            <div className="focus-card"><span className="count">{clients.length || sessions.length}</span><label>Active Customers</label></div>
            {(clients.length?clients:sessions).slice(0,4).map((s:any,i:number)=>(
                <div key={i} className="mission-item">
                    <span className="mission-goal">{s.company??s.name??`Customer ${i+1}`}</span>
                    <span className="mission-status">{(s.trustScore*100).toFixed(0)}%</span>
                </div>
            ))}
        </div>
    );
};
export const CustomerPortalWidget = withWidgetContext(Core);
