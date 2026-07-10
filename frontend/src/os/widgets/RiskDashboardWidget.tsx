import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const exposure: any[] = Array.isArray(viewModel.domainRiskExposure) ? viewModel.domainRiskExposure : [];
    const total: number = viewModel.totalBreachedKpis ?? 0;
    const atRisk = exposure.filter((d:any)=>d.breachedKpis?.length>0);
    return (
        <div>
            <h3>Risk Dashboard</h3>
            <div className="focus-grid">
                <div className="focus-card"><span className="count" style={{color:total>0?'var(--os-danger)':'var(--os-success)'}}>{total}</span><label>Breached KPIs</label></div>
                <div className="focus-card"><span className="count">{atRisk.length}</span><label>Domains at Risk</label></div>
            </div>
            {atRisk.slice(0,3).map((d:any,i:number)=>(
                <div key={i} className="mission-item">
                    <span className="mission-goal">{d.name}</span>
                    <span className="mission-status" style={{color:'var(--os-danger)'}}>{d.breachedKpis.length} KPIs</span>
                </div>
            ))}
        </div>
    );
};
export const RiskDashboardWidget = withWidgetContext(Core);
