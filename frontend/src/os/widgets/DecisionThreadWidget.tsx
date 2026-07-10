import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const approvals: any[] = Array.isArray(viewModel.pendingApprovals) ? viewModel.pendingApprovals : [];
    const synthesis: string|null = viewModel.kimmSynthesis ?? null;
    return (
        <div>
            <h3>Decision Threads</h3>
            {synthesis&&<p style={{fontSize:11,color:'var(--os-cyan)',marginBottom:8}}>{synthesis}</p>}
            {approvals.length===0?<p className="empty-state">No open threads</p>:approvals.slice(0,4).map((a:any,i:number)=>(
                <div key={i} className="mission-item">
                    <span className="mission-goal">{a.actionType??'Thread'}</span>
                    <span className="mission-status">L{a.level}</span>
                </div>
            ))}
        </div>
    );
};
export const DecisionThreadWidget = withWidgetContext(Core);
