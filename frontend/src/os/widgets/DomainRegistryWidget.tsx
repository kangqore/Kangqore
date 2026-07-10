import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const count: number = viewModel.registeredDomains ?? 0;
    const caps: number  = viewModel.domainCapabilities ?? 0;
    return (
        <div>
            <h3>Domain Registry</h3>
            <div className="focus-grid">
                <div className="focus-card"><span className="count">{count}</span><label>Domains</label></div>
                <div className="focus-card"><span className="count">{caps}</span><label>Capabilities</label></div>
            </div>
        </div>
    );
};
export const DomainRegistryWidget = withWidgetContext(Core);
