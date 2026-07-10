import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const total: number = viewModel.totalBreachedKpis ?? 0;
    const exposure: any[] = Array.isArray(viewModel.domainRiskExposure) ? viewModel.domainRiskExposure : [];
    const highRisk = exposure.filter((d:any)=>d.breachedKpis?.length>1);
    return (
        <div>
            <h3>Threat Monitor</h3>
            <div className="focus-grid">
                <div className="focus-card"><span className="count" style={{color:total>0?'var(--os-danger)':'var(--os-success)'}}>{total>0?'ALERTS':'CLEAR'}</span><label>Status</label></div>
                <div className="focus-card"><span className="count">{highRisk.length}</span><label>High Risk</label></div>
            </div>
        </div>
    );
};
export const ThreatMonitorWidget = withWidgetContext(Core);
