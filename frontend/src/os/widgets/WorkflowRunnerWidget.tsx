import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const domains: any[] = Array.isArray(viewModel.operationalDomains) ? viewModel.operationalDomains : [];
    const synthesis: string | null = viewModel.kimmSynthesis ?? null;
    const active = domains.filter((d: any) => d.ready);
    return (
        <div>
            <h3>Workflow Runner</h3>
            <div className="focus-grid">
                <div className="focus-card"><span className="count">{active.length}</span><label>Active</label></div>
                <div className="focus-card"><span className="count">{domains.length - active.length}</span><label>Idle</label></div>
            </div>
            {domains.slice(0, 3).map((d: any, i: number) => (
                <div key={d.id ?? i} className="mission-item">
                    <span className="mission-goal">{d.name}</span>
                    <span className="mission-status">{d.ready ? 'Active' : 'Idle'}</span>
                </div>
            ))}
            {synthesis && (
                <p style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 8, lineHeight: 1.5 }}>
                    {synthesis.length > 120 ? synthesis.slice(0, 120) + '…' : synthesis}
                </p>
            )}
            <a
                href="/kangqore-view/admin/workflows"
                style={{ display: 'block', marginTop: 10, fontSize: 11, color: '#2563eb', textDecoration: 'none', textAlign: 'center' }}
            >
                Open Workflow Builder →
            </a>
        </div>
    );
};
export const WorkflowRunnerWidget = withWidgetContext(Core);
