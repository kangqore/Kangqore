import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const domains: any[] = Array.isArray(viewModel.domainIntelligence) ? viewModel.domainIntelligence : [];
    return (
        <div>
            <h3>Knowledge Graph</h3>
            <div className="focus-card"><span className="count">{domains.length}</span><label>Domain Nodes</label></div>
            {domains.slice(0,4).map((d:any,i:number)=>(
                <div key={i} className="mission-item">
                    <span className="mission-goal">{d.name}</span>
                    <span className="mission-status">{(d.kpis??[]).length} KPIs</span>
                </div>
            ))}
        </div>
    );
};
export const KnowledgeGraphWidget = withWidgetContext(Core);
