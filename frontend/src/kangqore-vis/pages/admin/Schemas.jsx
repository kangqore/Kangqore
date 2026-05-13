import React, { useEffect, useState } from 'react';
import KangqoreVisAdminShell, { EmptyState } from './KangqoreVisAdminShell';

const Schemas = () => {
  const [registry, setRegistry] = useState(null);
  const [audit, setAudit] = useState(null);

  useEffect(() => {
    fetch('/api/admin/kangqore-vis/structured-data/registry', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then(setRegistry);
  }, []);

  const runAudit = () => {
    fetch('/api/admin/kangqore-vis/structured-data/audit', { method: 'POST', credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setAudit(d.results));
  };

  return (
    <KangqoreVisAdminShell
      title="Structured Data"
      description="JSON-LD generators and content-match audit."
    >
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 p-4">
          <div className="text-sm font-medium mb-2">Available schema kinds</div>
          {registry ? (
            <ul className="text-sm text-gray-700 dark:text-gray-300 grid grid-cols-2 gap-1">
              {registry.kinds.map((k) => <li key={k}>{k}</li>)}
            </ul>
          ) : (
            <div className="text-sm text-gray-400">Loading…</div>
          )}
        </div>
        <div className="rounded-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 p-4">
          <div className="text-sm font-medium mb-2">Schema-content audit</div>
          <p className="text-xs text-gray-500 mb-3">
            Validates that every declared schema has visible matching content (e.g. FAQPage requires a visible FAQ block).
          </p>
          <button
            onClick={runAudit}
            className="px-3 py-1.5 rounded-md bg-brand-blue text-white text-xs font-medium"
          >
            Run audit
          </button>
          {audit ? (
            <ul className="mt-3 text-xs text-gray-700 dark:text-gray-300 space-y-1">
              {audit.length === 0 ? (
                <li className="text-gray-400">No findings.</li>
              ) : (
                audit.map((r, i) => (
                  <li key={i}>
                    {r.passed ? '✓' : '✗'} {r.url} — {r.schemaKind} {r.reason ? `— ${r.reason}` : ''}
                  </li>
                ))
              )}
            </ul>
          ) : null}
        </div>
      </div>
    </KangqoreVisAdminShell>
  );
};

export default Schemas;
