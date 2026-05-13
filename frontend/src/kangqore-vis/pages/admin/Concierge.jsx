import React, { useEffect, useState } from 'react';
import KangqoreVisAdminShell, { EmptyState } from './KangqoreVisAdminShell';

const Concierge = () => {
  const [questions, setQuestions] = useState(null);

  useEffect(() => {
    fetch('/api/admin/kangqore-vis/concierge/unanswered', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : { questions: [] }))
      .then((d) => setQuestions(d.questions ?? []))
      .catch(() => setQuestions([]));
  }, []);

  const convert = (question) => {
    fetch('/api/admin/kangqore-vis/concierge/convert', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    })
      .then((r) => r.json())
      .then((d) => alert(`Created blueprint stub at ${d.url}`));
  };

  return (
    <KangqoreVisAdminShell
      title="Concierge → Content"
      description="Top unanswered Concierge questions. Convert to draft blueprints to feed the editorial backlog."
    >
      {questions === null ? (
        <EmptyState title="Loading…" />
      ) : questions.length === 0 ? (
        <EmptyState
          title="No unanswered Concierge questions yet"
          hint="As visitors interact with the AI Concierge and rate responses, gaps surface here."
        />
      ) : (
        <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
          {questions.map((q, idx) => (
            <li key={idx} className="p-4 flex items-start gap-3">
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">{q.question}</div>
                <div className="text-xs text-gray-500 mt-1">
                  asked {q.conversationCount}× · last on {new Date(q.lastAskedAt).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={() => convert(q.question)}
                className="px-3 py-1.5 rounded-md bg-brand-blue text-white text-xs font-medium"
              >
                Convert to blueprint
              </button>
            </li>
          ))}
        </ul>
      )}
    </KangqoreVisAdminShell>
  );
};

export default Concierge;
