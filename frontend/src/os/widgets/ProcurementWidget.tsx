import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
    const all: any[] = Array.isArray(viewModel.pendingExecutionApprovals) ? viewModel.pendingExecutionApprovals : [];
    const items = all.filter((a:any)=>(a.actionType??'').toLowerCase().includes('procur')||true).slice(0,4);
    return (
        <div>
            <h3>Procurement</h3>
            <div className="focus-card"><span className="count">{all.length}</span><label>Open Requests</label></div>
            {items.map((a:any,i:number)=>(
                <div key={i} className="mission-item">
                    <span className="mission-goal">{a.description ?? a.actionType ?? 'Request'}</span>
                    <button onClick={()=>onAction('approve',{id:a.id})}>Approve</button>
                </div>
            ))}
        </div>
    );
};
export const ProcurementWidget = withWidgetContext(Core);
