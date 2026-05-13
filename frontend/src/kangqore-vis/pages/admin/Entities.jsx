import React, { useEffect, useState } from 'react';
import KangqoreVisAdminShell, { EmptyState } from './KangqoreVisAdminShell';

const Entities = () => {
  const [items, setItems] = useState(null);

  useEffect(() => {
    fetch('/api/admin/kangqore-vis/entities', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : { entities: [] }))
      .then((d) => setItems(d.entities ?? []))
      .catch(() => setItems([]));
  }, []);

  const seed = () => {
    fetch('/api/admin/kangqore-vis/entities/import-seed', { method: 'POST', credentials: 'include' })
      .then((r) => r.json())
      .then(() => window.location.reload());
  };

  return (
    <KangqoreVisAdminShell title="Entity Knowledge Graph" description="Departments, industries, products, company.">
      {items === null ? (
        <EmptyState title="Loading entities…" />
      ) : items.length === 0 ? (
        <EmptyState
          title="No entities yet"
          cta={
            <button onClick={seed} className="px-4 py-2 rounded-md bg-brand-blue text-white text-sm font-medium">
              Import seed entities
            </button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-[#050505] text-left">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">URL</th>
                <th className="px-4 py-2">Schema</th>
              </tr>
            </thead>
            <tbody>
              {items.map((e) => (
                <tr key={e.id} className="border-t border-gray-100">
                  <td className="px-4 py-2 font-medium">{e.name}</td>
                  <td className="px-4 py-2">{e.category}</td>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{e.url}</td>
                  <td className="px-4 py-2 text-xs">{e.schemaType ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </KangqoreVisAdminShell>
  );
};

export default Entities;
