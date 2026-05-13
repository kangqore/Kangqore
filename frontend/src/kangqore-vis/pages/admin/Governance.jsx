import React, { useEffect, useState } from 'react';
import KangqoreVisAdminShell, { EmptyState } from './KangqoreVisAdminShell';

const Governance = () => {
  const [audits, setAudits] = useState(null);

  useEffect(() => {
    fetch('/api/admin/kangqore-vis/governance/audit-log', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : { entries: [] }))
      .then((d) => setAudits(d.entries ?? []))
      .catch(() => setAudits([]));
  }, []);

  return (
    <KangqoreVisAdminShell
      title="Governance"
      description="14-point publish checklist + audit log. Failures here block publishing."
    >
      {audits === null ? (
        <EmptyState title="Loading audit log…" />
      ) : audits.length === 0 ? (
        <EmptyState
          title="Audit log is empty"
          hint="Audits accumulate as you publish blueprints and as the schema-content auditor runs."
        />
      ) : (
        <div className="space-y-2">
          {audits.map((a) => (
            <div
              key={a.id}
              className={`rounded-md border p-3 text-sm ${
                a.severity === 'ERROR' ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wide text-gray-500">{a.kind}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    a.severity === 'ERROR'
                      ? 'bg-red-100 text-red-700'
                      : a.severity === 'WARN'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 dark:bg-[#0a0a0c] text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {a.severity}
                </span>
              </div>
              <div className="mt-1 text-gray-900 dark:text-white">{a.message}</div>
            </div>
          ))}
        </div>
      )}
    </KangqoreVisAdminShell>
  );
};

export default Governance;
