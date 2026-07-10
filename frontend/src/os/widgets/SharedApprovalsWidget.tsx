import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
    const approvals: any[] = Array.isArray(viewModel.pendingApprovals) ? viewModel.pendingApprovals : [];
    return (
        <div>
            <h3>Shared Approvals</h3>
            <div className="focus-card"><span className="count">{approvals.length}</span><label>Pending</label></div>
            {approvals.slice(0,3).map((a:any,i:number)=>(
                <div key={i} className="mission-item">
                    <span className="mission-goal">{a.description??a.actionType??'Approval'}</span>
                    <button onClick={()=>onAction('approve',{id:a.id})}>Approve</button>
                </div>
            ))}
        </div>
    );
};
export const SharedApprovalsWidget = withWidgetContext(Core);
