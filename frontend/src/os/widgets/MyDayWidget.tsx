// MyDay Widget
// Focus Domain

import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const MyDayWidgetCore: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
    const focusItems = viewModel.focusItems || { critical: 0, scheduled: 0, waiting: 0, blocked: 0 };

    return (
        <div className="myday-widget">
            <h3>Today's Focus</h3>
            <div className="focus-grid">
                <div className="focus-card critical">
                    <span className="count">{focusItems.critical}</span>
                    <label>Critical</label>
                </div>
                <div className="focus-card scheduled">
                    <span className="count">{focusItems.scheduled}</span>
                    <label>Scheduled</label>
                </div>
                <div className="focus-card waiting">
                    <span className="count">{focusItems.waiting}</span>
                    <label>Waiting On Others</label>
                </div>
                <div className="focus-card blocked">
                    <span className="count">{focusItems.blocked}</span>
                    <label>Blocked</label>
                </div>
            </div>
        </div>
    );
};

export const MyDayWidget = withWidgetContext(MyDayWidgetCore);
