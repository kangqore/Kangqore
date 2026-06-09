import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Circle,
  Lock,
  RefreshCw,
  Save,
  Sparkles,
  X,
  CheckCheck,
  AlertTriangle,
  Zap,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL || '';

const ConciergeKnowledge = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reindexing, setReindexing] = useState(false);
  const [editing, setEditing] = useState(null);
  const [embeddingProbe, setEmbeddingProbe] = useState(null);
  const [probing, setProbing] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/concierge/knowledge`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const reindex = async () => {
    setReindexing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/concierge/knowledge/reindex`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setReindexing(false);
    }
  };

  const probeEmbeddings = async () => {
    setProbing(true);
    setEmbeddingProbe(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/concierge/embedding-check`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setEmbeddingProbe(json);
    } catch (e) {
      setEmbeddingProbe({ ok: false, error: e.message });
    } finally {
      setProbing(false);
    }
  };

  const openEditor = async (chunk) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/concierge/knowledge/${encodeURIComponent(chunk.id)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const full = await res.json();
      setEditing({
        id: full.id,
        sourceFile: full.sourceFile,
        title: full.title,
        body: full.body,
        tags: (full.tags || []).join(', '),
        populated: full.populated,
        saving: false,
      });
    } catch (e) {
      setError(e.message);
    }
  };

  const save = async () => {
    if (!editing) return;
    setEditing({ ...editing, saving: true });
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/concierge/knowledge/${encodeURIComponent(editing.id)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editing.title,
          body: editing.body,
          tags: editing.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          populated: editing.populated,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setEditing(null);
      await load();
    } catch (e) {
      setError(e.message);
      setEditing({ ...editing, saving: false });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link
              to="/dashboard/admin"
              className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-3 h-3" /> Back to Admin
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-cyan" /> eQORE Knowledge Base
            </h1>
            {data && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {data.chunks.length} chunks across {data.parents.length} files
                {data.embeddingsConfigured
                  ? ` · embeddings active (${data.embeddingModel})`
                  : ' · in-prompt fallback (VOYAGE_API_KEY not configured)'}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard/admin/concierge/analytics"
              className="text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-2 rounded-lg"
            >
              ← Analytics
            </Link>
            <button
              type="button"
              onClick={reindex}
              disabled={reindexing}
              className="text-xs bg-brand-blue text-white px-3 py-2 rounded-lg flex items-center gap-1 disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${reindexing ? 'animate-spin' : ''}`} /> Re-index
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 p-3 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {data && (
          <div
            className={`mb-4 rounded-xl border p-4 ${
              data.embeddingsConfigured
                ? 'border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/5'
                : 'border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/5'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  data.embeddingsConfigured
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                }`}
              >
                {data.embeddingsConfigured ? (
                  <Zap className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-semibold ${
                    data.embeddingsConfigured
                      ? 'text-emerald-700 dark:text-emerald-300'
                      : 'text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {data.embeddingsConfigured
                    ? `Retrieval active — ${data.embeddingModel}`
                    : 'Retrieval not configured (in-prompt fallback)'}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {data.embeddingsConfigured
                    ? `${data.indexState.chunks} chunks embedded. Each turn retrieves the most relevant chunks instead of stuffing the full KB.`
                    : 'Set VOYAGE_API_KEY in backend/.env, then click Re-index to enable retrieval. Without it, every turn ships the full KB in the prompt — fine for now (14 chunks) but blows the cache budget past ~30 chunks.'}
                </p>
                {embeddingProbe && (
                  <div
                    className={`mt-2 text-[11px] font-mono ${
                      embeddingProbe.ok
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {embeddingProbe.ok
                      ? `✓ Voyage reachable · ${embeddingProbe.model} · ${embeddingProbe.dim}-dim · ${embeddingProbe.latencyMs}ms`
                      : `✗ ${embeddingProbe.error || embeddingProbe.message}`}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={probeEmbeddings}
                disabled={probing}
                className="text-xs px-3 py-2 rounded-lg bg-white dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/[0.10] disabled:opacity-50 inline-flex items-center gap-1"
              >
                <CheckCheck className={`w-3 h-3 ${probing ? 'animate-pulse' : ''}`} />
                {probing ? 'Testing…' : 'Test Voyage'}
              </button>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d0d10] overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 dark:bg-white/[0.02]">
              <tr className="text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">
                <th className="text-left font-bold px-3 py-2 w-8">·</th>
                <th className="text-left font-bold px-3 py-2">Title</th>
                <th className="text-left font-bold px-3 py-2">File</th>
                <th className="text-left font-bold px-3 py-2 w-20">Length</th>
                <th className="text-left font-bold px-3 py-2 w-24">Embedded</th>
                <th className="text-right font-bold px-3 py-2 w-20">Edit</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-slate-400">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading &&
                data?.chunks.map((c) => (
                  <tr
                    key={c.id}
                    className="border-t border-slate-100 dark:border-white/5"
                  >
                    <td className="px-3 py-2">
                      {c.internal ? (
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                      ) : c.populated ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {c.title}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {c.bodyPreview.slice(0, 120)}
                        {c.bodyLength > 120 ? '…' : ''}
                      </div>
                    </td>
                    <td className="px-3 py-2 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                      {c.sourceFile}
                    </td>
                    <td className="px-3 py-2 text-slate-500 dark:text-slate-400">
                      {c.bodyLength.toLocaleString()} ch
                    </td>
                    <td className="px-3 py-2">
                      {c.embedded ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                          <Sparkles className="w-3 h-3" /> Yes
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        disabled={c.internal}
                        onClick={() => openEditor(c)}
                        className="text-xs font-semibold text-brand-blue dark:text-brand-cyan hover:underline disabled:opacity-30 disabled:no-underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {!loading && data && (
          <p className="mt-3 text-[10px] text-slate-500 dark:text-slate-400">
            Edits update the database row + re-embed (if Voyage configured) + write to AuditLog.
            Markdown files in <code>backend/knowledge-base/</code> remain the source of truth — re-running
            the server reloads them and overwrites edits unless you also commit the file change.
          </p>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-[#0d0d10] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {editing.id} · {editing.sourceFile}
                </p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Edit chunk
                </p>
              </div>
              <button
                onClick={() => setEditing(null)}
                disabled={editing.saving}
                className="p-1 text-slate-400 hover:text-slate-900 dark:text-white dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Title
                </label>
                <input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="mt-1 w-full px-3 py-2 rounded-lg text-sm bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Body (markdown)
                </label>
                <textarea
                  value={editing.body}
                  onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                  rows={14}
                  className="mt-1 w-full px-3 py-2 rounded-lg text-xs font-mono bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Tags (comma separated)
                  </label>
                  <input
                    value={editing.tags}
                    onChange={(e) => setEditing({ ...editing, tags: e.target.value })}
                    className="mt-1 w-full px-3 py-2 rounded-lg text-sm bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Published
                  </label>
                  <select
                    value={editing.populated ? 'yes' : 'no'}
                    onChange={(e) => setEditing({ ...editing, populated: e.target.value === 'yes' })}
                    className="mt-1 w-full px-3 py-2 rounded-lg text-sm bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  >
                    <option value="yes">Yes — visible to AI</option>
                    <option value="no">No — hidden / draft</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                disabled={editing.saving}
                className="text-xs px-3 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={editing.saving}
                className="text-xs bg-brand-blue text-white px-3 py-2 rounded-lg flex items-center gap-1 disabled:opacity-50"
              >
                <Save className="w-3 h-3" /> {editing.saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConciergeKnowledge;
