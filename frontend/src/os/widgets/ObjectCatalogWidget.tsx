import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const subsystems: Record<string,string> = (viewModel.subsystems as any) ?? {};
    const domains: number = viewModel.registeredDomains ?? 0;
    return (
        <div>
            <h3>Object Catalog</h3>
            <div className="focus-grid">
                <div className="focus-card"><span className="count">{domains}</span><label>Domain Objects</label></div>
                <div className="focus-card"><span className="count">{Object.keys(subsystems).length}</span><label>Subsystems</label></div>
            </div>
        </div>
    );
};
export const ObjectCatalogWidget = withWidgetContext(Core);
