// People Widget
// Core Enterprise Widget

import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const PeopleWidgetCore: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
    const stakeholders = viewModel.stakeholders || [];

    return (
        <div className="people-widget">
            <h3>Key Stakeholders</h3>
            <ul className="people-list">
                {stakeholders.map((person: any) => (
                    <li key={person.id} className="person-card">
                        <div className="person-avatar">{person.initials}</div>
                        <div className="person-info">
                            <span className="person-name">{person.name}</span>
                            <span className="person-role">{person.role}</span>
                        </div>
                        <button onClick={() => onAction('INITIATE_COMMUNICATION', { personId: person.id })}>
                            Message
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export const PeopleWidget = withWidgetContext(PeopleWidgetCore);
