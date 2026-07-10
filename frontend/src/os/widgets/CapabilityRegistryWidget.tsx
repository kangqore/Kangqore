import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const caps: string[] = Array.isArray(viewModel.activeCapabilities) ? viewModel.activeCapabilities : [];
    const total: number = viewModel.domainCapabilities ?? caps.length;
    return (
        <div>
            <h3>Capability Registry</h3>
            <div className="focus-grid">
                <div className="focus-card"><span className="count">{total}</span><label>Total Capabilities</label></div>
                <div className="focus-card"><span className="count">{caps.length}</span><label>Active</label></div>
            </div>
        </div>
    );
};
export const CapabilityRegistryWidget = withWidgetContext(Core);
