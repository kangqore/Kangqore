import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const sessions: any[] = Array.isArray(viewModel.externalSessions) ? viewModel.externalSessions : [];
    const trust: number = viewModel.avgExternalTrust ?? 0;
    return (
        <div>
            <h3>Partner Hub</h3>
            <div className="focus-grid">
                <div className="focus-card"><span className="count">{sessions.length}</span><label>Partners</label></div>
                <div className="focus-card"><span className="count">{(trust*100>1?trust:trust*100).toFixed(0)}%</span><label>Avg Trust</label></div>
            </div>
            {sessions.slice(0,3).map((s:any,i:number)=>(
                <div key={i} className="mission-item">
                    <span className="mission-goal">{s.company??s.name??`Partner ${i+1}`}</span>
                    <span className="mission-status">{s.lastAction??'Active'}</span>
                </div>
            ))}
        </div>
    );
};
export const PartnerHubWidget = withWidgetContext(Core);
