import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const domains: any[] = Array.isArray(viewModel.domainIntelligence) ? viewModel.domainIntelligence : [];
    const ready = domains.filter((d:any)=>d.ready).length;
    return (
        <div>
            <h3>Data Lineage</h3>
            <div className="focus-grid">
                <div className="focus-card"><span className="count">{domains.length}</span><label>Sources</label></div>
                <div className="focus-card"><span className="count">{ready}</span><label>Live</label></div>
            </div>
            {domains.slice(0,3).map((d:any,i:number)=>(
                <div key={i} className="mission-item">
                    <span className="mission-goal">{d.name}</span>
                    <span className="mission-status" style={{color:d.ready?'var(--os-success)':'var(--os-text-4)'}}>{d.ready?'LIVE':'IDLE'}</span>
                </div>
            ))}
        </div>
    );
};
export const DataLineageWidget = withWidgetContext(Core);
