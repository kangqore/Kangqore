import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const phases: any[] = Array.isArray(viewModel.phases) ? viewModel.phases : [];
    const pass = phases.filter((p:any)=>p.status==='PASS').length;
    return (
        <div>
            <h3>Event Bus</h3>
            <div className="focus-grid">
                <div className="focus-card"><span className="count" style={{color:'var(--os-success)'}}>{pass}</span><label>Active Streams</label></div>
                <div className="focus-card"><span className="count">{phases.length-pass}</span><label>Idle</label></div>
            </div>
        </div>
    );
};
export const EventBusWidget = withWidgetContext(Core);
