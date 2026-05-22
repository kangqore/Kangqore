// ---------------------------------------------------------------------------
// KIMMP Page Factory — Admin authoring UI (PR-A2)
//
// Create / list / preview / publish generated pages. Calls the PR-A1 backend.
// Pages are DRAFT until an admin publishes — KIMMP never auto-publishes.
// ---------------------------------------------------------------------------

import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Plus, Eye, RefreshCw } from 'lucide-react';
import {
  listPages,
  createPage,
  publishPage,
  unpublishPage,
  getPageMeta,
} from '../../services/kimmpPageService';

const STARTER_CONTENT = JSON.stringify(
  {
    hero: {
      eyebrow: 'AI Governance',
      headline: 'Page headline goes here',
      subheadline: 'One supporting sentence describing the offering.',
    },
    sections: [
      { type: 'problem', heading: 'The problem', body: 'Describe the problem...' },
      { type: 'capabilities', heading: 'What Kangqore does', items: ['One', 'Two', 'Three'] },
      { type: 'cta', heading: 'Work with Kangqore', buttonLabel: 'Book a Call' },
    ],
    seo: { title: 'Page Title | Kangqore', description: 'Meta description for search.' },
    schema: ['Service'],
    internalLinks: ['/services'],
  },
  null,
  2
);

const STATUS_STYLES = {
  PUBLISHED: 'bg-emerald-900 text-emerald-300 border-emerald-700',
  DRAFT: 'bg-slate-800 text-slate-300 border-slate-600',
  ARCHIVED: 'bg-slate-800 text-slate-500 border-slate-700',
};

export default function KimmpPagesPage() {
  const [pages, setPages] = useState([]);
  const [meta, setMeta] = useState({ pageTypes: ['solution'], statuses: [] });
  const [form, setForm] = useState({
    slug: '',
    pageType: 'solution',
    title: '',
    department: '',
    content: STARTER_CONTENT,
  });
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const data = await listPages();
      setPages(data.pages || []);
    } catch (e) {
      setMsg({
        type: 'error',
        text:
          'Could not load pages. Has the kimmp_generated_pages migration been applied (prisma migrate deploy)?',
      });
    }
  }, []);

  useEffect(() => {
    getPageMeta()
      .then((m) => setMeta(m))
      .catch(() => {});
    refresh();
  }, [refresh]);

  const handleCreate = async () => {
    setMsg(null);
    let content;
    try {
      content = JSON.parse(form.content);
    } catch {
      setMsg({ type: 'error', text: 'Content is not valid JSON.' });
      return;
    }
    if (!form.slug.trim() || !form.title.trim()) {
      setMsg({ type: 'error', text: 'Slug and title are required.' });
      return;
    }
    setBusy(true);
    try {
      await createPage({
        slug: form.slug.trim(),
        pageType: form.pageType,
        title: form.title.trim(),
        department: form.department.trim() || undefined,
        content,
      });
      setMsg({ type: 'success', text: 'Draft page created.' });
      setForm((f) => ({ ...f, slug: '', title: '', department: '' }));
      refresh();
    } catch (e) {
      setMsg({ type: 'error', text: e?.response?.data?.error || 'Create failed.' });
    } finally {
      setBusy(false);
    }
  };

  const togglePublish = async (page) => {
    setBusy(true);
    setMsg(null);
    try {
      if (page.status === 'PUBLISHED') await unpublishPage(page.id);
      else await publishPage(page.id);
      refresh();
    } catch (e) {
      setMsg({ type: 'error', text: 'Publish action failed.' });
    } finally {
      setBusy(false);
    }
  };

  const field =
    'w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-600';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <FileText className="text-emerald-500" size={26} />
            <h1 className="text-2xl font-bold">KIMMP Page Factory</h1>
          </div>
          <button
            onClick={refresh}
            className="p-2 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
        </div>
        <p className="text-slate-400 text-sm mb-8">
          Create Kangqore-branded pages as structured data. Pages are <strong>DRAFT</strong>{' '}
          until you publish them — nothing goes live automatically.
        </p>

        {msg && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg text-sm border ${
              msg.type === 'error'
                ? 'bg-red-950 border-red-800 text-red-300'
                : 'bg-emerald-950 border-emerald-800 text-emerald-300'
            }`}
          >
            {msg.text}
          </div>
        )}

        {/* Create panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-10">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Plus size={18} className="text-emerald-500" /> New page
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Slug</label>
              <input
                className={field}
                placeholder="solutions/ai-agent-permission-architecture"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Title</label>
              <input
                className={field}
                placeholder="AI Agent Permission Architecture"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Page type</label>
              <select
                className={field}
                value={form.pageType}
                onChange={(e) => setForm((f) => ({ ...f, pageType: e.target.value }))}
              >
                {(meta.pageTypes || []).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Department (optional)</label>
              <input
                className={field}
                placeholder="AI & Cognitive Solutions"
                value={form.department}
                onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
              />
            </div>
          </div>
          <label className="block text-xs text-slate-400 mb-1">Content (JSON)</label>
          <textarea
            className={`${field} font-mono text-xs h-72`}
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            spellCheck={false}
          />
          <div className="mt-4">
            <button
              onClick={handleCreate}
              disabled={busy}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
            >
              {busy ? 'Working…' : 'Create draft page'}
            </button>
          </div>
        </div>

        {/* Pages list */}
        <h2 className="font-semibold mb-4">Pages ({pages.length})</h2>
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          {pages.length === 0 ? (
            <p className="text-slate-500 text-sm px-6 py-8 text-center">No pages yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-800">
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-5 py-3 font-medium">Slug</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr key={page.id} className="border-b border-slate-800 last:border-0">
                    <td className="px-5 py-3 font-medium">{page.title}</td>
                    <td className="px-5 py-3 text-slate-400 font-mono text-xs">{page.route}</td>
                    <td className="px-5 py-3 text-slate-400">{page.pageType}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-xs border ${
                          STATUS_STYLES[page.status] || STATUS_STYLES.DRAFT
                        }`}
                      >
                        {page.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {page.status === 'PUBLISHED' && (
                          <a
                            href={page.route}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 bg-slate-800 border border-slate-700 rounded hover:bg-slate-700 transition-colors"
                            title="View live page"
                          >
                            <Eye size={14} />
                          </a>
                        )}
                        <button
                          onClick={() => togglePublish(page)}
                          disabled={busy}
                          className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors disabled:opacity-50 ${
                            page.status === 'PUBLISHED'
                              ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
                              : 'bg-emerald-600 text-white hover:bg-emerald-500'
                          }`}
                        >
                          {page.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
