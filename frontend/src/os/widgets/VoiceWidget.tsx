import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const sessions: any[] = Array.isArray(viewModel.liveSessions) ? viewModel.liveSessions : [];
    const active = sessions.filter((s:any)=>(s.trustScore??0)>0.5);
    return (
        <div>
            <h3>Voice</h3>
            <div className="focus-grid">
                <div className="focus-card"><span className="count">{active.length}</span><label>Active Calls</label></div>
                <div className="focus-card"><span className="count">{sessions.length}</span><label>Sessions</label></div>
            </div>
        </div>
    );
};
export const VoiceWidget = withWidgetContext(Core);
