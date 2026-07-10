import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
    const decisions: any[] = Array.isArray(viewModel.pendingDecisions) ? viewModel.pendingDecisions : [];
    const count: number = viewModel.openDecisionCount ?? decisions.length;
    return (
        <div>
            <h3>Decision Ledger</h3>
            <div className="focus-card"><span className="count">{count}</span><label>Open Decisions</label></div>
            {decisions.slice(0,4).map((d:any,i:number)=>(
                <div key={i} className="mission-item">
                    <span className="mission-goal">{d.description??d.actionType??'Decision'}</span>
                    <button onClick={()=>onAction('decide',{id:d.id})}>Decide</button>
                </div>
            ))}
        </div>
    );
};
export const DecisionLedgerWidget = withWidgetContext(Core);
