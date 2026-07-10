import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const sessions: any[] = Array.isArray(viewModel.liveSessions) ? viewModel.liveSessions : [];
    return (
        <div>
            <h3>Chat</h3>
            {sessions.length===0?<p className="empty-state">No active conversations</p>:sessions.slice(0,4).map((s:any,i:number)=>(
                <div key={i} className="mission-item">
                    <span className="mission-goal">{s.company??s.name??`Session ${i+1}`}</span>
                    <span className="mission-status">{(s.trustScore*100).toFixed(0)}%</span>
                </div>
            ))}
        </div>
    );
};
export const ChatWidget = withWidgetContext(Core);
