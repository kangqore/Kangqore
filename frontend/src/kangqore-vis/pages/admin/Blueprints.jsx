import React, { useEffect, useState } from 'react';
import KangqoreVisAdminShell, { EmptyState } from './KangqoreVisAdminShell';

const Blueprints = () => {
  const [items, setItems] = useState(null);

  useEffect(() => {
    fetch('/api/admin/kangqore-vis/blueprints', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : { blueprints: [] }))
      .then((d) => setItems(d.blueprints ?? []))
      .catch(() => setItems([]));
  }, []);

  const seed = () => {
    fetch('/api/admin/kangqore-vis/blueprints/import-seed', { method: 'POST', credentials: 'include' })
      .then((r) => r.json())
      .then(() => window.location.reload());
  };

  return (
    <KangqoreVisAdminShell
      title="Page Blueprints"
      description="19-field map for every page. Required before publishing."
    >
      {items === null ? (
        <EmptyState title="Loading blueprints…" />
      ) : items.length === 0 ? (
        <EmptyState
          title="No blueprints yet"
          hint="Run the seed importer to bootstrap from the existing seoData.js registry."
          cta={
            <button
              onClick={seed}
              className="px-4 py-2 rounded-md bg-brand-blue text-white text-sm font-medium"
            >
              Import seed blueprints
            </button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-[#050505] text-left">
              <tr>
                <th className="px-4 py-2">Page</th>
                <th className="px-4 py-2">URL</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">CTA</th>
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b.id} className="border-t border-gray-100">
                  <td className="px-4 py-2 font-medium">{b.pageName}</td>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{b.url}</td>
                  <td className="px-4 py-2">{b.pageType}</td>
                  <td className="px-4 py-2">{b.status}</td>
                  <td className="px-4 py-2 text-xs">{b.ctaKind}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </KangqoreVisAdminShell>
  );
};

export default Blueprints;
