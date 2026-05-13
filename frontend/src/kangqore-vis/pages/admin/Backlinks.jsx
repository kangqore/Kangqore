import React, { useEffect, useState } from 'react';
import KangqoreVisAdminShell, { EmptyState } from './KangqoreVisAdminShell';

const Backlinks = () => {
  const [items, setItems] = useState(null);

  useEffect(() => {
    fetch('/api/admin/kangqore-vis/authority/backlinks', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : { backlinks: [] }))
      .then((d) => setItems(d.backlinks ?? []))
      .catch(() => setItems([]));
  }, []);

  return (
    <KangqoreVisAdminShell
      title="Backlinks"
      description="Inbound links to Kangqore. Powered by Ahrefs/Semrush adapters once configured."
    >
      {items === null ? (
        <EmptyState title="Loading backlinks…" />
      ) : items.length === 0 ? (
        <EmptyState
          title="No backlinks tracked yet"
          hint="Connect Ahrefs or Semrush in Sources, or add manually via POST /api/admin/kangqore-vis/authority/backlinks."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-[#050505] text-left">
              <tr>
                <th className="px-4 py-2">Source</th>
                <th className="px-4 py-2">Target</th>
                <th className="px-4 py-2">DR</th>
                <th className="px-4 py-2">Last seen</th>
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b.id} className="border-t border-gray-100">
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{b.sourceUrl}</td>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{b.targetUrl}</td>
                  <td className="px-4 py-2">{b.domainRating ?? '—'}</td>
                  <td className="px-4 py-2 text-xs">
                    {b.lastSeenAt ? new Date(b.lastSeenAt).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </KangqoreVisAdminShell>
  );
};

export default Backlinks;
