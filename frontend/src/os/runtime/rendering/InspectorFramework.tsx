// Inspector Framework
// Generation III Runtime

import React from 'react';
import { WidgetRuntime } from './WidgetRuntime';

interface InspectorProps {
    viewModel: any;
    type: 'OBJECT' | 'MISSION';
}

/**
 * Universal Inspector Framework.
 * Renders solely from ViewModels, decoupled from backend schemas.
 */
export const InspectorFramework: React.FC<InspectorProps> = ({ viewModel, type }) => {
    return (
        <div className={`inspector-panel type-${type.toLowerCase()}`}>
            <header className="inspector-header">
                <h2>{viewModel.displayTitle}</h2>
                <div className="inspector-meta">
                    <span className="badge">{viewModel.status}</span>
                    <span className="badge">Lens: {viewModel.lensApplied}</span>
                </div>
            </header>
            
            <div className="inspector-content">
                {/* 
                  Instead of hardcoded UI, the inspector delegates to the Widget Runtime 
                  to render the specific insights, metrics, and actions for this ViewModel. 
                */}
                <WidgetRuntime 
                    widgets={viewModel.widgets || []} 
                    context={{ viewModelId: viewModel.id }}
                    policyAdapter={null as any} // injected via context in reality
                />
            </div>
        </div>
    );
};
