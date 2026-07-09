// Waanda Widget
// Communication Domain (Workspace Conductor)

import React, { useState } from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const WaandaWidgetCore: React.FC<WidgetProps> = ({ viewModel, onAction, capabilities }) => {
    const suggestions = viewModel.waandaSuggestions || [];
    const [prompt, setPrompt] = useState('');

    const handleAsk = async () => {
        if (capabilities['cap.ai.plan']) {
            await capabilities['cap.ai.plan']({ prompt });
            onAction('WAANDA_PROMPT_SUBMITTED', { prompt });
            setPrompt('');
        }
    };

    return (
        <div className="waanda-widget">
            <div className="waanda-header">
                <h3>WAANDA Intelligence</h3>
                <p>How can I assist your execution today?</p>
            </div>
            
            <div className="waanda-suggestions">
                {suggestions.map((sug: any) => (
                    <div key={sug.id} className="waanda-suggestion-card">
                        <p>{sug.text}</p>
                        <div className="waanda-actions">
                            {sug.options.map((opt: any) => (
                                <button key={opt.id} onClick={() => onAction('EXECUTE_WAANDA_OPTION', { optionId: opt.id })}>
                                    ✓ {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="waanda-input">
                <input 
                    type="text" 
                    placeholder="Ask Waanda to orchestrate..." 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <button onClick={handleAsk}>Ask</button>
            </div>
        </div>
    );
};

export const WaandaWidget = withWidgetContext(WaandaWidgetCore);
