import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const decisions: any[] = Array.isArray(viewModel.pendingDecisions) ? viewModel.pendingDecisions : [];
    return (
        <div>
            <h3>Audit Explorer</h3>
            <div className="focus-card"><span className="count">{decisions.length}</span><label>Audit Entries</label></div>
            {decisions.slice(0,4).map((d:any,i:number)=>(
                <div key={i} className="mission-item">
                    <span className="mission-goal">{d.actionType??'Entry'}</span>
                    <span className="mission-status">L{d.level}</span>
                </div>
            ))}
        </div>
    );
};
export const AuditExplorerWidget = withWidgetContext(Core);
