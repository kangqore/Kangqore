import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const sessions: any[] = Array.isArray(viewModel.externalSessions) ? viewModel.externalSessions : [];
    const trust: number = viewModel.avgExternalTrust ?? 0;
    const trustPct = trust*100>1?trust:trust*100;
    return (
        <div>
            <h3>What-If Scenarios</h3>
            <div className="focus-grid">
                <div className="focus-card"><span className="count">{sessions.length}</span><label>Baseline Sessions</label></div>
                <div className="focus-card"><span className="count">+{Math.round(trustPct*0.15)}%</span><label>Trust Uplift</label></div>
            </div>
        </div>
    );
};
export const WhatIfWidget = withWidgetContext(Core);
