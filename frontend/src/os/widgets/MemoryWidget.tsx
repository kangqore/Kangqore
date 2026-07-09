// Memory Widget
// Memory Domain

import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const MemoryWidgetCore: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
    const memoryGroups = viewModel.memoryGroups || { continueWorking: [], pinned: [] };

    return (
        <div className="memory-widget">
            <div className="memory-section">
                <h4>Continue Working</h4>
                <ul>
                    {memoryGroups.continueWorking.map((item: any) => (
                        <li key={item.id} onClick={() => onAction('RESUME_OBJECT', { objectId: item.id })}>
                            {item.title}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="memory-section">
                <h4>Pinned Objects</h4>
                <ul>
                    {memoryGroups.pinned.map((item: any) => (
                        <li key={item.id} onClick={() => onAction('OPEN_OBJECT', { objectId: item.id })}>
                            {item.title}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export const MemoryWidget = withWidgetContext(MemoryWidgetCore);
