import React, { useEffect, useState } from 'react';
import KangqoreVisAdminShell, { EmptyState } from './KangqoreVisAdminShell';

const FaqBank = () => {
  const [items, setItems] = useState(null);

  useEffect(() => {
    fetch('/api/kangqore-vis/answerability/faqs')
      .then((r) => (r.ok ? r.json() : { faqs: [] }))
      .then((d) => setItems(d.faqs ?? []))
      .catch(() => setItems([]));
  }, []);

  const importKb = () => {
    fetch('/api/kangqore-vis/answerability/faqs/import-kb', { method: 'POST', credentials: 'include' })
      .then((r) => r.json())
      .then(() => window.location.reload());
  };

  return (
    <KangqoreVisAdminShell
      title="FAQ Bank"
      description="Central FAQ store. Powers FAQPage schema and AI Concierge fallbacks."
    >
      {items === null ? (
        <EmptyState title="Loading FAQs…" />
      ) : items.length === 0 ? (
        <EmptyState
          title="No FAQs yet"
          cta={
            <button onClick={importKb} className="px-4 py-2 rounded-md bg-brand-blue text-white text-sm font-medium">
              Import from knowledge base
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {items.map((f) => (
            <details key={f.id} className="rounded-md border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 p-3">
              <summary className="cursor-pointer font-medium">{f.question}</summary>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{f.answer}</p>
              <div className="mt-2 text-xs text-gray-400">source: {f.source}</div>
            </details>
          ))}
        </div>
      )}
    </KangqoreVisAdminShell>
  );
};

export default FaqBank;
