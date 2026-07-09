// Knowledge Widget
// Intelligence Domain

import React, { useState } from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const KnowledgeWidgetCore: React.FC<WidgetProps> = ({ viewModel, onAction, capabilities }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any>(null);

    const handleSearch = async () => {
        if (capabilities['cap.knowledge.search']) {
            const data = await capabilities['cap.knowledge.search']({ query });
            setResults(data);
            onAction('KNOWLEDGE_SEARCHED', { query });
        }
    };

    return (
        <div className="knowledge-widget">
            <div className="search-bar">
                <input 
                    type="text" 
                    placeholder="Search the ontology..." 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            
            {results && (
                <div className="search-results">
                    <div className="result-group">
                        <h4>Missions</h4>
                        {results.missions?.map((m: any) => <div key={m.id}>{m.title}</div>)}
                    </div>
                    <div className="result-group">
                        <h4>People</h4>
                        {results.people?.map((p: any) => <div key={p.id}>{p.name}</div>)}
                    </div>
                </div>
            )}
        </div>
    );
};

export const KnowledgeWidget = withWidgetContext(KnowledgeWidgetCore);
