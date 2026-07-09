// Context Widget
// Navigation Domain (Enterprise Compass)

import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const ContextWidgetCore: React.FC<WidgetProps> = ({ viewModel }) => {
    const breadcrumbs = viewModel.breadcrumbs || [];

    return (
        <div className="context-widget">
            <div className="compass-path">
                <span className="compass-label">You are here:</span>
                {breadcrumbs.map((crumb: any, index: number) => (
                    <React.Fragment key={crumb.id}>
                        <span className="crumb-node">{crumb.label}</span>
                        {index < breadcrumbs.length - 1 && <span className="crumb-separator">&rarr;</span>}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export const ContextWidget = withWidgetContext(ContextWidgetCore);
