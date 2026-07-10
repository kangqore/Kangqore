import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
    const approvals: any[] = Array.isArray(viewModel.pendingApprovals) ? viewModel.pendingApprovals : [];
    const escalated = approvals.filter((a:any)=>a.level>=4);
    return (
        <div>
            <h3>Escalations</h3>
            {escalated.length===0?<p className="empty-state">No escalations</p>:escalated.map((a:any,i:number)=>(
                <div key={i} className="mission-item">
                    <span className="mission-goal" style={{color:'var(--os-danger)'}}>{a.description??a.actionType??'Escalation'}</span>
                    <button onClick={()=>onAction('escalate',{id:a.id})}>Escalate</button>
                </div>
            ))}
        </div>
    );
};
export const EscalationWidget = withWidgetContext(Core);
