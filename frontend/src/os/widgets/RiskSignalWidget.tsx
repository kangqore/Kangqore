import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const exposure: any[] = Array.isArray(viewModel.domainRiskExposure) ? viewModel.domainRiskExposure : [];
    const signals = exposure.flatMap((d:any)=>d.breachedKpis.map((k:any)=>({domain:d.name,...k})));
    return (
        <div>
            <h3>Risk Signals</h3>
            {signals.length===0?<p className="empty-state">No risk signals</p>:signals.slice(0,4).map((s:any,i:number)=>(
                <div key={i} className="mission-item">
                    <span className="mission-goal">{s.domain} · {s.name??s.id}</span>
                    <span className="mission-status" style={{color:'var(--os-danger)'}}>{s.current}↑{s.target}</span>
                </div>
            ))}
        </div>
    );
};
export const RiskSignalWidget = withWidgetContext(Core);
